// Função para procurar o usuário pelo email e senha
function findUser(email, password) {
  const student = students.find(s => s.email === email && s.password === password);
  if(student) return student;

  const teacher = teachers.find(t => t.email === email && t.password === password);
  if(teacher) return teacher;

  return null;
}

document.querySelector('.btn-login').addEventListener('click', function(event) {
  event.preventDefault(); // para não enviar formulário e recarregar página

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const user = findUser(email, password);

  if(user) {
    // Guardar info do usuário na sessão para usar depois
    sessionStorage.setItem('activeUser', JSON.stringify(user));

    // Redirecionar conforme prioridade
    if(user.priority === 1) {
      window.location.href = '../student/students.html';
    } else if(user.priority === 2) {
      window.location.href = '../teacher/teacher.html';
    } else if(user.priority === 3) {
      window.location.href = '../admin/admin.html';
    }
  } else {
    alert('Credenciais inválidas');
  }
});
