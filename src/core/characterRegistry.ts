import Bowman from "./characters/Bowman";
import Daemon from "./characters/Daemon";
import Magician from "./characters/Magician";
import Swordsman from "./characters/Swordsman";
import Undead from "./characters/Undead";
import Vampire from "./characters/Vampire";

import { CharacterClasses } from "./types";



const playerClasses: CharacterClasses = [
  Bowman,
  Swordsman,
  Magician,
];

const enemyClasses: CharacterClasses = [
  Daemon,
  Undead,
  Vampire,
];


export { playerClasses, enemyClasses };
