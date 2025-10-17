export function showSection(section) {
    // Hide all sections inside #section
    document.querySelectorAll("#section > div").forEach(sec => {
        sec.style.display = "none"
    })
    // Also hide the settings section which is outside #section
    const settingsSection = document.querySelector(".settings");
    if (settingsSection) {
        settingsSection.style.display = "none";
    }
    
    // Show the requested section
    document.querySelector(`.${section}`).style.display = "block"
}

export function blockNonNumericInput(e) {
  if (!e.ctrlKey && !e.metaKey &&
    !["Backspace","Delete","ArrowLeft","ArrowRight","Tab"].includes(e.key) &&
    !e.key.match(/^[0-9.-]$/)) {
    e.preventDefault();
  }
}