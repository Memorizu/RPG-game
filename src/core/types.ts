import Character from "./characters/Character";
import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import Daemon from "./characters/Daemon";
import Undead from "./characters/Undead";
import Vampire from "./characters/Vampire";


export type CharacterType =
  | 'bowman'
  | 'swordsman'
  | 'magician'
  | 'daemon'
  | 'undead'
  | 'vampire';


export type EnemyType =
  | 'daemon'
  | 'undead'
  | 'vampire';


export type PlayerType =
  | 'bowman'
  | 'swordsman'
  | 'magician';


export type Faction = 'player' | 'enemy';

export type Theme =
  | 'prairie'
  | 'desert'
  | 'arctic'
  | 'mountain';


export type CellListener = (index: number) => void;

export type ActionListener = () => void;

export type CharacterConstructor = new (faction: Faction) => Character;
export type CharacterClasses = CharacterConstructor[];

export type CharacterWithPosition = {
  character: Character;
  position: number;
}

export type CharacterStats = {
  attack: number;
  defence: number;
  health: number;
  moveRange: number;
  attackRange: number;
}
