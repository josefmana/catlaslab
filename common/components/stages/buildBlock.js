/**
 * buildBlock
 * 
 * Returns a shuffled permutation of [0, 1, …, nTrials-1] with the constraint
 * that indices[0] !== prevLastIndex.
 *
 * Algorithm:
 *   1. Initialise [0..nTrials-1] and Fisher-Yates shuffle in place.
 *   2. If indices[0] === prevLastIndex, find the leftmost j > 0 such that
 *      indices[j] !== prevLastIndex and swap indices[0] <-> indices[j].
 *
 * Distribution note: the swap is applied after a full Fisher-Yates pass, so
 * all positions except 0 remain uniformly distributed. Position 0 is slightly
 * non-uniform (the forbidden value is displaced to position j), which is the
 * minimum distortion compatible with the constraint.
 *
 * @param {number}      nTrials       - Number of distinct trial types per block (≥ 2)
 * @param {number|null} prevLastIndex - Last trial index from the preceding block;
 *                                      null for the first block of a stage
 * 
 * @returns {number[]} Permutation of [0..nTrials-1]
 */
function buildBlock(nTrials, prevLastIndex = null) {
  if (nTrials < 2) throw new RangeError("buildBlock: nTrials must be ≥ 2");

  const indices = Array.from({ length: nTrials }, (_, i) => i);
  shuffle(indices); // Fisher-Yates in-place (randomisation.js)

  if (prevLastIndex !== null && indices[0] === prevLastIndex) {
    const swapIdx = indices.findIndex((v, i) => i > 0 && v !== prevLastIndex);
    [indices[0], indices[swapIdx]] = [indices[swapIdx], indices[0]];
  }

  return indices;
}
