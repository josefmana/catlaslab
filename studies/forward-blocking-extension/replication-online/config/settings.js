const times = {
  maxInstructionDuration:   120000,
  maxLearningTrialDuration: 10000, // null = no limit
  maxTestTrialDuration:     200, // null = no limit
  feedbackDuration:         1500,
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
  
  // ── Tutorial texts ─────────────────────────────────────────────────────────
  tutorials: {
    page1: `
      <h2>Návod</h2>
      <p>
      V tomto experimentu budete hrát roli alergologa.
      </p>
      <p>
      Bude vám prezentována chemikálie obsažená v tabletě multivitamínu, kterou
      váš pacient pozřel (obrázek a text nahoře).
      </p>
      <p>
      Vaším úkolem bude vybrat ze dvou nežádoucích účinků (prezentovaných na
      obrázku dole) ten, kterým se domníváte, že bude pacient po pozření
      multivitamínu s touto chemikálií trpět.
      </p>
    `,
    page2: `
      <h2>Návod</h2>
      <p>
      <b>Svou odpověd zaznamenáte následovně:</b>
        </br> 1. kliknete na odpověď svého výběru,
        </br> 2. vaše odpověď se automaticky odpověď označí tenkým černým rámem,
        </br> 3. kliknete na tlačítko "OK" uprostřed obrazovky
      </p>
      <p>
      <b>Po zaznamenání vaší odpovědi obdržíte zpětonou vazbu:</b>
        </br> - správná odpověď bude zarámována modře
        </br> - pokud jste zvolili správně, uvidíte zeleně psáno "Správně",
        </br> - pokud jste zvolili nesprávně, uvidíte červeně psáno "Nesprávně"
      </p>
      <p>
      Experiment vás poté sám posune k další položce.
      </p>
    `,
    page3: `
      <h2>Návod</h2>
      <p>
      V některých případech se stane, že pacient zkonzumoval multivitamín s
      jednou podezřelou chemikálií (jako tomu bylo na předchozí stránce), jindy
      pacient pozře multivitamín s dvěmi podezřelými chemikáliemi.
      </p>
      <p>
      Váš úkol bude stejný bez ohledu na pošet chemikálií v multivitamínu.
      Pokaždé se pokuste odhadnout, kterým ze dvou nežádoucích účinků bude
      pacient trpět.
      </p>
    `,
    page4: `
      <h2>Návod</h2>
      <p>
      Na konci experimentu otestujeme vaše vědomosti o chemikáliích, se kterými
      se v průběhu studie setkáte. Během toho testu již nedostanete zpětnou
      vazbu o správnosti vaší odpovědi. Namísto toho se vás zeptám, jak moc
      své odpovědi důvěřujete.
      </p>
      <b>Svou odpověd zaznamenáte následovně:</b>
        </br> 1. kliknete na odpověď svého výběru,
        </br> 2. vaše odpověď se automaticky odpověď označí tenkým černým rámem,
        </br> 3. kliknete na tlačítko "OK" uprostřed obrazovky,
        </br> 4. namísto otázky se objeví desetibodá škála,
        </br> 5. kliknutím zaznačíte, nakolik si jste jisti správností své odpovědi,
        </br> 6. vámi zvolená varianta se automatcky označí modře,
        </br> 7. kliknete opět na tlačítko "OK" a tím se posunete k dalšímu úkolu.
      </p>
    `,
  },
  
  // ── Instruction screens ────────────────────────────────────────────────────
  // Stage 1 instructions also cover Stage 2 (no break between them).
  instructions: {
    welcome: `
      <h2>Vítejte ve studii diagnostického rozhodování [catlas-01]</h2>
      <p>
      V této studii budete predikovat, jakým nežádoucím účinkem bude trpět
      fiktivní pacient po zkonzumování multivitamínu obsahujícího určité
      chemikálie.
      </p>
      <p>
      Vaším úkolem bude postupně se naučit, která chemikálie pacientovi
      způsobuje ten který nežádoucí účinek.
      </p>
      Na následujících několika slidech spolu podrobně projdeme, jak bude
      experiment vypadat a co bude Vaším úkolem.
      Pokračujte prosím stisknutím tlačítka "Pokračovat".
      </p>
    `,
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

// Gif animations for tutorials
const images = {
  tutorial1: "tutorial_1.png",
  tutorial2: "tutorial_2.gif",
  tutorial3: "tutorial_3.gif",
  tutorial4: "tutorial_4.gif",
};

// Bundled object consumed by buildTimeline;
// individual exports remain available for the preload trial.
const settings = { times, blocks, texts, images };
