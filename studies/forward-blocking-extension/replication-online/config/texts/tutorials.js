// ── Tutorial pages ───────────────────────────────────────────────────────────
//
// Shown sequentially via makeTutorialTrial before the experiment starts.
// Paired with images from images.js (tutorial1–tutorial4).
const tutorials = {

  page1: `
    <h2>Návod</h2>
    <hr>
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
    <hr>
    <p>
    <b>Svou odpověď zaznamenáte následovně:</b>
    </p>
    <p>
      <ol>
        <li>Kliknete na vámi zvolenou odpověď.</li>
        <li>Zvolená odpověď se označí tenkým černým rámečkem.</li>
        <li>Kliknete na tlačítko „OK" uprostřed obrazovky.</li>
      </ol>
    </p>
    <p>
    Dokud nestisknete tlačítko „OK", můžete svou volbu libovolně měnit (viz
    ukázka vpravo).
    </p>
    <p>
    <b>Po potvrzení odpovědi obdržíte zpětnou vazbu:</b>
      <ul>
        <li>správná odpověď bude zvýrazněna modrým rámečkem,</li>
        <li>při správné odpovědi uvidíte zelený text „Správně",</li>
        <li>při nesprávné odpovědi uvidíte červený text „Špatně".</li>
      </ul>
    </p>
    <p>
    Na zaznamenání odpovědi máte vždy <b>1 minutu</b>. Po jejím uplynutí či
    zaznamenání odpovědi dle návodu vás experiment automaticky posune k další
    položce.
    </p>
  `,

  page3: `
    <h2>Návod</h2>
    <hr>
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
    <hr>
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
    </p>
    <ol>
      <li>Kliknete na odpověď svého výběru.</li>
      <li>Odpověď se označí tenkým černým rámečkem.</li>
      <li>Kliknete na tlačítko „OK".</li>
      <li>Zobrazí se desetibodová škála.</li>
      <li>Vyberete, jak moc si jste jisti správností své odpovědi.</li>
      <li>Zvolená hodnota se označí modře.</li>
      <li>Opět kliknete na „OK" a přejdete na další úkol.</li>
    </ol>
    <p>
    Dokud nestisknete tlačítko „OK", můžete svou volbu libovolně měnit.
    </p>
  `,

};
