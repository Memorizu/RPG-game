import Character from "../Character";


class Vampire extends Character {
  constructor(level) {
    super(level, 'vampire');
    this._attack = 25;
    this.defence = 25;
    this.moveRange = 2;
    this.attackRange = 2;
  }
}


export default Vampire;
