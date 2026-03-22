// ── Check lengths ───────────────────────────────────────────────────────────
function assertSameLength(a, b) {
  if (a.length !== b.length) {
    throw new Error(`Length mismatch: ${a.length} vs ${b.length}`);
  }
}
 
// ── Fisher-Yates ────────────────────────────────────────────────────────────
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
