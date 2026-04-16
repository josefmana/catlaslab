/**
 * makeLearningTrial
 * A single jsPsych trial that handles both response collection AND feedback
 * in one uninterrupted DOM — eliminating the inter-trial lag that appears
 * when feedback is a separate trial.
 *
 * Flow:
 *   1. Participant sees the cue(s) and two outcome images with an OK button.
 *   2. They click an image (selection highlighted in black) then click OK.
 *   3. Without any DOM teardown, the OK button is replaced inline by
 *      "Správně" (green) or "Špatně" (red), and the correct image gets a
 *      bold blue frame.
 *   4. After `feedbackDuration` ms the trial ends automatically.
 *
 * @param {object}    params
 * @param {string[]}  params.cue              - Cue keys, e.g. ["A"] or ["A","B"]
 * @param {string[]}  params.outcome          - Exactly two outcome keys
 * @param {string}    params.correct          - The correct outcome key
 * @param {string}    params.stage            - Label stored in the data record
 * @param {object}    params.cueMap           - Maps cue key → display label
 * @param {object}    params.outcomeMap       - Maps outcome key → image path
 * @param {string}    params.cuePicture       - Path to the cue image
 * @param {number}    [params.feedbackDuration=1500] - Feedback display time (ms)
 */
function makeLearningTrial({
  cue,
  outcome,
  correct,
  stage,
  cueMap,
  outcomeMap,
  cuePicture,
  feedbackDuration = 1500,
}) {
  return {
    type: jsPsychHtmlButtonResponse,
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
          padding-top: 8vh;
          flex-shrink: 0;
        }
        .lt-top p {
          font-size: clamp(14px, 2.2vh, 26px);
          margin: 0 0 1vh 0;
        }
        .lt-cue-row {
          display: flex; align-items: center;
          justify-content: center; gap: 4vw;
        }
        .lt-cue-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8vh;
        }
        .lt-flask-wrap {
          width: clamp(50px, 8vw, 110px);
          height: clamp(50px, 8vw, 110px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lt-flask-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: multiply;
        }
        .lt-cue-label {
          font-size: clamp(18px, 3.2vh, 32px);
          font-weight: normal;
          text-align: center;
        }
        .lt-and {
          font-size: clamp(16px, 6.0vh, 40px);
          font-weight: normal;
        }

        /* ── middle ── */
        .lt-middle {
          text-align: center;
          flex-shrink: 0;
        }
        .lt-middle p.lt-q {
          font-size: clamp(14px, 2.2vh, 26px);
          font-weight: bold;
          margin: 0 0 0.6vh 0;
        }
        .lt-middle p.lt-hint {
          font-size: clamp(11px, 1.6vh, 18px);
          margin: 0;
        }

        /* ── bottom ── */
        .lt-bottom {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(20px, 4vw, 80px);
          flex-shrink: 0;
          padding-bottom: 10vh;
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
          transition: border-color 0.15s,
          outline-color 0.15s;
        }
        /* participant selection (response phase) */
        .lt-option-img-wrap.selected {
          border-color: #000;
          outline-color: #c8c8c8;
        }
        /* participant was wrong — keep black on chosen image */
        .lt-option-img-wrap.chosen-wrong {
          border-color: #000;
          outline-color: #c8c8c8;
        }
        /* correct answer — bold blue ring */
        .lt-option-img-wrap.correct-answer {
          border-color: #1a6fcc;
          outline-color: #1a6fcc;
        }
        .lt-option img {
          display: block;
          width: clamp(80px, 20vw, 260px);
          height: clamp(88px, 22vw, 284px);
          object-fit: contain;
          background: #fff;
        }

        /* ── Centre slot: fixed size so swapping OK↔label never shifts layout ── */
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

        /* ── OK button (response phase) ── */
        #lt-ok-btn {
          font-size: clamp(13px, 1.8vh, 20px);
          padding: 1vh 2.5vw;
          border: 2px solid #555;
          background: #e8e8e8;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.15s;
        }
        #lt-ok-btn:hover { background: #d0d0d0; }
        #lt-ok-btn:disabled { opacity: 0.45; cursor: default; }

        /* ── Feedback label (swapped in after OK) ── */
        #lt-feedback-label {
          font-size: clamp(16px, 2.6vh, 28px);
          font-weight: bold;
          text-align: center;
          visibility: hidden;
          white-space: nowrap;
          max-width: 100%;
          pointer-events: none;
        }
        #lt-feedback-label.correct { color: #1a7a1a; }
        #lt-feedback-label.incorrect { color: #ff0000; }
      </style>

      <div class="lt-wrap">

        <div class="lt-top">
          <p>Tento multivitamín obsahuje:</p>
          ${renderCues({ cue, cuePicture, cueMap })}
        </div>

        <div class="lt-spacer-top"></div>

        <div class="lt-middle">
          <p class="lt-q">Kterým z následujících nežádoucích účinků bude pacient trpět?</p>
          <p class="lt-hint">Klikněte na obrázek vašeho výběru a poté potvrďte stisknutím OK</p>
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
            <div id="lt-feedback-label"></div>
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
    on_load: function () {
      let selected = null;

      const options = document.querySelectorAll(".lt-option");
      const okBtn   = document.getElementById("lt-ok-btn");
      const fbLabel = document.getElementById("lt-feedback-label");

      // ── Response phase ─────────────────────────────────────────────
      options.forEach((opt) => {
        opt.addEventListener("click", () => {
          document.querySelectorAll(".lt-option-img-wrap")
            .forEach(w => w.classList.remove("selected"));
          opt.querySelector(".lt-option-img-wrap").classList.add("selected");
          selected = opt.dataset.key;
          okBtn.disabled = false;
        });
      });

      okBtn.addEventListener("click", () => {
        if (selected === null) return;
        const isCorrect = selected === correct;

        // ── Switch to feedback phase (no DOM teardown) ──────────────
        // 1. Disable further clicks on images
        options.forEach(opt => opt.style.pointerEvents = "none");

        // 2. Swap OK button for feedback label (visibility keeps layout stable)
        okBtn.style.visibility = "hidden";
        fbLabel.textContent = isCorrect ? "Správně" : "Špatně";
        fbLabel.className = isCorrect ? "correct" : "incorrect";
        fbLabel.style.visibility = "visible";

        // 3. Apply border highlighting
        options.forEach((opt) => {
          const wrap = opt.querySelector(".lt-option-img-wrap");
          wrap.classList.remove("selected");
          if (opt.dataset.key === correct) {
            wrap.classList.add("correct-answer");
          } else if (opt.dataset.key === selected && !isCorrect) {
            wrap.classList.add("chosen-wrong");
          }
        });

        // 4. Save data and end trial after feedbackDuration
        setTimeout(() => {
          jsPsych.finishTrial({
            stage,
            cues:            cue.join(""),
            response:        selected,
            correct_outcome: correct,
            is_correct:      isCorrect,
          });
        }, feedbackDuration);
      });
    },
  };
}