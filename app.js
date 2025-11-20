// CareerPrep Quiz Portal
const screens = {
  home: document.getElementById("home"),
  quiz: document.getElementById("quiz"),
  result: document.getElementById("result"),
  flashcards: document.getElementById("flashcards")
};

let selectedCategory = "aptitude";
let mode = "quiz";
let currentQuestion = 0;
let score = 0;
let timer;
let flashIndex = 0;
let flashFlipped = false;

// Sample question data
const quizzes = {
  aptitude: [
    { q: "What is 15 + 28?", options: ["33", "43", "40", "48"], answer: "43" },
    { q: "Find the next number: 2, 4, 8, 16, ?", options: ["18", "20", "32", "24"], answer: "32" }
  ],
  html: [
    { q: "HTML stands for?", options: ["HyperText Markup Language", "HighText Machine Language", "Hyper Transfer Markup Language"], answer: "HyperText Markup Language" },
    { q: "Choose the correct HTML element for the largest heading:", options: ["<heading>", "<h1>", "<h6>", "<head>"], answer: "<h1>" }
  ],
  javascript: [
    { q: "Which keyword declares a variable in JS?", options: ["int", "var", "define", "const"], answer: "var" },
    { q: "Which symbol is used for comments?", options: ["//", "<!--", "#", "**"], answer: "//" }
  ],
  general: [
    { q: "The capital of Japan is?", options: ["Beijing", "Seoul", "Tokyo", "Bangkok"], answer: "Tokyo" },
    { q: "Water freezes at what temperature (°C)?", options: ["0", "100", "-10", "32"], answer: "0" }
  ]
};

// Flashcards for study mode
const flashcardsData = {
  aptitude: [
    { term: "Average", def: "Sum of items ÷ Number of items" },
    { term: "Profit", def: "Selling Price - Cost Price" }
  ],
  html: [
    { term: "<a>", def: "Creates a hyperlink" },
    { term: "<img>", def: "Embeds an image" }
  ],
  javascript: [
    { term: "const", def: "Declares a block-scoped constant variable" },
    { term: "DOM", def: "Document Object Model - interface to HTML structure" }
  ],
  general: [
    { term: "Oxygen symbol", def: "O" },
    { term: "Planet known as Red Planet", def: "Mars" }
  ]
};

// Utility
function show(screen) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[screen].classList.add("active");
}

function startQuiz() {
  show("quiz");
  score = 0;
  currentQuestion = 0;
  loadQuestion();
  startTimer();
}

function loadQuestion() {
  const list = quizzes[selectedCategory];
  const q = list[currentQuestion];
  document.getElementById("quizCategory").textContent = selectedCategory.toUpperCase();
  document.getElementById("quizProgress").textContent = `Q ${currentQuestion + 1} of ${list.length}`;
  document.getElementById("questionBox").textContent = q.q;
  const optionsBox = document.getElementById("optionsBox");
  optionsBox.innerHTML = "";
  q.options.forEach(opt => {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = opt;
    div.onclick = () => selectOption(div, opt);
    optionsBox.appendChild(div);
  });
}

function selectOption(div, opt) {
  const list = quizzes[selectedCategory];
  const correct = list[currentQuestion].answer;
  const all = document.querySelectorAll(".option");
  all.forEach(o => (o.onclick = null)); // disable further clicks

  if (opt === correct) {
    div.classList.add("correct");
    score++;
  } else {
    div.classList.add("wrong");
    all.forEach(o => {
      if (o.textContent === correct) o.classList.add("correct");
    });
  }
}

document.getElementById("nextBtn").onclick = () => {
  const list = quizzes[selectedCategory];
  if (currentQuestion < list.length - 1) {
    currentQuestion++;
    loadQuestion();
  } else {
    endQuiz();
  }
};

function startTimer() {
  let time = 30;
  const el = document.getElementById("quizTimer");
  clearInterval(timer);
  timer = setInterval(() => {
    el.textContent = `⏱️ ${time}s`;
    time--;
    if (time < 0) {
      clearInterval(timer);
      endQuiz();
    }
  }, 1000);
}

function endQuiz() {
  clearInterval(timer);
  show("result");
  document.getElementById("scoreText").textContent = `You scored ${score} / ${quizzes[selectedCategory].length}`;
}

document.getElementById("retryBtn").onclick = startQuiz;
document.getElementById("homeBtn").onclick = () => show("home");

// Home screen interactions
document.querySelectorAll(".category").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".category").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedCategory = btn.dataset.category;
  };
});
document.getElementById("quizMode").onclick = () => { mode = "quiz"; startQuiz(); };
document.getElementById("flashMode").onclick = () => { mode = "flash"; startFlashcards(); };

// FLASHCARDS
function startFlashcards() {
  flashIndex = 0;
  flashFlipped = false;
  show("flashcards");
  document.getElementById("flashCategory").textContent = selectedCategory.toUpperCase();
  renderFlashcard();
}

function renderFlashcard() {
  const data = flashcardsData[selectedCategory];
  const card = data[flashIndex];
  document.getElementById("flashFront").textContent = card.term;
  document.getElementById("flashBack").textContent = card.def;
  const flashCard = document.getElementById("flashCard");
  flashCard.style.transform = flashFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
}

document.getElementById("flipFlash").onclick = () => {
  flashFlipped = !flashFlipped;
  renderFlashcard();
};
document.getElementById("nextFlash").onclick = () => {
  const data = flashcardsData[selectedCategory];
  flashIndex = (flashIndex + 1) % data.length;
  flashFlipped = false;
  renderFlashcard();
};
document.getElementById("prevFlash").onclick = () => {
  const data = flashcardsData[selectedCategory];
  flashIndex = (flashIndex - 1 + data.length) % data.length;
  flashFlipped = false;
  renderFlashcard();
};
document.getElementById("backHomeFlash").onclick = () => show("home");
