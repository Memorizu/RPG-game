import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';

import Daemon from '../characters/Daemon';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';


interface GameConfig {
  boardSize: number;
  teamSize: number;
  storage: Storage;
  maxLevel: number;
}

export const gameConfig: GameConfig = {
  boardSize: 8,
  teamSize: 3,
  maxLevel: 10,
  storage: localStorage,
};
