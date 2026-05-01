const times = {
  maxInstructionDuration:   120000,
  maxLearningTrialDuration: 1000,  // null = no limit
  maxTestTrialDuration:     null,   // null = no limit
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
  progressText:      "Splněno",
  startText:         "Zahájit experiment",
  cueText:           "Tento multivitamín obsahuje:",
  promptText:        "Kterým z následujících nežádoucích účinků bude pacient trpět?",
  promptInstruction: "Klikněte na obrázek vašeho výběru a poté potvrďte stisknutím OK",
  feedbackText:      ["Správně", "Špatně"],
  testPromptText:    "Na kolik jste si jist/a svou odpovědí?",
  confidenceText:    ["Vůbec", "Velmi"],
  continueText:      "Pokračovat",
  farewellText:      "Ukončit experiment",
  emailError:        `Zadejte platnou e-mailovou adresu nebo napište „x".`,
  
  // ── Instruction screens ────────────────────────────────────────────────────
  instructions: {
    welcome: `
      <h2>Vítejte ve studii diagnostického rozhodování [catlas-01]</h2>
      <p>
      V této studii budete odhadovat, jakým nežádoucím účinkem bude trpět
      fiktivní pacient po požití multivitamínu obsahujícího určité chemikálie.
      </p>
      <p>
      Vaším úkolem bude postupně se naučit, která chemikálie způsobuje konkrétní
      nežádoucí účinek.
      </p>
      <p>
      Na následujících několika stránkách si podrobně vysvětlíme, jak bude
      experiment probíhat a co bude vaším úkolem.
      </br>
      Pokračujte prosím stisknutím tlačítka „Pokračovat“.
      </p>
    `,
    
    email: `
      <h2>Registrace</h2>
      <p>Zadejte prosím svůj e-mail nebo napište „x" pro anonymní účast.</p>
    `,
    
    demography: `
      <h2>Demografie</h2>
      <p>Odpovězte prosím na následující otázky:</p>
      <p>K jakému pohlaví se hlásíte?</p>
      <p>
        <select style="height:22px; font-size: 18px"; text-align-last: center; name="sex">
          <option value="female">žena</option>
          <option value="male">muž</option>
          <option value="other">jiné</option>
        </select>
      </p>
      <p>Kolik je vám let?</p>
      <p>
        <select style="height:22px; font-size: 16px"; text-align-last: center; name="age">
          ${Array.from({ length: 82 }, (_, i) =>
            `<option value="${i + 18}">${i + 18}</option>`).join('')}
        </select>
      </p>
    `,
    
    start: `
      <p>
      Experiment bude probíhat v režimu celé obrazovky. Stisknutím tlačítka
      tento režím zahájít a experiment vás požádá o vrácení na celou obrazovku,
      pokud z ní v průběhu experimentu odejdete.
      </p>
      <p>
      Stisknutím tlačítka zahájíte experiment.
      </p>
    `,
    
    // Stage 1 instructions also cover Stage 2 (no break between them).
    stage1: `
      <h2>Instrukce</h2>
      <p>
      Vaším úkolem bude odhadnout, kterým ze dvou nežádoucích účinků
      bude trpět pacient, pan X, po užití multivitamínu obsahujícího
      určité chemikálie.
      </p>
      <p>
      Zpočátku budete odpovědi spíše odhadovat, ale díky zpětné vazbě
      se budete postupně zlepšovat a vaše odhady budou přesnější.
      </p>
    `,
    
    stage3: `
      <h2>Instrukce</h2>
      <p>Skvělá práce!</p>
      <p>
      Váš úkol se nyní mírně změní. Budete pracovat s novým pacientem,
      panem Y, který trpí jinými nežádoucími účinky než pan X.
      </p>
      <p>
      Stejně jako dříve budete na základě chemického složení multivitamínu
      odhadovat, kterým nežádoucím účinkem bude pacient trpět.
      </p>
      <p>
      I v této části se budete postupně zlepšovat díky zpětné vazbě,
      kterou po každé odpovědi obdržíte.
      </p>
    `,
    
    test: `
      <h2>Instrukce</h2>
      <p>Výborně!</p>
      <p>
      Čeká vás poslední část experimentu. Nyní otestujeme vaše znalosti
      o pacientovi Y.
      </p>
      <p>
      Uvidíte chemické složení multivitamínu a vaším úkolem bude opět
      odhadnout, kterým ze dvou nežádoucích účinků bude pacient trpět.
      </p>
      <p>
      Na rozdíl od předchozí části však již neobdržíte zpětnou vazbu.
      Místo toho budete hodnotit svou jistotu.
      </p>
      <p>
      Po každé odpovědi zvolíte hodnotu od 1 („Nejsem si vůbec jistý/á“)
      do 10 („Jsem si velmi jistý/á“), která vyjadřuje vaši míru jistoty.
      </p>
    `,
    
    farewell: `
      <h2>Děkujeme za účast ve studii diagnostického rozhodování [catlas-01]</h2>
      <p>Experiment ukončíte stisknutím tlačítka.</p>
    `,
    
    fullscreen: `
      <p>Vraťte se prosím do režimu celé obrazovky.</p>
    `,
  },
  
  // ── Tutorial texts ─────────────────────────────────────────────────────────
  tutorials: {
    page1: `
      <h2>Návod</h2>
      <p>
      V tomto experimentu budete hrát roli alergologa.
      </p>
      <p>
      Bude vám zobrazena chemikálie obsažená v tabletě multivitamínu, kterou
      pacient pozřel (obrázek a text nahoře).
      </p>
      <p>
      Vaším úkolem bude vybrat ze dvou nežádoucích účinků (zobrazených dole)
      ten, kterým se podle vás bude pacient po požití multivitamínu trpět.
      </p>
    `,
    
    page2: `
      <h2>Návod</h2>
      <p>
      <b>Svou odpověď zaznamenáte následovně:</b>
      </br> 1. Kliknete na vámi zvolenou odpověď.
      </br> 2. Zvolená odpověď se označí tenkým černým rámečkem.
      </br> 3. Kliknete na tlačítko „OK“ uprostřed obrazovky.
      </p>
      <p>
      Dokud nestisknete tlačítko „OK“, můžete svou volbu libovolně měnit
      (viz ukázka vpravo).
      </p>
      <p>
      <b>Po potvrzení odpovědi obdržíte zpětnou vazbu:</b>
      </br> - správná odpověď bude zvýrazněna modrým rámečkem,
      </br> - při správné odpovědi uvidíte zelený text „Správně“,
      </br> - při nesprávné odpovědi uvidíte červený text „Nesprávně“.
      </p>
      <p>
      Experiment vás poté automaticky posune k další položce.
      </p>
    `,
    
    page3: `
      <h2>Návod</h2>
      <p>
      V některých případech pacient zkonzumuje multivitamín obsahující jednu
      podezřelou chemikálii (jako na předchozí stránce), jindy může obsahovat
      chemikálie dvě.
      </p>
      <p>
      Váš úkol zůstává stejný bez ohledu na počet chemikálií. Vždy se pokuste
      odhadnout, kterým ze dvou nežádoucích účinků bude pacient trpět.
      </p>
    `,
    
    page4: `
      <h2>Návod</h2>
      <p>
      Na konci experimentu otestujeme vaše znalosti o chemikáliích, se kterými
      se během studie setkáte. V této části již neobdržíte zpětnou vazbu.
      </p>
      <p>
      Místo toho budete hodnotit, jak moc si svou odpovědí jste jisti.
      </p>
      <p>
      <b>Postup bude následující:</b>
      </br> 1. Kliknete na odpověď svého výběru.
      </br> 2. Odpověď se označí tenkým černým rámečkem.
      </br> 3. Kliknete na tlačítko „OK“.
      </br> 4. Zobrazí se desetibodová škála.
      </br> 5. Vyberete, jak moc si jste jisti správností své odpovědi.
      </br> 6. Zvolená hodnota se označí modře.
      </br> 7. Opět kliknete na „OK“ a přejdete na další úkol.
      </p>
      <p>
      Dokud nestisknete tlačítko „OK“, můžete svou volbu měnit.
      </p>
    `,
  },
};

// Gif animations for tutorials
const images = {
  tutorial1: "../../../common/stimuli/img/tutorials/learning_single_cue.png",
  tutorial2: "../../../common/stimuli/img/tutorials/learning_single_cue.gif",
  tutorial3: "../../../common/stimuli/img/tutorials/learning_double_cue.gif",
  tutorial4: "../../../common/stimuli/img/tutorials/test_double_cue.gif",
};

// Bundled object consumed by buildTimeline
const settings = { times, blocks, texts, images };
