# #14 — SNES Double Pendulum (Chaos)

**Date:** 2026-06-27
**Scope:** llvm-mos-65816 (ROM + gate) → biohack.net (page + gallery)

Demo #14 of the **compiler stress-test demo battery**.

---

## What it does

Two double pendulums, released from nearly-identical starting angles, swing on screen.
Their mass-2 traces paint a chaotic **path trace** on a `BitmapCanvas` in real time.
Because the system is chaotic, the two traces diverge exponentially and never repeat —
the canonical signature of sensitivity to initial conditions.

**Codegen under test:**
- **sin/cos LUT** (same 256-entry Q8.8 table as spirograph) — 5 lookups per step
- **16×16→32 multiplies** (`__mulsi3`) — the ω₁² and ω₂² coupling terms in both numerators
- **32-bit signed divide** (`__divsi3`) — the common denominator `3 − cos 2Δ` per step
- **`rep/sep` mode brackets** under `+mos-a16` throughout the coupling math

No far pointers → builds default-8-bit AND `+mos-a16` AND `+mos-xy16` → full 5-way differential.

---

## Equations of motion (unit mass, unit length)

```
Δ = θ₁ − θ₂

D = 3 − cos(2Δ)                                      [denominator ∈ (2, 4)]

α₁ = [−3g sin θ₁ − g sin(θ₁−2θ₂) − 2 sin Δ (ω₂²+ω₁² cos Δ)] / D

α₂ = [2 sin Δ (2ω₁² + 2g cos θ₁ + ω₂² cos Δ)] / D
```

Integrated by **semi-implicit Euler** (velocity-first): `ω += α; θ += ω/VSCALE`.
Four substeps per frame keeps numerical error below the LUT-index granularity.

---

## Screen layout

```
┌────────────────────────────────────────────────────────────────┐
│  256×224 — Mode 1, BG3 2bpp, BitmapCanvas 128×128             │
│                                                                │
│        ┌─────────────────────────────────────┐                │
│        │   pivot  (centred)                  │                │
│        │     ●                               │                │
│        │    /|\ ← pendulum 1 (white/gray)    │                │
│        │    / \                              │                │
│        │   ●   ●                             │                │
│        │        \__ pendulum 2 (cyan/dim)    │                │
│        │                                     │                │
│        │   path trace accumulates below      │                │
│        │   (white=pen1, cyan=pen2)           │                │
│        └─────────────────────────────────────┘                │
│                                                                │
│   CHAOS DEMO   #14   DOUBLE PENDULUM       [selfcheck badge]   │
└────────────────────────────────────────────────────────────────┘
```

Self-running — no joypad needed.

---

## Implementation

### 1. `examples/65816/dpend.h` — pure-C physics kernel

- 256-entry Q8.8 SINCOS LUT (inline, same values as `spiro.h` / `sincos.h`)
- State: `{uint8_t th1, th2; int16_t om1, om2;}` for each pendulum
- `dpend_step()`: one semi-implicit Euler step using exact equations above
  - All 16-bit LUT reads → `__mulsi3` products for ω² coupling
  - One signed 32-bit divide for D → `__divsi3`
  - Overflow-safe: ω values bounded by energy conservation
- `dpend_gate_crc()`: 256 steps, fold `(th1, th2, om1, om2)` into a CRC-16

### 2. `tools/dpend-sim.c` — host oracle

Compiles `dpend.h` on the host, prints the golden 16-bit CRC to stdout.

### 3. `examples/snes/corpus/dpend_sim.c` — corpus differential slice

Mirrors `pi_sim.c` / `spiro_sim.c` pattern: `volatile uint16_t corpus_result`.

### 4. `examples/snes/double-pendulum.c` — SNES ROM

- `BitmapCanvas` (128×128, centred)
- Two pendulum states; slight offset in `th2` initial angle → divergent trajectories
- 4 integration substeps per frame
- Each frame: plot mass-2 positions (pendulum 1 → color 1, pendulum 2 → color 2)
- HUD line at bottom: "CHAOS DEMO #14 DOUBLE PENDULUM"
- `corpus_result = dpend_gate_crc(&s, 256)` at startup for the WRAM selfcheck

### 5. `dev/double-pendulum.sh` — build + emulator gate

1. Compile host oracle → print `EXPECT`
2. Build ROM with `mos-snes-clang +mos-a16 -Os`
3. Disasm gate: `__mulsi3` + `__divsi3` + `rep`/`sep` in corpus object
4. bsnes-jg: `jgxcheck` dump + assert `corpus_result == EXPECT`
5. MAME Xvfb: snapshot + assert

### 6. `dev/run.sh` — add `double-pendulum` subcommand

### 7. biohack.net integration

- Copy ROM → `public/play/roms/double-pendulum.sfc`
- bsnes-jg screenshot → `public/play/preview/double-pendulum.png`
- `manifest.json`: add selfcheck entry
- `src/pages/snes.astro`: add gallery card (6th card)
- `src/pages/double-pendulum.astro`: new demo page (pattern: `spigot.astro`)

---

## Verification

1. Host oracle (`cc -O2 tools/dpend-sim.c -o build/dpend-sim && build/dpend-sim`)
   prints a non-zero CRC in the form `0xXXXX`.

   ```
   ==> host oracle: double-pendulum gate hash = 0xE859
   ```
   PASS

2. ROM builds without errors (`mos-snes-clang +mos-a16 -Os ... -o build/double-pendulum.sfc`
   exits 0).

   ```
   ==> built build/double-pendulum.sfc (+mos-a16); corpus_result @ WRAM 0x12da
   ```
   PASS

3. Disasm gate: `__mulsi3` ≥ 1 + `__divsi3` ≥ 1 + `rep`/`sep` ≥ 1.

   ```
   PASS  __mulsi3=6  __divsi3=2  rep/sep=77  (ω² coupling + D-divide + native-16)
   ```
   PASS

4. bsnes-jg selfcheck: `PASS corpus_result == 0xE859`.

   ```
   SMOKE: PASS off=0x12DA len=2 got=0xE859 (ran 500 frames, bsnes-jg)
   ```
   PASS

5. MAME snapshot exits 0 and `SHOT: PASS` line present.

   ```
   SHOT: PASS corpus=0xE859 (snapshot at frame 500)
   ```
   PASS

6. `task build` on biohack.net exits 0 with 10 pages built.

   ```
   11:54:02 ✓ Completed in 78ms.
   11:54:02 [build] 10 page(s) built in 1.17s
   11:54:02 [build] Complete!
   ```
   PASS

7. `/snes` gallery shows 6 cards including Double Pendulum with preview image.

   ```
   (manual verify after deploy)
   ```
   PENDING

8. `/double-pendulum/` loads emulator and path trace is visible after ~3 seconds.

   ```
   (manual verify after deploy)
   ```
   PENDING
