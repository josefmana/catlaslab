const times = {
  maxInstructionDuration:   120000,
  maxLearningTrialDuration: 60000,  // null = no limit
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
  agreeText:         "Souhlasím<br/>(Pokračovat)",
  disagreeText:      "Nesouhlasím<br/>(Odejít!)",
  farewellText:      "Ukončit experiment",
  emailError:        `Zadejte platnou e-mailovou adresu nebo napište „x".`,
  
  // ── Instruction screens ────────────────────────────────────────────────────
  instructions: {
    welcome: `
      <h2>Vítejte ve studii diagnostického rozhodování</br>[catlas-01]</h2>
      <p>
      V této studii budete odhadovat, jakým nežádoucím účinkem bude trpět
      fiktivní pacient po požití multivitamínu obsahujícího určité chemikálie.
      Vaším úkolem bude postupně se naučit, která chemikálie způsobuje který
      konkrétní nežádoucí účinek.
      </p>
    `,
    
    prelude: `
      <p>
      Nyní proběhne načtení materiálů potřebných pro experiment. Tento proces
      může trvat několik sekund až minut v závislosti na rychlosti vašeho
      internetového připojení.
      </p>
      <p>
      Po načtení materiálů vás požádáme o přečtení si <i>Souhlasu s účastí na
      výzkumu</i>. Nebudete-li souhlasit, experiment se ukončí. Pokud
      souhlasit budete, požádáme vás následně o uvedení základních informací o
      sobě a poté si na několika stránkách podrobně vysvětlíme, jak bude
      experiment probíhat.
      </p>
    `,
    
    consent: `
      <div class="consent-form">
        <h2>Souhlas s účastí na výzkumu</h2>
        <p>
          Potvrzuji, že:
          <ul>
            <li>Seznámil/a jsem se s informacemi o cílech a průběhu výše
            popsaného výzkumu;</li>
            <li>Dobrovolně souhlasím s účastí na tomto výzkumu;</li>
            <li>Beru na vědomí, že se mohu kdykoli rozhodnout od výzkumu
            odstoupit;</li>
            <li>Jsem si vědom(a) toho, že jakékoli použití a zveřejnění údajů a
            výsledků výzkumu mi nezakládá nárok na odměnu nebo náhradu, což
            znamená, že poskytuji veškerá práva na bezplatné použití a
            zveřejnění údajů a výsledků výzkumu.</li>
          </ul>
        </p>
        <p>
          Rovněž prohlašuji, že:
          <ul>
            <li>Souhlasím se zveřejněním anonymizovaných údajů a výsledků
            výzkumu a s jejich dalším využitím;</li>
            <li>Souhlasím se zpracováním a uchováním osobních a citlivých údajů
            uvedených v tomto formuláři informovaného souhlasu Psychologickým
            ústavem Akademie věd ČR, IČ: 68081740, se sídlem Pod Vodárenskou
            věží 1143/4, 182 00 Praha 8, pro účely zpracování dat z výzkumu,
            případného kontaktu související se zpracováním dat, nabídek účasti
            na obdobných akcích a pro účely evidence a archivace. Jsem
            srozuměn/a s tím, že tyto osobní údaje mohou být poskytnuty
            subjektům oprávněným k dohledu nad projektem, v jehož rámci je
            výzkum prováděn;</li>
            <li>Jsem informován/a o svých právech týkajících se přístupu k
            informacím a jejich ochrany podle § 46 a 49 zákona č. 110/2019 Sb.,
            o ochraně osobních údajů a o změně některých zákonů, ve znění
            pozdějších předpisů. To znamená, že mohu požádat Psychologický ústav
            Akademie věd ČR o informace o zpracování svých osobních a citlivých
            údajů a mám právo je obdržet. Mohu také požádat Psychologický ústav
            Akademie věd ČR o opravu nepřesných osobních údajů, jejich doplnění,
            blokování nebo likvidaci.</li>
          </ul>
        </p>
        <p>
          Výše uvedená oprávnění a souhlasy uděluji dobrovolně na dobu neurčitou
          do jejich odvolání a zavazuji se, že je bez závažného důvodu založeného
          na podstatné změně okolností neodvolám.
        </p>
      </div>
    `,
    
    declineConsent: `
      <p>
      Experiment byl ukočen pro odmítnutí podmínek účasti na studii.
      </p>
      <p>
      Pro další informace kontaktujte autora studie: mana@psu.cas.cz.
      </p>
    `,
    
    email: `
      <h2>Registrace</h2>
      <p>Zadejte prosím svůj e-mail nebo napište „x" pro zcela anonymní účast:</p>
    `,
    
    demography: `
      <h2>Demografie</h2>
      <p>K jakému pohlaví se hlásíte?</p>
      <p>
        <select style="height:24px; font-size: 18px"; text-align-last: center; name="sex">
          <option value="female">žena</option>
          <option value="male">muž</option>
          <option value="other">jiné</option>
        </select>
      </p>
      <p>Kolik je vám let?</p>
      <p>
        <select style="height:24px; font-size: 16px"; text-align-last: center; name="age">
          ${Array.from({ length: 82 }, (_, i) =>
            `<option value="${i + 18}">${i + 18}</option>`).join('')}
        </select>
      </p>
    `,
    
    prestart:`
      <h2>Před zahájením</h2>
      <p>
      Během experimentu:
      <ul>
        <li><b>si nedělejte zápisky</b>; spoléhejte prosím na svůj úsudek,</li>
        <li><b>nespěchejte</b>; správnost odpovědi je důležitější než rychlost,</li>
        <li><b>setrvejte v režimu celé obrazovky</b>.</li>
      </ul>
      </p>
    `,
    
    start: `
      <h2>Začínáme</h2>
      <p>
      Nyní začne samotná experimentální část studie. Stisknutím tlačítka „Zahájit
      experiment“ se otevřou dveře vaší ordinace a přivítáte svého prvního
      pacienta.
      </p>
      <p>
      Přejeme vám hodně zdaru ve vaší nové roli.
      </p>
    `,
    
    // Stage 1 instructions also cover Stage 2 (no break between them).
    stage1: `
      <h2>Instrukce</h2>
      <p>
      Vaším úkolem je odhadnout, kterým ze dvou nežádoucích účinků
      bude trpět váš pacient, <b>pan X</b>, po pozření multivitamínu
      obsahujícího určité chemikálie.
      </p>
      <p>
      Zpočátku budete odpovědi spíše odhadovat, ale díky zpětné vazbě
      se budete postupně zlepšovat a vaše odhady budou postupně přesnější.
      </p>
    `,
    
    stage3: `
      <h2>Instrukce</h2>
      <p>Skvělá práce!</p>
      <p>
      Váš úkol se nyní mírně změní. Budete pracovat s novým pacientem,
      <br>panem Y</b>, který trpí jinými nežádoucími účinky než pan X.
      </p>
      <p>
      Stejně jako doteď budete na základě chemického složení multivitamínu
      odhadovat, kterým nežádoucím účinkem bude váš nový pacient trpět.
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
      Čeká vás poslední část experimentu. Nyní otestujeme vaše <b>znalosti
      o reakcích pana Y</b>.
      </p>
      <p>
      Uvidíte chemické složení multivitamínu a vaším úkolem bude opět
      odhadnout, kterým ze dvou nežádoucích účinků bude pacient trpět.
      </p>
      <p>
      Na rozdíl od předchozí části však již <b>neobdržíte zpětnou vazbu</b>.
      Místo toho budete hodnotit, nakolik jste si svou odpovědí jist/a.
      </p>
      <p>
      Po každé odpovědi zvolíte hodnotu od <b>1 („Nejsem si vůbec jistý/á“)</b>
      do <b>10 („Jsem si velmi jistý/á“)</b>, která vyjadřuje vaši míru jistoty.
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
      pozřel váš pacient (obrázek a text nahoře).
      </p>
      <p>
      Vaším úkolem bude vybrat ze dvou nežádoucích účinků (zobrazených dole)
      ten, jímž podle vás bude pacient po požití multivitamínu trpět.
      </p>
    `,
    
    page2: `
      <h2>Návod</h2>
      <p>
      <b>Svou odpověď zaznamenáte následovně:</b>
      <br /> &ensp; 1. Kliknete na vámi zvolenou odpověď.
      <br /> &ensp; 2. Zvolená odpověď se označí tenkým černým rámečkem.
      <br /> &ensp; 3. Kliknete na tlačítko „OK“ uprostřed obrazovky.
      </p>
      <p>
      Dokud nestisknete tlačítko „OK“, můžete svou volbu libovolně měnit
      <br />(viz ukázka vpravo).
      </p>
      <p>
      <b>Po potvrzení odpovědi obdržíte zpětnou vazbu:</b>
      <br /> &ensp; - správná odpověď bude zvýrazněna modrým rámečkem,
      <br /> &ensp; - při správné odpovědi uvidíte zelený text „Správně“,
      <br /> &ensp; - při nesprávné odpovědi uvidíte červený text „Špatně“.
      </p>
      <p>
      Na zaznamenání odpovědi máte vždy <b>1 minutu</b>. Po jejím uplynutí či
      zaznamenání odpovědi dle návodu vás experiment automaticky posune k další
      položce.
      </p>
    `,
    
    page3: `
      <h2>Návod</h2>
      <p>
      V některých případech pacient zkonzumuje multivitamín obsahující jednu
      podezřelou chemikálii (jako na předchozí stránce), jindy může multivitamín
      obsahovat chemikálie dvě.
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
      se v roli alergologa setkáte. V této části studie již neobdržíte zpětnou
      vazbu.
      </p>
      <p>
      Místo toho budete hodnotit, jak moc si jste svou odpovědí jisti.
      </p>
      <p>
      <b>Postup bude následující:</b>
      <br /> &ensp; 1. Kliknete na odpověď svého výběru.
      <br /> &ensp; 2. Odpověď se označí tenkým černým rámečkem.
      <br /> &ensp; 3. Kliknete na tlačítko „OK“.
      <br /> &ensp; 4. Zobrazí se desetibodová škála.
      <br /> &ensp; 5. Vyberete, jak moc si jste jisti správností své odpovědi.
      <br /> &ensp; 6. Zvolená hodnota se označí modře.
      <br /> &ensp; 7. Opět kliknete na „OK“ a přejdete na další úkol.
      </p>
      <p>
      Dokud nestisknete tlačítko „OK“, můžete svou volbu libovolně měnit.
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
