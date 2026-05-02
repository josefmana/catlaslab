# catlaslab

Experimental infrastructure for the [CATLAS](https://github.com/josefmana/catlas.git)
project.

This repository contains the implementation of behavioural and eye-tracking
experiments across multiple platforms, including jsPsych (online), PsychoPy,
and SR Research Experiment Builder.

## Scope

- Online experiments (e.g., jsPsych for JATOS / Prolific)
- Lab-based experiments (PsychoPy, Experiment Builder, eye-tracking)
- Shared stimuli and reusable experimental components
- Study-specific implementations and configurations

## Repository structure

/studies/
  <group>/              # Individual studies
    <experiment>/       # Individual experiments
/common/
  stimuli/              # Common stimuli
  components/           # Reusable building blocks (e.g., trial logic)
/deploy/
  package_for_jatos.sh  # Deployment configs for JATOS

## Design principles

- Organize by **study**, not by technology
- Maximize reuse of stimuli and components
- Keep platform-specific code thin and modular
- Ensure reproducibility across environments

## Relation to other repositories

- [CATLAS](https://github.com/josefmana/catlas.git):
  manuscripts and Quarto documents
- [{catlasr}](https://github.com/josefmana/catlasr.git):
  data processing and analysis (R)
- [{mathpsychr}](https://github.com/josefmana/mathpsychr.git):
  general-purpose methods

## Status

Active development. Structure and conventions may evolve as the project scales.

## License

This repository is released under the MIT License.  
_Note_: Study materials (e.g., stimuli) may be subject to additional
restrictions where explicitly indicated.