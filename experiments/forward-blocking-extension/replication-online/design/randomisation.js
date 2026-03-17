function randomisePairings(keys, values) {
  if (keys.length !== values.length) {
    throw new Error(`Length mismatch: ${keys.length} keys vs ${values.length} values`);
  }
  const shuffled = [...values].sort(() => Math.random() - 0.5);
  return Object.fromEntries(keys.map((key, i) => [key, shuffled[i]]));
}

function randomisePairwise(keys, values) {
  if (keys.length !== values.length) {
    throw new Error(`Length mismatch: ${keys.length} vs ${values.length}`);
  }

  if (keys.length % 2 !== 0) {
    throw new Error("Keys/values must be in pairs.");
  }

  const mapping = {};

  for (let i = 0; i < keys.length; i += 2) {
    const keyPair = [keys[i], keys[i + 1]];
    const valuePair = [values[i], values[i + 1]];

    // Fisher–Yates for 2 elements (safe)
    if (Math.random() < 0.5) {
      [valuePair[0], valuePair[1]] = [valuePair[1], valuePair[0]];
    }

    mapping[keyPair[0]] = valuePair[0];
    mapping[keyPair[1]] = valuePair[1];
  }

  return mapping;
}