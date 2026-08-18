const createRoomButton =
    document.getElementById("createRoomButton");

const joinRoomButton =
    document.getElementById("joinRoomButton");

const roomCodeInput =
    document.getElementById("roomCodeInput");

const roomMenu =
    document.getElementById("roomMenu");

const roomInfo =
    document.getElementById("roomInfo");

const roomCodeDisplay =
    document.getElementById("roomCode");

const roomStatus =
    document.getElementById("roomStatus");


// ============================
// CREATE ROOM
// ============================

createRoomButton.addEventListener("click", async () => {

    const roomCode = generateRoomCode();

    roomCodeDisplay.textContent = roomCode;

    roomMenu.style.display = "none";
    roomInfo.style.display = "block";

    roomStatus.textContent =
        "Waiting for the other person...";

    await supabaseClient
        .channel("room-" + roomCode)
        .subscribe();
});


// ============================
// JOIN ROOM
// ============================

joinRoomButton.addEventListener("click", async () => {

    const roomCode =
        roomCodeInput.value.trim().toUpperCase();

    if (roomCode.length !== 6) {

        alert("Please enter the 6-character room code.");

        return;
    }

    roomCodeDisplay.textContent = roomCode;

    roomMenu.style.display = "none";
    roomInfo.style.display = "block";

    roomStatus.textContent =
        "Joining room...";

    await supabaseClient
        .channel("room-" + roomCode)
        .subscribe();

    roomStatus.textContent =
        "Connected to room! 💕";
});


// ============================
// GENERATE ROOM CODE
// ============================

function generateRoomCode() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 6; i++) {

        const randomIndex =
            Math.floor(
                Math.random() * characters.length
            );

        code += characters[randomIndex];
    }

    return code;
}