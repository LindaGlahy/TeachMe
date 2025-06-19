import { createLesson } from '../models/lessonsModel.js';
import { createReview,getReviews } from '../models/reviewModel.js';
import { getTeachers } from '../models/teachersModel.js';
import { addFavouriteTeacher, removeFavouriteTeacher, isTeacherFavourited} from "../models/studentModel.js";


const pointsMap = {
    1: 1,
    2: 3,
    3: 5,
    4: 7,
    5: 10
};

const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

if (loggedUser.role !== "student") {
    const reviewButton = document.getElementById("reviewButton");
    if (reviewButton) {
        reviewButton.style.display = "none";
    }
    const scheduleButton = document.getElementById("scheduleButton");
    if (scheduleButton) {
        scheduleButton.style.display = "none";
    }
    const favoriteButton = document.getElementById("favouriteButton");
    if (favoriteButton) {
        favoriteButton.style.display = "none";
    }
}

let currentProfessor = null;



document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get("id"));
    
        
            const teachers = getTeachers()
            const prof = teachers.find((teacher) => teacher.id === id);
            currentProfessor = prof; // Armazenar o professor atual para uso posterior

            if (!prof) {
                console.error("Professor não encontrado para o ID:", id);
                return;
            }

            // Dados do professor
            // Preencher os dados do professor
            document.querySelector(".teachersInfo-card-header").textContent = prof.name;
            document.querySelectorAll(".teachersInfo-box")[0].textContent = prof.email;
            document.querySelectorAll(".teachersInfo-box")[1].textContent = prof.locality;
            document.querySelectorAll(".teachersInfo-box")[2].textContent = prof.classType;
            document.querySelector(".teacher-profile-img").src = prof.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80";

            // Preencher disciplinas
            const disciplinesList = document.querySelector('.disciplines-list');
            disciplinesList.innerHTML = prof.disciplines.map(d => `<div><i class="fa-solid fa-check-circle"></i>${d}</div>`).join('');

            // Preencher descrição
            document.querySelector('.description-box p').textContent = prof.aboutMe;

            document.addEventListener("DOMContentLoaded", () => {
            const btnVerDiplomas = document.getElementById("viewDiplomasBtn")
            if (btnVerDiplomas) {
                btnVerDiplomas.addEventListener("click", () => {
                if (!prof.diplomes) {
                    alert("Este professor não tem diplomas registados.")
                    return;
                }
                const pdfPath = `../../documents/${prof.diplomes}`
                window.open(pdfPath, "_blank");
                })
            } else {
                console.warn("Botão 'viewDiplomasBtn' não encontrado no DOM");
            }
            })

        
        // Toggle da sidebar em dispositivos móveis
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        const sidebar = document.querySelector('.sidebar');
        
        const ratingBox = document.getElementById('rating-visualizer');
        if (ratingBox) {
            ratingBox.addEventListener('click', function() {
                if (currentProfessor) {
                    window.location.href = `../teacher/teacherReviews.html?id=${currentProfessor.id}`;
                }
            });
        }

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function() {
                sidebar.classList.toggle('active');
            });
        }

        // Função para preencher as disciplinas no modal
        function populateDisciplinesModal() {
            const container = document.getElementById('disciplines-container');
            container.innerHTML = ''; // Limpa o container
            
            if (currentProfessor && currentProfessor.disciplines && currentProfessor.disciplines.length > 0) {
                // Preencher o nome do professor no modal
                document.getElementById('modalTeacherName').textContent = currentProfessor.name;
                
                currentProfessor.disciplines.forEach(discipline => {
                    const div = document.createElement('div');
                    div.className = 'modal-discipline-item d-flex align-items-center';
                    
                    const input = document.createElement('input');
                    input.type = 'checkbox';
                    input.className = 'form-check-input me-2';
                    input.name = 'disciplines';
                    input.value = discipline;
                    input.id = `discipline-${discipline.toLowerCase().replace(/\s+/g, '-')}`;
                    
                    const label = document.createElement('label');
                    label.className = 'form-check-label';
                    label.htmlFor = input.id;
                    label.textContent = discipline;
                    
                    div.appendChild(input);
                    div.appendChild(label);
                    container.appendChild(div);
                });
            } else {
                container.innerHTML = '<p class="text-center text-muted">Nenhuma disciplina disponível</p>';
            }
        }

        // Evento para quando o modal é aberto
        const scheduleModal = document.getElementById('scheduleModal');
        if (scheduleModal) {
            scheduleModal.addEventListener('show.bs.modal', function() {
                populateDisciplinesModal();
            });
        }

        // Evento para envio do formulário
        const scheduleForm = document.getElementById('scheduleForm')
        if (scheduleForm) {
            scheduleForm.addEventListener('submit', function(e) {
                e.preventDefault()
            
                const loggedUser = JSON.parse(localStorage.getItem("loggedUser"))
                if (!loggedUser || loggedUser.role !== "student") {
                    alert("Você precisa estar logado como estudante para marcar aulas")
                    return
                }

                const selectedDisciplines = Array.from(
                document.querySelectorAll('input[name="disciplines"]:checked')
                ).map(input => input.value)
                
                if (selectedDisciplines.length === 0) {
                    alert('Por favor, selecione pelo menos uma disciplina.')
                    return
                }
            
                const classLocation = document.getElementById('classLocation').value
                const date = document.getElementById('date').value
                const time = document.getElementById('time').value
                const observations = document.getElementById('observations').value
                
                // Combinar data e hora
                const dateTime = new Date(`${date}T${time}`)
                
                try {
                createLesson(
                    loggedUser,
                    currentProfessor,
                    dateTime,
                    60, // Duração fixa de 60 minutos
                    selectedDisciplines,
                    classLocation,
                    observations
                )
                
                alert(`Aula marcada com sucesso para: ${dateTime.toLocaleString()}`)
                
                // Fechar o modal
                const modal = bootstrap.Modal.getInstance(scheduleModal)
                modal.hide()
                } catch (error) {
                console.error("Erro ao marcar aula:", error)
                alert("Erro ao marcar aula. Por favor, tente novamente.")
                }
            })
            }

        // Funções para avaliação
        function setupRatingModal() {
            const ratingModal = document.getElementById('ratingModal');
            if (ratingModal) {
                ratingModal.addEventListener('show.bs.modal', function() {
                    if (currentProfessor) {
                        document.getElementById('ratingTeacherName').textContent = currentProfessor.name;
                    }

                    // Resetar estrelas
                    const stars = document.querySelectorAll('#ratingStars i');
                    stars.forEach(star => {
                        star.classList.remove('fas', 'fa-star', 'active');
                        star.classList.add('far', 'fa-star');
                    });
                    document.getElementById('selectedRating').value = 0;
                });
            }

            // Configurar clique nas estrelas
            const stars = document.querySelectorAll('#ratingStars i');
            stars.forEach(star => {
                star.addEventListener('click', function() {
                    const rating = parseInt(this.getAttribute('data-rating'));
                    document.getElementById('selectedRating').value = rating;

                    // Atualizar visualização das estrelas
                    stars.forEach((s, index) => {
                        if (index < rating) {
                            s.classList.remove('far');
                            s.classList.add('fas', 'active');
                        } else {
                            s.classList.remove('fas', 'active');
                            s.classList.add('far');
                        }
                    });
                });
            });

            const ratingForm = document.getElementById('ratingForm');
            if (ratingForm) {
                ratingForm.addEventListener('submit', function(e) {
                    e.preventDefault();

                    const rating = parseInt(document.getElementById('selectedRating').value);
                    if (rating === 0) {
                        alert('Por favor, selecione uma avaliação.');
                        return;
                    }

                    // Calcular pontos baseado na avaliação
                    const pointsToAdd = pointsMap[rating];
                    
                    // Atualizar pontos do professor
                    let teachers = JSON.parse(localStorage.getItem("teachers")) || [];
                    const teacherIndex = teachers.findIndex(t => t.id === currentProfessor.id);
                    
                    if (teacherIndex !== -1) {
                        teachers[teacherIndex].points = (teachers[teacherIndex].points || 0) + pointsToAdd;
                        localStorage.setItem("teachers", JSON.stringify(teachers));
                        
                        // Atualizar currentProfessor para refletir mudanças
                        currentProfessor.points = teachers[teacherIndex].points;
                    }

                    // Criar e salvar a avaliação
                    const comment = document.getElementById('ratingComment').value;
                    createReview(
                        Date.now(), // ID único
                        loggedUser.id, // ID do estudante
                        currentProfessor.id, // ID do professor
                        "Aula Geral", // Poderia ser específica
                        rating,
                        comment
                    );
                    
                    // Fechar o modal
                    const modal = bootstrap.Modal.getInstance(ratingModal);
                    modal.hide();

                    // Resetar o formulário
                    ratingForm.reset();
                    stars.forEach(star => {
                        star.classList.remove('fas', 'active');
                        star.classList.add('far');
                    });
                });
            }
        }

        setupRatingModal();

        // Buscar avaliações
        const reviews = getReviews().filter(r => r.teacher === id);

        // Calcula a média de avaliações
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length || 0;
        
        // Preenche as estrelas da média
        const ratingStars = document.getElementById('main-ratingStars');
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


const teacherId = id; // Obter o ID do professor da página
const loggedUserId = loggedUser.id; // Obter o ID do utilizador logado

const favouriteBtn = document.getElementById("favouriteButton");

// Atualiza o texto do botão conforme o estado
function updateFavouriteButton() {
  if (isTeacherFavourited(loggedUserId, teacherId)) {
    favouriteBtn.textContent = "Remover dos Favoritos";
  } else {
    favouriteBtn.textContent = "Favoritar";
  }
}

// Evento de clique
favouriteBtn.addEventListener("click", () => {
  if (isTeacherFavourited(loggedUserId, teacherId)) {
    removeFavouriteTeacher(loggedUserId, teacherId);
  } else {
    addFavouriteTeacher(loggedUserId, teacherId);
  }
  updateFavouriteButton();
});

// Inicializa o botão ao carregar a página
updateFavouriteButton();
});
