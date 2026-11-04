/**
 * makeDebriefTrial
 *
 * A structured debriefing slide backed by jsPsychHtmlButtonResponse.
 * Visual identity is identical to the rest of the experiment (#c1c1c1,
 * Arial, clamp typography, shared .inst-body styles).
 *
 * Layout (top → bottom):
 *   1. Introductory / debrief paragraph(s)      [caller-supplied HTML]
 *   2. Horizontal rule
 *   3. Prior-knowledge yes/no question          [non-optional; blocks continue]
 *   4. Guess free-text question                 [only if guessQuestion is given;
 *                                                non-optional; blocks continue]
 *   5. Optional free-text comment field         [visible immediately; optional]
 *
 * The continue button is disabled until the participant selects Yes or No and,
 * when guessQuestion is given, writes a non-blank answer to it.
 *
 * Data written to jsPsych on finish:
 *   data.trial_type      {string}       – "debrief"
 *   data.timed_out       {boolean}      – true if the trial ended by timeout
 *   data.prior_knowledge {boolean|null} – true = yes, false = no, null = never
 *                                         answered (a choice made before a
 *                                         timeout is kept: check timed_out)
 *   data.prior_guess     {string|null}  – trimmed answer to guessQuestion, null if
 *                                         blank (timed out); only written when
 *                                         guessQuestion is given
 *   data.comment         {string}       – free-text content (may be empty string)
 *   data.stimulus        {null}         – nulled (HTML blob not stored)
 *
 * Usage
 * ─────
 *   timeline.push(makeDebriefTrial({
 *     introHtml: `
 *       <h2>Debriefing</h2>
 *       <p>Thank you for participating. The purpose of this study was to …</p>
 *     `,
 *     priorKnowledgeQuestion: "Were you previously familiar with this type of task?",
 *     priorKnowledgeOptions:  { yes: "Yes", no: "No" },
 *     detailQuestion:   "If yes, please briefly describe what you knew:",
 *     detailPlaceholder: "Optional — your answer here…",
 *     buttonText:  texts.continueText,
 *     maxDuration: times.maxInstructionDuration,
 *   }));
 *
 * @param {object}  params
 * @param {string}  params.introHtml                   - HTML for the opening debrief paragraphs.
 * @param {string}  params.priorKnowledgeQuestion      - Label for the yes/no radio group.
 * @param {object}  [params.priorKnowledgeOptions]     - Radio labels.
 * @param {string}  [params.priorKnowledgeOptions.yes="Yes"] - Affirmative option label.
 * @param {string}  [params.priorKnowledgeOptions.no="No"]   - Negative option label.
 * @param {string}  [params.guessQuestion]             - Label of a compulsory free-text
 *                                                       question (stored as prior_guess).
 *                                                       If omitted, it is not shown.
 * @param {string}  [params.guessPlaceholder]          - Placeholder inside its textarea.
 * @param {string}  [params.detailQuestion]            - Label above the free-text field.
 *                                                       If omitted the field is still shown
 *                                                       but without a label above it.
 * @param {string}  [params.detailPlaceholder]         - Placeholder inside the textarea.
 * @param {string}  [params.buttonText="Continue"]     - Continue button label.
 * @param {number}  [params.maxDuration=120000]        - Hard timeout (ms); null = no limit.
 *                                                       On timeout data.timed_out is true.
 */
function makeDebriefTrial({
  introHtml = `<hr>`,
  priorKnowledgeQuestion,
  priorKnowledgeOptions = { yes: "Yes", no: "No" },
  guessQuestion = "",
  guessPlaceholder = "",
  detailQuestion = "",
  detailPlaceholder = "",
  buttonText = "Continue",
  maxDuration = 120000,
}) {
  let _priorKnowledge       = null; // true | false | null
  let _Comment = "";
  let _Guess   = ""; // the DOM is gone by on_finish, so track input here

  const guessHTML = guessQuestion
    ? `
            <!-- Compulsory guess question -->
            <p class="db-pk-question">${guessQuestion}</p>
            <textarea
              id          = "db-guess-textarea"
              class       = "db-detail-textarea db-guess-textarea"
              placeholder = "${guessPlaceholder}"
              autocomplete= "off"
              spellcheck  = "true"
            ></textarea>
            <div class="db-spacer"></div>
      `
    : "";

  const detailLabelHTML = detailQuestion
    ? `<p class="db-detail-label">${detailQuestion}</p>`
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
          cursor: pointer;
          border-radius: 3px;
          transition: background 0.15s;
        }
        .jspsych-btn:hover:not(:disabled) { background-color: #d0d0d0; }
        .jspsych-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        /* ── Outer wrapper ── */
        .db-wrap {
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

        /* ── Content column ── */
        .db-body {
          max-width: 600px;
          width: 100%;
          font-size: clamp(14px, 2.2vh, 22px);
          line-height: 1.65;
          text-align: left;
        }
        .db-body h2 {
          font-size: clamp(18px, 3.0vh, 28px);
          margin: 2vh 0 2.5vh 0;
          text-align: center;
        }
        .db-body p  {
          margin: 0 0 2.5vh 0;
          text-align: justify;
        }
        .db-body ul { margin: 0 0 2.0vh 2.2em; padding: 0; }
        .db-body ol { margin: 0 0 1.4vh 1.4em; padding: 0; }
        .db-body li { margin-bottom: 0.5vh; }
        .db-body hr {
          border: none;
          border-top: 1px solid #aaa;
          margin: 2.4vh 0;
        }

        /* ── Prior-knowledge section ── */
        .db-pk-section {
          margin-top: 0.6vh;
        }
        .db-pk-question {
          font-size: clamp(14px, 2.2vh, 22px);
          font-weight: bold;
          margin: 0 0 1.2vh 0;
        }

        /* ── Radio group ── */
        .db-radio-group {
          display: flex;
          gap: 2.4vw;
          align-items: center;
          margin-bottom: 1.8vh;
          flex-wrap: wrap;
        }
        .db-radio-label {
          display: flex;
          align-items: center;
          gap: 0.5em;
          font-size: clamp(14px, 2.2vh, 22px);
          cursor: pointer;
          user-select: none;
        }
        .db-radio-label input[type="radio"] {
          appearance: none;
          -webkit-appearance: none;
          width:  clamp(16px, 2.0vh, 22px);
          height: clamp(16px, 2.0vh, 22px);
          border: 2px solid #888;
          border-radius: 50%;
          background: #d8d8d8;
          flex-shrink: 0;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          position: relative;
        }
        .db-radio-label input[type="radio"]:checked {
          border-color: #1a6fcc;
          background: #1a6fcc;
          box-shadow: inset 0 0 0 3px #c1c1c1;
        }
        .db-radio-label input[type="radio"]:focus-visible {
          outline: 2px solid #1a6fcc;
          outline-offset: 2px;
        }

        /* ── Free-text field ── */
        .db-detail-label {
          font-size: clamp(14px, 2.2vh, 22px);
          font-weight: bold;
          margin: 0 0 1vh 0;
        }
        .db-detail-textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 1vh 1vw;
          font-size: clamp(13px, 2.0vh, 18px);
          font-family: Arial, sans-serif;
          line-height: 1.5;
          border: 1px solid #999;
          background: #d8d8d8;
          resize: vertical;
          min-height: clamp(72px, 25vh, 216px);
          border-radius: 3px;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
        }
        .db-detail-textarea:focus {
          border-color: #555;
          background: #e4e4e4;
        }
        .db-detail-textarea::placeholder { color: #777; }
        .db-guess-textarea { min-height: clamp(56px, 12vh, 144px); }
        .db-spacer { height: 1.8vh; }
      </style>

      <div class="db-wrap">
        <div class="db-body">

          <!-- Debrief introduction -->
          ${introHtml}

          <!-- Prior knowledge question -->
          <div class="db-pk-section">
            <p class="db-pk-question">${priorKnowledgeQuestion}</p>
            
            <div class="db-radio-group" role="radiogroup">
              <label class="db-radio-label">
                <input type="radio" name="db-prior-knowledge" value="yes">
                ${priorKnowledgeOptions.yes}
              </label>
              <label class="db-radio-label">
                <input type="radio" name="db-prior-knowledge" value="no">
                ${priorKnowledgeOptions.no}
              </label>
            </div>
            ${guessHTML}
            <!-- Optional elaboration -->
            ${detailLabelHTML}
            <textarea
              id          = "db-detail-textarea"
              class       = "db-detail-textarea"
              placeholder = "${detailPlaceholder}"
              autocomplete= "off"
              spellcheck  = "true"
            ></textarea>
          </div>

        </div>
      </div>
    `,
    
    choices: [buttonText],
    trial_duration: maxDuration,

    on_load: function () {
      _priorKnowledge       = null;
      _Comment = "";
      _Guess   = "";

      const btn      = document.querySelector(".jspsych-btn");
      const radios   = document.querySelectorAll('input[name="db-prior-knowledge"]');
      const textarea = document.getElementById("db-detail-textarea");
      const guess    = document.getElementById("db-guess-textarea");

      const updateButton = () => {
        if (guess) _Guess = guess.value;
        const guessOk = !guess || _Guess.trim() !== "";
        btn.disabled  = !(_priorKnowledge !== null && guessOk);
      };
      updateButton();

      radios.forEach(radio => {
        radio.addEventListener("change", () => {
          _priorKnowledge = (radio.value === "yes");
          updateButton();
        });
      });

      if (guess) {
        guess.addEventListener("input", updateButton);
      }

      if (textarea) {
        textarea.addEventListener("input", () => {
          _Comment = textarea.value;
        });
      }
    },

    on_finish: function (data) {
      const textarea = document.getElementById("db-detail-textarea");
      if (textarea) _Comment = textarea.value;

      data.trial_type      = "debrief";
      data.stimulus        = null;
      data.timed_out       = data.response === null;
      data.prior_knowledge = _priorKnowledge; // true | false | null
      if (guessQuestion) {
        const guessText  = _Guess.trim();
        data.prior_guess = guessText === "" ? null : guessText; // string | null
      }
      data.comment         = _Comment;        // string (may be "")
    },
  };
}