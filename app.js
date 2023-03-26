function createPixel(width, height) {
    const pixel = document.createElement("div");
    pixel.style.width = `${width}%`;
    pixel.style.height = `${height}%`;
    pixel.classList.add("canvas-cell");
    pixel.addEventListener("mouseenter", paintPixel);
    return pixel;
}

function clearAndRepopulateCanvas(numberOfRows, numberOfColumns) {
    clearCanvas();
    populateCanvas(numberOfRows, numberOfColumns);
}

function clearCanvas() {
    canvas.textContent = "";
}

function populateCanvas(numberOfRows, numberOfColumns) {
    const fragment = document.createDocumentFragment();
    const cellPercentageHeight = 100 / numberOfRows;
    const cellPercentageWidth = 100 / numberOfColumns;
    for (let column = 0; column < numberOfColumns; column++) {
        for (let row = 0; row < numberOfRows; row++) {
            const pixel = createPixel(
                cellPercentageHeight,
                cellPercentageWidth
            );
            fragment.append(pixel);
        }
    }
    canvas.append(fragment);
}

function paintPixel() {
    if (mode === "erase") {
        this.style.background = "";
        return;
    }
    this.style.background = "#333";
}

const canvas = document.querySelector(".canvas");
const canvasWidth = canvas.getBoundingClientRect().width;
const canvasRowsN = 72;
const canvasColumnsN = (canvasRowsN * 4) / 3;
clearAndRepopulateCanvas(canvasColumnsN, canvasRowsN);

// #################### MODE ####################
let mode = "draw";
const modeButton = document.querySelector(".option.mode button");

modeButton.addEventListener("click", setMode);

function setMode(event) {
    mode = mode === "draw" ? "erase" : "draw";
    event.currentTarget.textContent = mode;
}
