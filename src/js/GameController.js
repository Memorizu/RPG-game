import { generateTeam } from './generators';
import allowedTypes from './characters/allowedTypes';
import PositionedCharacter from './PositionedCharacter';


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.maxLevel = 4;
    this.characterCount = 3;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService

    this.gamePlay.drawUi('prairie');
    this.startGame();
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }

  startGame() {
    const players = generateTeam(allowedTypes.players.classes, this.maxLevel, this.characterCount);
    const enemies = generateTeam(allowedTypes.enemies.classes, this.maxLevel, this.characterCount);

    const charactersCells = this.setupField(players, enemies);
    console.log(charactersCells)

    const positionedCharacters = charactersCells.map(
      ({ character, position }) => new PositionedCharacter(character, position),
    );

    this.gamePlay.redrawPositions(positionedCharacters);
  }
  
  setupField(players, enemies) {
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

    return [
      ...playerMembers.map((character, index) => ({
        character,
        position: playerPositions[index],
      })),
      ...enemyMembers.map((character, index) => ({
        character,
        position: enemyPositions[index],
      })),
    ];
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
}
