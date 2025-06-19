//------------------ IMPORTS ----------------------
import { getTeachers, addTeacher } from "../models/teachersModel.js"

const storedTeachers = getTeachers();
const teachers = [];
teachers.push(...storedTeachers);

//------------------ TEACHER REGISTER ----------------------
document.querySelector("#btn-registerTeacher").addEventListener('click', event => {
    event.preventDefault();

    const name = document.getElementById('reg-name-teacher').value;
    const email = document.getElementById('reg-email-teacher').value;
    const password = document.getElementById('reg-password-teacher').value.trim();
    const incapacity = document.getElementById('reg-incapacity-teacher').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const dateOfBirth = document.getElementById('reg-dateOfBirth-teacher').value;
    const locality = document.getElementById('reg-localization-teacher').value;
    const aboutMe = document.getElementById('reg-aboutMe-teacher').value;

    const fileInput = document.getElementById("fileInput");
    let diplomes = "";

    if (fileInput.files.length > 0) {
        diplomes = fileInput.files[0].name;
    } else {
        alert("Por favor, carregue o diploma do professor.");
        return;
    }

    const disciplineCheckboxes = document.querySelectorAll('.disciplines-grid2 input[type="checkbox"]');
    const disciplines = [];
    disciplineCheckboxes.forEach(cb => {
        if (cb.checked) disciplines.push(cb.parentElement.textContent.trim());
    });

    // Validações
    if (!name || !email || !password || !incapacity || !gender || !dateOfBirth || !locality) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const passwordChar = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordChar.test(password)) {
        alert("A palavra-passe deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas, números e símbolos.");
        return;
    }

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age < 18 || age > 66) {
        alert("A idade do professor deve ser entre 18 e 66 anos.");
        return;
    }

    if (teachers.some(t => t.email === email)) {
        alert("Esse email já existe.");
        return;
    }

    const maxId = teachers.reduce((max, t) => t.id > max ? t.id : max, 0);
    const id = maxId + 1;

    const teacher = addTeacher({
        id,
        name,
        email,
        password,
        incapacity,
        gender,
        dateOfBirth,
        locality,
        diplomes,
        disciplines,
        aboutMe,
        explanationLocal: '',
        classType: 'online',
        price: 0,
        points: 0,
        priority: 2
    });

    teachers.push(teacher);
    localStorage.setItem("teachers", JSON.stringify(teachers));

    console.log("O professor:", teacher, "foi registado com sucesso.");
    alert(`O professor ${teacher.name} foi registado com sucesso.`);

    window.location.href = '../../html/main/login.html';

    // Reset (opcional, não será executado por causa do redirect)
    document.getElementById('reg-name-teacher').value = '';
    document.getElementById('reg-email-teacher').value = '';
    document.getElementById('reg-password-teacher').value = '';
    document.getElementById('reg-incapacity-teacher').value = '';
    document.querySelectorAll('input[name="gender"]').forEach(radio => radio.checked = false);
    document.getElementById('reg-dateOfBirth-teacher').value = '';
    document.getElementById('reg-localization-teacher').value = '';
    document.getElementById('reg-aboutMe-teacher').value = '';
    document.querySelectorAll('.disciplines-grid2 input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.getElementById('fileInput').value = '';
    document.querySelector("#drop-zone p").textContent = "Arraste para aqui ou";
});

//------------------ FILE INPUT + BUTTON ----------------------
document.querySelector(".btn-registerDrop").addEventListener("click", () => {
    document.getElementById("fileInput").click();
});

document.getElementById("fileInput").addEventListener("change", () => {
    const fileInput = document.getElementById("fileInput");
    if (fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        document.querySelector("#drop-zone p").textContent = `Selecionado: ${fileName}`;
    }
});
