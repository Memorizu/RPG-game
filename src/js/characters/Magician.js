import Character from "../Character";


class Magician extends Character {
  constructor(level) {
    super(level, 'magician');
    this._attack = 50;
    this.defence = 5;
    this.moveRange = 1;
    this.attackRange = 4;
  }
}


export default Magician;
