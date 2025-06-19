/*------------ LEADERBOARD -------------*/
/*------------------------------------------------*/

// Importando os modelos de dados
import { getStudents } from '../models/studentModel.js';
import { getTeachers } from '../models/teachersModel.js';

let students = getStudents();
let teachers = getTeachers();

// Ordenar alunos por pontos (decrescente)
students.sort((a, b) => b.points - a.points);
// Ordenar professores por pontos (decrescente)
teachers.sort((a, b) => b.points - a.points);

// Pegar top 10 de alunos e professores
const topStudents = students.slice(0, 10);
const topTeachers = teachers.slice(0, 10);

// Definir as leaderboards
const leaderboards = [
  {
    title: "Alunos",
    data: topStudents
  },
  {
    title: "Professores",
    data: topTeachers
  }
];

let current = 0;

function renderLeaderboard(index) {
  const container = document.getElementById("leaderboard-container");
  const lb = leaderboards[index];

  const podium = `
    <div class="leaderboard-title text-center">${lb.title}</div>
    <div class="row justify-content-center text-center mb-4">
      <div class="col-md-4">
        <div class="leaderboard-circle gold position-relative">
          <p>1º<br>${lb.data[0]?.name || 'N/A'}<br>${lb.data[0]?.points || '0'} pts</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="leaderboard-circle silver">
          <p>2º<br>${lb.data[1]?.name || 'N/A'}<br>${lb.data[1]?.points || '0'} pts</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="leaderboard-circle bronze">
          <p>3º<br>${lb.data[2]?.name || 'N/A'}<br>${lb.data[2]?.points || '0'} pts</p>
        </div>
      </div>
    </div>
  `;

  const list = lb.data.map((user, i) => `
    <li class="list-group-item">
      <span><strong>${i + 1}</strong> <i class="fa ${i < 3 ? 'fa-solid' : 'fa-user'} user-icon"></i> ${user.name}</span>
      <span>${user.points} pts</span>
    </li>
  `).slice(3).join("");

  container.innerHTML = `
    ${lb.data.length >= 3 ? podium : `<div class="leaderboard-title text-center">${lb.title}</div>`}
    <div class="leaderboard-box mt-4">
      <ul class="list-group">
        ${list || '<li class="list-group-item">Sem dados disponíveis</li>'}
      </ul>
    </div>
  `;
}

// Funções para navegar entre as leaderboards
document.getElementById("next-btn").addEventListener("click", nextLeaderboard);
document.getElementById("previous-btn").addEventListener("click", prevLeaderboard);

function nextLeaderboard() {
  current = (current + 1) % leaderboards.length;
  renderLeaderboard(current);
}

function prevLeaderboard() {
  current = (current - 1 + leaderboards.length) % leaderboards.length;
  renderLeaderboard(current);
}

document.addEventListener("DOMContentLoaded", () => renderLeaderboard(current));