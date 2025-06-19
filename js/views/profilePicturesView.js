window.addEventListener('load', () => {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'))
    
    if (loggedUser && loggedUser.photo) {
        const profilePhoto = document.getElementById('profilePhoto')
        const profilePhoto2 = document.getElementById('profilePhoto2')

        if (profilePhoto) profilePhoto.src = loggedUser.photo
        
        if (profilePhoto2) {
        profilePhoto2.style.backgroundImage = `url(${loggedUser.photo})`
        const icon = profilePhoto2.querySelector('i')
        if (icon) icon.style.color = 'transparent'
        }
    }

    if (loggedUser && loggedUser.name) {
        const userGreeting = document.getElementById('user-greeting')
        if (userGreeting) userGreeting.textContent = loggedUser.name
    }
})
