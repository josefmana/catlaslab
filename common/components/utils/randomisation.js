// ── Check lengths ────────────────────────────────────────────────────────────
function assertSameLength(a, b) {
  if (a.length !== b.length) {
    throw new Error(`Length mismatch: ${a.length} vs ${b.length}`);
  }
}
 
// ── Fisher-Yates ─────────────────────────────────────────────────────────────
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * randomisePairings
 * Randomly assigns each value to a key (one-to-one, no repeats).
 * Returns { key: value, ... }
 */
function randomisePairings(keys, values) {
  assertSameLength(keys, values);
  const shuffled = shuffle([...values]);
  return Object.fromEntries(keys.map((key, i) => [key, shuffled[i]]));
}

/**
 * randomisePairwise
 * Within each consecutive pair of keys/values, randomly swaps the two values.
 * Returns { key: value, ... }
 */
function randomisePairwise(keys, values) {
  assertSameLength(keys, values);
  if (keys.length % 2 !== 0) {
    throw new Error("Keys/values must have an even length.");
  }
  const mapping = {};
  for (let i = 0; i < keys.length; i += 2) {
    const vals = Math.random() < 0.5
    ? [values[i], values[i + 1]]
    : [values[i + 1], values[i]];
    mapping[keys[i]] = vals[0];
    mapping[keys[i + 1]] = vals[1];
  }
  return mapping;
}

/**
 * randomiseConstrainedPairings
 *
 * Maps two groups of 4 elements to 4 outcome labels with index-level constraints.
 * 
 * Algorithm:
 * 1. Randomly shuffle indices [0, 1, 2, 3]
 * 2. First group gets the first 2 shuffled indices, paired with first 2 outcomes
 * 3. Second group gets the remaining 2 indices, paired with last 2 outcomes
 *
 * This ensures that whatever indices group[0] uses, group[1] cannot use,
 * and vice versa. All orderings are randomized.
 *
 * @param {Array}        outcomeLabels - Array of 4 outcome labels (any type: strings, objects, etc.)
 * @param {Array<Array>} elementGroups - Array of 2 arrays, each of length 4
 * 
 * @returns {Object} Mapping { outcomeLabel: element, ... }
 *
 * @example
 * const groups = [
 *   ["a_dizzy", "a_itchy", "a_headache", "a_nausea"],
 *   ["b_dizzy", "b_itchy", "b_headache", "b_nausea"]
 * ];
 * const outcomes = ["o1", "o2", "o3", "o4"];
 * const mapping = randomiseConstrainedPairings(groups, outcomes);
 * // { o1: "a_headache", o2: "a_dizzy", o3: "b_nausea", o4: "b_itchy" }
 */
function randomiseConstrainedPairings(outcomeLabels, elementGroups) {
  // ── Validation ─────────────────────────────────────────────────────────────
  if (!Array.isArray(elementGroups) || elementGroups.length !== 2) {
    throw new Error("elementGroups must be an array of exactly 2 groups");
  }
  if (!Array.isArray(outcomeLabels) || outcomeLabels.length !== 4) {
    throw new Error("outcomeLabels must be an array of exactly 4 labels");
  }
  for (let i = 0; i < 2; i++) {
    if (!Array.isArray(elementGroups[i]) || elementGroups[i].length !== 4) {
      throw new Error(`elementGroups[${i}] must be an array of length 4`);
    }
  }
 
  // ── Create random partition of indices ─────────────────────────────────────
  const indices = [0, 1, 2, 3];
  shuffle(indices); // Fisher-Yates mutation
 
  const group0Indices = indices.slice(0, 2);
  const group1Indices = indices.slice(2, 4);
 
  // ── Build outcome mapping ─────────────────────────────────────────────────
  const mapping = {};
  
  // First group = first 2 outcomes
  mapping[outcomeLabels[0]] = elementGroups[0][group0Indices[0]];
  mapping[outcomeLabels[1]] = elementGroups[0][group0Indices[1]];
  
  // Second group = last 2 outcomes
  mapping[outcomeLabels[2]] = elementGroups[1][group1Indices[0]];
  mapping[outcomeLabels[3]] = elementGroups[1][group1Indices[1]];
 
  return mapping;
}

/**
 * buildFlipSchedule
 *
 * Returns a 2-D boolean array [descriptorIdx][rowLength] controlling cue-order
 * flips for the entire stage. true = cue[1] left, cue[0] right.
 *
 * Each row has length nBlocks (even) or nBlocks+1 (odd). Exactly rowLength/2
 * entries are true, placed at uniformly random positions. buildStageTrials
 * indexes rows by blockIdx ∈ [0, nBlocks-1], so the padding column added for
 * odd nBlocks is allocated but never read — balance across the nBlocks
 * presentations used is as close to equal as the integer constraint allows.
 *
 * @param {number} nTrials - Number of distinct trial descriptors (= stageDesign.length)
 * @param {number} nBlocks - Number of blocks in the stage (>= 1)
 *
 * @returns {boolean[][]} [nTrials × rowLength] flip schedule
 */
function buildFlipSchedule(nTrials, nBlocks) {
  const rowLength = nBlocks + (nBlocks % 2); // round up to nearest even number
  const nFlips    = rowLength / 2;
 
  return Array.from({ length: nTrials }, () => {
    const row = Array.from({ length: rowLength }, (_, i) => i < nFlips);
    shuffle(row); // Fisher-Yates from randomisation.js
    return row;
  });
}
