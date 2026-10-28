let active = null;
const el = (tag, cls, text) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
};
const random = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

export function stopTimedGame() {
  if (!active) return;
  clearInterval(active.interval);
  active.controller.abort();
  active = null;
}

function question(mode, first = false) {
  let a, b, symbol = '+';
  if (mode === 'multiply') { a = random(1, 10); b = random(1, 10); symbol = '×'; }
  else if (mode === 'subtract') { a = random(3, 20); b = random(1, Math.min(a, 9)); symbol = '−'; }
  else if (mode === 'small') { a = random(2, 9); b = random(2, 9); }
  else {
    const type = random(0, 2);
    if (first) { a = 68; b = 72; }
    else if (type === 0) { a = random(2, 8) * 10 + random(8, 9); b = random(21, 89); }
    else if (type === 1) { a = random(21, 79); b = a + random(0, 2); }
    else { a = random(21, 89); b = random(21, 89); }
  }
  return { a, b, symbol, answer: symbol === '×' ? a * b : symbol === '−' ? a - b : a + b };
}

export function openTimedGame(dialog, container, activity) {
  stopTimedGame();
  const state = { dialog, container, activity, controller: new AbortController(), running: false, interval: null, history: [], value: '' };
  active = state;
  container.replaceChildren();
  const setup = el('div', 'timed-setup');
  setup.append(el('span', 'timed-badge', '60 segons'), el('h3', '', 'Prepara’t per al repte!'));
  setup.append(el('p', '', 'Resol tantes operacions com pugues en un minut. El rellotge començarà quan premes el botó.'));
  setup.append(el('p', 'timed-help', 'Toca els números del teclat gran o utilitza el teclat de l’ordinador. Prem Comprova o la tecla Retorn per a enviar cada resposta.'));
  if (activity.mode === 'strategy') setup.append(el('p', 'timed-help', 'Al final veuràs maneres de simplificar les sumes.'));
  const start = el('button', 'button button-primary', 'Comença el minut');
  start.type = 'button';
  start.addEventListener('click', () => begin(state));
  setup.append(start);
  container.append(setup);
  dialog.addEventListener('keydown', (event) => {
    if (!state.running || active !== state || event.ctrlKey || event.metaKey || event.altKey) return;
    if (/^[0-9]$/.test(event.key)) { event.preventDefault(); enterDigit(state, event.key); }
    else if (event.key === 'Backspace' || event.key === 'Delete') { event.preventDefault(); erase(state, event.key === 'Delete'); }
    else if (event.key === 'Enter') { event.preventDefault(); if (!event.repeat) submit(state); }
  }, { signal: state.controller.signal });
  document.addEventListener('visibilitychange', () => { if (state.running) tick(state); }, { signal: state.controller.signal });
}

function begin(state) {
  if (active !== state || state.running) return;
  state.running = true;
  state.deadline = performance.now() + 60000;
  state.current = question(state.activity.mode, true);
  const panel = el('div', 'timed-game');
  const stats = el('div', 'timed-stats');
  state.clock = el('span', 'timed-clock', '60 s');
  state.clock.setAttribute('role', 'timer');
  state.clock.setAttribute('aria-live', 'off');
  state.score = el('span', '', '0 encerts');
  stats.append(state.clock, state.score);
  state.prompt = el('h3', 'timed-operation');
  state.input = el('input', 'timed-answer');
  state.input.type = 'text';
  state.input.readOnly = true;
  state.input.inputMode = 'none';
  state.input.setAttribute('aria-label', 'Resultat de l’operació');
  state.input.placeholder = '?';
  const keypad = el('div', 'timed-keypad');
  keypad.setAttribute('role', 'group');
  keypad.setAttribute('aria-label', 'Teclat numèric');
  ['1','2','3','4','5','6','7','8','9','C','0','⌫'].forEach((key) => {
    const button = el('button', 'keypad-key', key);
    button.type = 'button';
    if (key === 'C') button.setAttribute('aria-label', 'Esborra tot');
    if (key === '⌫') button.setAttribute('aria-label', 'Esborra l’últim número');
    button.addEventListener('click', () => /^[0-9]$/.test(key) ? enterDigit(state, key) : erase(state, key === 'C'));
    keypad.append(button);
  });
  const check = el('button', 'button timed-submit', 'Comprova ↵');
  check.type = 'button';
  check.addEventListener('click', () => submit(state));
  state.feedback = el('p', 'timed-feedback', 'Endavant!');
  state.feedback.setAttribute('role', 'status');
  panel.append(stats, state.prompt, state.input, keypad, check, state.feedback);
  state.container.replaceChildren(panel);
  showQuestion(state);
  state.input.focus();
  state.interval = setInterval(() => tick(state), 100);
}

function tick(state) {
  if (active !== state || !state.running) return false;
  const remaining = Math.max(0, Math.ceil((state.deadline - performance.now()) / 1000));
  state.clock.textContent = `${remaining} s`;
  state.clock.classList.toggle('is-final', remaining <= 10);
  if (remaining <= 0) { finish(state); return false; }
  return true;
}
function enterDigit(state, digit) {
  if (!tick(state)) return;
  if (state.value.length < 3) state.value = state.value === '0' ? digit : state.value + digit;
  state.input.value = state.value;
}
function erase(state, all = false) {
  if (!tick(state)) return;
  state.value = all ? '' : state.value.slice(0, -1);
  state.input.value = state.value;
}
function showQuestion(state) {
  state.prompt.textContent = `${state.current.a} ${state.current.symbol} ${state.current.b} =`;
  state.value = '';
  state.input.value = '';
}
function submit(state) {
  if (!tick(state)) return;
  if (state.value === '') { state.feedback.textContent = 'Escriu un resultat abans de comprovar.'; return; }
  const correct = Number(state.value) === state.current.answer;
  state.history.push({ ...state.current, correct });
  const hits = state.history.filter(item => item.correct).length;
  state.score.textContent = `${hits} ${hits === 1 ? 'encert' : 'encerts'}`;
  state.feedback.textContent = `${correct ? 'Correcte!' : 'Continua practicant.'} ${state.current.a} ${state.current.symbol} ${state.current.b} = ${state.current.answer}.`;
  state.feedback.classList.toggle('is-correct', correct);
  state.feedback.classList.toggle('is-incorrect', !correct);
  let next;
  do { next = question(state.activity.mode); } while (next.a === state.current.a && next.b === state.current.b);
  state.current = next;
  showQuestion(state);
}

function finish(state) {
  state.running = false;
  clearInterval(state.interval);
  const hits = state.history.filter(item => item.correct).length;
  const result = el('div', 'timed-results');
  result.append(el('p', 'eyebrow', 'Minut completat'), el('h3', 'summary-score', `${hits} ${hits === 1 ? 'encert' : 'encerts'}`));
  result.append(el('p', '', `${state.history.length} operacions contestades · ${state.history.length - hits} per a continuar practicant.`));
  result.append(el('p', 'timed-help', 'Cada intent t’ajuda a guanyar agilitat. Practica al teu ritme.'));
  if (state.activity.mode === 'strategy') {
    const tips = el('section', 'mental-tips');
    tips.append(el('h4', '', 'Trucs per a la pròxima vegada'));
    const examples = [...state.history.filter(item => !item.correct), ...state.history];
    const sample = examples[0] || { a: 68, b: 72 };
    const { a, b } = sample;
    const rounded = Math.ceil(a / 10) * 10;
    const correction = rounded - a;
    tips.append(el('h5', '', 'Arredonix i compensa'));
    tips.append(el('p', '', correction ? `${a} + ${b}: puja ${a} a ${rounded} (+${correction}). Fes ${rounded} + ${b} = ${rounded + b} i lleva els ${correction} que has afegit: ${a + b}.` : `${a} + ${b}: ${a} ja és una desena exacta. Suma primer les desenes de ${b} i després les unitats.`));
    tips.append(el('h5', '', 'Separa desenes i unitats'));
    const tensA = Math.floor(a / 10) * 10, tensB = Math.floor(b / 10) * 10;
    tips.append(el('p', '', `${a} + ${b} = (${tensA} + ${tensB}) + (${a % 10} + ${b % 10}) = ${tensA + tensB} + ${(a % 10) + (b % 10)} = ${a + b}.`));
    tips.append(el('h5', '', 'Busca un nombre redó'));
    tips.append(el('p', '', 'En 68 + 72, passa 2 unitats del 72 al 68: 70 + 70 = 140. La suma no canvia.'));
    result.append(tips);
  }
  const retry = el('button', 'button button-primary', 'Torna a jugar');
  retry.type = 'button';
  retry.addEventListener('click', () => openTimedGame(state.dialog, state.container, state.activity));
  result.append(retry);
  const announcement = el('p', 'sr-only', `Temps acabat. ${hits} respostes correctes.`);
  announcement.setAttribute('role', 'status');
  result.append(announcement);
  state.container.replaceChildren(result);
  retry.focus();
}
