/**
 * enterFullscreen
 *
 * A fullscreen-enter slide backed by jsPsychFullscreen.
 *
 * @param {object}   params
 * @param {string}   params.message                 - HTML message shown on the slide
 * @param {boolean}  [params.fullscreenMode=true]   - true = enter, false = exit
 * @param {string}   [params.buttonText="Next"]     - Continue button label
 * @param {string}   [params.textAlign="left"]         - Text alignment
 * @param {function} [params.setFullscreenExpected] - Function for working with initExperiment
 * @param {function} [params.onStart]               - Optional extra on_start callback
 * @param {function} [params.onFinish]              - Optional extra on_finish callback
 */
function enterFullscreen({
  message,
  buttonText = "Next",
  textAlign  = "left",
  setFullscreenExpected,
  onStart,
  onFinish,
} = {}) {

  const STYLE_ID = "__fullscreen_trial_style__";

  const css = `
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
    .jspsych-content button {
      background-color: #e0e0e0;
      border: 1px solid #999;
      padding: 0.75vh 2vw;
      font-size: clamp(14px, 1.8vh, 18px);
      cursor: pointer;
      margin-top: 0vh;
    }
    .jspsych-content button:hover { background-color: #d0d0d0; }
    
    .fs-trial-wrap {
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
    .fs-trial-body {
      max-width: clamp(600px, 42vw, 820px); width: 100%;
      font-size: clamp(14px, 2.2vh, 22px);
      line-height: 1.65;
      text-align: ${textAlign}
    }
    .fs-trial-body h2 {
      font-size: clamp(18px, 3.0vh, 28px);
      margin: 0 0 2vh 0;
      text-align: center;
    }
    .fs-trial-body hr {
      border: none;
      border-top: 1px solid #aaa;
      margin: 2vh 0;
    }
    .fs-trial-body p { margin: 0 0 1.4vh 0; }
  `;

  function injectStyle() {
    if (!document.getElementById(STYLE_ID)) {
      const tag = document.createElement("style");
      tag.id = STYLE_ID;
      tag.textContent = css;
      document.head.appendChild(tag);
    }
  }

  function removeStyle() {
    const tag = document.getElementById(STYLE_ID);
    if (tag) tag.remove();
  }

  return {
    type:            jsPsychFullscreen,
    fullscreen_mode: true,
    button_label:    buttonText,
    message: `
      <div class="fs-trial-wrap">
        <div class="fs-trial-body">${message}</div>
      </div>
    `,
    on_start: function () {
      injectStyle();
      if (typeof setFullscreenExpected === "function") {
        setFullscreenExpected(true);
      };
      if (typeof onStart === "function") onStart();
    },
    on_finish: function (data) {
      removeStyle();
      data.stimulus = null;
      if (typeof onFinish === "function") onFinish(data);
    },
  };
}
