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
    if (colorMode === "color") paintColor = getColorPickerColor();
    if (colorMode === "rainbow") paintColor = getRandomRainbowColor();
    if (colorMode === "rainbowSoft") paintColor = getRandomRainbowColorSoft();
    if (colorMode === "warm") paintColor = getRandomWarmColor();
    if (colorMode === "warmSoft") paintColor = getRandomWarmColorSoft();
    if (colorMode === "cold") paintColor = getRandomColdColor();
    if (colorMode === "coldSoft") paintColor = getRandomColdColorSoft();

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
const COLOR_MODE_LIST = [
    "classic",
    "color",
    "rainbow",
    "rainbowSoft",
    "warm",
    "warmSoft",
    "cold",
    "coldSoft",
];
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
// #################### COLOR MODES ####################
let softWarmHue = 0;
let isWarmHueIncreasing = true;
const softWarmChangeRate = 5;

let softColdHue = 200;
let isColdHueIncreasing = true;
const softColdChangeRate = 5;

let softRainbowHue = 0;
const softRainbowChangeRate = 10;

const saturation = "100%";
const lightness = "60%";

function getRandomWarmColor() {
    const hue = Math.round(Math.random() * 50);
    return `HSL(${hue},${saturation},${lightness})`;
}

function getRandomColdColor() {
    const hue = Math.round(Math.random() * 50 + 200);
    return `HSL(${hue},${saturation},${lightness})`;
}

function getRandomWarmColorSoft() {
    if (softWarmHue > 50) isWarmHueIncreasing = false;
    if (softWarmHue < 0) isWarmHueIncreasing = true;

    softWarmHue += isWarmHueIncreasing
        ? softWarmChangeRate
        : -softWarmChangeRate;
    return `HSL(${softWarmHue},${saturation},${lightness})`;
}

function getRandomColdColorSoft() {
    if (softColdHue > 250) isColdHueIncreasing = false;
    if (softColdHue < 200) isColdHueIncreasing = true;

    softColdHue += isColdHueIncreasing
        ? softColdChangeRate
        : -softColdChangeRate;
    return `HSL(${softColdHue},${saturation},${lightness})`;
}

function getRandomRainbowColor() {
    const hue = Math.floor(Math.random() * 359);
    return `HSL(${hue},${saturation},${lightness})`;
}

function getRandomRainbowColorSoft() {
    softRainbowHue += softRainbowChangeRate;
    return `HSL(${softRainbowHue},${saturation},${lightness})`;
}

function getColorPickerColor() {
    return colorPicker.value;
}
