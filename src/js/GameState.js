import CharacterInfo from './CharacterInfo';

import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Daemon from './characters/Daemon';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';


const characterTypes = {
  Bowman,
  Swordsman,
  Magician,
  Daemon,
  Undead,
  Vampire,
};


export default class GameState {
  static from(gameInfo) {
    return {
      currentPlayer: gameInfo.currentPlayer,
      theme: gameInfo.theme,
      characters: gameInfo.characters.map((info) => ({
        position: info.position,
        membership: info.membership,
        character: {
          type: info.character.constructor.name,
          level: info.character.level,
          health: info.character.health,
          attack: info.character._attack,
          defence: info.character.defence,
        },
      })),
    };
  }

  static toGameInfo(state) {
    const characters = state.characters.map((info) => {
      const CharacterClass = characterTypes[info.character.type];

      if (!CharacterClass) {
        throw new Error(`Unknown character type: ${info.character.type}`);
      }

      const character = new CharacterClass(info.character.level);

      character.health = info.character.health;
      character._attack = info.character.attack;
      character.defence = info.character.defence;

      return new CharacterInfo(
        character,
        info.position,
        info.membership,
      );
    });

    return {
      currentPlayer: state.currentPlayer,
      characters,
      selectedCell: null,
      currentRanges: {
        attack: [],
        move: [],
      },
      theme: state.theme,
    };
  }
}