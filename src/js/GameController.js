import { generateTeam } from './generators';
import allowedTypes from './characters/allowedTypes';
import CharacterInfo from './CharacterInfo';
import { showCharacterInfo } from './utils';


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.maxLevel = 4;
    this.characterCount = 3;

    this.gameInfo = {
      currentPlayer: "player",
      characters: [],
    }

    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
  }   

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellClickListener(this.onCellClick);

    this.gamePlay.drawUi('prairie');
    this.startGame();
    this.selectedCell = null;
  }


  onCellClick(index) {
    const character = this.gameInfo.characters.find(
      character => character.position === index,
    );

    if (!character) return;

    if (character.belongsTo === 'player') {
      if (this.selectedCell !== null) {
        this.gamePlay.deselectCell(this.selectedCell);
      }

      this.gamePlay.selectCell(index);
      this.selectedCell = index;
    } else {
      this.gamePlay.showError('You cannot select enemy characters!');
    }
  }

  onCellEnter(index) {
    const isCharacter = this.gameInfo.characters.some(character => character.position === index);

    if (isCharacter) {
      let character = this.gameInfo.characters.find(character => character.position === index);
      const message = showCharacterInfo(
        character.stats.level,
        character.stats.attack,
        character.stats.defence,
        character.stats.health,
      );
      this.gamePlay.showCellTooltip(message, index);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }

  startGame() {
    const players = generateTeam(allowedTypes.players.classes, this.maxLevel, this.characterCount);
    const enemies = generateTeam(allowedTypes.enemies.classes, this.maxLevel, this.characterCount);

    const gameInfo = this.setupField(players, enemies);

    this.saveGameInfo(gameInfo)
    this.gamePlay.redrawPositions(gameInfo);
  }
  
  setupField(players, enemies) {
    const charactersInfo = [];
    const boardSize = this.gamePlay.boardSize;
    const playerMembers = players.toArray();
    const enemyMembers = enemies.toArray();

    const playerIndexes = this.getColumnIndexes(boardSize, [0, 1]);
    const enemyIndexes = this.getColumnIndexes(boardSize, [boardSize - 2, boardSize - 1]);

    const playerPositions = this.getRandomPositions(
      playerIndexes,
      playerMembers.length,
    );

    const enemyPositions = this.getRandomPositions(
      enemyIndexes,
      enemyMembers.length,
    );

    for (let playerMember of playerMembers) {
      const position = playerPositions.pop();
      const playerCharacterInfo = new CharacterInfo(
        playerMember,
        position,
        {
          level: playerMember.level,
          health: playerMember.health,
          attack: playerMember.attack,
          defence: playerMember.defence,
        }
      );
      charactersInfo.push(playerCharacterInfo);
    }

    for (let enemyMember of enemyMembers) {
      const position = enemyPositions.pop();
      const enemyCharacterInfo = new CharacterInfo(
        enemyMember,
        position,
        {
          level: enemyMember.level,
          health: enemyMember.health,
          attack: enemyMember.attack,
          defence: enemyMember.defence,
        }
      );
      charactersInfo.push(enemyCharacterInfo);
    }

    return charactersInfo;
  }

  getColumnIndexes(boardSize, columns) {
    const indexes = [];

    for (let row = 0; row < boardSize; row++) {
      for (const column of columns) {
        indexes.push(row * boardSize + column);
      }
    }

    return indexes;
  }

  getRandomPositions(indexes, count) {
    const shuffled = [...indexes];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, count);
  }

  saveGameInfo(gameInfo) {
    this.gameInfo.characters = gameInfo;
  }

  changePlayer() {
    this.gameInfo.currentPlayer = this.gameInfo.currentPlayer === 'player' ? 'enemy' : 'player';
  }
}
