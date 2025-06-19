//------------------ IMPORTS ----------------------
import { addAdmin } from "../models/adminModel.js"

//------------------ INICIALIZAR ADMINS ----------------------
const adminsData = JSON.parse(localStorage.getItem("admins")) || []

document.querySelector("#btn-login").addEventListener('click', event => {
  event.preventDefault()

  const email = document.getElementById("login-email").value.trim()
  const password = document.getElementById("login-password").value

  if (!email || !password) {
    alert("Por favor, preencha todos os campos obrigatórios.")
    return
  }

  const admin = adminsData.find(a => a.email === email && a.password === password);

  if (admin) {
    localStorage.setItem("loggedUser", JSON.stringify({ ...admin, role: "admin" }))
    alert(`Bem-vindo, ${admin.name}!`)
    window.location.href = "../../html/admin/admin.html"; 
  } else {
    alert("Email ou palavra-passe inválidos.")
  }
})

const loggedUser = JSON.parse(localStorage.getItem("loggedUser"))
if (loggedUser) {
  const loginBtn = document.getElementById("login-btnView")
  if (loginBtn) loginBtn.style.display = "none"
}
