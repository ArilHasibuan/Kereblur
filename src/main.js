import "./style.css";
import { startWebcam } from "./camera/webcam";
import { initHandTracking, detectHand } from "./tracking/hand";
import { isVictoryGesture } from "./tracking/gesture";
import { setBlur, setBW } from "./effects/blur";

let webcamActive = false;
let bwMode = false;
let loopRunning = false;

async function start() {
    document.body.innerHTML = `
        <div id="camera-body">
            <div id="top-sensors">
                <div class="sensor-dot"></div>
                <div class="sensor-dot"></div>
            </div>

            <div id="screen-area">
                <div id="model-label">
                    <span>KRL-H616</span>
                    <span>Foto kita blur ~~~</span>
                </div>
                <div id="screen-bezel">
                    <div id="container">
                        <video id="webcam" autoplay playsinline muted></video>
                        <div id="off-screen"></div>
                    </div>
                </div>
                <div id="sony-logo">KEREL</div>
            </div>

            <div id="control-panel">
                <div id="zoom-bar"><span>W</span><span>T</span></div>
                <div id="mode-dial"><div id="mode-dial-inner"></div></div>
                <div id="menu-buttons">
                    <button class="cam-btn" id="btn-off">OFF</button>
                    <button class="cam-btn active" id="btn-on">ON</button>
                </div>
                <div id="dpad" title="Toggle B&W">
                    <span id="dpad-label">Filter</span>
                    <div id="dpad-center"></div>
                </div>
                <div id="bottom-buttons">
                    <div class="small-btn"></div>
                    <div class="small-btn"></div>
                </div>
            </div>
        </div>
    `;

    const video = document.getElementById("webcam");
    const offScreen = document.getElementById("off-screen");
    const btnOn = document.getElementById("btn-on");
    const btnOff = document.getElementById("btn-off");
    const dpad = document.getElementById("dpad");

    btnOn.addEventListener("click", async () => {
        if (webcamActive) return;
        try {
            await startWebcam(video);

            if (!loopRunning) {
                await initHandTracking();
                loopRunning = true;

                await new Promise(resolve => {
                    if (video.videoWidth > 0) return resolve();
                    video.addEventListener("loadedmetadata", resolve, { once: true });
                });

                startLoop(video);
            }

            webcamActive = true;
            offScreen.style.display = "none";
            btnOn.classList.add("active");
            btnOff.classList.remove("active");

        } catch (err) {
            alert("Izin kamera ditolak. Mohon izinkan akses kamera di browser.");
        }
    });

    btnOff.addEventListener("click", () => {
        if (!webcamActive) return;

        const stream = video.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            video.srcObject = null;
        }

        webcamActive = false;
        offScreen.style.display = "flex";
        setBlur(false);
        btnOff.classList.add("active");
        btnOn.classList.remove("active");
    });

    dpad.addEventListener("click", () => {
        bwMode = !bwMode;
        dpad.classList.toggle("bw-active", bwMode);
        setBW(bwMode); // ← pakai setBW, bukan applyVideoFilter
    });
}

function startLoop(video) {
    let lastDetection = 0;
    let lastResult = null;
    const INTERVAL = 50;

    function loop() {
        const now = performance.now();

        if (webcamActive && now - lastDetection >= INTERVAL) {
            lastResult = detectHand(video, now);
            lastDetection = now;
        }

        if (webcamActive && lastResult && lastResult.landmarks.length > 0) {
            setBlur(isVictoryGesture(lastResult.landmarks[0]));
        } else {
            setBlur(false);
        }

        requestAnimationFrame(loop);
    }

    loop();
}

start();