import UI from './UI';
import GameStateService from './GameStateService';
import GameBoard from './gameBoard';
import { State } from './interfaces';
import { gameConfig } from './config/gameConfig';
import { CharacterWithPosition, Faction } from './types';
import Character from './characters/Character';
import { characterGenerator } from './generators';
import { playerClasses, enemyClasses } from './characterRegistry';
import cursors from './cursors';
import { showCharacterInfo } from './utils';


export default class Game {

  protected UI: UI;
  protected stateService: GameStateService;
  protected board: GameBoard;
  protected state: State;
  protected maxLevel: number = gameConfig.maxLevel;
  protected characterCount: number = gameConfig.teamSize;
  protected currentTurn: Faction = "player";
  
  protected movingCursor: number | null = null;
  protected attackCursor: number | null = null;
  protected notAllowedCursor: number | null = null;

  constructor(UI: UI, stateService: GameStateService, gameBoard: GameBoard) {
    this.UI = UI;
    this.stateService = stateService;
    this.board = gameBoard;

    this.state = {
      currentPlayer: "player",
      board: this.board,
      selectedCell: null
    }

    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
    this.onNewGameClick = this.onNewGameClick.bind(this);
    this.onSaveGameClick = this.onSaveGameClick.bind(this);
    this.onLoadGameClick = this.onLoadGameClick.bind(this);
  }   

  init() {
    this.UI.addCellEnterListener(this.onCellEnter);
    this.UI.addCellClickListener(this.onCellClick);
    this.UI.addCellLeaveListener(this.onCellLeave);

    this.UI.addNewGameListener(this.onNewGameClick);
    this.UI.addSaveGameListener(this.onSaveGameClick);
    this.UI.addLoadGameListener(this.onLoadGameClick);

    this.UI.drawUi(this.board.getTheme());
    this.startGame();
    
  }

  onNewGameClick() {
    // this.resetGame();
  }

  onSaveGameClick() {
    // const state = GameState.from(this.state);
    // this.stateService.save(state);
    // console.log("Saved state:", state);
  }

  onLoadGameClick() {
    // const state = this.stateService.load();
    
    // if (!state) {
    //   this.UI.showError('Сохранение не найдено!');
    //   return;
    // }

    // this.state = GameState.toGameInfo(state);

    // this.UI.drawUi(this.board.theme);
    // this.UI.redrawPositions(this.board.characters);
    // console.log(`Loaded saved state: ${state}`);
  }

 
  public get isPlayerTurn(): boolean {
    return this.currentTurn === 'player';
  }

  private async enemyTurn(): Promise<void> {
    this.changeTurn();
    await this.makeMove();
    this.changeTurn();
  }

  private changeTurn(): void {
    this.currentTurn = this.currentTurn === 'player' ? 'enemy' : 'player';
    this.UI.setBoardDisabled(!this.isPlayerTurn);
  } 


  onCellClick(index: number) {

    const characterWithPosition = this.board.getCharacterWithPosition(index);
    const isCharacterSelected = this.state.selectedCell !== null;
    const character = characterWithPosition?.character;

    if (character?.faction === 'player') {
      this.selectCharacter(index, character);
      return;
    }

    if (!isCharacterSelected) {
      if (character?.faction === 'enemy') {
        this.UI.showError('You cannot select enemy characters!');
      }
      return;
    }

    const isInAttackRange = this.board.currentAttackRange.includes(index);
    const isInMoveRange = this.board.currentMoveRange.includes(index);

    if (character?.faction === 'enemy' && isInAttackRange) {
      const enemyWithPosition = characterWithPosition;
      const selectedCell = this.state.selectedCell;
      if (!selectedCell) return;
      const playerWithPosition = this.board.getCharacterWithPosition(selectedCell);

      if (playerWithPosition) {
        this.attackCharacter(playerWithPosition, enemyWithPosition);
      return;
      }
    }

    if (!character && isInMoveRange) {
      this.moveCharacter(index);
    }
  }

  onCellEnter(index: number) {

    const character = this.board.getCharacterByPosition(index);
    const isCharacterSelected = this.state.selectedCell !== null;

    const isInAttackRange = this.board.currentAttackRange.includes(index);
    const isInMoveRange = this.board.currentMoveRange.includes(index);

    if (character) {
      this.showCharacterTooltip(character, index);
    }

    if (!isCharacterSelected) {
      this.UI.setCursor(character ? cursors.pointer : cursors.auto);
      return;
    }

    if (character?.faction === 'enemy') {
      if (isInAttackRange) {
        this.UI.setCursor(cursors.crosshair);
        this.highlightAttackCell(index);
      } else {
        this.UI.setCursor(cursors.notallowed);
      }

      return;
    }

    if (!character && isInMoveRange) {
      this.UI.setCursor(cursors.pointer);
      this.highlightMoveCell(index);
      return;
    }

    this.UI.setCursor(character ? cursors.pointer : cursors.auto);
  }

  onCellLeave(index: number) {
    if (this.state.selectedCell !== index) {
      this.UI.setCursor(cursors.auto);
    }
    if (this.attackCursor === index) {
      this.UI.deselectCell(index);
      this.attackCursor = null;
    }
    if (this.movingCursor === index) {
      this.UI.deselectCell(index);
      this.movingCursor = null;
    }
  }

  startGame() {

    const characters = this.createCharacters();
    this.board.setCharacters(characters);
    this.UI.redrawPositions(this.board.getCharacters());
  }


  private createCharacters(): Character[] {
    const characters: Character[] = [];

    const enemyGenerator = characterGenerator(enemyClasses, 'enemy');
    const playerGenerator = characterGenerator(playerClasses, 'player');

    for (let i = 0; i < this.characterCount; i++) {
      characters.push(enemyGenerator.next().value);
      characters.push(playerGenerator.next().value);
    }

    return characters;
  }
  

  moveCharacter(index: number) {
    if (!this.state.selectedCell) return;
    const character = this.board.getCharacterByPosition(this.state.selectedCell);

    if (!character) return;

    this.board.changePosition(character, index)
    this.UI.redrawPositions(this.board.getCharacters());

    this.resetSelection();
    this.changePlayer();
  }

  attackCharacter(attackerWithPosition: CharacterWithPosition, targetWithPosition: CharacterWithPosition) {

    console.log(attackerWithPosition)
    console.log(targetWithPosition)

    const attacker = attackerWithPosition.character;
    const target = targetWithPosition.character;

    const damage = attacker.calculateDamage(target);

    this.UI.showDamage(targetWithPosition.position, damage).then(() => {
      attacker.gainExperience();
      attacker.attackCharacter(damage, target);

      if (!target.isAlive()) {
        this.board.removeCharacter(target);

      //   const isWin = this.checkWin();

      //   if (isWin) {
      //     const characterInfos = this.gameInfo.characters
      //     characterInfos.map(characterInfo => {
      //       characterInfo.character.levelUp()
      //     })
      //     this.saveCharactersToGameInfo(characterInfos)
      //     this.updateStage()
      //     return
      //   }
      }

      this.UI.redrawPositions(this.board.getCharacters());

      this.resetSelection();
      this.changePlayer();
    });
  }

  highlightMoveCell(index: number) {
    if (this.movingCursor !== null) {
      this.UI.deselectCell(this.movingCursor);
    }

    this.movingCursor = index;
    this.UI.selectCell(index, 'green');
  }

  highlightAttackCell(index: number) {
    if (this.attackCursor !== null) {
      this.UI.deselectCell(this.attackCursor);
    }

    this.attackCursor = index;
    this.UI.selectCell(index, 'red');
  }

  resetSelection() {
    if (this.state.selectedCell !== null) {
      this.UI.deselectCell(this.state.selectedCell);
    }

    this.state.selectedCell = null;
    this.board.currentAttackRange = [];
    this.board.currentMoveRange = [];

  }

  selectCharacter(index: number, character: Character) {
    if (this.state.selectedCell !== null) {
      this.UI.deselectCell(this.state.selectedCell);
    }

    this.UI.selectCell(index);
    this.state.selectedCell = index;

    this.resetHoverState();
    this.board.saveMoveAndAttackCells(index, character);
  }

  resetHoverState() {
    this.UI.setCursor(cursors.auto);

    if (this.movingCursor !== null) {
      this.UI.deselectCell(this.movingCursor);
      this.movingCursor = null;
    }

    if (this.attackCursor !== null) {
      this.UI.deselectCell(this.attackCursor);
      this.attackCursor = null;
    }

    if (this.notAllowedCursor !== null) {
      this.UI.deselectCell(this.notAllowedCursor);
      this.notAllowedCursor = null;
    }
  }

  showCharacterTooltip(character: Character, index: number) {
    const { level, attack, defence, health } = character;

    const message = showCharacterInfo(
      level,
      attack,
      defence,
      health,
    );

    this.UI.showCellTooltip(message, index);
  }

  changePlayer() {
    let currentPlayer = this.state.currentPlayer;

    if (currentPlayer === 'player') {
      this.state.currentPlayer = 'enemy';
      this.enemyTurn();
    } else {
      this.state.currentPlayer = 'player';
    }
  }

  async makeMove() {
    // const enemiesInfo = this.gameInfo.characters.filter(
    //   character => character.membership === 'enemy',
    // );

    // const playersInfo = this.gameInfo.characters.filter(
    //   character => character.membership === 'player',
    // );

    // if (!enemiesInfo.length || !playersInfo.length) return;

    // const randomIndex = Math.floor(Math.random() * enemiesInfo.length);
    // const enemy = enemiesInfo[randomIndex];

    // const availableAttackCells = getAvailableCells(
    //   this.gamePlay.boardSize,
    //   enemy.position,
    //   enemy.character.attackRange,
    // );

    // const availableMoveCells = getAvailableCells(
    //   this.gamePlay.boardSize,
    //   enemy.position,
    //   enemy.character.moveRange,
    // );

    // const attackTargets = playersInfo.filter(
    //   player => availableAttackCells.includes(player.position),
    // );

    // if (attackTargets.length) {
    //   const nearestTarget = attackTargets.reduce((nearest, player) => (
    //     this.getDistance(enemy.position, player.position)
    //       < this.getDistance(enemy.position, nearest.position)
    //       ? player
    //       : nearest
    //   ));

    //   this.attackCharacter(enemy, nearestTarget);
    //   return;
    // }

    // const availableMoves = availableMoveCells.filter(
    //   cell => !this.getCharacterByPosition(cell),
    // );

    // if (!availableMoves.length) {
    //   this.changePlayer();
    //   return;
    // }

    // const nearestPlayer = playersInfo.reduce((nearest, player) => (
    //   this.getDistance(enemy.position, player.position)
    //     < this.getDistance(enemy.position, nearest.position)
    //     ? player
    //     : nearest
    // ));

    // const bestMove = availableMoves.reduce((best, cell) => {
    //   const distance = this.getDistance(
    //     cell,
    //     nearestPlayer.position,
    //   );

    //   const bestDistance = this.getDistance(
    //     best,
    //     nearestPlayer.position,
    //   );

    //   if (distance < bestDistance) return cell;

    //   if (
    //     distance === bestDistance
    //     && this.getDistance(enemy.position, cell)
    //       > this.getDistance(enemy.position, best)
    //   ) {
    //     return cell;
    //   }

    //   return best;
    // }, availableMoves[0]);

    // if (
    //   this.getDistance(bestMove, nearestPlayer.position)
    //   >= this.getDistance(enemy.position, nearestPlayer.position)
    // ) {
    //   this.changePlayer();
    //   return;
    // }

    // this.moveEnemy(enemy, bestMove);
  }

  // getDistance(from, to) {
  //   const boardSize = this.gamePlay.boardSize;

  //   const fromRow = Math.floor(from / boardSize);
  //   const fromCol = from % boardSize;

  //   const toRow = Math.floor(to / boardSize);
  //   const toCol = to % boardSize;

  //   return Math.max(
  //     Math.abs(fromRow - toRow),
  //     Math.abs(fromCol - toCol),
  //   );
  // }

  // moveEnemy(enemy, index) {
  //   enemy.changePosition(index);
  //   this.gamePlay.redrawPositions(this.gameInfo.characters);
  //   this.changePlayer();
  // }

  checkWin() {
    const characters = this.board.getCharacters()
    const enemies = [...characters.values()].filter(
      (character) => character.faction === 'enemy'
    );
    if (!enemies.length) {
      return true;
    }
    return false
  }

  // updateStage() {
  //   const { value: nextTheme, done } = this.stageGenerator.next();

  //   if (done) {
  //     this.gameOver();
  //     return;
  //   }

  //   const playerTeam = new Team();
  //   this.gameInfo.characters.map(player => playerTeam.add(player.character));

  //   console.log('players', playerTeam);
  //   const enemyTeam = generateTeam(allowedTypes.enemies.classes, this.maxLevel, this.characterCount);
  //   console.log('enemies', enemyTeam);
  //   const characterInfo = this.setupField(playerTeam, enemyTeam);
  //   this.gameInfo.currentPlayer = 'player';
  //   this.saveCharactersToGameInfo(characterInfo);

  //   this.gameInfo.theme = nextTheme;
  //   this.gamePlay.drawUi(this.gameInfo.theme);
  //   this.gamePlay.redrawPositions(this.gameInfo.characters);
  // }

  // gameOver() {
  //   this.resetGame();
  // }

  // resetGame() {
  //   this.gameInfo = {
  //     currentPlayer: 'player',
  //     characters: [],
  //     selectedCell: null,
  //     currentRanges: {
  //       attack: [],
  //       move: [],
  //     },
  //     theme: themes.prairie,
  //   };

  //   this.stageGenerator = this.getStage();
  //   this.gamePlay.drawUi(this.gameInfo.theme);
  //   this.startGame();
  // }

}
