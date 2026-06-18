// ── features.js ──────────────────────────────────────────────────────────────
//
// Boolean flags that control which optional sections are included in the
// timeline.  Flip a flag to `false` to skip that section entirely — useful
// during piloting, development, or any run where collecting that data is
// unnecessary or not approved.
//
// Script `lang.js` containing the LANG variable must be loaded before!
//
// Consumed by: settings.js → buildTimeline.js (via the `features` parameter)

const features = {
  includeEmail: LANG !== "en",
  includeDemography: LANG !== "en",
};