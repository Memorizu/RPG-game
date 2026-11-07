import Character from '../Character';


class Bowman extends Character {
  constructor(level) {
    super(level, 'bowman');
    this._attack = 40;
    this.defence = 5;
    this.moveRange = 2;
    this.attackRange = 2;
  }
}


export default Bowman;
