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
