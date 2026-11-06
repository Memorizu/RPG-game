
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
    this._attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    this.moveRange = 0;
    this.attackRange = 0;
  }

  levelUp() {
    
  }

  attack(enemy) {

    if (!(enemy instanceof Character)) {
      throw new Error('enemy must be instance of Character');
    }
    return Math.max(this._attack - enemy.defence, this._attack * 0.1)
  }

  getDamage(damage) {
    this.health -= damage;
  }

  isAlive() {
    return this.health > 0;
  }


}