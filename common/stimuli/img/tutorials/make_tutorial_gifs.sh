#!/usr/bin/env bash
# ==============================================================================
# make_tutorial_gifs.sh
# ==============================================================================
#
# Converts .mov display recordings to GIFs for experiment tutorials.
# Assumes ffmpeg is installed.
#
# ==============================================================================

ffmpeg -i learning_single_cue_cs.mov -vf "fps=10" ./cs/learning_single_cue.gif
ffmpeg -i learning_double_cue_cs.mov -vf "fps=10" ./cs/learning_double_cue.gif
ffmpeg -i test_double_cue_cs.mov     -vf "fps=10" ./cs/test_double_cue.gif

ffmpeg -i learning_single_cue_en.mov -vf "fps=10" ./en/learning_single_cue.gif
ffmpeg -i learning_double_cue_en.mov -vf "fps=10" ./en/learning_double_cue.gif
ffmpeg -i test_double_cue_en.mov     -vf "fps=10" ./en/test_double_cue.gif
