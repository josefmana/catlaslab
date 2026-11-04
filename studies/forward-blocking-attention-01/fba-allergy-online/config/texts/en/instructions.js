// ── Instruction screens ──────────────────────────────────────────────────────
//
// One entry per instruction screen shown via makeInstructionTrial.
// Keys match the screen names used in buildTimeline.
const instructions = {

  welcome: `
    <h2>Welcome to the Diagnostic Decision-Making Study<br>[catlas\u200D-02]</h2>
    <hr>
    
    <p>
      In this study, you will estimate which side effect a fictional patient
      will experience after taking a multivitamin containing certain chemicals.
      Your task will be to gradually learn which chemical causes which specific
      side effect.
    </p>
    
    <p style="margin-bottom: 0.25em;">Before you start:</p>
    
    <ul>
      <li>please set aside about <b>25 to 30 minutes</b>;</li>
      <li>make sure you have a <b>stable internet connection</b>;</li>
      <li>choose a <b>quiet environment</b> where nothing will disturb you
          throughout.</li>
    </ul>
  `,

  prelude: `
    <hr>
    <p>
      The materials required for the experiment will now be loaded. This process
      may take several seconds to a few minutes depending on the speed of your
      internet connection.
    </p>
  
    <p>
      Once the materials have been loaded, you will be asked to read the
      <i>Study Information</i> and the <i>Consent to Participate</i> form.
      We will then explain in detail how the experiment will proceed.
    </p>
  `,
  
  info1: `
    <h2>Study Information</h2>
    <hr>

    <h3>Purpose of the Study</h3>
  
    <p>
      This study aims to contribute to our understanding of how people make
      decisions between alternatives based on available information and how
      they learn to use such information in their decision making.
    </p>

    <h3>What Data Will Be Collected</h3>
  
    <p>
      During the experiment, you will decide which side effect will affect a
      fictional patient after consuming a multivitamin containing certain
      chemicals. We will record your decisions, response times, how confident
      you are in your answers, your answers to the final questions, basic
      demographic information (age and sex) and technical information about
      your browser (browser type and version, operating system, window size).
      If you provide your email address, we will use it solely to confirm your
      participation within LABELS.
    </p>
  `,
  
  info2: `
    <h2>Study Information</h2>
    <hr>

    <h3>How the Data Will Be Used</h3>
  
    <p>
      The data will be used exclusively for academic research and the
      publication of scientific findings. Anonymised data (individual
      decisions, response times, confidence ratings, yes/no answers to the
      final questions and technical information about the browser) will be
      made public, possibly before the project ends, as part of the openly
      available research software package <i>catlasr</i> for the R language
      and in online data repositories. Age and sex will be published only in
      aggregate as averages for the whole group of participants. Email
      addresses, platform identifiers and your free-text answers will not be
      published.
    </p>

    <h3>Privacy and Anonymity</h3>
  
    <p>
      During data processing, we will separate email addresses from your
      answers. Your answers will then carry only an identifier that cannot be
      linked to you. Results will be processed and reported only in
      aggregated or anonymised form.
    </p>
  `,

  info3: `
    <h2>Study Information</h2>
    <hr>

    <h3>Data Storage</h3>
  
    <p>
      During data collection, the data are stored on the MindProbe server
      (mindprobe.eu), which hosts online experiments. Afterwards, they will be
      securely stored on protected servers of the Institute of Psychology of
      the Czech Academy of Sciences for as long as necessary to fulfil the
      purposes of the research and scientific record keeping, but for no less
      than 10 years following completion of the project. Email addresses will
      be deleted once we have passed the confirmation of your participation to
      the LABELS lecturers.
    </p>
    
    <h3>Legal Basis for Data Processing</h3>
  
    <p>
      Personal data are processed by the Institute of Psychology of the Czech
      Academy of Sciences as the controller, on the basis of your consent in
      accordance with Regulation (EU) 2016/679 of the European Parliament and
      of the Council (GDPR) and Czech Act No. 110/2019 Coll., on the
      processing of personal data. You have the right to access, rectify and
      erase your data and to restrict their processing, and the right to lodge
      a complaint with the Czech Office for Personal Data Protection
      (www.uoou.cz).
    </p>
  `,
  
  info4: `
    <h2>Study Information</h2>
    <hr>
    
    <h3>Voluntary Participation and Withdrawal of Consent</h3>
  
    <p>
      Participation is voluntary. If you do not give consent on the next page,
      the experiment ends and the data recorded up to then will be deleted.
      You may stop at any time without giving a reason by closing the browser
      window; the data recorded up to that point may be used in the research.
      As long as your data can be linked to your email address, you may
      request that they be deleted. Once anonymised, and if you take part
      without giving an email address from the start, the data cannot be
      traced and therefore cannot be deleted.
    </p>

    <h3>Contact</h3>
    
    <p>
      Principal investigator: Josef Mana, Institute of Psychology of the Czech
      Academy of Sciences, josef.mana@psu.cas.cz.
    </p>
  `,
  
  consent: `
    <h2>Consent to Participate in Research</h2>
    <hr>
  
    <p style="margin-bottom: 0.25em;">I confirm that:</p>
  
    <ul>
      <li>I am at least 18 years old;</li>
      <li>I have read and understood the information about the study;</li>
      <li>I have had the opportunity to decide whether to participate;</li>
      <li>I voluntarily agree to participate in this research;</li>
      <li>I understand that I may withdraw from the study at any time without providing a reason;</li>
      <li>I understand what data will be collected and how they will be used;</li>
      <li>I consent to the processing of my data for the purposes of this research.</li>
    </ul>
  
    <p>
      I further agree that anonymised data collected in this study will be
      made public in the <i>catlasr</i> package and in online scientific
      repositories, where anyone may use them for any purpose, and I
      understand that once anonymised, they can no longer be deleted.
    </p>
  
    <p>
      I understand that the results of this research may be published in
      scientific articles, reports, or presentations only in anonymised or
      aggregated form.
    </p>
  `,


  declineConsent: `
    <p>
      The experiment has ended because you did not give consent to take part
      in the study. The data recorded so far have been deleted, and you may
      now close the browser window.
    </p>
    
    <p>
      For further information, please contact the study author:
      josef.mana@psu.cas.cz.
    </p>
  `,

  email: `
    <h2>Registration</h2>
    <hr>
    
    <p>
      Please enter your email address, or type "x" to participate anonymously.
      We will use the email address solely to confirm your participation
      within LABELS:
    </p>
  `,

  demography: `
    <h2>Demographics</h2>
    <hr>
    
    <p>
      What is your sex?
    </p>
    <p>
      <select name="sex" required style="height:24px; font-size:18px; text-align-last:center;">
        <option value="" disabled selected>select</option>
        <option value="female">Woman</option>
        <option value="male">Man</option>
        <option value="other">Other</option>
      </select>
    </p>
    
    <p>
      How old are you?
    </p>
    <p>
      <select name="age" required style="height:24px; font-size:16px; text-align-last:center;">
        <option value="" disabled selected>select</option>
        ${Array.from({ length: 82 }, (_, i) =>
          `<option value="${i + 18}">${i + 18}</option>`).join('')}
      </select>
    </p>
  `,

  prestart: `
    <h2>Before You Begin</h2>
    <hr>
    
    <p>
      During the experiment:
      <ul>
        <li><b>do not take notes</b>; please rely on your own judgment,</li>
        <li><b>do not rush</b>; accuracy is more important than speed,</li>
        <li>remain in full-screen mode</b>.</li>
      </ul>
    </p>
  `,

  start: `
    <h2>Let's Begin</h2>
    <hr>
    
    <p>
      The experimental part of the study will now begin. By pressing the "Start
      Experiment" button, you will open the doors of your office and welcome
      your first patient.
    </p>
  `,

  // Stage 1 instructions also cover Stage 2 (no break between them).
  stage1: `
    <h2>Instructions</h2>
    <hr>
    
    <p>
      Your task is to estimate which of two side effects your patient,
      <b>Mr. X</b>, will experience after taking a multivitamin containing
      certain chemicals.
    </p>
    
    <p>
      At first, your responses will largely be guesses, but with the help of
      feedback you will gradually improve and your predictions will become
      increasingly accurate.
    </p>
  `,

  stage3: `
    <h2>Instructions</h2>
    <hr>
    
    <p>
      Great job!
    </p>
    
    <p>
      Your task will now change slightly. You will work with a new patient,
      <b>Mr. Y</b>, who experiences different side effects than Mr. X.
    </p>
    
    <p>
      As before, you will use the chemical composition of the multivitamin to
      estimate which side effect your new patient will experience.
    </p>
    
    <p>
      In this part as well, you will gradually improve through the feedback you
      receive after each response.
    </p>
  `,

  test: `
    <h2>Instructions</h2>
    <hr>
    
    <p>
      Excellent!
    </p>
    
    <p>
      You are about to complete the final part of the experiment. We will now
      test your <b>knowledge of Mr. Y's reactions</b>.
    </p>
    
    <p>
      You will see the chemical composition of a multivitamin, and your task
      will once again be to estimate which of two side effects the patient will
      experience.
    </p>
    
    <p>
      Unlike the previous part, however, you will <b>no longer receive
      feedback</b>. Instead, you will rate how confident you are in your answer.
    </p>
    
    <p>
      After each response, you will indicate your confidence on a scale from
      <b>1 ("Not confident at all")</b> to <b>10 ("Very confident")</b>.
    </p>
  `,

  farewell: `
    <h2>Thank You for Participating in the Diagnostic Decision-Making Study [catlas\u200D-02]</h2>
    <hr>
    
    <p>
      Press the button below to exit the experiment.
    </p>
  `,

  fullscreen: `
    <p>
      Please return to full-screen mode.
    </p>
  `,

};
