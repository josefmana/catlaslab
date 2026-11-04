# fba-allergy-online

Online forward-blocking experiment in the modified allergist task (jsPsych, run
on JATOS at [mindprobe.eu](https://mindprobe.eu)), part of the CATLAS manuscript
`forward-blocking-attention-01`. Participants learn which fictitious chemicals
in a multivitamin cause which side effect in a fictitious patient (Stages 1 to
3), then predict side effects for test pairs without feedback and rate their
confidence.

This one folder contains the code of every build. Builds are told apart by
**release tags**, each with the `.jzip` that was actually deployed attached to
its GitHub release. The commit history between two tags constitutes the log of
changes between builds.

| Release | Experiment | Status |
|---|---|---|
| `fba-allergy-online-01` | Pilot / feasibility study | Released, `.jzip` attached |
| `fba-allergy-online-02` | Pre-registered replication | Not yet tagged |
| `fba-allergy-online-03` | Extension (differs in Stage 3 only) | Planned |

Release notes for each build are at the end of this file.

## Contents

```
fba-allergy-online/
├── index.html          entry point; loads everything below and starts jsPsych
├── buildTimeline.js    experiment-specific timeline
└── config/
    ├── lang.js         LANG = "cs" or "en" (decides texts and stimulus folders)
    ├── features.js     optional sections (e-mail, demography)
    ├── blocks.js       blocks per stage (pre-registered: 10, 8, 6, 6)
    ├── timing.js       trial and screen time limits (pre-registered)
    ├── images.js       tutorial images paths
    ├── stimuli.js      cue and outcome images paths, and their labels
    ├── settings.js     bundles the above for buildTimeline
    └── texts/<LANG>/   ui.js, instructions.js, tutorials.js, debrief.js
```

Shared code lives outside this folder: trial factories and helpers in
`common/components/`, jsPsych in `common/jspsych/`, stimuli in
`common/stimuli/`. The packaging script is `deploy/package_for_jatos.sh`.

## Files that are not on GitHub

Images and videos are git-ignored. Building the `.jzip` needs these files in
place, relative to the repository root (shown for `LANG = "cs"`; for `en` use
the `en` folders):

| Path | Files | Used for |
|---|---|---|
| `common/stimuli/img/cues/cs/` | the 28 PNGs listed in `config/stimuli.js` (`Ulginate.png`, `Renphane.png`, ...) | cue labels with flask icon |
| `common/stimuli/img/outcomes/cs/` | `x_` and `y_` + `dizziness`, `headache`, `itchiness`, `nausea` `.png` (8 files) | patient side effects (Mr X, Mr Y) |
| `common/stimuli/img/tutorials/cs/` | `learning_single_cue.png`, `learning_single_cue.gif`, `learning_double_cue.gif`, `test_double_cue.gif` | tutorial screens |

Where to get them:

- **From Jožka** (josef.mana@psu.cas.cz): copy the three folders above.
- **From a release `.jzip`** of the same layout (`fba-allergy-online-02` or
  later): unzip it and copy its `stimuli/` folder to `common/stimuli/`. The
  `fba-allergy-online-01` `.jzip` uses an older, language-free layout and does
  not fit the current config.

## Run locally

Serve the repository root over HTTP and open the experiment. Without JATOS, the
data are saved as `mydata.json` at the end.

```bash
cd catlaslab                 # repository root
python3 -m http.server 8000
# open http://localhost:8000/studies/forward-blocking-attention-01/fba-allergy-online/index.html
```

## Build the .jzip

Requirements: macOS (the script uses BSD `sed -i ''`), `bash`, `zip`, `uuidgen`,
and `realpath` (or `python3`). On Linux, replace `sed -i ''` by `sed -i` in a
copy of the script.

```bash
cd catlaslab/studies/forward-blocking-attention-01/fba-allergy-online

# 1. check the language; the build bundles only this one
grep 'const LANG' config/lang.js

# 2. build; ALWAYS pass the study name, it becomes the JATOS study title and the
#    study's assets folder on the server (reused name collides with an older build)
bash ../../../deploy/package_for_jatos.sh index.html fba-allergy-online-02 ~/Desktop/jatos_export

# 3. checksum for the release notes
shasum -a 256 ~/Desktop/jatos_export/fba-allergy-online-02.jzip
```

The script must end with `All assets resolved. Bundle is ready for JATOS import.`
Any `NOT FOUND` or `MISSING` line means a file from the table above is missing;
fix and rebuild. The language can be overridden with `STUDY_LANG=en bash ...`.

## Deploy on JATOS (mindprobe.eu)

1. **Import.** JATOS → *Import Study* → select the `.jzip`. If JATOS reports
   that a study or assets folder of that name already exists, stop and rebuild
   with a new study name.
2. **Record the JATOS version.** Run the study once from JATOS, open the browser
   console and type `jatos.version`; note it in the release notes.
3. **Batches and links** (study → *Study Links*):
   - participants: the default batch with a *General Single* link (one run per
     browser), the link given to LABELS;
   - ethics committee: a separate batch with a *General Multiple* link;
   - one's own checks: a separate batch (e.g. `test`), so they never mix with
     participant data.
4. **Keep the component non-reloadable** (the default from the `.jzip`). jsPsych
   cannot resume a run, so a reload must not restart the experiment and append
   duplicate data.
5. **Check before going live**, on a laptop and on a large desktop screen:
   - a full run ends on the farewell screen, and the result in JATOS has the
     streamed result data plus the file `jspsych-data.json`;
   - declining consent ends with the decline message, and the run shows as
     aborted with its data deleted;
   - the debrief cannot be passed without answering both compulsory questions.
6. **Go live:** generate the participant link.

## Data

Each trial is streamed to JATOS as one JSON object as soon as it ends. At the
end, the whole jsPsych data set is also uploaded as the result file
`jspsych-data.json` (one JSON array), a back-up for trials whose upload failed.

| `trial_type` | Main fields |
|---|---|
| `experiment-trial` | `stage`, `block`, `type`, `cues`, `response`, `correct_outcome`, `is_correct`, `confidence` (test only), `rt1`, `rt2`, `timed_out` |
| `debrief` | `prior_knowledge` (yes/no), `prior_guess` (free text, `null` if blank), `comment`, `timed_out` |
| `demography` | `sex`, `age` (`null` if the screen timed out) |
| `email-collection` | `email` (personal data: separate at import, never share) |
| `consent` | `response`; `terminated: true` if declined (such runs are deleted) |
| `stimuli-map` | the participant's random cue and outcome assignment |

Import with `{catlasr}` (`pull_jatos_batches()`), pulling the participant batch only,
never `EK` or `test`. `{catlasr}` drops e-mail columns. Keep the e-mail list
separately and delete it once LABELS has confirmed participation.

## jsPsych

`common/jspsych/` contains the exact files used:

| File | Package and version |
|---|---|
| `jspsych.js`, `jspsych.css` | `jspsych` 7.3.2 |
| `plugin-html-button-response.js`, `plugin-preload.js` | `@jspsych/plugin-*` 1.1.0 |
| `plugin-browser-check.js`, `plugin-call-function.js`, `plugin-fullscreen.js`, `plugin-html-keyboard-response.js` | `@jspsych/plugin-*` 2.1.0 |

The core is jsPsych 7 while four plugins come from the jsPsych 8 line. This
works as deployed; upgrading to a consistent jsPsych 8 set is planned for
`fba-allergy-online-03`.

## Release notes

### fba-allergy-online-01 (pilot)

- Tag on commit `f0d756c` (10 June 2026); the `.jzip` deployed then is attached
  to the release. The code then lived in
  `studies/forward-blocking-attention-01/fba-allergy-online-01/` (bundle name
  `forward-blocking-replication-online-pilot`).
- Czech, JATOS on mindprobe.eu; most of the pilot ran on this build.

### fba-allergy-online-02 (pre-registered replication)

- Tag, commit, `.jzip` SHA-256, `jatos.version`, data collection dates: **to be
  filled in at release**.
- Language: Czech (`LANG = "cs"`). Recruitment: LABELS participant pool, Charles
  University.
- Design unchanged from the pilot: blocks 10, 8, 6, 6; 60 s per trial, 1.5 s
  feedback, 0.5 s between trials, 180 s per instruction screen; outcome positions
  and randomisation as in the pilot.
- Changes since `fba-allergy-online-01`:
  - two-part debrief: (a) prior participation (`prior_knowledge`), (b) guess of
    what was tested (`prior_guess`), both compulsory; new field `timed_out`;
  - complete data back-up as the JATOS result file `jspsych-data.json`;
  - consent can be declined; declining aborts the JATOS run, which deletes its
    data; the consent screen has no time limit;
  - information shown in four screens, rewritten for the ethics committee
    application (data sharing via `{catlasr}`, e-mail handling, withdrawal);
  - welcome screen states the expected duration (about 25 to 30 minutes), the
    need for a stable connection and a quiet environment;
  - demography fields start empty and are required;
  - study code `catlas-02` on the welcome and farewell screens and in the page
    title;
  - stimuli also scale with screen height, so trials fit on short screens
    (e.g. 1366x768); the text column widens on large screens;
  - stray hidden buttons removed from test trials;
  - `jsPsych.run()` starts only after `jatos.onLoad()`;
  - jsPsych files moved to `common/jspsych/`; the packaging script now bundles
    language-dependent texts and stimuli.
