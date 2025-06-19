import { getFavouriteTeachers } from "../models/studentModel.js";
import { getTeachers } from "../models/teachersModel.js";

const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
if (!loggedUser || loggedUser.role !== "student") {
    window.location.href = "../../index.html";
}

const loggedUserId = loggedUser.id;

const favouriteTeacherIds = getFavouriteTeachers(loggedUserId);
const allTeachers = getTeachers();

const favouriteTitle = document.getElementById("favourites-title")
favouriteTitle.innerHTML = "Professores Favoritos"

const favouritesContainer = document.querySelector(".grid-container2");
favouritesContainer.innerHTML = "";

const favouriteTeachers = allTeachers.filter(t => favouriteTeacherIds.includes(t.id));

if (favouriteTeachers.length === 0) {
  favouritesContainer.innerHTML = "<p>Nenhum professor favoritado.</p>";
} else {
  favouriteTeachers.forEach(prof => {
    const div = document.createElement("div");
    div.classList.add("rectangle2_2");
    div.style.cursor = "pointer";
    div.innerHTML = `
        <img src="${prof.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'}" alt="${prof.name}">
        <span class="prof-name">${prof.name}</span>
    `;
    div.addEventListener("click", () => {
      window.location.href = `../main/teacherInfo.html?id=${prof.id}`;
    });
    favouritesContainer.appendChild(div);
  });
}