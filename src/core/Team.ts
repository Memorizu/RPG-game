import Character from "./characters/Character";


export default class Team {

  members: Set<Character>;

  constructor() {
    this.members = new Set();
  }

  add(character: Character) {
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }

    this.members.add(character);
  }

  addAll(characters: Character[]) {
    for (const character of characters) {
      this.members.add(character);
    }
  }

  toArray() {
    return [...this.members];
  }
}
