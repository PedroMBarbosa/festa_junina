const video = document.getElementById("video");
const result = document.getElementById("result");
const errorElement = document.getElementById("error");
const actionButton = document.getElementById("actionButton");

let stream = null;
let scanning = false;
let canvas = document.createElement("canvas");
let canvasContext = canvas.getContext("2d");

actionButton.addEventListener("click", toggleCamera);

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
    stopCamera(); // Para qualquer stream existente

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

let ultimoQRCode = "";

function scanQRCode() {
    if (!scanning) return;

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
            // Atualiza o status para "Entrou"
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
            errorElement.textContent = "";
        } else {
            result.innerHTML = "";
            errorElement.textContent = "QR Code não encontrado no banco de dados.";
        }
    } catch (err) {
        console.error(err);
        errorElement.textContent = "Erro ao acessar o banco de dados.";
    }
}

window.addEventListener("beforeunload", stopCamera);
