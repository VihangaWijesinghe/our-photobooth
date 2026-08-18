const video = document.getElementById("camera");
const startButton = document.getElementById("startCamera");
const captureButton = document.getElementById("captureButton");
const canvas = document.getElementById("photoCanvas");

const photo1 = document.getElementById("photo1");
const photo2 = document.getElementById("photo2");
const countdown = document.getElementById("countdown");
const finalCanvas = document.getElementById("finalCanvas");
const downloadButton = document.getElementById("downloadButton");

let cameraStream = null;


// ==============================
// START CAMERA
// ==============================

startButton.addEventListener("click", async () => {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });

        video.srcObject = cameraStream;

    } catch (error) {
        console.error("Camera error:", error);
        alert("Please allow camera access.");
    }
});


// ==============================
// TAKE TWO PHOTOS
// ==============================

captureButton.addEventListener("click", async () => {

    if (!cameraStream) {
        alert("Please start the camera first.");
        return;
    }

    // Prevent another click while taking photos
    captureButton.disabled = true;

    // Clear old photos
    photo1.src = "";
    photo2.src = "";

    // --------------------------
    // PHOTO 1
    // --------------------------

    await runCountdown();

    takePhoto(1);

    // Wait before second photo
    await wait(1500);

    // --------------------------
    // PHOTO 2
    // --------------------------

    await runCountdown();

    takePhoto(2);

    // Finished
    countdown.textContent = "💕 Done! 💕";

    captureButton.disabled = false;

    setTimeout(() => {
        countdown.textContent = "";
    }, 1500);
});


// ==============================
// COUNTDOWN
// ==============================

function runCountdown() {

    return new Promise((resolve) => {

        let number = 3;

        countdown.textContent = number;

        const timer = setInterval(() => {

            number--;

            if (number > 0) {

                countdown.textContent = number;

            } else {

                clearInterval(timer);

                countdown.textContent = "📸";

                setTimeout(() => {

                    countdown.textContent = "";

                    resolve();

                }, 500);
            }

        }, 1000);
    });
}


// ==============================
// TAKE PHOTO
// ==============================

function takePhoto(photoNumber) {

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    const imageData = canvas.toDataURL("image/png");

    if (photoNumber === 1) {

    photo1.src = imageData;

    } else if (photoNumber === 2) {

    photo2.src = imageData;

    createFinalPhoto();
    }
}


// ==============================
// WAIT
// ==============================

function wait(milliseconds) {

    return new Promise((resolve) => {

        setTimeout(resolve, milliseconds);

    });
}
function createFinalPhoto() {

    const photoOne = new Image();
    const photoTwo = new Image();

    photoOne.onload = () => {

        photoTwo.onload = () => {

            const width = 800;
            const height = 1200;

            finalCanvas.width = width;
            finalCanvas.height = height;

            const context = finalCanvas.getContext("2d");

            // Background
            context.fillStyle = "#fffaf7";
            context.fillRect(0, 0, width, height);

            // Title
            context.fillStyle = "#5b3942";
            context.font = "bold 42px Arial";
            context.textAlign = "center";

            context.fillText(
                "💕 Our Photobooth 💕",
                width / 2,
                65
            );

            // Photo 1
            context.drawImage(
                photoOne,
                50,
                100,
                700,
                480
            );

            // Photo 2
            context.drawImage(
                photoTwo,
                50,
                610,
                700,
                480
            );

            // Bottom text
            context.fillStyle = "#5b3942";
            context.font = "bold 28px Arial";

            context.fillText(
                "A little memory 📸",
                width / 2,
                1150
            );
        };

        photoTwo.src = photo2.src;
    };

    photoOne.src = photo1.src;
}
downloadButton.addEventListener("click", () => {

    const image = finalCanvas.toDataURL("image/png");

    const link = document.createElement("a");

    link.download = "our-photobooth.png";

    link.href = image;

    link.click();
});