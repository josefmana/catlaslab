// ── Get filename without extension ───────────────────────────────────────────
function extractFilename(path) {
  const parts = path.split(/[\\/]/);
  const filename = parts[parts.length - 1] || "";
  return filename.replace(/\.[^/.]+$/, "");
}

// ── Save cue and outcome mappings ────────────────────────────────────────────
function saveMappings(cueMap, outcomeMap) {
  return {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    trial_duration: 0,
    choices: "NO_KEYS",
    data: {
      cueMap: JSON.stringify(cueMap),
      outcomeMap: JSON.stringify(
        Object.fromEntries(
          Object.entries(outcomeMap).map(([k, v]) => [k, Array.isArray(v) ? v.map(extractFilename) : extractFilename(v)])
        )
      )
    }
  }
}
