
export type CharacterType =
  | 'bowman'
  | 'swordsman'
  | 'magician'
  | 'daemon'
  | 'undead'
  | 'vampire';


export type Faction = 'player' | 'enemy';


export interface CharacterStats {
  attack: number;
  defence: number;
  health: number;
  moveRange: number;
  attackRange: number;
}
