
import GameController from '../src/js/GameController';
import GameState from '../src/js/GameState';


jest.mock('../src/js/GameState', () => ({
  __esModule: true,
  default: {
    toGameInfo: jest.fn(),
  },
}));

describe('GameController: onLoadGameClick', () => {
  let gamePlay;
  let stateService;
  let gameController;

  beforeEach(() => {
    gamePlay = {
      drawUi: jest.fn(),
      redrawPositions: jest.fn(),
      showError: jest.fn(),
    };

    stateService = {
      load: jest.fn(),
    };

    gameController = new GameController(gamePlay, stateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('успешная загрузка сохранения', () => {
    const savedState = {
      currentPlayer: 'player',
      characters: [],
      theme: 'prairie',
    };

    const gameInfo = {
      currentPlayer: 'player',
      characters: [],
      theme: 'prairie',
      selectedCell: null,
      currentRanges: {
        attack: [],
        move: [],
      },
    };

    stateService.load.mockReturnValue(savedState);
    GameState.toGameInfo.mockReturnValue(gameInfo);

    gameController.onLoadGameClick();

    expect(stateService.load).toHaveBeenCalledTimes(1);

    expect(GameState.toGameInfo).toHaveBeenCalledWith(savedState);

    expect(gameController.gameInfo).toBe(gameInfo);

    expect(gamePlay.drawUi).toHaveBeenCalledWith(gameInfo.theme);

    expect(gamePlay.redrawPositions).toHaveBeenCalledWith(
      gameInfo.characters,
    );

    expect(gamePlay.showError).not.toHaveBeenCalled();
  });

  test('загрузка при отсутствии сохранения', () => {
    stateService.load.mockReturnValue(null);

    gameController.onLoadGameClick();

    expect(gamePlay.showError).toHaveBeenCalledWith(
      'Сохранение не найдено!',
    );

    expect(gamePlay.drawUi).not.toHaveBeenCalled();

    expect(gamePlay.redrawPositions).not.toHaveBeenCalled();

    expect(GameState.toGameInfo).not.toHaveBeenCalled();
  });

  test('обработка ошибки при загрузке сохранения', () => {
    stateService.load.mockImplementation(() => {
      throw new Error('Invalid state');
    });

    gameController.onLoadGameClick();

    expect(gamePlay.showError).toHaveBeenCalledWith(
      'Не удалось загрузить сохранение!',
    );

    expect(gamePlay.drawUi).not.toHaveBeenCalled();

    expect(gamePlay.redrawPositions).not.toHaveBeenCalled();
  });
});
