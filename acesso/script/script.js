const videoContainer = document.getElementById("video-container");
const video = document.getElementById("video");
const result = document.getElementById("result");
const errorElement = document.getElementById("error");
const actionButton = document.getElementById("actionButton");
const successMessage = document.getElementById("success-message");
const okButton = document.getElementById("okButton");

let stream = null;
let scanning = false;
let esperandoConfirmacao = false;
let ultimoQRCode = "";
let canvas = document.createElement("canvas");
let canvasContext = canvas.getContext("2d", { willReadFrequently: true });

actionButton.addEventListener("click", toggleCamera);
if (okButton) okButton.addEventListener("click", voltarCamera);

async function toggleCamera() {
    if (stream) {
        stopCamera();
        actionButton.textContent = "Iniciar Câmera";
    } else {
        try {
            await startCamera();
            actionButton.textContent = "Parar Câmera";
            errorElement.textContent = "";
        } catch (err) {
            console.error("Erro:", err);
            errorElement.textContent = "Erro: " + err.message;
        }
    }
}

async function startCamera() {
    stopCamera(); // Garante que não há stream antiga

    stream = await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 1280 }
        }
    });

    video.srcObject = stream;
    await video.play();

    scanning = true;
    esperandoConfirmacao = false;
    requestAnimationFrame(scanQRCode);
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        stream = null;
    }
    scanning = false;
}

function scanQRCode() {
    if (!scanning || esperandoConfirmacao) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        canvas.width = videoWidth;
        canvas.height = videoHeight;

        canvasContext.drawImage(video, 0, 0, videoWidth, videoHeight);

        const imageData = canvasContext.getImageData(0, 0, videoWidth, videoHeight);

        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert"
        });

        if (code && code.data !== ultimoQRCode) {
            ultimoQRCode = code.data;
            esperandoConfirmacao = true;
            verificarQRCode(code.data);
        }
    }

    requestAnimationFrame(scanQRCode);
}

async function verificarQRCode(qrCodeLido) {
    try {
        const response = await fetch(`http://localhost:3030/ingressos`);
        const ingressos = await response.json();

        const ingressoEncontrado = ingressos.find(
            ingresso => ingresso["QR Code"] === qrCodeLido
        );

        if (ingressoEncontrado) {
            await fetch(`http://localhost:3030/ingressos/${ingressoEncontrado.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ Status: "Entrou" })
            });

            result.innerHTML = `
                <strong>QR Code:</strong> ${qrCodeLido}<br>
                <strong>Status:</strong> Entrou
            `;

            mostrarMensagemEntradaAutorizada();
        } else {
            result.innerHTML = "";
            errorElement.textContent = "QR Code não encontrado no banco de dados.";
            esperandoConfirmacao = false; // libera novamente a leitura
        }
    } catch (err) {
        console.error(err);
        errorElement.textContent = "Erro ao acessar o banco de dados.";
        esperandoConfirmacao = false;
    }
}

function mostrarMensagemEntradaAutorizada() {
    stopCamera();
    videoContainer.style.display = "none";
    successMessage.style.display = "block";
}

function voltarCamera() {
    successMessage.style.display = "none";
    videoContainer.style.display = "block";
    startCamera();
    result.innerHTML = "";
    errorElement.textContent = "";
    ultimoQRCode = "";
    esperandoConfirmacao = false;
}

window.addEventListener("beforeunload", stopCamera);
