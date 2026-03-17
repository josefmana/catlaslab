function makeLearningTrial({
  cue,
  outcome,
  correct,
  stage,
  cueMap,
  outcomeMap
}) {

  const spacing = degToPx(9.7);

  function renderCues() {
    if (cue.length === 1) {
      return `
        <div style="display:flex; justify-content:center; font-size:32px;">
          <b>${cueMap[cue[0]]}</b>
        </div>
      `;
    } else {
      return `
        <div style="
          display:flex;
          justify-content:center;
          align-items:center;
          gap:${spacing}px;
          font-size:32px;
        ">
          <div><b>${cueMap[cue[0]]}</b></div>
          <div><b>${cueMap[cue[1]]}</b></div>
        </div>
      `;
    }
  }

  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <div style="
        position:fixed;
        top:0;
        left:0;
        width:100vw;
        height:50vh;
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-items:center;
      ">
        ${renderCues()}
      </div>
    `,
    choices: [
      `<img src="${outcomeMap[outcome[0]]}" width="300" height="324">`,
      `<img src="${outcomeMap[outcome[1]]}" width="300" height="324">`
    ],
    button_html: '<button class="jspsych-btn" style="border:none; background:none;">%choice%</button>',
    prompt: `
      <div style="
        position:fixed;
        top:50%;
        left:50%;
        transform:translate(-50%, -50%);
        text-align:center;
        font-size: 2em;
      ">
        <p>Kterým z následujících nežádoucích účinků bude pacient zřejmě trpět?</p>
      </div>
    `,
    data: {
      stage: stage,
      cues: cue.join(""),
      correct_outcome: correct
    },
    on_finish: function(data) {
      const chosen = outcome[data.response];
      data.response_label = chosen;
      data.correct_response = chosen === correct;
    }
  };
}
