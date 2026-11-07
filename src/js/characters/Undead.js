import Character from "../Character";


class Undead extends Character {
  constructor(level) {
    super(level, 'undead');
    this._attack = 30;
    this.defence = 20;
    this.moveRange = 4;
    this.attackRange = 1;
  }
}


export default Undead;