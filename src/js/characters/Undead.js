import Character from "../Character";


class Undead extends Character {
  constructor(level) {
    super(level, 'undead');
    this._attack = 40;
    this.defence = 10;
    this.moveRange = 4;
    this.attackRange = 1;
  }
}


export default Undead;