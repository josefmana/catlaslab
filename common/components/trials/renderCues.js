/**
 * renderCues
 * 
 * Renders one or two pre-rendered cue images inside `.lt-top`. Each cue is
 * represented by a single flat PNG so every `.lt-cue-block` has exactly one
 * child of fixed, identical dimensions.
 *
 * @param {object}   params
 * @param {string[]} params.cue    - Array of cue keys, e.g., ["A"] or ["A","B"]
 * @param {object}   params.cueMap - Maps cue key → path to pre-rendered PNG, e.g., { A: "img/cues/Alzaze.png" }
 */
function renderCues({ cue, cueMap }) {
    const block = (key) => `
    <div class="lt-cue-block">
      <img src="${cueMap[key]}" class="lt-cue-img" alt="${key}">
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
