const loggedUser = JSON.parse(localStorage.getItem("loggedUser"))

if (!loggedUser) {
    window.location.href = "../../html/login/login.html"
} else if (loggedUser.role !== "student") {
    if (loggedUser.role === "teacher") {
        window.location.href = "../../html/teacher/teacher.html"
    } else {
        window.location.href = "../../html/login/login.html"
    }
} else {
    document.getElementById("user-greeting").textContent = loggedUser.name || ""
    document.getElementById("email").value = loggedUser.email || ""
    document.getElementById("password").value = loggedUser.password || ""
    document.getElementById("locality").value = loggedUser.locality || ""
    document.getElementById("EEcontact").value = loggedUser.EEcontact || ""; 
    let incapacityValue = loggedUser.incapacity

    if (incapacityValue.toLowerCase() === "no") {
        incapacityValue = "Não"
    } else if (incapacityValue.toLowerCase() === "yes" || incapacityValue.toLowerCase() === "sim") {
        incapacityValue = "Sim"
    }
    document.getElementById("incapacity").value = incapacityValue
}

const disciplineCheckboxes = document.querySelectorAll('.settingsStudents-container .disciplines-grid2 input[type="checkbox"]')

loggedUser.disciplines.forEach(discipline => {
    disciplineCheckboxes.forEach(cb => {
        const labelText = cb.parentElement.textContent.trim().toLowerCase();
        if (discipline.toLowerCase() === labelText) {
            cb.checked = true
        }
    })
})

document.getElementById("btn-logoutSettings").addEventListener("click", event => {
    event.preventDefault()

    localStorage.removeItem("loggedUser")

    window.location.href = "../../html/main/login.html"
})

const profilePhoto = document.getElementById('profilePhoto')
const profilePhoto2 = document.getElementById('profilePhoto2')
const editIcon = document.querySelector('.profile-header .edit-icon')
const profilePhotoInput = document.getElementById('profilePhotoInput')

editIcon.addEventListener('click', () => {
    profilePhotoInput.click()
})

profilePhotoInput.addEventListener('change', () => {
    const file = profilePhotoInput.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = () => {
            const base64String = reader.result

            profilePhoto.src = base64String
            profilePhoto2.style.backgroundImage = `url(${base64String})`

            const icon = profilePhoto2.querySelector('i')
            if (icon) icon.style.color = 'transparent'

            let loggedUser = JSON.parse(localStorage.getItem('loggedUser')) || {}
            loggedUser.photo = base64String
            localStorage.setItem('loggedUser', JSON.stringify(loggedUser))

            let students = JSON.parse(localStorage.getItem('students')) || []
            const index = students.findIndex(s => String(s.id) === String(loggedUser.id))
            if (index !== -1) {
                students[index].photo = base64String
                localStorage.setItem('students', JSON.stringify(students))
            }
        }
        reader.readAsDataURL(file)
    }
})

window.addEventListener('load', () => {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'))
    if (loggedUser && loggedUser.photo) {
        profilePhoto.src = loggedUser.photo
        profilePhoto2.style.backgroundImage = `url(${loggedUser.photo})`
        const icon = profilePhoto2.querySelector('i')
        if (icon) icon.style.color = 'transparent'
    }
})

const btnChangeSettings = document.getElementById('changeSettings-btn')
const inputs = document.querySelectorAll('.profile-fields input, .profile-fields select')

btnChangeSettings.addEventListener('click', () => {
    const isDisabled = inputs[0].disabled

    if (isDisabled) {
        inputs.forEach(input => input.disabled = false)
        btnChangeSettings.textContent = 'Guardar'
    } else {
        inputs.forEach(input => input.disabled = true)
        btnChangeSettings.textContent = 'Alterar'

        let loggedUser = JSON.parse(localStorage.getItem('loggedUser')) || {}
        let students = JSON.parse(localStorage.getItem('students')) || []

        loggedUser.email = document.getElementById('email').value
        loggedUser.password = document.getElementById('password').value
        loggedUser.incapacity = document.getElementById('incapacity').value
        loggedUser.locality = document.getElementById('locality').value
        loggedUser.EEcontact = document.getElementById('EEcontact').value
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser))

        const index = students.findIndex(s => String(s.id) === String(loggedUser.id))

        if (index !== -1) {
            students[index].email = loggedUser.email
            students[index].password = loggedUser.password
            students[index].incapacity = loggedUser.incapacity
            students[index].locality = loggedUser.locality
            students[index].EEcontact = loggedUser.EEcontact
            localStorage.setItem('students', JSON.stringify(students))
        } else {
            alert('Erro: aluno não foi encontrado.')
            return
        }

        alert('Alterações guardadas com sucesso!')
    }
})

const changeDisciplinesCheckboxs = document.getElementById('btn-saveDesciplineSettings')
const changeDisciplinesCheckboxsInputs = document.querySelectorAll('.settingsStudents-container .disciplines-grid2 input[type="checkbox"]')

changeDisciplinesCheckboxs.addEventListener('click', () => {
    let loggedUser = JSON.parse(localStorage.getItem('loggedUser')) || {}
    let students = JSON.parse(localStorage.getItem('students')) || []

    const selectedDisciplines = []
    changeDisciplinesCheckboxsInputs.forEach(cb => {
        if (cb.checked) {
            selectedDisciplines.push(cb.parentElement.textContent.trim())
        }
    });

    loggedUser.disciplines = selectedDisciplines
    localStorage.setItem('loggedUser', JSON.stringify(loggedUser))

    const index = students.findIndex(s => String(s.id) === String(loggedUser.id))
    if (index !== -1) {
        students[index].disciplines = selectedDisciplines
        localStorage.setItem('students', JSON.stringify(students))
    } else {
        alert('Erro: aluno não foi encontrado.')
        return
    }

    alert('As disciplinas foram guardadas com sucesso!')
})
