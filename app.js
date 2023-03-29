import {
    hslToString,
    hslToRgb,
    hexToRgb,
    stringToRgb,
    rgbToString,
    mixRGBA,
} from "./colorConversionFunctions.js";

import {
    getRandomColor,
    getRandomColorSoft,
    getRandomRainbowColorSoft,
} from "./colorModesFunctions.js";

function createPixel(width, height) {
    const pixel = document.createElement("div");
    pixel.style.width = `${width}%`;
    pixel.style.height = `${height}%`;
    pixel.style.background = "";
    pixel.classList.add("canvas-cell");
    pixel.addEventListener("mouseenter", paintPixel);
    return pixel;
}

function clearAndRepopulateCanvas(numberOfRows, numberOfColumns) {
    deleteCanvas();
    populateCanvas(numberOfRows, numberOfColumns);
}

function deleteCanvas() {
    canvas.innerHTML = "";
}

function populateCanvas(numberOfRows, numberOfColumns) {
    const fragment = document.createDocumentFragment();
    const cellPercentageHeight = 100 / numberOfRows;
    const cellPercentageWidth = 100 / numberOfColumns;
    for (let column = 0; column < numberOfColumns; column++) {
        for (let row = 0; row < numberOfRows; row++) {
            const pixel = createPixel(
                cellPercentageWidth,
                cellPercentageHeight
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

    const paintColor = getPaintColorRGB();
    const alpha = brushOpacity;
    const canvasCurrentColor = pixel.style.background;
    const finalColor = calculatePaintFinalColor(
        paintColor,
        alpha,
        canvasCurrentColor
    );

    setPixel(pixel, finalColor);
}

function setPixel(pixel, rgba) {
    pixel.style.background = rgbToString(rgba);
}

function calculatePaintFinalColor(paintColorRgb, alpha, currentColorString) {
    if (!currentColorString) {
        const r = paintColorRgb.r;
        const g = paintColorRgb.g;
        const b = paintColorRgb.b;
        const a = alpha;
        return { r: r, g: g, b: b, a: a };
    }

    const currentColor = stringToRgb(currentColorString);

    paintColorRgb.a = alpha;
    const paintColorRgba = mixRGBA(currentColor, paintColorRgb);
    return paintColorRgba;
}

function getPaintColorRGB() {
    if (currentColorMode === "classic") return hexToRgb(classicColor);
    if (currentColorMode === "color") return hexToRgb(getColorPickerColor());
    if (currentColorMode === "rainbow") return hslToRgb(getRandomColor(0, 360));
    if (currentColorMode === "rainbowSoft")
        return hslToRgb(getRandomRainbowColorSoft());
    if (currentColorMode === "warm") return hslToRgb(getRandomColor(0, 50));
    if (currentColorMode === "warmSoft")
        return hslToRgb(getRandomColorSoft(0, 50));
    if (currentColorMode === "cold") return hslToRgb(getRandomColor(150, 250));
    if (currentColorMode === "coldSoft")
        return hslToRgb(getRandomColorSoft(150, 250));
}

function setPixelOpacity(pixel, brushOpacity) {
    const oldOpacity = parseFloat(pixel.style.opacity);
    const newOpacity = oldOpacity + brushOpacity;
    const newOpacityClamped = Math.min(newOpacity, 1);
    pixel.style.opacity = newOpacityClamped.toString();
}

const canvas = document.querySelector(".canvas");
const canvasRowsN = 50;
const canvasColumnsN = Math.round((canvasRowsN * 4) / 3);
clearAndRepopulateCanvas(canvasRowsN, canvasColumnsN);

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
let currentColorMode = "classic";
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
const classicColor = "#555555";

const colorButton = document.querySelector(".option.color button");
const colorPicker = document.querySelector(".option.color .color-picker");

colorButton.addEventListener("click", setColorMethod);

function setColorMethod(event) {
    colorModeIndex++;
    if (colorModeIndex >= COLOR_MODE_LIST.length) colorModeIndex = 0;

    currentColorMode = COLOR_MODE_LIST[colorModeIndex];
    event.currentTarget.textContent = currentColorMode;
    if (currentColorMode === "color") {
        colorPicker.classList.remove("hide");
    } else {
        colorPicker.classList.add("hide");
    }
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
    for (const cell of canvas.children) {
        cell.style.background = "";
    }

    deviceFrame.classList.add("shake");
}

function resetDeviceAnimation(event) {
    event.currentTarget.classList.remove("shake");
    event.currentTarget.offsetHeight;
}

// #################### RESOLUTION CONTROL ####################
const resolutionSlider = document.querySelector(".option.resolution input");

resolutionSlider.addEventListener("change", setResolution);

function setResolution(event) {
    const canvasRowsN = event.currentTarget.value;
    const canvasColumnsN = Math.round((canvasRowsN * 4) / 3);
    clearAndRepopulateCanvas(canvasRowsN, canvasColumnsN);
}
