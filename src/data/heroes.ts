export interface Hero {
  id: string;
  name: string;
  sprite: string;
  description: string;
}

export const HEROES: Hero[] = [
  {
    id: 'hero1',
    name: 'King\'s Knight',
    sprite: 'knight/knight_plain.gif',
    description: 'A brave fighter'
  },
  {
    id: 'hero2',
    name: 'Royal Mage',
    sprite: 'mage/mage_plain.gif',
    description: 'A powerful spellcaster'
  }
  // Add more heroes
];