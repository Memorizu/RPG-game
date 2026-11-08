import Character from "./Character";
import { Faction } from "../types";


class Swordsman extends Character {
  constructor(faction: Faction) {
    super(faction, {
      attack: 40,
      defence: 5,
      health: 100,
      moveRange: 2,
      attackRange: 2,
    });
  }
}


export default Swordsman;
