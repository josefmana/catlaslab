/**
 * renderCues
 * Displays the same layout as makeTrial but with feedback:
 *  - OK button replaced by "Correct" (green) or "Incorrect" (red)
 *  - Correct answer image framed in blue regardless of response
 *
 * @param {object}   params
 * @param {string[]} params.cue        - Array of cue keys, e.g. ["A"] or ["A","B"]
 * @param {string}   params.cuePicture - Path to picture presented above each cue
 * @param {object}   params.cueMap     - Maps cue key → display label, e.g. {A:"Duprophane"}
 */
function renderCues({ cue, cuePicture, cueMap }) {
    const flaskImg = `<img src="${cuePicture}" class="lt-flask-img" alt="flask">`;
    
    const block = (key) => `
    <div class="lt-cue-block">
      <div class="lt-flask-wrap">${flaskImg}</div>
      <div class="lt-cue-label">${cueMap[key]}</div>
    </div>`;
    
    if (cue.length === 1) {
      return `<div class="lt-cue-row">${block(cue[0])}</div>`;
    }
    return `
    <div class="lt-cue-row">
      ${block(cue[0])}
      <div class="lt-and">+</div>
      ${block(cue[1])}
    </div>`;
  }