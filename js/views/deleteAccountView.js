document.getElementById('btn-DeleteAccount').addEventListener('click', () => {
  const loggedUser = JSON.parse(localStorage.getItem('loggedUser'))

  if (!loggedUser) {
    alert('Nenhum utilizador está logado.')
    return
  }

  let key = ''
  switch (loggedUser.role) {
    case 'student':
      key = 'students'
      break
    case 'teacher':
      key = 'teachers'
      break
    case 'admin':
      key = 'admins'
      break
    default:
      alert('Cargo desconhecido.')
      return
  }

  let users = JSON.parse(localStorage.getItem(key)) || []
  users = users.filter(user => user.id !== loggedUser.id)
  localStorage.setItem(key, JSON.stringify(users))

  localStorage.removeItem('loggedUser')

  alert('A sua conta foi eliminada com sucesso.')

  window.location.href = "../../html/main/login.html"
})
