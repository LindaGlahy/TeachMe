document.addEventListener("DOMContentLoaded", () => {
    const vrRoomInput = document.getElementById("vrRoom");
    const roomPasswordInput = document.getElementById("roomPassword");

    if (vrRoomInput && roomPasswordInput) {
        [vrRoomInput, roomPasswordInput].forEach(input => {
            input.addEventListener("keydown", function(event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    handleVirtualRoomAccess();
                }
            });
        });
    } else {
        console.warn("Os inputs da sala ou password não foram encontrados no DOM.");
    }
});

function handleVirtualRoomAccess() {
    const vrRoomInput = document.getElementById("vrRoom");
    const roomPasswordInput = document.getElementById("roomPassword");

    if (!vrRoomInput || !roomPasswordInput) {
        alert("Os campos da sala ou da palavra-passe não foram encontrados.");
        return;
    }

    const vrRoom = vrRoomInput.value.trim();
    const roomPassword = roomPasswordInput.value.trim();

    console.log(`Sala: ${vrRoom} e Palavra-passe: ${roomPassword}`);

    if (vrRoom && roomPassword) {
        alert(`A entrar na sala ${vrRoom} com a palavra-passe ${roomPassword}`);
        window.location.href = `../../html/VR/VirtualRealityClassroom.html?sala=${encodeURIComponent(vrRoom)}&pass=${encodeURIComponent(roomPassword)}`;
    } else {
        alert("Preencha a sala e a palavra-passe correctamente!");
    }
}
