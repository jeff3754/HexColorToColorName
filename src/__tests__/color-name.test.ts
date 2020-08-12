import { GetColorName } from '../index';

test('Get Color Name', () => {
  expect(GetColorName('#000000')).toBe('Black');
});