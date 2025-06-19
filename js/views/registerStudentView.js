//------------------ IMPORTS ----------------------
import { getStudents, addStudent } from "../models/studentModel.js"

//------------------ STUDENT REGISTER ----------------------
const storedStudents = getStudents();
const students = [];
students.length = 0;
students.push(...storedStudents);

document.querySelector("#btn-registerStudent").addEventListener('click', event => {
    event.preventDefault();

    const name = document.getElementById('reg-name-student').value;
    const email = document.getElementById('reg-email-student').value;
    const password = document.getElementById('reg-password-student').value.trim();
    const grade = document.getElementById('reg-grade-student').value;
    const EEcontact = Number(document.getElementById('reg-EEcontact-student').value);
    const incapacity = document.getElementById('reg-incapacity-student').value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const dateOfBirth = document.getElementById('reg-dateOfBirth-student').value;
    const locality = document.getElementById('reg-localization-student').value;
    const aboutMe = document.getElementById('reg-aboutMe-student').value;

    const disciplineCheckboxes = document.querySelectorAll('.disciplines-grid2 input[type="checkbox"]');
    const disciplines = [];
    disciplineCheckboxes.forEach(cb => {
        if (cb.checked) disciplines.push(cb.parentElement.textContent.trim());
    });

    // Validações
    if (!name || !email || !password || !grade || !gender || !dateOfBirth || !locality) {
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

    if (age < 9 || age > 18) {
        alert("A idade do aluno deve ser entre 9 e 18 anos.");
        return;
    }

    if (students.some(s => s.email === email)) {
        alert("Esse email já existe.");
        return;
    }

    const maxId = students.reduce((max, s) => s.id > max ? s.id : max, 0);
    const id = maxId + 1;

    const student = addStudent({
        id,
        name,
        email,
        password,
        grade,
        EEcontact,
        incapacity,
        gender,
        dateOfBirth,
        locality,
        disciplines,
        aboutMe,
        points: 0,
        priority: 1
    });

    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));

    console.log("O aluno:", student, "foi registado com sucesso.");
    alert(`O aluno ${student.name} foi registado com sucesso.`);

    window.location.href = '../../html/main/login.html';

    // Reset ao formulário (não executado por causa do redirect, mas está aqui por segurança)
    document.getElementById('reg-name-student').value = '';
    document.getElementById('reg-email-student').value = '';
    document.getElementById('reg-password-student').value = '';
    document.getElementById('reg-grade-student').value = '';
    document.getElementById('reg-EEcontact-student').value = '';
    document.getElementById('reg-incapacity-student').value = '';
    document.querySelectorAll('input[name="gender"]').forEach(radio => radio.checked = false);
    document.getElementById('reg-dateOfBirth-student').value = '';
    document.getElementById('reg-localization-student').value = '';
    document.getElementById('reg-aboutMe-student').value = '';
    document.querySelectorAll('.disciplines-grid2 input[type="checkbox"]').forEach(cb => cb.checked = false);
});
