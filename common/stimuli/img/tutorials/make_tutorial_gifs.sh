#!/usr/bin/env bash
# ==============================================================================
# make_tutorial_gifs.sh
# ==============================================================================
#
# Converts .mov display recordings to GIFs for experiment tutorials.
# Assumes ffmpeg is installed.
#
# ==============================================================================

ffmpeg -i learning_single_cue.mov -vf "fps=10" learning_single_cue.gif
ffmpeg -i learning_double_cue.mov -vf "fps=10" learning_double_cue.gif
ffmpeg -i test_double_cue.mov     -vf "fps=10" test_double_cue.gif
