function createPixel(width, height) {
    const pixel = document.createElement("div");
    pixel.style.width = `${width}%`;
    pixel.style.height = `${height}%`;
    pixel.style.opacity = "0";
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

function paintPixel(event) {
    const pixel = event.currentTarget;
    if (inputMethod === "click" && isMouseClicked === false) {
        return;
    }
    if (mode === "erase") {
        pixel.style.background = "";
        return;
    }

    setPixelOpacity(pixel, brushOpacity);

    let paintColor = "";
    if (colorMode === "classic") paintColor = classicColor;
    if (colorMode === "color") paintColor = getColorPickerColor();
    if (colorMode === "rainbow") paintColor = getRandomColor(0, 360);
    if (colorMode === "rainbowSoft") paintColor = getRandomRainbowColorSoft();
    if (colorMode === "warm") paintColor = getRandomColor(0, 50);
    if (colorMode === "warmSoft") paintColor = getRandomColorSoft(0, 50);
    if (colorMode === "cold") paintColor = getRandomColor(150, 250);
    if (colorMode === "coldSoft") paintColor = getRandomColorSoft(150, 250);

    pixel.style.background = paintColor;
}

function setPixelOpacity(pixel, brushOpacity) {
    const oldOpacity = parseFloat(pixel.style.opacity);
    const newOpacity = oldOpacity + brushOpacity;
    const newOpacityClamped = Math.min(newOpacity, 1);
    pixel.style.opacity = newOpacityClamped.toString();
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
let softHue = 0;
let isSoftHueIncreasing = true;
let softRainbowHue = 0;
const saturation = "100%";
const lightness = "60%";

function getRandomColor(minHue, maxHue) {
    const hueSpan = Math.abs(maxHue - minHue);
    const hue = Math.round(Math.random() * hueSpan + minHue);
    return `HSL(${hue},${saturation},${lightness})`;
}

function getRandomColorSoft(minHue, maxHue, changeRate = 5) {
    if (softHue > maxHue) isSoftHueIncreasing = false;
    if (softHue < minHue) isSoftHueIncreasing = true;

    softHue = Math.max(minHue, Math.min(softHue, maxHue));
    softHue += isSoftHueIncreasing ? changeRate : -changeRate;

    return `HSL(${softHue},${saturation},${lightness})`;
}

function getRandomRainbowColorSoft(changeRate = 10) {
    softRainbowHue += changeRate;
    return `HSL(${softRainbowHue},${saturation},${lightness})`;
}

function getColorPickerColor() {
    return colorPicker.value;
}

// #################### OPACITY BUTTON ####################
let brushOpacity = 1;
const opacitySlider = document.querySelector(".opacity .slider");
opacitySlider.addEventListener("change", setBrushOpacity);

function setBrushOpacity(event) {
    brushOpacity = event.currentTarget.value / 100;
}

// #################### ERASE BUTTON ####################
const eraseButton = document.querySelector(".option.erase button");
const deviceFrame = document.querySelector(".etch-a-sketch");

eraseButton.addEventListener("click", eraseCanvas);
deviceFrame.addEventListener("animationend", resetDeviceAnimation);

function eraseCanvas() {
    for (cell of canvas.children) {
        cell.style.background = "";
    }

    deviceFrame.classList.add("shake");
}

function resetDeviceAnimation(event) {
    event.currentTarget.classList.remove("shake");
    event.currentTarget.offsetHeight;
}
