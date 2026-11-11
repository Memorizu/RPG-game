import './css/style.css';
import UI from './core/UI';
import Game from './core/Game';
import GameStateService from './core/GameStateService';
import GameBoard from './core/gameBoard';


const container = document.querySelector<HTMLElement>('#game-container');

if (!container) {
  throw new Error('Game container not found');
}

const ui = new UI();
ui.bindToDOM(container);

const stateService = new GameStateService(localStorage);
const board = new GameBoard(8,);

const gameCtrl = new Game(ui, stateService, board);
gameCtrl.init();