export interface Hero {
  id: string;
  name: string;
  sprite: string;
  description: string;
}

export const HEROES: Hero[] = [
  {
    id: 'hero1',
    name: 'Warrior',
    sprite: '🗡️',
    description: 'A brave fighter'
  },
  {
    id: 'hero2',
    name: 'Mage',
    sprite: '🧙',
    description: 'A powerful spellcaster'
  }
  // Add more heroes
];