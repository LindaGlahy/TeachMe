import { getStudentLessons } from '../../js/models/lessonsModel.js';

const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

if (!loggedUser || loggedUser.role !== "student") {
    window.location.href = "../../html/login/login.html";
} else {
    document.getElementById("user-greeting").textContent = loggedUser.name;
    loadStudentLessons();
}

async function loadStudentLessons() {
    const lessons = getStudentLessons(loggedUser.id);
    
    renderLessons(
        lessons.filter(l => l.state === "accepted"),
        document.getElementById("scheduled-lessons-container"),
        true
    );
    
    renderLessons(
        lessons.filter(l => l.state === "pending"),
        document.getElementById("pending-lessons-container"),
        false
    );
}

function renderLessons(lessons, container, isScheduled) {
    container.innerHTML = "";
    
    if (lessons.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="${isScheduled ? 8 : 6}" class="text-center py-4">
                    ${isScheduled ? "Nenhuma aula marcada" : "Nenhum pedido pendente"}
                </td>
            </tr>
        `;
        return;
    }
    
    lessons.forEach(lesson => {
        const lessonDate = new Date(lesson.dateTime);
        const formattedDate = lessonDate.toLocaleDateString("pt-PT");
        const formattedTime = lessonDate.toLocaleTimeString("pt-PT", {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const row = document.createElement("tr");
        row.className = "lesson-row";
        
        row.innerHTML = `
            <td>${lesson.teacher.name}</td>
            <td>${lesson.disciplines.join(", ")}</td>
            <td>${lesson.location}</td>
            <td>${formattedDate}</td>
            <td>${formattedTime}</td>
            <td>${lesson.teacher.id}</td>
            <td>${lesson.id}</td>
            ${isScheduled ? `
                <td class="text-center">
                    <button class="btn btn-outline-danger btn-sm cancel-btn" data-id="${lesson.id}">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </td>
            ` : `
                <td class="text-center">
                    <span class="badge bg-warning text-dark">Pendente</span>
                </td>
            `}
            
        `;
        
        container.appendChild(row);
    });
    
    // Event listeners para cancelamento
    if (isScheduled) {
        container.querySelectorAll(".cancel-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const lessonId = parseInt(this.dataset.id);
                cancelLesson(lessonId);
            });
        });
    }
}

function cancelLesson(lessonId) {
    const lessons = JSON.parse(localStorage.getItem("lessons")) || [];
    const index = lessons.findIndex(l => l.id === lessonId);
    
    if (index !== -1) {
        if (confirm("Tem certeza que deseja cancelar esta aula?")) {
            lessons.splice(index, 1);
            localStorage.setItem("lessons", JSON.stringify(lessons));
            showToast("Aula cancelada com sucesso!");
            loadStudentLessons();
        }
    }
}

function showToast(message, isSuccess = true) {
    const toastContainer = document.getElementById("toast-container") || createToastContainer();
    const toast = document.createElement("div");
    
    toast.className = `toast show ${isSuccess ? 'bg-success' : 'bg-danger'}`;
    toast.innerHTML = `
        <div class="toast-body text-white">
            <div class="d-flex justify-content-between">
                <span>${message}</span>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement("div");
    container.id = "toast-container";
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.right = "20px";
    container.style.zIndex = "1100";
    container.style.minWidth = "250px";
    document.body.appendChild(container);
    return container;
}

document.addEventListener("DOMContentLoaded", function () {
            const options = {
                "option-clothing": {
                    show: ["duckling-clothes", "type-clothing"],
                    hide: ["duckling-colors", "type-color", "duckling-head", "type-head", "duckling-accessory", "type-accessory"]
                },
                "option-color": {
                    show: ["duckling-colors", "type-color"],
                    hide: ["duckling-clothes", "type-clothing", "duckling-head", "type-head", "duckling-accessory", "type-accessory"]
                },
                "option-head": {
                    show: ["duckling-head", "type-head"],
                    hide: ["duckling-colors", "type-color", "duckling-clothes", "type-clothing", "duckling-accessory", "type-accessory"]
                },
                "option-accessory": {
                    show: ["duckling-accessory", "type-accessory"],
                    hide: ["duckling-colors", "type-color", "duckling-clothes", "type-clothing", "duckling-head", "type-head"]
                }
            };

            const ducklingType = document.getElementById("duckling-type");
            if (!ducklingType) return;

            ducklingType.addEventListener("click", function (e) {
                const clickedId = e.target.id;
                if (!options[clickedId]) return;

                const { show, hide } = options[clickedId];

                show.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.hidden = false;
                });

                hide.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.hidden = true;
                });
            });
        });

        document.querySelectorAll('.duckling-options-item').forEach(item => {
            item.addEventListener('click', () => {
                const idParts = item.id.split('-');
                const type = idParts[0];  // "color", "clothing", "head", "accessory"
                const index = idParts[1]; // "1", "2", etc.

                // Esconde todos os elementos da categoria selecionada
                document.querySelectorAll(`[id^="option-${type}-"]`).forEach(opt => {
                    opt.hidden = true;
                });

                // Mostra o selecionado
                const selectedOption = document.getElementById(`option-${type}-${index}`);
                if (selectedOption) {
                    selectedOption.hidden = false;
                }
            });
        });

        document.addEventListener("DOMContentLoaded", () => {
            const categories = ["color", "clothing", "head", "accessory"];

            function applyChoice(type, index) {
                // Mostrar no preview (lado direito)
                document.querySelectorAll(`[id^="option-${type}-"]`).forEach(el => el.hidden = true);
                const previewEl = document.getElementById(`option-${type}-${index}`);
                if (previewEl) previewEl.hidden = false;

                // Mostrar no style-view-container (lado esquerdo do pato)
                const viewEl = document.getElementById(`duckling-${type}-choice`);
                if (!viewEl || !previewEl) return;

                viewEl.hidden = false;

                // Aplica cor de fundo ou conteúdo visual
                const bgColor = previewEl.style.backgroundColor;
                if (bgColor) {
                    viewEl.style.background = bgColor;
                    viewEl.innerHTML = "";
                } else {
                    viewEl.style.background = "none";
                    viewEl.innerHTML = previewEl.innerHTML;
                }
            }

            // Aplica escolhas guardadas no reload
            categories.forEach(type => {
                const savedIndex = localStorage.getItem(`duckling-${type}`);
                if (savedIndex) {
                    applyChoice(type, savedIndex);
                }

            });

            // Guarda novas escolhas
            document.querySelectorAll(".duckling-options-item").forEach(item => {
                item.addEventListener("click", () => {
                    const [type, index] = item.id.split("-");
                    localStorage.setItem(`duckling-${type}`, index);
                    applyChoice(type, index);
                });
            });

            // Botão de voltar
            document.getElementById("back-button")?.addEventListener("click", () => {
                const styleSection = document.getElementById("students-duckling-style");
                const buttonsSection = document.getElementById("style-back-save-buttons");

                if (styleSection) styleSection.hidden = true;
                if (buttonsSection) buttonsSection.hidden = true;
            });

            // Função para mostrar mensagem de sucesso
            function showSaveMessage() {
                let msg = document.getElementById("save-success-msg");

                if (!msg) {
                    msg = document.createElement("div");
                    msg.id = "save-success-msg";
                    msg.textContent = "Alterações salvas com sucesso!";
                    msg.style.position = "fixed";
                    msg.style.bottom = "20px";
                    msg.style.right = "20px";
                    msg.style.backgroundColor = "#4caf50";
                    msg.style.color = "white";
                    msg.style.padding = "10px 20px";
                    msg.style.borderRadius = "8px";
                    msg.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
                    msg.style.zIndex = "9999";
                    document.body.appendChild(msg);
                }

                msg.style.display = "block";
                setTimeout(() => {
                    msg.style.display = "none";
                }, 3000);
            }
        });
