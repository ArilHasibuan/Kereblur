import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import { MODEL_PATH } from "../config/settings";

let handLandmarker;
let lastTimestamp = -1;

export async function initHandTracking() {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );

    handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: MODEL_PATH,
            delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 1,
    });

    console.log("✅ Hand Landmarker siap");
}

export function detectHand(video, timestamp) {
    if (!handLandmarker) return null;
    if (video.readyState < 2) return null;
    if (timestamp <= lastTimestamp) return null;

    lastTimestamp = timestamp;

    // ← ini yang kurang, kasih imageSize eksplisit
    return handLandmarker.detectForVideo(video, timestamp, {
        imageProcessingOptions: {
            regionOfInterest: {
                left: 0,
                top: 0,
                right: 1,
                bottom: 1,
            }
        }
    });
}