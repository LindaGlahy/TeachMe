const loggedUser = JSON.parse(localStorage.getItem("loggedUser"))

if (!loggedUser) {
  console.log("Utilizador não logado.")
} else {
    const userRoleClass = loggedUser.role + "View" 

    document.querySelectorAll(".menu-items").forEach(menuItem => {
        if (menuItem.classList.contains(userRoleClass)) {
        menuItem.style.display = "block" 
        menuItem.style.cursor = "pointer"
        menuItem.addEventListener("click", () => {
            const url = menuItem.getAttribute("data-url")
            if (url) {
            window.location.href = url
            }
        })
        } else {
        menuItem.style.display = "none"
        }
    })

    const settingsItem = document.getElementById("settingsMenuItem")
    if (settingsItem) {
        settingsItem.addEventListener("click", () => {
        let settingsUrl = "/settingsDefault.html"  

        switch (loggedUser.role) {
            case "student":
            settingsUrl = "../../html/student/settingsStudent.html"
                break
            case "teacher":
            settingsUrl = "../../html/teacher/settingsTeacher.html"
                break
            case "admin":
            settingsUrl = "../../html/admin/settingsAdmin.html"
                break
            }
            window.location.href = settingsUrl
        })
    }

    document.getElementById('menuItemLeaderboards').addEventListener('click', () => {
        window.location.href = "../../html/main/leaderboard.html"
    })

}
