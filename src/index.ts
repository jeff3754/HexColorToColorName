/*

+-----------------------------------------------------------------+
|     Inspired by Chirag Mehta - http://chir.ag/projects/ntc      |
|-----------------------------------------------------------------|
|               ntc js (Name that Color JavaScript)               |
+-----------------------------------------------------------------+
*/

import { rgb, hsl, processHex, findColorName, getInvalidColorMessage } from './internal/color-utils.js';
import type { ColorPacket } from './internal/types.js';

/**
 * Gets the closest human-readable color name for a given hex color code.
 *
 * This function first attempts an exact match for the provided hex code.
 * If no exact match is found, it then performs a closest-match algorithm
 * by calculating a combined distance in RGB and HSL color spaces against
 * a pre-processed list of known colors.
 *
 * @param code The hex color code (e.g., "000000", "#FF0000", "F00").
 * @returns The human-readable color name as a string.
 *          If the hex code is invalid, it returns a string indicating the invalidity.
 */
export const GetColorName = (code: string): string => {
  // Normalize the input hex code
  const processedHexCode = processHex(code);
  if (processedHexCode === null) {
    return getInvalidColorMessage(code);
  }

  // Find the color name using the centralized helper
  return findColorName(processedHexCode);
};

/**
 * Gets a detailed color packet for a given hex color code, including the closest human-readable name.
 *
 * This function determines the color name (exact or closest match) and provides
 * the normalized hex code and its RGB and HSL components.
 *
 * @param code The hex color code (e.g., "000000", "#FF0000", "F00").
 * @returns A ColorPacket object containing all color information.
 */
export const GetColorPacket = (code: string): ColorPacket => {
  const processedHexCode = processHex(code);
  const colorName = processedHexCode === null ? getInvalidColorMessage(code) : findColorName(processedHexCode);

  // Get RGB and HSL values. For invalid hex, default to 0.
  const [r, g, b] = processedHexCode ? rgb(processedHexCode) : [0, 0, 0];
  const [h, s, l] = processedHexCode ? hsl(processedHexCode) : [0, 0, 0];

  return {
    colorName,
    hexCode: processedHexCode || code, // Return original code if processed is null
    rgb: { r, g, b },
    hsl: { h, s, l },
  };
};
