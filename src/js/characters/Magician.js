import Character from "../Character";


class Magician extends Character {
  constructor(level) {
    super(level, 'magician');
    this._attack = 10;
    this.defence = 40;
    this.moveRange = 1;
    this.attackRange = 4;
  }
}


export default Magician;
