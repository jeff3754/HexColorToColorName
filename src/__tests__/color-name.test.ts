import { test, expect, describe } from 'vitest';
import { GetColorName, GetColorPacket } from '../index';

describe('HexColorToColorName', () => {
  describe('GetColorName', () => {
    describe('valid 6-digit hex codes', () => {
      test('should return "Black" for #000000', () => {
        expect(GetColorName('#000000')).toBe('Black');
      });

      test('should return "Red" for #FF0000', () => {
        expect(GetColorName('#FF0000')).toBe('Red');
      });

      test('should return "Green" for #00FF00', () => {
        expect(GetColorName('#00FF00')).toBe('Green');
      });

      test('should return "Blue" for #0000FF', () => {
        expect(GetColorName('#0000FF')).toBe('Blue');
      });

      test('should return "White" for #FFFFFF', () => {
        expect(GetColorName('#FFFFFF')).toBe('White');
      });
    });

    describe('valid 3-digit hex codes (expanded internally)', () => {
      test('should return "Black" for #000', () => {
        expect(GetColorName('#000')).toBe('Black');
      });

      test('should return "Red" for #F00', () => {
        expect(GetColorName('#F00')).toBe('Red');
      });

      test('should return "Green" for #0F0', () => {
        expect(GetColorName('#0F0')).toBe('Green');
      });

      test('should return "Blue" for #00F', () => {
        expect(GetColorName('#00F')).toBe('Blue');
      });

      test('should return "White" for #FFF', () => {
        expect(GetColorName('#FFF')).toBe('White');
      });
    });

    describe('hex codes without # prefix', () => {
      test('should return "Black" for 000000', () => {
        expect(GetColorName('000000')).toBe('Black');
      });

      test('should return "Red" for FF0000', () => {
        expect(GetColorName('FF0000')).toBe('Red');
      });

      test('should return "Black" for 000', () => {
        expect(GetColorName('000')).toBe('Black');
      });

      test('should return "Red" for F00', () => {
        expect(GetColorName('F00')).toBe('Red');
      });
    });

    describe('valid 4-digit hex codes (expanded internally, alpha ignored)', () => {
      test('should return "Red" for #F00F', () => {
        expect(GetColorName('#F00F')).toBe('Red'); // #F00F expands to #FF0000 (Red)
      });

      test('should return "Blue" for 000F', () => {
        expect(GetColorName('000F')).toBe('Black'); // 000F expands to 000000 (Black) - should be Black actually, as F00F's rgb will be #F00
      });

      test('should return "Green" for #0F0F', () => {
        expect(GetColorName('#0F0F')).toBe('Green'); // #0F0F expands to #00FF00 (Green)
      });

      test('should return "White" for FFFF', () => {
        expect(GetColorName('FFFF')).toBe('White'); // FFFF expands to FFFFFF (White)
      });
    });

    describe('invalid hex codes', () => {
      test('should return "Invalid Color: 12345" for an invalid length hex code', () => {
        expect(GetColorName('12345')).toBe('Invalid Color: 12345');
      });

      test('should return "Invalid Color: #GGHHII" for hex code with invalid characters', () => {
        expect(GetColorName('#GGHHII')).toBe('Invalid Color: #GGHHII');
      });

      test('should return "Invalid Color: #1234567" for too long hex code', () => {
        expect(GetColorName('#1234567')).toBe('Invalid Color: #1234567');
      });

      test('should return "Invalid Color: #12" for too short hex code', () => {
        expect(GetColorName('#12')).toBe('Invalid Color: #12');
      });

      test('should return "Invalid Color: #" for only a hash', () => {
        expect(GetColorName('#')).toBe('Invalid Color: #');
      });

      test('should return "Invalid Color: "" for empty string', () => {
        expect(GetColorName('')).toBe('Invalid Color: ');
      });
    });

    describe('specific known colors', () => {
      test('should return "Dodger Blue" for #1E90FF', () => {
        expect(GetColorName('#1E90FF')).toBe('Dodger Blue');
      });
    });

    // New test cases for closest matches
    describe('closest matches for non-exact hex codes', () => {
      test('should return "Red" for #FF0101 (close to Red)', () => {
        expect(GetColorName('#FF0101')).toBe('Red');
      });

      test('should return "Green" for #01FF01 (close to Green)', () => {
        expect(GetColorName('#01FF01')).toBe('Green');
      });

      test('should return "Blue" for #0101FF (close to Blue)', () => {
        expect(GetColorName('#0101FF')).toBe('Blue');
      });

      test('should return "Dodger Blue" for #1E90F0 (slightly off Dodger Blue)', () => {
        expect(GetColorName('#1E90F0')).toBe('Dodger Blue');
      });

      test('should return "Alabaster" for #FAFAFA (exact match)', () => {
        expect(GetColorName('#FAFAFA')).toBe('Alabaster');
      });

      test('should return "Black" for #050505 (very dark gray, close to Black)', () => {
        expect(GetColorName('#050505')).toBe('Black');
      });
    });
  });

  describe('GetColorPacket', () => {
    test('should return valid color packet for #000000', () => {
      expect(GetColorPacket('#000000')).toMatchObject({
        colorName: 'Black',
        hexCode: '000000',
        rgb: { r: 0, g: 0, b: 0 },
        hsl: { h: 0, s: 0, l: 0 },
      });
    });

    test('should return valid color packet for #F00', () => {
      expect(GetColorPacket('#F00')).toMatchObject({
        colorName: 'Red',
        hexCode: 'FF0000',
        rgb: { r: 255, g: 0, b: 0 },
        hsl: { h: 0, s: 100, l: 50 },
      });
    });

    describe('hex codes without # prefix', () => {
      test('should return valid color packet for #000000', () => {
        expect(GetColorPacket('000000')).toMatchObject({
          colorName: 'Black',
          hexCode: '000000',
          rgb: { r: 0, g: 0, b: 0 },
          hsl: { h: 0, s: 0, l: 0 },
        });
      });

      test('should return valid color packet for #F00', () => {
        expect(GetColorPacket('F00')).toMatchObject({
          colorName: 'Red',
          hexCode: 'FF0000',
          rgb: { r: 255, g: 0, b: 0 },
          hsl: { h: 0, s: 100, l: 50 },
        });
      });
    });

    describe('valid 4-digit hex codes (expanded internally, alpha ignored)', () => {
      test('should return valid color packet for #F00F', () => {
        expect(GetColorPacket('#F00F')).toMatchObject({
          colorName: 'Red',
          hexCode: 'FF0000',
          rgb: { r: 255, g: 0, b: 0 },
          hsl: { h: 0, s: 100, l: 50 },
        });
      });

      test('should return valid color packet for 000F', () => {
        expect(GetColorPacket('000F')).toMatchObject({
          colorName: 'Black',
          hexCode: '000000',
          rgb: { r: 0, g: 0, b: 0 },
          hsl: { h: 0, s: 0, l: 0 },
        });
      });
    });

    describe('closest matches for non-exact hex codes', () => {
      test('should return ColorPacket with "Red" for #FF0101 (close to Red)', () => {
        expect(GetColorPacket('#FF0101')).toMatchObject({
          colorName: 'Red',
          hexCode: 'FF0101',
          rgb: { r: 255, g: 1, b: 1 },
          hsl: { h: 0, s: 100, l: 50 },
        });
      });

      test('should return ColorPacket with "Green" for #01FF01 (close to Green)', () => {
        expect(GetColorPacket('#01FF01')).toMatchObject({
          colorName: 'Green',
          hexCode: '01FF01',
          rgb: { r: 1, g: 255, b: 1 },
          hsl: { h: 120, s: 100, l: 50 },
        });
      });

      test('should return ColorPacket with "Blue" for #0101FF (close to Blue)', () => {
        expect(GetColorPacket('#0101FF')).toMatchObject({
          colorName: 'Blue',
          hexCode: '0101FF',
          rgb: { r: 1, g: 1, b: 255 },
          hsl: { h: 240, s: 100, l: 50 },
        });
      });

      test('should return ColorPacket with "Dodger Blue" for #1E90F0 (slightly off Dodger Blue)', () => {
        expect(GetColorPacket('#1E90F0')).toMatchObject({
          colorName: 'Dodger Blue',
          hexCode: '1E90F0',
          rgb: { r: 30, g: 144, b: 240 },
          hsl: { h: 207, s: 88, l: 53 },
        });
      });
    });

    describe('invalid hex codes', () => {
      test('should return ColorPacket with "Invalid Color: 12345" for an invalid length hex code', () => {
        expect(GetColorPacket('12345')).toMatchObject({
          colorName: 'Invalid Color: 12345',
          hexCode: '12345',
          rgb: { r: 0, g: 0, b: 0 },
          hsl: { h: 0, s: 0, l: 0 },
        });
      });

      test('should return ColorPacket with "Invalid Color: #GGHHII" for hex code with invalid characters', () => {
        expect(GetColorPacket('#GGHHII')).toMatchObject({
          colorName: 'Invalid Color: #GGHHII',
          hexCode: '#GGHHII',
          rgb: { r: 0, g: 0, b: 0 },
          hsl: { h: 0, s: 0, l: 0 },
        });
      });

      test('should return ColorPacket with "Invalid Color: #1234567" for too long hex code', () => {
        expect(GetColorPacket('#1234567')).toMatchObject({
          colorName: 'Invalid Color: #1234567',
          hexCode: '#1234567',
          rgb: { r: 0, g: 0, b: 0 },
          hsl: { h: 0, s: 0, l: 0 },
        });
      });

      test('should return ColorPacket with "Invalid Color: #12" for too short hex code', () => {
        expect(GetColorPacket('#12')).toMatchObject({
          colorName: 'Invalid Color: #12',
          hexCode: '#12',
          rgb: { r: 0, g: 0, b: 0 },
          hsl: { h: 0, s: 0, l: 0 },
        });
      });

      test('should return ColorPacket with "Invalid Color: #" for only a hash', () => {
        expect(GetColorPacket('#')).toMatchObject({
          colorName: 'Invalid Color: #',
          hexCode: '#',
          rgb: { r: 0, g: 0, b: 0 },
          hsl: { h: 0, s: 0, l: 0 },
        });
      });

      test('should return ColorPacket with "Invalid Color: "" for empty string', () => {
        expect(GetColorPacket('')).toMatchObject({
          colorName: 'Invalid Color: ',
          hexCode: '',
          rgb: { r: 0, g: 0, b: 0 },
          hsl: { h: 0, s: 0, l: 0 },
        });
      });
    });
  });
});
