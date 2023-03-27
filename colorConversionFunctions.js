// #################### COLOR CONVERSION ####################

export function hslToString(HSL) {
    return `HSL(${HSL.hue},${HSL.saturation * 100}%,${HSL.lightness * 100}%)`;
}

export function hslToRgb(HSL) {
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

export function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
              a: 1,
          }
        : null;
}

export function stringToRgb(rbgString) {
    const colorArr = rbgString
        .slice(rbgString.indexOf("(") + 1, rbgString.indexOf(")"))
        .split(",");
    const rgba = {
        r: parseInt(colorArr[0]),
        g: parseInt(colorArr[1]),
        b: parseInt(colorArr[2]),
    };
    rgba.a = colorArr.length > 3 ? parseFloat(colorArr[3]) : 1;

    return rgba;
}

export function rgbToString(rgb, alpha = "") {
    if (alpha) {
        return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
    }
    if (rgb.a) {
        return `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
    }
    return `rgba(${rgb.r},${rgb.g},${rgb.b},1)`;
}
