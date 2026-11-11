import { GameStateDTO } from "./interfaces";


export default class GameStateService {
  constructor(private storage: Storage) {}

  save(state: GameStateDTO): void {
    this.storage.setItem("state", JSON.stringify(state));
  }

  load(): GameStateDTO | null {
    const data = this.storage.getItem("state");

    if (data === null) {
      return null;
    }

    try {
      return JSON.parse(data) as GameStateDTO;
    } catch {
      throw new Error("Invalid state");
    }
  }
}