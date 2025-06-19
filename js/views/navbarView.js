const loggedUser = JSON.parse(localStorage.getItem("loggedUser"))

const loginBtnView = document.getElementById("login-btnView")

if (loggedUser) {
  if (loginBtnView) {
    loginBtnView.style.display = "none"
  }
} else {
  if (loginBtnView) {
    loginBtnView.style.display = "inline-block"
  }
}
