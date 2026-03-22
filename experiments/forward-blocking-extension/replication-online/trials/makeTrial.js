/**
 * makeTrial
 * Builds a jsPsych 8.x trial matching the vitamin-pill task UI.
 *
 * @param {object}    params
 * @param {string[]}  params.cue        - Array of cue keys, e.g. ["A"] or ["A","B"]
 * @param {string[]}  params.outcome    - Array of TWO outcome keys, e.g. ["o1","o2"]
 * @param {string}    params.correct    - The correct outcome key
 * @param {string}    params.stage      - Label stored in the data record
 * @param {object}    params.cueMap     - Maps cue key → display label, e.g. {A:"Duprophane"}
 * @param {object}    params.outcomeMap - Maps outcome key → image path
 * @param {string}    params.cuePicture - Path to picture presented above each cue 
 */
function makeTrial({
  cue,
  outcome,
  correct,
  stage,
  cueMap,
  outcomeMap,
  cuePicture
}) {
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <style>
        /* ── global reset: kills the white strip jsPsych adds on the left ── */
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

        /* ── layout shell ── */
        .lt-wrap {
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          box-sizing: border-box;
          padding: 2vh 3vw 3vh;
          background: #c8c8c8;
          font-family: Arial, sans-serif;
        }

        /*
         * Asymmetric spacers control vertical rhythm:
         * lt-spacer-top (flex:3) takes most leftover space → middle sits lower
         * lt-spacer-mid (flex:1) small gap   → bottom close to middle
         */
        .lt-spacer-top { flex: 3; min-height: 0; }
        .lt-spacer-mid { flex: 1; min-height: 0; }

        /* ── top zone: cue display ── */
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4vw;
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
          font-size: clamp(16px, 2.9vh, 28px);
          font-weight: normal;
        }

        /* ── middle zone: question ── */
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

        /* ── bottom zone: images + OK ── */
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
          border: 3px solid transparent;
          border-radius: 6px;
          overflow: hidden;
          transition: border-color 0.15s;
        }
        .lt-option-img-wrap.selected {
          border-color: #000;
          outline: 2px solid #000;
        }
        .lt-option img {
          display: block;
          width: clamp(80px, 20vw, 260px);
          height: clamp(88px, 22vw, 284px);
          object-fit: contain;
          background: #fff;
        }
        .lt-option-label {
          font-size: clamp(11px, 1.6vh, 18px);
          text-align: center;
          max-width: clamp(80px, 20vw, 260px);
        }

        /* ── OK button ── */
        #lt-ok-btn {
          font-size: clamp(13px, 1.8vh, 20px);
          padding: 1vh 2.5vw;
          border: 2px solid #555;
          background: #e8e8e8;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.15s;
          flex-shrink: 0;
        }
        #lt-ok-btn:hover { background: #d0d0d0; }
        #lt-ok-btn:disabled { opacity: 0.45; cursor: default; }
      </style>

      <div class="lt-wrap">

        <!-- TOP: vitamin contents -->
        <div class="lt-top">
          <p>Tento multivitamín obsahuje:</p>
          ${renderCues({cue, cuePicture, cueMap})}
        </div>

        <!-- Spacer: large → pushes middle+bottom downward -->
        <div class="lt-spacer-top"></div>

        <!-- MIDDLE: question -->
        <div class="lt-middle">
          <p class="lt-q">Kterým z následujících nežádoucích účinků bude pacient trpět?</p>
          <p class="lt-hint">Klikněte na obrázek vašeho výběru a poté potvrďte stisknutím OK</p>
        </div>

        <!-- Spacer: small → bottom zone stays close to middle -->
        <div class="lt-spacer-mid"></div>

        <!-- BOTTOM: left image | OK | right image -->
        <div class="lt-bottom">
          <div class="lt-option" data-key="${outcome[0]}" id="lt-opt-0">
            <div class="lt-option-img-wrap" id="lt-wrap-0">
              <img src="${outcomeMap[outcome[0]]}" alt="${outcome[0]}">
            </div>
          </div>

          <button id="lt-ok-btn" disabled>OK</button>

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

        jsPsych.finishTrial({
          stage:           stage,
          cues:            cue.join(""),
          response:        selected,
          correct_outcome: correct,
        });
      });
    },
  };
}