/**
 * renderCues
 * Displays the same layout as makeTrial but with feedback:
 *  - OK button replaced by "Správně" (green) or "Špatně" (red)
 *  - Correct answer image framed in blue regardless of response
 *
 * @param {object}    params
 * @param {string[]}  params.cue        - Array of cue keys, e.g. ["A"] or ["A","B"]
 * @param {string}    params.cuePicture - Path to picture presented above each cue
 * @param {object}    params.cueMap     - Maps cue key → display label, e.g. {A:"Duprophane"}
 */
function renderCues({ cue, cuePicture, cueMap }) {
    const flaskImg = `<img src="${cuePicture}" class="lt-flask-img" alt="flask">`;
    if (cue.length === 1) {
      return `
        <div class="lt-cue-block">
          <div class="lt-flask-wrap">${flaskImg}</div>
          <div class="lt-cue-label">${cueMap[cue[0]]}</div>
        </div>`;
    }
    return `
      <div class="lt-cue-row">
        <div class="lt-cue-block">
          <div class="lt-flask-wrap">${flaskImg}</div>
          <div class="lt-cue-label">${cueMap[cue[0]]}</div>
        </div>
        <div class="lt-and">&amp;</div>
        <div class="lt-cue-block">
          <div class="lt-flask-wrap">${flaskImg}</div>
          <div class="lt-cue-label">${cueMap[cue[1]]}</div>
        </div>
      </div>`;
  }