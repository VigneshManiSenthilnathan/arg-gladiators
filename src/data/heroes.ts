export interface Hero {
  id: string;
  name: string;
  sprite: string;
  description: string;
}

export const HEROES: Hero[] = [
  {
    id: 'knight',
    name: 'King\'s Knight',
    sprite: 'knight/knight_plain.gif',
    description: 'A brave fighter'
  },
  {
    id: 'mage',
    name: 'Royal Mage',
    sprite: 'mage/mage_plain.gif',
    description: 'A powerful spellcaster'
  },
  {
    id: 'barbarian',
    name: 'Barbarian King',
    sprite: 'barbarian/barbarian_plain.gif',
    description: 'Leader of the rebellion'
  }
];