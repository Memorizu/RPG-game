
import { calcHealthLevel, calcTileType } from './utils';
import type { Theme } from './types';
import Character from './characters/Character';

export type CellListener = (index: number) => void;
export type ActionListener = () => void;


export default class UI {
  private container: HTMLElement | null = null;
  private boardEl: HTMLDivElement | null = null;
  private cells: HTMLDivElement[] = [];

  private readonly boardSize: number;

  private cellClickListeners: CellListener[] = [];
  private cellEnterListeners: CellListener[] = [];
  private cellLeaveListeners: CellListener[] = [];

  private newGameListeners: ActionListener[] = [];
  private saveGameListeners: ActionListener[] = [];
  private loadGameListeners: ActionListener[] = [];

  constructor(boardSize: number = 8) {
    if (!Number.isInteger(boardSize) || boardSize < 1) {
      throw new Error('Invalid board size');
    }

    this.boardSize = boardSize;
  }

  public bindToDOM(container: HTMLElement): void {
    this.container = container;
  }

  public drawUi(theme: Theme): void {
    const container = this.getContainer();

    container.innerHTML = `
      <div class="controls">
        <button data-id="action-restart" class="btn">New Game</button>
        <button data-id="action-save" class="btn">Save Game</button>
        <button data-id="action-load" class="btn">Load Game</button>
      </div>
      <div class="board-container">
        <div data-id="board" class="board"></div>
      </div>
    `;

    const newGameEl = this.queryRequired<HTMLButtonElement>(
      container,
      '[data-id="action-restart"]',
    );

    const saveGameEl = this.queryRequired<HTMLButtonElement>(
      container,
      '[data-id="action-save"]',
    );

    const loadGameEl = this.queryRequired<HTMLButtonElement>(
      container,
      '[data-id="action-load"]',
    );

    this.boardEl = this.queryRequired<HTMLDivElement>(
      container,
      '[data-id="board"]',
    );

    newGameEl.addEventListener('click', this.onNewGameClick);
    saveGameEl.addEventListener('click', this.onSaveGameClick);
    loadGameEl.addEventListener('click', this.onLoadGameClick);

    this.boardEl.classList.add(theme);

    this.createBoard();
  }

  private createBoard(): void {
    const board = this.getBoard();

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cell = document.createElement('div');

      cell.classList.add(
        'cell',
        'map-tile',
        `map-tile-${calcTileType(i, this.boardSize)}`,
      );

      cell.dataset.index = String(i);

      cell.addEventListener('mouseenter', this.onCellEnter);
      cell.addEventListener('mouseleave', this.onCellLeave);
      cell.addEventListener('click', this.onCellClick);

      this.cells.push(cell);
      fragment.appendChild(cell);
    }

    board.appendChild(fragment);
  }

  public redrawPositions(characters: Map<number, Character>): void {
    this.cells.forEach((cell) => cell.replaceChildren());

    for (const [position, character] of characters) {
      const cell = this.getCell(position);
      const characterType = character.constructor.name.toLowerCase()

      const characterEl = document.createElement('div');
      characterEl.classList.add('character', characterType);

      const healthEl = document.createElement('div');
      healthEl.classList.add('health-level');

      const healthIndicatorEl = document.createElement('div');

      healthIndicatorEl.classList.add(
        'health-level-indicator',
        `health-level-indicator-${calcHealthLevel(character.health)}`,
      );

      healthIndicatorEl.style.width = `${character.health}%`;

      healthEl.appendChild(healthIndicatorEl);
      characterEl.appendChild(healthEl);
      cell.appendChild(characterEl);
    }
  }

  public addCellClickListener(callback: CellListener): void {
    this.cellClickListeners.push(callback);
  }

  public addCellEnterListener(callback: CellListener): void {
    this.cellEnterListeners.push(callback);
  }

  public addCellLeaveListener(callback: CellListener): void {
    this.cellLeaveListeners.push(callback);
  }

  public addNewGameListener(callback: ActionListener): void {
    this.newGameListeners.push(callback);
  }

  public addSaveGameListener(callback: ActionListener): void {
    this.saveGameListeners.push(callback);
  }

  public addLoadGameListener(callback: ActionListener): void {
    this.loadGameListeners.push(callback);
  }

  // DOM event handlers

  private readonly onCellEnter = (event: MouseEvent): void => {
    const index = this.getEventCellIndex(event);

    this.cellEnterListeners.forEach((callback) => callback(index));
  };

  private readonly onCellLeave = (event: MouseEvent): void => {
    const index = this.getEventCellIndex(event);

    this.cellLeaveListeners.forEach((callback) => callback(index));
  };

  private readonly onCellClick = (event: MouseEvent): void => {
    const index = this.getEventCellIndex(event);

    this.cellClickListeners.forEach((callback) => callback(index));
  };

  private readonly onNewGameClick = (event: MouseEvent): void => {
    event.preventDefault();

    this.newGameListeners.forEach((callback) => callback());
  };

  private readonly onSaveGameClick = (event: MouseEvent): void => {
    event.preventDefault();

    this.saveGameListeners.forEach((callback) => callback());
  };

  private readonly onLoadGameClick = (event: MouseEvent): void => {
    event.preventDefault();

    this.loadGameListeners.forEach((callback) => callback());
  };

  // UI methods

  public showError(message: string): void {
    alert(message);
  }

  public static showMessage(message: string): void {
    alert(message);
  }

  public selectCell(index: number, color: string = 'yellow'): void {
    this.deselectCell(index);

    this.getCell(index).classList.add('selected', `selected-${color}`);
  }

  public deselectCell(index: number): void {
    const cell = this.getCell(index);

    const selectedClasses = Array.from(cell.classList)
      .filter((className) => className.startsWith('selected'));

    cell.classList.remove(...selectedClasses);
  }

  public showCellTooltip(message: string, index: number): void {
    this.getCell(index).title = message;
  }

  public hideCellTooltip(index: number): void {
    this.getCell(index).title = '';
  }

  public showDamage(index: number, damage: number): Promise<void> {
    return new Promise((resolve) => {
      const cell = this.getCell(index);

      const damageEl = document.createElement('span');

      damageEl.textContent = String(damage);
      damageEl.classList.add('damage');

      cell.appendChild(damageEl);

      const finishAnimation = (): void => {
        damageEl.removeEventListener('animationend', finishAnimation);
        damageEl.removeEventListener('animationcancel', finishAnimation);

        damageEl.remove();
        resolve();
      };

      damageEl.addEventListener('animationend', finishAnimation, { once: true });
      damageEl.addEventListener('animationcancel', finishAnimation, { once: true });
    });
  }

  public setCursor(cursor: CSSStyleDeclaration['cursor']): void {
    this.getBoard().style.cursor = cursor;
  }

  private getContainer(): HTMLElement {
    if (!this.container) {
      throw new Error('UI is not bound to DOM');
    }

    return this.container;
  }

  private getBoard(): HTMLDivElement {
    if (!this.boardEl) {
      throw new Error('Board is not initialized');
    }

    return this.boardEl;
  }
  private getCell(index: number): HTMLDivElement {
    if (!Number.isInteger(index) || index < 0 || index >= this.cells.length) {
      throw new Error('Invalid cell index');
    }

    const cell = this.cells[index];

    if (!cell) {
      throw new Error('Cell not found');
    }

    return cell;
  }

  private getEventCellIndex(event: MouseEvent): number {
    const cell = event.currentTarget as HTMLDivElement;

    return Number(cell.dataset.index);
  }

  setBoardDisabled(disabled: boolean): void {
    this.getBoard().classList.toggle('disabled', disabled);
  }

  private queryRequired<T extends HTMLElement>(
    root: ParentNode,
    selector: string,
  ): T {
    const element = root.querySelector<T>(selector);

    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }

    return element;
  }
}
