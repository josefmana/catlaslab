// ── Get filename without extension ───────────────────────────────────────────
function extractFilename(path) {
  const parts = path.split(/[\\/]/);
  const filename = parts[parts.length - 1] || "";
  return filename.replace(/\.[^/.]+$/, "");
}

// ── Loop extract names withou extensions ─────────────────────────────────────
function extractAllFilenames(object) {
  return JSON.stringify(
    Object.fromEntries(
      Object.entries(object).map(
        ([k, v]) => [k, Array.isArray(v) ? v.map(extractFilename) : extractFilename(v)]
      )
    )
  )
}

// ── Save cue and outcome mappings ────────────────────────────────────────────
function saveMappings(cueMap, outcomeMap) {
  return {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    trial_duration: 0,
    choices: "NO_KEYS",
    on_finish: function(data) {
      data.trial_type = "stimuli-map";
      data.cueMap     = extractAllFilenames(cueMap);
      data.outcomeMap = extractAllFilenames(outcomeMap)
    }
  }
}
