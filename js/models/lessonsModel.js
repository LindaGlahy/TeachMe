//------------------ LESSONS CLASS ---------------------
//------------------------------------------------------
const getLessons = () => JSON.parse(localStorage.getItem("lessons")) || [];
const saveLessons = (lessons) => localStorage.setItem("lessons", JSON.stringify(lessons));

class Lesson {
  constructor(id, student, teacher, dateTime, durationMinutes, disciplines, location, observations, state = "pending") {
    this.id = id;
    this.student = student;
    this.teacher = teacher;
    this.dateTime = new Date(dateTime);
    this.durationMinutes = durationMinutes;
    this.disciplines = disciplines;
    this.location = location;
    this.observations = observations;
    this.state = state; // pending, accepted, rejected, completed
  }
}

function createLesson(student, teacher, dateTime, durationMinutes, disciplines, location, observations) {
  const lessons = getLessons();
  const id = lessons.length > 0 ? Math.max(...lessons.map(l => l.id)) + 1 : 1;
  
  const lesson = new Lesson(
    id,
    student,
    teacher,
    dateTime,
    durationMinutes,
    disciplines,
    location,
    observations
  );
  
  lessons.push(lesson);
  saveLessons(lessons);
  return lesson;
}

// Função que procura aulas do estudante
function getStudentLessons(studentId) {
  const lessons = getLessons();
  return lessons.filter(lesson => 
    lesson.student.id === studentId &&
    (lesson.state === "accepted" || lesson.state === "pending")
  );
}

// Função que procura aulas do professor
function getTeacherLessons(teacherId) {
  const lessons = getLessons();
  return lessons.filter(lesson => 
    lesson.teacher.id === teacherId &&
    (lesson.state === "pending" || lesson.state === "accepted")
  );
}

// Função para atualizar o estado da aula
function updateLessonState(lessonId, newState) {
  const lessons = getLessons();
  const lessonIndex = lessons.findIndex(l => l.id === lessonId);
  
  if (lessonIndex !== -1) {
    lessons[lessonIndex].state = newState;
    saveLessons(lessons);
    return true;
  }
  return false;
}

// Exportar funções para uso externo
export { createLesson, getStudentLessons, getTeacherLessons, updateLessonState};