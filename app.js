function createCell(pixelPercentageSize) {
    const pixel = document.createElement("div");
    pixel.style.width = `${pixelPercentageSize}%`;
    pixel.style.height = `${pixelPercentageSize}%`;
    pixel.classList.add("canvasCell");
    return pixel;
}

function clearAndRepopulateCanvas(resolution) {
    clearCanvas();
    populateCanvas(resolution);
}

function clearCanvas() {
    canvas.textContent = "";
}

function populateCanvas(resolution) {
    const fragment = document.createDocumentFragment();
    const totalCellsNumber = resolution ** 2;
    const cellPercentageSize = 100 / canvasResolutionInPixels;
    for (let column = 0; column < totalCellsNumber; column++) {
        const pixel = createCell(cellPercentageSize);
        fragment.append(pixel);
    }
    canvas.append(fragment);
}

const canvas = document.querySelector(".canvas");
const canvasWidth = canvas.getBoundingClientRect().width;
const canvasResolutionInPixels = 20;
clearAndRepopulateCanvas(canvasResolutionInPixels);
