// ── settings.js ───────────────────────────────────────────────────────────────
//
// Assembles the per-concern config files into the single `settings` object
// that buildTimeline expects.
//
// Edit the individual files, not this one!
//
// Load order in index.html must be:
//   timing.js →
//    blocks.js →
//    texts/ui.js →
//    texts/instructions.js →
//    texts/tutorials.js →
//    texts/debrief.js →
//    images.js →
//    settings.js

const texts = {
  // Flat trial-level labels
  ...uiTexts,

  // Multi-screen content (keyed sub-objects)
  instructions,
  tutorials,
  debrief,
};

// Bundled object consumed by buildTimeline
const settings = { times, blocks, texts, images };
