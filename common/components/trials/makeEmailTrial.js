/**
 * makeEmailTrial
 *
 * Returns a self-looping jsPsych timeline node that collects and validates a
 * participant e-mail address before advancing.
 *
 * Validation rules:
 *   - Standard e-mail address  (user@domain.tld), OR
 *   - The single character "x" (anonymous / opt-out sentinel)
 *
 * Data written to jsPsych on a valid submission:
 *   data.email      {string}  – the validated address (or "x")
 *   data.trial_type {string}  – "email-collection" (for easy filtering)
 *   data.stimulus   {null}    – nulled to avoid storing the full HTML blob
 *
 * All intermediate (invalid) trials are purged from the jsPsych data store
 * inside the loop's on_finish so the final dataset contains exactly one
 * email-collection record.
 *
 * Usage
 * ─────
 *   timeline.push(makeEmailTrial({
 *     headerHtml:  "<h2>Registrace</h2><p>Zadejte prosím svůj e-mail.</p>",
 *     placeholder: "vas@email.cz",
 *     buttonText:  texts.continueText,
 *     errorText:   "Zadejte platnou e-mailovou adresu nebo napište „x".",
 *     maxDuration: times.maxInstructionDuration,
 *   }));
 *
 * @param {object} params
 * @param {string} [params.headerHtml]   – Instruction HTML above the field.
 * @param {string} [params.placeholder]  – Input placeholder text.
 * @param {string} [params.buttonText]   – Continue button label.
 * @param {string} [params.errorText]    – Inline error shown on bad input.
 * @param {number} [params.maxDuration]  – Trial timeout in ms (null = none).
 *
 * @returns {object} jsPsych looping timeline node, ready for timeline.push().
 */
function makeEmailTrial({
  headerHtml  = `<h2>Registrace</h2><p>Zadejte prosím svůj e-mail nebo napište „x" pro anonymní účast.</p>`,
  placeholder = "vas@email.cz",
  buttonText  = "Pokračovat",
  errorText   = `Zadejte platnou e-mailovou adresu (nebo „x" pro anonymní účast).`,
  maxDuration = 120000,
} = {}) {
  const email_pattern = /^([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}|x)$/;
  let _capturedEmail = "";
  
  const style = `
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
        padding: 0.5vh 0 3vh 0 !important;
      }
      .jspsych-btn {
        background-color: #e0e0e0;
        border: 1px solid #999;
        padding: 0.75vh 2vw;
        font-size: clamp(14px, 1.8vh, 18px);
      }
      .jspsych-btn:hover { background-color: #d0d0d0; }

      /* ── Layout wrappers (shared with makeInstructionTrial) ── */
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
        max-width: 680px;
        width: 100%;
        font-size: clamp(14px, 2.2vh, 22px);
        line-height: 1.65;
        text-align: left;
      }
      .inst-body h2 {
        font-size: clamp(18px, 3.0vh, 28px);
        margin: 2vh 0 2.5vh 0;
        text-align: center;
      }
      .inst-body hr {
          border: none;
          border-top: 1px solid #aaa;
          margin: 2vh 0;
      }
      .inst-body p { margin: 0 0 1.4vh 0; }

      /* ── E-mail field ── */
      .email-field-wrap {
        margin-top: 2vh;
        display: flex;
        flex-direction: column;
        gap: 1vh;
      }
      .email-input {
        width: 100%;
        box-sizing: border-box;
        padding: 0.75vh 1vw;
        font-size: clamp(14px, 2vh, 20px);
        font-family: Arial, sans-serif;
        border: 1px solid #999;
        background: #ebebeb;
        outline: none;
        border-radius: 2px;
      }
      .email-input:focus { border-color: #555; }
      .email-input.invalid { border-color: #c0392b; background: #fdf0ef; }

      /* ── Inline error message ── */
      .email-error {
        font-size: clamp(12px, 1.7vh, 16px);
        color: #c0392b;
        min-height: 1.6em;
        visibility: hidden;
      }
      .email-error.visible { visibility: visible; }
    </style>
  `;

  // ── Single trial definition ────────────────────────────────────────────────
  const emailTrial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      ${style}
      <div class="inst-wrap">
        <div class="inst-body">
          ${headerHtml}
          <div class="email-field-wrap">
            <input
              id           = "jspsych-email-input"
              type         = "email"
              class        = "email-input"
              placeholder  = "${placeholder}"
              autocomplete = "email"
              spellcheck   = "false"
            />
            <span id="jspsych-email-error" class="email-error">${errorText}</span>
          </div>
        </div>
      </div>
    `,
    choices: [buttonText],
    on_load: function () {
      const input  = document.getElementById("jspsych-email-input");
      const errMsg = document.getElementById("jspsych-email-error");
      const btn    = document.querySelector(".jspsych-btn");
      
       _capturedEmail = "";
      
      btn.disabled = true;
      btn.style.opacity = "0.45";
      btn.style.cursor  = "not-allowed";

      function syncButton() {
        const hasContent = input.value.trim().length > 0;
        btn.disabled      = !hasContent;
        btn.style.opacity = hasContent ? "1"       : "0.45";
        btn.style.cursor  = hasContent ? "pointer" : "not-allowed";
      }

      input.addEventListener("input", function () {
        input.classList.remove("invalid");
        errMsg.classList.remove("visible");
        syncButton();
      });

      btn.addEventListener("click", function (e) {
        const raw   = input.value.trim();
        const valid = email_pattern.test(raw);
 
        if (!valid) {
          e.stopImmediatePropagation();
          input.classList.add("invalid");
          errMsg.classList.add("visible");
          input.focus();
          return;
        }
 
        _capturedEmail = raw;
      }, true);
 
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !btn.disabled) btn.click();
      });
 
      input.focus();
    },
    on_finish: function (data) {
      const valid = email_pattern.test(_capturedEmail);

      data.stimulus    = null;
      data.trial_type  = "email-collection";
      data.email       = valid ? _capturedEmail : null;
      data.valid_email = valid;

      if (!valid) {
        const input  = document.getElementById("jspsych-email-input");
        const errMsg = document.getElementById("jspsych-email-error");
        if (input)  input.classList.add("invalid");
        if (errMsg) errMsg.classList.add("visible");
      }
    },

    trial_duration: maxDuration,
  };

  // ── Looping wrapper ────────────────────────────────────────────────────────
  return {
    timeline: [emailTrial],
    loop_function: function () {
      const last = jsPsych.data.get().last(1).values()[0];
 
      if (last.valid_email === true) {
        jsPsych.data
          .get()
          .filter({ trial_type: "email-collection" })
          .filter(function (trial) { return trial !== last; })
          .ignore(["email", "valid_email", "trial_type"]) 
          .values();
        return false;
      }
      return true;
    },
  };
}
