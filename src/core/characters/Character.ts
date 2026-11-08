import type { Faction, CharacterStats } from '../types';


export default abstract class Character {
  public readonly faction: Faction;

  public level: number;
  public attack: number;
  public defence: number;
  public health: number;
  public moveRange: number;
  public attackRange: number;
  public experience: number;

  constructor(faction: Faction, stats: CharacterStats) {
    this.faction = faction;

    this.level = 1;
    this.experience = 0;

    this.attack = stats.attack;
    this.defence = stats.defence;
    this.health = stats.health;
    this.moveRange = stats.moveRange;
    this.attackRange = stats.attackRange;
  }

  protected levelUp(): void {
    this.level += 1;
    this.health = Math.min(100, this.health + 80);

    const multiplier = (80 + this.health) / 100;

    this.attack = Math.max(
      this.attack,
      this.attack * multiplier,
    );

    this.defence = Math.max(
      this.defence,
      this.defence * multiplier,
    );
  }

  public gainExperience(amount = 20): void {
    this.experience += amount;

    while (this.experience >= 100) {
      this.experience -= 100;
      this.levelUp();
    }
  }

  public calculateDamage(enemy: Character): number {
    return Math.max(
      this.attack - enemy.defence,
      this.attack * 0.1,
    );
  }

  public attackCharacter(enemy: Character): void {
    const damage = this.calculateDamage(enemy);
    enemy.receiveDamage(damage);
  }

  public receiveDamage(damage: number): void {
    if (damage <= 0) {
      return;
    }
    this.health = Math.max(0, this.health - damage);
  }

  public isAlive(): boolean {
    return this.health > 0;
  }
}
