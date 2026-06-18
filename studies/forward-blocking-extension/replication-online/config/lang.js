// ── lang.js ──────────────────────────────────────────────────────────────────
//
// Sets language in which the experiment will be presented.
//
// Needs to be loaded before language-dependent components.
//
// Load order in index.html ought to be:
//   lang.js →
//    { 
//      texts/LANG/ui.js,
//      texts/LANG/instructions.js,
//      texts/LANG/tutorials.js,
//      texts/LANG/debrief.js,
//      images.js,
//      stimuli.js
//.   } →
//    settings.js

const LANG = "cs"; // "cs" or "en"
