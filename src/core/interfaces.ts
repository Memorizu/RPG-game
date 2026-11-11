import GameBoard from "./gameBoard";
import { Faction } from "./types";

export interface CharacterStats {
  attack: number;
  defence: number;
  health: number;
  moveRange: number;
  attackRange: number;
}


export interface State {
  currentPlayer: Faction;
  selectedCell: number | null;
  board: GameBoard;
}


export interface GameStateDTO {
  currentPlayer: Faction;
  selectedCell: number | null;
  board: {
    boardSize: number;
    theme: string;
    characters: {
      position: number;
      character: CharacterDTO;
    }[];
  };
}


export interface CharacterDTO {
  type: string;
  level: number;
  health: number;
  attack: number;
  defence: number;
}