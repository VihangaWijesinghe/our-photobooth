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

let currentChannel = null;


// ============================
// CREATE ROOM
// ============================

createRoomButton.addEventListener("click", async () => {

    const roomCode = generateRoomCode();

    roomCodeDisplay.textContent = roomCode;

    roomMenu.style.display = "none";
    roomInfo.style.display = "block";

    roomStatus.textContent =
        "Creating room...";

    currentChannel =
        supabaseClient.channel("room-" + roomCode, {
            config: {
                broadcast: {
                    self: false
                }
            }
        });

    currentChannel
        .on("broadcast", { event: "join" }, () => {

            roomStatus.textContent =
                "💕 Both devices connected!";

            // Tell the joining device that
            // the room creator is ready.
            currentChannel.send({
                type: "broadcast",
                event: "creator-ready",
                payload: {
                    message: "Creator is ready!"
                }
            });

        })
        .subscribe((status) => {

            if (status === "SUBSCRIBED") {

                roomStatus.textContent =
                    "Waiting for the other person...";

            }

        });
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
        "Connecting...";

    currentChannel =
        supabaseClient.channel("room-" + roomCode, {
            config: {
                broadcast: {
                    self: false
                }
            }
        });

    currentChannel
        .on("broadcast", { event: "creator-ready" }, () => {

            roomStatus.textContent =
                "💕 Both devices connected!";

        })
        .subscribe(async (status) => {

            if (status === "SUBSCRIBED") {

                roomStatus.textContent =
                    "Connected! Waiting for host...";

                // Tell the creator that
                // someone joined.
                await currentChannel.send({
                    type: "broadcast",
                    event: "join",
                    payload: {
                        message: "Someone joined!"
                    }
                });

            }

        });

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
