import { generateTeam } from './generators';
import allowedTypes from './characters/allowedTypes';
import CharacterInfo from './CharacterInfo';
import { showCharacterInfo, getAvailableCells } from './utils';
import cursors from './cursors';
import themes from './themes';
import GameState from './GameState';
import Team from './Team';


export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.maxLevel = 4;
    this.characterCount = 3;
    this.movingCursor = null;
    this.attackCursor = null;
    this.notAllowedCursor = null;
    this.stageGenerator = this.getStage();

    this.gameInfo = {
      currentPlayer: "player",
      characters: [],
      selectedCell: null,
      currentRanges: {
        attack: [],
        move: [],
      },
      theme: themes.prairie,
    }

    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
    this.onNewGameClick = this.onNewGameClick.bind(this);
    this.onSaveGameClick = this.onSaveGameClick.bind(this);
    this.onLoadGameClick = this.onLoadGameClick.bind(this);
  }   

  init() {
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellClickListener(this.onCellClick);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);

    this.gamePlay.addNewGameListener(this.onNewGameClick);
    this.gamePlay.addSaveGameListener(this.onSaveGameClick);
    this.gamePlay.addLoadGameListener(this.onLoadGameClick);

    this.gamePlay.drawUi(this.gameInfo.theme);
    this.startGame();
    
  }

  onNewGameClick() {
    this.resetGame();
  }

  onSaveGameClick() {
    const state = GameState.from(this.gameInfo);
    this.stateService.save(state);
    console.log("Saved state:", state);
  }

  onLoadGameClick() {
    const state = this.stateService.load();
    
    if (!state) {
      this.gamePlay.showError('Сохранение не найдено!');
      return;
    }

    this.gameInfo = GameState.toGameInfo(state);

    this.gamePlay.drawUi(this.gameInfo.theme);
    this.gamePlay.redrawPositions(this.gameInfo.characters);
    console.log(`Loaded saved state: ${state}`);
  }


  onCellClick(index) {
    if (this.gameInfo.currentPlayer === 'enemy') return;

    const character = this.getCharacterByPosition(index);

    const isCharacterSelected = this.gameInfo.selectedCell !== null;

    if (character?.membership === 'player') {
      this.selectCharacter(index, character);
      return;
    }

    if (!isCharacterSelected) {
      if (character?.membership === 'enemy') {
        this.gamePlay.showError('You cannot select enemy characters!');
      }

      return;
    }

    const isInAttackRange = this.gameInfo.currentRanges.attack.includes(index);
    const isInMoveRange = this.gameInfo.currentRanges.move.includes(index);

    if (character?.membership === 'enemy' && isInAttackRange) {
      const player = this.getCharacterByPosition(this.gameInfo.selectedCell);

      this.attackCharacter(player, character);
      return;
    }

    if (!character && isInMoveRange) {
      this.moveCharacter(index);
    }
  }

  onCellEnter(index) {
    if (this.gameInfo.currentPlayer === 'enemy') return;

    const characterInfo = this.getCharacterByPosition(index);
    const isCharacterSelected = this.gameInfo.selectedCell !== null;

    const isInAttackRange = this.gameInfo.currentRanges.attack.includes(index);
    const isInMoveRange = this.gameInfo.currentRanges.move.includes(index);

    if (characterInfo) {
      this.showCharacterTooltip(characterInfo, index);
    }

    if (!isCharacterSelected) {
      this.gamePlay.setCursor(characterInfo ? cursors.pointer : cursors.auto);
      return;
    }

    if (characterInfo?.membership === 'enemy') {
      if (isInAttackRange) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.highlightAttackCell(index);
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }

      return;
    }

    if (!characterInfo && isInMoveRange) {
      this.gamePlay.setCursor(cursors.pointer);
      this.highlightMoveCell(index);
      return;
    }

    this.gamePlay.setCursor(characterInfo ? cursors.pointer : cursors.auto);
  }

  onCellLeave(index) {
    if (this.gameInfo.selectedCell !== index) {
      this.gamePlay.setCursor(cursors.auto);
    }
    if (this.attackCursor === index) {
      this.gamePlay.deselectCell(index);
      this.attackCursor = null;
    }
    if (this.movingCursor === index) {
      this.gamePlay.deselectCell(index);
      this.movingCursor = null;
    }
  }

  startGame() {
    const players = generateTeam(allowedTypes.players.classes, this.maxLevel, this.characterCount);
    const enemies = generateTeam(allowedTypes.enemies.classes, this.maxLevel, this.characterCount);

    const charactersInfos = this.setupField(players, enemies);

    this.saveCharactersToGameInfo(charactersInfos)
    this.gamePlay.redrawPositions(charactersInfos);
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
      );
      charactersInfo.push(playerCharacterInfo);
    }

    for (let enemyMember of enemyMembers) {
      const position = enemyPositions.pop();
      const enemyCharacterInfo = new CharacterInfo(
        enemyMember,
        position,
      );
      charactersInfo.push(enemyCharacterInfo);
    }
    return charactersInfo;
  }

  moveCharacter(index) {
    const character = this.getCharacterByPosition(
      this.gameInfo.selectedCell,
    );

    if (!character) return;

    character.changePosition(index);
    this.gamePlay.redrawPositions(this.gameInfo.characters);

    this.resetSelection();
    this.changePlayer();
  }

  attackCharacter(attackerInfo, targetInfo) {
    const attacker = attackerInfo.character;
    const target = targetInfo.character;

    console.log(attacker)
    console.log(target)

    const damage = attacker.attack(target);

    this.gamePlay.showDamage(targetInfo.position, damage).then(() => {
      target.getDamage(damage);

      if (!target.isAlive()) {
        const index = this.gameInfo.characters.indexOf(targetInfo);
        this.gameInfo.characters.splice(index, 1);

        const isWin = this.checkWin();

        if (isWin) {
          const characterInfos = this.gameInfo.characters
          characterInfos.map(characterInfo => {
            characterInfo.character.levelUp()
          })
          this.saveCharactersToGameInfo(characterInfos)
          this.updateStage()
        }
      }

      this.gamePlay.redrawPositions(this.gameInfo.characters);

      this.resetSelection();
      this.changePlayer();
    });
  }

  highlightMoveCell(index) {
    if (this.movingCursor !== null) {
      this.gamePlay.deselectCell(this.movingCursor);
    }

    this.movingCursor = index;
    this.gamePlay.selectCell(index, 'green');
  }

  highlightAttackCell(index) {
    if (this.attackCursor !== null) {
      this.gamePlay.deselectCell(this.attackCursor);
    }

    this.attackCursor = index;
    this.gamePlay.selectCell(index, 'red');
  }

  resetSelection() {
    if (this.gameInfo.selectedCell !== null) {
      this.gamePlay.deselectCell(this.gameInfo.selectedCell);
    }

    this.gameInfo.selectedCell = null;
    this.gameInfo.currentRanges.attack = [];
    this.gameInfo.currentRanges.move = [];

    this.movingCell = null;
  }

  saveMoveAndAttackCells(cellIndex, characterInfo) {
    const availableAttackCells = getAvailableCells(
      this.gamePlay.boardSize,
      cellIndex,
      characterInfo.character.attackRange,
    );
    const availableMoveCells = getAvailableCells(
      this.gamePlay.boardSize,
      cellIndex,
      characterInfo.character.moveRange
    );

    this.gameInfo.currentRanges.attack = availableAttackCells;
    this.gameInfo.currentRanges.move = availableMoveCells;
  }

  selectCharacter(index, characterInfo) {
    if (this.gameInfo.selectedCell !== null) {
      this.gamePlay.deselectCell(this.gameInfo.selectedCell);
    }

    this.gamePlay.selectCell(index);
    this.gameInfo.selectedCell = index;

    this.resetHoverState();
    this.saveMoveAndAttackCells(index, characterInfo);
  }

  getCharacterByPosition(position) {
    return this.gameInfo.characters.find(
      character => character.position === position,
    );
  }

  resetHoverState() {
    this.gamePlay.setCursor(cursors.auto);

    if (this.movingCursor !== null) {
      this.gamePlay.deselectCell(this.movingCursor);
      this.movingCursor = null;
    }

    if (this.attackCursor !== null) {
      this.gamePlay.deselectCell(this.attackCursor);
      this.attackCursor = null;
    }

    if (this.notAllowedCursor !== null) {
      this.gamePlay.deselectCell(this.notAllowedCursor);
      this.notAllowedCursor = null;
    }
  }

  showCharacterTooltip(characterInfo, index) {
    const { level, _attack, defence, health } = characterInfo.character;

    const message = showCharacterInfo(
      level,
      _attack,
      defence,
      health,
    );

    this.gamePlay.showCellTooltip(message, index);
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

  saveCharactersToGameInfo(characters) {
    this.gameInfo.characters = characters;
  }

  changePlayer() {
    let currentPlayer = this.gameInfo.currentPlayer;

    if (currentPlayer === 'player') {
      this.gameInfo.currentPlayer = 'enemy';
      this.enemyTurn();
    } else {
      this.gameInfo.currentPlayer = 'player';
    }
  }

  enemyTurn() {
    const enemiesInfo = this.gameInfo.characters.filter(
      character => character.membership === 'enemy',
    );

    const playersInfo = this.gameInfo.characters.filter(
      character => character.membership === 'player',
    );

    if (!enemiesInfo.length || !playersInfo.length) return;

    const randomIndex = Math.floor(Math.random() * enemiesInfo.length);
    const enemy = enemiesInfo[randomIndex];

    const availableAttackCells = getAvailableCells(
      this.gamePlay.boardSize,
      enemy.position,
      enemy.character.attackRange,
    );

    const availableMoveCells = getAvailableCells(
      this.gamePlay.boardSize,
      enemy.position,
      enemy.character.moveRange,
    );

    const attackTargets = playersInfo.filter(
      player => availableAttackCells.includes(player.position),
    );

    if (attackTargets.length) {
      const nearestTarget = attackTargets.reduce((nearest, player) => (
        this.getDistance(enemy.position, player.position)
          < this.getDistance(enemy.position, nearest.position)
          ? player
          : nearest
      ));

      this.attackCharacter(enemy, nearestTarget);
      return;
    }

    const availableMoves = availableMoveCells.filter(
      cell => !this.getCharacterByPosition(cell),
    );

    if (!availableMoves.length) {
      this.changePlayer();
      return;
    }

    const nearestPlayer = playersInfo.reduce((nearest, player) => (
      this.getDistance(enemy.position, player.position)
        < this.getDistance(enemy.position, nearest.position)
        ? player
        : nearest
    ));

    const bestMove = availableMoves.reduce((best, cell) => {
      const distance = this.getDistance(
        cell,
        nearestPlayer.position,
      );

      const bestDistance = this.getDistance(
        best,
        nearestPlayer.position,
      );

      if (distance < bestDistance) return cell;

      if (
        distance === bestDistance
        && this.getDistance(enemy.position, cell)
          > this.getDistance(enemy.position, best)
      ) {
        return cell;
      }

      return best;
    }, availableMoves[0]);

    if (
      this.getDistance(bestMove, nearestPlayer.position)
      >= this.getDistance(enemy.position, nearestPlayer.position)
    ) {
      this.changePlayer();
      return;
    }

    this.moveEnemy(enemy, bestMove);
  }

  getDistance(from, to) {
    const boardSize = this.gamePlay.boardSize;

    const fromRow = Math.floor(from / boardSize);
    const fromCol = from % boardSize;

    const toRow = Math.floor(to / boardSize);
    const toCol = to % boardSize;

    return Math.max(
      Math.abs(fromRow - toRow),
      Math.abs(fromCol - toCol),
    );
  }

  moveEnemy(enemy, index) {
    enemy.changePosition(index);
    this.gamePlay.redrawPositions(this.gameInfo.characters);
    this.changePlayer();
  }

  checkWin() {
    const enemies = this.gameInfo.characters.filter(
      character => character.membership === 'enemy',
    );
    
    if (!enemies.length) {
      return true;
    }
    return false
  }

  *getStage() {
    const stages = Object.values(themes).slice(1);

    for (const stage of stages) {
      yield stage;
    }
  }

  updateStage() {
    const { value: nextTheme, done } = this.stageGenerator.next();

    if (done) {
      this.gameOver();
      return;
    }

    const playerTeam = new Team();
    this.gameInfo.characters.map(player => playerTeam.add(player.character));

    console.log('players', playerTeam);
    const enemyTeam = generateTeam(allowedTypes.enemies.classes, this.maxLevel, this.characterCount);
    console.log('enemies', enemyTeam);
    const characterInfo = this.setupField(playerTeam, enemyTeam);
    this.gameInfo.currentPlayer = 'player';
    this.saveCharactersToGameInfo(characterInfo);

    this.gameInfo.theme = nextTheme;
    this.gamePlay.drawUi(this.gameInfo.theme);
    this.gamePlay.redrawPositions(this.gameInfo.characters);
  }

  gameOver() {
    this.resetGame();
  }

  resetGame() {
    this.gameInfo = {
      currentPlayer: 'player',
      characters: [],
      selectedCell: null,
      currentRanges: {
        attack: [],
        move: [],
      },
      theme: themes.prairie,
    };

    this.stageGenerator = this.getStage();
    this.gamePlay.drawUi(this.gameInfo.theme);
    this.startGame();
  }

}
