export interface Weapon {
  id: string;
  name: string;
  sprite: string;
  power: number;
}

export const WEAPONS: Weapon[] = [
  {
    id: 'weapon1',
    name: 'Sword',
    sprite: '⚔️',
    power: 8
  },
  {
    id: 'weapon2',
    name: 'Bow',
    sprite: '🏹',
    power: 7
  }
  // Add more weapons
];