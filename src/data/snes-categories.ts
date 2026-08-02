// Gallery categories for the /snes/ demos (moved out of the retired
// src/data/snes-demos.ts — the demo entries themselves now live in the `snes`
// content collection, src/content/snes/<slug>.json).
export const categories = [
  { id: 'fractals',   label: 'Fractals' },
  { id: 'physics',    label: 'Physics & Simulation' },
  { id: 'cellular',   label: 'Cellular Automata' },
  { id: 'motion',     label: 'Motion & Curves' },
  { id: 'algorithms', label: 'Algorithms & Data' },
  { id: 'rendering',  label: 'Rendering & Graphics' },
  { id: 'video',      label: 'Video Playback' },
  { id: 'signals',    label: 'Signals & Audio' },
  { id: 'bignums',    label: 'Big Numbers' },
  { id: 'ciphers',    label: 'Ciphers & Bit Tricks' },
  { id: 'classics',   label: 'Games & Classics' },
  { id: 'cartridge',  label: 'Cartridge & Mapping Tests' },
] as const;

export const categoryIds = categories.map((c) => c.id) as unknown as [string, ...string[]];
export const categoryLabel = (id: string) => categories.find((c) => c.id === id)?.label ?? id;
