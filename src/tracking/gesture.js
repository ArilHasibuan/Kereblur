function isFingerUp(landmarks, tipIdx, pipIdx) {
    // MediaPipe pakai {x, y, z} bukan [x, y, z]
    return landmarks[tipIdx].y < landmarks[pipIdx].y;
}

export function isVictoryGesture(landmarks) {
    const indexUp   = isFingerUp(landmarks, 8, 6);
    const middleUp  = isFingerUp(landmarks, 12, 10);
    const ringDown  = !isFingerUp(landmarks, 16, 14);
    const pinkyDown = !isFingerUp(landmarks, 20, 18);

    return indexUp && middleUp && ringDown && pinkyDown;
}