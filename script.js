// --- Variables DOM ---
const quizData = [
  {
    question: "¿Qué color de contenedor se usa para materiales reciclables?",
    options: ["Negro", "Verde", "Azul", "Rojo"],
    answer: "Azul",
  },
  {
    question: "¿Cuál de estos materiales NO es reciclable?",
    options: ["Vidrio", "Plástico", "Cartón", "Restos de comida"],
    answer: "Restos de comida",
  },
  {
    question: "¿Qué significa ‘Reducir’ en el contexto ambiental?",
    options: [
      "Usar más productos nuevos",
      "Disminuir el consumo de recursos",
      "Tirar basura en la calle",
      "Comprar más envases plásticos",
    ],
    answer: "Disminuir el consumo de recursos",
  },
];

const startQuizBtn = document.getElementById("startQuizBtn");
const quizContainer = document.getElementById("quizContainer");
const commitmentForm = document.getElementById("commitmentForm");
const commitmentInput = document.getElementById("commitmentInput");
const commitmentMessage = document.getElementById("commitmentMessage");
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const navLinks = document.querySelectorAll(".nav-link");
const themeToggle = document.getElementById("theme-toggle");

// --- Estado tema oscuro ---
let darkMode = false;

// --- Funciones ---

function renderQuiz() {
  quizContainer.innerHTML = "";
  quizData.forEach((q, i) => {
    const div = document.createElement("div");
    div.classList.add("quiz-question");
    div.innerHTML = `
      <p><strong>${i + 1}. ${q.question}</strong></p>
      ${q.options
        .map(
          (opt) =>
            `<label><input type="radio" name="q${i}" value="${opt}"> ${opt}</label>`
        )
        .join("")}
      <div class="feedback" id="feedback${i}" style="color:#e74c3c; font-weight:600; margin-top:5px; display:none;"></div>
      <hr>
    `;
    quizContainer.appendChild(div);
  });

  const submitBtn = document.createElement("button");
  submitBtn.className = "btn";
  submitBtn.textContent = "Finalizar Quiz";
  submitBtn.addEventListener("click", validateQuiz);
  quizContainer.appendChild(submitBtn);
}

function validateQuiz() {
  let score = 0;
  let answeredAll = true;

  quizData.forEach((q, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const feedback = document.getElementById(`feedback${i}`);
    if (!selected) {
      answeredAll = false;
      feedback.textContent = "Por favor selecciona una respuesta.";
      feedback.style.color = "#e74c3c";
      feedback.style.display = "block";
      return;
    }
    if (selected.value === q.answer) {
      score++;
      feedback.textContent = "Respuesta correcta 🎉";
      feedback.style.color = "#27ae60";
    } else {
      feedback.textContent = `Respuesta incorrecta. La correcta es: "${q.answer}".`;
      feedback.style.color = "#e74c3c";
    }
    feedback.style.display = "block";
  });

  if (!answeredAll) {
    commitmentMessage.textContent = "Debes responder todas las preguntas.";
    commitmentMessage.style.color = "#e74c3c";
    return;
  }

  commitmentMessage.textContent = `Tu puntuación es ${score} de ${quizData.length}.`;
  commitmentMessage.style.color = "#27ae60";

  // Mostrar botón reiniciar
  const btn = quizContainer.querySelector("button.btn");
  btn.textContent = "Reiniciar Quiz";
  btn.removeEventListener("click", validateQuiz);
  btn.addEventListener("click", () => {
    commitmentMessage.textContent = "";
    renderQuiz();
  });
}

function animateStats() {
  const stats = document.querySelectorAll(".stat-number");
  stats.forEach((stat) => {
    const target = +stat.getAttribute("data-target");
    const increment = target / 200; // velocidad

    let current = 0;
    const updateCount = () => {
      current += increment;
      if (current < target) {
        stat.textContent = Math.ceil(current);
        requestAnimationFrame(updateCount);
      } else {
        stat.textContent = target;
      }
    };
    updateCount();
  });
}

function checkStatsVisible() {
  const statsSection = document.querySelector(".stats-section");
  const rect = statsSection.getBoundingClientRect();
  if (
    rect.top < window.innerHeight &&
    !statsSection.classList.contains("animated")
  ) {
    animateStats();
    statsSection.classList.add("animated");
  }
}

function saveCommitment(event) {
  event.preventDefault();
  const text = commitmentInput.value.trim();
  if (text.length < 5) {
    commitmentMessage.textContent =
      "Por favor escribe una acción válida de al menos 5 caracteres.";
    commitmentMessage.style.color = "#e74c3c";
    return;
  }
  localStorage.setItem("cleanAppCommitment", text);
  commitmentInput.value = "";
  commitmentMessage.textContent = "";
  openModal();
}

function openModal() {
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
}

// Scroll Smooth & Active Nav Link
function scrollActive() {
  const scrollY = window.pageYOffset;
  navLinks.forEach((link) => {
    const section = document.querySelector(link.hash);
    if (section) {
      const sectionTop = section.offsetTop - 90;
      const sectionHeight = section.offsetHeight;
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    }
  });
}

// Theme Toggle
function toggleTheme() {
  darkMode = !darkMode;
  if (darkMode) {
    document.body.classList.add("dark-theme");
    themeToggle.textContent = "☀️";
  } else {
    document.body.classList.remove("dark-theme");
    themeToggle.textContent = "🌙";
  }
}

// --- Event Listeners ---
startQuizBtn.addEventListener("click", () => {
  renderQuiz();
  startQuizBtn.style.display = "none";
});

commitmentForm.addEventListener("submit", saveCommitment);
modalClose.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
window.addEventListener("scroll", checkStatsVisible);
window.addEventListener("scroll", scrollActive);
themeToggle.addEventListener("click", toggleTheme);

// Para que el nav active funcione al cargar con scroll
document.addEventListener("DOMContentLoaded", scrollActive);
