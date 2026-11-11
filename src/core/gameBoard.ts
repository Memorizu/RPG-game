import Character from "./characters/Character";
import { CharacterWithPosition, Faction, Theme } from "./types";
import { gameConfig } from "./config/gameConfig";


export const themes: Theme[] = [
  'prairie',
  'desert',
  'arctic',
  'mountain',
];


export default class GameBoard {

  private characters: Map<number, Character> = new Map();
  private currentThemeIndex = 0;

  public readonly boardSize: number;
  public theme: Theme = themes[0]!;
  public currentAttackRange: number[] = [];
  public currentMoveRange: number[] = [];

  constructor(boardSize: number = 8) {
    this.boardSize = boardSize;
  }

  public addCharacter(character: Character, position: number): void {
    this.validatePosition(position);

    if ([...this.characters.values()].includes(character)) {
      throw new Error('Character is already on board');
    }

    if (this.characters.has(position)) {
      throw new Error('Cell is already occupied');
    }

    this.characters.set(position, character);
  }

  public getCharacters(): Map<number, Character> {
    return this.characters;
  }

  public getTheme(): Theme {
    return this.theme!;
  }
  public changeTheme(): void {
    this.currentThemeIndex = (this.currentThemeIndex + 1) % themes.length;
    this.theme = themes[this.currentThemeIndex]!;
  }

  public changePosition(character: Character, newPosition: number): void {
    this.validatePosition(newPosition);

    const currentPosition = this.getPosition(character);

    if (currentPosition === undefined) {
      throw new Error('Character not found on board');
    }

    if (this.characters.has(newPosition)) {
      throw new Error('Cell is already occupied');
    }

    this.characters.delete(currentPosition);
    this.characters.set(newPosition, character);
  }

  public saveMoveAndAttackCells(cellIndex: number, character: Character) {
    const availableAttackCells = this.getAvailableCells(
      cellIndex,
      character.attackRange,
    );
    const availableMoveCells = this.getAvailableCells(
      cellIndex,
      character.moveRange
    );

    this.currentAttackRange = availableAttackCells;
    this.currentMoveRange = availableMoveCells;

  }

  private validatePosition(position: number): void {
    if (
      !Number.isInteger(position)
      || position < 0
      || position >= this.boardSize ** 2
    ) {
      throw new Error('Invalid board position');
    }
  }

  public getPosition(character: Character): number | undefined {
    for (const [position, item] of this.characters) {
      if (item === character) {
        return position;
      }
    }

    return undefined;

  }

  public removeCharacter(character: Character): void {
    const position = this.getPosition(character);

    if (position !== undefined) {
      this.characters.delete(position);
    }
  }

  public getCharacterByPosition(position: number): Character | undefined {
    return this.characters.get(position);
  }

  public getCharacterWithPosition(position: number): CharacterWithPosition {
    return {
      character: this.characters.get(position)!,
      position,
    };
  }

  public setCharacters(characters: Character[]): void {
    const playerIndexes = this.getColumnIndexes([0, 1]);
    const enemyIndexes = this.getColumnIndexes([
      this.boardSize - 2,
      this.boardSize - 1,
    ]);

    const playerPositions = this.getRandomPositions(
      playerIndexes,
      gameConfig.teamSize,
    );

    const enemyPositions = this.getRandomPositions(
      enemyIndexes,
      gameConfig.teamSize,
    );

    for (const character of characters) {
      const positions = character.faction === 'player'
        ? playerPositions
        : enemyPositions;

      const position = positions.pop();

      if (position === undefined) {
        throw new Error(`No available position for ${character.faction}`);
      }

      this.addCharacter(character, position);
    }
  }

  getRandomPositions(indexes: number[], count: number): number[] {
    const shuffled = [...indexes];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      const current = shuffled[i];
      const random = shuffled[j];

      if (current === undefined || random === undefined) {
        continue;
      }

      shuffled[i] = random;
      shuffled[j] = current;
    }

    return shuffled.slice(0, count);
  }

  getColumnIndexes(columns: number[]): number[] {
    const indexes = [];

    for (let row = 0; row < this.boardSize; row++) {
      for (const column of columns) {
        indexes.push(row * this.boardSize + column);
      }
    }

    return indexes;
  }

  public getCharactersWithPosition(faction: Faction): CharacterWithPosition[]  {
    return [...this.characters].map(
      ([position, character]) => ({ character, position }),
    ).filter(({ character }) => character.faction === faction);
  }

  public getAvailableCells(position: number, range: number): number[] {
    const availableCells = [];

    const currentRow = Math.floor(position / this.boardSize);
    const currentCol = position % this.boardSize;

    for (let row = currentRow - range; row <= currentRow + range; row += 1) {
      for (let col = currentCol - range; col <= currentCol + range; col += 1) {
        if (
          row < 0
          || row >= this.boardSize
          || col < 0
          || col >= this.boardSize
        ) {
          continue;
        }

        if (row === currentRow && col === currentCol) {
          continue;
        }

        availableCells.push(row * this.boardSize + col);
      }
    }

    return availableCells;
  }
}
