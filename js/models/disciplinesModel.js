//------------------ DISCIPLINES CLASS ----------------------
//----------------------------------------------------------
const currentDisciplines = ['Português' , 'Matemática' , 'Física e Química', 'Geologia' , 'História' , 'Geografia' , 'Inglês' , 'Francês' , 'Biologia']

class Discipline {
    constructor(disciplineName, disciplineTeacher) {
        this.disciplineName = disciplineName;
        this.disciplineTeacher = {
            name: disciplineTeacher.name,
            image: disciplineTeacher.image
        };
    }
}

export {currentDisciplines}
