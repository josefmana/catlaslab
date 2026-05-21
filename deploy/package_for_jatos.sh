#!/usr/bin/env bash
# =============================================================================
# package_for_jatos.sh
# =============================================================================
# Packages a jsPsych experiment for JATOS import.
#
# PROBLEM SOLVED
# ──────────────
# JATOS serves each study from its own directory and cannot resolve "../"
# paths that escape the study root. This script:
#   1. Locates all <script src> and <link href> assets referenced in index.html
#   2. Copies local assets (jspsych/, config/, buildTimeline.js, …) as-is
#   3. Copies out-of-tree "../../../common/…" files into a flat "common/"
#      folder inside the bundle, then rewrites those paths in index.html
#   4. Validates every rewritten path resolves to a real file in the bundle
#   5. Zips the bundle as a .jzip file ready for JATOS → Import Study
#
# EXPECTED MONOREPO LAYOUT
# ──────────────────────────────────────────────────────────
#   <repo_root>/
#   ├── common/
#   │   └── components/
#   │       ├── designs/
#   │       ├── globals/
#   │       ├── stages/
#   │       ├── trials/
#   │       └── utils/
#   └── studies/
#       └── <group>/
#           └── <study>/
#               ├── index.html
#               ├── buildTimeline.js
#               ├── config/
#               │   ├── settings.js
#               │   └── stimuli.js
#               └── jspsych/
#                   ├── jspsych.js
#                   ├── jspsych.css
#                   └── plugin-*.js
#
# USAGE
# ──────────────────────────────────────────────────────────
#   ./package_for_jatos.sh [index.html] [study_name] [output_dir]
#
#   index.html   path to the experiment's index.html  (default: ./index.html)
#   study_name   name for the JATOS study / zip file  (default: inferred from
#                the parent directory of index.html)
#   output_dir   where to write the .jzip bundle      (default: ./jatos_export)
#
# REQUIREMENTS
# ──────────────────────────────────────────────────────────
#   macOS with Bash ≥ 3.2  (ships with macOS; Homebrew bash ≥ 5 recommended)
#   Standard POSIX tools:  grep, sed, cp, zip, find, dirname, realpath
#   realpath is available via `brew install coreutils` if missing on older macOS
#
# =============================================================================

set -euo pipefail

# ── Colour helpers ────────────────────────────────────────────────────────────
RED='\033[0;31m'; YELLOW='\033[1;33m'; GREEN='\033[0;32m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'
info()    { echo -e "${CYAN}[INFO]${NC}  $*"; }
success() { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*" >&2; }
die()     { error "$*"; exit 1; }
header()  { echo -e "\n${BOLD}━━━  $*  ━━━${NC}"; }

# ── Resolve realpath (macOS compat) ───────────────────────────────────────────
_realpath() {
  # Use GNU realpath if available, otherwise fall back to Python
  if command -v realpath &>/dev/null; then
    realpath "$1"
  elif command -v python3 &>/dev/null; then
    python3 -c "import os,sys; print(os.path.realpath(sys.argv[1]))" "$1"
  else
    die "Cannot resolve absolute paths: install 'coreutils' via Homebrew (brew install coreutils)"
  fi
}

# ── Argument parsing ──────────────────────────────────────────────────────────
INDEX_HTML="${1:-index.html}"
STUDY_NAME="${2:-}"
OUTPUT_BASE="${3:-./jatos_export}"

[[ -f "$INDEX_HTML" ]] || die "index.html not found at: $INDEX_HTML"

INDEX_HTML="$(_realpath "$INDEX_HTML")"
EXPERIMENT_DIR="$(dirname "$INDEX_HTML")"

# Infer study name from directory if not supplied
if [[ -z "$STUDY_NAME" ]]; then
  STUDY_NAME="$(basename "$EXPERIMENT_DIR")"
  info "Study name inferred from directory: '${STUDY_NAME}'"
fi

# Sanitise study name for filesystem use
STUDY_NAME_SAFE="${STUDY_NAME// /_}"

# ── Resolve repo root (3 levels above experiment dir) ─────────────────────────
# index.html sits at: <repo>/<L1>/<L2>/<L3>/index.html
# common/ sits at:    <repo>/common/
REPO_ROOT="$(_realpath "${EXPERIMENT_DIR}/../../..")"
COMMON_SRC="${REPO_ROOT}/common"

header "Path resolution"
info "index.html       : ${INDEX_HTML}"
info "Experiment dir   : ${EXPERIMENT_DIR}"
info "Repo root (3 up) : ${REPO_ROOT}"
info "common/ source   : ${COMMON_SRC}"

[[ -d "$COMMON_SRC" ]] || \
  warn "common/ not found at expected location: ${COMMON_SRC}\n  Out-of-tree files will be flagged as missing rather than copied."

# ── Prepare output bundle directory ──────────────────────────────────────────
OUTPUT_BASE="$(_realpath "$OUTPUT_BASE")"
BUNDLE_DIR="${OUTPUT_BASE}/${STUDY_NAME_SAFE}"

header "Preparing bundle directory"
if [[ -d "$BUNDLE_DIR" ]]; then
  warn "Bundle directory already exists — removing: ${BUNDLE_DIR}"
  rm -rf "$BUNDLE_DIR"
fi
mkdir -p "$BUNDLE_DIR"
success "Created: ${BUNDLE_DIR}"

# ── Parse asset paths from index.html ────────────────────────────────────────
header "Parsing asset references from index.html"

# Extract src= and href= values from <script> and <link> tags.
# Uses extended regex; works with both BSD grep (macOS) and GNU grep.
# while-read used instead of mapfile: macOS ships Bash 3.2, mapfile is Bash 4+.
RAW_PATHS=()
while IFS= read -r line; do
  RAW_PATHS+=("$line")
done < <(
  grep -oE '(src|href)="[^"]+"' "$INDEX_HTML" \
    | sed -E 's/(src|href)="([^"]+)"/\2/'
)

info "Found ${#RAW_PATHS[@]} asset reference(s)"
for p in "${RAW_PATHS[@]}"; do echo "    $p"; done

# ── Categorise paths ──────────────────────────────────────────────────────────
header "Categorising paths"

LOCAL_PATHS=()   # relative paths that stay inside the experiment dir
OUTTREE_PATHS=() # paths that escape via ../../../common/
UNKNOWN_PATHS=() # anything else (absolute URLs, CDN, etc.)

# Known files injected by JATOS at runtime — never present locally, never
# need to be bundled. Treat as implicitly resolved; suppress all warnings.
JATOS_RUNTIME_FILES=("jatos.js")

is_jatos_runtime() {
  local f base
  f="$1"
  base="$(basename "$f")"
  for rt in "${JATOS_RUNTIME_FILES[@]}"; do
    [[ "$base" == "$rt" ]] && return 0
  done
  return 1
}

for raw in "${RAW_PATHS[@]}"; do
  if [[ "$raw" == http://* ]] || [[ "$raw" == https://* ]]; then
    UNKNOWN_PATHS+=("$raw")
    warn "External URL (left unchanged): $raw"
  elif [[ "$raw" == ../../../common/* ]]; then
    OUTTREE_PATHS+=("$raw")
    info "Out-of-tree: $raw"
  elif [[ "$raw" == ../* ]]; then
    # Relative path that escapes but NOT via the expected common/ prefix
    UNKNOWN_PATHS+=("$raw")
    warn "Unexpected relative escape (manual review needed): $raw"
  elif is_jatos_runtime "$raw"; then
    info "JATOS runtime (skipped): $raw"
  else
    LOCAL_PATHS+=("$raw")
    info "Local:       $raw"
  fi
done

# ── Copy LOCAL assets ─────────────────────────────────────────────────────────
header "Copying local assets"

MISSING_LOCAL=()
for rel in "${LOCAL_PATHS[@]}"; do
  src="${EXPERIMENT_DIR}/${rel}"
  dst="${BUNDLE_DIR}/${rel}"
  dst_dir="$(dirname "$dst")"

  if [[ -f "$src" ]]; then
    mkdir -p "$dst_dir"
    cp "$src" "$dst"
    success "Copied: ${rel}"
  elif [[ -d "$src" ]]; then
    # e.g. jspsych/ — copy the whole directory
    mkdir -p "$dst_dir"
    cp -R "$src" "$dst_dir/"
    success "Copied dir: ${rel}"
  else
    MISSING_LOCAL+=("$rel")
    warn "NOT FOUND (local): ${rel}"
  fi
done

# ── Copy OUT-OF-TREE (common/) assets ─────────────────────────────────────────
header "Copying out-of-tree common/ assets"

# Strip the ../../../common/ prefix so files land without a redundant common/
# wrapper in the bundle.
# e.g. ../../../common/components/utils/helpers.js
#   →  components/utils/helpers.js  (directly in bundle root)

MISSING_OUTTREE=()
for raw in "${OUTTREE_PATHS[@]}"; do
  # Strip leading ../../../common/ — drop the common/ wrapper level
  rel_in_bundle="${raw#../../../common/}"    # components/utils/helpers.js
  src="${REPO_ROOT}/common/${rel_in_bundle}" # absolute source path
  dst="${BUNDLE_DIR}/${rel_in_bundle}"       # destination inside bundle
  dst_dir="$(dirname "$dst")"

  if [[ -f "$src" ]]; then
    mkdir -p "$dst_dir"
    cp "$src" "$dst"
    success "Copied: ${rel_in_bundle}"
  else
    MISSING_OUTTREE+=("$raw  →  ${src}")
    warn "NOT FOUND (out-of-tree): ${src}"
  fi
done

# ── Rewrite index.html ────────────────────────────────────────────────────────
header "Rewriting index.html (patching out-of-tree paths)"

cp "$INDEX_HTML" "${BUNDLE_DIR}/index.html"

# Remove the ../../../common/ prefix entirely — files now live directly at
# components/ or stimuli/ in the bundle root, with no common/ wrapper.
if [[ ${#OUTTREE_PATHS[@]} -gt 0 ]]; then
  sed -i '' 's|\.\./\.\./\.\./common/||g' "${BUNDLE_DIR}/index.html"
  success "Path rewriting applied to bundle/index.html"
else
  info "No out-of-tree paths to rewrite"
fi

# ── Rewrite paths in config JS files ──────────────────────────────────────────
header "Rewriting paths in config JS files"

# settings.js and stimuli.js contain ../../../common/stimuli/... string literals
# (tutorial GIFs, cue images, outcome images). The browser resolves these
# relative to index.html — identical rule to index.html: strip ../../../common/.
# IMPORTANT: this runs unconditionally on every bundle copy that exists.
# Do NOT gate it on finding image paths first — that caused both rewrites and
# copies to be silently skipped when the image-extraction grep returned nothing.

JS_CONFIG_FILES=("config/settings.js" "config/stimuli.js")

for js_rel in "${JS_CONFIG_FILES[@]}"; do
  js_bundle="${BUNDLE_DIR}/${js_rel}"
  if [[ -f "$js_bundle" ]]; then
    sed -i '' 's|\.\./\.\./\.\./common/||g' "$js_bundle"
    success "Path rewriting applied to bundle/${js_rel}"
  else
    warn "Config file not in bundle (skipping rewrite): ${js_rel}"
  fi
done

# ── Copy images referenced in config JS files ─────────────────────────────────
header "Copying images referenced in config JS files"

# Parse the ORIGINAL source files for ../../../common/... paths.
# Pattern: literal ../../../common/ followed by any non-quote characters.
# Avoids {n} group quantifier and non-greedy .*? — both have unreliable
# behaviour in macOS BSD grep/sed.

MISSING_IMAGES=()

for js_rel in "${JS_CONFIG_FILES[@]}"; do
  js_src="${EXPERIMENT_DIR}/${js_rel}"

  if [[ ! -f "$js_src" ]]; then
    warn "Original source not found, cannot extract image paths: ${js_rel}"
    continue
  fi

  JS_IMG_PATHS=()
  while IFS= read -r img_line; do
    [[ -n "$img_line" ]] && JS_IMG_PATHS+=("$img_line")
  done < <(
    grep -oE '\.\./\.\./\.\./common/[^"]+' "$js_src"
  )

  if [[ ${#JS_IMG_PATHS[@]} -eq 0 ]]; then
    info "No out-of-tree image paths found in: ${js_rel}"
    continue
  fi

  info "Found ${#JS_IMG_PATHS[@]} out-of-tree path(s) in ${js_rel}"
  for img_raw in "${JS_IMG_PATHS[@]}"; do
    rel_in_bundle="${img_raw#../../../common/}"     # stimuli/img/cues/Ulginate.png
    src="${REPO_ROOT}/common/${rel_in_bundle}"
    dst="${BUNDLE_DIR}/${rel_in_bundle}"
    dst_dir="$(dirname "$dst")"

    if [[ -f "$src" ]]; then
      mkdir -p "$dst_dir"
      cp "$src" "$dst"
      success "Copied image: ${rel_in_bundle}"
    else
      MISSING_IMAGES+=("${img_raw}  →  ${src}")
      warn "NOT FOUND (image): ${src}"
    fi
  done
done

# ── Validate all paths in the rewritten index.html ───────────────────────────
header "Validating rewritten index.html asset paths"

REWRITTEN_PATHS=()
while IFS= read -r line; do
  REWRITTEN_PATHS+=("$line")
done < <(
  grep -oE '(src|href)="[^"]+"' "${BUNDLE_DIR}/index.html" \
    | sed -E 's/(src|href)="([^"]+)"/\2/'
)

VALIDATION_FAILURES=()
for rp in "${REWRITTEN_PATHS[@]}"; do
  # Skip external URLs
  [[ "$rp" == http://* ]] || [[ "$rp" == https://* ]] && continue
  
  # Skip files served by JATOS at runtime
  if is_jatos_runtime "$rp"; then
    info "JATOS runtime (validation skipped, expected): ${rp}"
    continue
  fi

  target="${BUNDLE_DIR}/${rp}"
  if [[ -e "$target" ]]; then
    success "Validated: ${rp}"
  else
    VALIDATION_FAILURES+=("$rp")
    error  "MISSING in bundle: ${rp}  →  ${target}"
  fi
done

# Validate image paths in the rewritten config JS files
for js_rel in "config/settings.js" "config/stimuli.js"; do
  js_bundle="${BUNDLE_DIR}/${js_rel}"
  [[ -f "$js_bundle" ]] || continue

  while IFS= read -r img_path; do
    [[ -z "$img_path" ]] && continue
    target="${BUNDLE_DIR}/${img_path}"
    if [[ -e "$target" ]]; then
      success "Validated (JS): ${img_path}"
    else
      VALIDATION_FAILURES+=("${img_path} [in ${js_rel}]")
      error  "MISSING in bundle: ${img_path}  →  ${target}"
    fi
  done < <(
    grep -oE '"[^"]*\.(png|gif|jpg|jpeg|svg|webp)"' "$js_bundle" \
      | tr -d '"' \
      | grep -v '^http'
  )
done

# ── Also copy buildTimeline.js if not already captured by LOCAL_PATHS ─────────
# (belt-and-braces: it has no ../  prefix so should already be handled above,
# but worth being explicit since it's the experiment-specific orchestrator)
if [[ ! -f "${BUNDLE_DIR}/buildTimeline.js" ]] && \
   [[ -f "${EXPERIMENT_DIR}/buildTimeline.js" ]]; then
  cp "${EXPERIMENT_DIR}/buildTimeline.js" "${BUNDLE_DIR}/buildTimeline.js"
  success "Copied (explicit): buildTimeline.js"
fi

# ── Print bundle directory tree ───────────────────────────────────────────────
header "Bundle directory structure"
if command -v tree &>/dev/null; then
  tree "${BUNDLE_DIR}"
else
  find "${BUNDLE_DIR}" | sort | sed "s|${BUNDLE_DIR}||" | sed 's|/[^/]*$|  &|' | sed 's|  /| /|'
fi

# ── Generate .jas study descriptor ───────────────────────────────────────────
header "Generating .jas study descriptor"

# JATOS requires a .jas (JSON) file at the same level as the study folder
# inside the .jzip. It describes study metadata and the component list.
# dirName MUST exactly match the study folder name — JATOS uses it to locate
# assets after import.
# uuidgen is available on macOS without any additional install.

JAS_PATH="${OUTPUT_BASE}/${STUDY_NAME_SAFE}.jas"

STUDY_UUID="$(uuidgen | tr '[:upper:]' '[:lower:]')"
COMPONENT_UUID="$(uuidgen | tr '[:upper:]' '[:lower:]')"
BATCH_UUID="$(uuidgen | tr '[:upper:]' '[:lower:]')"

cat > "$JAS_PATH" <<EOF
{
  "version": "3",
  "data": {
    "uuid": "${STUDY_UUID}",
    "title": "${STUDY_NAME}",
    "description": null,
    "groupStudy": false,
    "linearStudy": false,
    "allowPreview": false,
    "dirName": "${STUDY_NAME_SAFE}",
    "comments": "",
    "jsonData": null,
    "endRedirectUrl": "",
    "studyEntryMsg": "",
    "componentList": [
      {
        "uuid": "${COMPONENT_UUID}",
        "title": "${STUDY_NAME}",
        "htmlFilePath": "index.html",
        "reloadable": false,
        "active": true,
        "comments": "",
        "jsonData": null
      }
    ],
    "batchList": [
      {
        "uuid": "${BATCH_UUID}",
        "title": "Default",
        "active": true,
        "maxActiveMembers": null,
        "maxTotalMembers": null,
        "maxTotalWorkers": null,
        "allowedWorkerTypes": [
          "PersonalSingle",
          "Jatos",
          "PersonalMultiple"
        ],
        "comments": null,
        "jsonData": null
      }
    ]
  }
}
EOF

success "Created: ${JAS_PATH}"
info "  Study UUID    : ${STUDY_UUID}"
info "  Component UUID: ${COMPONENT_UUID}"
info "  dirName       : ${STUDY_NAME_SAFE}"

# ── Create JATOS-importable .jzip ─────────────────────────────────────────────
header "Creating JATOS .jzip archive"

# Expected zip structure:
#   <study_name_safe>/          ← study assets folder
#   <study_name_safe>/index.html
#   <study_name_safe>/jspsych/
#   …
#   <study_name_safe>.jas       ← study descriptor, sibling of the folder

JZIP_PATH="${OUTPUT_BASE}/${STUDY_NAME_SAFE}.jzip"

(
  cd "$OUTPUT_BASE"
  zip -r "${STUDY_NAME_SAFE}.jzip" \
    "${STUDY_NAME_SAFE}/" \
    "${STUDY_NAME_SAFE}.jas" \
    -x "*.DS_Store" -x "__MACOSX/*"
)

success "Archive created: ${JZIP_PATH}"
JZIP_SIZE=$(du -sh "$JZIP_PATH" | cut -f1)
info "Archive size: ${JZIP_SIZE}"

# ── Remove temporary files ─────────────────────────────────────────────────────
# Only the .jzip is kept. The staging folder and .jas are intermediates.
rm -rf "$BUNDLE_DIR"
rm -f  "$JAS_PATH"
success "Removed temporary bundle directory and .jas file"

# ── Final summary ─────────────────────────────────────────────────────────────
header "Summary"

echo -e "  Study name        : ${BOLD}${STUDY_NAME}${NC}"
echo -e "  JATOS archive     : ${JZIP_PATH}"
echo
echo -e "  Local assets      : ${#LOCAL_PATHS[@]} referenced"
echo -e "  Out-of-tree JS    : ${#OUTTREE_PATHS[@]} paths rewritten (../../../common/ stripped)"
echo -e "  External URLs     : ${#UNKNOWN_PATHS[@]} (unchanged)"
echo

# ── Exit status based on problems found ──────────────────────────────────────
PROBLEMS=0

if [[ ${#MISSING_LOCAL[@]} -gt 0 ]]; then
  error "Missing LOCAL files (${#MISSING_LOCAL[@]}):"
  for m in "${MISSING_LOCAL[@]}"; do echo "    ✗ $m"; done
  PROBLEMS=$((PROBLEMS + ${#MISSING_LOCAL[@]}))
fi

if [[ ${#MISSING_OUTTREE[@]} -gt 0 ]]; then
  error "Missing OUT-OF-TREE files (${#MISSING_OUTTREE[@]}):"
  for m in "${MISSING_OUTTREE[@]}"; do echo "    ✗ $m"; done
  PROBLEMS=$((PROBLEMS + ${#MISSING_OUTTREE[@]}))
fi

if [[ ${#MISSING_IMAGES[@]} -gt 0 ]]; then
  error "Missing IMAGE files from config JS (${#MISSING_IMAGES[@]}):"
  for m in "${MISSING_IMAGES[@]}"; do echo "    ✗ $m"; done
  PROBLEMS=$((PROBLEMS + ${#MISSING_IMAGES[@]}))
fi

if [[ ${#VALIDATION_FAILURES[@]} -gt 0 ]]; then
  error "Validation failures — paths in rewritten HTML not found in bundle (${#VALIDATION_FAILURES[@]}):"
  for m in "${VALIDATION_FAILURES[@]}"; do echo "    ✗ $m"; done
  PROBLEMS=$((PROBLEMS + ${#VALIDATION_FAILURES[@]}))
fi

if [[ $PROBLEMS -eq 0 ]]; then
  echo -e "${GREEN}${BOLD}All assets resolved. Bundle is ready for JATOS import.${NC}"
  echo
  echo -e "  Next steps:"
  echo -e "  1. Open JATOS → Studies → Import Study"
  echo -e "  2. Select:  ${JZIP_PATH}"
  echo -e "  3. Confirm the import and run a worker test before going live."
  exit 0
else
  echo -e "${RED}${BOLD}⚠  ${PROBLEMS} problem(s) detected. Review errors above before importing.${NC}"
  echo -e "  The .jzip was still created but the experiment may not run correctly."
  exit 1
fi
