/**
 * buildStageBlocks
 * 
 * Chains nBlocks calls to buildBlock, threading the last index of each block
 * into the next as prevLastIndex.  Resets between stages automatically because
 * each call to buildStageBlocks starts with prevLastIndex = null.
 *
 * @param {number} nBlocks - Number of blocks (≥ 1)
 * @param {number} nTrials - Number of distinct trial types per block (≥ 2)
 * 
 * @returns {number[][]}   Array of nBlocks arrays, each a permutation of
 *                         [0..nTrials-1]
 */
function buildStageBlocks(nBlocks, nTrials) {
  if (nBlocks < 1) throw new RangeError("buildStageBlocks: nBlocks must be ≥ 1");

  const blocks = [];
  let prevLastIndex = null;

  for (let b = 0; b < nBlocks; b++) {
    const block = buildBlock(nTrials, prevLastIndex);
    prevLastIndex = block[block.length - 1];
    blocks.push(block);
  }

  return blocks;
}
