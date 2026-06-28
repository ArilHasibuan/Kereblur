export async function startWebcam(video) {

    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    });

    video.srcObject = stream;

    await video.play();

    console.log("✅ Webcam aktif");

    return video;
}