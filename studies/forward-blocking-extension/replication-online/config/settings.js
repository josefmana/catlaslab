const times = {
  maxLearningTrialDuration: 10000, // ms; null = no limit
  maxTestTrialDuration:     null,  // ms; null = no limit
  feedbackDuration:         1000,
  interTrialInterval:       500,
};

const blocks = {
  stage1: 10, // 10 × 8 = 80 learning trials
  stage2:  8, //  8 × 8 = 64 learning trials
  stage3:  6, //  6 × 8 = 48 learning trials
  test:    2, //  2 × 8 = 16 test trials
};

const texts = {
  // ── Trial texts ────────────────────────────────────────────────────────────
  cueText:           "Tento multivitamín obsahuje:",
  promptText:        "Kterým z následujících nežádoucích účinků bude pacient trpět?",
  promptInstruction: "Klikněte na obrázek vašeho výběru a poté potvrďte stisknutím OK",
  feedbackText:      ["Správně", "Špatně"],
  testPromptText:    "Na kolik jste si jist/a svou odpovědí?",
  confidenceText:    ["Vůbec", "Velmi"],
  continueText:      "Pokračovat",
  
  // ── Instruction screens ────────────────────────────────────────────────────
  // Stage 1 instructions also cover Stage 2 (no break between them).
  instructions: {
    stage1: `
      <h2>Instrukce</h2>
      <p>
      Vaším úkolem bude predikovat, kterým ze dvou nežádoucích účinků
      bude trpět pacient, pan X, poté, co užije multivitamín s určitými
      chemikáliemi.
      </p>
      <p>
      Nejprve budete muset nežádoucí účinky pouze odhadovat, avšak po
      obdržení zpětné vazby o tom, který skutečně nastal, budete postupně
      čím dál tím přesnější.
      </p>
    `,
    stage3: `
      <h2>Instrukce</h2>
      <p>Skvělá práce!</p>
      <p>
      Váš úkol se nyní mírně změní. Uvidíte nyní nového pacienta, pana Y,
      který trpí jinými nežádoucími účinky, než pan X. Vaším úkolem bude,
      stejně jako u předchozího pacienta, odhadnout na základě chemikálií
      obsažených v multivitamínu, který pan Y konzumuje, odhadnout, kterým
      nežádoucím účinkem bude trpět.
      </p>
      <p>
      Stejně jako v případě pana Y, budete muset zprvu nežádoucí účinky
      odhadovat, ovšem po obdržení zpětné vazby o tom, který skutečně nastal,
      budete postupně čím dál tím přesnější.
      </p>
    `,
    test: `
      <h2>Instrukce</h2>
      <p>Výborně!</p>
      <p>
      Čeká vás poslední úkol. Nyní si vyzkoušíme vaše znalosti o panu Y.
      Na obrazovce uvidíte chemické složení multivitamínu, který si pan Y
      chystá vzít. Vaším úkolem bude opět odhadnout, kterým ze dvou nežádoucích
      účinků bude po jeho konzumaci pan Y trpět.
      </p>
      <p>
      Narozdíl od předchozích pokusů, neobdržíte však nyní po své odpovědi
      zpětnou vazbu. Namísto toho vás požádáme, abyste zhodnotil/a míru jistoty
      ve svou predikci. Dostanete na výběr z možností sahajících od 1 ("Nejsem
      si vůbec jist/a") po 10 ("Jsem si velmi jist/a").
      </p>
    `,
  },
};

const images = {
  cuePicture: "../../../common/stimuli/img/tube.jpg",
};

// Bundled object consumed by buildTimeline;
// individual exports remain available for the preload trial.
const settings = { times, blocks, texts, images };
