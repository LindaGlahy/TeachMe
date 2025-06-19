// teacherReviewsView.js
import { getReviews } from '../models/reviewModel.js';
import { getTeachers } from '../models/teachersModel.js';
import { getStudents } from '../models/studentModel.js';

const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
console.log(loggedUser);


document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const teacherId = parseInt(urlParams.get("id"));
    
    if (!teacherId) {
        console.error("ID do professor não encontrado na URL");
        return;
    }

    console.log(getReviews());

    // Buscar professor
    const teachers = getTeachers();
    const teacher = teachers.find(t => t.id === teacherId);

    const students = getStudents();
    

    const reviews = getReviews().filter(r => r.teacher === teacherId);
    const student = students.find(s => s.id === reviews.student);
    console.log(reviews);

    
    if (!teacher) {
        console.error("Professor não encontrado");
        return;
    }

    // Preencher cabeçalho
    document.getElementById("teacher-name").textContent = teacher.name;
    document.getElementById("profilePhoto").src = teacher.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80";

    // Buscar avaliações
    
    
    // Calcula a média de avaliações
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length || 0;
    
    // Preenche as estrelas da média
    const ratingStars = document.querySelector('.rating-stars');
    ratingStars.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        star.className = 'fa-solid';
        
        if (i <= Math.floor(averageRating)) {
            star.classList.add('fa-star');
        } else if (i - 0.5 <= averageRating) {
            star.classList.add('fa-star-half-stroke');
        } else {
            star.classList.add('fa-star');
            star.style.color = '#ccc';
        }
        
        ratingStars.appendChild(star);
    }
    
    // Preenche os comentários
    const commentsSection = document.querySelector('.comments-section');
    // Limpa o conteudo estatico
    const exampleComments = commentsSection.querySelectorAll('.comment');
    exampleComments.forEach(c => c.remove());
    
    // Adiciona os comentários
    reviews.forEach(review => {
        const student = students.find(s => s.id === review.student);
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        
        // Formatar data (exemplo simples)
        const timeAgo = formatTimeAgo(new Date(review.date));
        
        commentDiv.innerHTML = `
            <div class="comment-header">
                <div class="comment-user">
                    <img src="'../../images/webapp/student1.png'" alt="Utilizador">
                    ${student.name}
                </div>
                <div class="comment-time">${timeAgo}</div>
            </div>
            <div class="comment-text">
                ${review.comments}
            </div>
            <div class="comment-rating">Avaliado/a com: ${review.rating} <i class="fa-solid fa-star"></i></div>
        `;
        
        commentsSection.appendChild(commentDiv);
    });
});

// Tempod desde que a avaliação foi feita
function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) {
        return `Há ${diffMins} minutos`;
    } else if (diffHours < 24) {
        return `Há ${diffHours} horas`;
    } else {
        return `Há ${diffDays} dias`;
    }
}