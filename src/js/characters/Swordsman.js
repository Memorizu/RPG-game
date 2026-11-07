import Character from "../Character";


class Swordsman extends Character {
  constructor(level) {
    super(level, 'swordsman');
    this._attack = 30;
    this.defence = 20;
    this.moveRange = 4;
    this.attackRange = 1;
  }
}


export default Swordsman;
