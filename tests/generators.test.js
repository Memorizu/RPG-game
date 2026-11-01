import { characterGenerator, generateTeam } from '../src/js/generators';
import Bowman from '../src/js/characters/Bowman';
import Swordsman from '../src/js/characters/Swordsman';
import Magician from '../src/js/characters/Magician';
import Team from '../src/js/Team';


describe('characterGenerator', () => {
  const allowedTypes = [Bowman, Swordsman, Magician];
  const maxLevel = 4;

  test('generates instances of allowed classes', () => {
    const generator = characterGenerator(allowedTypes, maxLevel);

    for (let i = 0; i < 100; i++) {
      const character = generator.next().value;

      expect(
        allowedTypes.some((CharacterClass) => character instanceof CharacterClass),
      ).toBe(true);
    }
  });

  test('generates new character on every call', () => {
    const generator = characterGenerator(allowedTypes, maxLevel);

    const first = generator.next().value;
    const second = generator.next().value;

    expect(first).not.toBe(second);
  });

  test('generates characters with level from 1 to maxLevel', () => {
    const generator = characterGenerator(allowedTypes, maxLevel);

    for (let i = 0; i < 100; i++) {
      const character = generator.next().value;

      expect(character.level).toBeGreaterThanOrEqual(1);
      expect(character.level).toBeLessThanOrEqual(maxLevel);
    }
  });

  test('generates characters infinitely', () => {
    const generator = characterGenerator(allowedTypes, maxLevel);

    for (let i = 0; i < 1000; i++) {
      const result = generator.next();

      expect(result.done).toBe(false);
      expect(result.value).toBeInstanceOf(Object);
    }
  });
});

describe('generateTeam', () => {
  const allowedTypes = [Bowman, Swordsman, Magician];

  test('returns Team instance', () => {
    const team = generateTeam(allowedTypes, 4, 3);

    expect(team).toBeInstanceOf(Team);
  });

  test('generates the required number of characters', () => {
    const team = generateTeam(allowedTypes, 4, 5);

    expect(team.members.size).toBe(5);
  });

  test('generates characters of allowed classes', () => {
    const team = generateTeam(allowedTypes, 4, 10);

    for (const character of team.members) {
      expect(
        allowedTypes.some((CharacterClass) => character instanceof CharacterClass),
      ).toBe(true);
    }
  });

  test('generates characters with levels in the required range', () => {
    const maxLevel = 4;
    const team = generateTeam(allowedTypes, maxLevel, 100);

    for (const character of team.members) {
      expect(character.level).toBeGreaterThanOrEqual(1);
      expect(character.level).toBeLessThanOrEqual(maxLevel);
    }
  });
});