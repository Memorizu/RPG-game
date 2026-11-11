import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import Daemon from "./characters/Daemon";
import Undead from "./characters/Undead";
import Vampire from "./characters/Vampire";

import GameBoard from "./gameBoard";

import { State } from "./interfaces";
import { GameStateDTO } from "./interfaces";

const characterTypes = {
  Bowman,
  Swordsman,
  Magician,
  Daemon,
  Undead,
  Vampire,
};

export default class GameStateMapper {
  static toDTO(state: State): GameStateDTO {
    const characters = [...state.board.getCharacters()].map(
      ([position, character]) => ({
        position,
        character: {
          type: character.constructor.name,
          level: character.level,
          health: character.health,
          attack: character.attack,
          defence: character.defence,
        },
      }),
    );

    return {
      currentPlayer: state.currentPlayer,
      selectedCell: state.selectedCell,
      board: {
        boardSize: state.board.boardSize,
        theme: state.board.theme,
        characters,
      },
    };
  }

  static toState(dto: GameStateDTO): State {
    const board = new GameBoard(
      dto.board.boardSize,
      dto.board.theme,
    );

    for (const info of dto.board.characters) {
      const CharacterClass =
        characterTypes[info.character.type as keyof typeof characterTypes];

      if (!CharacterClass) {
        throw new Error(
          `Unknown character type: ${info.character.type}`,
        );
      }

      const character = new CharacterClass(info.character.level);

      character.health = info.character.health;
      character.attack = info.character.attack;
      character.defence = info.character.defence;

      board.addCharacter(character, info.position);
    }

    return {
      currentPlayer: dto.currentPlayer,
      selectedCell: dto.selectedCell,
      board,
    };
  }
}