/**
 * buildTimeline
 * 
 * Assembles the complete jsPsych timeline for the Le Pelley (2007)
 * forward-blocking replication.
 *
 * Stage structure
 * ─────────────────────────────────────────────────────────────────────────────
 *  Stage 1   instructions  → blocks.stage1 × 8 single-cue learning trials
 *  Stage 2   (no break)    → blocks.stage2 × 8 two-cue learning trials
 *  Stage 3   instructions  → blocks.stage3 × 8 two-cue learning trials
 *  Test      instructions  → blocks.test   × 8 two-cue test trials
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Cue counterbalancing: applied per-trial in stages 2, 3, and test (random
 * 50/50 left–right flip). Stage 1 is single-cue so counterbalancing is off.
 *
 * Outcome order: fixed; o1/o3 always left, o2/o4 always right.
 *
 * @param {object}   design                - Experimental design
 * @param {object}   settings              - { times, blocks, texts, images }
 * @param {object}   cueMap                - Randomised cue key → display label
 * @param {object}   outcomeMap            - Randomised outcome key → image path
 * @param {Function} setFullscreenExpected - Function for fullscreen control
 * @param {Function} incrementProgress    - Advances the progress bar by one trial;
 *                                          threaded into opts so every trial factory
 *                                          can call it without touching jsPsych directly
 * 
 * @returns {object[]} Ready-to-run jsPsych timeline array
 */
function buildTimeline({
  design,
  settings,
  cueMap,
  outcomeMap,
  setFullscreenExpected,
  incrementProgress
}) {
  const { times, blocks: blockCounts, texts, images } = settings;
  const opts = { cueMap, outcomeMap, texts, times, images, incrementProgress };
  const timeline = [];
  
  // ── Check the browser ──────────────────────────────────────────────────────
  timeline.push({
    type: jsPsychBrowserCheck,
    inclusion_function: (data) => { return data.mobile === false },
  });
  
  // ── Save stimuli mappings ──────────────────────────────────────────────────
  timeline.push(saveMappings(
    cueMap,
    outcomeMap
  ));
  
  // ── Welcome slide ──────────────────────────────────────────────────────────
  timeline.push(makeInstructionTrial({
    html:        texts.instructions.welcome,
    buttonText:  texts.continueText,
    maxDuration: times.maxInstructionDuration,
    trialType:   "welcome",
    textAlign:   "justify",
  }));
  
  // ── Information slide ──────────────────────────────────────────────────────
  timeline.push(makeInstructionTrial({
    html:        texts.instructions.prelude,
    buttonText:  texts.continueText,
    maxDuration: times.maxInstructionDuration,
    trialType:   "instructions",
    textAlign:   "justify",
  }));
  
  // ── Preload images ─────────────────────────────────────────────────────────
  timeline.push({
    type: jsPsychPreload,
    auto_preload: false,
    images: [
      ...Object.values(images),
      ...Object.values(cueMap),
      ...Object.values(outcomeMap),
    ],
  });
  
  // ── Informed consent ───────────────────────────────────────────────────────
  timeline.push(makeInstructionTrial({
    html:        texts.instructions.consent,
    buttonText:  texts.agreeText,
    maxDuration: times.maxInstructionDuration,
    trialType:   "consent",
    textAlign:   "left",
    terminateButton: {
      label:   texts.disagreeText,
      message: texts.instructions.declineConsent
    },
  }));
  
  // ── E-mail ─────────────────────────────────────────────────────────────────
  timeline.push(makeEmailTrial({
    headerHtml:  texts.instructions.email,
    buttonText:  texts.continueText,
    errorText:   texts.emailError,
    maxDuration: times.maxInstructionDuration,
  }));
  
  // ── Demography ─────────────────────────────────────────────────────────────
  timeline.push(makeInstructionTrial({
    html:        texts.instructions.demography,
    buttonText:  texts.continueText,
    maxDuration: times.maxInstructionDuration,
    textAlign:   "center",
    trialType:   "demography",
  }));
  
  // ── Tutorial ───────────────────────────────────────────────────────────────
  timeline.push(
    ...[1, 2, 3, 4].map(i => makeTutorialTrial({
      html:        texts.tutorials[`page${i}`],
      gifSrc:      images[`tutorial${i}`],
      buttonText:  texts.continueText,
      maxDuration: times.maxInstructionDuration,
      columnSplit: "45/55",
    }))
  );
  
  // ── Last instructions ──────────────────────────────────────────────────────
  timeline.push(makeInstructionTrial({
    html:        texts.instructions.prestart,
    buttonText:  texts.continueText,
    maxDuration: times.maxInstructionDuration,
    textAlign:   "justify",
    trialType:   "instructions",
  }));
  
  // ── Enter fullscreen ───────────────────────────────────────────────────────
  timeline.push(enterFullscreen({
    message:    texts.instructions.start,
    buttonText: texts.startText,
    textAlign:  "justify",
    setFullscreenExpected
  }));

  // ── Stage 1: instructions + single-cue learning ────────────────────────────
  timeline.push(makeInstructionTrial({
    html:        texts.instructions.stage1,
    buttonText:  texts.continueText,
    maxDuration: times.maxInstructionDuration,
    textAlign:   "justify",
    trialType:   "instructions",
  }));
  timeline.push(...buildStageTrials(
    design.stage1,
    blockCounts.stage1,
    "stage1",
    false,
    makeLearningTrial,
    opts
  ));

  // ── Stage 2: continues from Stage 1, two-cue learning ──────────────────────
  timeline.push(...buildStageTrials(
    design.stage2,
    blockCounts.stage2,
    "stage2",
    true,
    makeLearningTrial,
    opts
  ));

  // ── Stage 3: new instructions + new outcomes, two-cue learning ─────────────
  timeline.push(makeInstructionTrial({
    html:        texts.instructions.stage3,
    buttonText:  texts.continueText,
    maxDuration: times.maxInstructionDuration,
    textAlign:   "justify",
    trialType:   "instructions",
  }));
  timeline.push(...buildStageTrials(
    design.stage3,
    blockCounts.stage3,
    "stage3",
    true,
    makeLearningTrial,
    opts
  ));

  // ── Test: instructions + two-cue test trials ───────────────────────────────
  timeline.push(makeInstructionTrial({
    html:        texts.instructions.test,
    buttonText:  texts.continueText,
    maxDuration: times.maxInstructionDuration,
    textAlign:   "justify",
    trialType:   "instructions",
  }));
  timeline.push(...buildStageTrials(
    design.test,
    blockCounts.test,
    "test",
    true,
    makeTestTrial,
    opts
  ));
  
  // ── Debriefing  ────────────────────────────────────────────────────────────
  timeline.push(makeInstructionTrial({
    html:        texts.debrief.intro,
    buttonText:  texts.continueText,
    maxDuration: times.maxInstructionDuration,
    textAlign:   "justify",
    trialType:   "instructions",
  }));
  
  timeline.push(makeDebriefTrial({
    introHtml:              "<hr>",
    priorKnowledgeQuestion: texts.debrief.priorKnowledge,
    priorKnowledgeOptions:  texts.priorKnowledge,
    detailQuestion:         texts.debrief.question,
    detailPlaceholder:      texts.debrief.placeholder,
    buttonText:             texts.continueText,
    maxDuration:            times.maxInstructionDuration,
  }));
  
  
  // ── Exit fullscreen then farewell ──────────────────────────────────────────
  timeline.push({
    type: jsPsychCallFunction,
    async: true,
    func: function (done) {
      setFullscreenExpected(false);
      if (document.fullscreenElement) {
        document.exitFullscreen().finally(done);
      } else {
        done();
      }
    },
  });
  
  timeline.push(makeInstructionTrial({
    html:        texts.instructions.farewell,
    buttonText:  texts.farewellText,
    maxDuration: times.maxInstructionDuration,
    textAlign:   "center",
    trialType:   "farewell",
  }));
  
  return timeline;
}
