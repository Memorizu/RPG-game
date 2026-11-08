import Character from "./Character";
import type { Faction } from "../types";


class Daemon extends Character {
  constructor(faction: Faction) {
    super(faction, {
      attack: 30,
      defence: 10,
      health: 100,
      moveRange: 1,
      attackRange: 4,
    });
  }
}


export default Daemon;
