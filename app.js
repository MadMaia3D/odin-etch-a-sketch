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
    deleteCanvas();
    populateCanvas(numberOfRows, numberOfColumns);
}

function deleteCanvas() {
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
    let paintColorRGB = getFinalPaintColorRGB();
    let paintColorString = `rgb(${paintColorRGB.r},${paintColorRGB.g},${paintColorRGB.b})`;

    pixel.style.background = paintColorString;
}

function getFinalPaintColorRGB() {
    if (colorMode === "classic") return hexToRgb(classicColor);
    if (colorMode === "color") return hexToRgb(getColorPickerColor());
    if (colorMode === "rainbow") return hslToRgb(getRandomColor(0, 360));
    if (colorMode === "rainbowSoft")
        return hslToRgb(getRandomRainbowColorSoft());
    if (colorMode === "warm") return hslToRgb(getRandomColor(0, 50));
    if (colorMode === "warmSoft") return hslToRgb(getRandomColorSoft(0, 50));
    if (colorMode === "cold") return hslToRgb(getRandomColor(150, 250));
    if (colorMode === "coldSoft") return hslToRgb(getRandomColorSoft(150, 250));
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
const classicColor = "#444444";

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
const saturation = 1;
const lightness = 0.5;

function getRandomColor(minHue, maxHue) {
    const hueSpan = Math.abs(maxHue - minHue);
    const hue = Math.round(Math.random() * hueSpan + minHue);
    const hsl = { hue: hue, saturation: saturation, lightness: lightness };
    return hsl;
    // return `HSL(${hue},${saturation},${lightness})`;
}

function getRandomColorSoft(minHue, maxHue, changeRate = 5) {
    if (softHue > maxHue) isSoftHueIncreasing = false;
    if (softHue < minHue) isSoftHueIncreasing = true;

    softHue = Math.max(minHue, Math.min(softHue, maxHue));
    softHue += isSoftHueIncreasing ? changeRate : -changeRate;

    const hsl = { hue: softHue, saturation: saturation, lightness: lightness };
    return hsl;
}

function getRandomRainbowColorSoft(changeRate = 10) {
    softRainbowHue += changeRate;
    if (softRainbowHue >= 360) {
        softRainbowHue = 0;
    }
    const hsl = {
        hue: softRainbowHue,
        saturation: saturation,
        lightness: lightness,
    };
    return hsl;
}

function getColorPickerColor() {
    return colorPicker.value;
}

// #################### COLOR CONVERSION ####################
function hslToString(HSL) {
    return `HSL(${HSL.hue},${HSL.saturation * 100}%,${HSL.lightness * 100}%)`;
}

function hslToRgb(HSL) {
    let r, g, b;
    let h = HSL.hue / 360;
    let s = HSL.saturation;
    let l = HSL.lightness;

    if (HSL.saturation == 0) {
        r = g = b = HSL.lightness;
    } else {
        const hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
    };
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
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
