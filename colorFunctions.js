import { stringToRgb, mixRGBA } from "./colorConversionFunctions.js";

let softHue = 0;
let isSoftHueIncreasing = true;
let softRainbowHue = 0;
const saturation = 1;
const lightness = 0.5;

export function getRandomColor(minHue, maxHue) {
    const hueSpan = Math.abs(maxHue - minHue);
    const hue = Math.round(Math.random() * hueSpan + minHue);
    const hsl = { hue: hue, saturation: saturation, lightness: lightness };
    return hsl;
}

export function getRandomColorSoft(minHue, maxHue, changeRate = 5) {
    if (softHue > maxHue) isSoftHueIncreasing = false;
    if (softHue < minHue) isSoftHueIncreasing = true;

    softHue = Math.max(minHue, Math.min(softHue, maxHue));
    softHue += isSoftHueIncreasing ? changeRate : -changeRate;

    const hsl = { hue: softHue, saturation: saturation, lightness: lightness };
    return hsl;
}

export function getRandomRainbowColorSoft(changeRate = 10) {
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

export function mixRGBwithRGBA(rgb, alpha, currentColorString) {
    if (!currentColorString) {
        const r = rgb.r;
        const g = rgb.g;
        const b = rgb.b;
        const a = alpha;
        return { r: r, g: g, b: b, a: a };
    }

    const currentColor = stringToRgb(currentColorString);

    rgb.a = alpha;
    const paintColorRgba = mixRGBA(currentColor, rgb);
    return paintColorRgba;
}
