/**
 * buildStageTrials
 * 
 * Generic stage builder: converts a stage design (array of trial descriptors)
 * into a flat jsPsych trial array, organised into nBlocks blocks.
 *
 * Responsibilities:
 *   - Calls buildStageBlocks to produce the randomised block structure.
 *   - Optionally flips cue order (random 50/50 per trial) for multi-cue trials.
 *   - Calls the supplied trialFactory for each trial.
 *   - Attaches post_trial_gap when times.interTrialInterval > 0.
 *
 * Explicitly out of scope:
 *   - Outcome order — passed through unmodified from the design descriptor.
 *   - Instruction screens — caller's responsibility.
 *
 * @param {object[]}  stageDesign    - Array of trial descriptors for this stage
 * @param {number}    nBlocks        - Number of blocks to run
 * @param {string}    stageLabel     - Stored as data.stage on every trial
 * @param {boolean}   counterbalance - Randomly flip cue[0]/cue[1] per trial
 *                                     (ignored for single-cue trials)
 * @param {Function}  trialFactory   - makeLearningTrial | makeTestTrial | custom
 * @param {object}    opts           - { cueMap, outcomeMap, texts, times, images }
 * 
 * @returns {object[]} Flat array of jsPsych trial objects
 */
function buildStageTrials(
  stageDesign, nBlocks, stageLabel, counterbalance, trialFactory, opts
) {
  const { cueMap, outcomeMap, texts, times, images } = opts;
  const iti = Number.isFinite(times.interTrialInterval) && times.interTrialInterval > 0
    ? times.interTrialInterval
    : 0;

  const blocks = buildStageBlocks(nBlocks, stageDesign.length);

  return blocks.flatMap(block =>
    block.map(idx => {
      const descriptor = stageDesign[idx];

      // Cue-order counterbalancing: random per-trial flip for multi-cue trials
      const cue = (counterbalance && descriptor.cue.length > 1 && Math.random() < 0.5)
        ? [descriptor.cue[1], descriptor.cue[0]]
        : [...descriptor.cue];

      const trial = trialFactory({
        ...descriptor,   // spreads cue (overridden above), outcome, correct/expectation, type
        cue,
        stage: stageLabel,
        cueMap,
        outcomeMap,
        texts,
        times,
        images,
      });

      if (iti > 0) trial.post_trial_gap = iti;

      return trial;
    })
  );
}