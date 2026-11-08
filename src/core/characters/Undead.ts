import Character from "./Character";
import { Faction } from "../types";


class Undead extends Character {
  constructor(faction: Faction) {
    super(faction, {
      attack: 30,
      defence: 20,
      health: 100,
      moveRange: 4,
      attackRange: 1,
    });
  }
}


export default Undead;
