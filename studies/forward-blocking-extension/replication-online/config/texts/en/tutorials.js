// ── Tutorial pages ───────────────────────────────────────────────────────────
//
// Shown sequentially via makeTutorialTrial before the experiment starts.
// Paired with images from images.js (tutorial1–tutorial4).
const tutorials = {

  page1: `
    <h2>Tutorial</h2>
    <hr>
    
    <p>
      In this experiment, you will take on the role of an allergist.
    </p>
    
    <p>
      You will be shown a chemical contained in a multivitamin tablet that your
      patient has taken (image and text at the top of the screen).
    </p>
    
    <p>
      Your task will be to choose which of two side effects (displayed below)
      you think the patient will experience after taking the multivitamin.
    </p>
  `,

  page2: `
    <h2>Tutorial</h2>
    <hr>
    
    <p>
      <b>You will record your answer as follows:</b>
    </p>
    
    <p>
      <ol>
        <li>Click on your chosen answer.</li>
        <li>The selected answer will be outlined with a thin black border.</li>
        <li>Click the "OK" button in the center of the screen.</li>
      </ol>
    </p>
    
    <p>
      Until you press the "OK" button, you may change your selection as often as
      you wish (see the example on the right).
    </p>
    
    <p>
      <b>After confirming your answer, you will receive feedback:</b>
      <ul>
        <li>the correct answer will be highlighted with a blue border,</li>
        <li>if your answer is correct, you will see the green message "Correct",
        </li> <li>if your answer is incorrect, you will see the red message "Wrong".</li>
      </ul>
    </p>
    
    <p>
      You will always have <b>1 minute</b> to provide your answer. Once the time
      limit expires or your answer has been submitted, the experiment will
      automatically advance to the next trial.
    </p>
  `,

  page3: `
    <h2>Tutorial</h2>
    <hr>
    
    <p>
      In some cases, the patient will consume a multivitamin containing only one
      suspect chemical (as on the previous page); in other cases, the multivitamin
      may contain two chemicals.
    </p>
    
    <p>
      Your task remains the same regardless of the number of chemicals. Always
      try to estimate which of the two side effects the patient will experience.
    </p>
  `,

  page4: `
    <h2>Tutorial</h2>
    <hr>
    
    <p>
      At the end of the experiment, we will test your knowledge of the chemicals
      you encountered in your role as an allergist. In this part of the study,
      you will no longer receive feedback.
    </p>

    <p>
      Instead, you will rate how confident you are in your answer.
    </p>
    
    <p>
      <b>The procedure will be as follows:</b>
    </p>
      <ol>
        <li>Click on your chosen answer.</li>
        <li>The selected answer will be outlined with a thin black border.</li>
        <li>Click the "OK" button.</li> <li>A 10-point scale will appear.</li>
        <li>Indicate how confident you are that your answer is correct.</li>
        <li>Your selected rating will be highlighted in blue.</li>
        <li>Click "OK" again to proceed to the next trial.</li>
      </ol>
    
    <p>
      Until you press the "OK" button, you may change your selection as often as
      you wish.
    </p>
  `,

};
