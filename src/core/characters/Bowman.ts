import Character from './Character';
import type { Faction } from '../types';


export default class Bowman extends Character {
  constructor(faction: Faction) {
    super(faction, {
      attack: 40,
      defence: 5,
      health: 100,
      moveRange: 2,
      attackRange: 2,
    });
  }
}
