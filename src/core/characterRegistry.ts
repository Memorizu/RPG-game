import Bowman from "./characters/Bowman";
import Daemon from "./characters/Daemon";
import Magician from "./characters/Magician";
import Swordsman from "./characters/Swordsman";
import Undead from "./characters/Undead";
import Vampire from "./characters/Vampire";


export const CHARACTER_REGISTRY = {
  player: {
    bowman: Bowman,
    swordsman: Swordsman,
    magician: Magician,
  },
  enemy: {
    daemon: Daemon,
    undead: Undead,
    vampire: Vampire,
  },
} as const;
