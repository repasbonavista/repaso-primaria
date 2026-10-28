import { activities, flashcards, labelingSystems, matchingPairs, scienceActivities, mentalActivities } from "./content.js";
import { openTimedGame, stopTimedGame } from "./timed-games.js";
import { mathActivities, buildRoundingQuestions } from "./math-content.js";
import { valenciaActivities } from "./valencia-content.js";
import { openAlphabetGame, stopAlphabetGame } from "./language-games.js";
import { castellaActivities } from "./castella-content.js";
import { openAccentGame, stopAccentGame } from "./castella-games.js";

const activityGrid = document.querySelector("#activity-grid");
const subjectFilter = document.querySelector("#subject-filter");
const topicFilter = document.querySelector("#topic-filter");
const filterCount = document.querySelector("#filter-count");
const emptyState = document.querySelector("#empty-state");
const dialog = document.querySelector("#activity-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogSubject = document.querySelector("#dialog-subject");
const dialogContent = document.querySelector("#dialog-content");
const flashcardPlayer = document.querySelector("#flashcard-player");
const flashcardCounter = document.querySelector("#flashcard-counter");
const flashcardSubject = document.querySelector("#flashcard-subject");
const flashcardTopic = document.querySelector("#flashcard-topic");
const flashcardPrompt = document.querySelector("#flashcard-prompt");
const flashcardAnswer = document.querySelector("#flashcard-answer");
const flipCardButton = document.querySelector("#flip-card");
const previousCardButton = document.querySelector("#previous-card");
const nextCardButton = document.querySelector("#next-card");

let session = null;
let labelingState = null;
let matchingState = null;
let visibleFlashcards = [];
let currentFlashcardIndex = 0;

const spanishText = {
  "Tria un joc": "Elige un juego", "Comença l'activitat": "Empezar la actividad",
  "Activitat completada": "Actividad completada", "Torna-ho a provar": "Volver a intentarlo", "Tanca": "Cerrar",
  "Molt bé! Has encertat totes les respostes.": "¡Muy bien! Has acertado todas las respuestas.",
  "Bon treball. Continua practicant per a recordar-ho encara millor.": "Buen trabajo. Sigue practicando para recordarlo aún mejor.",
  "Cada intent ajuda. Pots tornar a practicar quan vulgues.": "Cada intento ayuda. Puedes volver a practicar cuando quieras.",
  "Acaba i veu el resultat": "Terminar y ver el resultado", "Continua": "Continuar"
};
const spanishContext = () => document.body.dataset.page === "castella" || session?.activity?.subject === "Castellano";
const uiText = text => spanishContext() ? (spanishText[text] ?? text) : text;
const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = uiText(text);
  return element;
};

const getPageActivities = () => ({ science: scienceActivities, mental: mentalActivities, math: mathActivities, valencia: valenciaActivities, castella: castellaActivities })[document.body.dataset.page] || activities;
const gameTopicFilter = document.querySelector("#game-topic-filter");
function buildGameTopicFilter() {
  if (!gameTopicFilter) return;
  const topics = [...new Set(getPageActivities().map(activity => activity.topic))].filter(Boolean).sort((a,b) => a.localeCompare(b, "ca", {numeric:true}));
  for (const topic of topics) {
    const option = document.createElement("option");
    option.value = topic;
    option.textContent = topic;
    gameTopicFilter.append(option);
  }
  gameTopicFilter.addEventListener("change", renderActivities);
}
function renderActivities() {
  const selectedTopic = gameTopicFilter?.value || "all";
  const pageActivities = getPageActivities().filter(activity => selectedTopic === "all" || activity.topic === selectedTopic);
  activityGrid.replaceChildren();
  if (gameTopicFilter) {
    const spanish = document.body.dataset.page === "castella";
    document.querySelector("#game-filter-count").textContent = `${pageActivities.length} ${spanish ? (pageActivities.length === 1 ? "juego" : "juegos") : (pageActivities.length === 1 ? "joc" : "jocs")}`;
  }
  for (const activity of pageActivities) {
    const card = createElement("article", "activity-card");
    card.dataset.theme = activityTheme(activity);
    const top = createElement("div", "activity-card-top");
    const illustration = createElement("span", "activity-number");
    illustration.setAttribute("aria-hidden", "true");
    illustration.innerHTML = activityIcon(activity);
    top.append(illustration);
    top.append(createElement("span", "activity-subject", activity.subject));
    const title = createElement("h3", "", activity.title);
    const description = createElement("p", "activity-description", activity.description);
    const footer = createElement("div", "activity-card-footer");
    footer.append(createElement("span", "activity-detail", activity.detail));
    if (activity.kind === "link") {
      const link = createElement("a", "text-button", activity.subject === "Castellano" ? "Elige un juego" : "Tria un joc");
      link.href = activity.href;
      link.setAttribute("aria-label", `${activity.subject === "Castellano" ? "Abrir" : "Obri"} ${activity.title}`);
      footer.append(link);
    } else {
      const button = createElement("button", "text-button", "Comença l'activitat");
      button.type = "button";
      button.setAttribute("aria-label", `${activity.subject === "Castellano" ? "Empezar" : "Comença"} ${activity.title}`);
      button.addEventListener("click", () => openActivity(activity));
      footer.append(button);
    }
    if (gameTopicFilter && activity.topic) top.append(createElement("span", "activity-topic", activity.topic));
    card.append(top, title, description, footer);
    activityGrid.append(card);
  }
}

function buildFilters() {
  const subjects = [...new Set(flashcards.map((card) => card.subject))].sort((a, b) => a.localeCompare(b, "ca"));
  for (const subject of subjects) {
    const option = document.createElement("option");
    option.value = subject;
    option.textContent = subject;
    subjectFilter.append(option);
  }
  refreshTopicFilter();
}

function refreshTopicFilter() {
  const selectedSubject = subjectFilter.value;
  const currentTopic = topicFilter.value;
  const matchingCards = selectedSubject === "all"
    ? flashcards
    : flashcards.filter((card) => card.subject === selectedSubject);
  const topics = [...new Set(matchingCards.map((card) => card.topic))].sort((a, b) => a.localeCompare(b, "ca"));
  topicFilter.replaceChildren();
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "Tots els temes";
  topicFilter.append(allOption);
  for (const topic of topics) {
    const option = document.createElement("option");
    option.value = topic;
    option.textContent = topic;
    topicFilter.append(option);
  }
  topicFilter.value = topics.includes(currentTopic) ? currentTopic : "all";
}

function renderFlashcards() {
  const selectedSubject = subjectFilter.value;
  const selectedTopic = topicFilter.value;
  visibleFlashcards = flashcards.filter((card) => {
    const matchesSubject = selectedSubject === "all" || card.subject === selectedSubject;
    const matchesTopic = selectedTopic === "all" || card.topic === selectedTopic;
    return matchesSubject && matchesTopic;
  });
  if (selectedSubject === "all" && selectedTopic === "all") {
    for (let i = visibleFlashcards.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [visibleFlashcards[i], visibleFlashcards[j]] = [visibleFlashcards[j], visibleFlashcards[i]];
    }
  }
  currentFlashcardIndex = 0;
  filterCount.textContent = `${visibleFlashcards.length} ${selectedSubject === "Castellano" ? (visibleFlashcards.length === 1 ? "tarjeta" : "tarjetas") : (visibleFlashcards.length === 1 ? "targeta" : "targetes")}`;
  emptyState.hidden = visibleFlashcards.length > 0;
  flashcardPlayer.hidden = visibleFlashcards.length === 0;
  renderCurrentFlashcard();
}

function renderCurrentFlashcard() {
  const card = visibleFlashcards[currentFlashcardIndex];
  if (!card) return;
  flashcardCounter.textContent = `${card.subject === "Castellano" ? "Tarjeta" : "Targeta"} ${currentFlashcardIndex + 1} de ${visibleFlashcards.length}`;
  flashcardSubject.textContent = card.subject;
  flashcardTopic.textContent = card.topic;
  flashcardPrompt.textContent = card.front;
  flashcardAnswer.textContent = card.back;
  flashcardPrompt.hidden = false;
  flashcardAnswer.hidden = true;
  flipCardButton.textContent = card.subject === "Castellano" ? "Mostrar la respuesta" : "Mostra la resposta";
  flashcardPlayer.lang = card.subject === "Castellano" ? "es" : "ca";
  previousCardButton.textContent = card.subject === "Castellano" ? "Anterior" : "Anterior";
  nextCardButton.textContent = card.subject === "Castellano" ? "Siguiente" : "Següent";
  flipCardButton.setAttribute("aria-expanded", "false");
  previousCardButton.disabled = currentFlashcardIndex === 0;
  nextCardButton.disabled = currentFlashcardIndex === visibleFlashcards.length - 1;
}

function openActivity(activity) {
  dialog.lang = activity.subject === "Castellano" ? "es" : "ca";
  dialog.dataset.theme = activityTheme(activity);
  dialogTitle.textContent = activity.title;
  dialogSubject.textContent = activity.subject;
  if (activity.kind === "accent-sort") {
    openAccentGame(dialog, dialogContent);
    dialog.showModal();
    return;
  }
  if (activity.kind === "alphabet") {
    openAlphabetGame(dialog, dialogContent);
    dialog.showModal();
    return;
  }
  if (activity.kind === "timed") {
    openTimedGame(dialog, dialogContent, activity);
    dialog.showModal();
    return;
  }
  if (activity.kind === "matching") {
    matchingState = {
      activity,
      pairs: activity.pairs || matchingPairs,
      definitions: shuffleItems(activity.pairs || matchingPairs),
      selectedTermId: null,
      matched: new Set(),
      feedback: "Selecciona un concepte i després la definició que li correspon.",
      feedbackType: "info",
    };
    renderMatching();
    dialog.showModal();
    return;
  }
  if (activity.kind === "labeling") {
    labelingState = {
      activeSystemId: labelingSystems[0].id,
      selectedLabelId: null,
      completed: Object.fromEntries(labelingSystems.map((system) => [system.id, {}])),
      feedback: "Arrossega un nom fins al número corresponent o selecciona'l i després toca el número.",
      feedbackType: "info",
    };
    renderLabeling();
    dialog.showModal();
    return;
  }
  const questions = activity.kind === "rounding" ? buildRoundingQuestions() : activity.kind === "mental" ? makeMentalQuestions() : activity.questions;
  session = { activity, questions, index: 0, score: 0, answered: false };
  renderQuestion();
  dialog.showModal();
}

function activityIcon(activity) {
  let drawing;
  if (activity.kind === "matching") drawing = '<rect x="5" y="6" width="12" height="10" rx="3"/><rect x="31" y="29" width="12" height="10" rx="3"/><path d="M17 11h12q8 0 8 8v10M31 34H19q-8 0-8-8v-10"/>';
  else if (activity.kind === "labeling") drawing = '<circle cx="24" cy="11" r="5"/><path d="M16 22q8-7 16 0l5 10M11 32l5-10v19m16-19v19M19 41v-9h10v9"/><path d="M3 19h8M37 19h8"/>';
  else if (activity.subject.startsWith("Ciències")) drawing = '<path d="M17 5h14M20 5v14L9 37q-3 6 4 6h22q7 0 4-6L28 19V5M14 30h20"/><circle cx="22" cy="35" r="2"/><path d="M34 9l3-3m0 10h5"/>';
  else if (activity.subject === "Matemàtiques") drawing = '<rect x="9" y="4" width="30" height="40" rx="6"/><rect x="15" y="10" width="18" height="8" rx="2"/><path d="M16 26h5m-2.5-2.5v5M28 26h5M16 36h5M28 34l5 5m0-5-5 5"/>';
  else drawing = '<path d="M5 9q10-4 19 3q9-7 19-3v29q-10-3-19 3q-9-6-19-3ZM24 12v29M11 17h6M11 23h6M31 17h6M31 23h6"/>';
  return `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${drawing}</svg>`;
}

function activityTheme(activity) {
  if (activity.kind === "timed" || activity.id === "mental-seccio") return "mental";
  if (activity.subject.startsWith("Ciències")) return "science";
  if (activity.subject === "Matemàtiques") return "math";
  if (activity.subject === "Castellano") return "castella";
  return "languages";
}

function shuffleItems(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function renderMatching() {
  const { pairs, definitions, matched, selectedTermId } = matchingState;
  dialogContent.replaceChildren();
  const instructions = createElement("p", "matching-instructions", "Tria un concepte de la columna esquerra i, després, l’exemple o la definició que li correspon. Les opcions canvien d’ordre cada vegada.");
  const matchedCount = matched.size;
  const progress = createElement("div", "question-progress");
  progress.append(createElement("span", "", `${matchedCount} de ${pairs.length} parelles relacionades`));
  const progressBar = createElement("span", "progress-track");
  const progressValue = createElement("span", "progress-value");
  progressValue.style.width = `${(matchedCount / pairs.length) * 100}%`;
  progressBar.setAttribute("role", "progressbar");
  progressBar.setAttribute("aria-label", spanishContext() ? "Progreso de la actividad" : "Progrés de l'activitat");
  progressBar.setAttribute("aria-valuemin", "0");
  progressBar.setAttribute("aria-valuemax", String(pairs.length));
  progressBar.setAttribute("aria-valuenow", String(matchedCount));
  progressBar.append(progressValue);
  progress.append(progressBar);

  const columns = createElement("div", "matching-columns");
  const termsColumn = createElement("section", "matching-column");
  termsColumn.append(createElement("h3", "matching-column-title", "Conceptes"));
  const definitionsColumn = createElement("section", "matching-column");
  definitionsColumn.append(createElement("h3", "matching-column-title", "Exemples i definicions"));
  const terms = createElement("div", "matching-options");
  const definitionsList = createElement("div", "matching-options");

  pairs.forEach((pair) => {
    const button = createElement("button", `matching-option${matched.has(pair.id) ? " is-matched" : ""}${selectedTermId === pair.id ? " is-selected" : ""}`, pair.term);
    button.type = "button";
    button.disabled = matched.has(pair.id);
    button.setAttribute("aria-pressed", String(selectedTermId === pair.id));
    button.addEventListener("click", () => {
      matchingState.selectedTermId = pair.id;
      matchingState.feedback = "Ara tria la definició que li correspon.";
      matchingState.feedbackType = "info";
      renderMatching();
    });
    terms.append(button);
  });

  definitions.forEach((pair) => {
    const button = createElement("button", `matching-option${matched.has(pair.id) ? " is-matched" : ""}`, pair.definition);
    button.type = "button";
    button.disabled = matched.has(pair.id);
    button.addEventListener("click", () => chooseDefinition(pair.id));
    definitionsList.append(button);
  });

  termsColumn.append(terms);
  definitionsColumn.append(definitionsList);
  columns.append(termsColumn, definitionsColumn);
  const feedback = createElement("p", `matching-feedback is-${matchingState.feedbackType}`, matchingState.feedback);
  feedback.setAttribute("aria-live", "polite");
  dialogContent.append(instructions, progress, columns, feedback);

  if (matchedCount === pairs.length) {
    const done = createElement("div", "matching-complete");
    done.append(createElement("h3", "", "Molt bé! Has relacionat tots els conceptes."));
    const retry = createElement("button", "button button-primary", "Torna a jugar");
    retry.type = "button";
    retry.addEventListener("click", () => openActivity(matchingState.activity));
    done.append(retry);
    dialogContent.append(done);
  }
}

function chooseDefinition(definitionId) {
  if (!matchingState.selectedTermId) {
    matchingState.feedback = "Primer selecciona un concepte de la columna esquerra.";
    matchingState.feedbackType = "info";
    renderMatching();
    return;
  }
  if (matchingState.selectedTermId === definitionId) {
    const pair = matchingState.pairs.find((item) => item.id === definitionId);
    matchingState.matched.add(definitionId);
    matchingState.selectedTermId = null;
    matchingState.feedback = `Correcte: ${pair.term} i la seua definició.`;
    matchingState.feedbackType = "correct";
  } else {
    matchingState.selectedTermId = null;
    matchingState.feedback = "No correspon. Torna-ho a provar.";
    matchingState.feedbackType = "incorrect";
  }
  renderMatching();
}

function diagramIllustration(systemId) {
  const body = `
    <g fill="#f3f1ed" stroke="#c4d0ca" stroke-width="3" stroke-linejoin="round">
      <ellipse cx="180" cy="57" rx="31" ry="38" />
      <path d="M164 91 L164 105 L145 105 C127 107 111 119 101 137 L66 218 C61 229 66 240 77 244 C87 248 96 241 101 230 L123 180 L131 261 L116 415 C115 428 124 436 137 436 L223 436 C236 436 245 428 244 415 L229 261 L237 180 L259 230 C264 241 273 248 283 244 C294 240 299 229 294 218 L259 137 C249 119 233 107 215 105 L196 105 L196 91 Z" />
    </g>`;
  const organs = {
    digestiu: `
      <g fill="none" stroke="#a86443" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M172 99 Q180 106 188 99" />
        <path d="M180 107 L180 169" />
        <path d="M151 181 C138 176 127 183 125 195 C137 202 153 204 169 197" fill="#98644c" />
        <path d="M183 177 C207 176 221 190 215 208 C212 221 196 228 184 217 C176 209 176 191 183 177 Z" fill="#de9c76" />
        <path d="M177 226 Q194 219 210 230 Q203 239 182 237 Z" fill="#e1b064" />
        <path d="M153 251 C144 259 147 277 153 283 C145 291 148 309 156 314 L156 326 C164 335 196 335 204 326 L204 314 C212 309 215 291 207 283 C213 277 216 259 207 251" stroke-width="13" />
        <path d="M160 261 C197 255 164 275 198 276 C162 281 200 295 163 297 C197 301 163 312 199 318" stroke="#e0a36f" stroke-width="4" />
        <path d="M180 333 L180 358" />
      </g>`,
    respiratori: `
      <g fill="none" stroke="#598d91" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M172 98 Q180 104 188 98 L184 112" />
        <path d="M180 111 L180 190" />
        <path d="M180 166 L151 193 M180 166 L209 193" />
        <path d="M173 167 C156 160 139 174 136 199 L131 244 C130 258 142 265 155 258 C166 251 172 234 174 216 Z" fill="#e9b5ab" />
        <path d="M187 167 C204 160 221 174 224 199 L229 244 C230 258 218 265 205 258 C194 251 188 234 186 216 Z" fill="#e9b5ab" />
        <path d="M139 293 Q180 314 221 293" stroke="#b17a62" stroke-width="7" />
      </g>`,
    excretor: `
      <g fill="none" stroke="#a86443" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M142 194 C124 184 119 207 128 224 C137 237 151 229 155 215 C158 204 153 197 142 194 Z" fill="#c88464" />
        <path d="M218 194 C236 184 241 207 232 224 C223 237 209 229 205 215 C202 204 207 197 218 194 Z" fill="#c88464" />
        <path d="M145 229 C148 255 164 266 173 290 M215 229 C212 255 196 266 187 290" />
        <path d="M164 293 C165 277 195 277 196 293 C198 309 190 316 180 316 C170 316 162 309 164 293 Z" fill="#e7b07e" />
        <path d="M180 316 L180 346" />
      </g>`,
  };
  const names = {
    digestiu: "Esquema del cos humà amb els òrgans de l'aparell digestiu",
    respiratori: "Esquema del cos humà amb els òrgans de l'aparell respiratori",
    excretor: "Esquema del cos humà amb els òrgans de l'aparell excretor",
  };
  return `<svg class="anatomy-svg" viewBox="0 0 360 440" role="img" aria-label="${names[systemId]}">${body}<g>${organs[systemId]}</g></svg>`;
}

function renderLabeling() {
  if (!labelingState) return;
  const system = labelingSystems.find((item) => item.id === labelingState.activeSystemId);
  const placed = labelingState.completed[system.id];
  const placedCount = Object.keys(placed).length;
  const totalCount = system.targets.length;
  const completedSystems = labelingSystems.filter((item) => Object.keys(labelingState.completed[item.id]).length === item.targets.length).length;
  dialogContent.replaceChildren();

  const instructions = createElement("p", "labeling-instructions", "Completa els tres esquemes. Arrossega cada nom fins al número que li correspon; també pots seleccionar un nom i tocar el número.");
  const tabs = createElement("div", "labeling-tabs");
  tabs.setAttribute("role", "tablist");
  tabs.setAttribute("aria-label", "Tria l'aparell que vols etiquetar");
  labelingSystems.forEach((item) => {
    const tab = createElement("button", "labeling-tab", item.title.replace("Aparell ", ""));
    tab.type = "button";
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", String(item.id === system.id));
    tab.addEventListener("click", () => {
      labelingState.activeSystemId = item.id;
      labelingState.selectedLabelId = null;
      labelingState.feedback = "Selecciona un nom i toca el número corresponent, o arrossega'l fins al dibuix.";
      labelingState.feedbackType = "info";
      renderLabeling();
    });
    tabs.append(tab);
  });

  const status = createElement("div", "labeling-status");
  status.append(createElement("span", "", `${placedCount} de ${totalCount} etiquetes correctes`));
  status.append(createElement("span", "", `${completedSystems} de ${labelingSystems.length} esquemes completats`));

  const layout = createElement("div", "labeling-layout");
  const diagramPanel = createElement("div", "diagram-panel");
  const diagramArea = createElement("div", "diagram-area");
  diagramArea.innerHTML = diagramIllustration(system.id);
  system.targets.forEach((target) => {
    const label = system.labels.find((item) => item.id === target.labelId);
    const isPlaced = Boolean(placed[target.labelId]);
    const targetButton = createElement("button", `diagram-target${isPlaced ? " is-correct" : ""}`, isPlaced ? "✓" : String(target.number));
    targetButton.type = "button";
    targetButton.style.left = `${(target.x / 360) * 100}%`;
    targetButton.style.top = `${(target.y / 440) * 100}%`;
    targetButton.disabled = isPlaced;
    targetButton.setAttribute("aria-label", `Posició ${target.number}: ${isPlaced ? label.text + ", resposta correcta" : "buida"}`);
    targetButton.addEventListener("click", () => {
      if (labelingState.selectedLabelId) placeLabel(target.labelId);
      else setLabelingFeedback("Primer selecciona un nom de la llista.", "info");
    });
    targetButton.addEventListener("dragover", (event) => {
      event.preventDefault();
      targetButton.classList.add("is-drop-ready");
    });
    targetButton.addEventListener("dragleave", () => targetButton.classList.remove("is-drop-ready"));
    targetButton.addEventListener("drop", (event) => {
      event.preventDefault();
      targetButton.classList.remove("is-drop-ready");
      const draggedLabel = event.dataTransfer?.getData("text/plain");
      if (draggedLabel) labelingState.selectedLabelId = draggedLabel;
      placeLabel(target.labelId);
    });
    diagramArea.append(targetButton);
  });
  diagramPanel.append(diagramArea, createElement("p", "diagram-caption", "Dibuix esquemàtic: situa cada òrgan al lloc aproximat del cos."));

  const labelPanel = createElement("div", "label-bank-panel");
  labelPanel.append(createElement("h3", "label-bank-title", "Noms disponibles"));
  const bank = createElement("div", "label-bank");
  bank.setAttribute("role", "group");
  bank.setAttribute("aria-label", "Noms dels òrgans per a col·locar");
  const usedLabels = new Set(Object.values(placed));
  system.labels.filter((label) => !usedLabels.has(label.id)).forEach((label) => {
    const chip = createElement("button", `label-chip${labelingState.selectedLabelId === label.id ? " is-selected" : ""}`, label.text);
    chip.type = "button";
    chip.draggable = true;
    chip.setAttribute("aria-pressed", String(labelingState.selectedLabelId === label.id));
    chip.addEventListener("click", () => {
      labelingState.selectedLabelId = labelingState.selectedLabelId === label.id ? null : label.id;
      renderLabeling();
    });
    chip.addEventListener("dragstart", (event) => {
      labelingState.selectedLabelId = label.id;
      event.dataTransfer?.setData("text/plain", label.id);
      if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    });
    bank.append(chip);
  });
  if (bank.childElementCount === 0) bank.append(createElement("p", "all-labels-placed", "Ja has col·locat tots els noms d'este esquema."));
  const feedback = createElement("p", `labeling-feedback is-${labelingState.feedbackType}` , labelingState.feedback);
  feedback.id = "labeling-feedback";
  feedback.setAttribute("aria-live", "polite");
  const mapping = createElement("ol", "label-mapping");
  system.targets.filter((target) => placed[target.labelId]).forEach((target) => {
    const label = system.labels.find((item) => item.id === target.labelId);
    mapping.append(createElement("li", "", `${target.number}. ${label.text}`));
  });
  const resetButton = createElement("button", "button button-quiet reset-labeling", "Reinicia este esquema");
  resetButton.type = "button";
  resetButton.addEventListener("click", () => {
    labelingState.completed[system.id] = {};
    labelingState.selectedLabelId = null;
    labelingState.feedback = "Torna a col·locar els noms als números corresponents.";
    labelingState.feedbackType = "info";
    renderLabeling();
  });
  labelPanel.append(bank, feedback, mapping, resetButton);
  layout.append(diagramPanel, labelPanel);
  dialogContent.append(instructions, tabs, status, layout);
}

function setLabelingFeedback(message, type) {
  labelingState.feedback = message;
  labelingState.feedbackType = type;
  const feedback = document.querySelector("#labeling-feedback");
  if (feedback) {
    feedback.className = `labeling-feedback is-${type}`;
    feedback.textContent = message;
  }
}

function placeLabel(targetLabelId) {
  if (!labelingState?.selectedLabelId) {
    setLabelingFeedback("Primer selecciona o arrossega un nom.", "info");
    return;
  }
  const system = labelingSystems.find((item) => item.id === labelingState.activeSystemId);
  const placed = labelingState.completed[system.id];
  const selected = labelingState.selectedLabelId;
  if (selected !== targetLabelId) {
    setLabelingFeedback("Eixe nom no correspon a esta posició. Torna-ho a provar.", "incorrect");
    return;
  }
  const label = system.labels.find((item) => item.id === selected);
  placed[targetLabelId] = selected;
  labelingState.selectedLabelId = null;
  const allDone = Object.keys(placed).length === system.targets.length;
  const allSystemsDone = labelingSystems.every((item) => {
    const count = Object.keys(labelingState.completed[item.id]).length;
    return count === item.targets.length;
  });
  labelingState.feedback = allDone
    ? (allSystemsDone ? "Has completat els tres esquemes. Molt bé!" : "Esquema completat. Pots continuar amb un altre aparell.")
    : `Correcte: ${label.text}. Continua amb la resta de noms.`;
  labelingState.feedbackType = "correct";
  renderLabeling();
}

function makeMentalQuestions() {
  const operations = ["+", "−", "×"];
  return Array.from({ length: 5 }, () => {
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let first = 2 + Math.floor(Math.random() * 19);
    let second = 2 + Math.floor(Math.random() * 19);
    if (operation === "−" && second > first) [first, second] = [second, first];
    if (operation === "×") {
      first = 2 + Math.floor(Math.random() * 10);
      second = 2 + Math.floor(Math.random() * 10);
    }
    const answer = operation === "+" ? first + second : operation === "−" ? first - second : first * second;
    return { question: `Quant fan ${first} ${operation} ${second}?`, answer, explanation: `${first} ${operation} ${second} = ${answer}.` };
  });
}

function renderQuestion() {
  if (!session) return;
  const { questions, index, activity } = session;
  const item = questions[index];
  dialogContent.replaceChildren();

  const progress = createElement("div", "question-progress");
  const progressText = createElement("span", "", `Pregunta ${index + 1} de ${questions.length}`);
  const progressBar = createElement("span", "progress-track");
  const progressValue = createElement("span", "progress-value");
  progressValue.style.width = `${((index + 1) / questions.length) * 100}%`;
  progressBar.setAttribute("role", "progressbar");
  progressBar.setAttribute("aria-label", spanishContext() ? "Progreso de la actividad" : "Progrés de l'activitat");
  progressBar.setAttribute("aria-valuemin", "1");
  progressBar.setAttribute("aria-valuemax", String(questions.length));
  progressBar.setAttribute("aria-valuenow", String(index + 1));
  progressBar.append(progressValue);
  progress.append(progressText, progressBar);

  const card = createElement("div", "question-card");
  card.append(createElement("h3", "question-prompt", item.question));
  const answerArea = createElement("div", "answer-area");

  if (item.options) {
    const options = createElement("div", "answer-options");
    item.options.forEach((option, optionIndex) => {
      const button = createElement("button", "answer-option", option);
      button.type = "button";
      button.dataset.answerIndex = String(optionIndex);
      button.disabled = session.answered;
      button.addEventListener("click", () => checkQuizAnswer(optionIndex));
      options.append(button);
    });
    answerArea.append(options);
  } else {
    if (activity.kind === "rounding") answerArea.append(createElement("p", "timed-help", "Escriu el nombre sense punts. Pots separar els grups de xifres amb espais."));
    const form = createElement("form", "answer-form");
    const input = document.createElement("input");
    input.id = "short-answer";
    input.name = "answer";
    input.type = "text";
    input.inputMode = "decimal";
    input.autocomplete = "off";
    input.maxLength = 16;
    input.placeholder = "Escriu la resposta";
    input.setAttribute("aria-label", "Escriu la resposta");
    const submit = createElement("button", "button button-primary", "Comprova");
    submit.type = "submit";
    form.append(input);
    if (activity.kind === "rounding") {
      form.classList.add("rounding-answer-form");
      input.inputMode = "none";
      const keypad = createElement("div", "timed-keypad");
      keypad.setAttribute("role", "group");
      keypad.setAttribute("aria-label", "Teclat numèric per a arredonir");
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"].forEach((key) => {
        const button = createElement("button", "keypad-key", key);
        button.type = "button";
        if (key === "C") button.setAttribute("aria-label", "Esborra tot");
        if (key === "⌫") button.setAttribute("aria-label", "Esborra l’últim número");
        button.addEventListener("click", () => {
          if (session.answered) return;
          const start = input.selectionStart ?? input.value.length;
          const end = input.selectionEnd ?? start;
          if (key === "C") input.value = "";
          else if (key === "⌫") input.setRangeText("", start === end ? Math.max(0, start - 1) : start, end, "end");
          else if (input.value.length - (end - start) < input.maxLength) input.setRangeText(key, start, end, "end");
          input.focus({ preventScroll: true });
        });
        keypad.append(button);
      });
      form.append(keypad);
      form.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          if (!event.repeat && !session.answered) form.requestSubmit();
        }
      });
    }
    form.append(submit);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (activity.kind === "rounding" && input.value.trim() === "") {
        document.querySelector("#answer-feedback").textContent = "Escriu un nombre abans de comprovar.";
        return;
      }
      checkNumericAnswer(input.value);
    });
    answerArea.append(form);
    queueMicrotask(() => input.focus());
  }

  const feedback = createElement("p", "answer-feedback");
  feedback.id = "answer-feedback";
  feedback.setAttribute("aria-live", "polite");
  const next = createElement("button", "button button-secondary next-question", index === questions.length - 1 ? "Acaba i veu el resultat" : "Continua");
  next.type = "button";
  next.hidden = !session.answered;
  next.addEventListener("click", advanceQuestion);

  card.append(answerArea, feedback, next);
  dialogContent.append(progress, card);
}

function recordAnswer(isCorrect, explanation) {
  if (session.answered) return;
  session.answered = true;
  if (isCorrect) session.score += 1;
  const feedback = document.querySelector("#answer-feedback");
  feedback.className = `answer-feedback ${isCorrect ? "is-correct" : "is-incorrect"}`;
  feedback.textContent = `${spanishContext() ? (isCorrect ? "Respuesta correcta." : "Todavía no.") : (isCorrect ? "Resposta correcta." : "Encara no.")} ${explanation}`;
  document.querySelector(".next-question").hidden = false;
  dialogContent.querySelectorAll(".answer-option").forEach((button) => {
    button.disabled = true;
    if (Number(button.dataset.answerIndex) === session.questions[session.index].answer) button.classList.add("is-answer");
  });
  const numericForm = dialogContent.querySelector(".answer-form");
  if (numericForm) {
    numericForm.querySelector("input").disabled = true;
    numericForm.querySelectorAll("button").forEach((button) => { button.disabled = true; });
  }
}

function checkQuizAnswer(answerIndex) {
  const item = session.questions[session.index];
  recordAnswer(answerIndex === item.answer, item.explanation);
}

function checkNumericAnswer(value) {
  const item = session.questions[session.index];
  const normalized = Number(value.trim().replace(/\s/g, "").replace(",", "."));
  const isCorrect = value.trim() !== "" && Number.isFinite(normalized) && Math.abs(normalized - Number(item.answer)) < 0.000001;
  recordAnswer(isCorrect, item.explanation);
}

function advanceQuestion() {
  if (!session) return;
  if (session.index < session.questions.length - 1) {
    session.index += 1;
    session.answered = false;
    renderQuestion();
    return;
  }
  renderSummary();
}

function renderSummary() {
  const { score, questions, activity } = session;
  dialogContent.replaceChildren();
  const summary = createElement("div", "summary-card");
  summary.append(createElement("p", "eyebrow", "Activitat completada"));
  summary.append(createElement("h3", "summary-score", `${score} de ${questions.length} ${spanishContext() ? "correctas" : "correctes"}`));
  const message = score === questions.length
    ? "Molt bé! Has encertat totes les respostes."
    : score >= Math.ceil(questions.length / 2)
      ? "Bon treball. Continua practicant per a recordar-ho encara millor."
      : "Cada intent ajuda. Pots tornar a practicar quan vulgues.";
  summary.append(createElement("p", "summary-message", message));
  const actions = createElement("div", "summary-actions");
  const retry = createElement("button", "button button-primary", "Torna-ho a provar");
  retry.type = "button";
  retry.addEventListener("click", () => openActivity(activity));
  const close = createElement("button", "button button-quiet", "Tanca");
  close.type = "button";
  close.addEventListener("click", () => dialog.close());
  actions.append(retry, close);
  summary.append(actions);
  dialogContent.append(summary);
}

document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", stopTimedGame);
dialog.addEventListener("close", stopAlphabetGame);
dialog.addEventListener("close", stopAccentGame);
if (subjectFilter && topicFilter && flipCardButton) {
  subjectFilter.addEventListener("change", () => {
    refreshTopicFilter();
    renderFlashcards();
  });
  topicFilter.addEventListener("change", renderFlashcards);
  flipCardButton.addEventListener("click", () => {
    const showingAnswer = flashcardAnswer.hidden;
    flashcardPrompt.hidden = showingAnswer;
    flashcardAnswer.hidden = !showingAnswer;
    flipCardButton.textContent = visibleFlashcards[currentFlashcardIndex]?.subject === "Castellano" ? (showingAnswer ? "Volver a la pregunta" : "Mostrar la respuesta") : (showingAnswer ? "Torna a la pregunta" : "Mostra la resposta");
    flipCardButton.setAttribute("aria-expanded", String(showingAnswer));
  });
  previousCardButton.addEventListener("click", () => {
    if (currentFlashcardIndex === 0) return;
    currentFlashcardIndex -= 1;
    renderCurrentFlashcard();
  });
  nextCardButton.addEventListener("click", () => {
    if (currentFlashcardIndex >= visibleFlashcards.length - 1) return;
    currentFlashcardIndex += 1;
    renderCurrentFlashcard();
  });
}

buildGameTopicFilter();
renderActivities();
if (subjectFilter && topicFilter) {
  buildFilters();
  renderFlashcards();
}
