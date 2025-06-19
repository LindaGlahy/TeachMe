import { quizzes, createQuizz, createQuestion } from '../models/quizzModel.js'

const savedQuizzes = JSON.parse(localStorage.getItem("quizzes"))
if (savedQuizzes && Array.isArray(savedQuizzes)) {
    quizzes.length = 0
    savedQuizzes.forEach(q => {
        const newQuiz = createQuizz(q.quizzID, q.quizzName, q.quizzDiscipline, q.studentEmail)
        q.questions.forEach(p => {
            newQuiz.addQuestion(createQuestion(p.id, p.description, ...p.answers, p.correctAnswer, p.time))
        })
        quizzes.push(newQuiz);
    })
}

const loginSection = document.getElementById("loginSection")
const professorSection = document.getElementById("professorSection")
const alunoSection = document.getElementById("alunoSection")
const loginForm = document.getElementById("loginForm")
const quizzesContainer = document.getElementById("quizzesContainer")
const quizListContainer = document.getElementById("quizListContainer")
const quizForm = document.getElementById("quizForm")
const resultContainer = document.getElementById("resultContainer")
const editarQuizModal = new bootstrap.Modal(document.getElementById("editarQuizModal"))
const editarQuizForm = document.getElementById("editarQuizForm")
const perguntasContainer = document.getElementById("perguntasContainer")
const adicionarPerguntaBtn = document.getElementById("adicionarPerguntaBtn")
const guardarAlteracoesBtn = document.getElementById("guardarAlteracoesBtn")

let loggedUser = null
let currentQuizz = null
let currentStudentEmail = null

document.addEventListener("DOMContentLoaded", () => {
    loggedUser = JSON.parse(localStorage.getItem("loggedUser"))

    if (!loggedUser) {
        alert("Por favor faça login primeiro.")
        window.location.href = "../../index.html"
        return
    }

    if (loggedUser.role === "teacher") {
        showTeacherLogin()
    } else if (loggedUser.role === "student") {
        showStudentPanel()
    }
});

function showTeacherLogin() {
    loginSection.classList.remove("d-none")
    professorSection.classList.add("d-none")
    alunoSection.classList.add("d-none")
}

function showTeacherPanel() {
    loginSection.classList.add("d-none")
    professorSection.classList.remove("d-none")
    alunoSection.classList.add("d-none")

    renderQuizzesForTeacher()
}

function showStudentPanel() {
    loginSection.classList.add("d-none")
    professorSection.classList.add("d-none")
    alunoSection.classList.remove("d-none")

    renderQuizzesForStudent(loggedUser.email)

    const storedStudents = JSON.parse(localStorage.getItem("students")) || []
    const student = storedStudents.find(s => s.email === loggedUser.email)

    if (student) {
        document.getElementById("user-level-progress").textContent = `Pontos: ${student.points || 0}`
    }
}

loginForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const emailAluno = document.getElementById("loginName").value.trim()

    const storedStudents = JSON.parse(localStorage.getItem("students")) || []
    const aluno = storedStudents.find(s => s.email === emailAluno)

    if (!aluno) {
        alert("Aluno não encontrado. Verifique o e-mail.")
        return
    }

    currentStudentEmail = emailAluno
    showTeacherPanel()
    criarNovoQuiz(emailAluno)
})

function criarNovoQuiz(studentEmail) {
    if (quizzes.some(q => q.studentEmail === studentEmail)) {
        alert("Este aluno já tem um quizz atribuído.")
        return
    }

    const newQuizzID = Date.now()
    const novoQuiz = createQuizz(newQuizzID, "Título do Quizz", "Exemplo da disciplina", studentEmail)

    currentQuizz = novoQuiz
    quizzes.push(novoQuiz)
    localStorage.setItem("quizzes", JSON.stringify(quizzes))

    renderQuizzesForTeacher()
    openEditarQuizModal(novoQuiz)
}

function renderQuizzesForTeacher() {
    quizzesContainer.innerHTML = ""

    const teacherQuizzes = quizzes.filter(q => q.studentEmail === currentStudentEmail)

    if (teacherQuizzes.length === 0) {
        quizzesContainer.innerHTML = "<p>Nenhum quizz criado para este aluno.</p>"
        return
    }

    teacherQuizzes.forEach(quizz => {
        const card = document.createElement("div")
        card.classList.add("card", "p-3", "mb-2")
        card.innerHTML = `
            <h5>${quizz.quizzName}</h5>
            <p>Disciplina: ${quizz.quizzDiscipline}</p>
            <button class="btn btn-primary btn-sm editar-btn" data-id="${quizz.quizzID}">Editar Quiz</button>
            <button class="btn btn-danger btn-sm apagar-btn" data-id="${quizz.quizzID}">Apagar Quiz</button>
        `
        quizzesContainer.appendChild(card)
    })

    document.querySelectorAll(".editar-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id)
            const quiz = quizzes.find(q => q.quizzID === id)
            if (quiz) openEditarQuizModal(quiz)
        })
    })

    document.querySelectorAll(".apagar-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(e.target.dataset.id)
            const index = quizzes.findIndex(q => q.quizzID === id)
            if (index !== -1) {
                quizzes.splice(index, 1)
                localStorage.setItem("quizzes", JSON.stringify(quizzes))
                renderQuizzesForTeacher()
                alert("Quizz apagado com sucesso!")
            }
        })
    })
}

function openEditarQuizModal(quizz) {
    currentQuizz = quizz

    document.getElementById("quizTitulo").value = quizz.quizzName || ""
    document.getElementById("quizDescricao").value = quizz.quizzDiscipline || ""
    renderPerguntas(quizz.questions)

    editarQuizModal.show()
}

function renderPerguntas(perguntas) {
    perguntasContainer.innerHTML = ""

    perguntas.forEach((q, i) => {
        const perguntaDiv = document.createElement("div")
        perguntaDiv.classList.add("mb-3", "border", "p-3")
        perguntaDiv.innerHTML = `
            <label class="form-label">Pergunta ${i + 1}</label>
            <input type="text" class="form-control pergunta-desc" value="${q.description}" placeholder="Descrição da pergunta" required>

            <label class="form-label mt-2">Respostas:</label>
            <input type="text" class="form-control resposta" data-index="0" value="${q.answers[0]}" placeholder="Resposta 1" required>
            <input type="text" class="form-control resposta" data-index="1" value="${q.answers[1]}" placeholder="Resposta 2" required>
            <input type="text" class="form-control resposta" data-index="2" value="${q.answers[2]}" placeholder="Resposta 3" required>
            <input type="text" class="form-control resposta" data-index="3" value="${q.answers[3]}" placeholder="Resposta 4" required>

            <label class="form-label mt-2">Resposta correta (0 a 3):</label>
            <input type="number" class="form-control resposta-correta" min="0" max="3" value="${q.correctAnswer}" required>

            <label class="form-label mt-2">Tempo (segundos):</label>
            <input type="number" class="form-control tempo" min="5" value="${q.time}" required>
        `
        perguntasContainer.appendChild(perguntaDiv)
    })
}

adicionarPerguntaBtn.addEventListener("click", () => {
    currentQuizz.addQuestion(createQuestion(
        currentQuizz.questions.length + 1,
        "",
        "",
        "",
        "",
        "",
        0,
        30
    ))
    renderPerguntas(currentQuizz.questions)
})

guardarAlteracoesBtn.addEventListener("click", (e) => {
    e.preventDefault()

    currentQuizz.quizzName = document.getElementById("quizTitulo").value.trim()
    currentQuizz.quizzDiscipline = document.getElementById("quizDescricao").value.trim()

    const perguntaDivs = perguntasContainer.querySelectorAll("div.mb-3")
    currentQuizz.questions = []

    perguntaDivs.forEach((div, i) => {
        const description = div.querySelector(".pergunta-desc").value.trim()
        const respostas = Array.from(div.querySelectorAll(".resposta")).map(input => input.value.trim())
        const correctAnswer = parseInt(div.querySelector(".resposta-correta").value)
        const time = parseInt(div.querySelector(".tempo").value)

        currentQuizz.addQuestion(createQuestion(i + 1, description, ...respostas, correctAnswer, time))
    })

    localStorage.setItem("quizzes", JSON.stringify(quizzes))

    editarQuizModal.hide()
    renderQuizzesForTeacher()
    alert("Quizz guardado com sucesso!")
})

function renderQuizzesForStudent(studentEmail) {
    quizListContainer.innerHTML = ""

    const studentQuizzes = quizzes.filter(q => q.studentEmail === studentEmail)

    if (studentQuizzes.length === 0) {
        quizListContainer.innerHTML = "<p>Ainda ainda não tens quizzes atribuídos.</p>"
        return
    }

    studentQuizzes.forEach((quiz) => {
        const card = document.createElement("div")
        card.classList.add("card", "p-3", "mb-3")
        card.innerHTML = `
            <h5>${quiz.quizzName}</h5>
            <p>${quiz.quizzDiscipline}</p>
            <button class="btn btn-primary btn-sm" onclick="startQuiz(${quiz.quizzID})">Fazer Quiz</button>
        `
        quizListContainer.appendChild(card)
    })
}

window.startQuiz = function(quizzID) {
    const quiz = quizzes.find(q => q.quizzID === quizzID)
    if (!quiz) {
        alert("Quizz não encontrado.")
        return
    }

    quizForm.innerHTML = ""
    resultContainer.classList.add("d-none")

    quiz.questions.forEach((q, i) => {
        const perguntaDiv = document.createElement("div")
        perguntaDiv.classList.add("mb-3")
        perguntaDiv.innerHTML = `
            <p><strong>Pergunta ${i + 1}:</strong> ${q.description}</p>
            ${q.answers.map((ans, idx) => `
                <div>
                    <input type="radio" name="question${i}" id="q${i}a${idx}" value="${idx}" required>
                    <label for="q${i}a${idx}">${ans}</label>
                </div>
            `).join("")}
        `
        quizForm.appendChild(perguntaDiv)
    })

    const submitBtn = document.createElement("button")
    submitBtn.type = "submit"
    submitBtn.className = "btn btn-success"
    submitBtn.textContent = "Enviar respostas"

    quizForm.appendChild(submitBtn)

    quizForm.onsubmit = (e) => {
    e.preventDefault()
    let score = 0

    quiz.questions.forEach((q, i) => {
        const selected = quizForm.querySelector(`input[name="question${i}"]:checked`)
        if (selected && parseInt(selected.value) === q.correctAnswer) {
            score++
        }
    })

    let earnedPoints = score * 5;
    if (score === quiz.questions.length) {
        earnedPoints += 10
    }

    const storedStudents = JSON.parse(localStorage.getItem("students")) || []
    const student = storedStudents.find(s => s.email === loggedUser.email)

    if (student) {
        student.points = (parseInt(student.points) || 0) + earnedPoints
        localStorage.setItem("students", JSON.stringify(storedStudents))
    }

    resultContainer.textContent = `Acertaste ${score} de ${quiz.questions.length} perguntas. Ganhaste ${earnedPoints} pontos!`
    resultContainer.classList.remove("d-none")

    const inputs = quizForm.querySelectorAll("input[type=radio]")
    inputs.forEach(input => input.disabled = true)

    quizForm.querySelector("button[type=submit]").disabled = true
    }
}


