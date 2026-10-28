import { accentWords } from './castella-content.js';
let active = null;
const groups = [ ['aguda','Agudas'], ['plana','Llanas'], ['esdruixola','Esdrújulas'] ];
const el = (tag,cls,text) => { const n=document.createElement(tag); if(cls)n.className=cls; if(text!==undefined)n.textContent=text; return n; };
export function stopAccentGame() { active=null; }
export function openAccentGame(dialog,container) {
  const words=[...accentWords];
  for(let i=words.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[words[i],words[j]]=[words[j],words[i]];}
  active={dialog,container,words,matched:new Set(),selected:null,message:'Elige una palabra y el grupo que le corresponde, o arrástrala al grupo.',feedbackType:'info'};
  render(active);
}
function render(state) {
  if(active!==state)return;
  state.container.replaceChildren();
  state.container.append(el('p','accent-instructions','Clasifica las palabras según la posición de la sílaba tónica. Puedes arrastrarlas o seleccionar una palabra y tocar el grupo.'));
  const progress=el('p','eyebrow',`${state.matched.size} de ${state.words.length} palabras clasificadas`);
  const bank=el('div','accent-word-bank');
  bank.setAttribute('role','group'); bank.setAttribute('aria-label','Palabras para clasificar');
  state.words.filter(word=>!state.matched.has(word.id)).forEach(word=>{
    const chip=el('button',`accent-word${state.selected===word.id?' is-selected':''}`,word.word);
    chip.type='button';chip.draggable=true;chip.lang='es';
    chip.setAttribute('aria-pressed',String(state.selected===word.id));
    chip.addEventListener('click',()=>{state.selected=word.id;state.message=`Has seleccionado «${word.word}». Ahora elige un grupo.`;state.feedbackType='info';render(state);});
    chip.addEventListener('dragstart',event=>{state.selected=word.id;event.dataTransfer?.setData('text/plain',word.id);if(event.dataTransfer)event.dataTransfer.effectAllowed='move';});
    bank.append(chip);
  });
  const columns=el('div','accent-groups');
  groups.forEach(([id,name])=>{
    const column=el('section','accent-group');
    const target=el('button','accent-group-target',name);target.type='button';
    target.setAttribute('aria-label',`Coloca la palabra en ${name}`);
    target.addEventListener('click',()=>place(state,id));
    target.addEventListener('dragover',event=>{event.preventDefault();target.classList.add('is-drop-ready');});
    target.addEventListener('dragleave',()=>target.classList.remove('is-drop-ready'));
    target.addEventListener('drop',event=>{event.preventDefault();const wordId=event.dataTransfer?.getData('text/plain');if(state.words.some(word=>word.id===wordId))state.selected=wordId;place(state,id);});
    column.append(target);
    const list=el('ul','accent-placed');
    state.words.filter(word=>word.group===id&&state.matched.has(word.id)).forEach(word=>{const item=el('li','',word.word);item.lang='es';list.append(item);});
    column.append(list); columns.append(column);
  });
  const feedback=el('p',`accent-feedback is-${state.feedbackType}`,state.message);feedback.setAttribute('role','status');
  state.container.append(progress,bank,columns,feedback);
  if(state.matched.size===state.words.length){
    const done=el('div','summary-card');done.append(el('h3','','¡Muy bien! Ya has clasificado las 12 palabras.'));
    const retry=el('button','button button-primary','Volver a jugar');retry.type='button';retry.addEventListener('click',()=>openAccentGame(state.dialog,state.container));done.append(retry);state.container.append(done);retry.focus();
  }
}
function place(state,groupId) {
  if(active!==state)return;
  const word=state.words.find(item=>item.id===state.selected&&!state.matched.has(item.id));
  if(!word){state.message='Selecciona primero una palabra.';state.feedbackType='info';}
  else if(word.group!==groupId){state.message=`Revisa dónde suena con más fuerza «${word.word}»: última, penúltima o antepenúltima sílaba?`;state.feedbackType='incorrect';}
  else {state.matched.add(word.id);state.selected=null;state.message=`¡Correcto! ${word.explanation}`;state.feedbackType='correct';}
  render(state);
}
