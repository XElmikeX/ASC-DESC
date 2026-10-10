// =================================================================
// 1. NAVEGACIÓN PRINCIPAL DEL SITIO
// =================================================================
function showMainSection(secId) {
  document.querySelectorAll('.main-sec').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const activeSec = document.getElementById(`sec-${secId}`);
  if (activeSec) activeSec.classList.add('active');

  const activeBtn = Array.from(document.querySelectorAll('.nav-btn')).find(b => {
    const onclickAttr = b.getAttribute('onclick');
    return onclickAttr && onclickAttr.includes(`'${secId}'`);
  });
  if (activeBtn) activeBtn.classList.add('active');

  // Si se cambia de sección, pausar el cronómetro del test avanzado si estuviera corriendo
  if (secId !== 'test-avanzado' && timerInterval) {
    clearInterval(timerInterval);
  } else if (secId === 'test-avanzado' && advCurrentIndex < ADVANCED_QUESTIONS.length && !advAnswersState[advCurrentIndex]) {
    startAdvTimer();
  }
}


// =================================================================
// 2. LÓGICA DEL TEST VISUAL DE PRIMITIVAS
// =================================================================
const SVG_TEMPLATES = {
  // Descendentes
  'D-1_init': `<svg viewBox="0 0 160 80"><rect x="40" y="30" width="80" height="25" class="node-rect"/></svg>`,
  'D-1_res': `<svg viewBox="0 0 160 120">
    <rect x="50" y="10" width="60" height="20" class="node-rect"/>
    <line x1="80" y1="30" x2="80" y2="40" class="line-conn"/>
    <polygon points="80,40 95,52 80,64 65,52" class="node-rhombus"/>
    <line x1="80" y1="64" x2="80" y2="75" class="line-conn"/>
    <rect x="50" y="75" width="60" height="20" class="node-rect"/>
  </svg>`,

  'D-2_init': `<svg viewBox="0 0 160 80"><rect x="40" y="30" width="80" height="25" class="node-rect"/></svg>`,
  'D-2_res': `<svg viewBox="0 0 160 120">
    <rect x="55" y="10" width="50" height="18" class="node-rect"/>
    <line x1="80" y1="28" x2="80" y2="45" class="line-conn"/>
    <line x1="20" y1="45" x2="140" y2="45" class="line-conn"/>
    <line x1="20" y1="45" x2="20" y2="55" class="line-conn"/>
    <line x1="60" y1="45" x2="60" y2="55" class="line-conn"/>
    <line x1="100" y1="45" x2="100" y2="55" class="line-conn"/>
    <line x1="140" y1="45" x2="140" y2="55" class="line-conn"/>
    <rect x="5" y="55" width="30" height="15" class="node-rect"/>
    <rect x="45" y="55" width="30" height="15" class="node-rect"/>
    <rect x="85" y="55" width="30" height="15" class="node-rect"/>
    <rect x="125" y="55" width="30" height="15" class="node-rect"/>
  </svg>`,

  'D-3_init': `<svg viewBox="0 0 160 80"><rect x="40" y="30" width="80" height="25" class="node-rect"/></svg>`,
  'D-3_res': `<svg viewBox="0 0 160 80">
    <rect x="10" y="30" width="35" height="20" class="node-rect"/>
    <rect x="52" y="30" width="35" height="20" class="node-rect"/>
    <text x="93" y="45" font-size="14">....</text>
    <rect x="115" y="30" width="35" height="20" class="node-rect"/>
  </svg>`,

  'D-4_init': `<svg viewBox="0 0 160 80"><polygon points="80,20 105,40 80,60 55,40" class="node-rhombus"/></svg>`,
  'D-4_res': `<svg viewBox="0 0 160 80">
    <line x1="20" y1="40" x2="40" y2="40" class="line-conn"/>
    <line x1="40" y1="20" x2="40" y2="60" class="line-conn"/>
    <line x1="40" y1="20" x2="55" y2="20" class="line-conn"/>
    <line x1="40" y1="60" x2="55" y2="60" class="line-conn"/>
    <polygon points="75,10 90,20 75,30 60,20" class="node-rhombus"/>
    <polygon points="75,50 90,60 75,70 60,60" class="node-rhombus"/>
    <line x1="95" y1="20" x2="110" y2="20" class="line-conn"/>
    <line x1="95" y1="60" x2="110" y2="60" class="line-conn"/>
    <line x1="110" y1="20" x2="110" y2="60" class="line-conn"/>
    <line x1="110" y1="40" x2="130" y2="40" class="line-conn"/>
  </svg>`,

  'D-5_init': `<svg viewBox="0 0 160 80"><polygon points="80,20 105,40 80,60 55,40" class="node-rhombus"/></svg>`,
  'D-5_res': `<svg viewBox="0 0 160 80">
    <polygon points="25,25 38,40 25,55 12,40" class="node-rhombus"/>
    <line x1="38" y1="40" x2="55" y2="40" class="line-conn"/>
    <rect x="55" y="28" width="50" height="24" class="node-rect"/>
    <line x1="105" y1="40" x2="122" y2="40" class="line-conn"/>
    <polygon points="135,25 148,40 135,55 122,40" class="node-rhombus"/>
  </svg>`,

  'D-6_init': `<svg viewBox="0 0 160 80">
    <rect x="50" y="10" width="60" height="22" class="node-rect"/>
    <polygon points="80,42 98,55 80,68 62,55" class="node-rhombus"/>
  </svg>`,
  'D-6_res': `<svg viewBox="0 0 160 80">
    <rect x="40" y="10" width="60" height="22" class="node-rect"/>
    <line x1="100" y1="21" x2="120" y2="21" class="line-conn"/>
    <circle cx="120" cy="21" r="3" class="dot"/>
    <polygon points="70,42 88,55 70,68 52,55" class="node-rhombus"/>
    <line x1="88" y1="55" x2="110" y2="55" class="line-conn"/>
    <line x1="88" y1="60" x2="110" y2="60" class="line-conn"/>
  </svg>`,

  'D-7_init': `<svg viewBox="0 0 160 80">
    <rect x="50" y="10" width="60" height="22" class="node-rect"/>
    <polygon points="80,42 98,55 80,68 62,55" class="node-rhombus"/>
  </svg>`,
  'D-7_res': `<svg viewBox="0 0 160 80">
    <rect x="25" y="10" width="55" height="22" class="node-rect"/>
    <line x1="80" y1="21" x2="95" y2="21" class="line-conn"/>
    <ellipse cx="115" cy="21" rx="18" ry="8" class="node-ellipse"/>
    <line x1="133" y1="21" x2="145" y2="21" class="line-conn"/>
    <circle cx="145" cy="21" r="3" class="dot"/>
    <polygon points="50,42 68,55 50,68 32,55" class="node-rhombus"/>
    <line x1="68" y1="55" x2="85" y2="55" class="line-conn"/>
    <ellipse cx="105" cy="55" rx="18" ry="8" class="node-ellipse"/>
    <line x1="123" y1="55" x2="135" y2="55" class="line-conn"/>
  </svg>`,

  'D-8_init': `<svg viewBox="0 0 160 80">
    <line x1="60" y1="40" x2="100" y2="40" class="line-conn"/>
  </svg>`,
  'D-8_res': `<svg viewBox="0 0 160 80">
    <ellipse cx="70" cy="30" rx="20" ry="9" class="node-ellipse"/>
    <line x1="90" y1="30" x2="110" y2="30" class="line-conn"/>
    <circle cx="110" cy="30" r="3" class="dot"/>
    <line x1="60" y1="55" x2="100" y2="55" class="line-conn"/>
    <line x1="60" y1="62" x2="100" y2="62" class="line-conn"/>
  </svg>`,

  // Ascendentes
  'A-1_init': `<svg viewBox="0 0 160 80"><text x="50" y="45" fill="#94a3b8">(Vacío)</text></svg>`,
  'A-1_res': `<svg viewBox="0 0 160 80"><rect x="40" y="30" width="80" height="25" class="node-rect"/></svg>`,

  'A-2_init': `<svg viewBox="0 0 160 80">
    <rect x="50" y="10" width="60" height="22" class="node-rect"/>
    <rect x="50" y="48" width="60" height="22" class="node-rect"/>
  </svg>`,
  'A-2_res': `<svg viewBox="0 0 160 120">
    <rect x="50" y="10" width="60" height="20" class="node-rect"/>
    <line x1="80" y1="30" x2="80" y2="40" class="line-conn"/>
    <polygon points="80,40 95,52 80,64 65,52" class="node-rhombus"/>
    <line x1="80" y1="64" x2="80" y2="75" class="line-conn"/>
    <rect x="50" y="75" width="60" height="20" class="node-rect"/>
  </svg>`,

  'A-3_init': `<svg viewBox="0 0 160 80">
    <rect x="15" y="30" width="35" height="20" class="node-rect"/>
    <text x="55" y="45" font-size="14">....</text>
    <rect x="80" y="30" width="35" height="20" class="node-rect"/>
  </svg>`,
  'A-3_res': `<svg viewBox="0 0 160 120">
    <rect x="55" y="10" width="50" height="18" class="node-rect"/>
    <line x1="80" y1="28" x2="80" y2="45" class="line-conn"/>
    <line x1="20" y1="45" x2="140" y2="45" class="line-conn"/>
    <line x1="20" y1="45" x2="20" y2="55" class="line-conn"/>
    <line x1="60" y1="45" x2="60" y2="55" class="line-conn"/>
    <line x1="100" y1="45" x2="100" y2="55" class="line-conn"/>
    <line x1="140" y1="45" x2="140" y2="55" class="line-conn"/>
    <rect x="5" y="55" width="30" height="15" class="node-rect"/>
    <rect x="45" y="55" width="30" height="15" class="node-rect"/>
    <rect x="85" y="55" width="30" height="15" class="node-rect"/>
    <rect x="125" y="55" width="30" height="15" class="node-rect"/>
  </svg>`,

  'A-4_init': `<svg viewBox="0 0 160 80">
    <line x1="60" y1="25" x2="80" y2="25" class="line-conn"/>
    <circle cx="80" cy="25" r="3" class="dot"/>
    <line x1="60" y1="50" x2="90" y2="50" class="line-conn"/>
    <line x1="60" y1="58" x2="90" y2="58" class="line-conn"/>
  </svg>`,
  'A-4_res': `<svg viewBox="0 0 160 80">
    <rect x="40" y="10" width="60" height="22" class="node-rect"/>
    <line x1="100" y1="21" x2="120" y2="21" class="line-conn"/>
    <circle cx="120" cy="21" r="3" class="dot"/>
    <polygon points="70,42 88,55 70,68 52,55" class="node-rhombus"/>
    <line x1="88" y1="55" x2="110" y2="55" class="line-conn"/>
    <line x1="88" y1="60" x2="110" y2="60" class="line-conn"/>
  </svg>`,

  'A-5_init': `<svg viewBox="0 0 160 80">
    <rect x="30" y="10" width="55" height="22" class="node-rect"/>
    <line x1="85" y1="21" x2="105" y2="21" class="line-conn"/>
    <circle cx="105" cy="21" r="3" class="dot"/>
    <polygon points="55,42 73,55 55,68 37,55" class="node-rhombus"/>
    <line x1="73" y1="55" x2="95" y2="55" class="line-conn"/>
  </svg>`,
  'A-5_res': `<svg viewBox="0 0 160 80">
    <rect x="25" y="10" width="55" height="22" class="node-rect"/>
    <line x1="80" y1="21" x2="95" y2="21" class="line-conn"/>
    <ellipse cx="115" cy="21" rx="18" ry="8" class="node-ellipse"/>
    <line x1="133" y1="21" x2="145" y2="21" class="line-conn"/>
    <circle cx="145" cy="21" r="3" class="dot"/>
    <polygon points="50,42 68,55 50,68 32,55" class="node-rhombus"/>
    <line x1="68" y1="55" x2="85" y2="55" class="line-conn"/>
    <ellipse cx="105" cy="55" rx="18" ry="8" class="node-ellipse"/>
    <line x1="123" y1="55" x2="135" y2="55" class="line-conn"/>
  </svg>`
};

const DESCENDENTES = [
  { id: 'D-1', name: 'Entidad -> Entidades relacionadas' },
  { id: 'D-2', name: 'Entidad -> Generalización' },
  { id: 'D-3', name: 'Entidad -> Entidades no relacionadas' },
  { id: 'D-4', name: 'Relación -> Relaciones paralelas' },
  { id: 'D-5', name: 'Relación -> Entidad con relaciones' },
  { id: 'D-6', name: 'Desarrollo de atributos' },
  { id: 'D-7', name: 'Desarrollo de atributos compuestos' },
  { id: 'D-8', name: 'Refinamiento de atributos' }
];

const ASCENDENTES = [
  { id: 'A-1', name: 'Generación de entidad' },
  { id: 'A-2', name: 'Generación de relación' },
  { id: 'A-3', name: 'Generación de Generalización' },
  { id: 'A-4', name: 'Agregación de atributos' },
  { id: 'A-5', name: 'Agregación de atributo compuesto' }
];

let currentMode = 'descendentes';
let currentQuestionIndex = 0;
let quizQuestions = [];
let currentOptionsList = [];

function switchQuiz(mode) {
  if (currentMode === mode) return;
  currentMode = mode;
  document.querySelectorAll('#sec-test .tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[onclick="switchQuiz('${mode}')"]`).classList.add('active');
  initQuiz(mode);
}

function initQuiz(mode) {
  currentMode = mode;
  currentOptionsList = mode === 'descendentes' ? DESCENDENTES : ASCENDENTES;
  quizQuestions = [...currentOptionsList].sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;

  const nextBtn = document.getElementById('next-btn');
  nextBtn.innerHTML = 'Siguiente Pregunta &rarr;';
  nextBtn.onclick = nextQuestion;

  renderQuestion();
}

function renderQuestion() {
  const current = quizQuestions[currentQuestionIndex];
  document.getElementById('question-number').innerText = `Pregunta ${currentQuestionIndex + 1} de ${quizQuestions.length}`;
  document.getElementById('test-initial-schema').innerHTML = SVG_TEMPLATES[`${current.id}_init`];
  document.getElementById('test-result-schema').innerHTML = SVG_TEMPLATES[`${current.id}_res`];

  const alertBox = document.getElementById('feedback-alert');
  alertBox.className = 'alert hidden';
  document.getElementById('next-btn').classList.add('hidden');

  const optionsGrid = document.getElementById('options-grid');
  optionsGrid.innerHTML = '';

  currentOptionsList.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerText = p.id;
    btn.onclick = () => checkAnswer(p.id, btn);
    optionsGrid.appendChild(btn);
  });
}

function checkAnswer(selectedId, selectedBtn) {
  const current = quizQuestions[currentQuestionIndex];
  const alertBox = document.getElementById('feedback-alert');
  const allBtns = document.querySelectorAll('#options-grid .option-btn');

  allBtns.forEach(btn => btn.disabled = true);

  if (selectedId === current.id) {
    selectedBtn.classList.add('correct');
    alertBox.innerText = `¡Correcto! El esquema corresponde a ${current.id}: ${current.name}.`;
    alertBox.className = 'alert alert-success';
  } else {
    selectedBtn.classList.add('wrong');
    alertBox.innerText = `¡Incorrecto! Seleccionaste ${selectedId}. La respuesta correcta es ${current.id}: ${current.name}.`;
    alertBox.className = 'alert alert-danger';

    allBtns.forEach(btn => {
      if (btn.innerText === current.id) {
        btn.classList.add('correct');
      }
    });
  }

  document.getElementById('next-btn').classList.remove('hidden');
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    renderQuestion();
  } else {
    showQuizResults();
  }
}

function showQuizResults() {
  const alertBox = document.getElementById('feedback-alert');
  alertBox.className = 'alert alert-success';
  const modeName = currentMode === 'descendentes' ? 'Descendentes' : 'Ascendentes';
  alertBox.innerText = `¡Has completado todas las preguntas del Test de Primitivas ${modeName}!`;

  document.getElementById('options-grid').innerHTML = '';

  const nextBtn = document.getElementById('next-btn');
  nextBtn.innerText = 'Reiniciar Test';
  nextBtn.onclick = () => initQuiz(currentMode);
  nextBtn.classList.remove('hidden');
}


// =================================================================
// 3. SECCIÓN DE PRÁCTICA CON BANCO DE PREGUNTAS
// =================================================================
const QS = [
  ['g','Básico','En un esquema E/R, ¿qué es un atributo?',['Una asociación entre dos entidades','Una propiedad que describe a una entidad o relación','Un grupo de entidades parecidas'],1,'Los atributos describen propiedades: nombre y DNI de FUTBOLISTA, o fecha de «compra».'],
  ['g','Básico','Una cardinalidad (1,n) significa…',['Mínimo 0 y máximo 1','Siempre exactamente uno','Mínimo uno y máximo muchos'],2,'En (1,n) cada ocurrencia participa al menos una vez y puede participar muchas veces.'],
  ['D-1','Básico','En D-1, el concepto LUGAR se transforma en…',['HOMBRE y MUJER','CIUDAD y PAIS unidos por la relación «en»','Un atributo llamado lugar'],1,'LUGAR se refina en CIUDAD y PAIS conectados por «en»; «juega» apunta a CIUDAD.'],
  ['D-2','Básico','En D-2, PERSONA se refina en…',['Una jerarquía con FUTBOLISTA, TECNICO y DIRIGENTE','Tres atributos','La relación «juega»'],0,'D-2 convierte PERSONA en un supertipo con tres subentidades.'],
  ['D-4','Intermedio','En D-4, «relacionado con» entre ALUMNO y CURSO se reemplaza por…',['Un atributo nota','Dos relaciones más precisas: «se matricula» y «aprueba»','Una jerarquía'],1,'Una relación genérica se descompone en relaciones específicas entre las mismas entidades.'],
  ['D-5','Intermedio','En D-5, DOCENTE «trabaja en» FACULTAD. Después de transformar aparece…',['ALUMNO','Un atributo facultad','DEPARTAMENTO, que «forma parte de» FACULTAD'],2,'Se inserta una entidad intermedia: el docente trabaja en un departamento.'],
  ['D-6','Básico','En D-6, ¿qué se agrega en el PDF?',['Atributos: nombre, DNI y pasaporte a FUTBOLISTA, y fecha a «compra»','Subtipos de FUTBOLISTA','Una nueva entidad EQUIPO'],0,'D-6 añade atributos tanto a una entidad como a una relación.'],
  ['A-1','Intermedio','Según el PDF, ¿cuándo se aplica A-1?',['Al agrupar atributos en uno compuesto','Cuando aparece un concepto con propiedades específicas que no estaban en un esquema anterior: genera una nueva entidad','Al eliminar una jerarquía'],1,'A-1 genera una nueva entidad ante propiedades específicas no presentes antes.'],
  ['A-3','Intermedio','FUTBOLISTA, TECNICO y DIRIGENTE se agrupan bajo PERSONA. ¿Qué tipo de primitiva es?',['Descendente: se parte de PERSONA','Ascendente (A-3): se parte de lo concreto y se abstrae un supertipo','Ninguna: no hay jerarquía'],1,'Parte de las entidades específicas y construye la general; D-2 hace el camino inverso.'],
  ['A-5','Avanzado','calle, número y urbanización se agrupan en «dirección» (A-5). ¿Qué tipo de atributo resulta?',['Derivado','Multivaluado','Compuesto'],2,'«dirección» está formado por componentes.'],
  ['E','Intermedio','En la estrategia descendente del PDF, ¿cuál es el primer refinamiento?',['HOMBRE y MUJER','DATOS DEMOGRÁFICOS','PERSONA y LUGAR'],1,'Se parte de DATOS DEMOGRÁFICOS y luego se llega a DATOS DE PERSONAS y DATOS DE LUGARES.'],
  ['E','Avanzado','¿Qué estrategia empieza con PERSONA y agrega alrededor atributos, LUGAR y relaciones?',['Centrífuga','Ascendente','Mixta'],0,'La centrífuga crece desde un núcleo (PERSONA) hacia afuera.'],
  ['E','Avanzado','¿Qué estrategia empieza con el esquema armazón PERSONA–LUGAR y desarrolla cada parte por separado?',['Descendente','Ascendente','Mixta'],2,'La mixta usa un armazón, desarrolla Persona y Lugar y los integra.'],
  ['B','Intermedio','Banco: AGENCIA se identifica por ciudad + nombre. ¿Por qué no basta el nombre?',['Porque agencias de distintas ciudades pueden tener el mismo nombre','Porque las agencias no tienen nombre','Porque CIUDAD no tiene habitantes'],0,'El enunciado dice que el nombre solo distingue agencias de una misma ciudad; por eso se usa CIUDAD + nombre.'],
  ['B','Avanzado','Banco: un fijo nunca pasa a temporal y un temporal que pasa a fijo recibe nuevo código. ¿Qué restricción propone el modelo para FIJO/TEMPORAL?',['Solapada','Exclusiva: no puede ser de ambos tipos','Sin restricción'],1,'Cada código de empleado pertenece a un solo tipo, por eso se propone exclusividad (t,e).']
];

let PI = 0;
let answersState = {};

function initPracticaSection() {
  renderPracticaQuestion();
}

function renderPracticaQuestion() {
  const container = document.getElementById('practica-container');
  const n = QS.length;

  if (PI >= n) {
    let aciertos = Object.values(answersState).filter(x => x === 1).length;
    let pct = Math.round((aciertos / n) * 100);
    container.innerHTML = `
      <div class="card" style="text-align:center;">
        <h3>¡Práctica Completada!</h3>
        <p>Respondidas: <b>${n}</b> de ${n} | Aciertos: <b>${aciertos}</b> | Puntuación: <b>${pct}%</b></p>
        <div class="bar"><i style="width:${pct}%"></i></div>
        <button class="btn btn-primary" onclick="restartPractica()" style="margin-top:15px;">Practicar de nuevo</button>
      </div>`;
    return;
  }

  const q = QS[PI];
  let html = `
    <p>Pregunta ${PI + 1} de ${n} <small>(${q[1]})</small></p>
    <div class="bar"><i style="width:${(PI / n) * 100}%"></i></div>
    <div class="q">
      <p><b>${q[2]}</b></p>
      ${q[3].map((opt, j) => `
        <label>
          <input type="radio" name="p_opt" value="${j}"> ${opt}
        </label>
      `).join('')}
      <div style="margin-top:12px;">
        <button class="btn btn-primary" onclick="checkPracticaAnswer(${PI})">Comprobar respuesta</button>
        <button class="btn" onclick="showPracticaExpl(${PI})">Ver explicación</button>
      </div>
      <div id="practica-fb" class="fb"></div>
    </div>
    <div class="actions">
      <button class="btn btn-primary" onclick="nextPracticaQuestion()">${PI === n - 1 ? 'Ver Resumen' : 'Siguiente Pregunta &rarr;'}</button>
    </div>
  `;
  container.innerHTML = html;
}

function checkPracticaAnswer(qIdx) {
  const selected = document.querySelector('input[name="p_opt"]:checked');
  const fb = document.getElementById('practica-fb');
  if (!selected) {
    fb.innerHTML = '<span class="bad">Elige una opción primero.</span>';
    return;
  }
  const isCorrect = parseInt(selected.value) === QS[qIdx][4];
  answersState[qIdx] = isCorrect ? 1 : 0;

  if (isCorrect) {
    fb.innerHTML = `<b class="ok">¡Correcto!</b> ${QS[qIdx][5]}`;
  } else {
    fb.innerHTML = `<b class="bad">Incorrecto.</b> ${QS[qIdx][5]}`;
  }
}

function showPracticaExpl(qIdx) {
  const fb = document.getElementById('practica-fb');
  fb.innerHTML = `<i>Explicación:</i> ${QS[qIdx][5]}`;
}

function nextPracticaQuestion() {
  PI++;
  renderPracticaQuestion();
}

function restartPractica() {
  PI = 0;
  answersState = {};
  renderPracticaQuestion();
}


// =================================================================
// 4. SECCIÓN DE RESOLVER PROBLEMAS - CASO BANCO
// =================================================================
const V = (w, h, c) => `<svg viewBox="0 0 ${w} ${h}">${c}</svg>`;
const B = (x, y, t, w = 110) => `<g class="e"><rect x="${x}" y="${y}" width="${w}" height="34" rx="4"/><text x="${x + w / 2}" y="${y + 21}">${t}</text></g>`;
const D_svg = (x, y, t) => `<g class="r"><polygon points="${x - 52},${y} ${x},${y - 24} ${x + 52},${y} ${x},${y + 24}"/><text x="${x}" y="${y + 4}">${t}</text></g>`;
const L = (a, b, c, d) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}"/>`;
const T_txt = (x, y, t, c = 'a', an = 'middle') => `<text class="${c}${t[0] == '★' ? ' pk' : ''}" style="text-anchor:${an}" x="${x}" y="${y}">${t}</text>`;
const C_txt = (x, y, t) => T_txt(x, y, t, 'c', 'middle');
const E_ent = (x, y, t, at = [], s = 1, w = 110) => {
  let o = B(x, y, t, w);
  const n = at.length;
  if (s == 2 && n) o += L(x + w / 2, y + 34, x + w / 2, y + 42);
  at.forEach((a, i) => {
    if (s == 2) o += T_txt(x + w / 2, y + 56 + i * 16, a, 'a', 'middle');
    else {
      const ty = y + 21 + (i - (n - 1) / 2) * 22, ex = s > 0 ? x + w : x, tx = ex + s * 16;
      o += L(ex, y + 17, tx - s * 2, ty - 4) + T_txt(tx, ty, a, 'a', s > 0 ? 'start' : 'end');
    }
  });
  return o;
};
const H_line = (cx, by, xs, ty, lb) => {
  const m = (by + ty) / 2;
  return L(cx, by, cx, m) + L(Math.min(...xs), m, Math.max(...xs), m) + xs.map(x => L(x, m, x, ty)).join('') + (lb ? C_txt(cx + 22, m - 6, lb) : '');
};

const LB_diagram = v => {
  let s = '';
  const w = (vs, c) => { if (vs.includes(v)) s += c; }, m = v == 2, p = v == 1;
  w([0, 1, 2], E_ent(390, 233, 'EMPLEADO', p ? ['★ cod_empleado', 'DNI', 'NSS', 'nombre', 'apellido'] : [], -1, 120));
  w([0, 2], E_ent(390, 50, 'CIUDAD', m ? ['★ nombre', 'habitantes'] : [], -1, 120) + L(450, 84, 450, 128) + D_svg(450, 152, 'reside en') + L(450, 176, 450, 233) + C_txt(465, 104, '(0,n)') + C_txt(465, 222, '(1,1)'));
  w([0, 2], L(510, 67, 578, 67) + D_svg(630, 67, 'ubicada en') + L(682, 67, 720, 67) + E_ent(720, 50, 'AGENCIA', m ? ['★ nombre', 'dirección', 'teléfono'] : [], 1) + C_txt(530, 60, '(0,n)') + C_txt(702, 60, '(1,1)') + L(775, 84, 775, 128) + D_svg(775, 152, 'trabaja en') + L(723, 152, 510, 250) + C_txt(783, 110, '(0,n)') + C_txt(535, 262, '(1,n)') + (m ? L(775, 176, 775, 184) + T_txt(775, 198, 'fecha_inicio', 'a', 'middle') + T_txt(775, 214, 'fecha_fin', 'a', 'middle') : ''));
  [[113, 'TÍTULO', 'posee', ['★ nombre'], '(0,n)', '(0,n)', [345, 222]], [233, 'CATEGORÍA', 'pertenece a', ['★ nombre', 'sueldo_base', 'precio_hora_extra'], '(0,n)', '(1,1)', [352, 243]], [353, 'CENTRAL', 'afiliado a', ['★ nombre', 'cuota'], '(0,n)', '(0,1)', [352, 284]]].forEach(([y, n, r, a, c1, c2, [cx, cy]]) => w([0, 2], E_ent(20, y, n, m ? a : [], 2, 120) + L(140, y + 17, 198, y + 17) + D_svg(250, y + 17, r) + L(302, y + 17, 390, 250) + C_txt(160, y + 9, c1) + C_txt(cx, cy, c2)));
  w([0, 1], H_line(450, 267, [385, 575], 360, '(t,e)') + E_ent(330, 360, 'FIJO', p ? ['antigüedad'] : [], -1) + E_ent(520, 360, 'TEMPORAL', p ? ['fecha_inicio', 'fecha_fin'] : [], 1) + L(385, 394, 385, 426) + D_svg(385, 450, 'solicita') + L(437, 450, 470, 450) + E_ent(470, 433, 'TIPO_PRÉSTAMO', p ? ['★ nombre', 'tipo_interés', 'periodo_vigencia'] : [], 1, 140) + C_txt(407, 418, '(0,n)') + C_txt(455, 443, '(0,n)') + (p ? L(385, 474, 385, 482) + T_txt(385, 496, 'concedido, fecha', 'a', 'middle') : ''));
  return V(960, 510, s);
};

const LT = ['A. Comprender', 'B. Entidades', 'C. Atributos', 'D. Relaciones', 'E. Especialización', 'F. Diagrama E/R', 'G. Decisiones', 'H. Preguntas'];
let Lb = 0;
let LVw = 0;

const LSG = [
  () => `<h3>Etapa A · Requerimientos de la Entidad Bancaria</h3>
    <ul>
      <li><b>Empleados:</b> código, DNI, NSS, nombre, apellido y ciudad de residencia.</li>
      <li><b>Agencias:</b> identificadas por ciudad + nombre, con dirección y teléfono.</li>
      <li><b>Historial laboral:</b> registro de agencias por las que pasa cada empleado.</li>
      <li><b>Títulos y Categorías:</b> títulos académicos, categorías (sueldo base, hora extra) y afiliación sindical.</li>
      <li><b>Préstamos:</b> empleados fijos (antigüedad) pueden solicitar préstamos de tipos preestablecidos.</li>
    </ul>`,
  () => `<h3>Etapa B · Identificación de Entidades</h3>
    <div class="tw"><table>
      <tr><th>Entidad</th><th>Tipo</th><th>Atributos Principales</th><th>Clave Primaria</th></tr>
      <tr><td>EMPLEADO</td><td>Supertipo</td><td>cod_empleado, DNI, NSS, nombre, apellido</td><td>cod_empleado</td></tr>
      <tr><td>FIJO</td><td>Subtipo</td><td>antigüedad</td><td>hereda cod_empleado</td></tr>
      <tr><td>TEMPORAL</td><td>Subtipo</td><td>fecha_inicio, fecha_fin</td><td>hereda cod_empleado</td></tr>
      <tr><td>CIUDAD</td><td>Principal</td><td>nombre, habitantes</td><td>nombre</td></tr>
      <tr><td>AGENCIA</td><td>Débil de CIUDAD</td><td>nombre, dirección, teléfono</td><td>CIUDAD + nombre</td></tr>
      <tr><td>TÍTULO</td><td>Principal</td><td>nombre</td><td>nombre</td></tr>
      <tr><td>CATEGORÍA</td><td>Principal</td><td>nombre, sueldo_base, precio_hora_extra</td><td>nombre</td></tr>
      <tr><td>CENTRAL</td><td>Principal</td><td>nombre, cuota</td><td>nombre</td></tr>
      <tr><td>TIPO_PRÉSTAMO</td><td>Principal</td><td>nombre, tipo_interés, periodo_vigencia</td><td>nombre</td></tr>
    </table></div>`,
  () => `<h3>Etapa C · Atributos y Claves</h3>
    <p>Se diferencian los atributos propios de las entidades de aquellos que pertenecen a las relaciones (como las fechas en el historial de traslados o la fecha de concesión de préstamos).</p>`,
  () => `<h3>Etapa D · Matriz de Relaciones</h3>
    <div class="tw"><table>
      <tr><th>Relación</th><th>Entidades Conectadas</th><th>Cardinalidad</th><th>Descripción</th></tr>
      <tr><td>reside en</td><td>EMPLEADO - CIUDAD</td><td>(1,1) : (0,n)</td><td>Cada empleado vive en una ciudad.</td></tr>
      <tr><td>ubicada en</td><td>AGENCIA - CIUDAD</td><td>(1,1) : (0,n)</td><td>Define la dependencia de AGENCIA respecto a CIUDAD.</td></tr>
      <tr><td>trabaja en</td><td>EMPLEADO - AGENCIA</td><td>(1,n) : (0,n)</td><td>Historial laboral con fechas de entrada y salida.</td></tr>
      <tr><td>posee</td><td>EMPLEADO - TÍTULO</td><td>(0,n) : (0,n)</td><td>Títulos académicos del empleado.</td></tr>
      <tr><td>solicita</td><td>FIJO - TIPO_PRÉSTAMO</td><td>(0,n) : (0,n)</td><td>Solicitudes de préstamos exclusivas para fijos.</td></tr>
    </table></div>`,
  () => `<h3>Etapa E · Especialización de Empleados</h3>
    <p>Se define una jerarquía de especialización <b>Total y Exclusiva (t,e)</b> sobre EMPLEADO para separar los empleados FIJO y TEMPORAL.</p>
    <div class="sv">${V(520, 210, B(200, 10, 'EMPLEADO') + H_line(255, 44, [120, 390], 120, '(t,e)') + E_ent(65, 120, 'FIJO', ['antigüedad'], 2) + E_ent(335, 120, 'TEMPORAL', ['fecha_inicio', 'fecha_fin'], 2))}</div>`,
  () => `<h3>Etapa F · Diagrama Entidad-Relación Consolidado</h3>
    <div class="tabs">
      <button class="tab-btn ${LVw == 0 ? 'active' : ''}" onclick="changeLabView(0)">Estructura Global</button>
      <button class="tab-btn ${LVw == 1 ? 'active' : ''}" onclick="changeLabView(1)">Detalle Préstamos y Personal</button>
      <button class="tab-btn ${LVw == 2 ? 'active' : ''}" onclick="changeLabView(2)">Detalle Organización</button>
    </div>
    <div class="sv">${LB_diagram(LVw)}</div>`,
  () => `<h3>Etapa G · Decisiones de Diseño</h3>
    <ul>
      <li>AGENCIA es una entidad débil asociada a CIUDAD.</li>
      <li>Historial laboral estructurado en "trabaja en" mediante una relación N:M.</li>
      <li>Restricción de préstamos limitada únicamente a la subentidad FIJO.</li>
    </ul>`,
  () => `<h3>Etapa H · Preguntas de Autoevaluación</h3>
    <details>
      <summary>1. ¿Por qué AGENCIA se identifica con CIUDAD + nombre?</summary>
      <p class="note">Porque agencias en distintas ciudades pueden compartir el mismo nombre. CIUDAD aporta el contexto para identificarla inequívocamente.</p>
    </details>
    <details>
      <summary>2. ¿Por qué "solicita" une FIJO y TIPO_PRÉSTAMO en vez de EMPLEADO?</summary>
      <p class="note">Porque las reglas del negocio especifican que únicamente los empleados de tipo fijo tienen la atribución de solicitar préstamos.</p>
    </details>`
];

function renderLabSection() {
  const tabsContainer = document.getElementById('lab-tabs');
  const bodyContainer = document.getElementById('lab-content');

  tabsContainer.innerHTML = LT.map((t, i) => `
    <button class="tab-btn ${i === Lb ? 'active' : ''}" onclick="switchLabTab(${i})">${t}</button>
  `).join('');

  bodyContainer.innerHTML = LSG[Lb]();
}

function switchLabTab(idx) {
  Lb = idx;
  renderLabSection();
}

function changeLabView(vIdx) {
  LVw = vIdx;
  renderLabSection();
}


// =================================================================
// 5. NUEVA SECCIÓN: TEST AVANZADO DE 10 PREGUNTAS CON CRONÓMETRO (120s)
// =================================================================
const ADVANCED_QUESTIONS = [
  {
    q: "En el contexto de la Arquitectura ANSI/X3/SPARC de 3 niveles para SGBD, ¿cuál de las siguientes afirmaciones describe con precisión la 'Independencia Lógica de Datos'?",
    options: [
      "Capacidad de modificar el esquema conceptual sin obligar a reescribir los programas de aplicación que acceden a la base de datos.",
      "Capacidad de cambiar los discos físicos o estructuras de almacenamiento secundario sin alterar el esquema conceptual.",
      "Capacidad de migrar entre distintos gestores de bases de datos relacionales (SGBD) sin cambiar el código COBOL/C.",
      "Capacidad de eliminar claves primarias sin afectar los atributos derivados de las subentidades."
    ],
    correct: 0,
    expl: "La Independencia Lógica de Datos es la capacidad de modificar el esquema conceptual sin provocar que se vuelvan a escribir los programas de aplicación (Manual, Cap. I)."
  },
  {
    q: "Al comparar las Primitivas Descendentes D-6, D-7 y D-8, ¿cuál es la diferencia semántica fundamental entre D-6 y D-7 según la metodología del Dr. Caselli?",
    options: [
      "D-6 transforma una entidad en una jerarquía, mientras D-7 descompone relaciones en paralelas.",
      "D-6 desarrolla atributos simples en entidades y relaciones, mientras D-7 desarrolla atributos compuestos integradores.",
      "D-6 agrega claves primarias externas, mientras D-7 refina las cardinalidades de (0,1) a (1,n).",
      "D-6 genera nuevas entidades independientes, mientras D-7 elimina ciclos de relaciones redundantes."
    ],
    correct: 1,
    expl: "D-6 corresponde al desarrollo de atributos simples en entidades o relaciones, mientras que D-7 trata específicamente el desarrollo de atributos compuestos (Manual, Cap. V)."
  },
  {
    q: "En una jerarquía de generalización entre la superentidad ESTUDIANTE y los subtipos INGENIERÍA e IDIOMAS con cobertura marcante (p, s), ¿qué restricción real de negocio se está modelando?",
    options: [
      "Todos los estudiantes pertenecen a Ingeniería o Idiomas, pero ninguno puede estar matriculado en ambas a la vez.",
      "No todos los estudiantes pertenecen a esas dos áreas (parcial) y un estudiante puede estar matriculado en ambas simultáneamente (superpuesta).",
      "Es obligatorio que el estudiante pertenezca a ambas carreras a la vez (total y superpuesta).",
      "Un estudiante solo puede pertenecer a Idiomas si previamente aprobó la carrera de Ingeniería (exclusiva)."
    ],
    correct: 1,
    expl: "(p,s) significa Parcial y Superpuesta: existen otros tipos de estudiantes no contemplados en el modelo (parcial) y un estudiante puede estar en Ingeniería e Idiomas a la vez (superpuesta)."
  },
  {
    q: "En el caso del Campeonato de Ajedrez, ¿por qué la entidad SALA se clasifica técnicamente como una Entidad Débil?",
    options: [
      "Porque no tiene atributos propios ni medios tecnológicos como TV o Internet.",
      "Porque su existencia y clave de identificación dependen de la entidad fuerte HOTEL (requiere la clave compuesta HOTEL + Núm_sala).",
      "Porque está conectada únicamente mediante una relación recursiva de orden N:M.",
      "Porque no puede celebrar partidas durante las jornadas de descanso."
    ],
    correct: 1,
    expl: "SALA es una entidad débil con respecto a HOTEL porque su identificador depende directamente de la clave del HOTEL al que pertenece (Manual, Cap. II y VI)."
  },
  {
    q: "Analizando la eliminación de redundancias en un ciclo ER: si tenemos DOCENTE - (dicta) - ASIGNATURA - (pertenece) - DEPARTAMENTO - (adscrito) - DOCENTE, ¿bajo qué condición la relación 'adscrito' NO SE PUEDE ELIMINAR por no ser redundante?",
    options: [
      "Cuando la relación 'adscrito' no contiene atributos propios.",
      "Cuando existen docentes que colaboran dictando asignaturas de otros departamentos distintos al de su adscripción formal o cuando hay docentes sin asignaturas a cargo.",
      "Cuando la cardinalidad máxima de la relación 'dicta' es exactamente (1,1).",
      "Cuando la entidad DEPARTAMENTO es una entidad débil vinculada a FACULTAD."
    ],
    correct: 1,
    expl: "Si un docente puede dictar en departamentos ajenos o no dictar cursos, la ruta del ciclo no permite deducir con certeza a qué departamento está adscrito. Por ende, la relación 'adscrito' conserva semántica indispensable y no es redundante (Manual, Cap. IV)."
  },
  {
    q: "En la notación IDEF1X soportada por herramientas como PowerDesigner, ¿cómo se representa la restricción de dependencia e identificación entre entidades?",
    options: [
      "Mediante óvalos dobles y líneas punteadas verdes.",
      "Mediante la forma de los rectángulos (esquinas redondeadas para entidades dependientes/débiles) y líneas de conexión continuas con un punto en el extremo.",
      "Mediante rombos sombreados con letras 't' y 'e'.",
      "Colocando la entidad subconjunto dentro del cuadro físico de la entidad genérica."
    ],
    correct: 1,
    expl: "En IDEF1X, las entidades dependientes se identifican gráficamente con esquinas redondeadas y sus conexiones de identificación llevan líneas continuas terminadas en un punto (Manual, Cap. IV)."
  },
  {
    q: "En Sybase Adaptive Server Anywhere (ASA), al configurar una Clave Foránea (FK) con la regla de integridad referencial 'Set dependent columns to NULL' (SET NULL), ¿qué ocurre al ejecutar una sentencia DELETE sobre la tupla padre en la tabla principal?",
    options: [
      "El gestor aborta la transacción notificando una violación de restricción referencial.",
      "Se eliminan automáticamente todos los registros asociados en la tabla hija.",
      "Se borra la tupla padre y el gestor actualiza las columnas de la clave foránea en los registros hijos asignándoles el valor NULL.",
      "Las claves primarias de los hijos se recalculan usando una función correlativa."
    ],
    correct: 2,
    expl: "La regla SET NULL mantiene las filas hijas en la base de datos, pero limpia el vínculo colocando NULL en el campo de la clave ajena al eliminar la fila padre asociada (Manual, Cap. VII)."
  },
  {
    q: "De acuerdo con el enfoque orientado a los datos para el diseño de bases de datos de Batini/Ceri/Navathe, ¿cuál es el orden correcto de las fases de desarrollo?",
    options: [
      "Requerimientos de datos -> Diseño Lógico -> Diseño Físico -> Esquema Conceptual.",
      "Requerimientos de datos -> Diseño Conceptual -> Diseño Lógico -> Diseño Físico.",
      "Diseño Físico -> Normalización -> Diseño Conceptual -> Esquema Lógico.",
      "Diseño Inicial -> Normalización BCNF -> Estrategia Mixta -> Implementación SQL."
    ],
    correct: 1,
    expl: "El Enfoque Orientado a los Datos sigue la secuencia obligatoria: Requerimientos -> Diseño Conceptual -> Diseño Lógico -> Diseño Físico (Manual, Cap. I)."
  },
  {
    q: "En el Caso del Banco resuelto mediante la Estrategia Mixta, ¿por qué la relación 'solicita' (préstamos) se conecta explícitamente a la subentidad FIJO y no a la superentidad EMPLEADO?",
    options: [
      "Porque los empleados temporales no poseen número de DNI registrado.",
      "Porque el negocio establece una restricción donde únicamente los empleados de contrato fijo poseen el derecho normativo de solicitar préstamos.",
      "Para evitar la creación de un ciclo de relaciones entre CIUDAD y AGENCIA.",
      "Porque la subentidad TEMPORAL utiliza una clave primaria diferente al código de empleado."
    ],
    correct: 1,
    expl: "Conectar la relación a la subentidad FIJO refleja semánticamente la regla de negocio: solo los fijos pueden pedir préstamos, evitando que los temporales tengan acceso a esta relación (S04 y Manual Cap. V)."
  },
  {
    q: "En la estrategia de modelado CENTRÍFUGA para el diseño conceptual de esquemas:",
    options: [
      "Se parte de la lista completa de todos los atributos desestructurados del sistema para agruparlos progresivamente.",
      "Se parte del armazón general de entidades principales para dividirlas en módulos que luego se integran.",
      "Se selecciona el concepto/entidad más importante o evidente y el esquema se expande progresivamente hacia afuera como una mancha de aceite.",
      "Se aplican exclusivamente las primitivas ascendentes A-1 y A-2 sin realizar refinamientos."
    ],
    correct: 2,
    expl: "La estrategia centrífuga fija primero el núcleo o concepto central más importante y luego va agregando conceptos en anillos concéntricos navegando hacia lo exterior, como una mancha de aceite (Manual, Cap. V)."
  }
];

let advCurrentIndex = 0;
let advAnswersState = {};
let advTimerSeconds = 120;
let timerInterval = null;

function renderAdvancedQuiz() {
  const container = document.getElementById('advanced-quiz-container');
  const total = ADVANCED_QUESTIONS.length;

  if (advCurrentIndex >= total) {
    if (timerInterval) clearInterval(timerInterval);
    let aciertos = 0;
    for (let i = 0; i < total; i++) {
      if (advAnswersState[i] && advAnswersState[i].isCorrect) {
        aciertos++;
      }
    }
    let pct = Math.round((aciertos / total) * 100);

    let htmlResumen = `
      <div class="card" style="text-align:center;">
        <h3>🏆 Resultado Final del Examen Avanzado</h3>
        <p style="font-size:1.2rem; margin:15px 0;">Respuestas Correctas: <b>${aciertos}</b> de <b>${total}</b></p>
        <div class="bar" style="height:18px;"><i style="width:${pct}%"></i></div>
        <p style="font-size:1.1rem; font-weight:bold; color:#1e3a8a; margin-top:10px;">Puntuación General: ${pct}%</p>
        
        <div style="text-align:left; margin-top:25px; border-top:2px solid #e2e8f0; padding-top:15px;">
          <h4>Desglose detallado por pregunta:</h4>
          ${ADVANCED_QUESTIONS.map((qObj, idx) => {
            const st = advAnswersState[idx];
            const fueCorrecta = st && st.isCorrect;
            const fueAgotado = st && st.timeout;
            let statusBadge = fueCorrecta 
              ? '<span style="color:#059669; font-weight:bold;">[CORRECTA]</span>' 
              : (fueAgotado ? '<span style="color:#d97706; font-weight:bold;">[TIEMPO AGOTADO]</span>' : '<span style="color:#dc2626; font-weight:bold;">[INCORRECTA]</span>');
            return `
              <div style="margin:10px 0; padding:10px; background:#f8fafc; border-radius:6px; border:1px solid #cbd5e1;">
                <p><b>P${idx + 1}:</b> ${qObj.q}${statusBadge}</p>
                <p style="font-size:0.88rem; color:#475569; margin-top:4px;"><i>Justificación:</i> ${qObj.expl}</p>
              </div>
            `;
          }).join('')}
        </div>

        <button class="btn btn-primary" onclick="restartAdvancedQuiz()" style="margin-top:20px;">Reiniciar Examen Exigente</button>
      </div>
    `;
    container.innerHTML = htmlResumen;
    return;
  }

  const q = ADVANCED_QUESTIONS[advCurrentIndex];
  
  let html = `
    <div class="timer-header">
      <div>
        <span>Pregunta <b>${advCurrentIndex + 1}</b> de <b>${total}</b></span>
      </div>
      <div id="adv-timer-display" class="timer-box">
        ⏱️ Tiempo restante: <span id="timer-sec">120</span>s
      </div>
    </div>

    <div class="bar"><i style="width:${(advCurrentIndex / total) * 100}%"></i></div>

    <div class="q">
      <p style="font-size:1.05rem; margin-bottom:12px;"><b>${q.q}</b></p>
      
      <div id="adv-options-group">
        ${q.options.map((opt, j) => `
          <label class="adv-option-label">
            <input type="radio" name="adv_opt" value="${j}">
            <span>${opt}</span>
          </label>
        `).join('')}
      </div>

      <div style="margin-top:15px;">
        <button id="adv-submit-btn" class="btn btn-primary" onclick="submitAdvAnswer()">Confirmar Respuesta</button>
      </div>

      <div id="adv-fb" class="fb"></div>
    </div>

    <div class="actions">
      <button id="adv-next-btn" class="btn btn-primary hidden" onclick="nextAdvQuestion()">${advCurrentIndex === total - 1 ? 'Finalizar Examen' : 'Siguiente Pregunta &rarr;'}</button>
    </div>
  `;

  container.innerHTML = html;
  startAdvTimer();
}

function startAdvTimer() {
  if (timerInterval) clearInterval(timerInterval);
  advTimerSeconds = 120;
  
  const timerDisplay = document.getElementById('adv-timer-display');
  const timerSec = document.getElementById('timer-sec');

  if (timerSec) timerSec.innerText = advTimerSeconds;

  timerInterval = setInterval(() => {
    advTimerSeconds--;
    if (timerSec) timerSec.innerText = advTimerSeconds;

    if (timerDisplay) {
      if (advTimerSeconds <= 20) {
        timerDisplay.classList.add('warning');
      } else {
        timerDisplay.classList.remove('warning');
      }
    }

    if (advTimerSeconds <= 0) {
      clearInterval(timerInterval);
      handleAdvTimeout();
    }
  }, 1000);
}

function handleAdvTimeout() {
  const fb = document.getElementById('adv-fb');
  const q = ADVANCED_QUESTIONS[advCurrentIndex];

  advAnswersState[advCurrentIndex] = {
    selected: -1,
    isCorrect: false,
    timeout: true
  };

  // Deshabilitar entradas de opción
  document.querySelectorAll('input[name="adv_opt"]').forEach(inp => inp.disabled = true);
  const subBtn = document.getElementById('adv-submit-btn');
  if (subBtn) subBtn.disabled = true;

  if (fb) {
    fb.innerHTML = `
      <div class="alert alert-danger" style="text-align:left; margin-top:10px;">
        <b>⏰ ¡Tiempo agotado! (120 segundos transcurridos).</b><br>
        La respuesta correcta era: <i>"${q.options[q.correct]}"</i>.<br>
        <small><b>Explicación:</b> ${q.expl}</small>
      </div>
    `;
  }

  document.getElementById('adv-next-btn').classList.remove('hidden');
}

function submitAdvAnswer() {
  const selected = document.querySelector('input[name="adv_opt"]:checked');
  const fb = document.getElementById('adv-fb');

  if (!selected) {
    if (fb) fb.innerHTML = '<span class="bad">Selecciona una alternativa antes de confirmar.</span>';
    return;
  }

  if (timerInterval) clearInterval(timerInterval);

  const selectedIdx = parseInt(selected.value);
  const q = ADVANCED_QUESTIONS[advCurrentIndex];
  const isCorrect = selectedIdx === q.correct;

  advAnswersState[advCurrentIndex] = {
    selected: selectedIdx,
    isCorrect: isCorrect,
    timeout: false
  };

  document.querySelectorAll('input[name="adv_opt"]').forEach(inp => inp.disabled = true);
  document.getElementById('adv-submit-btn').disabled = true;

  if (isCorrect) {
    fb.innerHTML = `
      <div class="alert alert-success" style="text-align:left; margin-top:10px;">
        <b>¡Respuesta Correcta!</b><br>
        ${q.expl}
      </div>
    `;
  } else {
    fb.innerHTML = `
      <div class="alert alert-danger" style="text-align:left; margin-top:10px;">
        <b>Respuesta Incorrecta.</b><br>
        La alternativa correcta era: <i>"${q.options[q.correct]}"</i>.<br>
        <small><b>Explicación:</b> ${q.expl}</small>
      </div>
    `;
  }

  document.getElementById('adv-next-btn').classList.remove('hidden');
}

function nextAdvQuestion() {
  if (timerInterval) clearInterval(timerInterval);
  advCurrentIndex++;
  renderAdvancedQuiz();
}

function restartAdvancedQuiz() {
  advCurrentIndex = 0;
  advAnswersState = {};
  renderAdvancedQuiz();
}


// =================================================================
// 6. INICIALIZACIÓN GENERAL DE LA APLICACIÓN
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
  initQuiz('descendentes');
  initPracticaSection();
  renderLabSection();
  renderAdvancedQuiz();
});