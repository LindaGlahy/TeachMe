document.getElementById("profilePhoto2").addEventListener('click', () => {
  const loggedUser = JSON.parse(localStorage.getItem('loggedUser'))

  if (!loggedUser) {
    window.location.href = "../../html/main/login.html"
    return
  }

  if (loggedUser.role === "teacher") {
    window.location.href = "../../html/teacher/teacher.html"
  } else if (loggedUser.role === "student") {
    window.location.href = "../../html/student/students.html"
  } else if (loggedUser.role === "admin") {
    window.location.href = "../../html/admin/admin.html"
  } else {

    window.location.href = "../../html/login/login.html"
  }
})
