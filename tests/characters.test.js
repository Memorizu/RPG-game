import Bowman from '../src/js/characters/Bowman';
import Daemon from '../src/js/characters/Daemon';
import Magician from '../src/js/characters/Magician';
import Swordsman from '../src/js/characters/Swordsman';
import Undead from '../src/js/characters/Undead';
import Vampire from '../src/js/characters/Vampire';

import { getAvailableCells } from '../src/js/utils';



describe.each([
  [Bowman, 'bowman', 25, 25, 2, 2],
  [Daemon, 'daemon', 10, 10, 1, 4],
  [Magician, 'magician', 10, 40, 1, 4],
  [Swordsman, 'swordsman', 40, 10, 4, 1],
  [Undead, 'undead', 40, 10, 4, 1],
  [Vampire, 'vampire', 25, 25, 2, 2],
])(
  '%s',
  (CharacterClass, type, attack, defence, moveRange, attackRange) => {
    let character;

    beforeEach(() => {
      character = new CharacterClass(1);
    });

    test('имеет правильный тип', () => {
      expect(character.type).toBe(type);
    });

    test('имеет правильную атаку', () => {
      expect(character.attack).toBe(attack);
    });

    test('имеет правильную защиту', () => {
      expect(character.defence).toBe(defence);
    });

    test('имеет правильную дальность движения', () => {
      expect(character.moveRange).toBe(moveRange);
    });

    test('имеет правильную дальность атаки', () => {
      expect(character.attackRange).toBe(attackRange);
    });
  },
);


describe.each([
  [Bowman, 2, 2],
  [Daemon, 1, 4],
  [Magician, 1, 4],
  [Swordsman, 4, 1],
  [Undead, 4, 1],
  [Vampire, 2, 2],
])('%s: движение и атака', (CharacterClass, moveRange, attackRange) => {
  test('возвращает правильное количество клеток движения', () => {
    const character = new CharacterClass(1);

    const cells = getAvailableCells(8, 27, character.moveRange);

    expect(cells).toHaveLength((2 * moveRange + 1) ** 2 - 1);
  });

  test('возвращает правильное количество клеток атаки', () => {
    const character = new CharacterClass(1);

    const cells = getAvailableCells(8, 27, character.attackRange);

    expect(cells).toHaveLength((2 * attackRange + 1) ** 2 - 1);
  });
});