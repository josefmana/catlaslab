/**
 * buildStageTrials
 * 
 * Generic stage builder: converts a stage design (array of trial descriptors)
 * into a flat jsPsych trial array, organised into nBlocks blocks.
 *
 * Responsibilities:
 *   - Calls buildStageBlocks to produce the randomised block structure.
 *   - Optionally counterbalances cue left-right order across blocks:
 *       - Within each block, exactly ⌊nTrials/2⌋ or ⌈nTrials/2⌉ trials have
 *         their cue pair flipped (see buildBalancedFlips).
 *       - For odd nTrials the rounding direction alternates per block so that
 *         the cumulative imbalance across all blocks is ≤ 1.
 *       - Ignored for single-cue trial descriptors.
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
 * @param {boolean}   counterbalance - Balance cue[0]/cue[1] order across trials
 *                                     (ignored for single-cue trials)
 * @param {Function}  trialFactory   - makeLearningTrial | makeTestTrial | custom
 * @param {object}    opts           - { cueMap, outcomeMap, texts, times }
 * 
 * @returns {object[]} Flat array of jsPsych trial objects
 */
function buildStageTrials(
  stageDesign, nBlocks, stageLabel, counterbalance, trialFactory, opts
) {
  const { cueMap, outcomeMap, texts, times } = opts;
  const iti =
    Number.isFinite(times.interTrialInterval) && times.interTrialInterval > 0
      ? times.interTrialInterval
      : 0;
 
  const nTrials = stageDesign.length;
  const blocks  = buildStageBlocks(nBlocks, nTrials);
 
  const flipSchedule = counterbalance
    ? buildFlipSchedule(nTrials, nBlocks)
    : null;
 
  return blocks.flatMap((block, blockIdx) =>
    block.map((descriptorIdx) => {
      const descriptor = stageDesign[descriptorIdx];
 
      const shouldFlip =
        counterbalance &&
        Array.isArray(descriptor.cue) &&
        descriptor.cue.length > 1 &&
        flipSchedule[descriptorIdx][blockIdx];
 
      const cue = shouldFlip
        ? [descriptor.cue[1], descriptor.cue[0]]
        : [...descriptor.cue];
 
      const trial = trialFactory({
        ...descriptor,
        cue,
        stage: stageLabel,
        block: blockIdx + 1,
        cueMap,
        outcomeMap,
        texts,
        times
      });
 
      if (iti > 0) trial.post_trial_gap = iti;
 
      return trial;
    })
  );
}
