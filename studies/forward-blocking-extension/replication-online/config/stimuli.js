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
  "../../../common/stimuli/img/cues/Ulginate.png",
  "../../../common/stimuli/img/cues/Renphane.png",
  "../../../common/stimuli/img/cues/Nelomine.png",
  "../../../common/stimuli/img/cues/Kluphane.png",
  "../../../common/stimuli/img/cues/Bizancrine.png",
  "../../../common/stimuli/img/cues/Alzaze.png",
  "../../../common/stimuli/img/cues/Quezalin.png",
  "../../../common/stimuli/img/cues/Xentine.png",
  "../../../common/stimuli/img/cues/Frestix.png",
  "../../../common/stimuli/img/cues/Trizopane.png",
  "../../../common/stimuli/img/cues/Lobinz.png",
  "../../../common/stimuli/img/cues/Zapotyne.png",
  "../../../common/stimuli/img/cues/Fazakane.png",
  "../../../common/stimuli/img/cues/Jintsone.png",
  "../../../common/stimuli/img/cues/Eframide.png",
  "../../../common/stimuli/img/cues/Sistax.png",
  "../../../common/stimuli/img/cues/Kikaran.png",
  "../../../common/stimuli/img/cues/Ontone.png",
  "../../../common/stimuli/img/cues/Pukintz.png",
  "../../../common/stimuli/img/cues/Gratix.png",
  "../../../common/stimuli/img/cues/Ventox.png",
  "../../../common/stimuli/img/cues/Cucose.png",
  "../../../common/stimuli/img/cues/Yestimox.png",
  "../../../common/stimuli/img/cues/Halorite.png",
  "../../../common/stimuli/img/cues/Prental.png",
  "../../../common/stimuli/img/cues/Goladine.png",
  "../../../common/stimuli/img/cues/Ilomine.png",
  "../../../common/stimuli/img/cues/Daktyre.png"
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
    "../../../common/stimuli/img/outcomes/x_dizziness.png",
    "../../../common/stimuli/img/outcomes/x_itchiness.png",
    "../../../common/stimuli/img/outcomes/x_headache.png",
    "../../../common/stimuli/img/outcomes/x_nausea.png",
  ],
  y = [
    "../../../common/stimuli/img/outcomes/y_dizziness.png",
    "../../../common/stimuli/img/outcomes/y_itchiness.png",
    "../../../common/stimuli/img/outcomes/y_headache.png",
    "../../../common/stimuli/img/outcomes/y_nausea.png",
  ],
]
