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
 * @param {object} design     - Experimental design
 * @param {object} settings   - { times, blocks, texts }
 * @param {object} cueMap     - Randomised cue key → display label
 * @param {object} outcomeMap - Randomised outcome key → image path
 * 
 * @returns {object[]} Ready-to-run jsPsych timeline array
 */
function buildTimeline({ design, settings, cueMap, outcomeMap }) {
  const { times, blocks: blockCounts, texts } = settings;
  const opts = { cueMap, outcomeMap, texts, times };
  const timeline = [];

  // ── Stage 1: instructions + single-cue learning ────────────────────────────
  timeline.push(makeInstructionTrial({
    html:       texts.instructions.stage1,
    buttonText: texts.continueText,
  }));
  timeline.push(...buildStageTrials(
    design.stage1,
    blockCounts.stage1,
    "stage1",
    false, // single cue — no counterbalancing
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
    html:       texts.instructions.stage3,
    buttonText: texts.continueText,
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
    html:       texts.instructions.test,
    buttonText: texts.continueText,
  }));
  timeline.push(...buildStageTrials(
    design.test,
    blockCounts.test,
    "test",
    true,
    makeTestTrial,
    opts
  ));

  return timeline;
}
