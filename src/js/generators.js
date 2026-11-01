import Team from "./Team";


export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const randomTypeIndex = Math.floor(Math.random() * allowedTypes.length);
    const randomLevel = Math.floor(Math.random() * maxLevel) + 1;
    const CharacterClass = allowedTypes[randomTypeIndex];
    yield new CharacterClass(randomLevel);
  }
}


export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = new Team();
  const generator = characterGenerator(allowedTypes, maxLevel);
  for (let i = 0; i < characterCount; i++) {
    team.add(generator.next().value);
  }
  return team;
}
