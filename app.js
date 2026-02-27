
import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.7.76/pdf.min.mjs";

const startPage = document.getElementById("startPage");
const quizPage = document.getElementById("quizPage");
const topicPage = document.getElementById("topicPage");

const goQuizBtn = document.getElementById("goQuizBtn");
const goTopicBtn = document.getElementById("goTopicBtn");
const goNotesBtn = document.getElementById("goNotesBtn");
const backToStartFromQuizBtn = document.getElementById("backToStartFromQuizBtn");
const backToStartFromTopicBtn = document.getElementById("backToStartFromTopicBtn");
const backToStartFromNotesBtn = document.getElementById("backToStartFromNotesBtn");

const fileInput = document.getElementById("fileInput");
const chooseFileBtn = document.getElementById("chooseFileBtn");
const fileNameEl = document.getElementById("fileName");
const extractBtn = document.getElementById("extractBtn");
const generateBtn = document.getElementById("generateBtn");
const difficultySelect = document.getElementById("difficultySelect");
const textOutput = document.getElementById("textOutput");
const statusEl = document.getElementById("status");
const quizContainer = document.getElementById("quizContainer");
const restartBtn = document.getElementById("restartBtn");
const historyBtn = document.getElementById("historyBtn");

const topicInput = document.getElementById("topicInput");
const topicDifficultySelect = document.getElementById("topicDifficultySelect");
const generateTopicBtn = document.getElementById("generateTopicBtn");
const topicStatusEl = document.getElementById("topicStatus");
const topicQuizContainer = document.getElementById("topicQuizContainer");
const notesPage = document.getElementById("notesPage");
const notesFileInput = document.getElementById("notesFileInput");
const chooseNotesFileBtn = document.getElementById("chooseNotesFileBtn");
const notesFileNameEl = document.getElementById("notesFileName");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const notesStatusEl = document.getElementById("notesStatus");
const notesListContainer = document.getElementById("notesListContainer");

const HISTORY_KEY = "studyQuizHistory";
const NOTES_KEY = "studySavedNotes";

let activeFile = null;
let questions = [];
let selectedAnswers = [];
let topicQuestions = [];
let topicSelectedAnswers = [];
let selectedNoteFile = null;

const TOPIC_FACT_BANK = {
  science: [
    { term: "Photosynthesis", clue: "The process plants use to convert sunlight into chemical energy." },
    { term: "Evaporation", clue: "The process where liquid water changes into vapor." },
    { term: "Mitochondria", clue: "The organelle that produces most of a cell's ATP." },
    { term: "Gravity", clue: "The force that attracts objects toward each other." },
    { term: "Atom", clue: "The basic unit of matter." },
    { term: "Ecosystem", clue: "A community of organisms interacting with their environment." },
    { term: "Neuron", clue: "A specialized cell that transmits nerve impulses." },
    { term: "Acceleration", clue: "The rate of change of velocity over time." },
    { term: "Refraction", clue: "The bending of light as it passes through different media." },
    { term: "DNA", clue: "The molecule that carries genetic instructions in living organisms." }
  ],
  history: [
    { term: "Renaissance", clue: "A cultural movement in Europe known for art and scientific revival." },
    { term: "Industrial Revolution", clue: "The period marked by rapid growth of factories and machines." },
    { term: "Magna Carta", clue: "A 1215 document limiting the powers of the English king." },
    { term: "Cold War", clue: "A geopolitical tension between the US and Soviet Union after World War II." },
    { term: "Feudalism", clue: "A medieval social and political system based on land and loyalty." },
    { term: "World War I", clue: "A global conflict fought mainly from 1914 to 1918." },
    { term: "World War II", clue: "A global war fought from 1939 to 1945." },
    { term: "French Revolution", clue: "An uprising in late 18th-century France that changed monarchy rule." },
    { term: "Great Depression", clue: "A severe global economic downturn in the 1930s." },
    { term: "Ancient Egypt", clue: "A civilization known for pyramids and pharaohs along the Nile River." }
  ],
  mathematics: [
    { term: "Pythagorean Theorem", clue: "A rule in right triangles expressed as a^2 + b^2 = c^2." },
    { term: "Prime Number", clue: "A whole number greater than 1 with exactly two factors." },
    { term: "Median", clue: "The middle value in an ordered set of numbers." },
    { term: "Derivative", clue: "The instantaneous rate of change of a function." },
    { term: "Probability", clue: "A measure of the chance that an event will occur." },
    { term: "Matrix", clue: "A rectangular array of numbers arranged in rows and columns." },
    { term: "Integer", clue: "A whole number that can be positive, negative, or zero." },
    { term: "Quadratic", clue: "A polynomial expression with degree two." },
    { term: "Perimeter", clue: "The total distance around a shape." },
    { term: "Factorial", clue: "The product of all positive integers up to a given number." }
  ],
  "programming-languages": [
    { term: "Python", clue: "A high-level language known for readable syntax and rapid development." },
    { term: "C++", clue: "A compiled language supporting object-oriented and low-level programming." },
    { term: "C#", clue: "A language developed by Microsoft for .NET applications." },
    { term: "HTML", clue: "The markup language used to structure web pages." },
    { term: "CSS", clue: "The style sheet language used to design web page appearance." },
    { term: "Java", clue: "A class-based language designed to run on the JVM with 'write once, run anywhere'." },
    { term: "JavaScript", clue: "A scripting language used for interactive behavior in web browsers." },
    { term: "React", clue: "A JavaScript library used to build component-based user interfaces." },
    { term: "Node.js", clue: "A JavaScript runtime used to run JavaScript on the server side." },
    { term: "TypeScript", clue: "A typed superset of JavaScript that compiles to plain JavaScript." }
  ],
  computer: [
    { term: "Algorithm", clue: "A step-by-step procedure for solving a problem." },
    { term: "Compiler", clue: "A program that translates high-level code into machine code." },
    { term: "Database", clue: "An organized collection of data that can be queried and updated." },
    { term: "API", clue: "A defined interface that allows software systems to communicate." },
    { term: "Encryption", clue: "The process of converting information into secure coded form." },
    { term: "Recursion", clue: "A technique where a function calls itself." },
    { term: "Cache", clue: "A small fast storage used to speed up data retrieval." },
    { term: "Firewall", clue: "A security system that filters network traffic." },
    { term: "Variable", clue: "A named storage location in programming." },
    { term: "Binary", clue: "A base-2 number system using 0 and 1." }
  ]
};

showView("start");

goQuizBtn.addEventListener("click", () => {
  showView("quiz");
  setStatus("Select a file to begin.");
});

goTopicBtn.addEventListener("click", () => {
  showView("topic");
  setTopicStatus("Choose a topic and difficulty to generate MCQs.");
});

goNotesBtn.addEventListener("click", () => {
  showView("notes");
  renderNotesList();
  setNotesStatus("Select a PDF or image to save in your organizer.");
});

backToStartFromQuizBtn.addEventListener("click", () => {
  returnToStartPage();
});

backToStartFromTopicBtn.addEventListener("click", () => {
  returnToStartPage();
});

backToStartFromNotesBtn.addEventListener("click", () => {
  returnToStartPage();
});

fileInput.addEventListener("change", () => {
  activeFile = fileInput.files[0] || null;

  if (!activeFile) {
    fileNameEl.textContent = "No file selected";
    extractBtn.disabled = true;
    generateBtn.disabled = true;
    setStatus("Select a file to begin.");
    return;
  }

  fileNameEl.textContent = activeFile.name;
  extractBtn.disabled = false;
  generateBtn.disabled = true;
  setStatus(`Selected: ${activeFile.name}`);
});

extractBtn.addEventListener("click", async () => {
  if (!activeFile) return;

  setStatus("Extracting text. This can take a minute for large files...");
  extractBtn.disabled = true;

  try {
    let extracted = "";

    if (activeFile.type === "application/pdf" || activeFile.name.toLowerCase().endsWith(".pdf")) {
      extracted = await extractPdfText(activeFile);
    } else if (activeFile.type.startsWith("image/")) {
      extracted = await extractImageText(activeFile);
    } else {
      throw new Error("Unsupported file type. Use PDF or image.");
    }

    textOutput.value = normalizeText(extracted);
    generateBtn.disabled = textOutput.value.trim().length < 120;
    setStatus(generateBtn.disabled
      ? "Text extracted, but not enough content to build a useful quiz."
      : "Text extracted. Click Generate Quiz.");
  } catch (error) {
    setStatus(`Error: ${error.message}`);
  } finally {
    extractBtn.disabled = false;
  }
});

generateBtn.addEventListener("click", () => {
  const sourceText = normalizeText(textOutput.value);
  const difficulty = difficultySelect.value;

  if (sourceText.length < 120) {
    setStatus("Please provide more text to generate a quiz.");
    return;
  }

  questions = buildQuiz(sourceText, difficulty);
  if (questions.length === 0) {
    setStatus("Could not generate quiz questions from the text.");
    return;
  }

  selectedAnswers = new Array(questions.length).fill(null);
  renderQuiz(questions);
  restartBtn.hidden = true;
  setStatus(`Quiz ready: ${questions.length} questions (${capitalize(difficulty)}).`);
});

historyBtn.addEventListener("click", () => {
  renderHistoryPage();
});

restartBtn.addEventListener("click", () => {
  returnToStartPage();
});

generateTopicBtn.addEventListener("click", () => {
  const topic = normalizeText(topicInput.value).toLowerCase();
  const difficulty = topicDifficultySelect.value;

  if (topic.length < 2) {
    setTopicStatus("Please enter a topic name.");
    return;
  }

  topicQuestions = buildTopicQuiz(topic, difficulty);
  if (topicQuestions.length === 0) {
    setTopicStatus("Could not create topic-wise quiz. Try a topic like programming language, maths, computers, science, or history.");
    return;
  }

  topicSelectedAnswers = new Array(topicQuestions.length).fill(null);
  renderTopicQuiz(topicQuestions, topic, difficulty);
  setTopicStatus(`${formatTopicName(topic)} MCQ ready (${capitalize(difficulty)}).`);
});

notesFileInput.addEventListener("change", () => {
  const file = notesFileInput.files[0] || null;
  if (!file) {
    notesFileNameEl.textContent = "No file selected";
    selectedNoteFile = null;
    saveNoteBtn.disabled = true;
    setNotesStatus("Select a PDF or image to save in your organizer.");
    return;
  }

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  const isImage = file.type.startsWith("image/");
  if (!isPdf && !isImage) {
    notesFileNameEl.textContent = "No file selected";
    selectedNoteFile = null;
    saveNoteBtn.disabled = true;
    setNotesStatus("Only PDF or image files are supported.");
    return;
  }

  selectedNoteFile = file;
  notesFileNameEl.textContent = file.name;
  saveNoteBtn.disabled = false;
  setNotesStatus(`Ready to save: ${file.name}`);
});

saveNoteBtn.addEventListener("click", async () => {
  if (!selectedNoteFile) return;

  try {
    const dataUrl = await readFileAsDataUrl(selectedNoteFile);
    const notes = getSavedNotes();
    notes.unshift({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: selectedNoteFile.name,
      type: selectedNoteFile.type || "application/octet-stream",
      size: selectedNoteFile.size || 0,
      date: new Date().toLocaleString(),
      dataUrl
    });

    localStorage.setItem(NOTES_KEY, JSON.stringify(notes.slice(0, 50)));
    selectedNoteFile = null;
    notesFileInput.value = "";
    notesFileNameEl.textContent = "No file selected";
    saveNoteBtn.disabled = true;
    renderNotesList();
    setNotesStatus("Note saved successfully.");
  } catch {
    setNotesStatus("Could not save note. File may be too large for browser storage.");
  }
});

function showView(view) {
  startPage.classList.add("hidden");
  quizPage.classList.add("hidden");
  topicPage.classList.add("hidden");
  notesPage.classList.add("hidden");

  if (view === "quiz") quizPage.classList.remove("hidden");
  if (view === "topic") topicPage.classList.remove("hidden");
  if (view === "notes") notesPage.classList.remove("hidden");
  if (view === "start") startPage.classList.remove("hidden");
}

function setStatus(message) {
  statusEl.textContent = message;
}

function setTopicStatus(message) {
  topicStatusEl.textContent = message;
}

function setNotesStatus(message) {
  notesStatusEl.textContent = message;
}

function normalizeText(input) {
  return input.replace(/\s+/g, " ").trim();
}

async function extractPdfText(file) {
  if (!pdfjsLib || !pdfjsLib.getDocument) {
    throw new Error("PDF library not loaded. Check your internet connection.");
  }

  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.7.76/pdf.worker.min.mjs";
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    fullText += ` ${pageText}`;
  }

  return fullText;
}

async function extractImageText(file) {
  if (!window.Tesseract) {
    throw new Error("OCR library not loaded. Check your internet connection.");
  }

  const result = await window.Tesseract.recognize(file, "eng", {
    logger: (msg) => {
      if (msg.status === "recognizing text") {
        const pct = Math.round((msg.progress || 0) * 100);
        setStatus(`OCR progress: ${pct}%`);
      }
    }
  });

  return result.data.text;
}

function buildQuiz(text, difficulty) {
  const config = getDifficultyConfig(difficulty);
  const targetTotal = 15;
  const sentences = splitSentences(text, config);
  const uniqueSentences = [...new Set(sentences)].slice(0, 80);
  const poolWords = extractKeywords(text);
  const conceptPairs = extractConceptPairs(text);

  const definitionTarget = Math.round(targetTotal * config.definitionShare);
  const clozeTarget = targetTotal - definitionTarget;
  const definitionQuestions = createDefinitionQuestions(conceptPairs, definitionTarget, difficulty);
  const clozeQuestions = createClozeQuestions(uniqueSentences, poolWords, clozeTarget, difficulty, config);

  let combined = shuffle([...definitionQuestions, ...clozeQuestions]);
  if (combined.length < targetTotal) {
    const extraCloze = createClozeQuestions(
      uniqueSentences,
      poolWords,
      targetTotal - combined.length,
      difficulty,
      config
    );
    combined = shuffle([...combined, ...extraCloze]);
  }

  return combined.slice(0, targetTotal);
}

function buildTopicQuiz(topic, difficulty) {
  const topicKey = resolveTopicKey(topic);
  const facts = TOPIC_FACT_BANK[topicKey] || [];
  if (facts.length < 4) return [];

  const clues = facts.map((item) => item.clue);
  const questions = [];

  for (const fact of facts) {
    const distractors = pickTopicDistractors(fact, facts, difficulty);
    if (distractors.length < 3) continue;

    let prompt = `Choose the correct term: ${fact.clue}`;
    if (difficulty === "intermediate") {
      prompt = `Identify the concept from this statement: ${fact.clue}`;
    }
    if (difficulty === "advanced") {
      prompt = `Which concept best fits this context? ${fact.clue}`;
    }

    questions.push({
      type: "mcq",
      question: prompt,
      options: shuffle([fact.term, ...distractors.slice(0, 3)]),
      answer: fact.term
    });
  }

  // Extra reversed style for variety
  for (const fact of facts) {
    if (questions.length >= 12) break;
    const distractorClues = shuffle(clues.filter((clue) => clue !== fact.clue)).slice(0, 3);
    if (distractorClues.length < 3) continue;

    questions.push({
      type: "mcq",
      question: `What is the best description of "${fact.term}"?`,
      options: shuffle([fact.clue, ...distractorClues]),
      answer: fact.clue
    });
  }

  return shuffle(questions).slice(0, 12);
}

function pickTopicDistractors(targetFact, facts, difficulty) {
  let candidates = [];

  if (difficulty === "advanced") {
    candidates = facts
      .filter((item) => item.term !== targetFact.term)
      .filter((item) => Math.abs(item.term.length - targetFact.term.length) <= 3)
      .map((item) => item.term);
  } else if (difficulty === "beginner") {
    candidates = facts
      .filter((item) => item.term !== targetFact.term)
      .filter((item) => item.term[0].toLowerCase() !== targetFact.term[0].toLowerCase())
      .map((item) => item.term);
  } else {
    candidates = facts
      .filter((item) => item.term !== targetFact.term)
      .map((item) => item.term);
  }

  if (candidates.length < 3) {
    candidates = facts.filter((item) => item.term !== targetFact.term).map((item) => item.term);
  }

  return shuffle(candidates);
}

function renderQuiz(quizData) {
  renderMCQSession(quizContainer, quizData, selectedAnswers, "Submit Quiz", (data, answers) => {
    renderScoreCard(data, answers);
  });
}

function renderTopicQuiz(quizData, topic, difficulty) {
  renderMCQSession(topicQuizContainer, quizData, topicSelectedAnswers, "Submit Topic Quiz", (data, answers) => {
    renderTopicScoreCard(data, answers, topic, difficulty);
  });
}

function renderMCQSession(container, quizData, answers, submitLabel, onSubmit) {
  container.innerHTML = "";

  quizData.forEach((q, idx) => {
    const box = document.createElement("article");
    box.className = "quiz-item";

    const title = document.createElement("h3");
    title.textContent = `${idx + 1}. ${q.question}`;
    box.appendChild(title);

    const optionsWrap = document.createElement("div");
    optionsWrap.className = "options";

    q.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.textContent = option;

      btn.addEventListener("click", () => {
        [...optionsWrap.children].forEach((child) => child.classList.remove("selected"));
        btn.classList.add("selected");
        answers[idx] = option;
        updateSubmitState(submitBtn, answers);
      });

      optionsWrap.appendChild(btn);
    });

    box.appendChild(optionsWrap);
    container.appendChild(box);
  });

  const actionsWrap = document.createElement("div");
  actionsWrap.className = "quiz-actions";

  const submitBtn = document.createElement("button");
  submitBtn.type = "button";
  submitBtn.className = "btn primary";
  submitBtn.textContent = submitLabel;
  submitBtn.disabled = true;

  submitBtn.addEventListener("click", () => {
    const unanswered = answers.filter((answer) => answer === null).length;
    if (unanswered > 0) return;
    onSubmit(quizData, answers);
  });

  actionsWrap.appendChild(submitBtn);
  container.appendChild(actionsWrap);
  updateSubmitState(submitBtn, answers);
}

function updateSubmitState(submitBtn, answers) {
  submitBtn.disabled = answers.some((answer) => answer === null);
}

function renderScoreCard(quizData, answers) {
  const score = calculateScore(quizData, answers);
  saveScoreHistory(score, quizData.length, { mode: "Generate Quiz" });
  quizContainer.innerHTML = "";

  const scoreCard = buildScoreCardElement(quizData, answers, score, "Return to Start Page", returnToStartPage);
  quizContainer.appendChild(scoreCard);
  setStatus("Quiz submitted. Review your score card below.");
}

function renderTopicScoreCard(quizData, answers, topic, difficulty) {
  const score = calculateScore(quizData, answers);
  saveScoreHistory(score, quizData.length, { mode: "Topic-wise MCQ", topic: `${formatTopicName(topic)} (${capitalize(difficulty)})` });
  topicQuizContainer.innerHTML = "";

  const scoreCard = buildScoreCardElement(
    quizData,
    answers,
    score,
    "Return to Topic Page",
    () => {
      topicQuestions = [];
      topicSelectedAnswers = [];
      topicQuizContainer.innerHTML = '<p class="muted">Select a topic and generate MCQs.</p>';
      setTopicStatus("Returned to topic-wise page.");
    }
  );
  topicQuizContainer.appendChild(scoreCard);
  setTopicStatus("Topic quiz submitted. Review your score card below.");
}

function buildScoreCardElement(quizData, answers, score, buttonLabel, onReturn) {
  const scoreCard = document.createElement("section");
  scoreCard.className = "scorecard";

  const heading = document.createElement("h3");
  heading.textContent = "Score Card";
  scoreCard.appendChild(heading);

  const summary = document.createElement("p");
  summary.className = "summary";
  summary.textContent = `Your Score: ${score}/${quizData.length}`;
  scoreCard.appendChild(summary);

  quizData.forEach((question, index) => {
    const row = document.createElement("article");
    row.className = "score-row";

    const questionEl = document.createElement("p");
    questionEl.className = "score-question";
    questionEl.textContent = `${index + 1}. ${question.question}`;
    row.appendChild(questionEl);

    const yourAnswer = document.createElement("p");
    yourAnswer.className = "score-answer";
    yourAnswer.textContent = `Your answer: ${answers[index]}`;
    row.appendChild(yourAnswer);

    const correctAnswer = document.createElement("p");
    correctAnswer.className = "score-correct";
    correctAnswer.textContent = `Correct answer: ${question.answer}`;
    row.appendChild(correctAnswer);

    const result = document.createElement("p");
    const isCorrect = answers[index] === question.answer;
    result.className = isCorrect ? "result-correct" : "result-wrong";
    result.textContent = isCorrect ? "Result: Correct" : "Result: Wrong";
    row.appendChild(result);

    scoreCard.appendChild(row);
  });

  const returnBtn = document.createElement("button");
  returnBtn.type = "button";
  returnBtn.className = "btn";
  returnBtn.textContent = buttonLabel;
  returnBtn.addEventListener("click", onReturn);
  scoreCard.appendChild(returnBtn);

  return scoreCard;
}

function calculateScore(quizData, answers) {
  return quizData.reduce((total, question, index) => {
    return total + (answers[index] === question.answer ? 1 : 0);
  }, 0);
}

function renderHistoryPage() {
  const history = getScoreHistory();
  quizContainer.innerHTML = "";

  const card = document.createElement("section");
  card.className = "scorecard";

  const heading = document.createElement("h3");
  heading.textContent = "Previous Scores";
  card.appendChild(heading);

  if (history.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No quiz attempts saved yet.";
    card.appendChild(empty);
  } else {
    const list = document.createElement("div");
    list.className = "history-list";

    history.forEach((entry, index) => {
      const item = document.createElement("article");
      item.className = "history-item";

      const title = document.createElement("p");
      title.className = "history-title";
      title.textContent = `Attempt #${history.length - index} - ${entry.mode}`;
      item.appendChild(title);

      if (entry.topic) {
        const topic = document.createElement("p");
        topic.className = "history-date";
        topic.textContent = `Topic: ${entry.topic}`;
        item.appendChild(topic);
      }

      const date = document.createElement("p");
      date.className = "history-date";
      date.textContent = `Date: ${entry.date}`;
      item.appendChild(date);

      const score = document.createElement("p");
      score.className = "history-score";
      score.textContent = `Score: ${entry.score}/${entry.total}`;
      item.appendChild(score);

      list.appendChild(item);
    });

    card.appendChild(list);
  }

  const actions = document.createElement("div");
  actions.className = "quiz-actions";

  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.className = "btn";
  clearBtn.textContent = "Clear History";
  clearBtn.disabled = history.length === 0;
  clearBtn.addEventListener("click", () => {
    localStorage.removeItem(HISTORY_KEY);
    renderHistoryPage();
    setStatus("History cleared.");
  });
  actions.appendChild(clearBtn);

  const returnBtn = document.createElement("button");
  returnBtn.type = "button";
  returnBtn.className = "btn";
  returnBtn.textContent = "Return to Start Page";
  returnBtn.addEventListener("click", returnToStartPage);
  actions.appendChild(returnBtn);

  card.appendChild(actions);
  quizContainer.appendChild(card);
  setStatus("Viewing previous quiz scores.");
}

function returnToStartPage() {
  questions = [];
  selectedAnswers = [];
  topicQuestions = [];
  topicSelectedAnswers = [];
  selectedNoteFile = null;
  activeFile = null;
  restartBtn.hidden = true;
  quizContainer.innerHTML = '<p class="muted">No quiz yet. Upload notes and click Generate Quiz.</p>';
  topicQuizContainer.innerHTML = '<p class="muted">Select a topic and generate MCQs.</p>';
  fileInput.value = "";
  notesFileInput.value = "";
  fileNameEl.textContent = "No file selected";
  notesFileNameEl.textContent = "No file selected";
  extractBtn.disabled = true;
  generateBtn.disabled = true;
  saveNoteBtn.disabled = true;
  showView("start");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

bindFilePickerButton(
  chooseFileBtn,
  fileInput,
  () => setStatus("Cannot open file chooser in this app. Enable file upload in your app wrapper.")
);
bindFilePickerButton(
  chooseNotesFileBtn,
  notesFileInput,
  () => setNotesStatus("Cannot open file chooser in this app. Enable file upload in your app wrapper.")
);

function getSavedNotes() {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function renderNotesList() {
  const notes = getSavedNotes();
  notesListContainer.innerHTML = "";

  if (notes.length === 0) {
    notesListContainer.innerHTML = '<p class="muted">No saved notes yet.</p>';
    return;
  }

  const list = document.createElement("div");
  list.className = "history-list";

  notes.forEach((note, index) => {
    const item = document.createElement("article");
    item.className = "history-item";

    const title = document.createElement("p");
    title.className = "history-title";
    title.textContent = `${index + 1}. ${note.name}`;
    item.appendChild(title);

    const date = document.createElement("p");
    date.className = "history-date";
    date.textContent = `Saved: ${note.date}`;
    item.appendChild(date);

    const size = document.createElement("p");
    size.className = "history-score";
    size.textContent = `Size: ${formatFileSize(note.size)}`;
    item.appendChild(size);

    const actions = document.createElement("div");
    actions.className = "notes-actions";

    const downloadBtn = document.createElement("button");
    downloadBtn.type = "button";
    downloadBtn.className = "btn";
    downloadBtn.textContent = "Download";
    downloadBtn.addEventListener("click", () => {
      const link = document.createElement("a");
      link.href = note.dataUrl;
      link.download = note.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
    actions.appendChild(downloadBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      const updated = getSavedNotes().filter((entry) => entry.id !== note.id);
      localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
      renderNotesList();
      setNotesStatus("Note deleted.");
    });
    actions.appendChild(deleteBtn);

    item.appendChild(actions);
    list.appendChild(item);
  });

  notesListContainer.appendChild(list);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("File read failed."));
    reader.readAsDataURL(file);
  });
}

function bindFilePickerButton(button, input, onBlocked) {
  button.addEventListener("click", () => {
    input.value = "";
    try {
      input.click();
    } catch {
      onBlocked();
    }
  });
}

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function saveScoreHistory(score, total, meta = {}) {
  const history = getScoreHistory();
  const entry = {
    score,
    total,
    mode: meta.mode || "Quiz",
    topic: meta.topic || "",
    date: new Date().toLocaleString()
  };

  history.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
}

function getScoreHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatTopicName(topicKey) {
  return topicKey
    .split(/[\s-]+/)
    .map((part) => capitalize(part))
    .join(" ");
}

function resolveTopicKey(topic) {
  const raw = topic.toLowerCase().trim();
  if (!raw) return "";

  const aliases = {
    science: "science",
    physics: "science",
    chemistry: "science",
    biology: "science",
    history: "history",
    maths: "mathematics",
    math: "mathematics",
    mathematics: "mathematics",
    computer: "computer",
    computers: "computer",
    "programming language": "programming-languages",
    "programming languages": "programming-languages",
    programming: "programming-languages",
    coding: "programming-languages",
    software: "computer",
    python: "programming-languages",
    "c++": "programming-languages",
    "c#": "programming-languages",
    html: "programming-languages",
    css: "programming-languages",
    java: "programming-languages",
    javascript: "programming-languages",
    react: "programming-languages",
    nodejs: "programming-languages",
    "node.js": "programming-languages"
  };

  if (aliases[raw]) return aliases[raw];

  const found = Object.keys(aliases).find((key) => raw.includes(key));
  return found ? aliases[found] : "";
}

function extractKeywords(text) {
  const words = text.toLowerCase().match(/\b[a-z][a-z-]{3,}\b/g) || [];
  return [...new Set(words.filter((w) => !isStopWord(w)))];
}

function splitSentences(text, config) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > config.minSentenceLength && s.length < config.maxSentenceLength);
}

function extractConceptPairs(text) {
  const pairs = [];
  const seen = new Set();
  const regex = /\b([A-Za-z][A-Za-z0-9\- ]{2,40}?)\s+(is|are|refers to|means|defined as)\s+([^.!?]{15,180})[.!?]/gi;
  let match = regex.exec(text);

  while (match) {
    const term = cleanTerm(match[1]);
    const definition = match[3].trim();
    const key = `${term.toLowerCase()}::${definition.toLowerCase()}`;

    if (
      term.length >= 3 &&
      term.length <= 42 &&
      definition.length >= 15 &&
      !seen.has(key) &&
      !isMostlyStopWords(term)
    ) {
      pairs.push({ term, definition });
      seen.add(key);
    }

    match = regex.exec(text);
  }

  return pairs.slice(0, 40);
}

function createDefinitionQuestions(pairs, maxCount, difficulty) {
  if (pairs.length < 2) return [];
  const questions = [];

  for (const pair of pairs) {
    if (questions.length >= maxCount) break;
    const distractorDefs = shuffle(
      pairs.filter((p) => p.term !== pair.term).map((p) => p.definition)
    ).slice(0, 3);

    if (distractorDefs.length < 3) continue;

    const questionText = difficulty === "beginner"
      ? `Choose the correct meaning of "${pair.term}".`
      : `What is the best description of "${pair.term}"?`;

    questions.push({
      type: "mcq",
      question: questionText,
      options: shuffle([pair.definition, ...distractorDefs]),
      answer: pair.definition
    });
  }

  return questions;
}

function createClozeQuestions(sentences, poolWords, maxCount, difficulty, config) {
  const questions = [];
  const used = new Set();

  for (const sentence of sentences) {
    if (questions.length >= maxCount) break;

    const words = sentence.match(/\b[A-Za-z][A-Za-z-]{3,}\b/g) || [];
    const candidates = words.filter((w) => !isStopWord(w));
    if (candidates.length === 0) continue;

    const answer = pickLongest(candidates);
    if (!answer || answer.length < config.minAnswerLength) continue;

    const prompt = sentence.replace(new RegExp(`\\b${escapeRegExp(answer)}\\b`), "_____");
    if (!prompt.includes("_____")) continue;

    const distractors = pickDistractors(answer, poolWords, difficulty);
    if (distractors.length < 3) continue;

    const question = difficulty === "advanced"
      ? `Analyze the context and choose the most accurate term: ${prompt}`
      : `Based on your notes, choose the best word to complete: ${prompt}`;
    if (used.has(question)) continue;

    questions.push({
      type: "mcq",
      question,
      options: shuffle([answer, ...distractors.slice(0, 3)]),
      answer
    });
    used.add(question);
  }

  return questions;
}

function pickDistractors(answer, wordPool, difficulty) {
  const normalizedAnswer = answer.toLowerCase();
  let candidates = [];
  if (wordPool.length === 0) return candidates;

  if (difficulty === "beginner") {
    candidates = wordPool.filter((w) => w !== normalizedAnswer && Math.abs(w.length - normalizedAnswer.length) >= 3);
  } else if (difficulty === "advanced") {
    candidates = wordPool.filter((w) => w !== normalizedAnswer && Math.abs(w.length - normalizedAnswer.length) <= 2);
  } else {
    candidates = wordPool.filter((w) => w !== normalizedAnswer && Math.abs(w.length - normalizedAnswer.length) <= 4);
  }

  if (candidates.length < 3) candidates = wordPool.filter((w) => w !== normalizedAnswer);
  return shuffle(candidates).slice(0, 5).map((w) => capitalize(w));
}

function getDifficultyConfig(difficulty) {
  if (difficulty === "beginner") {
    return { minSentenceLength: 30, maxSentenceLength: 180, minAnswerLength: 4, definitionShare: 0.3 };
  }
  if (difficulty === "advanced") {
    return { minSentenceLength: 50, maxSentenceLength: 260, minAnswerLength: 6, definitionShare: 0.55 };
  }
  return { minSentenceLength: 40, maxSentenceLength: 220, minAnswerLength: 5, definitionShare: 0.45 };
}

function pickLongest(words) {
  return words.sort((a, b) => b.length - a.length)[0] || null;
}

function cleanTerm(term) {
  return term.replace(/\s+/g, " ").trim().replace(/^[^A-Za-z]+|[^A-Za-z0-9]+$/g, "");
}

function isMostlyStopWords(term) {
  const parts = term.toLowerCase().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return true;
  const stopCount = parts.filter((w) => isStopWord(w)).length;
  return stopCount / parts.length > 0.6;
}

function isStopWord(word) {
  const list = new Set([
    "about", "after", "again", "against", "between", "could", "should", "would",
    "there", "their", "these", "those", "because", "during", "before", "which",
    "while", "where", "being", "having", "through", "other", "under", "into", "from",
    "with", "that", "this", "what", "when", "then", "than", "have", "were", "your",
    "they", "them", "each", "just", "very", "also", "such", "only", "more", "most"
  ]);
  return list.has(word.toLowerCase());
}

function shuffle(arr) {
  const clone = [...arr];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
