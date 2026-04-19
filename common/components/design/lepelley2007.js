const design = {
  stage1: [
    { cue: ["A"], outcome: ["o1", "o2"], correct: "o1" },
    { cue: ["C"], outcome: ["o1", "o2"], correct: "o1" },
    { cue: ["E"], outcome: ["o1", "o2"], correct: "o2" },
    { cue: ["G"], outcome: ["o1", "o2"], correct: "o2" },
    { cue: ["I"], outcome: ["o1", "o2"], correct: "o1" },
    { cue: ["L"], outcome: ["o1", "o2"], correct: "o1" },
    { cue: ["O"], outcome: ["o1", "o2"], correct: "o2" },
    { cue: ["R"], outcome: ["o1", "o2"], correct: "o2" },
  ],
  stage2: [
    { cue: ["A", "B"], outcome: ["o1", "o2"], correct: "o1", type: "blocking" },
    { cue: ["C", "D"], outcome: ["o1", "o2"], correct: "o1", type: "blocking" },
    { cue: ["E", "F"], outcome: ["o1", "o2"], correct: "o2", type: "blocking" },
    { cue: ["G", "H"], outcome: ["o1", "o2"], correct: "o2", type: "blocking" },
    { cue: ["J", "K"], outcome: ["o1", "o2"], correct: "o1", type: "control" },
    { cue: ["M", "N"], outcome: ["o1", "o2"], correct: "o1", type: "control" },
    { cue: ["P", "Q"], outcome: ["o1", "o2"], correct: "o2", type: "control" },
    { cue: ["S", "T"], outcome: ["o1", "o2"], correct: "o2", type: "control" },
  ],
  stage3: [
    { cue: ["B", "K"], outcome: ["o3", "o4"], correct: "o3", type: "legit" },
    { cue: ["D", "N"], outcome: ["o3", "o4"], correct: "o4", type: "legit" },
    { cue: ["F", "Q"], outcome: ["o3", "o4"], correct: "o3", type: "legit" },
    { cue: ["H", "T"], outcome: ["o3", "o4"], correct: "o4", type: "legit" },
    { cue: ["U", "V"], outcome: ["o3", "o4"], correct: "o3", type: "filler" },
    { cue: ["W", "X"], outcome: ["o3", "o4"], correct: "o4", type: "filler" },
    { cue: ["Y", "Z"], outcome: ["o3", "o4"], correct: "o3", type: "filler" },
    { cue: ["alpha", "beta"], outcome: ["o3", "o4"], correct: "o4", type: "filler" }
  ],
  test: [
    { cue: ["B", "T"], outcome: ["o3", "o4"], expectation: "o4" },
    { cue: ["D", "Q"], outcome: ["o3", "o4"], expectation: "o3" },
    { cue: ["F", "N"], outcome: ["o3", "o4"], expectation: "o4" },
    { cue: ["H", "K"], outcome: ["o3", "o4"], expectation: "o3" },
    { cue: ["B", "N"], outcome: ["o3", "o4"], expectation: "o4" },
    { cue: ["D", "K"], outcome: ["o3", "o4"], expectation: "o3" },
    { cue: ["F", "T"], outcome: ["o3", "o4"], expectation: "o4" },
    { cue: ["H", "Q"], outcome: ["o3", "o4"], expectation: "o3" },
  ]
};