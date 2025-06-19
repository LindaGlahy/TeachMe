// Ler usuário logado
const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

if (!loggedUser) {
  window.location.href = "../../html/login/login.html";
} else if (loggedUser.role !== "admin") {
  window.location.href = "../../html/login/login.html";
} else {
  document.getElementById("email").value = loggedUser.email || "";
  document.getElementById("password").value = loggedUser.password || "";

  const greeting = document.getElementById("user-greeting");
  if (greeting) {
    greeting.textContent = `Bem-vindo, ${loggedUser.name || "Admin"}!`;
  }
}

// Logout
document.getElementById("btn-logoutSettings").addEventListener("click", event => {
  event.preventDefault();
  localStorage.removeItem("loggedUser");
  window.location.href = "../../html/main/login.html";
});

// Elementos de foto de perfil
const profilePhoto = document.getElementById('profilePhoto');
const profilePhoto2 = document.getElementById('profilePhoto2');
const editIcon = document.querySelector('.profile-header .edit-icon');
const profilePhotoInput = document.getElementById('profilePhotoInput');

if (editIcon && profilePhotoInput) {
  editIcon.addEventListener('click', () => profilePhotoInput.click());

  profilePhotoInput.addEventListener('change', () => {
    const file = profilePhotoInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        if (profilePhoto) profilePhoto.src = base64String;
        if (profilePhoto2) profilePhoto2.style.backgroundImage = `url(${base64String})`;
        const icon = profilePhoto2?.querySelector('i');
        if (icon) icon.style.color = 'transparent';

        let loggedUser = JSON.parse(localStorage.getItem('loggedUser')) || {};
        loggedUser.photo = base64String;
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

        // Atualizar foto do admin na lista 'admins'
        let admins = JSON.parse(localStorage.getItem('admins')) || [];
        const index = admins.findIndex(admin => admin.email === loggedUser.email);
        if (index !== -1) {
          admins[index].photo = base64String;
          localStorage.setItem('admins', JSON.stringify(admins));
        }
      };
      reader.readAsDataURL(file);
    }
  });
}

// Carregar foto ao abrir a página
window.addEventListener('load', () => {
  const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
  if (loggedUser && loggedUser.photo) {
    if (profilePhoto) profilePhoto.src = loggedUser.photo;
    if (profilePhoto2) {
      profilePhoto2.style.backgroundImage = `url(${loggedUser.photo})`;
      const icon = profilePhoto2.querySelector('i');
      if (icon) icon.style.color = 'transparent';
    }
  }
});

// Botão para alterar dados do admin (email e password)
const btnChangeSettings = document.getElementById('changeSettings-btn');
const inputs = document.querySelectorAll('.profile-fields input[type="email"], .profile-fields input[type="password"]');

if (btnChangeSettings) {
  btnChangeSettings.addEventListener('click', () => {
    const isDisabled = inputs[0]?.disabled;

    if (isDisabled) {
      // Ativar edição
      inputs.forEach(input => input.disabled = false);
      btnChangeSettings.textContent = 'Guardar';
    } else {
      // Guardar alterações
      inputs.forEach(input => input.disabled = true);
      btnChangeSettings.textContent = 'Alterar';

      const newEmail = document.getElementById('email').value;
      const newPassword = document.getElementById('password').value;

      // Ler loggedUser antes da alteração (para pegar o email antigo)
      let loggedUser = JSON.parse(localStorage.getItem('loggedUser')) || {};
      const oldEmail = loggedUser.email;

      // Atualizar loggedUser com dados novos
      loggedUser.email = newEmail;
      loggedUser.password = newPassword;

      // Guardar loggedUser atualizado no localStorage
      localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

      // Atualizar o admin na lista admins
      let admins = JSON.parse(localStorage.getItem('admins')) || [];

      const index = admins.findIndex(admin => admin.email === oldEmail);
      if (index !== -1) {
        admins[index] = {
          ...admins[index],
          email: newEmail,
          password: newPassword,
          photo: loggedUser.photo || admins[index].photo
        };
        localStorage.setItem('admins', JSON.stringify(admins));
      } else {
        console.warn('Admin não encontrado na lista para atualizar.');
      }

      alert('Alterações guardadas com sucesso!');
    }
  });
}
