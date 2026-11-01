

export default class Team {
  constructor() {
    this.members = new Set();
  }

  add(character) {
    if (this.members.has(character)) {
      throw new Error('Персонаж уже находится в команде');
    }

    this.members.add(character);
  }

  addAll(...characters) {
    for (const character of characters) {
      this.members.add(character);
    }
  }

  toArray() {
    return [...this.members];
  }
}
