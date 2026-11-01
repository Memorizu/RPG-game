
const allowedCharacterTypes = [
  'daemon',
  'undead',
  'vampire',
  'swordsman',
  'bowman',
  'magician',
];


export default class Character {
  constructor(level, type) {
    if (new.target === Character) {
      throw new Error('Character is an abstract class');
    }

    if (!allowedCharacterTypes.includes(type)) {
      throw new Error(`Invalid character type: ${type}`);
    }

    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
  }
}