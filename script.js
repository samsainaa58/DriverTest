window.allQuestions = {
  "1. НЭР ТОМЬЁО БА ТОДОРХОЙЛОЛТ": [
    {
      "text": "Аль сумаар замын өргөнийг үзүүлсэн бэ?",
      "options": ["1. А", "2. Б", "3. В", "4. Г", "5. Д"],
      "answer": "4",
      "explanation": "",
      "image": "images/cat1/q1.jpg",
      "hint": "“Зам” гэдэгт хөдөлгөөнд нээлттэй хучилттай буюу шороон зурвас газрыг ойлгоно.",
      "hintImage": "images/cat1/h1.jpg"
    }
  ]
};

let currentCategory = "";
let currentQuestions = [];
let totalQuestions = 0;
let answeredCount = 0;
let score = 0;

window.onload = () => {
  const grid = document.getElementById('categoryGrid');
  const categories = Object.keys(window.allQuestions);
  categories.forEach(cat => {
    const count = window.allQuestions[cat].length;
    const div = document.createElement('div');
    div.className = 'category';
    div.innerHTML = `${cat}<br><small>(${count} асуулт)</small>`;
    div.onclick = () => startCategory(cat);
    grid.appendChild(div);
  });
};

function startCategory(categoryName) {
  currentCategory = categoryName;
  currentQuestions = window.allQuestions[categoryName] || [];
  totalQuestions = currentQuestions.length;
  answeredCount = 0;
  score = 0;

  document.getElementById('categoryPage').classList.add('hidden');
  document.getElementById('quizPage').classList.remove('hidden');

  document.getElementById('categoryTitle').innerText = categoryName;
  document.getElementById('progressText').innerText = `Асуулт: 0 / ${totalQuestions}`;
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('final-result').classList.add('hidden');

  renderQuestions();
  window.scrollTo(0, 0);
}

function renderQuestions() {
  const container = document.getElementById('quizForm');
  container.innerHTML = '';

  currentQuestions.forEach((q, i) => {
    const qElem = document.createElement('div');
    qElem.className = 'question';
    qElem.dataset.index = i;
    qElem.dataset.answer = q.answer;
    qElem.dataset.answered = 'false';

    let img = q.image ? `<img src="${q.image}" class="question-image">` : '';
    let opts = q.options.map((opt, idx) =>
      `<div class="option" data-index="${idx + 1}" onclick="checkAnswer(this)">${opt}</div>`
    ).join('');

    const hintButton = (q.hint || q.hintImage)
      ? `<button type='button' class='hint-btn' onclick='showHint(this)'>🔍 Hint</button>` : '';
    const hintBlock = `
      <div class='hint-container hidden'>
        ${q.hintImage ? `<img src='${q.hintImage}' style='width: 100%; height: auto;'/>` : ''}
        ${q.hint ? `<div class='hint-text'>${q.hint}</div>` : ''}
      </div>
    `;

    qElem.innerHTML = `
      <p><strong>${i + 1}. ${q.text}</strong></p>
      ${img}
      ${opts}
      <div class="explanation hidden">${q.explanation}</div>
      ${hintButton}
      ${hintBlock}
    `;

    container.appendChild(qElem);
  });
}

function checkAnswer(el) {
  const q = el.closest('.question');
  if (q.dataset.answered === 'true') return;

  const correctIndex = q.dataset.answer;
  const selectedIndex = el.dataset.index;

  if (selectedIndex === correctIndex) {
    el.classList.add('correct');
    score++;
  } else {
    el.classList.add('incorrect');
    q.querySelector(`.option[data-index="${correctIndex}"]`).classList.add('correct');
    q.querySelector('.explanation').classList.remove('hidden');
  }

  q.dataset.answered = 'true';
  answeredCount++;

  document.getElementById('progressText').innerText = `Асуулт: ${answeredCount} / ${totalQuestions}`;
  document.getElementById('progressFill').style.width = `${(answeredCount / totalQuestions) * 100}%`;

  if (answeredCount === totalQuestions) {
    document.getElementById('scoreText').innerText = `Таны оноо: ${score}/${totalQuestions}`;
    document.getElementById('final-result').classList.remove('hidden');
    window.scrollTo(0, document.body.scrollHeight);
  }
}

function restartQuiz() {
  startCategory(currentCategory);
}

function backToCategories() {
  document.getElementById('quizPage').classList.add('hidden');
  document.getElementById('categoryPage').classList.remove('hidden');
  window.scrollTo(0, 0);
}

function showHint(button) {
  const questionBox = button.closest('.question');
  if (!questionBox) return;
  const hintContainer = questionBox.querySelector('.hint-container');
  if (hintContainer) {
    hintContainer.classList.toggle('hidden');
  }
}
