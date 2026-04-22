// ── Get filename without extension ───────────────────────────────────────────
function extractFilename(path) {
  const parts = path.split(/[\\/]/);
  const filename = parts[parts.length - 1] || "";
  return filename.replace(/\.[^/.]+$/, "");
}
