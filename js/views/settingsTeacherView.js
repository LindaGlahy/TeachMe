const loggedUser = JSON.parse(localStorage.getItem("loggedUser"))

if (!loggedUser) {
    window.location.href = "../../html/login/login.html"
} else if (loggedUser.role !== "teacher") {
    if (loggedUser.role === "student") {
        window.location.href = "../../html/student/students.html"
    } else {
        window.location.href = "../../html/login/login.html"
    }
} else {
    document.getElementById("user-greeting").textContent = loggedUser.name || ""
    document.getElementById("email").value = loggedUser.email || ""
    document.getElementById("password").value = loggedUser.password || ""
    document.getElementById("locality").value = loggedUser.locality  || ""
    document.getElementById("price").value = loggedUser.price || ""  
    let incapacityValue = loggedUser.incapacity;

    if (incapacityValue.toLowerCase() === "no") {
        incapacityValue = "Não"
    } else if (incapacityValue.toLowerCase() === "yes" || incapacityValue.toLowerCase() === "sim") {
        incapacityValue = "Sim"
    }
    document.getElementById("incapacity").value = incapacityValue
}

const disciplineCheckboxes = document.querySelectorAll('.settingsTeacher-container .disciplines-grid2 input[type="checkbox"]')

loggedUser.disciplines.forEach(discipline => {
    disciplineCheckboxes.forEach(cb => {
        const labelText = cb.parentElement.textContent.trim().toLowerCase()
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

            let teachers = JSON.parse(localStorage.getItem('teachers')) || []
            const index = teachers.findIndex(t => String(t.id) === String(loggedUser.id))
            if (index !== -1) {
                teachers[index].photo = base64String
                localStorage.setItem('teachers', JSON.stringify(teachers))
            }
        }
        reader.readAsDataURL(file);
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
    let teachers = JSON.parse(localStorage.getItem('teachers')) || []

    loggedUser.email = document.getElementById('email').value
    loggedUser.password = document.getElementById('password').value
    loggedUser.incapacity = document.getElementById('incapacity').value
    loggedUser.locality = document.getElementById('locality').value
    loggedUser.price = document.getElementById('price').value 
    localStorage.setItem('loggedUser', JSON.stringify(loggedUser))

    const index = teachers.findIndex(t => String(t.id) === String(loggedUser.id))

    if (index !== -1) {
      teachers[index].email = loggedUser.email
      teachers[index].password = loggedUser.password
      teachers[index].incapacity = loggedUser.incapacity
      teachers[index].locality = loggedUser.locality
      teachers[index].price = loggedUser.price 
      localStorage.setItem('teachers', JSON.stringify(teachers))
    } else {
      alert('Erro: professor não foi encontrado.')
      return
    }

    alert('Alterações guardadas com sucesso!')
  }
})

const changeDisciplinesCheckboxs = document.getElementById('btn-saveDesciplineSettings')
const changeDisciplinesCheckboxsInputs = document.querySelectorAll('.settingsTeacher-container .disciplines-grid2 input[type="checkbox"]')

changeDisciplinesCheckboxs.addEventListener('click', () => {
  let loggedUser = JSON.parse(localStorage.getItem('loggedUser')) || {}
  let teachers = JSON.parse(localStorage.getItem('teachers')) || []

  const selectedDisciplines = []
  changeDisciplinesCheckboxsInputs.forEach(cb => {
    if (cb.checked) {
      selectedDisciplines.push(cb.parentElement.textContent.trim())
    }
  })

  loggedUser.disciplines = selectedDisciplines
  localStorage.setItem('loggedUser', JSON.stringify(loggedUser))

  const index = teachers.findIndex(t => String(t.id) === String(loggedUser.id))
  if (index !== -1) {
    teachers[index].disciplines = selectedDisciplines
    localStorage.setItem('teachers', JSON.stringify(teachers))
  } else {
    alert('Erro: professor não foi encontrado.')
    return
  }

  alert('As disciplinas foram guardadas com sucesso!')
})
