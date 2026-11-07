import Character from "../Character";


class Daemon extends Character {
  constructor(level) {
    super(level, 'daemon');
    this._attack = 30;
    this.defence = 10;
    this.moveRange = 1;
    this.attackRange = 4;
  }
}


export default Daemon;
