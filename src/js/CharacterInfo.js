import Character from './Character';
import allowedTypes  from './characters/allowedTypes';


export default class CharacterInfo {
  constructor(character, position, stats) {
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }

    if (typeof position !== 'number') {
      throw new Error('position must be a number');
    }

    this.character = character;
    this.position = position;
    this.stats = stats;
    this.belongsTo = this.getBelongsTo();
  }

  getBelongsTo() {
    if (this.character instanceof allowedTypes.players.classes[0] || this.character instanceof allowedTypes.players.classes[1] || this.character instanceof allowedTypes.players.classes[2]) {
      return 'player';
    } else if (this.character instanceof allowedTypes.enemies.classes[0] || this.character instanceof allowedTypes.enemies.classes[1] || this.character instanceof allowedTypes.enemies.classes[2]) {
      return 'enemy';
    } else {
      throw new Error('character must be instance of allowed types');
    }
  }

}
