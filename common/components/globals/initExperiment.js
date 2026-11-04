/**
 * initExperiment
 * 
 * Factory wrapper around initJsPsych that handles:
 *   - Progress bar setup
 *   - Continuous JATOS result streaming  (on_trial_finish)
 *   - Final data save / study termination (on_finish)
 *   - Optional fullscreen enforcement with mid-trial pause/resume
 *     and a localised re-enter overlay
 *
 * @param {object}  opts
 * @param {object}  opts.texts
 * @param {string}  opts.texts.progressText              – Progress bar label
 * @param {string}  [opts.texts.continueText]            – Button label on the fullscreen
 *                                                          overlay (required if enforceFullscreen)
 * @param {string}  [opts.texts.instructions.fullscreen] – HTML string for the image shown
 *                                                         on the overlay (optional)
 * @param {boolean} [opts.runOnServer=false]             – Stream data to JATOS? Also
 *                                                         triggers Prolific participant-ID
 *                                                         capture via jatos.onLoad().
 * @param {boolean} [opts.enforceFullscreen=false]       – Re-enter fullscreen on exit?
 * @param {boolean} [opts.showProgressBar=true]          – Show the progress bar?
 * @param {number}  [opts.totalTrials=0]                 – Total number of learning + test
 *                                                         trials; used to compute the
 *                                                         denominator for incrementProgress.
 *                                                         Pass 0 (or omit) to suppress
 *                                                         progress updates.
 * @param {string}  [opts.resultFileName=null]           – JATOS path only. If given, the
 *                                                         complete jsPsych data set is
 *                                                         uploaded as a JATOS result file
 *                                                         of this name before the study
 *                                                         ends (a back-up of the streamed
 *                                                         result data, which stay as they
 *                                                         are). null = no upload.
 * @param {boolean} [opts.deleteDataOnTermination=false] – JATOS path only. If a trial
 *                                                         recorded `terminated: true`
 *                                                         (e.g. declined consent), abort
 *                                                         the JATOS study run, which
 *                                                         deletes its result data, and
 *                                                         keep the termination message
 *                                                         on screen.
 * 
 * @returns {object} Configured jsPsych instance plus control setters:
 *   - jsPsych                     — the jsPsych instance
 *   - setFullscreenExpected(bool) — writes the fullscreen-state flag
 *   - incrementProgress()         — advances the progress bar by one trial
 *
 * @example
 * // Minimal – local testing, no fullscreen enforcement
 * const { jsPsych, incrementProgress } = initExperiment({
 *   texts:             { progressText: 'Progress' },
 *   runOnServer:       false,
 *   enforceFullscreen: false,
 *   showProgressBar:   false,
 *   totalTrials:       0,
 * });
 *
 * @example
 * // Full – server deployment with fullscreen enforcement
 * const { jsPsych, setFullscreenExpected, incrementProgress } = initExperiment({
 *   texts: {
 *     progressText: texts.progressText,
 *     continueText: texts.continueText,
 *     instructions: { fullscreen: instructions.fullscreen, },
 *   },
 *   runOnServer:       true,
 *   enforceFullscreen: true,
 *   showProgressBar:   true,
 *   totalTrials:       208,
 * });
 */
function initExperiment({
  texts,
  runOnServer       = false,
  enforceFullscreen = false,
  showProgressBar   = true,
  totalTrials       = 0,
  resultFileName          = null,
  deleteDataOnTermination = false,
} = {}) {

  // ── Validate options ───────────────────────────────────────────────────────
  if (showProgressBar && !texts?.progressText) {
    throw new Error("initExperiment: texts.progressText is required when showProgressBar is true.");
  }
  if (enforceFullscreen && !texts?.continueText) {
    throw new Error(
      "initExperiment: texts.continueText is required when enforceFullscreen is true."
    );
  }
  
  // ── Inject global layout fix for the progress bar ──────────────────────────
  const progressBarStyle = document.createElement("style");
  progressBarStyle.id    = "jspsych-progressbar-fix";
  progressBarStyle.textContent = `
    :root {
      --jspsych-progressbar-height: 28px;
    }
    #jspsych-progressbar-container {
      position: fixed;
      top:      0;
      left:     0;
      width:    100%;
      z-index:  9999;
      box-sizing: border-box;
    }
    /* Ensure the display element is not obscured by the fixed bar */
    #jspsych-display-element {
      padding-top: var(--jspsych-progressbar-height);
    }
  `;
  document.head.appendChild(progressBarStyle);
  
  // ── Fullscreen state ───────────────────────────────────────────────────────
  // Tracks whether the experiment *should* be in fullscreen at any moment.
  // Set to true by the first fullscreenenter event; used to distinguish
  // deliberate exits from the pre-fullscreen state.
  var shouldBeInFullscreen = false;
 
  // ── Progress-bar state ─────────────────────────────────────────────────────
  // trialsCompleted is the authoritative counter; only mutated through
  // incrementProgress so the closure is never bypassed.
  var trialsCompleted = 0;

  // ── Build the on_interaction_data_update callback only when needed ─────────
  const onInteractionDataUpdate = enforceFullscreen
    ? function(data) {

        if (data.event === "fullscreenenter") {
          shouldBeInFullscreen = true;

          jsPsych.resumeExperiment();

          // Remove the overlay and restore trial visibility if present
          const msgDiv = document.querySelector("#jspsych-fullscreen-overlay");
          if (msgDiv !== null) {
            msgDiv.remove();
            jsPsych.getDisplayElement().style.visibility = "visible";
          }
        }

        if (data.event === "fullscreenexit" && shouldBeInFullscreen) {
          jsPsych.pauseExperiment();

          // Hide the current trial content while the overlay is shown
          jsPsych.getDisplayElement().style.visibility = "hidden";

          // Inject fullscreen re-entry overlay
          jsPsych.getDisplayElement().insertAdjacentHTML(
            "beforebegin",
            `<div id="jspsych-fullscreen-overlay"
                  style="position:fixed;top:0;left:0;width:100%;height:100%;
                         background:#fff;display:flex;flex-direction:column;
                         justify-content:center;align-items:center;z-index:10000;">
               <div style="text-align:center;max-width:800px;padding:40px;">
                 ${texts.instructions.fullscreen ?? ""}
                 <button id="jspsych-fullscreen-btn" class="jspsych-btn">
                   ${texts.continueText}
                 </button>
               </div>
             </div>`
          );

          // Re-enter fullscreen on button click; vendor prefixes retained for
          // maximum browser compatibility (Safari still requires webkit)
          document.querySelector("#jspsych-fullscreen-btn")
            .addEventListener("click", function () {
              const el = document.documentElement;
              (
                el.requestFullscreen       ||
                el.mozRequestFullScreen    ||
                el.webkitRequestFullscreen ||
                el.msRequestFullscreen
              ).call(el);
            });
        }
      }
    : undefined; // omit the handler entirely when not enforcing fullscreen

  // ── Assemble jsPsych configuration ─────────────────────────────────────────
  const config = {

    // Progress bar
    show_progress_bar:        showProgressBar,
    message_progress_bar:     showProgressBar ? texts.progressText : "",
    auto_update_progress_bar: false,

    // Needed for some cross-origin / iframe deployments
    override_safe_mode: true,

    // Stream each trial's data to JATOS after it completes
    on_trial_finish: function(data) {
      if (runOnServer) {
        jatos.appendResultData(JSON.stringify(data));
      }
    },

    // Finalise the study or save locally
    on_finish: function() {
      if (!runOnServer) {
        jsPsych.data.get().localSave("json", "mydata.json");
        return;
      }

      // Participant ended the session via a terminate button (e.g. declined
      // consent): optionally discard the run's data on JATOS and stay on the
      // page, so that the termination message remains visible.
      const terminated =
        jsPsych.data.get().filter({ terminated: true }).count() > 0;
      if (terminated && deleteDataOnTermination) {
        const abort = jatos.abortStudyWithoutRedirect || jatos.abortStudyAjax;
        abort("terminated_by_participant");
        return;
      }

      // Back up the complete data set as a JATOS result file, then end the
      // study whether or not the upload succeeded; jatos.endStudy() itself
      // waits for any still pending appends or uploads before redirecting.
      if (resultFileName && typeof jatos.uploadResultFile === "function") {
        const finish = () => jatos.endStudy();
        jatos.uploadResultFile(jsPsych.data.get().json(), resultFileName)
          .then(finish, finish);
      } else {
        jatos.endStudy();
      }
    },
  };

  // Attach the interaction handler only when enforcement is requested
  if (onInteractionDataUpdate) {
    config.on_interaction_data_update = onInteractionDataUpdate;
  }

  const jsPsych = initJsPsych(config);
  
  // ── Prolific participant IDs (JATOS path only) ─────────────────────────────
  if (runOnServer) {
    jatos.onLoad(() => {
      jsPsych.data.addProperties({
        subject_id: jatos.urlQueryParameters.PROLIFIC_PID ?? null,
        study_id:   jatos.urlQueryParameters.STUDY_ID     ?? null,
        session_id: jatos.urlQueryParameters.SESSION_ID   ?? null,
      });
    });
  }
  
  return {
    jsPsych,
    setFullscreenExpected: (value) => { shouldBeInFullscreen = value; },
    incrementProgress: () => {
      if (!showProgressBar || totalTrials <= 0) return;
      trialsCompleted += 1;
      jsPsych.setProgressBar(trialsCompleted / totalTrials);
    },
  };
}
