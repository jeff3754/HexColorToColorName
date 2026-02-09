import { COLOR_NAMES_MAP } from './color-names.js';
import type { ColorEntry, RGBTuple, HSLTuple } from './types.js';

export const getInvalidColorMessage = (code: string) => `Invalid Color: ${code}`;

/**
 * Converts a hex color string (e.g., "RRGGBB" without #) to its RGB components.
 * @param hexColor The hex color string (e.g., "RRGGBB").
 * @returns A tuple containing the R, G, and B integer components.
 */
export function rgb(hexColor: string): RGBTuple {
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  return [r, g, b];
}

/**
 * Converts a hex color string (e.g., "RRGGBB" without #) to its HSL components.
 * @param hexColor The hex color string (e.g., "RRGGBB").
 * @returns A tuple containing the H (0-360), S (0-100), and L (0-100) integer components.
 */
export function hsl(hexColor: string): HSLTuple {
  // Convert RGB to 0-1 range
  const [r, g, b] = rgb(hexColor).map((val) => val / 255);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0; // Hue
  let s = 0; // Saturation
  const l = (max + min) / 2; // Lightness

  if (max === min) {
    // achromatic (gray)
    h = 0;
    s = 0;
  } else {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }
    h /= 6;
  }

  // Convert to degrees (H) and percentage (S, L)
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Processes and normalizes a hex color string.
 * This function handles optional '#' prefix and expands 3-digit hex codes.
 * @param color The input color string (e.g., "000", "#FF00FF").
 * @returns A normalized 6-digit hex color string (without '#') in uppercase, or null if invalid.
 */
export function processHex(color: string): string | null {
  // Remove leading/trailing whitespace and optional '#' prefix, then convert to uppercase
  let hex = color.trim().replace(/^#/, '').toUpperCase();

  // Validate hex code format (3, 4, or 6 hexadecimal characters)
  if (!/^[0-9A-F]{3}$|^[0-9A-F]{4}$|^[0-9A-F]{6}$/.test(hex)) {
    return null; // Invalid hex code format
  }

  // Expand 3-digit hex to 6-digit (e.g., "F00" -> "FF0000")
  // or 4-digit hex (RGBA) to 6-digit RGB (e.g., "F00A" -> "FF0000"), discarding alpha
  if (hex.length === 3 || hex.length === 4) {
    const [r, g, b] = hex; // For 4-digit, the 4th char (alpha) is implicitly ignored
    hex = `${r}${r}${g}${g}${b}${b}`;
  }
  return hex;
}

/**
 * Pre-processes the COLOR_NAMES map into an array of ColorEntry tuples.
 * This array contains the hex code (without #), the color name, and their
 * calculated RGB and HSL components, enabling efficient closest-match calculations.
 * This is done once at module load for performance.
 */
export const PROCESSED_COLOR_NAMES: ColorEntry[] = Array.from(COLOR_NAMES_MAP.entries()).map(([hexCode, name]) => [
  hexCode,
  name,
  rgb(hexCode),
  hsl(hexCode),
]);

/**
 * Finds the human-readable name for a given hex color code.
 * It first attempts an exact match, then falls back to a closest-match algorithm.
 * @param processedHexCode A normalized 6-digit hex color string (without '#').
 * @returns The determined color name.
 */
export function findColorName(processedHexCode: string): string {
  // 1. Attempt exact match using the COLOR_NAMES map for O(1) lookup
  const exactMatch = COLOR_NAMES_MAP.get(processedHexCode);
  if (exactMatch) {
    return exactMatch;
  }

  // 2. If no exact match, perform closest-match calculation
  // Get RGB and HSL components for the input color
  const [r, g, b] = rgb(processedHexCode); // 0-255
  const [h, s, l] = hsl(processedHexCode); // H: 0-360, S/L: 0-100

  let minDistance = -1; // Initialize with a value indicating no match found yet
  let closestColorName = `Closest Match for #${processedHexCode}`; // Fallback name

  // Iterate through the pre-processed color names to find the closest match
  for (const nameEntry of PROCESSED_COLOR_NAMES) {
    const [, entryName, entryRGB, entryHSL] = nameEntry;

    // Calculate Euclidean distance in RGB color space
    const rgbDistance = Math.pow(r - entryRGB[0], 2) + Math.pow(g - entryRGB[1], 2) + Math.pow(b - entryRGB[2], 2);

    // Calculate Euclidean distance in HSL color space.
    // HSL is weighted more heavily as it often aligns better with human perception.
    const hslDistance = Math.pow(h - entryHSL[0], 2) + Math.pow(s - entryHSL[1], 2) + Math.pow(l - entryHSL[2], 2);

    // Combine RGB and HSL distances
    const totalDistance = rgbDistance + hslDistance * 2;

    // Update closest match if current color is closer
    if (minDistance === -1 || totalDistance < minDistance) {
      minDistance = totalDistance;
      closestColorName = entryName;
    }
  }

  return closestColorName;
}
