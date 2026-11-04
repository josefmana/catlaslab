/**
 * makeInstructionTrial
 * 
 * A full-screen instruction slide backed by jsPsychHtmlButtonResponse.
 * Visual style matches the grey background used in learning/test trials.
 * The continue button is rendered by jsPsych in its default button area.
 * 
 * Optionally accepts a `terminateButton` descriptor. When provided, a second
 * button is rendered to the left of the continus button. Clicking this button
 * calls `jsPsych.abortExperiment()` with a supplied HTML message, permanently
 * ending the session. This is the intended mechanism for informed-consent
 * decline.
 *
 * @param {object} params
 * @param {string} params.html                       - HTML content for the instruction screen
 * @param {string} [params.buttonText="Next"]        - Continue button label
 * @param {number} [params.maxDuration=12000]        - Maximum duration in ms
 * @param {string} [params.textAlign="left"]         - Text alignment
 * @param {string} [params.trialType="instructions"] - Label for jsPsych exported trial_type
 * @param {object} [params.terminateButton=null]     - When provided, renders a second "decline" button
 * @param {string} params.terminateButton.label      - Button label (e.g. "I do not consent")
 * @param {string} params.terminateButton.message    - Full HTML shown after termination;
 *                                                     displayed by jsPsych.endExperiment().
 *                                                     Styled automatically to match the
 *                                                     experiment's grey theme. The trial
 *                                                     then records `data.terminated = true`.
 *
 * Form fields in `html` (select, input, textarea) are harvested by their `name`
 * into the trial data. Fields marked `required` keep the continue button disabled
 * until each holds a non-empty value; a required field left empty (e.g. on
 * timeout) is recorded as null.
 */
function makeInstructionTrial({
  html,
  buttonText  = "Next",
  maxDuration = 120000,
  textAlign = "left",
  trialType = "instructions",
  terminateButton = null,
}) {
  const choices = terminateButton
    ? [terminateButton.label, buttonText]
    : [buttonText];
  
  function buildTerminationScreen(message) {
    return `
      <style>
        html, body {
          width: 100%; height: 100%;
          margin: 0 !important; padding: 0 !important;
          background: #c1c1c1;
          font-family: Arial, sans-serif;
          display: flex; align-items: center; justify-content: center;
        }
      </style>
      <div style="
        max-width: clamp(600px, 42vw, 820px);
        width: 90%;
        font-size: clamp(14px, 2.2vh, 22px);
        line-height: 1.65;
        text-align: center;
        padding: 6vh 4vw;
        box-sizing: border-box;
      ">
        ${message}
      </div>
    `;
  }
  
  let _formData = {};
  
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
          margin-top: 0vh !important;
          padding: 0.5vh 0 3vh 0 !important;
          display: flex !important;
          justify-content: center !important;
          gap: 1.6vw !important;
        }
        .jspsych-btn {
          background-color: #e0e0e0;
          border: 1px solid #999;
          padding: 0.75vh 2vw;
          font-size: clamp(14px, 1.8vh, 18px);
          cursor: pointer;
          border-radius: 3px;
          transition: background 0.15s;
          margin-bottom: 2vh !important;
        }
        .inst-btn-terminate {
          background-color: #e8d5d5 !important;
          border-color: #b06060 !important;
          color: #6b2020 !important;
        }
        .inst-btn-terminate:hover {
          background-color: #d9baba !important;
        }
        .jspsych-btn:hover {
          background-color: #d0d0d0;
        }
        .jspsych-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
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
          padding: 3vh 8vw 1vh 8vw;
        }
        .inst-body {
          max-width: clamp(600px, 42vw, 820px);
          width: 100%;
          font-size: clamp(14px, 2.2vh, 22px);
          line-height: 1.5;
          text-align: ${textAlign};
        }
        .inst-body h2 {
          font-size: clamp(18px, 3.0vh, 28px);
          margin: 2vh 0 2.5vh 0;
          text-align: center;
        }
        .inst-body h3 {
          margin-top: 1em;
          margin-bottom: 0.2em;
        }
        .inst-body p {
          margin: 0 0 2.5vh 0;
          text-align: ${textAlign};
        }
        .inst-body ul { margin: 0 0 2.0vh 2.2em; padding: 0; }
        .inst-body ol { margin: 0 0 1.4vh 1.4em; padding: 0; }
        .inst-body li { margin-bottom: 0.5vh; }
        .inst-body hr {
          border: none;
          border-top: 1px solid #aaa;
          margin: 2vh 0;
        }
      </style>
      
      <div class="inst-wrap">
        <div class="inst-body">${html}</div>
      </div>
    `,
    choices,
    trial_duration: maxDuration,
    
    on_load: function () {
      _formData = {};
      const container = document.querySelector(".inst-body");
      if (!container) return;
      
      if (container.querySelector(".consent-form")) {
        container.classList.add("consent-body");
      };
      
      // Register all named form elements so on_finish can harvest them.
      container.querySelectorAll("select, input, textarea").forEach(el => {
        if (el.name) _formData[el.name] = el;
      });

      // Keep the continue button (always the last one) disabled until every
      // required field holds a value.
      const required = container.querySelectorAll("[required]");
      if (required.length > 0) {
        const btns        = document.querySelectorAll(".jspsych-btn");
        const continueBtn = btns[btns.length - 1];
        const check = () => {
          continueBtn.disabled =
            ![...required].every(el => String(el.value).trim() !== "");
        };
        required.forEach(el => {
          el.addEventListener("change", check);
          el.addEventListener("input",  check);
        });
        check();
      }
 
      // Apply the distinctive style to the terminate button (index 1).
      if (terminateButton) {
        const btns = document.querySelectorAll(".jspsych-btn");
        if (btns.length >= 2) btns[0].classList.add("inst-btn-terminate");
      }
    },
 
    on_finish: function (data) {
      data.trial_type = trialType;
      data.stimulus   = null;
 
      Object.entries(_formData).forEach(([name, el]) => {
        if (el.type === "checkbox") {
          data[name] = el.checked;
        } else if (el.type === "radio") {
          if (el.checked) data[name] = el.value;
        } else if (el.required && el.value === "") {
          data[name] = null;
        } else {
          data[name] = el.value;
        }
      });
 
      if (terminateButton && data.response === 0) {
        data.terminated = true;
        jsPsych.endExperiment(buildTerminationScreen(terminateButton.message));
      }
    },
  };
}