/**
 * makeTutorialTrial
 *
 * A full-screen tutorial slide backed by jsPsychHtmlButtonResponse.
 * Visual style is intentionally identical to makeInstructionTrial():
 *   - same #c1c1c1 grey background threaded through every CSS layer
 *   - same fluid typography (clamp-based), Arial, line-height 1.65
 *   - same button strip styling
 *
 * Layout adds a two-column body:
 *   LEFT  – arbitrary HTML (headings, paragraphs, lists …)
 *   RIGHT – an animated GIF (or any <img>-compatible src) with an
 *           optional caption, displayed inside a subtle inset frame
 *
 * Two-column layout uses CSS Grid (not flexbox) so the columns are
 * rigidly enforced by the browser and never accidentally wrap to rows.
 *
 * @param {object}  params
 * @param {string}  params.html                 - HTML for the left text column.
 * @param {string}  params.gifSrc               - URL or relative path to the gif.
 * @param {string}  [params.gifAlt=""]          - Alt text (accessibility).
 * @param {string}  [params.gifCaption=""]      - Optional italicised caption beneath gif.
 * @param {string}  [params.buttonText="Next"]  - Continue button label.
 * @param {number}  [params.maxDuration=120000] - Maximum trial duration in ms.
 * @param {string}  [params.columnSplit="50/50"]- Column width ratio.
 *                                                "50/50" | "40/60" | "60/40"
 *                                                (text / gif)
 */
function makeTutorialTrial({
  html,
  gifSrc,
  gifAlt       = "",
  gifCaption   = "",
  buttonText   = "Next",
  maxDuration  = 120000,
  columnSplit  = "50/50",
}) {

  /* ── grid-template-columns value from the split preset ───────────── */
  const gridCols = {
    "50/50": "1fr 1fr",
    "40/60": "2fr 3fr",
    "60/40": "3fr 2fr",
  }[columnSplit] ?? "1fr 1fr";

  /* ── Optional caption markup ──────────────────────────────────────── */
  const captionHTML = gifCaption
    ? `<p class="tut-gif-caption">${gifCaption}</p>`
    : "";

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
        .jspsych-btn:hover { background-color: #d0d0d0; }

        /* ── Outer wrapper ───────────────────────────────────────────────── */
        .tut-wrap {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #c1c1c1;
          font-family: Arial, sans-serif;
          box-sizing: border-box;
          padding: 4vh 8vw;
        }

        /* ── Two-column grid ─────────────────────────────────────────────── */
        .tut-columns {
          width: 100%;
          max-width: 1200px;
          display: grid;
          grid-template-columns: ${gridCols};
          gap: 4vw;
          align-items: center;
        }

        /* ── Left: text ──────────────────────────────────────────────────── */
        .tut-text {
          min-width: 0;
          font-size: clamp(14px, 2.2vh, 22px);
          line-height: 1.65;
          text-align: left;
        }
        .tut-text h2 {
          font-size: clamp(18px, 3.0vh, 28px);
          margin: 0 0 2vh 0;
          text-align: center;
        }
        .tut-text p  { margin: 0 0 1.4vh 0; }
        .tut-text ul,
        .tut-text ol { margin: 0 0 1.4vh 1.4em; padding: 0; }
        .tut-text li { margin-bottom: 0.6vh; }

        /* ── Right: image ────────────────────────────────────────────────── */
        .tut-gif-panel {
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .tut-gif-frame {
          width: 100%;
          margin: 5vh 0 0 0;
          background: #b0b0b0;
          border: 1px solid #999;
          border-radius: 4px;
          padding: 8px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tut-gif-frame img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 2px;
        }
        .tut-gif-caption {
          margin: 1vh 0 0 0;
          font-size: clamp(11px, 1.6vh, 16px);
          font-style: italic;
          color: #444;
          text-align: center;
          line-height: 1.4;
        }
      </style>

      <div class="tut-wrap">
        <div class="tut-columns">

          <!-- LEFT: instruction text -->
          <div class="tut-text">
            ${html}
          </div>

          <!-- RIGHT: gif demonstration -->
          <div class="tut-gif-panel">
            <div class="tut-gif-frame">
              <img src="${gifSrc}" alt="${gifAlt}" />
            </div>
            ${captionHTML}
          </div>

        </div>
      </div>
    `,
    choices: [buttonText],
    trial_duration: maxDuration,
    on_finish: function (data) { data.stimulus = null; },
  };
}
