import Character from '../src/js/Character';
import Bowman from '../src/js/characters/Bowman';
import Swordsman from '../src/js/characters/Swordsman';
import Magician from '../src/js/characters/Magician';
import Daemon from '../src/js/characters/Daemon';
import Undead from '../src/js/characters/Undead';
import Vampire from '../src/js/characters/Vampire';


describe('Character', () => {
  test('throws when creating Character instance', () => {
    expect(() => new Character(1, 'bowman')).toThrow();
  });

  test.each([
    [Bowman, 'bowman'],
    [Swordsman, 'swordsman'],
    [Magician, 'magician'],
    [Daemon, 'daemon'],
    [Undead, 'undead'],
    [Vampire, 'vampire'],
  ])('allows creating %s instance', (CharacterClass, type) => {
    const character = new CharacterClass(1);

    expect(character).toBeInstanceOf(Character);
    expect(character.type).toBe(type);
  });
});


describe('Character level 1 stats', () => {
  test.each([
    [Bowman, 'bowman', 25, 25],
    [Swordsman, 'swordsman', 40, 10],
    [Magician, 'magician', 10, 40],
    [Daemon, 'daemon', 10, 10],
    [Undead, 'undead', 40, 10],
    [Vampire, 'vampire', 25, 25],
  ])(
    '%s has correct level 1 stats',
    (CharacterClass, type, attack, defence) => {
      const character = new CharacterClass(1);

      expect(character).toMatchObject({
        level: 1,
        type,
        attack,
        defence,
        health: 50,
      });
    },
  );
});