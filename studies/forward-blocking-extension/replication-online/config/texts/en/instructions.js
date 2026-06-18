// ── Instruction screens ──────────────────────────────────────────────────────
//
// One entry per instruction screen shown via makeInstructionTrial.
// Keys match the screen names used in buildTimeline.
const instructions = {

  welcome: `
    <h2>Welcome to the Diagnostic Decision-Making Study<br>[catlas-01]</h2>
    <hr>
    
    <p>
      In this study, you will estimate which side effect a fictional patient
      will experience after taking a multivitamin containing certain chemicals.
      Your task will be to gradually learn which chemical causes which specific
      side effect.
    </p>
  `,

  prelude: `
    <hr>
    <p>
      The materials required for the experiment will now be loaded. Depending on
      the speed of your internet connection, this process may take anywhere from
      a few seconds to several minutes.
    </p>
    
    <p>
      Once the materials have loaded, you will be asked to read the
      <i>Informed Consent Form</i>. If you do not agree to participate, the
      experiment will end. If you agree, we will then explain in detail how the
      experiment will proceed.
    </p>
  `,

  consent: `
    <div class="consent-form">
      <h2>Informed Consent</h2>
      <hr>
      
      <p>
        I confirm that:
        <ul>
          <li>
            I have read the information describing the aims and procedures of
            the study;
          </li>
          <li>
            I voluntarily agree to participate in this research;
          </li>
          <li>
            I understand that I may withdraw from the study at any time;
          </li>
          <li>
            I understand that any use or publication of the data and results
            obtained in this research does not entitle me to any compensation,
            and that I grant permission for their free use and publication.
          </li>
        </ul>
      </p>
      <p>
        I further declare that:
        <ul>
          <li>
            I agree to the publication and further use of anonymized data and
            research findings;
          </li>
          <li>
            I consent to the processing and storage of personal and sensitive
            information provided in this consent form by the Institute of
            Psychology of the Czech Academy of Sciences for the purposes of data
            processing, possible follow-up contact related to data processing,
            invitations to similar studies, and record-keeping and archiving. I
            understand that these data may be provided to entities authorised to
            supervise the project under which this research is conducted;
          </li>
          <li>
            I have been informed of my rights concerning access to and
            protection of personal data under applicable legislation. I may
            request information regarding the processing of my personal data,
            obtain such information, request corrections of inaccurate data, and
            request the completion, restriction, or deletion of my data.
          </li>
        </ul>
      </p>
      
      <p>
        I grant the above authorizations and consents voluntarily for an
        indefinite period until withdrawn and undertake not to withdraw them
        without a serious reason arising from a substantial change in
        circumstances.
      </p>
      
    </div>
  `,

  declineConsent: `
    <p>
      The experiment has been terminated because the participation conditions
      were not accepted.
    </p>
    
    <p>
      For further information, please contact the study author: mana@psu.cas.cz.
    </p>
  `,

  email: `
    <h2>Registration</h2>
    <hr>
    
    <p>
      Please enter your email address, or type "x" to participate anonymously:
    </p>
  `,

  demography: `
    <h2>Demographics</h2>
    <hr>
    
    <p>
      What is your gender?
    </p>
    <p>
      <select style="height:24px; font-size: 18px"; text-align-last: center; name="sex">
        <option value="female">Woman</option>
        <option value="male">Man</option>
        <option value="other">Other</option>
      </select>
    </p>
    
    <p>
      How old are you?
    </p>
    <p>
      <select style="height:24px; font-size: 16px"; text-align-last: center; name="age">
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
    <h2>Instrukce</h2>
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
    <h2>Thank You for Participating in the Diagnostic Decision-Making Study [catlas-01]</h2>
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
