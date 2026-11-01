import Bowman from './Bowman';
import Daemon from './Daemon';
import Magician from './Magician';
import Swordsman from './Swordsman';
import Undead from './Undead';
import Vampire from './Vampire';


const allowedTypes = {
  enemies: {
    classes: [Daemon, Undead, Vampire],
    types: ['daemon', 'undead', 'vampire'],
  },
  players: {
    classes: [Swordsman, Bowman, Magician],
    types: ['swordsman', 'bowman', 'magician'],
  },
}

export default allowedTypes;
