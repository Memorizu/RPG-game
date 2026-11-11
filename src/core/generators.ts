import Character from "./characters/Character";
import Team from "./Team";
import { CharacterClasses, Faction } from "./types";


export function* characterGenerator(
  classes: CharacterClasses,
  faction: Faction,
): Generator<Character> {
  if (classes.length === 0) {
    throw new Error('No character types provided');
  }

  while (true) {
    const randomIndex = Math.floor(Math.random() * classes.length);
    const CharacterClass = classes[randomIndex];

    if (!CharacterClass) {
      throw new Error('Character class not found');
    }

    yield new CharacterClass(faction);
  }
}

