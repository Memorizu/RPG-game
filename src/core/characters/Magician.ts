import Character from "./Character";
import type { Faction } from "../types";


class Magician extends Character {
  constructor(faction: Faction) {
    super(faction, {
      attack: 50,
      defence: 5,
      health: 100,
      moveRange: 1,
      attackRange: 4,
    });
  }
}


export default Magician;
