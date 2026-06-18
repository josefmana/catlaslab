// ── Instruction screens ──────────────────────────────────────────────────────
//
// One entry per instruction screen shown via makeInstructionTrial.
// Keys match the screen names used in buildTimeline.
const instructions = {

  welcome: `
    <h2>Vítejte ve studii diagnostického rozhodování [catlas\u200D-01]</h2>
    <hr>
    
    <p>
      V této studii budete odhadovat, jakým nežádoucím účinkem bude trpět
      fiktivní pacient po požití multivitamínu obsahujícího určité chemikálie.
      Vaším úkolem bude postupně se naučit, která chemikálie způsobuje který
      konkrétní nežádoucí účinek.
    </p>
  `,

  prelude: `
    <hr>
    <p>
      Nyní proběhne načtení materiálů potřebných pro experiment. Tento proces
      může trvat několik sekund až minut v závislosti na rychlosti vašeho
      internetového připojení.
    </p>
    
    <p>
      Po načtení materiálů vás požádáme o přečtení si <i>Informací o výzkumu</i>
      a <i>Souhlasu s účastí na výzkumu</i>. Následně vás požádáme o uvedení
      základních informací o sobě a poté si na několika stránkách podrobně
      vysvětlíme, jak bude experiment probíhat.
    </p>
  `,
  
  info1: `
    <h2>Informace o výzkumu</h2>
    <hr>
  
    <h3>Účel výzkumu</h3>
  
    <p>
      Tato studie si klade za cíl přispět k pochopení toho, jak se lidé
      rozhodují mezi alternativami na základě poskytnutých informací a jak
      se učí tyto informace při svém rozhodování využívat.
    </p>
  
    <h3>Jaká data budou sbírána</h3>
  
    <p>
      Během experimentu budete rozhodovat, kterým nežádoucím účinkem bude
      trpět fiktivní pacient po pozření multivitamínu obsahujícího určité
      chemikálie. Budeme zaznamenávat vaše rozhodnutí, reakční časy a
      základní demografické údaje (věk a gender).
    </p>
  
    <h3>Jak budou data využita</h3>
  
    <p>
      Data budou použita výhradně pro účely akademického výzkumu a
      publikování vědeckých výsledků. Anonymizovaná experimentální data (tj.
      jednotlivá rozhodnutí a reakční časy bez údajů umožňujících identifikaci
      účastníků) mohou být po ukončení projektu zveřejněna v online datových
      repozitářích a zpřístupněna dalším výzkumníkům pro ověření výsledků a
      dalšímu vědeckému využití.
    </p>
  
  `,
  
  info2: `
  <h2>Informace o výzkumu</h2>
    <hr>
    
    <h3>Ochrana soukromí a anonymita</h3>
  
    <p>
      Výsledky budou zpracovávány a zveřejňovány pouze v souhrnné nebo
      anonymizované podobě. Veřejně sdílené datové soubory nebudou obsahovat
      jméno, kontaktní údaje ani jiné informace umožňující identifikaci
      konkrétní osoby.
    </p>
    
    <h3>Uchovávání dat</h3>

    <p>
      Výzkumná data budou bezpečně uchovávána na zabezpečených serverech
      Psychologického ústavu Akademie věd ČR po dobu nezbytnou pro splnění
      účelu výzkumu a archivaci vědeckých výsledků, nejméně však po dobu
      10 let od ukončení projektu.
    </p>
  
    <h3>Odvolání souhlasu</h3>
  
    <p>
      Účast ve výzkumu je dobrovolná. Svůj souhlas můžete kdykoli odvolat
      a ukončit účast bez jakýchkoli následků. Pokud budou vaše data stále
      identifikovatelná prostřednictvím interního identifikátoru, můžete
      požádat o jejich odstranění.
    </p>
  
    <h3>Právní základ zpracování údajů</h3>
  
    <p>
      Osobní údaje jsou zpracovávány na základě vašeho souhlasu podle
      Nařízení Evropského parlamentu a Rady (EU) 2016/679 (GDPR) a zákona
      č. 110/2019 Sb., o zpracování osobních údajů.
    </p>
    `,
  
  consent: `
    <h2>Souhlas s účastí na výzkumu</h2>
    <hr>
  
    <p style="margin-bottom: 0.25em;">Potvrzuji, že:</p>
  
    <ul>
      <li>jsem si přečetl/a informace o výzkumu a porozuměl/a jim;</li>
      <li>měl/a jsem možnost se rozhodnout, zda se výzkumu zúčastním;</li>
      <li>souhlasím s dobrovolnou účastí ve výzkumu;</li>
      <li>jsem si vědom/a, že mohu kdykoli bez udání důvodu svou účast ukončit;</li>
      <li>rozumím tomu, jaká data budou sbírána a jak budou využita;</li>
      <li>souhlasím se zpracováním svých údajů pro účely tohoto výzkumu.</li>
    </ul>
  
    <p>
      Dále souhlasím s tím, že anonymizovaná data získaná v této studii
      mohou být zveřejněna v online vědeckých repozitářích a použita dalšími
      výzkumníky pro výzkumné účely.
    </p>
  
    <p>
      Beru na vědomí, že výsledky výzkumu mohou být publikovány ve vědeckých
      článcích, zprávách nebo prezentacích pouze v anonymizované nebo
      souhrnné podobě.
    </p>
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
    <hr>
    
    <p>
      Zadejte prosím svůj e-mail nebo napište „x" pro zcela anonymní účast:
    </p>
  `,

  demography: `
    <h2>Demografie</h2>
    <hr>
    
    <p>
      K jakému pohlaví se hlásíte?
    </p>
    <p>
      <select style="height:24px; font-size: 18px"; text-align-last: center; name="sex">
        <option value="female">žena</option>
        <option value="male">muž</option>
        <option value="other">jiné</option>
      </select>
    </p>
    
    <p>
      Kolik je vám let?
    </p>
    <p>
      <select style="height:24px; font-size: 16px"; text-align-last: center; name="age">
        ${Array.from({ length: 82 }, (_, i) =>
          `<option value="${i + 18}">${i + 18}</option>`).join('')}
      </select>
    </p>
  `,

  prestart: `
    <h2>Před zahájením</h2>
    <hr>
    
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
    <hr>
    
    <p>
      Nyní začne samotná experimentální část studie. Stisknutím tlačítka
      „Zahájit experiment" se otevřou dveře vaší ordinace a přivítáte svého
      prvního pacienta.
    </p>
  `,

  // Stage 1 instructions also cover Stage 2 (no break between them).
  stage1: `
    <h2>Instrukce</h2>
    <hr>
    
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
    <hr>
    
    <p>
      Skvělá práce!
    </p>
    
    <p>
      Váš úkol se nyní mírně změní. Budete pracovat s novým pacientem,
      <b>panem Y</b>, který trpí jinými nežádoucími účinky než pan X.
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
    <hr>
    
    <p>
      Výborně!
    </p>
    
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
      K vyjádření míry jistoty ve svou volbu po každé odpovědi zvolíte hodnotu
      od <b>1 („Nejsem si vůbec jistý/á")</b> do <b>10 („Jsem si velmi jistý/á")</b>.
    </p>
  `,

  farewell: `
    <h2>Děkujeme za účast ve studii diagnostického rozhodování [catlas-01]</h2>
    <hr>
    
    <p>
      Aby vám účast ve studii mohla být uznána v rámci LABELS, pořidte
      screenshot této stránky, který bude sloužit jako potvrzení účasti.
    </p>
    
    <p>
      Experiment ukončíte stisknutím tlačítka.
    </p>
  `,

  fullscreen: `
    <p>
      Vraťte se prosím do režimu celé obrazovky.
    </p>
  `,

};
