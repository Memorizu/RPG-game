import { calcTileType } from "../src/js/utils";
import { showCharacterInfo } from "../src/js/utils";


describe('calcTileType', () => {
  const boardSize = 8;

  test.each([
    [0, 'top-left'],
    [7, 'top-right'],
    [1, 'top'],
    [56, 'bottom-left'],
    [63, 'bottom-right'],
    [57, 'bottom'],
    [15, 'right'],
    [8, 'left'],
    [10, 'center'],
  ])('index %i returns %s', (index, expected) => {
    expect(calcTileType(index, boardSize)).toBe(expected);
  });
});


describe('calcTileType — invalid arguments', () => {
  test.each([
    [64, 8],
    [-1, 8],
  ])('throws RangeError for index %i and boardSize %i', (index, boardSize) => {
    expect(() => calcTileType(index, boardSize)).toThrow(RangeError);
  });

  test.each([
    [0, 0],
    [0, -1],
  ])('throws RangeError for invalid boardSize %i', (index, boardSize) => {
    expect(() => calcTileType(index, boardSize)).toThrow(RangeError);
  });

  test.each([
    [1.5, 8],
    [0, 2.5],
  ])('throws TypeError for non-integer arguments', (index, boardSize) => {
    expect(() => calcTileType(index, boardSize)).toThrow(TypeError);
  });
});


describe('showCharacterInfo', () => {
  test('must return correct string', () => {
    const result = showCharacterInfo(1, 10, 40, 50);

    expect(result).toBe('🎖1 ⚔10 🛡40 ❤50');
  });

  test('must handle zero stats correctly', () => {
    const result = showCharacterInfo(0, 0, 0, 0);

    expect(result).toBe('🎖0 ⚔0 🛡0 ❤0');
  });
});
