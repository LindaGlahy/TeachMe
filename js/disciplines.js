document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os elementos de disciplina
    const disciplineItems = document.querySelectorAll('.rectangle2');
    
    // Mapeamento de disciplinas para URLs
    const disciplineUrls = {
        'Português': 'português',
        'Matemática': 'matemática',
        'Física e Química': 'física-química',
        'Geologia': 'geologia',
        'História': 'história',
        'Geografia': 'geografia',
        'Inglês': 'inglês',
        'Francês': 'francês',
        'Biologia': 'biologia'
    };

    // Adiciona event listener a cada disciplina
    disciplineItems.forEach(item => {
        item.addEventListener('click', function() {
            const disciplineName = this.textContent.trim();
            const urlFriendly = disciplineUrls[disciplineName] || disciplineName.toLowerCase().replace(/ /g, '-');
            window.location.href = `teacherResult.html?disciplina=${encodeURIComponent(urlFriendly)}`;
        });
    });
});