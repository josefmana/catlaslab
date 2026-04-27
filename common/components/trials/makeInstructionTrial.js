/**
 * makeInstructionTrial
 * 
 * A full-screen instruction slide backed by jsPsychHtmlButtonResponse.
 * Visual style matches the grey background used in learning/test trials.
 * The continue button is rendered by jsPsych in its default button area.
 *
 * @param {object} params
 * @param {string} params.html                - HTML content for the instruction screen
 * @param {string} [params.buttonText="Next"] - Continue button label
 * @param {number} params.maxDuration         - Maximum duration in ms
 */
function makeInstructionTrial({
  html,
  buttonText  = "Next",
  maxDuration = 120000,
}) {
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <style>
        html, body {
          width: 100%;
          height: 100%;
          margin: 0 !important;
          padding: 0 !important;
          overflow-x: hidden;
        }
        .jspsych-display-element {
          height: 100% !important;
          background: #c1c1c1 !important;
        }
        .jspsych-content-wrapper {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .jspsych-content {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          background: #c1c1c1 !important;
        }
        .jspsych-button-box {
          background: #c1c1c1 !important;
          margin-top: 2vh !important;
          padding: 2vh 0 4vh 0 !important;
        }
        .jspsych-btn {
          background-color: #e0e0e0;
          border: 1px solid #999;
          padding: 0.75vh 2vw;
          font-size: clamp(14px, 1.8vh, 18px);
        }
        .jspsych-btn:hover {
          background-color: #d0d0d0;
        }
        .inst-wrap {
          width: 100vw;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #c1c1c1;
          font-family: Arial, sans-serif;
          box-sizing: border-box;
          padding: 4vh 8vw;
        }
        .inst-body {
          max-width: 680px; width: 100%;
          font-size: clamp(14px, 2.2vh, 22px);
          line-height: 1.65;
          text-align: left;
        }
        .inst-body h2 {
          font-size: clamp(18px, 3.0vh, 28px);
          margin: 0 0 2vh 0;
          text-align: center;
        }
        .inst-body p { margin: 0 0 1.4vh 0; }
      </style>
      <div class="inst-wrap">
        <div class="inst-body">${html}</div>
      </div>
    `,
    choices: [buttonText],
    trial_duration: maxDuration,
    on_finish: function (data) { data.stimulus = null; },
  };
}