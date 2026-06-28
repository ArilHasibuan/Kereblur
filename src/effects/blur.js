let videoEl = null;
let blurEnabled = false;
let bwEnabled = false;

function applyFilter() {
    if (!videoEl) {
        videoEl = document.getElementById("webcam");
        if (!videoEl) return;
        videoEl.style.transition = "filter .2s ease";
    }

    const filters = [];
    if (bwEnabled) filters.push("grayscale(100%)");
    if (blurEnabled) filters.push("blur(12px)");

    videoEl.style.filter = filters.join(" ");
}

export function setBlur(enable) {
    if (enable === blurEnabled) return;
    blurEnabled = enable;
    applyFilter();
}

export function setBW(enable) {
    bwEnabled = enable;
    applyFilter();
}