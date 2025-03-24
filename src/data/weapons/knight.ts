export interface Weapon extends Record<string, string> {
    id: string;
    name: string;
    sprite: string;
    description: string;
}
  
export const WEAPONS_KNIGHT: Weapon[] = [
    {
        id: 'longsword',
        name: 'Longsword',
        sprite: 'knight/longsword/knight_longsword.gif',
        description: ''
    },
    {
        id: 'saber',
        name: 'Saber',
        sprite: 'knight/saber/knight_saber.gif',
        description: ''
    }
// Add more weapons
];