var __defProp = Object.defineProperty;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
var __assign = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __rest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
import "@m78/admin/style/index.scss";
import React, {useState, useEffect, useMemo, createContext, useRef, useContext} from "react";
import {Spin} from "m78/spin";
import {createSeed} from "m78/seed";
import Wine, {keypressAndClick} from "@m78/wine";
import {m78Config} from "m78/config";
import {generate} from "@ant-design/colors";
import {Divider, MediaQueryContext, MediaQueryTypeValues, MediaQuery} from "m78/layout";
import {Scroller} from "m78/scroller";
import {ContextMenu, ContextMenuItem} from "m78/context-menu";
import {DNDContext, DND} from "m78/dnd";
import clsx from "clsx";
import {createEvent, useFn, useSelf, useScroll} from "@lxjx/hooks";
import {isNumber, createRandString, isObject, isArray, isFunction, isBoolean, retry} from "@lxjx/utils";
import _debounce from "lodash/debounce";
import {message} from "m78/message";
import {PageHeader} from "m78/page-header";
import {CloseOutlined, MenuOutlined, StarFilled, StarOutlined} from "m78/icon";
import {DirectionEnum, SizeEnum} from "m78/types";
import assetLogo from "@m78/admin/assets/logo.png";
import {Button} from "m78/button";
import {Popper, PopperDirectionEnum} from "m78/popper";
import {Tree} from "m78/tree";
import {Check} from "m78/check";
const taskSeed = createSeed({
  state: {
    taskOptions: [],
    taskOptionsFlat: [],
    taskOptionsIdMap: {},
    taskList: [],
    adminProps: {
      tasks: [],
      authPro: null
    }
  }
});
function bound01(n, max) {
  if (isOnePointZero(n)) {
    n = "100%";
  }
  var isPercent = isPercentage(n);
  n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
  if (isPercent) {
    n = parseInt(String(n * max), 10) / 100;
  }
  if (Math.abs(n - max) < 1e-6) {
    return 1;
  }
  if (max === 360) {
    n = (n < 0 ? n % max + max : n % max) / parseFloat(String(max));
  } else {
    n = n % max / parseFloat(String(max));
  }
  return n;
}
function clamp01(val) {
  return Math.min(1, Math.max(0, val));
}
function isOnePointZero(n) {
  return typeof n === "string" && n.indexOf(".") !== -1 && parseFloat(n) === 1;
}
function isPercentage(n) {
  return typeof n === "string" && n.indexOf("%") !== -1;
}
function boundAlpha(a) {
  a = parseFloat(a);
  if (isNaN(a) || a < 0 || a > 1) {
    a = 1;
  }
  return a;
}
function convertToPercentage(n) {
  if (n <= 1) {
    return Number(n) * 100 + "%";
  }
  return n;
}
function pad2(c) {
  return c.length === 1 ? "0" + c : String(c);
}
function rgbToRgb(r, g, b) {
  return {
    r: bound01(r, 255) * 255,
    g: bound01(g, 255) * 255,
    b: bound01(b, 255) * 255
  };
}
function rgbToHsl(r, g, b) {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h = 0;
  var s = 0;
  var l = (max + min) / 2;
  if (max === min) {
    s = 0;
    h = 0;
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {h, s, l};
}
function hue2rgb(p, q, t) {
  if (t < 0) {
    t += 1;
  }
  if (t > 1) {
    t -= 1;
  }
  if (t < 1 / 6) {
    return p + (q - p) * (6 * t);
  }
  if (t < 1 / 2) {
    return q;
  }
  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }
  return p;
}
function hslToRgb(h, s, l) {
  var r;
  var g;
  var b;
  h = bound01(h, 360);
  s = bound01(s, 100);
  l = bound01(l, 100);
  if (s === 0) {
    g = l;
    b = l;
    r = l;
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {r: r * 255, g: g * 255, b: b * 255};
}
function rgbToHsv(r, g, b) {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h = 0;
  var v = max;
  var d = max - min;
  var s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {h, s, v};
}
function hsvToRgb(h, s, v) {
  h = bound01(h, 360) * 6;
  s = bound01(s, 100);
  v = bound01(v, 100);
  var i = Math.floor(h);
  var f = h - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);
  var mod = i % 6;
  var r = [v, q, p, p, t, v][mod];
  var g = [t, v, v, q, p, p][mod];
  var b = [p, p, t, v, v, q][mod];
  return {r: r * 255, g: g * 255, b: b * 255};
}
function rgbToHex(r, g, b, allow3Char) {
  var hex = [
    pad2(Math.round(r).toString(16)),
    pad2(Math.round(g).toString(16)),
    pad2(Math.round(b).toString(16))
  ];
  if (allow3Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1))) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
  }
  return hex.join("");
}
function rgbaToHex(r, g, b, a, allow4Char) {
  var hex = [
    pad2(Math.round(r).toString(16)),
    pad2(Math.round(g).toString(16)),
    pad2(Math.round(b).toString(16)),
    pad2(convertDecimalToHex(a))
  ];
  if (allow4Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1)) && hex[3].startsWith(hex[3].charAt(1))) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
  }
  return hex.join("");
}
function convertDecimalToHex(d) {
  return Math.round(parseFloat(d) * 255).toString(16);
}
function convertHexToDecimal(h) {
  return parseIntFromHex(h) / 255;
}
function parseIntFromHex(val) {
  return parseInt(val, 16);
}
function numberInputToObject(color) {
  return {
    r: color >> 16,
    g: (color & 65280) >> 8,
    b: color & 255
  };
}
var names = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  goldenrod: "#daa520",
  gold: "#ffd700",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavenderblush: "#fff0f5",
  lavender: "#e6e6fa",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
};
function inputToRGB(color) {
  var rgb = {r: 0, g: 0, b: 0};
  var a = 1;
  var s = null;
  var v = null;
  var l = null;
  var ok = false;
  var format = false;
  if (typeof color === "string") {
    color = stringInputToObject(color);
  }
  if (typeof color === "object") {
    if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
      rgb = rgbToRgb(color.r, color.g, color.b);
      ok = true;
      format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
      s = convertToPercentage(color.s);
      v = convertToPercentage(color.v);
      rgb = hsvToRgb(color.h, s, v);
      ok = true;
      format = "hsv";
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
      s = convertToPercentage(color.s);
      l = convertToPercentage(color.l);
      rgb = hslToRgb(color.h, s, l);
      ok = true;
      format = "hsl";
    }
    if (Object.prototype.hasOwnProperty.call(color, "a")) {
      a = color.a;
    }
  }
  a = boundAlpha(a);
  return {
    ok,
    format: color.format || format,
    r: Math.min(255, Math.max(rgb.r, 0)),
    g: Math.min(255, Math.max(rgb.g, 0)),
    b: Math.min(255, Math.max(rgb.b, 0)),
    a
  };
}
var CSS_INTEGER = "[-\\+]?\\d+%?";
var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";
var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
var matchers = {
  CSS_UNIT: new RegExp(CSS_UNIT),
  rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
  rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
  hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
  hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
  hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
  hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
  hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
  hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
  hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
};
function stringInputToObject(color) {
  color = color.trim().toLowerCase();
  if (color.length === 0) {
    return false;
  }
  var named = false;
  if (names[color]) {
    color = names[color];
    named = true;
  } else if (color === "transparent") {
    return {r: 0, g: 0, b: 0, a: 0, format: "name"};
  }
  var match = matchers.rgb.exec(color);
  if (match) {
    return {r: match[1], g: match[2], b: match[3]};
  }
  match = matchers.rgba.exec(color);
  if (match) {
    return {r: match[1], g: match[2], b: match[3], a: match[4]};
  }
  match = matchers.hsl.exec(color);
  if (match) {
    return {h: match[1], s: match[2], l: match[3]};
  }
  match = matchers.hsla.exec(color);
  if (match) {
    return {h: match[1], s: match[2], l: match[3], a: match[4]};
  }
  match = matchers.hsv.exec(color);
  if (match) {
    return {h: match[1], s: match[2], v: match[3]};
  }
  match = matchers.hsva.exec(color);
  if (match) {
    return {h: match[1], s: match[2], v: match[3], a: match[4]};
  }
  match = matchers.hex8.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      a: convertHexToDecimal(match[4]),
      format: named ? "name" : "hex8"
    };
  }
  match = matchers.hex6.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      format: named ? "name" : "hex"
    };
  }
  match = matchers.hex4.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1] + match[1]),
      g: parseIntFromHex(match[2] + match[2]),
      b: parseIntFromHex(match[3] + match[3]),
      a: convertHexToDecimal(match[4] + match[4]),
      format: named ? "name" : "hex8"
    };
  }
  match = matchers.hex3.exec(color);
  if (match) {
    return {
      r: parseIntFromHex(match[1] + match[1]),
      g: parseIntFromHex(match[2] + match[2]),
      b: parseIntFromHex(match[3] + match[3]),
      format: named ? "name" : "hex"
    };
  }
  return false;
}
function isValidCSSUnit(color) {
  return Boolean(matchers.CSS_UNIT.exec(String(color)));
}
var TinyColor = function() {
  function TinyColor2(color, opts) {
    if (color === void 0) {
      color = "";
    }
    if (opts === void 0) {
      opts = {};
    }
    var _a;
    if (color instanceof TinyColor2) {
      return color;
    }
    if (typeof color === "number") {
      color = numberInputToObject(color);
    }
    this.originalInput = color;
    var rgb = inputToRGB(color);
    this.originalInput = color;
    this.r = rgb.r;
    this.g = rgb.g;
    this.b = rgb.b;
    this.a = rgb.a;
    this.roundA = Math.round(100 * this.a) / 100;
    this.format = (_a = opts.format) !== null && _a !== void 0 ? _a : rgb.format;
    this.gradientType = opts.gradientType;
    if (this.r < 1) {
      this.r = Math.round(this.r);
    }
    if (this.g < 1) {
      this.g = Math.round(this.g);
    }
    if (this.b < 1) {
      this.b = Math.round(this.b);
    }
    this.isValid = rgb.ok;
  }
  TinyColor2.prototype.isDark = function() {
    return this.getBrightness() < 128;
  };
  TinyColor2.prototype.isLight = function() {
    return !this.isDark();
  };
  TinyColor2.prototype.getBrightness = function() {
    var rgb = this.toRgb();
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1e3;
  };
  TinyColor2.prototype.getLuminance = function() {
    var rgb = this.toRgb();
    var R;
    var G;
    var B;
    var RsRGB = rgb.r / 255;
    var GsRGB = rgb.g / 255;
    var BsRGB = rgb.b / 255;
    if (RsRGB <= 0.03928) {
      R = RsRGB / 12.92;
    } else {
      R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
    }
    if (GsRGB <= 0.03928) {
      G = GsRGB / 12.92;
    } else {
      G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
    }
    if (BsRGB <= 0.03928) {
      B = BsRGB / 12.92;
    } else {
      B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };
  TinyColor2.prototype.getAlpha = function() {
    return this.a;
  };
  TinyColor2.prototype.setAlpha = function(alpha) {
    this.a = boundAlpha(alpha);
    this.roundA = Math.round(100 * this.a) / 100;
    return this;
  };
  TinyColor2.prototype.toHsv = function() {
    var hsv = rgbToHsv(this.r, this.g, this.b);
    return {h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a};
  };
  TinyColor2.prototype.toHsvString = function() {
    var hsv = rgbToHsv(this.r, this.g, this.b);
    var h = Math.round(hsv.h * 360);
    var s = Math.round(hsv.s * 100);
    var v = Math.round(hsv.v * 100);
    return this.a === 1 ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this.roundA + ")";
  };
  TinyColor2.prototype.toHsl = function() {
    var hsl = rgbToHsl(this.r, this.g, this.b);
    return {h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a};
  };
  TinyColor2.prototype.toHslString = function() {
    var hsl = rgbToHsl(this.r, this.g, this.b);
    var h = Math.round(hsl.h * 360);
    var s = Math.round(hsl.s * 100);
    var l = Math.round(hsl.l * 100);
    return this.a === 1 ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this.roundA + ")";
  };
  TinyColor2.prototype.toHex = function(allow3Char) {
    if (allow3Char === void 0) {
      allow3Char = false;
    }
    return rgbToHex(this.r, this.g, this.b, allow3Char);
  };
  TinyColor2.prototype.toHexString = function(allow3Char) {
    if (allow3Char === void 0) {
      allow3Char = false;
    }
    return "#" + this.toHex(allow3Char);
  };
  TinyColor2.prototype.toHex8 = function(allow4Char) {
    if (allow4Char === void 0) {
      allow4Char = false;
    }
    return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
  };
  TinyColor2.prototype.toHex8String = function(allow4Char) {
    if (allow4Char === void 0) {
      allow4Char = false;
    }
    return "#" + this.toHex8(allow4Char);
  };
  TinyColor2.prototype.toRgb = function() {
    return {
      r: Math.round(this.r),
      g: Math.round(this.g),
      b: Math.round(this.b),
      a: this.a
    };
  };
  TinyColor2.prototype.toRgbString = function() {
    var r = Math.round(this.r);
    var g = Math.round(this.g);
    var b = Math.round(this.b);
    return this.a === 1 ? "rgb(" + r + ", " + g + ", " + b + ")" : "rgba(" + r + ", " + g + ", " + b + ", " + this.roundA + ")";
  };
  TinyColor2.prototype.toPercentageRgb = function() {
    var fmt = function(x) {
      return Math.round(bound01(x, 255) * 100) + "%";
    };
    return {
      r: fmt(this.r),
      g: fmt(this.g),
      b: fmt(this.b),
      a: this.a
    };
  };
  TinyColor2.prototype.toPercentageRgbString = function() {
    var rnd = function(x) {
      return Math.round(bound01(x, 255) * 100);
    };
    return this.a === 1 ? "rgb(" + rnd(this.r) + "%, " + rnd(this.g) + "%, " + rnd(this.b) + "%)" : "rgba(" + rnd(this.r) + "%, " + rnd(this.g) + "%, " + rnd(this.b) + "%, " + this.roundA + ")";
  };
  TinyColor2.prototype.toName = function() {
    if (this.a === 0) {
      return "transparent";
    }
    if (this.a < 1) {
      return false;
    }
    var hex = "#" + rgbToHex(this.r, this.g, this.b, false);
    for (var _i = 0, _a = Object.entries(names); _i < _a.length; _i++) {
      var _b = _a[_i], key = _b[0], value = _b[1];
      if (hex === value) {
        return key;
      }
    }
    return false;
  };
  TinyColor2.prototype.toString = function(format) {
    var formatSet = Boolean(format);
    format = format !== null && format !== void 0 ? format : this.format;
    var formattedString = false;
    var hasAlpha = this.a < 1 && this.a >= 0;
    var needsAlphaFormat = !formatSet && hasAlpha && (format.startsWith("hex") || format === "name");
    if (needsAlphaFormat) {
      if (format === "name" && this.a === 0) {
        return this.toName();
      }
      return this.toRgbString();
    }
    if (format === "rgb") {
      formattedString = this.toRgbString();
    }
    if (format === "prgb") {
      formattedString = this.toPercentageRgbString();
    }
    if (format === "hex" || format === "hex6") {
      formattedString = this.toHexString();
    }
    if (format === "hex3") {
      formattedString = this.toHexString(true);
    }
    if (format === "hex4") {
      formattedString = this.toHex8String(true);
    }
    if (format === "hex8") {
      formattedString = this.toHex8String();
    }
    if (format === "name") {
      formattedString = this.toName();
    }
    if (format === "hsl") {
      formattedString = this.toHslString();
    }
    if (format === "hsv") {
      formattedString = this.toHsvString();
    }
    return formattedString || this.toHexString();
  };
  TinyColor2.prototype.toNumber = function() {
    return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
  };
  TinyColor2.prototype.clone = function() {
    return new TinyColor2(this.toString());
  };
  TinyColor2.prototype.lighten = function(amount) {
    if (amount === void 0) {
      amount = 10;
    }
    var hsl = this.toHsl();
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return new TinyColor2(hsl);
  };
  TinyColor2.prototype.brighten = function(amount) {
    if (amount === void 0) {
      amount = 10;
    }
    var rgb = this.toRgb();
    rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
    rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
    rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
    return new TinyColor2(rgb);
  };
  TinyColor2.prototype.darken = function(amount) {
    if (amount === void 0) {
      amount = 10;
    }
    var hsl = this.toHsl();
    hsl.l -= amount / 100;
    hsl.l = clamp01(hsl.l);
    return new TinyColor2(hsl);
  };
  TinyColor2.prototype.tint = function(amount) {
    if (amount === void 0) {
      amount = 10;
    }
    return this.mix("white", amount);
  };
  TinyColor2.prototype.shade = function(amount) {
    if (amount === void 0) {
      amount = 10;
    }
    return this.mix("black", amount);
  };
  TinyColor2.prototype.desaturate = function(amount) {
    if (amount === void 0) {
      amount = 10;
    }
    var hsl = this.toHsl();
    hsl.s -= amount / 100;
    hsl.s = clamp01(hsl.s);
    return new TinyColor2(hsl);
  };
  TinyColor2.prototype.saturate = function(amount) {
    if (amount === void 0) {
      amount = 10;
    }
    var hsl = this.toHsl();
    hsl.s += amount / 100;
    hsl.s = clamp01(hsl.s);
    return new TinyColor2(hsl);
  };
  TinyColor2.prototype.greyscale = function() {
    return this.desaturate(100);
  };
  TinyColor2.prototype.spin = function(amount) {
    var hsl = this.toHsl();
    var hue = (hsl.h + amount) % 360;
    hsl.h = hue < 0 ? 360 + hue : hue;
    return new TinyColor2(hsl);
  };
  TinyColor2.prototype.mix = function(color, amount) {
    if (amount === void 0) {
      amount = 50;
    }
    var rgb1 = this.toRgb();
    var rgb2 = new TinyColor2(color).toRgb();
    var p = amount / 100;
    var rgba = {
      r: (rgb2.r - rgb1.r) * p + rgb1.r,
      g: (rgb2.g - rgb1.g) * p + rgb1.g,
      b: (rgb2.b - rgb1.b) * p + rgb1.b,
      a: (rgb2.a - rgb1.a) * p + rgb1.a
    };
    return new TinyColor2(rgba);
  };
  TinyColor2.prototype.analogous = function(results, slices) {
    if (results === void 0) {
      results = 6;
    }
    if (slices === void 0) {
      slices = 30;
    }
    var hsl = this.toHsl();
    var part = 360 / slices;
    var ret = [this];
    for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results; ) {
      hsl.h = (hsl.h + part) % 360;
      ret.push(new TinyColor2(hsl));
    }
    return ret;
  };
  TinyColor2.prototype.complement = function() {
    var hsl = this.toHsl();
    hsl.h = (hsl.h + 180) % 360;
    return new TinyColor2(hsl);
  };
  TinyColor2.prototype.monochromatic = function(results) {
    if (results === void 0) {
      results = 6;
    }
    var hsv = this.toHsv();
    var h = hsv.h;
    var s = hsv.s;
    var v = hsv.v;
    var res = [];
    var modification = 1 / results;
    while (results--) {
      res.push(new TinyColor2({h, s, v}));
      v = (v + modification) % 1;
    }
    return res;
  };
  TinyColor2.prototype.splitcomplement = function() {
    var hsl = this.toHsl();
    var h = hsl.h;
    return [
      this,
      new TinyColor2({h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
      new TinyColor2({h: (h + 216) % 360, s: hsl.s, l: hsl.l})
    ];
  };
  TinyColor2.prototype.onBackground = function(background) {
    var fg = this.toRgb();
    var bg = new TinyColor2(background).toRgb();
    return new TinyColor2({
      r: bg.r + (fg.r - bg.r) * fg.a,
      g: bg.g + (fg.g - bg.g) * fg.a,
      b: bg.b + (fg.b - bg.b) * fg.a
    });
  };
  TinyColor2.prototype.triad = function() {
    return this.polyad(3);
  };
  TinyColor2.prototype.tetrad = function() {
    return this.polyad(4);
  };
  TinyColor2.prototype.polyad = function(n) {
    var hsl = this.toHsl();
    var h = hsl.h;
    var result = [this];
    var increment = 360 / n;
    for (var i = 1; i < n; i++) {
      result.push(new TinyColor2({h: (h + i * increment) % 360, s: hsl.s, l: hsl.l}));
    }
    return result;
  };
  TinyColor2.prototype.equals = function(color) {
    return this.toRgbString() === new TinyColor2(color).toRgbString();
  };
  return TinyColor2;
}();
function configGetter(state) {
  var _a;
  return (_a = state.adminProps) == null ? void 0 : _a.config;
}
function emitConfig(conf) {
  const callback = taskSeed.getState().adminProps.onConfigChange;
  callback && callback(conf);
}
function useSubscribeAuthChange(seed) {
  const [authKeyChangeFlag, setFlag] = useState(0);
  useEffect(() => {
    const subscribe = seed.subscribe;
    return subscribe((changes) => {
      if ("auth" in changes) {
        setFlag((prev) => prev + 1);
      }
    });
  }, []);
  return authKeyChangeFlag;
}
function generateThemeColorRules(color, subColor) {
  let s = "";
  const gHelper = (prefix, _color) => {
    const tinyColor = new TinyColor(_color);
    if (tinyColor.isValid) {
      const colors = generate(_color);
      tinyColor.setAlpha(0.2);
      const a02 = tinyColor.toRgbString();
      tinyColor.setAlpha(0.5);
      const a05 = tinyColor.toRgbString();
      tinyColor.setAlpha(0.75);
      const a075 = tinyColor.toRgbString();
      s += colors.map((c, ind) => `${prefix}-${ind + 1}: ${c};`).join("");
      s += `
        ${prefix}-opacity-sm: ${a02};
        ${prefix}-opacity-md: ${a05};
        ${prefix}-opacity-lg: ${a075};
    `;
    }
  };
  gHelper("--m78-color", color);
  gHelper("--m78-color-sub", subColor);
  return s ? `
      :root {
        ${s}
      }
    ` : s;
}
const ConfigSync = () => {
  const config = taskSeed.useState(configGetter);
  const darkMode = (config == null ? void 0 : config.darkMode) || false;
  useEffect(() => {
    m78Config.setState({
      darkMode
    });
  }, [darkMode]);
  const maxWindow = (config == null ? void 0 : config.maxWindow) || 12;
  useEffect(() => {
    Wine.setMaxInstance(maxWindow);
  }, [maxWindow]);
  const color = config == null ? void 0 : config.color;
  const subColor = config == null ? void 0 : config.subColor;
  const styleTag = useMemo(() => {
    const tag = document.createElement("style");
    tag.setAttribute("type", "text/css");
    tag.setAttribute("data-name", "m78-theme-custom");
    document.head.appendChild(tag);
    return tag;
  }, []);
  useEffect(() => {
    styleTag.innerHTML = generateThemeColorRules(color, subColor);
  }, [color, subColor]);
  useEffect(() => () => {
    document.head.removeChild(styleTag);
  }, []);
  return null;
};
const updateByKeyEvent = createEvent();
const refreshEvent = createEvent();
const Crumbs = ({ctx: ctx2}) => {
  useListenerKeyToUpdate(ctx2);
  function changeTaskHandle(ind) {
    if (ctx2.currentChildIndex === ind)
      return;
    ctx2.currentChildIndex = ind;
    updateByKeyEvent.emit(ctx2.taskKey);
  }
  const childLen = ctx2.children.length;
  const childInd = ctx2.currentChildIndex;
  if (!childLen)
    return null;
  function renderWithMenu(el, currentCtx) {
    return /* @__PURE__ */ React.createElement(ContextMenu, {
      content: /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(ContextMenuItem, {
        title: "\u5237\u65B0\u4EFB\u52A1",
        onClick: currentCtx.refresh
      }), currentCtx !== ctx2 && /* @__PURE__ */ React.createElement(ContextMenuItem, {
        title: "\u5173\u95ED",
        onClick: currentCtx.dispose
      }))
    }, el);
  }
  return /* @__PURE__ */ React.createElement(Scroller, {
    scrollFlag: true,
    hideScrollbar: true,
    direction: DirectionEnum.horizontal,
    className: "m78-admin_crumbs"
  }, renderWithMenu(/* @__PURE__ */ React.createElement("span", {
    className: clsx("m78-admin_crumbs-item ellipsis m78-admin_effect pr-8", {
      __active: !isNumber(childInd)
    }),
    onClick: () => changeTaskHandle()
  }, ctx2.option.name), ctx2), /* @__PURE__ */ React.createElement("span", {
    className: "color-disabled mlr-8"
  }, "/"), ctx2.children.map((item, index) => /* @__PURE__ */ React.createElement(React.Fragment, {
    key: item.taskKey
  }, renderWithMenu(/* @__PURE__ */ React.createElement("span", {
    className: clsx("m78-admin_crumbs-item ellipsis m78-admin_effect", {
      __active: index === childInd
    }),
    onClick: () => changeTaskHandle(index)
  }, item.option.name, /* @__PURE__ */ React.createElement("span", {
    className: "m78-admin_crumbs-close m78-admin_effect ml-4",
    title: "\u5173\u95ED",
    onClick: (e) => {
      e.stopPropagation();
      item.dispose();
    }
  }, /* @__PURE__ */ React.createElement(CloseOutlined, {
    className: "m78-close-icon color-disabled fs"
  }))), item), index !== childLen - 1 && /* @__PURE__ */ React.createElement("span", {
    className: "color-disabled mlr-8"
  }, "/"))));
};
const TaskNameDynamic = ({ctx: ctx2}) => {
  useListenerKeyToUpdate(ctx2);
  const opt = ctx2.option;
  return /* @__PURE__ */ React.createElement("span", null, opt.taskName ? opt.taskName(ctx2) : opt.name);
};
const renderBuiltInHeader = (props, instance, isFull) => {
  var _a, _b;
  const taskOpt = instance.state.taskOption;
  const ctx2 = instance.state.ctx;
  return /* @__PURE__ */ React.createElement(ContextMenu, {
    content: /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(ContextMenuItem, {
      title: "\u5237\u65B0\u7A97\u53E3",
      desc: "\u8BE5\u7A97\u53E3\u4E0B\u6240\u6709\u4EFB\u52A1\u5C06\u4F1A\u88AB\u91CD\u7F6E",
      onClick: (_a = ctx2.wine.current) == null ? void 0 : _a.refresh
    }), /* @__PURE__ */ React.createElement(ContextMenuItem, {
      title: "\u6700\u5C0F\u5316",
      onClick: instance.hide
    }), /* @__PURE__ */ React.createElement(ContextMenuItem, {
      title: "\u6700\u5927\u5316",
      onClick: (_b = instance.current) == null ? void 0 : _b.full
    }), /* @__PURE__ */ React.createElement(ContextMenuItem, {
      title: "\u5173\u95ED",
      onClick: ctx2.dispose
    }))
  }, /* @__PURE__ */ React.createElement("div", __assign({}, props), /* @__PURE__ */ React.createElement(PageHeader, {
    className: "m78-admin_window-header",
    border: true,
    title: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", {
      className: "vm"
    }, /* @__PURE__ */ React.createElement("span", {
      className: "m78-admin_window-header_icon"
    }, taskOpt.icon), " ", /* @__PURE__ */ React.createElement(TaskNameDynamic, {
      ctx: ctx2
    })), /* @__PURE__ */ React.createElement(Divider, {
      vertical: true
    }), /* @__PURE__ */ React.createElement(Crumbs, {
      ctx: ctx2
    })),
    backIcon: null,
    actions: /* @__PURE__ */ React.createElement("div", {
      className: "m78-wine_header-actions",
      onMouseDown: (e) => e.stopPropagation()
    }, /* @__PURE__ */ React.createElement("span", __assign({
      tabIndex: 1,
      className: "m78-wine_btn"
    }, keypressAndClick(instance.hide)), /* @__PURE__ */ React.createElement("span", {
      className: "m78-wine_hide-btn"
    })), isFull && /* @__PURE__ */ React.createElement("span", __assign({
      tabIndex: 1,
      className: "m78-wine_btn"
    }, keypressAndClick(instance.current.resize)), /* @__PURE__ */ React.createElement("span", {
      className: "m78-wine_resize-btn"
    })), !isFull && /* @__PURE__ */ React.createElement("span", __assign({
      tabIndex: 1,
      className: "m78-wine_btn"
    }, keypressAndClick(instance.current.full)), /* @__PURE__ */ React.createElement("span", {
      className: "m78-wine_max-btn"
    })), /* @__PURE__ */ React.createElement("span", __assign({
      tabIndex: 1,
      className: "m78-wine_btn __warning"
    }, keypressAndClick(ctx2.dispose)), /* @__PURE__ */ React.createElement("span", {
      className: "m78-wine_dispose-btn"
    })))
  })));
};
const WINE_OFFSET_LEFT = 89;
const WINE_OFFSET = {
  left: WINE_OFFSET_LEFT,
  top: 49
};
const WILL_POP_MAP = {};
const ctx = createContext({});
const TaskComponentHandle = ({children}) => {
  const props = children.props;
  const [refreshKey, setKey] = useState(0);
  refreshEvent.useEvent((key) => {
    if (key === props.taskKey)
      setKey((prev) => prev + 1);
  });
  return React.cloneElement(children, __assign({key: refreshKey}, props));
};
const LinkProvider = ctx.Provider;
const loadingNode = /* @__PURE__ */ React.createElement(Spin, {
  text: "\u6B63\u5728\u52A0\u8F7D\u8D44\u6E90",
  className: "m78-admin_fixed-center-text"
});
const TaskWindowWrap = ({ctx: ctx2, Component}) => {
  useListenerKeyToUpdate(ctx2);
  const hasChild = !!ctx2.children.length;
  const hasIndex = isNumber(ctx2.currentChildIndex);
  return /* @__PURE__ */ React.createElement(MediaQueryContext, null, /* @__PURE__ */ React.createElement(LinkProvider, {
    value: {parent: ctx2}
  }, /* @__PURE__ */ React.createElement("div", {
    className: clsx({hide: hasIndex})
  }, /* @__PURE__ */ React.createElement(React.Suspense, {
    fallback: loadingNode
  }, /* @__PURE__ */ React.createElement(TaskComponentHandle, null, /* @__PURE__ */ React.createElement(Component, __assign({}, ctx2))))), hasChild && ctx2.children.map((subTask, ind) => {
    const SubComponent = subTask.option.component;
    return /* @__PURE__ */ React.createElement("div", {
      key: subTask.taskKey,
      className: clsx({hide: ctx2.currentChildIndex !== ind})
    }, /* @__PURE__ */ React.createElement(React.Suspense, {
      fallback: loadingNode
    }, /* @__PURE__ */ React.createElement(TaskComponentHandle, null, /* @__PURE__ */ React.createElement(SubComponent, __assign({}, subTask)))));
  })));
};
function useSyncWineTask() {
  useEffect(() => {
    const closeHandle = _debounce(() => {
      const instance = Wine.getInstances();
      const list = taskSeed.getState().taskList;
      const filterList = list.filter((item) => {
        return instance.some((i) => i === item.wine);
      });
      taskSeed.setState({
        taskList: filterList
      });
    }, 10, {leading: false, trailing: true});
    Wine.events.change.on(closeHandle);
    return () => Wine.events.change.off(closeHandle);
  }, []);
}
function useListenerKeyToUpdate(ctx2) {
  const [, update] = useState(0);
  updateByKeyEvent.useEvent((key) => {
    if (key === ctx2.taskKey)
      update((prev) => prev + 1);
  });
}
function checkBeforeTaskEach(opt) {
  const checkFn = taskSeed.getState().adminProps.beforeTaskEach;
  if (!checkFn)
    return true;
  return checkFn(opt);
}
function checkTaskAuth(opt) {
  const AuthPro = taskSeed.getState().adminProps.authPro;
  if (!AuthPro || !isArray(opt.auth) || !opt.auth.length)
    return true;
  return !AuthPro.auth(opt.auth);
}
function checkTaskAuthAndTips(opt) {
  const check = checkTaskAuth(opt);
  if (!check) {
    message.tips({
      type: "warning",
      content: /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", {
        className: "bold"
      }, opt.name, ": "), "\u60A8\u6CA1\u6709\u6B64\u529F\u80FD\u7684\u8BBF\u95EE\u6743\u9650"),
      duration: 2e3
    });
  }
  return check;
}
function createTaskInstance(taskOpt, opt) {
  const {param, parent} = opt || {};
  const ctx2 = {
    id: taskOpt.id,
    taskKey: createRandString(2),
    param: param || {},
    option: taskOpt,
    setParam: (_param) => {
      if (isObject(_param)) {
        ctx2.param = __assign({}, _param);
      }
      if (isArray(param)) {
        ctx2.param = [..._param];
      }
      ctx2.param = _param;
      updateByKeyEvent.emit((parent || ctx2).taskKey);
    }
  };
  if (!parent) {
    createMainTaskCtx(taskOpt, ctx2);
  } else {
    createSubTaskCtx(taskOpt, {param, parent}, ctx2);
  }
  return ctx2;
}
function createMainTaskCtx(taskOpt, ctx2) {
  const {
    id,
    name,
    component,
    icon,
    auth,
    taskName,
    initFull,
    singleton,
    hide: hide2
  } = taskOpt, wineState = __rest(taskOpt, [
    "id",
    "name",
    "component",
    "icon",
    "auth",
    "taskName",
    "initFull",
    "singleton",
    "hide"
  ]);
  const config = configGetter(taskSeed.getState());
  const isDefaultFull = window.innerWidth <= MediaQueryTypeValues.SM || !(wineState.width || wineState.height || wineState.sizeRatio || !(config == null ? void 0 : config.initFull));
  ctx2.wine = Wine.render(__assign(__assign({}, wineState), {
    initFull: initFull || isDefaultFull,
    className: `J_task_${ctx2.taskKey}`,
    content: /* @__PURE__ */ React.createElement(TaskWindowWrap, {
      Component: React.memo(component),
      ctx: ctx2
    }),
    headerCustomer: renderBuiltInHeader,
    limitBound: WINE_OFFSET,
    taskOption: taskOpt,
    ctx: ctx2,
    onActive: () => {
      taskSeed.setState({
        activeTaskKey: ctx2.taskKey
      });
    }
  }));
  ctx2.children = [];
  ctx2.refresh = () => refreshEvent.emit(ctx2.taskKey);
  ctx2.open = () => {
    var _a;
    ctx2.wine.show();
    (_a = ctx2.wine.current) == null ? void 0 : _a.top();
  };
  ctx2.hide = ctx2.wine.hide;
  ctx2.dispose = () => {
    closeTaskByKey(ctx2.taskKey);
  };
  ctx2.push = (_id, _param) => {
    var _a;
    const currentOpt = getTaskOpt(_id);
    if (!currentOpt)
      return;
    if (!checkTaskAuthAndTips(currentOpt))
      return;
    if (!checkBeforeTaskEach(currentOpt))
      return;
    if (currentOpt.singleton && ((_a = ctx2.children) == null ? void 0 : _a.length)) {
      const exist = ctx2.children.find((item) => item.id === _id);
      if (exist) {
        exist.open();
        return;
      }
    }
    const instance = createTaskInstance(currentOpt, {
      param: _param,
      parent: ctx2
    });
    ctx2.children.push(instance);
    ctx2.currentChildIndex = ctx2.children.length - 1;
    updateByKeyEvent.emit(ctx2.taskKey);
  };
  ctx2.replace = (_id, _param) => {
    const currentOpt = getTaskOpt(_id);
    if (!currentOpt)
      return;
    if (!checkTaskAuthAndTips(currentOpt))
      return;
    if (!checkBeforeTaskEach(currentOpt))
      return;
    [...ctx2.children].forEach((item) => {
      if (item.id === _id)
        item.dispose();
    });
    ctx2.push(_id, _param);
  };
}
function createSubTaskCtx(taskOpt, opt, ctx2) {
  const parent = opt.parent;
  ctx2.parent = parent;
  ctx2.refresh = () => refreshEvent.emit(ctx2.taskKey);
  ctx2.open = () => {
    const ind = parent.children.indexOf(ctx2);
    if (ind !== -1)
      parent.currentChildIndex = ind;
    updateByKeyEvent.emit(parent.taskKey);
    parent.open();
  };
  ctx2.hide = () => {
    parent.currentChildIndex = void 0;
    updateByKeyEvent.emit(parent.taskKey);
  };
  ctx2.dispose = () => {
    if (!checkPopCloseable(ctx2) && !closeConfirm(ctx2))
      return;
    const ind = parent.children.indexOf(ctx2);
    if (ind === -1)
      return;
    parent.children.splice(ind, 1);
    const childInd = parent.currentChildIndex;
    if (childInd && childInd > parent.children.length - 1) {
      parent.currentChildIndex = childInd - 1;
    }
    if (!parent.children.length) {
      parent.currentChildIndex = void 0;
    }
    updateByKeyEvent.emit(parent.taskKey);
  };
  ctx2.push = parent.push;
  ctx2.replace = parent.replace;
}
function getTaskOpt(id) {
  const map = taskSeed.getState().taskOptionsIdMap;
  return map[id];
}
function taskOptFormat(taskOpt) {
  const taskOptions = [];
  const taskOptionsFlat = [];
  const taskOptionsIdMap = {};
  function flatTaskOptions(_taskOptions, list) {
    _taskOptions.forEach((item) => {
      if ("id" in item && item.component && item.name) {
        const c = __assign({}, item);
        taskOptionsFlat.push(c);
        taskOptionsIdMap[c.id] = c;
        if (list) {
          list.push(c);
        }
      }
      if ("children" in item && item.name && item.children.length) {
        const c = __assign(__assign({}, item), {
          children: []
        });
        if (list) {
          list.push(c);
        }
        flatTaskOptions(item.children, c.children);
      }
    });
  }
  flatTaskOptions(taskOpt, taskOptions);
  return {
    taskOptions,
    taskOptionsFlat,
    taskOptionsIdMap
  };
}
function collectHandle(id, collectFunc) {
  const index = collectFunc.indexOf(id);
  const clone = [...collectFunc];
  if (index === -1) {
    clone.push(id);
  } else {
    clone.splice(index, 1);
  }
  emitConfig({
    collectFunc: [...clone]
  });
}
function closeTaskList(checker) {
  const list = taskSeed.getState().taskList;
  const nextList = list.filter((item, index) => {
    var _a;
    let keep = checker(item, index);
    if (!keep) {
      const ctxIsSafe = checkPopCloseable(item);
      const subCtxIsSafe = ((_a = item.children) == null ? void 0 : _a.length) ? item.children.every(checkPopCloseable) : true;
      if (!ctxIsSafe || !subCtxIsSafe) {
        keep = !closeConfirm(item);
      }
    }
    if (!keep) {
      item.wine.dispose();
    }
    return keep;
  });
  taskSeed.setState({
    taskList: nextList
  });
}
function closeTaskByProp(propName, prop, be = false) {
  if (!prop)
    return;
  closeTaskList((ctx2) => be ? ctx2[propName] === prop : ctx2[propName] !== prop);
}
function closeTaskById(id) {
  closeTaskByProp("id", id);
}
function closeTaskByKey(key) {
  closeTaskByProp("taskKey", key);
}
function closeOtherTaskByKey(key) {
  closeTaskByProp("taskKey", key, true);
}
function closeSideTaskByKey(key, right = true) {
  if (!key)
    return;
  const list = taskSeed.getState().taskList;
  const index = list.findIndex((item) => item.taskKey === key);
  closeTaskList((ctx2, ind) => right ? ind <= index : ind >= index);
}
function closeRightTaskByKey(key) {
  closeSideTaskByKey(key);
}
function closeLeftTaskByKey(key) {
  closeSideTaskByKey(key, false);
}
function hideTaskById(id) {
  if (!id)
    return;
  const list = task.get({id});
  list.forEach((item) => item.hide());
}
function openTaskById(id) {
  if (!id)
    return;
  const list = task.get({id});
  list.forEach((item) => item.open());
}
function checkPopCloseable(ctx2) {
  const meta = WILL_POP_MAP[ctx2.taskKey];
  if (meta) {
    let pass = true;
    if (isFunction(meta.when) && meta.when())
      pass = false;
    if (isBoolean(meta.when) && meta.when)
      pass = false;
    return pass;
  }
  return true;
}
function closeConfirm(ctx2) {
  return confirm(`\u60A8\u5728 \u201C${ctx2.option.name}\u201D \u7A97\u53E3\u8FDB\u884C\u7684\u64CD\u4F5C\u53EF\u80FD\u4E0D\u4F1A\u4FDD\u5B58\uFF0C\u786E\u8BA4\u8981\u5C06\u5176\u5173\u95ED\u5417?`);
}
function isPassNode(item) {
  return item && "id" in item && !item.hide && checkTaskAuth(item);
}
const get = ({id, includeSubTask} = {}) => {
  const list = [...taskSeed.getState().taskList];
  if (includeSubTask) {
    list.forEach((item) => {
      var _a;
      if ((_a = item.children) == null ? void 0 : _a.length) {
        list.push(...item.children);
      }
    });
  }
  if (!id)
    return list;
  return list.filter((item) => item.id === id);
};
const push = (id, param) => {
  const currentOpt = getTaskOpt(id);
  if (!currentOpt)
    return;
  if (!checkTaskAuthAndTips(currentOpt))
    return;
  if (!checkBeforeTaskEach(currentOpt))
    return;
  if (currentOpt.singleton) {
    const exist = get({id});
    const last = exist[exist.length - 1];
    if (last) {
      last.open();
      return;
    }
  }
  const instance = createTaskInstance(currentOpt, {
    param
  });
  taskSeed.setState({
    taskList: [...get(), instance]
  });
};
const refresh = (opt) => {
  const ls = get(opt);
  ls.forEach((item) => item.refresh());
};
const open = (id) => {
  const ls = get({id});
  ls.forEach((item) => item.open());
};
const hide = (id) => {
  const ls = get({id});
  ls.forEach((item) => item.hide());
};
const dispose = (opt) => {
  const ls = get(opt);
  ls.forEach((item) => item.dispose());
};
const useWillPop = (ctx2, when) => {
  WILL_POP_MAP[ctx2.taskKey] = {
    when
  };
  useEffect(() => () => {
    delete WILL_POP_MAP[ctx2.taskKey];
  }, []);
};
const replace = (id, param) => {
  const currentOpt = getTaskOpt(id);
  if (!currentOpt)
    return;
  if (!checkTaskAuthAndTips(currentOpt))
    return;
  if (!checkBeforeTaskEach(currentOpt))
    return;
  const sameList = get({id});
  sameList.forEach((item) => item.dispose());
  push(id, param);
};
const task = {
  get,
  push,
  refresh,
  open,
  hide,
  dispose,
  useWillPop,
  replace
};
const FuncCollects = () => {
  const map = taskSeed.useState((state) => state.taskOptionsIdMap);
  const taskList = taskSeed.useState((state) => state.taskList);
  const AuthPro = taskSeed.useState((state) => state.adminProps.authPro);
  const config = taskSeed.useState(configGetter);
  const collect = (config == null ? void 0 : config.collectFunc) || [];
  useSubscribeAuthChange(AuthPro.authInstance.seed);
  const acceptHandle = useFn((e) => {
    const list = [...collect];
    const target = e.target.data;
    const source = e.source.data;
    const sInd = list.indexOf(source);
    const tInd = list.indexOf(target);
    if (e.status.dragOver) {
      list.splice(tInd, 0, ...list.splice(sInd, 1));
      emitConfig({
        collectFunc: [...list]
      });
    }
  });
  return /* @__PURE__ */ React.createElement(DNDContext, {
    onAccept: acceptHandle
  }, /* @__PURE__ */ React.createElement(Scroller, {
    className: "m78-admin_func-bar_main",
    scrollFlag: true,
    hideScrollbar: true
  }, collect.map((id) => {
    const item = map[id];
    if (!isPassNode(item))
      return null;
    const tasks = taskList.filter((i) => i.id === id);
    const length = tasks.length;
    const openTask = () => {
      if (!length) {
        task.push(item.id);
        return;
      }
      tasks[length - 1].open();
    };
    return /* @__PURE__ */ React.createElement(DND, {
      key: item.id,
      data: item.id,
      enableDrop: true
    }, ({innerRef, status, enables}) => /* @__PURE__ */ React.createElement(ContextMenu, {
      key: item.id,
      content: /* @__PURE__ */ React.createElement("div", null, length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, tasks.map((i, ind) => /* @__PURE__ */ React.createElement(ContextMenuItem, {
        key: i.taskKey,
        title: `\u7F6E\u9876\u4EFB\u52A1${ind + 1}`,
        onClick: i.open
      })), /* @__PURE__ */ React.createElement(Divider, null)), /* @__PURE__ */ React.createElement(ContextMenuItem, {
        title: item.singleton ? "\u6253\u5F00\u7A97\u53E3" : "\u6253\u5F00\u65B0\u7A97\u53E3",
        onClick: () => task.push(item.id)
      }), /* @__PURE__ */ React.createElement(ContextMenuItem, {
        title: "\u4ECE\u5E38\u7528\u529F\u80FD\u4E2D\u79FB\u9664",
        onClick: () => collectHandle(item.id, (config == null ? void 0 : config.collectFunc) || [])
      }), length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ContextMenuItem, {
        title: "\u9690\u85CF\u5168\u90E8\u7A97\u53E3",
        onClick: () => hideTaskById(item.id)
      }), /* @__PURE__ */ React.createElement(ContextMenuItem, {
        title: "\u6253\u5F00\u5168\u90E8\u7A97\u53E3",
        onClick: () => openTaskById(item.id)
      }), /* @__PURE__ */ React.createElement(ContextMenuItem, {
        title: "\u5173\u95ED\u5168\u90E8\u7A97\u53E3",
        onClick: () => closeTaskById(item.id)
      })))
    }, /* @__PURE__ */ React.createElement("div", {
      ref: innerRef,
      className: "m78-dnd-box-anime"
    }, /* @__PURE__ */ React.createElement(FuncBtn, {
      className: clsx("m78-dnd-box-anime_main", {
        __active: status.dragOver,
        __disabled: !enables.enable || status.dragging,
        __left: status.dragLeft,
        __top: status.dragTop,
        __right: status.dragRight,
        __bottom: status.dragBottom
      }),
      text: item.name,
      icon: item.icon,
      onClick: openTask,
      extraNode: length > 0 && /* @__PURE__ */ React.createElement(Badge, null, length > 1 ? length : void 0)
    }))));
  })));
};
const FuncLogo = () => {
  const config = taskSeed.useState(configGetter);
  const logo = (config == null ? void 0 : config.logo) || assetLogo;
  const name = (config == null ? void 0 : config.name) || "M78-Admin";
  return /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_func-bar_logo",
    title: name
  }, /* @__PURE__ */ React.createElement("img", {
    className: "m78-admin_func-bar_logo-img",
    src: logo,
    alt: name
  }), /* @__PURE__ */ React.createElement("div", {
    className: "ellipsis mt-4"
  }, name));
};
const FuncFoot = () => {
  const funcBarExtraNode = taskSeed.useState((state) => state.adminProps.funcBarExtraNode);
  if (!funcBarExtraNode)
    return null;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_func-bar_side"
  }, funcBarExtraNode));
};
const FuncBar = () => {
  return /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_func-bar"
  }, /* @__PURE__ */ React.createElement(FuncLogo, null), /* @__PURE__ */ React.createElement(Divider, null), /* @__PURE__ */ React.createElement(FuncCollects, null), /* @__PURE__ */ React.createElement(FuncFoot, null));
};
const FuncList = () => {
  const tasks = taskSeed.useState((state) => state.taskOptions);
  const AuthPro = taskSeed.useState((state) => state.adminProps.authPro);
  const config = taskSeed.useState(configGetter);
  const [popperShow, setPopperShow] = useState(false);
  const authKeyChangeFlag = useSubscribeAuthChange(AuthPro.authInstance.seed);
  const filterAuthTasks = useMemo(filterNotPassNode, [tasks, authKeyChangeFlag]);
  function filterNotPassNode() {
    if (!AuthPro)
      return tasks;
    const filterNodes = (list) => {
      const _tasks = [];
      if (!(list == null ? void 0 : list.length))
        return _tasks;
      list.forEach((item) => {
        if (isPassNode(item)) {
          const {height} = item, i = __rest(item, ["height"]);
          _tasks.push(i);
          return;
        }
        if ("children" in item && item.children.length) {
          const nChildren = filterNodes(item.children);
          if (nChildren == null ? void 0 : nChildren.length) {
            _tasks.push({
              name: item.name,
              children: nChildren
            });
          }
        }
      });
      return _tasks;
    };
    return filterNodes(tasks);
  }
  function renderAction(node) {
    var _a;
    if ((_a = node.children) == null ? void 0 : _a.length)
      return null;
    const collectFunc = (config == null ? void 0 : config.collectFunc) || [];
    const isCollectd = collectFunc.includes(node.id);
    return /* @__PURE__ */ React.createElement(Button, {
      size: "small",
      icon: true,
      onClick: () => collectHandle(node.id, collectFunc)
    }, isCollectd ? /* @__PURE__ */ React.createElement(StarFilled, {
      className: "color-warn",
      title: "\u53D6\u6D88\u6807\u8BB0"
    }) : /* @__PURE__ */ React.createElement(StarOutlined, {
      className: "color-second",
      title: "\u6807\u8BB0\u4E3A\u5E38\u7528\u529F\u80FD"
    }));
  }
  function chooseHandle({id, children}) {
    if (children == null ? void 0 : children.length)
      return;
    task.push(id);
    setPopperShow(false);
  }
  function renderContent() {
    return /* @__PURE__ */ React.createElement("div", {
      className: "func-list"
    }, /* @__PURE__ */ React.createElement("h3", null, "\u5168\u90E8\u529F\u80FD"), /* @__PURE__ */ React.createElement(Tree, {
      dataSource: filterAuthTasks,
      labelGetter: (item) => item.name,
      valueGetter: (item) => item.id || item.name,
      toolbar: true,
      rainbowIndicatorLine: true,
      height: 380,
      size: SizeEnum.large,
      defaultOpenZIndex: 1,
      onNodeClick: chooseHandle,
      actions: renderAction
    }));
  }
  return /* @__PURE__ */ React.createElement(Popper, {
    type: "popper",
    show: popperShow,
    onChange: setPopperShow,
    content: renderContent(),
    direction: PopperDirectionEnum.bottomStart
  }, /* @__PURE__ */ React.createElement(Button, {
    icon: true
  }, /* @__PURE__ */ React.createElement(MenuOutlined, {
    className: "fs-md"
  })));
};
const TaskTab = ({instance}) => {
  var _a;
  const opt = instance.option;
  const activeTaskKey = taskSeed.useState((state) => state.activeTaskKey);
  return /* @__PURE__ */ React.createElement(ContextMenu, {
    content: /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(ContextMenuItem, {
      title: "\u5237\u65B0\u7A97\u53E3",
      onClick: (_a = instance.wine.current) == null ? void 0 : _a.refresh
    }), /* @__PURE__ */ React.createElement(ContextMenuItem, {
      title: "\u5173\u95ED\u5176\u4ED6\u7A97\u53E3",
      onClick: () => closeOtherTaskByKey(instance.taskKey)
    }), /* @__PURE__ */ React.createElement(ContextMenuItem, {
      title: "\u5173\u95ED\u5DE6\u4FA7\u7A97\u53E3",
      onClick: () => closeLeftTaskByKey(instance.taskKey)
    }), /* @__PURE__ */ React.createElement(ContextMenuItem, {
      title: "\u5173\u95ED\u53F3\u4FA7\u7A97\u53E3",
      onClick: () => closeRightTaskByKey(instance.taskKey)
    }), /* @__PURE__ */ React.createElement(ContextMenuItem, {
      title: "\u5173\u95ED",
      onClick: instance.dispose
    }))
  }, /* @__PURE__ */ React.createElement("span", {
    className: clsx("m78-admin_task-tab", activeTaskKey === instance.taskKey && "__active"),
    onClick: instance.open
  }, opt.icon, " ", /* @__PURE__ */ React.createElement(TaskNameDynamic, {
    ctx: instance
  }), /* @__PURE__ */ React.createElement("span", {
    className: "m78-admin_effect ml-4",
    title: "\u5173\u95ED\u7A97\u53E3",
    onClick: (e) => {
      e.stopPropagation();
      closeTaskByKey(instance.taskKey);
    }
  }, /* @__PURE__ */ React.createElement(CloseOutlined, {
    className: "m78-close-icon color-second"
  }))));
};
const TaskList = () => {
  const taskList = taskSeed.useState((state) => state.taskList);
  const scroller = useRef(null);
  const last = useRef();
  useEffect(() => {
    const f = setTimeout(() => {
      const meta = scroller.current.get();
      const xMax = meta.xMax;
      if (!last.current && xMax || last.current && xMax > last.current) {
        scroller.current.set({
          x: xMax,
          immediate: true
        });
      }
      last.current = xMax;
    }, 20);
    return () => clearTimeout(f);
  }, [taskList.length]);
  return /* @__PURE__ */ React.createElement(Scroller, {
    className: "m78-admin_task-bar_main",
    scrollFlag: true,
    hideScrollbar: true,
    direction: DirectionEnum.horizontal,
    ref: scroller
  }, taskList.map((item) => /* @__PURE__ */ React.createElement(TaskTab, {
    key: item.taskKey,
    instance: item
  })));
};
const TaskActions = () => {
  const aProps = taskSeed.useState((state) => state.adminProps);
  const config = aProps.config;
  const darkMode = (config == null ? void 0 : config.darkMode) || false;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Popper, {
    content: "\u6536\u8D77\u6240\u6709\u7A97\u53E3",
    direction: "bottom"
  }, /* @__PURE__ */ React.createElement(Button, {
    icon: true,
    onClick: Wine.hideAll
  }, /* @__PURE__ */ React.createElement("span", {
    style: {fontSize: 18}
  }, "\u{1F4D8}"))), /* @__PURE__ */ React.createElement(Popper, {
    content: "\u5C55\u5F00\u6240\u6709\u7A97\u53E3",
    direction: "bottom"
  }, /* @__PURE__ */ React.createElement(Button, {
    icon: true,
    onClick: Wine.showAll
  }, /* @__PURE__ */ React.createElement("span", {
    style: {fontSize: 18}
  }, "\u{1F4D6}"))), /* @__PURE__ */ React.createElement(Popper, {
    content: "\u5173\u95ED\u6240\u6709\u7A97\u53E3",
    direction: "bottom"
  }, /* @__PURE__ */ React.createElement(Button, {
    icon: true,
    onClick: () => task.dispose()
  }, /* @__PURE__ */ React.createElement("span", {
    style: {fontSize: 18}
  }, "\u{1F5D1}"))), aProps.taskBarExtraNode, /* @__PURE__ */ React.createElement(Check, {
    className: "ml-12",
    type: "switch",
    switchOff: /* @__PURE__ */ React.createElement("span", {
      style: {fontSize: 16}
    }, "\u{1F31E}"),
    switchOn: /* @__PURE__ */ React.createElement("span", {
      style: {fontSize: 16}
    }, "\u{1F31B}"),
    checked: darkMode,
    onChange: (toggle) => {
      emitConfig({
        darkMode: toggle
      });
    }
  }));
};
const TaskBar = () => {
  return /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_task-bar"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_task-bar_before"
  }, /* @__PURE__ */ React.createElement(FuncList, null)), /* @__PURE__ */ React.createElement(Divider, {
    vertical: true,
    className: "h-1d4em"
  }), /* @__PURE__ */ React.createElement(TaskList, null), /* @__PURE__ */ React.createElement(Divider, {
    vertical: true,
    className: "h-1d4em"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_task-bar_action"
  }, /* @__PURE__ */ React.createElement(TaskActions, null)));
};
const DesktopItems = () => {
  const aProps = taskSeed.useState((state) => state.adminProps);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_desktop-node"
  }, aProps.desktopNode), /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_layout_desc"
  }, aProps.footerNode || /* @__PURE__ */ React.createElement(React.Fragment, null, "POWER BY |-", /* @__PURE__ */ React.createElement("a", {
    href: "https://github.com/xianjie-li/m78",
    target: "_blank",
    rel: "noreferrer"
  }, "M78"), "-| |-", /* @__PURE__ */ React.createElement("a", {
    href: "https://github.com/xianjie-li",
    target: "_blank",
    rel: "noreferrer"
  }, "Lime"), "-|")));
};
const BaseLayout = () => {
  const width = taskSeed.useState((state) => state.adminProps.width);
  const height = taskSeed.useState((state) => state.adminProps.height);
  return /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_layout",
    style: {
      height,
      width
    }
  }, /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_layout_side"
  }, /* @__PURE__ */ React.createElement(FuncBar, null)), /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_layout_main"
  }, /* @__PURE__ */ React.createElement(TaskBar, null), /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_layout_window"
  }, /* @__PURE__ */ React.createElement(Wine.RenderBoxTarget, null), /* @__PURE__ */ React.createElement(DesktopItems, null))));
};
const Handles = () => {
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 680) {
        WINE_OFFSET.left = 0;
      } else {
        WINE_OFFSET.left = WINE_OFFSET_LEFT;
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  return null;
};
const M78AdminCore = (props) => {
  const {tasks} = props;
  const [pass, setPass] = useState(false);
  useEffect(() => {
    taskSeed.setState(taskOptFormat(tasks));
    if (!pass)
      setPass(true);
  }, []);
  useSyncWineTask();
  if (!pass)
    return null;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ConfigSync, null), /* @__PURE__ */ React.createElement(Handles, null), /* @__PURE__ */ React.createElement(BaseLayout, null));
};
function M78AdminImpl(props) {
  useEffect(() => {
    taskSeed.setState({
      adminProps: props
    });
  }, [props]);
  if (props.loading) {
    return /* @__PURE__ */ React.createElement("div", {
      className: "m78-admin_blocked-loading"
    }, /* @__PURE__ */ React.createElement(Spin, {
      size: "big",
      text: "",
      full: true
    }));
  }
  return /* @__PURE__ */ React.createElement(M78AdminCore, __assign({}, props));
}
const FuncBtn = (_a) => {
  var {icon, text, extraNode, small, circle, className, style} = _a, ppp = __rest(_a, ["icon", "text", "extraNode", "small", "circle", "className", "style"]);
  return /* @__PURE__ */ React.createElement("div", __assign({
    className: clsx("m78-admin_func-bar_func", className, small && "__small", circle && "__circle"),
    style
  }, ppp), !circle && /* @__PURE__ */ React.createElement(React.Fragment, null, icon && /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_func-bar_icon"
  }, icon), /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_func-bar_text ellipsis-2"
  }, text)), circle && /* @__PURE__ */ React.createElement("div", {
    className: "ellipsis"
  }, text), extraNode);
};
const Badge = ({children, out, color}) => {
  return /* @__PURE__ */ React.createElement("span", {
    className: clsx("m78-admin_badge", out && "__out", color && `__${color}`)
  }, children);
};
const Login = ({logo, title, desc, content}) => {
  return /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_login"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_login-bg"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_login-content"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "tc mb-24"
  }, logo && /* @__PURE__ */ React.createElement("img", {
    style: {width: 120},
    src: logo,
    alt: ""
  }), title && /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_login-title"
  }, title), desc && /* @__PURE__ */ React.createElement("div", {
    className: "color-second"
  }, desc)), content));
};
var TaskWindowTopBarTypeKeys;
(function(TaskWindowTopBarTypeKeys2) {
  TaskWindowTopBarTypeKeys2["toggle"] = "toggle";
  TaskWindowTopBarTypeKeys2["eclipse"] = "eclipse";
  TaskWindowTopBarTypeKeys2["always"] = "always";
})(TaskWindowTopBarTypeKeys || (TaskWindowTopBarTypeKeys = {}));
const builtInToggleIconRender = (toggle) => /* @__PURE__ */ React.createElement("span", {
  className: clsx("m78-admin_window-layout_top-bar-icon", toggle && "__active")
}, "\u2699");
function WindowLayout(_b) {
  var {
    children,
    side,
    anchors,
    footer,
    className,
    style,
    scrollRef,
    sideTabs,
    topBar,
    topBarType = TaskWindowTopBarTypeKeys.toggle,
    topBarDefaultShow = false,
    topBarIconCustomer = builtInToggleIconRender
  } = _b, ppp = __rest(_b, [
    "children",
    "side",
    "anchors",
    "footer",
    "className",
    "style",
    "scrollRef",
    "sideTabs",
    "topBar",
    "topBarType",
    "topBarDefaultShow",
    "topBarIconCustomer"
  ]);
  const [cLabel, setCLabel] = useState("");
  const self = useSelf();
  const calcNodeRef = useRef(null);
  const scrollNodeRef = useRef(null);
  const [topBarVisible, setBotBarVisible] = useState(topBarDefaultShow);
  const [sideVisible, setSideVisible] = useState(false);
  useEffect(() => {
    if (!(sideTabs == null ? void 0 : sideTabs.length)) {
      self.sections = null;
      return;
    }
    if (!cLabel)
      setCLabel(sideTabs[0].label);
    return retry(() => {
      var _a;
      self.sections = sideTabs.map((item) => ({
        el: scrollNodeRef.current.querySelector(item.selector),
        opt: item
      })).filter((item) => !!item.el);
      return !((_a = self.sections) == null ? void 0 : _a.length);
    }, 1e3, {maxRetry: 5});
  }, [sideTabs]);
  const scrollHandle = useFn(() => {
    var _a;
    if ((_a = self.sections) == null ? void 0 : _a.length) {
      const {top, height} = calcNodeRef.current.getBoundingClientRect();
      const h = height * 2;
      const visibleNodes = self.sections.filter((it) => {
        const bound = it.el.getBoundingClientRect();
        return bound.top - h < top;
      });
      if (visibleNodes.length) {
        const current = visibleNodes[visibleNodes.length - 1];
        const lb = current.opt.label;
        lb !== cLabel && setCLabel(lb);
      }
    }
  });
  const sc = useScroll({
    el: scrollNodeRef,
    onScroll: scrollHandle
  });
  const scrollToNode = useFn((label, selector) => {
    setCLabel(label);
    sc.scrollToElement(selector, true);
  });
  function renderSide() {
    if (!side && !(sideTabs == null ? void 0 : sideTabs.length))
      return null;
    let sideNode = side;
    if (sideTabs == null ? void 0 : sideTabs.length) {
      sideNode = /* @__PURE__ */ React.createElement(Scroller, {
        className: "m78-admin_window-layout_tab",
        scrollFlag: true,
        hideScrollbar: true
      }, sideTabs.map((item) => /* @__PURE__ */ React.createElement("div", {
        key: item.label,
        title: item.label,
        className: clsx("m78-admin_window-layout_tab-item", {
          __active: cLabel === item.label
        }),
        onClick: () => scrollToNode(item.label, item.selector)
      }, item.label)));
    }
    return /* @__PURE__ */ React.createElement(MediaQuery, null, (meta) => {
      const isSmall = meta.isSmall();
      return /* @__PURE__ */ React.createElement("div", {
        className: clsx("m78-admin_window-layout_side", {
          __responsive: isSmall,
          __hide: isSmall && !sideVisible
        })
      }, sideNode, isSmall && /* @__PURE__ */ React.createElement("span", {
        title: topBarVisible ? "\u6536\u8D77\u4FA7\u680F" : "\u5C55\u5F00\u4FA7\u680F",
        className: "m78-admin_window-layout_side-toggle",
        onClick: () => setSideVisible((p) => !p)
      }, "\u{1F4D1}"));
    });
  }
  const isAlways = topBarType === TaskWindowTopBarTypeKeys.always;
  const isToggle = topBarType === TaskWindowTopBarTypeKeys.toggle;
  return /* @__PURE__ */ React.createElement("div", __assign({
    className: clsx("m78-admin_window-layout", className),
    style
  }, ppp), renderSide(), /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_window-layout_main"
  }, topBar && /* @__PURE__ */ React.createElement("div", {
    className: clsx("m78-admin_window-layout_top-bar-wrap", isToggle && !topBarVisible && "__hide")
  }, /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_window-layout_top-bar m78-scrollbar"
  }, isFunction(topBar) ? topBar(topBarVisible) : topBar), !isAlways && /* @__PURE__ */ React.createElement("span", {
    title: topBarVisible ? "\u6536\u8D77\u9876\u680F" : "\u5C55\u5F00\u9876\u680F",
    className: "m78-admin_window-layout_top-bar-toggler",
    onClick: () => setBotBarVisible((p) => !p)
  }, topBarIconCustomer(topBarVisible))), /* @__PURE__ */ React.createElement("div", {
    ref: scrollNodeRef,
    className: "m78-admin_window-layout_content m78-scrollbar"
  }, children), footer && /* @__PURE__ */ React.createElement("div", {
    className: "m78-admin_window-layout_footer tr"
  }, footer), /* @__PURE__ */ React.createElement("div", {
    ref: calcNodeRef,
    className: "m78-admin_window-layout_calc-node"
  })));
}
const Link = (_c) => {
  var {children, replace: replace2, id, param, blank, className, style} = _c, ppp = __rest(_c, ["children", "replace", "id", "param", "blank", "className", "style"]);
  const ctx$1 = useContext(ctx);
  const openHandle = useFn(() => {
    if (blank) {
      replace2 ? task.replace(id, param) : task.push(id, param);
      return;
    }
    if (replace2) {
      ctx$1.parent ? ctx$1.parent.replace(id, param) : task.replace(id, param);
      return;
    }
    ctx$1.parent ? ctx$1.parent.push(id, param) : task.push(id, param);
  });
  if (typeof children === "string") {
    return /* @__PURE__ */ React.createElement("span", __assign(__assign({}, ppp), {
      className: clsx("m78-admin_link", className),
      style,
      onClick: openHandle
    }), children);
  }
  return React.cloneElement(children, {
    onClick: openHandle
  });
};
export {Badge, FuncBtn, Link, Login, M78AdminImpl as M78Admin, TaskWindowTopBarTypeKeys, WindowLayout, task};
