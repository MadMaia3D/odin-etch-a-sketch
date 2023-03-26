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
    if (inputMethod === "click" && isMouseClicked === false) {
        return;
    }
    if (mode === "erase") {
        this.style.background = "";
        return;
    }

    let paintColor = "";
    if (colorMode === "classic") paintColor = classicColor;
    if (colorMode === "warm") paintColor = getRandomWarmColor();
    if (colorMode === "cold") paintColor = getRandomColdColor();
    if (colorMode === "rainbow") paintColor = getRandomRainbowColor();

    this.style.background = paintColor;
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
// #################### INPUT ####################
let inputMethod = "hover";
let isMouseClicked = false;

const inputButton = document.querySelector(".option.input button");

inputButton.addEventListener("click", setInputMethod);
function setInputMethod(event) {
    inputMethod = inputMethod === "hover" ? "click" : "hover";
    event.currentTarget.textContent = inputMethod;
}

document.addEventListener("mousedown", () => {
    isMouseClicked = true;
});
document.addEventListener("mouseup", () => {
    isMouseClicked = false;
});
// #################### COLOR BUTTON ####################

let colorModeIndex = 0;
let colorMode = "classic";
const COLOR_MODE_LIST = ["classic", "color", "rainbow", "warm", "cold"];
const classicColor = "#444";

const colorButton = document.querySelector(".option.color button");
const colorPicker = document.querySelector(".option.color .color-picker");

colorButton.addEventListener("click", setColorMethod);

function setColorMethod(event) {
    colorModeIndex++;
    if (colorModeIndex >= COLOR_MODE_LIST.length) colorModeIndex = 0;

    colorMode = COLOR_MODE_LIST[colorModeIndex];
    event.currentTarget.textContent = colorMode;
    if (colorMode === "color") {
        colorPicker.classList.remove("hide");
    } else {
        colorPicker.classList.add("hide");
    }
}

function getRandomWarmColor() {
    const h = Math.round(Math.random() * 60);
    const s = "100%";
    const l = "60%";
    return `HSL(${h},${s},${l})`;
}
function getRandomColdColor() {
    const h = Math.round(Math.random() * 50 + 200);
    const s = "100%";
    const l = "60%";
    return `HSL(${h},${s},${l})`;
}
function getRandomRainbowColor() {
    const h = Math.floor(Math.random() * 259);
    const s = "100%";
    const l = "60%";
    return `HSL(${h},${s},${l})`;
}
