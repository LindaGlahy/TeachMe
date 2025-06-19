const storedStudents = JSON.parse(localStorage.getItem("students")) || []
const storedTeachers = JSON.parse(localStorage.getItem("teachers")) || []

document.querySelector("#btn-login").addEventListener('click', event => {
    event.preventDefault()

    const emailLogin = document.getElementById("login-email").value
    const passwordLogin = document.getElementById("login-password").value

    if (!emailLogin || !passwordLogin) {
        alert("Por favor preencha com todos os dados para poder dar login.")
        return
    }

    const student = storedStudents.find(s => s.email === emailLogin && s.password === passwordLogin)
    const teacher = storedTeachers.find(t => t.email === emailLogin && t.password === passwordLogin)

    if (student) {
        alert(`Bem-vindo(a), ${student.name}!`)
        localStorage.setItem("loggedUser", JSON.stringify({
            role: "student",
            ...student
        }))
        window.location.href = "../../html/student/students.html"
    } else if (teacher) {
        alert(`Bem-vindo(a), ${teacher.name}!`)
        localStorage.setItem("loggedUser", JSON.stringify({
            role: "teacher",
            ...teacher
        }))
        window.location.href = "../../html/teacher/teacher.html"
    } else {
        alert("Email ou palavra-passe inválidos.")
    }
})
