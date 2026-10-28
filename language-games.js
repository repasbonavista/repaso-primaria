import { alphabetRounds } from './valencia-content.js';
let active = null;
const collator = new Intl.Collator('ca', { sensitivity: 'base' });
const el = (tag, cls, text) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
};
export function stopAlphabetGame() {
  if (active?.drag?.ghost) active.drag.ghost.remove();
  active = null;
}
export function openAlphabetGame(dialog, container) {
  stopAlphabetGame();
  active = { dialog, container, index: 0, words: [], solved: false, message: '', drag: null };
  prepareRound(active);
}
function prepareRound(state) {
  state.words = [...alphabetRounds[state.index]];
  for (let i = state.words.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [state.words[i], state.words[j]] = [state.words[j], state.words[i]]; }
  if (isSorted(state.words)) [state.words[0],state.words[1]] = [state.words[1],state.words[0]];
  state.solved = false;
  state.message = 'Compara les paraules lletra a lletra, començant per l’esquerra.';
  render(state);
}
function isSorted(words) { return words.every((word, index) => index === 0 || collator.compare(words[index - 1], word) <= 0); }
function moveWord(state, from, to) {
  if (active !== state || state.solved || to < 0 || to >= state.words.length || from === to) return;
  const [word] = state.words.splice(from,1);
  state.words.splice(to,0,word);
  state.message = `${word}: ara ocupa la posició ${to + 1}.`;
  render(state);
  state.container.querySelector(`[data-sort-index="${to}"] .word-handle`)?.focus({preventScroll:true});
}
function render(state) {
  if (active !== state) return;
  state.container.replaceChildren();
  state.container.append(el('p','eyebrow',`Ronda ${state.index + 1} de ${alphabetRounds.length}`));
  state.container.append(el('p','alphabet-instructions','Ordena les paraules com apareixerien en el diccionari. Arrossega-les amb l’agafador de punts o utilitza els botons de pujar i baixar.'));
  const list = el('ol','alphabet-list');
  list.setAttribute('aria-label','Paraules per a ordenar alfabèticament');
  state.words.forEach((word,index) => {
    const row = el('li','alphabet-row');
    row.dataset.sortIndex = String(index);
    const handle = el('button','word-handle','⠿');
    handle.type = 'button';
    handle.disabled = state.solved;
    handle.setAttribute('aria-label',`Arrossega ${word}. Amb el teclat, usa les fletxes amunt i avall.`);
    handle.addEventListener('keydown', event => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault(); moveWord(state,index,index + (event.key === 'ArrowUp' ? -1 : 1));
      }
    });
    handle.addEventListener('dragstart', event => event.preventDefault());
    handle.addEventListener('pointerdown', event => {
      if (state.solved || active !== state || !event.isPrimary || event.button !== 0) return;
      event.preventDefault();
      handle.setPointerCapture(event.pointerId);
      state.drag = { from:index, target:index, pointerId:event.pointerId, x:event.clientX, y:event.clientY, ghost:null };
    });
    handle.addEventListener('pointermove', event => {
      const drag = state.drag;
      if (!drag || active !== state || drag.pointerId !== event.pointerId) return;
      if (!drag.ghost && Math.hypot(event.clientX - drag.x,event.clientY - drag.y) < 7) return;
      event.preventDefault();
      if (!drag.ghost) {
        drag.ghost = el('div','word-drag-ghost',word);
        drag.ghost.setAttribute('aria-hidden','true');
        state.dialog.append(drag.ghost);
        row.classList.add('is-dragging');
      }
      drag.ghost.style.left = `${event.clientX + 12}px`;
      drag.ghost.style.top = `${event.clientY - 22}px`;
      list.querySelectorAll('.is-drop-target').forEach(item => item.classList.remove('is-drop-target'));
      const over = document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-sort-index]');
      drag.target = over && list.contains(over) ? Number(over.dataset.sortIndex) : null;
      if (over && list.contains(over)) over.classList.add('is-drop-target');
    });
    const release = (event, cancelled = false) => {
      const drag = state.drag;
      if (!drag || drag.pointerId !== event.pointerId) return;
      drag.ghost?.remove();
      state.drag = null;
      row.classList.remove('is-dragging');
      list.querySelectorAll('.is-drop-target').forEach(item => item.classList.remove('is-drop-target'));
      if (!cancelled && drag.ghost && drag.target !== null) moveWord(state,drag.from,drag.target);
    };
    handle.addEventListener('pointerup', event => release(event));
    handle.addEventListener('pointercancel', event => release(event,true));
    const position = el('span','word-position',String(index + 1));
    position.setAttribute('aria-hidden','true');
    const text = el('span','word-text',word);
    const controls = el('div','word-move-controls');
    for (const [direction,label,delta] of [['↑','Puja',-1],['↓','Baixa',1]]) {
      const button = el('button','word-move-button',direction);
      button.type = 'button';
      button.setAttribute('aria-label',`${label} ${word}`);
      button.disabled = state.solved || index + delta < 0 || index + delta >= state.words.length;
      button.addEventListener('click',()=>moveWord(state,index,index+delta));
      controls.append(button);
    }
    row.append(handle,position,text,controls);
    list.append(row);
  });
  const feedback = el('p',`alphabet-feedback${state.solved ? ' is-correct' : ''}`,state.message);
  feedback.setAttribute('role','status');
  const check = el('button','button button-primary','Comprova l’ordre');
  check.type = 'button';
  check.disabled = state.solved;
  check.addEventListener('click',()=>{
    state.solved = isSorted(state.words);
    state.message = state.solved ? 'Correcte! Les paraules estan en ordre alfabètic.' : 'Encara no estan en ordre. Si dues paraules comencen igual, compara les lletres següents.';
    render(state);
  });
  state.container.append(list,feedback,check);
  if (state.solved) {
    const next = el('button','button button-secondary alphabet-next',state.index === alphabetRounds.length - 1 ? 'Acaba el joc' : 'Següent ronda');
    next.type = 'button';
    next.addEventListener('click',()=>{
      if (state.index < alphabetRounds.length - 1) { state.index++; prepareRound(state); }
      else finish(state);
    });
    state.container.append(next);
    next.focus({preventScroll:true});
  }
}
function finish(state) {
  state.container.replaceChildren();
  const result = el('div','summary-card');
  result.append(el('p','eyebrow','Repte completat'),el('h3','summary-score','5 rondes ordenades!'),el('p','summary-message','Has practicat com s’ordenen les paraules en el diccionari.'));
  const retry = el('button','button button-primary','Torna a jugar');
  retry.type = 'button';
  retry.addEventListener('click',()=>openAlphabetGame(state.dialog,state.container));
  result.append(retry); state.container.append(result); retry.focus();
}
