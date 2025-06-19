const form = document.getElementById("searchForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const disciplina = document.getElementById("disciplina").value.trim();
    const tipo = document.getElementById("tipo").value.trim();
    const local = document.getElementById("local").value.trim();

    window.location.href = `html/main/teacherResult.html?disciplina=${encodeURIComponent(disciplina)}&tipo=${encodeURIComponent(tipo)}&local=${encodeURIComponent(local)}`;
  });
}