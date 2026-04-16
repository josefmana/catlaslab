#!/usr/bin/env bash
# Run from anywhere
REPO="josefmana/catlaslab"

# ── Scope labels ────────────────────────────────────────────────
gh label create "scope: study"      --color "0075ca" --description "studies/study-*/" --repo $REPO
gh label create "scope: components" --color "0075ca" --description "common/components/" --repo $REPO
gh label create "scope: stimuli"    --color "0075ca" --description "common/stimuli/" --repo $REPO
gh label create "scope: jatos"      --color "0075ca" --description "platform/jatos/" --repo $REPO
gh label create "scope: prolific"   --color "0075ca" --description "platform/prolific/" --repo $REPO

# ── Type labels ─────────────────────────────────────────────────
gh label create "type: bug"         --color "d73a4a" --description "Something broken" --repo $REPO
gh label create "type: feature"     --color "a2eeef" --description "New capability" --repo $REPO
gh label create "type: validation"  --color "e4e669" --description "Pilot, timing, attention checks" --repo $REPO
gh label create "type: docs"        --color "cfd3d7" --description "README, comments, codebooks" --repo $REPO
gh label create "type: question"    --color "d876e3" --description "Unresolved design decision" --repo $REPO

# ── Status labels ───────────────────────────────────────────────
gh label create "status: blocked"   --color "b60205" --description "Waiting on external dependency" --repo $REPO
gh label create "status: pre-reg"   --color "f9d0c4" --description "Must resolve before pre-registration" --repo $REPO

# ── Milestones ──────────────────────────────────────────────────
gh api repos/$REPO/milestones --method POST -f title="replication-online: ready for pilot"
gh api repos/$REPO/milestones --method POST -f title="replication-online: pre-registered"
gh api repos/$REPO/milestones --method POST -f title="replication-online: data collection complete"

gh api repos/$REPO/milestones --method POST -f title="replication-eyetracking: ready for pilot"
gh api repos/$REPO/milestones --method POST -f title="replication-eyetracking: pre-registered"
gh api repos/$REPO/milestones --method POST -f title="replication-eyetracking: data collection complete"

gh api repos/$REPO/milestones --method POST -f title="extension-online: ready for pilot"
gh api repos/$REPO/milestones --method POST -f title="extension-online: pre-registered"
gh api repos/$REPO/milestones --method POST -f title="extension-online: data collection complete"

gh api repos/$REPO/milestones --method POST -f title="extension-eyetracking: ready for pilot"
gh api repos/$REPO/milestones --method POST -f title="extension-eyetracking: pre-registered"
gh api repos/$REPO/milestones --method POST -f title="extension-eyetracking: data collection complete"

# ── Remove GitHub defaults ───────────────────────────────────────
# GitHub creates "bug", "documentation", "duplicate", etc. by default
# Remove them to avoid parallel label systems
for label in "bug" "documentation" "duplicate" "enhancement" "good first issue" "help wanted" "invalid" "question" "wontfix"; do
  gh label delete "$label" --repo $REPO --yes 2>/dev/null
done

echo "Done."
