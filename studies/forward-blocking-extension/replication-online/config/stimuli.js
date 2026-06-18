// ── Stimuli labels and path to files ─────────────────────────────────────────
//
// Paths are relative to the experiment root (same base as index.html).
//
// Script `lang.js` containing the LANG variable must be loaded before!

// ── Cues: abstract variables and stimuli images ──────────────────────────────
const cues = [
  "A", "C", "E", "G",                           // Pretrained blocking cues
  "I", "L", "O", "R",                           // Pretrained filler cues
  "B", "D", "F", "H",                           // Novel blocked cues
  "J", "M", "P", "S",                           // Novel "non-blocking" cues
  "K", "N", "Q", "T",                           // Novel control cues
  "U", "V", "W", "X", "Y", "Z", "alpha", "beta" // Stage 3 filler cues
];

const chemicals = [
  `../../../common/stimuli/img/cues/${LANG}/Ulginate.png`,
  `../../../common/stimuli/img/cues/${LANG}/Renphane.png`,
  `../../../common/stimuli/img/cues/${LANG}/Nelomine.png`,
  `../../../common/stimuli/img/cues/${LANG}/Kluphane.png`,
  `../../../common/stimuli/img/cues/${LANG}/Bizancrine.png`,
  `../../../common/stimuli/img/cues/${LANG}/Alzaze.png`,
  `../../../common/stimuli/img/cues/${LANG}/Quezalin.png`,
  `../../../common/stimuli/img/cues/${LANG}/Xentine.png`,
  `../../../common/stimuli/img/cues/${LANG}/Frestix.png`,
  `../../../common/stimuli/img/cues/${LANG}/Trizopane.png`,
  `../../../common/stimuli/img/cues/${LANG}/Lobinz.png`,
  `../../../common/stimuli/img/cues/${LANG}/Zapotyne.png`,
  `../../../common/stimuli/img/cues/${LANG}/Fazakane.png`,
  `../../../common/stimuli/img/cues/${LANG}/Jintsone.png`,
  `../../../common/stimuli/img/cues/${LANG}/Eframide.png`,
  `../../../common/stimuli/img/cues/${LANG}/Sistax.png`,
  `../../../common/stimuli/img/cues/${LANG}/Kikaran.png`,
  `../../../common/stimuli/img/cues/${LANG}/Ontone.png`,
  `../../../common/stimuli/img/cues/${LANG}/Pukintz.png`,
  `../../../common/stimuli/img/cues/${LANG}/Gratix.png`,
  `../../../common/stimuli/img/cues/${LANG}/Ventox.png`,
  `../../../common/stimuli/img/cues/${LANG}/Cucose.png`,
  `../../../common/stimuli/img/cues/${LANG}/Yestimox.png`,
  `../../../common/stimuli/img/cues/${LANG}/Halorite.png`,
  `../../../common/stimuli/img/cues/${LANG}/Prental.png`,
  `../../../common/stimuli/img/cues/${LANG}/Goladine.png`,
  `../../../common/stimuli/img/cues/${LANG}/Ilomine.png`,
  `../../../common/stimuli/img/cues/${LANG}/Daktyre.png`,
]

// ── Outcomes: abstract variables and stimuli images ──────────────────────────
const outcomes = [
  "o1",
  "o2",
  "o3",
  "o4",
];

const sideEffects = [
  x = [
    `../../../common/stimuli/img/outcomes/${LANG}/x_dizziness.png`,
    `../../../common/stimuli/img/outcomes/${LANG}/x_itchiness.png`,
    `../../../common/stimuli/img/outcomes/${LANG}/x_headache.png`,
    `../../../common/stimuli/img/outcomes/${LANG}/x_nausea.png`,
  ],
  [
    `../../../common/stimuli/img/outcomes/${LANG}/y_dizziness.png`,
    `../../../common/stimuli/img/outcomes/${LANG}/y_itchiness.png`,
    `../../../common/stimuli/img/outcomes/${LANG}/y_headache.png`,
    `../../../common/stimuli/img/outcomes/${LANG}/y_nausea.png`,
  ],
]
