import Character from "../Character";


class Vampire extends Character {
  constructor(level) {
    super(level, 'vampire');
    this._attack = 50;
    this.defence = 5;
    this.moveRange = 2;
    this.attackRange = 2;
  }
}


export default Vampire;
