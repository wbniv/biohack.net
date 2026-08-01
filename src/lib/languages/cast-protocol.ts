/**
 * Language-neutral Cast protocol for the flashcard receiver.
 *
 * Plan: ~/spanish/docs/plans/2026-08-01-thai-flashcards-google-cast.md
 *
 * Shared by the phone sender and the TV receiver. Pure types plus runtime
 * validation — no DOM, no Cast SDK, so Phase 1 (browser-only simulator) and
 * Phase 2 (real receiver) run every message through exactly the same checks.
 *
 * Naming is language-neutral per plan decision 7: nothing here is scoped to
 * `th`, so Spanish reuses the same namespace and receiver registration.
 */

/** Custom Cast namespace. Never `urn:x-cast:com.google.cast.media` — that is reserved. */
export const CAST_NAMESPACE = 'urn:x-cast:net.biohack.languages.flashcards.v1';

/** Wire protocol version. A receiver refuses anything else. */
export const CAST_PROTOCOL_VERSION = 1;

/* ------------------------------------------------------------------ *
 * Card payloads
 * ------------------------------------------------------------------ */

export type CardDirection = 'produce' | 'recognize' | 'listen';

export type ToneContour = 'mid' | 'low' | 'falling' | 'high' | 'rising';

export type VowelLength = 'short' | 'long';

/** Where in the mouth the syllable's leading articulation happens. */
export type ArticulationPlace =
  | 'lips'
  | 'teeth'
  | 'alveolar'
  | 'palate'
  | 'velar'
  | 'glottal';

export type ArticulationAirflow = 'stop' | 'continuant' | 'nasal';

export type ArticulationSyllable = {
  /** Short romanized/label text for the syllable. TV-readable, never fine print. */
  label?: string;
  tone: ToneContour;
  length: VowelLength;
  place: ArticulationPlace;
  airflow?: ArticulationAirflow;
};

/**
 * Everything the mouth/airflow drawing and the tone+length panel need,
 * as data rather than markup. The phone renders it small, the TV large.
 */
export type ArticulationView = {
  /** One TV-readable sentence of coaching. */
  caption: string;
  syllables: ArticulationSyllable[];
};

export type CastCardPrompt = {
  id: string;
  direction: CardDirection;
  /** For "listen" cards this is a cue label, never the target-language script. */
  prompt: string;
  coach: string;
  /** Omitted pre-reveal when the articulation drawing would identify the answer. */
  articulation?: ArticulationView;
  audio?: { normal: string; slow?: string };
};

/**
 * Field names are language-neutral per plan decision 7 — Spanish reuses this
 * payload unchanged. (The plan's protocol section originally wrote `thai` /
 * `english`; that was an error, corrected before anything shipped.)
 */
export type CastCardAnswer = {
  /** Target-language script — the Thai or Spanish headword. */
  headword: string;
  /** Base-language gloss. */
  translation: string;
  usage?: string;
  articulation: ArticulationView;
};

export type CastSummary = {
  reviewed: number;
  good: number;
  again: number;
  /** Human-readable, e.g. "Next card due in 3h." Never raw scheduling state. */
  nextDue?: string;
};

/* ------------------------------------------------------------------ *
 * Messages
 * ------------------------------------------------------------------ */

export type SenderMessage =
  | { type: 'HELLO'; protocol: 1; sessionId: string }
  // `answer` is present only when re-syncing into an already-revealed state
  | { type: 'SHOW_CARD'; seq: number; card: CastCardPrompt; answer?: CastCardAnswer }
  | { type: 'REVEAL'; seq: number; cardId: string; answer: CastCardAnswer }
  | { type: 'PLAY_AUDIO'; seq: number; audioUrl: string; rate: 0.8 | 1 }
  | { type: 'SETTINGS'; seq: number; reducedMotion: boolean }
  | { type: 'SESSION_END'; seq: number; summary: CastSummary };

export type ReceiverMessage =
  | { type: 'READY'; protocol: 1 }
  // sent after launch or reconnect; the sender answers with a full SHOW_CARD snapshot
  | { type: 'RESYNC' }
  | { type: 'ACK'; seq: number }
  | { type: 'AUDIO_STATE'; seq: number; state: 'playing' | 'ended' | 'error' }
  | { type: 'ERROR'; seq?: number; code: string; message: string };

export const SENDER_MESSAGE_TYPES = [
  'HELLO',
  'SHOW_CARD',
  'REVEAL',
  'PLAY_AUDIO',
  'SETTINGS',
  'SESSION_END',
] as const;

/* ------------------------------------------------------------------ *
 * Validation
 * ------------------------------------------------------------------ */

export type RejectCode =
  | 'BAD_JSON'
  | 'BAD_SHAPE'
  | 'BAD_PROTOCOL'
  | 'BAD_TYPE'
  | 'BAD_SEQ'
  | 'STALE_SEQ'
  | 'BAD_CARD_ID'
  | 'CARD_MISMATCH'
  | 'ANSWER_LEAK'
  | 'BAD_AUDIO_URL';

export type ValidationResult =
  | { ok: true; message: SenderMessage }
  | { ok: false; code: RejectCode; reason: string };

/** Card ids are opaque but bounded: `biohack:th-en:number:00027`. */
export const CARD_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9:._-]{0,127}$/;

/**
 * Only site-hosted audio under a language's audio directory is playable.
 * Language segment is a generic ISO code so Spanish needs no protocol change.
 */
export const AUDIO_PATH_PATTERN =
  /^\/languages\/[a-z]{2,3}\/audio\/[A-Za-z0-9._-]{1,120}\.(mp3|m4a|ogg|wav)$/;

/** Answer-bearing keys must never appear on a pre-reveal prompt payload. */
const ANSWER_KEYS = ['headword', 'translation', 'usage', 'answer'];

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === 'string' && v.trim().length > 0;

const TONES: ToneContour[] = ['mid', 'low', 'falling', 'high', 'rising'];
const PLACES: ArticulationPlace[] = [
  'lips',
  'teeth',
  'alveolar',
  'palate',
  'velar',
  'glottal',
];

/**
 * Resolve an audio reference to a safe same-origin path, or `null`.
 *
 * Accepts a root-relative path under the audio directory, or an absolute URL
 * that is HTTPS **and** same-origin **and** whose path matches. Anything else
 * — other hosts, `http:`, `data:`, `javascript:`, path traversal — is refused.
 */
export function safeAudioPath(raw: unknown, origin?: string): string | null {
  if (typeof raw !== 'string' || raw.length === 0 || raw.length > 300) return null;
  if (raw.includes('..')) return null;
  if (raw.startsWith('/')) return AUDIO_PATH_PATTERN.test(raw) ? raw : null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:') return null;
  if (origin && url.origin !== origin) return null;
  if (url.search || url.hash) return null;
  return AUDIO_PATH_PATTERN.test(url.pathname) ? url.pathname : null;
}

function checkArticulation(v: unknown): string | null {
  if (!isObject(v)) return 'articulation must be an object';
  if (!isNonEmptyString(v.caption)) return 'articulation.caption must be a string';
  if (v.caption.length > 400) return 'articulation.caption too long';
  if (!Array.isArray(v.syllables) || v.syllables.length === 0) {
    return 'articulation.syllables must be a non-empty array';
  }
  if (v.syllables.length > 12) return 'articulation.syllables too long';
  for (const s of v.syllables) {
    if (!isObject(s)) return 'syllable must be an object';
    if (!TONES.includes(s.tone as ToneContour)) return `unknown tone ${String(s.tone)}`;
    if (s.length !== 'short' && s.length !== 'long') {
      return `unknown vowel length ${String(s.length)}`;
    }
    if (!PLACES.includes(s.place as ArticulationPlace)) {
      return `unknown place ${String(s.place)}`;
    }
    if (s.label !== undefined && typeof s.label !== 'string') {
      return 'syllable.label must be a string';
    }
    if (
      s.airflow !== undefined &&
      !['stop', 'continuant', 'nasal'].includes(s.airflow as string)
    ) {
      return `unknown airflow ${String(s.airflow)}`;
    }
  }
  return null;
}

function checkAnswer(v: unknown): string | null {
  if (!isObject(v)) return 'answer must be an object';
  if (!isNonEmptyString(v.headword)) return 'answer.headword must be a string';
  if (!isNonEmptyString(v.translation)) return 'answer.translation must be a string';
  if (v.usage !== undefined && typeof v.usage !== 'string') {
    return 'answer.usage must be a string';
  }
  return checkArticulation(v.articulation);
}

/**
 * Stateful validator: one instance per receiver session.
 *
 * Holds the last accepted sequence number and the current card id, which is
 * what makes stale/duplicate rejection and REVEAL-for-the-wrong-card rejection
 * possible. The receiver never mutates its own state except through this.
 */
export class CastMessageValidator {
  lastSeq = 0;
  currentCardId: string | null = null;
  sessionId: string | null = null;
  readonly origin: string | undefined;

  constructor(origin?: string) {
    this.origin = origin;
  }

  reset(): void {
    this.lastSeq = 0;
    this.currentCardId = null;
    this.sessionId = null;
  }

  private reject(code: RejectCode, reason: string): ValidationResult {
    return { ok: false, code, reason };
  }

  /** Accept a raw payload (parsed object or JSON string) as a SenderMessage. */
  validate(raw: unknown): ValidationResult {
    let value = raw;
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch {
        return this.reject('BAD_JSON', 'payload is not valid JSON');
      }
    }
    if (!isObject(value)) return this.reject('BAD_SHAPE', 'payload is not an object');

    const type = value.type;
    if (typeof type !== 'string') return this.reject('BAD_TYPE', 'missing type');
    if (!(SENDER_MESSAGE_TYPES as readonly string[]).includes(type)) {
      return this.reject('BAD_TYPE', `unsupported message type ${type}`);
    }

    if (type === 'HELLO') {
      if (value.protocol !== CAST_PROTOCOL_VERSION) {
        return this.reject(
          'BAD_PROTOCOL',
          `protocol ${String(value.protocol)} != ${CAST_PROTOCOL_VERSION}`,
        );
      }
      if (!isNonEmptyString(value.sessionId)) {
        return this.reject('BAD_SHAPE', 'HELLO.sessionId must be a string');
      }
      this.sessionId = value.sessionId;
      return { ok: true, message: { type: 'HELLO', protocol: 1, sessionId: value.sessionId } };
    }

    // Every non-HELLO message carries a monotonically increasing seq.
    const seq = value.seq;
    if (typeof seq !== 'number' || !Number.isInteger(seq) || seq <= 0) {
      return this.reject('BAD_SEQ', `seq must be a positive integer, got ${String(seq)}`);
    }
    if (seq <= this.lastSeq) {
      return this.reject(
        'STALE_SEQ',
        `seq ${seq} is not newer than last accepted ${this.lastSeq}`,
      );
    }

    switch (type) {
      case 'SHOW_CARD': {
        const card = value.card;
        if (!isObject(card)) return this.reject('BAD_SHAPE', 'SHOW_CARD.card must be an object');
        if (typeof card.id !== 'string' || !CARD_ID_PATTERN.test(card.id)) {
          return this.reject('BAD_CARD_ID', `invalid card id ${String(card.id)}`);
        }
        if (!['produce', 'recognize', 'listen'].includes(card.direction as string)) {
          return this.reject('BAD_SHAPE', `unknown direction ${String(card.direction)}`);
        }
        if (!isNonEmptyString(card.prompt)) {
          return this.reject('BAD_SHAPE', 'card.prompt must be a string');
        }
        if (typeof card.coach !== 'string') {
          return this.reject('BAD_SHAPE', 'card.coach must be a string');
        }
        // The prompt half must be answer-free even when a revealed snapshot
        // ships alongside it: a rendering bug then cannot leak the answer.
        for (const key of ANSWER_KEYS) {
          if (key in card) {
            return this.reject('ANSWER_LEAK', `card must not carry answer field "${key}"`);
          }
        }
        if (card.articulation !== undefined) {
          const err = checkArticulation(card.articulation);
          if (err) return this.reject('BAD_SHAPE', err);
        }
        const audio = card.audio;
        if (audio !== undefined) {
          if (!isObject(audio)) return this.reject('BAD_SHAPE', 'card.audio must be an object');
          if (!safeAudioPath(audio.normal, this.origin)) {
            return this.reject('BAD_AUDIO_URL', `refused audio url ${String(audio.normal)}`);
          }
          if (audio.slow !== undefined && !safeAudioPath(audio.slow, this.origin)) {
            return this.reject('BAD_AUDIO_URL', `refused audio url ${String(audio.slow)}`);
          }
        }
        if (value.answer !== undefined) {
          const err = checkAnswer(value.answer);
          if (err) return this.reject('BAD_SHAPE', err);
        }
        this.lastSeq = seq;
        this.currentCardId = card.id;
        return { ok: true, message: value as unknown as SenderMessage };
      }

      case 'REVEAL': {
        if (typeof value.cardId !== 'string' || !CARD_ID_PATTERN.test(value.cardId)) {
          return this.reject('BAD_CARD_ID', `invalid card id ${String(value.cardId)}`);
        }
        if (this.currentCardId === null) {
          return this.reject('CARD_MISMATCH', 'REVEAL before any SHOW_CARD');
        }
        if (value.cardId !== this.currentCardId) {
          return this.reject(
            'CARD_MISMATCH',
            `REVEAL for ${value.cardId} but current card is ${this.currentCardId}`,
          );
        }
        const err = checkAnswer(value.answer);
        if (err) return this.reject('BAD_SHAPE', err);
        this.lastSeq = seq;
        return { ok: true, message: value as unknown as SenderMessage };
      }

      case 'PLAY_AUDIO': {
        const path = safeAudioPath(value.audioUrl, this.origin);
        if (!path) {
          return this.reject('BAD_AUDIO_URL', `refused audio url ${String(value.audioUrl)}`);
        }
        if (value.rate !== 0.8 && value.rate !== 1) {
          return this.reject('BAD_SHAPE', `unsupported rate ${String(value.rate)}`);
        }
        this.lastSeq = seq;
        return {
          ok: true,
          message: { type: 'PLAY_AUDIO', seq, audioUrl: path, rate: value.rate },
        };
      }

      case 'SETTINGS': {
        if (typeof value.reducedMotion !== 'boolean') {
          return this.reject('BAD_SHAPE', 'SETTINGS.reducedMotion must be a boolean');
        }
        this.lastSeq = seq;
        return {
          ok: true,
          message: { type: 'SETTINGS', seq, reducedMotion: value.reducedMotion },
        };
      }

      case 'SESSION_END': {
        const s = value.summary;
        if (!isObject(s)) return this.reject('BAD_SHAPE', 'SESSION_END.summary must be an object');
        for (const key of ['reviewed', 'good', 'again']) {
          const n = s[key];
          if (typeof n !== 'number' || !Number.isInteger(n) || n < 0) {
            return this.reject('BAD_SHAPE', `summary.${key} must be a non-negative integer`);
          }
        }
        if (s.nextDue !== undefined && typeof s.nextDue !== 'string') {
          return this.reject('BAD_SHAPE', 'summary.nextDue must be a string');
        }
        this.lastSeq = seq;
        return { ok: true, message: value as unknown as SenderMessage };
      }
    }

    /* c8 ignore next */
    return this.reject('BAD_TYPE', `unhandled type ${type}`);
  }
}

/* ------------------------------------------------------------------ *
 * Receiver → sender helpers
 * ------------------------------------------------------------------ */

export const ready = (): ReceiverMessage => ({ type: 'READY', protocol: 1 });
export const resync = (): ReceiverMessage => ({ type: 'RESYNC' });
export const ack = (seq: number): ReceiverMessage => ({ type: 'ACK', seq });
export const audioState = (
  seq: number,
  state: 'playing' | 'ended' | 'error',
): ReceiverMessage => ({ type: 'AUDIO_STATE', seq, state });
export const error = (code: string, message: string, seq?: number): ReceiverMessage =>
  seq === undefined ? { type: 'ERROR', code, message } : { type: 'ERROR', seq, code, message };
