export function showSection(section) {
    document.querySelectorAll("#section > div").forEach(sec => {
        sec.style.display = "none"
    })
    document.querySelector(`.${section}`).style.display = "block"
}

export function blockNonNumericInput(e) {
  if (!e.ctrlKey && !e.metaKey &&
    !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key) &&
    !e.key.match(/^[0-9.-]$/)) {
    e.preventDefault();
  }
}