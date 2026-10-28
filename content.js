import { castellaFlashcards } from "./castella-content.js";
import { valenciaFlashcards } from "./valencia-content.js";
import { mathFlashcards } from "./math-content.js";

const allActivities = [
  {
    id: "mental",
    title: "Càlcul mental",
    subject: "Matemàtiques",
    description: "Resol operacions ràpides i comprova cada resposta.",
    detail: "5 operacions · Suma, resta i multiplicació",
    kind: "mental",
    icon: "01",
  },
  {
    id: "ciencies",
    title: "Repàs de ciències",
    subject: "Ciències",
    topic: "Tema 1",
    description: "Repassa el cos humà i la funció de nutrició.",
    detail: "10 preguntes · Tema 1",
    kind: "quiz",
    icon: "02",
    questions: [
      { question: "Quina és la unitat més xicoteta de la matèria viva capaç de fer les funcions vitals?", options: ["La cèl·lula", "L'òrgan", "El teixit"], answer: 0, explanation: "La cèl·lula és la unitat més senzilla de la matèria viva que pot fer les funcions vitals." },
      { question: "Quin ordre va de l'estructura més senzilla a la més complexa?", options: ["Cèl·lula, teixit, òrgan, aparell o sistema", "Òrgan, cèl·lula, sistema, teixit", "Teixit, aparell, cèl·lula, òrgan"], answer: 0, explanation: "Les cèl·lules formen teixits; els teixits formen òrgans, i els òrgans s'agrupen en aparells o sistemes." },
      { question: "Quins aparells intervenen en la funció de nutrició?", options: ["Digestiu, respiratori, circulatori i excretor", "Nerviós i locomotor", "Només digestiu i respiratori"], answer: 0, explanation: "En la nutrició intervenen els aparells digestiu, respiratori, circulatori i excretor." },
      { question: "On comença la digestió?", options: ["A la boca", "A l'estómac", "A l'intestí gros"], answer: 0, explanation: "La digestió comença a la boca: les dents tallen i trituren els aliments, i la llengua els mescla amb saliva." },
      { question: "On s'absorbeixen la major part dels nutrients?", options: ["A l'intestí prim", "A l'esòfag", "A la boca"], answer: 0, explanation: "A l'intestí prim, els nutrients passen a la sang a través de les vellositats." },
      { question: "Què ocorre durant la inspiració?", options: ["El diafragma es contrau i baixa; entra aire als pulmons", "El diafragma es relaxa i puja; ix aire", "La sang deixa de circular"], answer: 0, explanation: "Quan inspirem, el diafragma es contrau i baixa, els pulmons s'unflen i l'aire entra." },
      { question: "On es fa l'intercanvi de gasos als pulmons?", options: ["Als alvèols", "A la tràquea", "A la laringe"], answer: 0, explanation: "Als alvèols, l'oxigen passa a la sang i el diòxid de carboni passa de la sang a l'aire." },
      { question: "Què transporten les artèries?", options: ["La sang des del cor cap als òrgans", "La sang dels òrgans cap al cor", "L'orina fins a la bufeta"], answer: 0, explanation: "Les artèries conduïxen la sang des del cor fins als òrgans." },
      { question: "Quina funció fan els renyons?", options: ["Filtren la sang i produïxen l'orina", "Bombejen la sang", "Absorbixen l'oxigen de l'aire"], answer: 0, explanation: "Els renyons filtren la sang per a eliminar substàncies de rebuig i produïxen l'orina." },
      { question: "Quina substància de rebuig s'expulsa en l'aire durant l'espiració?", options: ["Diòxid de carboni", "Oxigen", "Sal"], answer: 0, explanation: "En espirar, expulsem aire que conté diòxid de carboni procedent de l'activitat de les cèl·lules." },
    ],
  },
  {
    id: "etiquetar-aparells",
    title: "Etiqueta els aparells",
    subject: "Ciències",
    topic: "Tema 1",
    description: "Arrossega els noms dels òrgans als esquemes del cos humà.",
    detail: "3 esquemes · 17 etiquetes",
    kind: "labeling",
    icon: "03",
  },
  {
    id: "examen-ciencies",
    title: "Repàs de la prova · Tema 1",
    subject: "Ciències",
    topic: "Tema 1",
    description: "Practica amb preguntes variades basades en els exàmens de la unitat.",
    detail: "12 preguntes · Correcció immediata",
    kind: "quiz",
    icon: "04",
    questions: [
      { question: "Quin terme és una part de la cèl·lula?", options: ["Citoplasma", "Cloroplasma", "Citomaspla"], answer: 0, explanation: "El citoplasma és una de les parts de la cèl·lula, junt amb la membrana plasmàtica i el material genètic." },
      { question: "Quin és l'ordre correcte dels nivells d'organització, de menor a major?", options: ["Cèl·lula → teixit → òrgan → aparell o sistema → organisme", "Teixit → cèl·lula → aparell → òrgan → organisme", "Òrgan → teixit → cèl·lula → organisme → sistema"], answer: 0, explanation: "Les cèl·lules formen teixits; els teixits formen òrgans; i els òrgans formen aparells o sistemes que constituïxen l'organisme." },
      { question: "Quina d'estes no és una funció vital?", options: ["Desplaçament", "Nutrició", "Reproducció"], answer: 0, explanation: "Les tres funcions vitals són nutrició, relació i reproducció." },
      { question: "Quin aparell no intervé en la funció de nutrició?", options: ["L'aparell reproductor", "L'aparell digestiu", "L'aparell excretor"], answer: 0, explanation: "En la nutrició intervenen els aparells digestiu, respiratori, circulatori i excretor." },
      { question: "Quin nutrient aporta energia i es troba, per exemple, en l'arròs i el pa?", options: ["Els hidrats de carboni", "Les vitamines", "Les sals minerals"], answer: 0, explanation: "Els hidrats de carboni o sucres proporcionen energia." },
      { question: "Quina part no pertany a l'aparell digestiu?", options: ["Els pulmons", "El fetge", "L'estómac"], answer: 0, explanation: "Els pulmons formen part de l'aparell respiratori." },
      { question: "Quina d'estes parts pertany a l'aparell respiratori?", options: ["La tràquea", "Els renyons", "Les cèl·lules sanguínies"], answer: 0, explanation: "La tràquea forma part de les vies respiratòries." },
      { question: "Quins òrgans produïxen l'orina?", options: ["Els renyons", "Els bronquis", "Els pulmons"], answer: 0, explanation: "Els renyons filtren la sang i produïxen l'orina." },
      { question: "Com s'anomena el moviment rítmic del cor que impulsa la sang?", options: ["Batec cardíac", "Inspiració", "Digestió"], answer: 0, explanation: "El batec cardíac és el moviment de contracció i dilatació del cor." },
      { question: "Quin d'estos no és un element cel·lular de la sang?", options: ["El plasma", "El glòbul roig", "La plaqueta"], answer: 0, explanation: "El plasma és la part líquida de la sang; els glòbuls rojos, els glòbuls blancs i les plaquetes són els elements cel·lulars." },
      { question: "En quina forma s'expulsen les restes que no s'aprofiten de la digestió?", options: ["En forma de femtes", "En forma d'orina", "En forma de diòxid de carboni"], answer: 0, explanation: "Les restes de la digestió que no podem aprofitar s'expulsen en forma de femtes." },
      { question: "Què passa amb els nutrients a l'intestí prim?", options: ["S'absorbixen i passen a la sang", "Es transformen en aire", "S'emmagatzemen a la bufeta"], answer: 0, explanation: "Els nutrients passen a la sang a través de les vellositats intestinals." },
    ],
  },
  {
    id: "llengues",
    title: "Repàs de llengües",
    subject: "Llengües",
    description: "Practica vocabulari i ortografia en valencià i castellà.",
    detail: "5 preguntes · Tria una resposta",
    kind: "quiz",
    icon: "04",
    questions: [
      { question: "Quina paraula està ben escrita en valencià?", options: ["plaça", "plasa", "plassa"], answer: 0, explanation: "En valencià escrivim plaça, amb ç." },
      { question: "Quin és el plural de «luz» en castellà?", options: ["luces", "luzes", "luzs"], answer: 0, explanation: "En castellà, el plural de luz és luces." },
      { question: "Quina paraula és un verb?", options: ["córrer", "finestra", "blau"], answer: 0, explanation: "Córrer és un verb: expressa una acció." },
      { question: "Quina paraula porta accent en castellà?", options: ["canción", "mesa", "casa"], answer: 0, explanation: "Canción porta accent perquè és aguda i acaba en n." },
      { question: "Quin és un sinònim de «ràpid»?", options: ["veloç", "lent", "menut"], answer: 0, explanation: "Veloç té un significat semblant a ràpid." },
    ],
  },
  {
    id: "matematiques",
    title: "Repàs de matemàtiques",
    subject: "Matemàtiques",
    description: "Posa a prova el que saps de nombres, fraccions i geometria.",
    detail: "5 preguntes · Tria una resposta",
    kind: "quiz",
    icon: "05",
    questions: [
      { question: "Quina fracció és equivalent a 1/2?", options: ["2/4", "2/3", "3/5"], answer: 0, explanation: "2/4 és equivalent a 1/2 perquè les dues fraccions representen la mateixa quantitat." },
      { question: "Quant fan 1,4 + 0,8?", options: ["2,2", "1,12", "2,12"], answer: 0, explanation: "1,4 + 0,8 = 2,2." },
      { question: "Quant és un quart de 20?", options: ["5", "4", "10"], answer: 0, explanation: "20 ÷ 4 = 5." },
      { question: "Quant fan 9 × 6?", options: ["54", "56", "64"], answer: 0, explanation: "9 × 6 = 54." },
      { question: "Quin és el perímetre d'un quadrat de 4 cm de costat?", options: ["16 cm", "12 cm", "8 cm"], answer: 0, explanation: "Un quadrat té quatre costats iguals: 4 × 4 = 16 cm." },
    ],
  },
];

export const activities = allActivities.filter((activity) => activity.subject !== "Ciències");
activities[0] = {
  id: "mental-seccio", title: "Càlcul mental", subject: "Matemàtiques",
  description: "Tria un repte d'un minut: multiplicacions, sumes o restes de càlcul mental.",
  detail: "4 jocs · 60 segons", kind: "link", href: "./calcul-mental.html", icon: "01",
};
activities.splice(1, 0, {
  id: "ciencies-seccio",
  title: "Repàs de ciències",
  subject: "Ciències",
    topic: "Tema 1",
  description: "Tria un joc per a repassar el cos humà i la funció de nutrició.",
  detail: "Tema 1 · 4 jocs",
  kind: "link",
  href: "./ciencies.html",
  icon: "03",
});

const mathsIndex = activities.findIndex(activity => activity.id === "matematiques");
activities[mathsIndex] = { id: "matematiques-seccio", title: "Repàs de matemàtiques", subject: "Matemàtiques", description: "Repassa els nombres, les propietats i les aproximacions del tema 1.", detail: "Tema 1 · 3 jocs", kind: "link", href: "./matematiques.html", icon: "05" };

const languageIndex = activities.findIndex(activity => activity.id === "llengues");
activities[languageIndex] = { id: "valencia-seccio", title: "Repàs de valencià", subject: "Valencià", description: "Practica el tema 1 de Valencià: diccionari, comunicació i narració.", detail: "Valencià · Tema 1 · 3 jocs", kind: "link", href: "./valencia.html", icon: "04" };

activities.splice(languageIndex + 1, 0, { id: "castella-seccio", title: "Repaso de castellano", subject: "Castellano", description: "Practica el tema 1: comunicación, sílabas, acentuación y géneros literarios.", detail: "Tema 1 · 4 juegos", kind: "link", href: "./castella.html", icon: "05" });

export const scienceActivities = allActivities.filter((activity) => activity.subject === "Ciències");
scienceActivities.unshift({
  id: "relaciona-conceptes",
  title: "Relaciona conceptes",
  subject: "Ciències · Tema 1",
  topic: "Tema 1",
  description: "Uneix cada aparell o òrgan amb la funció que li correspon.",
  detail: "8 parelles · Un repte de relació",
  kind: "matching",
  icon: "01",
});

export const matchingPairs = [
  { id: "digestiu", term: "Aparell digestiu", definition: "Descompon els aliments i n'extrau els nutrients." },
  { id: "respiratori", term: "Aparell respiratori", definition: "Obté oxigen de l'aire i expulsa diòxid de carboni." },
  { id: "circulatori", term: "Aparell circulatori", definition: "Distribuïx nutrients a les cèl·lules i retira productes de rebuig." },
  { id: "excretor", term: "Aparell excretor", definition: "Elimina substàncies de rebuig i produïx l'orina als renyons." },
  { id: "artèries", term: "Artèries", definition: "Porten la sang des del cor fins als òrgans." },
  { id: "venes", term: "Venes", definition: "Porten la sang des dels òrgans fins al cor." },
  { id: "alvèols", term: "Alvèols", definition: "Sacs menuts on s'intercanvien l'oxigen i el diòxid de carboni." },
  { id: "intestí-prim", term: "Intestí prim", definition: "Absorbix els nutrients i els passa a la sang." },
];

export const flashcards = [
  ...mathFlashcards,
  ...valenciaFlashcards,
  ...castellaFlashcards,
  { subject: "Ciències", topic: "Tema 1", front: "Quina és la unitat de vida més senzilla capaç de fer les funcions vitals?", back: "La cèl·lula." },
  { subject: "Ciències", topic: "Tema 1", front: "Quines tres funcions vitals fan els éssers vius?", back: "Nutrició, relació i reproducció." },
  { subject: "Ciències", topic: "Tema 1", front: "Quines tres parts tenen totes les cèl·lules?", back: "Membrana plasmàtica, citoplasma i material genètic." },
  { subject: "Ciències", topic: "Tema 1", front: "Amb quin instrument podem observar les cèl·lules?", back: "Amb un microscopi." },
  { subject: "Ciències", topic: "Tema 1", front: "Què és un teixit?", back: "Un conjunt de cèl·lules que s'agrupen per a fer una funció determinada." },
  { subject: "Ciències", topic: "Tema 1", front: "Què és un òrgan?", back: "Una associació de teixits diferents que treballen junts per a fer una funció." },
  { subject: "Ciències", topic: "Tema 1", front: "Què formen els aparells i els sistemes?", back: "Agrupacions d'òrgans que treballen junts en processos més complexos." },
  { subject: "Ciències", topic: "Tema 1", front: "Ordena els nivells: òrgans, cèl·lules, sistemes, teixits.", back: "Cèl·lules → teixits → òrgans → aparells o sistemes." },
  { subject: "Ciències", topic: "Tema 1", front: "De quines cèl·lules està format el teixit nerviós?", back: "De neurones." },
  { subject: "Ciències", topic: "Tema 1", front: "El cervell és un teixit o un òrgan?", back: "És un òrgan format per diferents teixits, entre els quals hi ha el teixit nerviós." },

  { subject: "Ciències", topic: "Tema 1", front: "En què consistix la nutrició?", back: "A obtindre els nutrients que necessiten les cèl·lules, utilitzar-los i expulsar les substàncies de rebuig." },
  { subject: "Ciències", topic: "Tema 1", front: "Què obtenen les cèl·lules dels nutrients dels aliments i de l'oxigen?", back: "La matèria i l'energia que necessiten." },
  { subject: "Ciències", topic: "Tema 1", front: "Quins quatre aparells intervenen en la nutrició?", back: "El digestiu, el respiratori, el circulatori i l'excretor." },
  { subject: "Ciències", topic: "Tema 1", front: "Quina funció tenen els hidrats de carboni o sucres?", back: "Proporcionen energia. En trobem, per exemple, en la pasta, l'arròs i el pa." },
  { subject: "Ciències", topic: "Tema 1", front: "Quina funció tenen els lípids?", back: "Aporten energia, que es pot emmagatzemar com a reserva. Per exemple, en la mantega i l'oli." },
  { subject: "Ciències", topic: "Tema 1", front: "Per a què són essencials les proteïnes?", back: "Per a créixer i reparar parts del cos. N'hi ha en la llet, els ous, el peix i la carn." },
  { subject: "Ciències", topic: "Tema 1", front: "Quina funció tenen les vitamines i les sals minerals?", back: "Ajuden que el nostre cos funcione bé." },
  { subject: "Ciències", topic: "Tema 1", front: "En quins aliments podem trobar vitamines i sals minerals?", back: "En fruites, hortalisses, verdures i llegums." },
  { subject: "Ciències", topic: "Tema 1", front: "Per què és imprescindible l'aigua per a l'organisme?", back: "Perquè és present en les cèl·lules i intervé en els processos de nutrició." },

  { subject: "Ciències", topic: "Tema 1", front: "Quina és la funció de l'aparell digestiu?", back: "Transformar els aliments en nutrients que puguen ser absorbits i passar a la sang; les restes s'expulsen." },
  { subject: "Ciències", topic: "Tema 1", front: "Quines dues parts principals formen l'aparell digestiu?", back: "El tub digestiu i les glàndules digestives." },
  { subject: "Ciències", topic: "Tema 1", front: "Què fan les glàndules digestives?", back: "Produïxen substàncies que aboquen al tub digestiu i que ajuden a descompondre els aliments." },
  { subject: "Ciències", topic: "Tema 1", front: "Què fan les dents i la llengua durant la digestió?", back: "Les dents tallen i trituren els aliments; la llengua els mescla amb la saliva." },
  { subject: "Ciències", topic: "Tema 1", front: "Quines glàndules produïxen la saliva?", back: "Les glàndules salivals." },
  { subject: "Ciències", topic: "Tema 1", front: "Per on baixa el menjar des de la faringe fins a l'estómac?", back: "Per l'esòfag." },
  { subject: "Ciències", topic: "Tema 1", front: "Què passa amb els aliments a l'estómac?", back: "Es mesclen amb els sucs gàstrics i es transformen en un líquid espés." },
  { subject: "Ciències", topic: "Tema 1", front: "Quins òrgans produïxen sucs que continuen la digestió a l'intestí prim?", back: "El fetge i el pàncrees." },
  { subject: "Ciències", topic: "Tema 1", front: "Per on passen els nutrients de l'intestí prim a la sang?", back: "A través de les vellositats intestinals." },
  { subject: "Ciències", topic: "Tema 1", front: "Què fa l'intestí gros?", back: "Extrau aigua i altres substàncies de les restes i forma les femtes." },
  { subject: "Ciències", topic: "Tema 1", front: "Per on s'expulsen les femtes?", back: "Per l'anus." },

  { subject: "Ciències", topic: "Tema 1", front: "Quina és la funció de l'aparell respiratori?", back: "Permetre l'entrada i l'eixida de l'aire que respirem." },
  { subject: "Ciències", topic: "Tema 1", front: "Quin recorregut fa l'aire per les vies respiratòries?", back: "Pot passar per les fosses nasals o la boca, i continua per la faringe, la laringe, la tràquea i els bronquis." },
  { subject: "Ciències", topic: "Tema 1", front: "Com són els pulmons?", back: "Són òrgans esponjosos formats per les ramificacions dels bronquis i els alvèols." },
  { subject: "Ciències", topic: "Tema 1", front: "Quin múscul ajuda a contraure i dilatar els pulmons?", back: "El diafragma." },
  { subject: "Ciències", topic: "Tema 1", front: "En què consistix la respiració?", back: "A agafar oxigen de l'aire, portar-lo a les cèl·lules i expulsar el diòxid de carboni que s'hi produïx." },
  { subject: "Ciències", topic: "Tema 1", front: "Què fa el diafragma quan inspirem?", back: "Es contrau i baixa; així els pulmons s'unflen i l'aire entra." },
  { subject: "Ciències", topic: "Tema 1", front: "Què ocorre als alvèols durant l'intercanvi de gasos?", back: "L'oxigen passa dels alvèols a la sang i el diòxid de carboni passa de la sang als alvèols." },
  { subject: "Ciències", topic: "Tema 1", front: "Què fa el diafragma quan espirem?", back: "Es relaxa i puja; els pulmons es contrauen i l'aire ix." },
  { subject: "Ciències", topic: "Tema 1", front: "Per on ix el diòxid de carboni quan espirem?", back: "Des dels alvèols, passa pels bronquis i la resta de vies respiratòries fins a l'exterior." },

  { subject: "Ciències", topic: "Tema 1", front: "Quina és la funció de l'aparell circulatori?", back: "Distribuir els nutrients fins a les cèl·lules i retirar-ne els productes de rebuig." },
  { subject: "Ciències", topic: "Tema 1", front: "Quines parts formen l'aparell circulatori?", back: "El cor, els vasos sanguinis i la sang." },
  { subject: "Ciències", topic: "Tema 1", front: "Quantes cavitats té el cor i com s'anomenen?", back: "Quatre: dues aurícules i dos ventricles." },
  { subject: "Ciències", topic: "Tema 1", front: "Quin recorregut fa la sang per les artèries?", back: "Va des del cor fins als òrgans." },
  { subject: "Ciències", topic: "Tema 1", front: "Quin recorregut fa la sang per les venes?", back: "Va des dels òrgans fins al cor." },
  { subject: "Ciències", topic: "Tema 1", front: "Quina funció tenen els capil·lars?", back: "Connecten les venes amb les artèries i arriben a totes les cèl·lules; són molt fins." },
  { subject: "Ciències", topic: "Tema 1", front: "Què és el plasma sanguini?", back: "Una mescla líquida d'aigua i sals minerals que transporta nutrients i substàncies de rebuig." },
  { subject: "Ciències", topic: "Tema 1", front: "Quins elements cel·lulars hi ha a la sang?", back: "Glòbuls rojos, glòbuls blancs i plaquetes." },
  { subject: "Ciències", topic: "Tema 1", front: "Què és el batec cardíac?", back: "El moviment rítmic de contracció i dilatació del cor que impulsa la sang." },
  { subject: "Ciències", topic: "Tema 1", front: "Què passa amb la sang quan el cor es contrau?", back: "Les cavitats es comprimeixen i la sang ix cap als òrgans per les artèries." },
  { subject: "Ciències", topic: "Tema 1", front: "Què passa amb la sang quan el cor es dilata?", back: "Les cavitats s'omplin amb la sang que arriba des dels òrgans per les venes." },
  { subject: "Ciències", topic: "Tema 1", front: "Què registra un electrocardiograma?", back: "L'activitat elèctrica del cor." },

  { subject: "Ciències", topic: "Tema 1", front: "En què consistix l'excreció?", back: "A eliminar del cos les substàncies de rebuig que generen les cèl·lules." },
  { subject: "Ciències", topic: "Tema 1", front: "Quin aparell expulsa les substàncies de rebuig que generen les cèl·lules?", back: "L'aparell excretor." },
  { subject: "Ciències", topic: "Tema 1", front: "Quins òrgans filtren la sang i produïxen l'orina?", back: "Els renyons." },
  { subject: "Ciències", topic: "Tema 1", front: "Quina funció tenen les vies urinàries?", back: "Transporten l'orina des dels renyons fins a l'exterior del cos." },
  { subject: "Ciències", topic: "Tema 1", front: "Què són les nefrones?", back: "Unitats formades per tubs molt fins i capil·lars sanguinis que formen part dels renyons." },
  { subject: "Ciències", topic: "Tema 1", front: "Quin conducte porta l'orina del renyó a la bufeta?", back: "L'urèter." },
  { subject: "Ciències", topic: "Tema 1", front: "Quin òrgan emmagatzema l'orina abans d'expulsar-la?", back: "La bufeta urinària." },
  { subject: "Ciències", topic: "Tema 1", front: "Per quin conducte ix l'orina de la bufeta a l'exterior?", back: "Per la uretra." },
  { subject: "Ciències", topic: "Tema 1", front: "Quina substància de rebuig expulsa l'aparell digestiu?", back: "Les femtes." },
  { subject: "Ciències", topic: "Tema 1", front: "Quina substància de rebuig expulsa l'aparell respiratori?", back: "El diòxid de carboni." },
  { subject: "Ciències", topic: "Tema 1", front: "Què expulsen les glàndules sudorípares?", back: "Suor, un líquid carregat de sals i substàncies de rebuig." },
  { subject: "Ciències", topic: "Tema 1", front: "Quins són els quatre exemples d'eliminació de substàncies de rebuig del tema?", back: "Les femtes, el diòxid de carboni, l'orina i la suor." },
];




export const labelingSystems = [
  {
    id: "digestiu",
    title: "Aparell digestiu",
    labels: [
      { id: "boca", text: "Boca" },
      { id: "esofag", text: "Esòfag" },
      { id: "estomac", text: "Estómac" },
      { id: "fetge", text: "Fetge" },
      { id: "pancrees", text: "Pàncrees" },
      { id: "intesti-prim", text: "Intestí prim" },
      { id: "intesti-gros", text: "Intestí gros" },
      { id: "recte", text: "Recte" },
    ],
    targets: [
      { labelId: "boca", number: 1, x: 180, y: 115 },
      { labelId: "esofag", number: 2, x: 180, y: 162 },
      { labelId: "estomac", number: 3, x: 210, y: 207 },
      { labelId: "fetge", number: 4, x: 132, y: 200 },
      { labelId: "pancrees", number: 5, x: 211, y: 237 },
      { labelId: "intesti-prim", number: 6, x: 180, y: 280 },
      { labelId: "intesti-gros", number: 7, x: 180, y: 327 },
      { labelId: "recte", number: 8, x: 180, y: 372 },
    ],
  },
  {
    id: "respiratori",
    title: "Aparell respiratori",
    labels: [
      { id: "nas-boca", text: "Nas i boca" },
      { id: "traquea", text: "Tràquea" },
      { id: "bronquis", text: "Bronquis" },
      { id: "pulmons", text: "Pulmons" },
      { id: "diafragma", text: "Diafragma" },
    ],
    targets: [
      { labelId: "nas-boca", number: 1, x: 180, y: 115 },
      { labelId: "traquea", number: 2, x: 180, y: 161 },
      { labelId: "bronquis", number: 3, x: 180, y: 206 },
      { labelId: "pulmons", number: 4, x: 180, y: 257 },
      { labelId: "diafragma", number: 5, x: 180, y: 317 },
    ],
  },
  {
    id: "excretor",
    title: "Aparell excretor",
    labels: [
      { id: "renyons", text: "Renyons" },
      { id: "ureters", text: "Urèters" },
      { id: "bufeta", text: "Bufeta urinària" },
      { id: "uretra", text: "Uretra" },
    ],
    targets: [
      { labelId: "renyons", number: 1, x: 180, y: 216 },
      { labelId: "ureters", number: 2, x: 180, y: 284 },
      { labelId: "bufeta", number: 3, x: 180, y: 337 },
      { labelId: "uretra", number: 4, x: 180, y: 377 },
    ],
  },
];

export const mentalActivities = [
  { id: 'taules-minut', title: 'Les taules en un minut', subject: 'Matemàtiques', description: 'Quantes multiplicacions de les taules de l’1 al 10 pots resoldre?', detail: '60 segons · Multiplicacions', kind: 'timed', mode: 'multiply', icon: '01' },
  { id: 'sumes-petites', title: 'Sumes ràpides', subject: 'Matemàtiques', description: 'Practica sumes de nombres menuts, com 8 + 5, 9 + 6 o 7 + 4.', detail: '60 segons · Nombres d’una xifra', kind: 'timed', mode: 'small', icon: '02' },
  { id: 'restes-petites', title: 'Restes ràpides', subject: 'Matemàtiques', description: 'Practica restes amb nombres menuts, com 12 − 5 o 8 − 3, sense resultats negatius.', detail: '60 segons · Nombres fins a 20', kind: 'timed', mode: 'subtract', icon: '03' },
  { id: 'sumes-estrategies', title: 'Suma amb estratègia', subject: 'Matemàtiques', description: 'Resol sumes de dues xifres. Al final descobriràs trucs per a calcular-les.', detail: '60 segons · Trucs al final', kind: 'timed', mode: 'strategy', icon: '03' },
];
