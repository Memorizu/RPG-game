import Character from "./characters/Character";
import { Faction } from "./types";


export default class Team {
  public readonly faction: Faction;
  public readonly members: Set<Character>;

  constructor(faction: Faction) {
    this.faction = faction;
    this.members = new Set();
  }

  add(character: Character) {
    if (character.faction !== this.faction) {
      throw new Error('Character faction does not match team faction');
    }

    this.members.add(character);
  }

  remove(character: Character) {
    this.members.delete(character);
  }

  addAll(characters: Character[]): void {
    for (const character of characters) {
      this.add(character);
    }
  }

  toArray() {
    return [...this.members];
  }
}
