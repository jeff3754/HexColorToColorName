export type RGBTuple = [number, number, number];
export type HSLTuple = [number, number, number];
export type ColorEntry = [string, string, RGBTuple, HSLTuple];

export type ColorPacket = {
  colorName: string;
  hexCode: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
};
