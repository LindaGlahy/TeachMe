document.addEventListener("DOMContentLoaded", () => {
    const categories = ["color", "clothing", "head", "accessory"]
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"))

    if (!loggedUser || !loggedUser.email) {
        console.warn("Nenhum utilizador logado. Avatar não carregado.")
        return
    }

    categories.forEach(type => {
        document.querySelectorAll(`[id^="option-${type}-"]`).forEach(el => {
            el.hidden = true
        })
        const viewEl = document.getElementById(`duckling-${type}-choice`)
        if (viewEl) {
            viewEl.hidden = true
            viewEl.style.background = "none"
            viewEl.innerHTML = ""
        }
    })

    function applyChoice(type, index) {
        document.querySelectorAll(`[id^="option-${type}-"]`).forEach(el => el.hidden = true)
        const previewEl = document.getElementById(`option-${type}-${index}`)
        if (previewEl) previewEl.hidden = false

        const viewEl = document.getElementById(`duckling-${type}-choice`)
        if (!viewEl || !previewEl) return

        viewEl.hidden = false

        const bgColor = previewEl.style.backgroundColor
        if (bgColor) {
            viewEl.style.background = bgColor
            viewEl.innerHTML = ""
        } else {
            viewEl.style.background = "none"
            viewEl.innerHTML = previewEl.innerHTML
        }
    }

    categories.forEach(type => {
        const savedIndex = localStorage.getItem(`duckling-${type}-${loggedUser.email}`)
        if (savedIndex) {
            applyChoice(type, savedIndex)
        }
    })

    document.querySelectorAll(".duckling-options-item").forEach(item => {
        item.addEventListener("click", () => {
            const [type, index] = item.id.split("-")
            localStorage.setItem(`duckling-${type}-${loggedUser.email}`, index)
            applyChoice(type, index)
        })
    })

    document.getElementById("save-button")?.addEventListener("click", () => {
        const avatarData = {}
        categories.forEach(type => {
            avatarData[type] = localStorage.getItem(`duckling-${type}-${loggedUser.email}`)
        })

        loggedUser.avatarDuckling = avatarData
        localStorage.setItem("loggedUser", JSON.stringify(loggedUser))
    })
})

window.addEventListener('load', () => {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'))

    if (loggedUser && loggedUser.avatarDuckling) {
        console.log("Avatar duckling carregado:", loggedUser.avatarDuckling)
    }

    if (loggedUser && loggedUser.name) {
        const userGreeting = document.getElementById('user-greeting')
        if (userGreeting) userGreeting.textContent = loggedUser.name
    }
})
