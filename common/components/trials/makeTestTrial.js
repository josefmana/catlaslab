/**
 * makeTestTrial
 * 
 * A single jsPsych trial for the test phase, handled in one uninterrupted DOM.
 * Structurally mirrors makeLearningTrial but replaces feedback with an inline
 * confidence Likert scale (1–10).
 *
 * Flow:
 *   1. Participant sees the two cues and two outcome images with a disabled OK
 *      button (identical response-phase layout to Stages 2–3).
 *   2. They click an outcome image (selection highlighted in black) which
 *      enables the OK button; they then click OK.
 *   3. Without any DOM teardown:
 *      - Images are locked (pointer-events off), selection border is kept.
 *      - The outcome question and click-instruction text are hidden.
 *      - The OK button is hidden (visibility:hidden, not display:none,
 *        so the centre-slot width is preserved).
 *      - A confidence Likert scale (1–10) slides into view below the images.
 *   4. Participant clicks a rating button (1–10); the trial ends immediately,
 *      recording response, correct, is_correct, and confidence.
 *   If `times.maxTestTrialDuration` elapses at any point, jsPsych ends the trial
 *   with timed_out: true and all response fields null.
 *
 * @param {object}   params
 * @param {string[]} params.cue         - Exactly two cue keys, e.g. ["B","T"]
 * @param {string[]} params.outcome     - Exactly two outcome keys
 * @param {string}   params.correct     - The outcome key the design predicts
 * @param {string}   params.stage       - Label stored in the data record
 * @param {number}   params.block      - Block count
 * @param {string}   params.type        - Label stored in the data record
 * @param {object}   params.cueMap      - Maps cue key → cue image path
 * @param {object}   params.outcomeMap  - Maps outcome key → outcome image path
 * @param {object}   params.texts
 * @param {string}   params.texts.cueText           - Text above the cue(s)
 * @param {string}   params.texts.promptText        - Bold question in the middle
 * @param {string}   params.texts.promptInstruction - Smaller instruction below the question
 * @param {string}   params.texts.testPromptText    - Confidence question shown in phase 2
 * @param {string[]} params.texts.confidenceText    - ["Low anchor label", "High anchor label"]
 * @param {object}   params.times
 * @param {number}   [params.times.maxTestTrialDuration=null] - Hard timeout (ms); null = no limit
 */
function makeTestTrial({
  cue,
  outcome,
  correct,
  stage,
  block,
  type,
  cueMap,
  outcomeMap,
  texts,
  times,
}) {
  const { cueText, promptText, promptInstruction, testPromptText, confidenceText } = texts;
  const { maxTestTrialDuration: maxTrialDuration = null } = times;
  
  return {
    type: jsPsychHtmlButtonResponse,
    trial_duration: null, // ensure plugin does not race against on_load's timer
    stimulus: `
      <style>
        html, body {
          width: 100%; height: 100%;
          margin: 0 !important; padding: 0 !important;
          overflow: hidden;
        }
        .jspsych-display-element,
        .jspsych-content-wrapper,
        .jspsych-content {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        .lt-wrap {
          width: 100vw; height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          box-sizing: border-box;
          padding: 2vh 3vw 3vh;
          background: #c8c8c8;
          font-family: Arial, sans-serif;
        }
        .lt-spacer-top { flex: 3; min-height: 0; }
        .lt-spacer-mid { flex: 1; min-height: 0; }

        /* ── top ── */
        .lt-top {
          text-align: center;
          padding-top: 3vh;
          flex-shrink: 0;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        .lt-top p {
          font-size: clamp(14px, 2.6vh, 26px);
          margin: 0 0 1vh 0;
          white-space: nowrap;
        }
        .lt-cue-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3vw;
        }
        .lt-cue-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8vh;
        }
        .lt-cue-img {
          width:  clamp(100px, 12vw, 200px);
          height: clamp(100px, 12vw, 200px);
          object-fit: contain;
        }
        .lt-and {
          font-size: clamp(16px, 6.0vh, 40px);
          font-weight: normal;
        }

        /* ── middle ── */
        /*
         * .lt-middle acts as a swap-container: in phase 1 it shows
         * #lt-prompt-block; in phase 2 that block is set to display:none
         * and #lt-confidence-wrap (a sibling inside this same div) is set
         * to display:flex. Because both children live here, the outcomes
         * below never move regardless of which block is visible.
         */
        .lt-middle {
          text-align: center;
          flex-shrink: 0;
        }
        .lt-middle p.lt-q {
          font-size: clamp(14px, 2.8vh, 26px);
          font-weight: bold;
          margin: 0 0 0.6vh 0;
        }
        .lt-middle p.lt-hint {
          font-size: clamp(11px, 2.2vh, 18px);
          margin: 0;
        }

        /* ── bottom ── */
        .lt-bottom {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(20px, 4vw, 80px);
          flex-shrink: 0;
          padding-bottom: 5vh;
        }
        .lt-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1vh;
          cursor: pointer;
        }
        .lt-option-img-wrap {
          border: 4px solid transparent;
          outline: 6px solid transparent;
          outline-offset: 2px;
          border-radius: 6px;
          overflow: hidden;
          transition: border-color 0.15s, outline-color 0.15s;
        }
        /* participant selection — shown in both phases */
        .lt-option-img-wrap.selected {
          border-color: #000;
          outline-color: #c8c8c8;
        }
        .lt-option img {
          display: block;
          width: clamp(80px, 20vw, 260px);
          height: clamp(88px, 22vw, 284px);
          object-fit: contain;
          background: #fff;
        }

        /* ── Centre slot: fixed size prevents layout shift when OK is hidden ── */
        #lt-centre-slot {
          flex-shrink: 0;
          width: clamp(80px, 10vw, 140px);
          height: clamp(30px, 5vh, 60px);
          display: grid;
          align-items: center;
          justify-items: center;
          overflow: visible;
        }
        #lt-centre-slot > * { grid-area: 1 / 1; }

        /* ── OK button ── */
        #lt-ok-btn {
          font-size: clamp(13px, 2.2vh, 20px);
          padding: 1vh 2.5vw;
          border: 2px solid #555;
          background: #e8e8e8;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.15s;
        }
        #lt-ok-btn:hover  { background: #d0d0d0; }
        #lt-ok-btn:disabled { opacity: 0.45; cursor: default; }

        /* ── Confidence scale (hidden until after OK; lives inside .lt-middle) ── */
        #lt-confidence-wrap {
          display: none;
          flex-direction: column;
          align-items: center;
          gap: 1.6vh;
        }
        #lt-confidence-wrap.visible {
          display: flex;
        }
        .lt-conf-prompt {
          font-size: clamp(14px, 2.8vh, 26px);
          font-weight: bold;
          margin: 0;
          text-align: center;
        }
        .lt-conf-scale {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6vh;
          width: 100%;
        }
        .lt-conf-buttons {
          display: flex;
          gap: clamp(4px, 0.7vw, 10px);
        }
        .lt-conf-btn {
          width:  clamp(28px, 3.8vw, 52px);
          height: clamp(28px, 3.8vw, 52px);
          font-size: clamp(12px, 2.0vh, 20px);
          border: 2px solid #555;
          background: #e8e8e8;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.12s;
        }
        .lt-conf-btn:hover    { background: #bbb; }
        .lt-conf-btn.selected { background: #1a6fcc; color: #fff; border-color: #1a6fcc; }
        .lt-conf-labels {
          display: flex;
          justify-content: space-between;
          width: calc(10 * clamp(28px, 3.8vw, 52px) + 9 * clamp(4px, 0.7vw, 10px));
          font-size: clamp(10px, 2.0vh, 15px);
          color: #444;
          padding-top: 0.2vh;
        }
      </style>

      <div class="lt-wrap">

        <div class="lt-top">
          <p>${cueText}</p>
          ${renderCues({ cue, cueMap })}
        </div>

        <div class="lt-spacer-top"></div>

        <div class="lt-middle">
          <div id="lt-prompt-block">
            <p class="lt-q">${promptText}</p>
            <p class="lt-hint">${promptInstruction}</p>
          </div>
          <div id="lt-confidence-wrap">
            <p class="lt-conf-prompt">${testPromptText}</p>
            <div class="lt-conf-scale">
              <div class="lt-conf-buttons">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                  .map(n => `<button class="lt-conf-btn" data-rating="${n}">${n}</button>`)
                  .join("")}
              </div>
              <div class="lt-conf-labels">
                <span>${confidenceText[0]}</span>
                <span>${confidenceText[1]}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="lt-spacer-mid"></div>

        <div class="lt-bottom">
          <div class="lt-option" data-key="${outcome[0]}" id="lt-opt-0">
            <div class="lt-option-img-wrap" id="lt-wrap-0">
              <img src="${outcomeMap[outcome[0]]}" alt="${outcome[0]}">
            </div>
          </div>

          <div id="lt-centre-slot">
            <button id="lt-ok-btn" disabled>OK</button>
          </div>

          <div class="lt-option" data-key="${outcome[1]}" id="lt-opt-1">
            <div class="lt-option-img-wrap" id="lt-wrap-1">
              <img src="${outcomeMap[outcome[1]]}" alt="${outcome[1]}">
            </div>
          </div>
        </div>

      </div>
    `,
    choices: "NO_KEYS",
    on_finish: function (data) {
      data.stimulus = null;
      if (data.response === null) {
        data.timed_out  = true;
        data.stage      = stage;
        data.type       = type;
        data.cues       = cue.join("");
        data.response   = null;
        data.correct = correct;
        data.is_correct = null;
        data.confidence = null;
        data.rt1        = null;
        data.rt2        = null;
      } else {
        data.timed_out = false;
      }
    },
    on_load: function () {
      let selected   = null;
      let confidence = null;
      let done       = false;
      let t0 = performance.now();
      let t1;
      let phase = 1;

      const options       = document.querySelectorAll(".lt-option");
      const okBtn         = document.getElementById("lt-ok-btn");
      const promptBlock   = document.getElementById("lt-prompt-block");
      const confWrap      = document.getElementById("lt-confidence-wrap");
      const confBtns      = document.querySelectorAll(".lt-conf-btn");
      
      function finishOnce(data) {
        if (done) return;
        done = true;
        jsPsych.finishTrial(data);
      }
      
      // ── Hard timeout ───────────────────────────────────────────────────────
      if (maxTrialDuration !== null) {
        jsPsych.pluginAPI.setTimeout(() => {
          finishOnce({
            timed_out:       true,
            stage,
            block,
            type,
            cues:            cue.join(""),
            response:        null,
            correct_outcome: correct,
            is_correct:      null,
            confidence:      null,
            rt1:             null,
            rt2:             null,
          });
        }, maxTrialDuration);
      }

      // ── Phase 1: Response selection ────────────────────────────────────────
      options.forEach((opt) => {
        opt.addEventListener("click", () => {
          document.querySelectorAll(".lt-option-img-wrap")
            .forEach(w => w.classList.remove("selected"));
          opt.querySelector(".lt-option-img-wrap").classList.add("selected");
          selected = opt.dataset.key;
          okBtn.disabled = false;
        });
      });
      
      // ── Phase 2: Confidence rating ───────────────────────────────────
      confBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          confBtns.forEach(b => b.classList.remove("selected"));
          btn.classList.add("selected");
          confidence = parseInt(btn.dataset.rating, 10);
          okBtn.disabled = false;
        });
      });

      // ── Single OK handler — branches on phase ──────────────────────────────
      okBtn.addEventListener("click", () => {
        if (phase === 1) {
          if (selected === null) return;
          const rt1 = performance.now() - t0;

          // 1. Lock outcome images; keep the selection border visible.
          options.forEach(opt => opt.style.pointerEvents = "none");

          // 2. Swap the middle slot; keep OK button visible but disabled
          //    until a confidence rating is chosen.
          promptBlock.style.display = "none";
          confWrap.classList.add("visible");
          okBtn.disabled = true;

          // 3. Advance phase and start Type 2 clock.
          phase = 2;
          t1 = performance.now();

          // Store rt1 for use when phase 2 completes.
          okBtn.dataset.rt1 = rt1;

        } else {
          if (confidence === null) return;
          const rt2 = performance.now() - t1;  // Type 2 decision time

          confBtns.forEach(b => b.style.pointerEvents = "none");
          okBtn.disabled = true;

          finishOnce({
            timed_out:   false,
            stage,
            block,
            type,
            cues:            cue.join(""),
            response:        selected,
            correct_outcome: correct,
            is_correct:      selected === correct,
            confidence,
            rt1:             parseFloat(okBtn.dataset.rt1),
            rt2,
          });
        }
      });
    },
  };
}
