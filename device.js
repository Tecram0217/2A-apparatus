const deviceScreen = document.getElementById('device-screen');
const deviceShell = document.getElementById('device-shell');
const deviceForm = document.getElementById('device-form');
const deviceActivate = document.getElementById('device-activate');
const deviceTargetInput = document.getElementById('device-target-name');
const deviceInputFeedback = document.getElementById('device-input-feedback');
const deviceContinue = document.getElementById('device-continue');
const terminalOutput = document.getElementById('terminal-output');
const epilogueScreen = document.getElementById('epilogue-screen');
const epilogueDialogue = document.getElementById('epilogue-dialogue');
const epilogueCounter = document.getElementById('epilogue-counter');
const epilogueText = document.getElementById('epilogue-text');
const epilogueNext = document.getElementById('epilogue-next');
const epilogueResult = document.getElementById('epilogue-result');
const epilogueTitle = document.getElementById('epilogue-title');
const epilogueResultLabel = document.getElementById('epilogue-result-label');
const epilogueReturn = document.getElementById('epilogue-return');

const targetNames = {
  ogasawara: '小笠原結衣',
  aizawa: '相沢洸太',
  kanzaki: '神崎美月',
  chinen: '知念誠也'
};

const targetAliases = {
  小笠原: 'ogasawara',
  小笠原結衣: 'ogasawara',
  相沢: 'aizawa',
  相沢洸太: 'aizawa',
  神崎: 'kanzaki',
  神崎美月: 'kanzaki',
  知念: 'chinen',
  知念誠也: 'chinen'
};

const endingFileByTarget = {
  ogasawara: 'ending1.html',
  aizawa: 'ending2.html',
  kanzaki: 'ending3.html',
  chinen: 'ending4.html'
};

const epilogues = {
  true: [
    'その後、敵国のスパイ組織への情報漏洩は発生しなくなり、スペクトラは再び秩序を取り戻した。',
    'ほどなくして、知念が機密情報の流出と偽の監視映像を仕組んでいたことを示す、決定的な証拠が発見された。',
    '相棒として寄り添いながら捜査を誘導すること。それこそが、彼にとって最も安全な偽装だったのだ。',
    'あなたの決断によってスペクトラは救われ、組織は「世界征服」という目標へ再び歩み始めた。',
    '相棒を失おうとも、正義を執行する。それが真のスパイなのだ。'
  ],
  uncertain: [
    'その後、スペクトラは平穏を取り戻した。',
    '・・・かのように思えたが、ほどなくして敵国のスパイ組織へ機密情報が漏洩する事件が、再び繰り返されるようになった。',
    '神崎美月はもう何も語らない。残されたのは、知念から渡された監視映像と、拭いきれない小さな違和感だけだった。',
    '・・・本当に、これで良かったのだろうか。何か大切なものを、見落としてはいなかったのだろうか。'
  ],
  bad: [
    '消失処理の直後、スペクトラの機密情報が再び敵国へ送信された。',
    '消した人物は裏切り者ではなかった。無実の仲間を失った一方で、本物の裏切り者は組織の中に残り続けた。',
    '疑いと混乱は瞬く間にスペクトラ全体へ広がり、任務網は崩壊。多くのエージェントが消息を絶った。',
    '誤りに気づいた時には、すべてが手遅れだった。',
    'あなたの選択が、スペクトラに終止符を打った。'
  ]
};

let selectedTargetKey = '';
let selectedTargetName = '';
let deviceRunning = false;
let epilogueLines = [];
let epilogueIndex = 0;
let epilogueActive = false;

function appendTerminalLine(text, type = '') {
  const line = document.createElement('p');
  line.className = `terminal-line ${type}`.trim();
  line.textContent = text;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function waitForDeviceLine(milliseconds) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return new Promise(resolve => setTimeout(resolve, reducedMotion ? Math.min(milliseconds, 90) : milliseconds));
}

async function runDeviceSequence() {
  appendTerminalLine('消失装置、起動を確認。');
  await waitForDeviceLine(900);
  appendTerminalLine(`ターゲット「${selectedTargetName}」を認識シマシタ。`);
  await waitForDeviceLine(1000);
  appendTerminalLine('コレヨリ、消失に入リマス。', 'warning');
  await waitForDeviceLine(1200);

  for (const number of ['3', '2', '1']) {
    appendTerminalLine(number, 'count');
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      deviceShell.animate(
        [{transform:'translate3d(-1px,0,0)'},{transform:'translate3d(1px,0,0)'},{transform:'translate3d(0,0,0)'}],
        {duration:240,easing:'ease-out'}
      );
    }
    await waitForDeviceLine(850);
  }

  appendTerminalLine('・・・', 'count');
  await waitForDeviceLine(1450);
  appendTerminalLine('完了シマシタ。', 'success');
  deviceScreen.classList.add('complete');
  deviceRunning = false;
  deviceContinue.disabled = false;
  setTimeout(() => deviceContinue.focus(), 500);
}

deviceForm.addEventListener('submit', event => {
  event.preventDefault();
  if (deviceRunning) return;

  const enteredName = deviceTargetInput.value.trim().normalize('NFC');
  if (!enteredName || !/^[\p{Script=Han}々]+$/u.test(enteredName)) {
    deviceTargetInput.setAttribute('aria-invalid', 'true');
    deviceInputFeedback.textContent = '人物の名字、または氏名を漢字で入力してください。';
    deviceTargetInput.focus();
    return;
  }

  const enteredTargetKey = targetAliases[enteredName];
  if (!enteredTargetKey) {
    deviceTargetInput.setAttribute('aria-invalid', 'true');
    deviceInputFeedback.textContent = '対象を認識できません。入力した名前を確認してください。';
    deviceTargetInput.focus();
    return;
  }

  selectedTargetKey = enteredTargetKey;
  selectedTargetName = targetNames[selectedTargetKey];
  deviceTargetInput.setAttribute('aria-invalid', 'false');
  deviceInputFeedback.textContent = '';
  deviceRunning = true;
  deviceActivate.disabled = true;
  deviceScreen.classList.add('running');
  terminalOutput.textContent = '';
  runDeviceSequence();
});

deviceTargetInput.addEventListener('input', () => {
  deviceTargetInput.setAttribute('aria-invalid', 'false');
  deviceInputFeedback.textContent = '';
});

function renderEpilogueLine() {
  epilogueText.textContent = epilogueLines[epilogueIndex];
  epilogueCounter.textContent = `${String(epilogueIndex + 1).padStart(2, '0')} / ${String(epilogueLines.length).padStart(2, '0')}`;
  epilogueNext.textContent = epilogueIndex === epilogueLines.length - 1 ? '結末を見る　›' : '次へ　›';
  epilogueText.animate(
    [{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],
    {duration:380,easing:'ease-out'}
  );
}

function startEpilogue() {
  const isTrue = selectedTargetKey === 'chinen';
  const isUncertain = selectedTargetKey === 'kanzaki';
  const kind = isTrue ? 'true' : isUncertain ? 'uncertain' : 'bad';
  const title = isTrue ? 'TRUE END' : isUncertain ? 'クリア・・・？' : 'BAD END';
  const label = isTrue ? 'MISSION RECORD / TRUE END' : isUncertain ? 'MISSION RECORD / UNRESOLVED END' : 'MISSION RECORD / MISSION FAILED';

  epilogueLines = epilogues[kind];
  epilogueIndex = 0;
  epilogueActive = true;
  epilogueDialogue.classList.remove('hidden');
  epilogueResult.classList.remove('visible');
  epilogueTitle.replaceChildren('CODE:2A ');
  const endingKind = document.createElement('span');
  endingKind.className = 'ending-kind';
  endingKind.textContent = title;
  epilogueTitle.appendChild(endingKind);
  epilogueTitle.className = `epilogue-title ${kind}`;
  epilogueResultLabel.textContent = label;
  epilogueReturn.href = endingFileByTarget[selectedTargetKey];
  epilogueReturn.textContent = '後日譚を見る　→';
  renderEpilogueLine();
  epilogueScreen.classList.add('open');
  epilogueScreen.setAttribute('aria-hidden', 'false');
  setTimeout(() => epilogueNext.focus(), 750);
}

function advanceEpilogue() {
  if (!epilogueActive) return;
  if (epilogueIndex < epilogueLines.length - 1) {
    epilogueIndex += 1;
    renderEpilogueLine();
    return;
  }

  epilogueActive = false;
  epilogueDialogue.classList.add('hidden');
  epilogueResult.classList.add('visible');
  setTimeout(() => epilogueReturn.focus(), 600);
}

deviceContinue.addEventListener('click', () => {
  if (!deviceScreen.classList.contains('complete') || deviceScreen.classList.contains('leaving')) return;
  deviceContinue.disabled = true;
  deviceScreen.classList.add('leaving');
  setTimeout(startEpilogue, 650);
});

epilogueNext.addEventListener('click', advanceEpilogue);

document.addEventListener('keydown', event => {
  if (event.repeat) return;
  if (epilogueActive && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    advanceEpilogue();
    return;
  }
  if (!epilogueScreen.classList.contains('open') && deviceScreen.classList.contains('complete') && event.key === 'Enter') {
    event.preventDefault();
    deviceContinue.click();
  }
});

window.addEventListener('pageshow', () => {
  deviceTargetInput.value = '';
  deviceTargetInput.focus();
});
