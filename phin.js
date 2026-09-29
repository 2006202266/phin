const questions = [
    {
        question: "what is javascript?",
        answers: [
            "A programming language",
            "A database",
            "An operating system",
            "A web browser"
        ],
        correct: "A programming language"
    },
    {
        question: "Whta does HTML stand for?",
        answers: [
            "High Text Machine Language",
            "Hyper Text Markup Language",
            "Hyperlinks Text Mark Language",
            "Home Tool Markup Language"
        ],
        correct: "Hyper Text Markup Language"
    },
    {
        question: "What is CSS used for?",
        answers: [
            "Creating database",
            "Styling web pages",
            "Programming servers",
            "Storing files"
        ],
        correct: "Styling web pages"
    }
];

const quizContainer = document.getElementById("container");
const resultContainer = document.getElementById("results-container");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextButton = document.getElementById("btn");
const restartButton = document.getElementById("restart-btn");
const timerElement = document.getElementById("timer");
const questionNumberElement = document.getElementById("question-number");
const totalQuestionsElement = document.getElementById("total-questions");
const percentageElement = document.getElementById("percentage");
const answeredCountElement = document.getElementById("Answered-count");
const resultTotalElement = document.getElementById("result-total");
const correctCountElement = document.getElementById("correct-count");
const incorrectCountElement = document.getElementById("incorrect-count");
const summaryElement = document.getElementById("Summary");

let currentQuestion = 0;
let selectedAnswer = "";
let correctAnswers = 0;
let incorrectAnswers = 0;
let answeredQuestions = 0;
let timeLeft = 15;
let timer;
let quizQuestions = [];
let questionResults = [];

function shuffleQuestions() {
    quizQuestions = [...questions].sort(() => Math.random() - 0.5);
}

function startQuiz() {
    currentQuestion = 0;
    selectedAnswer = "";
    correctAnswers = 0;
    incorrectAnswers = 0;
    answeredQuestions = 0;
    questionResults = [];

    shuffleQuestions();

    quizContainer.style.display = "block";
    resultContainer.style.display = "none";
    totalQuestionsElement.textContent = quizQuestions.length;

    showQuestion();
}

function showQuestion() {
    clearInterval(timer);
    selectedAnswer = "";

    const currentQuestionData = quizQuestions[currentQuestion];

    questionElement.textContent = currentQuestionData.question;
    questionNumberElement.textContent = currentQuestion + 1;
    answersElement.innerHTML = "";

    currentQuestionData.answers.forEach(function (answer) {
        const button = document.createElement("button");
        button.textContent = answer;
        button.classList.add("answer-option");

        button.addEventListener("click", function () {
            selectedAnswer = answer;

            const buttons = answersElement.querySelectorAll("button");
            buttons.forEach(function (btn) {
                btn.classList.remove("selected");
            });

            button.classList.add("selected");
        });

        answersElement.appendChild(button);
    });

    nextButton.disabled = false;
    startTimer();
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 15;
    timerElement.textContent = "Time:" + timeLeft;

    timer = setInterval(function () {
        timeLeft--;
        timerElement.textContent = "Time:" + timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            timeUp();
        }
    }, 1000);
}

function timeUp() {
    const buttons = answersElement.querySelectorAll("button");
    const correctAnswer = quizQuestions[currentQuestion].correct;

    buttons.forEach(function (button) {
        button.disabled = true;

        if (button.textContent === correctAnswer) {
            button.classList.add("correct");
        }
    });

    selectedAnswer = "";
    nextButton.disabled = false;
}

nextButton.addEventListener("click", function () {
    clearInterval(timer);

    if (currentQuestion >= quizQuestions.length) {
        return;
    }

    const currentQuestionData = quizQuestions[currentQuestion];
    const correctAnswer = currentQuestionData.correct;

    if (selectedAnswer === "") {
        questionResults.push({
            question: currentQuestionData.question,
            userAnswer: "Not answered",
            correctAnswer: correctAnswer,
            isCorrect: false
        });
        incorrectAnswers++;
    } else {
        answeredQuestions++;

        if (selectedAnswer === correctAnswer) {
            correctAnswers++;
            questionResults.push({
                question: currentQuestionData.question,
                userAnswer: selectedAnswer,
                correctAnswer: correctAnswer,
                isCorrect: true
            });
        } else {
            incorrectAnswers++;
            questionResults.push({
                question: currentQuestionData.question,
                userAnswer: selectedAnswer,
                correctAnswer: correctAnswer,
                isCorrect: false
            });
        }
    }

    currentQuestion++;

    if (currentQuestion < quizQuestions.length) {
        showQuestion();
    } else {
        showResults();
    }
});

function showResults() {
    clearInterval(timer);
    quizContainer.style.display = "none";
    resultContainer.style.display = "block";

    const totalQuestions = quizQuestions.length;
    const percentage = totalQuestions === 0 ? 0 : Math.round((correctAnswers / totalQuestions) * 100);

    percentageElement.textContent = percentage + "%";
    answeredCountElement.textContent = answeredQuestions;
    resultTotalElement.textContent = totalQuestions;
    correctCountElement.textContent = correctAnswers;
    incorrectCountElement.textContent = incorrectAnswers;

    showSummary();
}

function showSummary() {
    summaryElement.innerHTML = "";

    questionResults.forEach(function (result, index) {
        const summaryItem = document.createElement("div");
        summaryItem.classList.add("summary-item");

        const statusText = result.isCorrect ? "Correct" : "Incorrect";
        summaryItem.innerHTML = "<p><strong>" + (index + 1) + ".</strong> " + result.question + "</p><p>Selected: " + result.userAnswer + "</p><p>Status: " + statusText + "</p>";

        summaryElement.appendChild(summaryItem);
    });
}

restartButton.addEventListener("click", function () {
    startQuiz();
});

startQuiz();
