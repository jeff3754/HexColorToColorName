# 🎨 HexColorToColorName

[![npm version](https://img.shields.io/npm/v/hex-color-to-color-name.svg)](https://www.npmjs.com/package/hex-color-to-color-name)
[![NPM Weekly Downloads](https://img.shields.io/npm/dw/hex-color-to-color-name)](https://www.npmjs.com/package/hex-color-to-color-name)
[![npm provenance](https://img.shields.io/badge/npm-provenance-blue)](https://www.npmjs.com/package/hex-color-to-color-name?activeTab=code)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Test Status](https://github.com/jeff3754/HexColorToColorName/actions/workflows/test.yml/badge.svg)](https://github.com/jeff3754/HexColorToColorName/actions)

A lightweight, zero-dependency TypeScript library that maps hex codes to the closest human-readable color names. Perfect for accessibility, UI/UX tools, and design systems.

## ✨ Features
- **Accurate Matching**: Uses mathematical distance in RGB and HSL color spaces to find the closest color name if an exact match isn't found.
- **Flexible Input**: Supports 3, 4 (RGBA - alpha ignored), and 6-digit hex codes, with or without the `#` prefix.
- **TypeScript Ready**: Full type definitions included out of the box, ensuring robust and predictable usage.
- **Lightweight**: Zero external runtime dependencies.
- **Fast**: Optimized lookup with pre-processed color data for high-performance applications.

---

## 🚀 Installation

Install via npm:

```bash
npm install hex-color-to-color-name
```

Or via yarn:

```bash
yarn add hex-color-to-color-name
``` 

## 🛠 Usage

### `GetColorName(code: string)`: Basic Color Name Lookup

Pass a hex string (with or without the # symbol, including 4-digit RGBA) to get the most accurate human-readable name. If no exact match is found, it returns the closest known color name.

```ts
import { GetColorName } from "hex-color-to-color-name";

// Exact matches
const color1 = GetColorName("#000000"); // returns "Black"
const color2 = GetColorName("ff0000"); // returns "Red"
const color3 = GetColorName("#f5f5dc"); // returns "Beige"

// Closest matches for non-exact hex codes
const approximateColor1 = GetColorName("#1a1a1b"); // returns "Black"
const approximateColor2 = GetColorName("1E90F0"); // returns "Dodger Blue"

// 4-digit hex codes (alpha ignored)
const rgbaColor = GetColorName("#F00A"); // returns "Red" (alpha channel 'A' is ignored)
const rgbaColorNoHash = GetColorName("000F"); // returns "Black" (alpha channel 'F' is ignored)
```

### `GetColorPacket(code: string)`: Detailed Color Information

Use `GetColorPacket` to retrieve a comprehensive `ColorPacket` object, which includes the resolved `colorName` (exact or closest match), the normalized `hexCode`, and its `rgb` and `hsl` components. Even for invalid inputs, it returns a `ColorPacket` with an "Invalid Color" name and default `rgb/hsl` values.

```ts
import { GetColorPacket, ColorPacket } from "hex-color-to-color-name";

// For an exact match
const blackPacket: ColorPacket = GetColorPacket("#000000");
/*
{
  colorName: "Black",
  hexCode: "000000",
  rgb: { r: 0, g: 0, b: 0 },
  hsl: { h: 0, s: 0, l: 0 }
}
*/

// For a closest match
const approximatePacket: ColorPacket = GetColorPacket("#1a1a1b");
/*
{
  colorName: "Black",
  hexCode: "1A1A1B",
  rgb: { r: 26, g: 26, b: 27 },
  hsl: { h: 240, s: 2, l: 10 }
}
*/

// For a 4-digit hex code
const rgbaPacket: ColorPacket = GetColorPacket("#F00A");
/*
{
  colorName: "Red",
  hexCode: "FF0000",
  rgb: { r: 255, g: 0, b: 0 },
  hsl: { h: 0, s: 100, l: 50 }
}
*/

// For an invalid hex code
const invalidPacket: ColorPacket = GetColorPacket("not-a-color");
/*
{
  colorName: "Invalid Color: not-a-color",
  hexCode: "not-a-color", // Original invalid input is preserved
  rgb: { r: 0, g: 0, b: 0 },
  hsl: { h: 0, s: 0, l: 0 }
}
*/
```

## 🤝 Contributing

Pull requests are welcome. Please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## ☕ Support

If you find this library useful, consider supporting the development by buying me a [Ko-Fi](https://ko-fi.com/jefferinjoseph)! ☕❤️

## 📄 License
[MIT](https://choosealicense.com/licenses/mit/)

Maintained by [Jefferin Joseph](https://github.com/jeff3754)
