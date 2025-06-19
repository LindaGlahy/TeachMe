//------------------ QUIZZ CLASS ----------------------
//----------------------------------------------------------
class Question {
    constructor(questionID, description, answers, correctAnswer, time) {
        this.questionID = questionID
        this.description = description
        this.answers = answers  
        this.correctAnswer = correctAnswer
        this.time = time
    }
}

class Quizz {
    constructor(quizzID, quizzName, quizzDiscipline, studentEmail = "") {
        this.quizzID = quizzID
        this.quizzName = quizzName
        this.quizzDiscipline = quizzDiscipline
        this.studentEmail = studentEmail
        this.questions = []  
    }

    addQuestion(question) {
        this.questions.push(question)
    }
}

const quizzes = []

function createQuizz(quizzID, quizzName, quizzDiscipline, studentEmail = "") {
    const quizz = new Quizz(quizzID, quizzName, quizzDiscipline, studentEmail)
    quizzes.push(quizz)
    return quizz
}

function createQuestion(questionID, description, answer1, answer2, answer3, answer4, correctAnswer, time) {
    return new Question(
        questionID,
        description,
        [answer1, answer2, answer3, answer4],
        correctAnswer,
        time
    )
}

export { quizzes, createQuizz, createQuestion}
