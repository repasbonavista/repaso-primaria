const q=(question,options,answer,explanation)=>({question,options,answer,explanation});
const banks={
'ciencies':[
q('Quins òrgans filtren la sang per a produir orina?',['Renyons','Pulmons','Estómac'],0,'Els renyons filtren la sang.'),q('On s’absorbixen principalment els nutrients?',['Intestí prim','Bufeta','Tràquea'],0,'A l’intestí prim passen a la sang.'),q('Quins vasos porten la sang des del cor?',['Artèries','Venes','Urèters'],0,'Les artèries porten la sang des del cor.')],
'examen-ciencies':[
q('Quin aparell fa l’intercanvi de gasos?',['Respiratori','Digestiu','Excretor'],0,'L’aparell respiratori fa l’intercanvi de gasos.'),q('Quina estructura està formada per teixits?',['Un òrgan','Una cèl·lula','Un nutrient'],0,'Els òrgans estan formats per teixits.'),q('Quina funció té el cor?',['Impulsar la sang','Produir saliva','Emmagatzemar orina'],0,'El cor impulsa la sang.')],
'c2-nutrients':[
q('Quin nutrient pot emmagatzemar-se com a reserva energètica?',['Lípids','Oxigen','Soroll'],0,'Els lípids poden actuar com a reserva.'),q('Quin nutrient ajuda a formar teixits?',['Proteïnes','Diòxid de carboni','Aire'],0,'Les proteïnes ajuden a formar i reparar teixits.'),q('Quines substàncies regulen funcions del cos?',['Vitamines i minerals','Només aire','Només fibra'],0,'Les vitamines i els minerals participen en moltes funcions.')],
'c2-grups':[
q('En la roda del llibre, quin grup inclou els cereals?',['Grup I','Grup V','Grup VI'],0,'El grup I inclou aliments elaborats amb cereals.'),q('Quin grup de la roda inclou la fruita fresca?',['Grup VI','Grup II','Grup IV'],0,'Les fruites fresques apareixen en el grup VI.'),q('Quina funció destaca en els olis?',['Energètica','Exclusivament reguladora','Cap'],0,'Els olis són rics en lípids que aporten energia.')],
'c2-saludable':[
q('Què ajuda a aconseguir una alimentació variada?',['Combinar diferents grups d’aliments','Menjar sempre un sol aliment','Evitar tota l’aigua'],0,'Cada grup pot aportar nutrients diferents.'),q('Què significa que siga adaptada?',['Que s’ajuste a les circumstàncies de cada persona','Que siga idèntica per a tots','Que només incloga aliments llunyans'],0,'Les necessitats i circumstàncies poden variar.'),q('Què significa una dieta sostenible?',['Que tinga en compte el medi ambient','Que continga un únic aliment','Que no utilitze plats'],0,'La sostenibilitat considera l’impacte ambiental.')],
'c2-sostenible':[
q('Quina acció pot reduir els residus?',['Reutilitzar bosses','Usar més envasos d’un sol ús','Tirar aliments en bon estat'],0,'Reutilitzar ajuda a reduir residus.'),q('Què podem fer abans de comprar?',['Planificar què necessitem','Comprar sense mirar què hi ha a casa','Tirar les restes'],0,'Planificar ajuda a evitar el malbaratament.'),q('Un aliment de proximitat es produïx...',['Prop del lloc de consum','Sempre en un altre continent','Només dins de casa'],0,'La proximitat fa referència al lloc de producció.')],
'nombres-tema-1':[
q('Quin és el valor del 7 en 712 345?',['700 000','70 000','7 000'],0,'El 7 ocupa les centenes de miler.'),q('Quin nombre és major?',['805 000','80 500','8 050'],0,'805 000 té més valor.'),q('Quina operació mostra la propietat commutativa?',['8 + 4 = 4 + 8','8 − 4 = 4 − 8','8 + 4 = 8 − 4'],0,'Canviem l’ordre dels sumands.')],
 't2-propietats':[
q('Quant és 16 × 100?',['1 600','160','16 000'],0,'Multiplicar per 100 dona 1 600.'),q('Quina expressió equival a 3 × (5 + 2)?',['3 × 5 + 3 × 2','3 × 5 + 2','3 + 5 + 2'],0,'Distribuïm el factor 3.'),q('Quina igualtat mostra la commutativa?',['6 × 4 = 4 × 6','6 × 4 = 6 + 4','6 × 4 = 6 − 4'],0,'Canviem l’ordre dels factors.')],
 't2-combinades':[
q('Quant és 4 + 3 × 2?',['10','14','8'],0,'Primer 3 × 2; després sumem 4.'),q('Quant és (4 + 3) × 2?',['14','10','9'],0,'Primer el parèntesi: 7 × 2 = 14.'),q('Quant és 20 − 12 ÷ 3?',['16','8','4'],0,'Primer 12 ÷ 3 = 4; després 20 − 4.')],
 't2-potencies':[
q('Quant és 6²?',['36','12','18'],0,'6 × 6 = 36.'),q('Quant és 2⁴?',['16','8','6'],0,'2 × 2 × 2 × 2 = 16.'),q('Quina és la base de 9³?',['9','3','27'],0,'El factor repetit és 9.')],
 't2-multiples':[
q('Quin és múltiple de 8?',['40','42','45'],0,'8 × 5 = 40.'),q('Quin és el m. c. m. de 2 i 3?',['6','5','12'],0,'6 és el menor múltiple positiu comú.'),q('Quin és el m. c. m. de 4 i 8?',['8','12','16'],0,'8 és el menor múltiple positiu que compartixen.')],
'comunicacio':[
q('Qui envia el missatge?',['Emissor','Receptor','Canal'],0,'L’emissor transmet el missatge.'),q('Qui rep el missatge?',['Receptor','Emissor','Codi'],0,'El receptor rep la informació.'),q('Què és el canal?',['El mitjà pel qual viatja el missatge','La persona que parla','La idea que es comunica'],0,'El canal és el mitjà de transmissió.')],
'v2-camps':[
q('Quina paraula pertany al camp dels oficis?',['Fuster','Taronja','Baló'],0,'Fuster és un ofici.'),q('Quin grup correspon als colors?',['Verd, blau, groc','Pera, poma, pruna','Peix, gat, gos'],0,'Verd, blau i groc són colors.'),q('Quina paraula pertany al camp de la música?',['Piano','Cadira','Pera'],0,'El piano és un instrument musical.')],
'v2-oracio':[
q('En «La gata dorm», quin és el subjecte?',['La gata','Dorm','Gata dorm'],0,'El subjecte és la gata.'),q('En «Els ocells volen», quin és el verb?',['Volen','Ocells','Els'],0,'Volen és el verb.'),q('En «El xiquet llig un conte», quin és el predicat?',['Llig un conte','El xiquet','Un conte'],0,'El predicat explica què fa el subjecte.')],
'v2-vocals':[
q('En «rei», ei forma...',['Un diftong','Un hiat','Dues síl·labes'],0,'Les vocals es pronuncien en una mateixa síl·laba.'),q('En «país», les vocals formen...',['Un hiat','Un diftong','Una consonant'],0,'Pa-ís: les vocals estan en síl·labes diferents.'),q('En «cuina», ui forma...',['Un diftong','Un hiat','Dues paraules'],0,'Cui-na: ui forma una sola síl·laba.')],
'v2-poesia':[
q('Com s’anomena una línia d’un poema?',['Vers','Paràgraf de diccionari','Títol'],0,'Cada línia és un vers.'),q('Quines paraules rimen?',['Flor i color','Flor i casa','Color i taula'],0,'Flor i color compartixen el so final.'),q('Què aporta musicalitat al poema?',['El ritme','Una suma','Un dibuix'],0,'El ritme aporta musicalitat.')],
'v2-puntuacio':[
q('Quin signe tanca una pregunta?',['Interrogació','Coma','Dos punts'],0,'La interrogació indica una pregunta.'),q('Quin signe separa paraules en una llista?',['Coma','Interrogació','Exclamació'],0,'La coma separa elements d’una enumeració.'),q('Quin signe pot introduir una enumeració?',['Dos punts','Interrogació','Exclamació'],0,'Els dos punts poden introduir una llista.')],
'comunicacio-castella':[
q('¿Quién transmite el mensaje?',['Emisor','Receptor','Canal'],0,'El emisor transmite la información.'),q('¿Quién recibe el mensaje?',['Receptor','Emisor','Código'],0,'El receptor recibe la información.'),q('¿Qué es el canal?',['El medio por el que se transmite el mensaje','La persona que habla','La información'],0,'El canal es el medio de transmisión.')],
 'titla-castella':[
q('¿Qué palabra está bien escrita?',['camión','camion','camíon'],0,'Camión es aguda y termina en n.'),q('¿Qué palabra está bien escrita?',['lápiz','lapiz','lapíz'],0,'Lápiz es llana y termina en z.'),q('¿Qué palabra está bien escrita?',['música','musica','musíca'],0,'Música es esdrújula y lleva tilde.')],
 'generes-castella':[
q('¿Qué género suele expresar sentimientos en verso?',['Lírica','Teatro','Narración'],0,'La lírica expresa emociones y sentimientos.'),q('¿Qué género está pensado para ser representado?',['Teatro','Lírica','Diccionario'],0,'El teatro se escribe para representarse.'),q('¿A qué género pertenece una fábula?',['Narración','Teatro','Lírica'],0,'La fábula es una obra narrativa.')]
};
export function extraQuestions(id){return banks[id]||[];}
