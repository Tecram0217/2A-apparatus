const transition = document.getElementById('page-transition');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (transition) {
  setTimeout(() => {
    void transition.offsetWidth;
    transition.classList.remove('covered');
    transition.classList.add('arrival');
    setTimeout(() => {
      transition.classList.remove('arrival');
      transition.setAttribute('aria-hidden', 'true');
    }, reducedMotion ? 40 : 940);
  }, reducedMotion ? 24 : 128);

  const backLink = document.querySelector('.return-button, .truereturn-button');
  if (backLink) {
    backLink.addEventListener('click', event => {
      event.preventDefault();
      transition.classList.remove('arrival', 'covered');
      transition.classList.add('active');
      transition.setAttribute('aria-hidden', 'false');
      setTimeout(() => {
        window.location.href = backLink.href;
      }, reducedMotion ? 40 : 920);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const terminal = document.getElementById('terminal');
  if (!terminal) return;

  const dialogue = Array.from(terminal.children).map(line => ({
    text: line.textContent,
    isSpace: line.classList.contains('terminal-space')
  }));
  terminal.innerHTML = '';

  let lineIndex = 0;
  const typingSpeed = reducedMotion ? 0 : 35;
  const lineDelay = reducedMotion ? 0 : 350;

  function showReturnButton() {
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = '▋';
    terminal.appendChild(cursor);
    document.querySelector('.truereturn-container')?.classList.add('visible');
  }

  function typeLine() {
    if (lineIndex >= dialogue.length) {
      showReturnButton();
      return;
    }

    const current = dialogue[lineIndex];
    if (current.isSpace) {
      const space = document.createElement('div');
      space.className = 'terminal-space';
      terminal.appendChild(space);
      lineIndex += 1;
      setTimeout(typeLine, reducedMotion ? 0 : 100);
      return;
    }

    const line = document.createElement('div');
    terminal.appendChild(line);
    let characterIndex = 0;

    function typeCharacter() {
      if (characterIndex < current.text.length) {
        line.textContent += current.text.charAt(characterIndex);
        characterIndex += 1;
        setTimeout(typeCharacter, typingSpeed);
      } else {
        lineIndex += 1;
        setTimeout(typeLine, lineDelay);
      }
    }

    typeCharacter();
  }

  setTimeout(typeLine, reducedMotion ? 0 : 1000);
});
