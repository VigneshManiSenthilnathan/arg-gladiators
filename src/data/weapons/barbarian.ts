export interface Weapon extends Record<string, string> {
    id: string;
    name: string;
    sprite: string;
    description: string;
}
  
export const WEAPONS_BARBARIAN: Weapon[] = [
    {
        id: 'waraxe',
        name: 'War Axe',
        sprite: 'barbarian/waraxe/barbarian_waraxe.gif',
        description: ''
    },
    {
        id: 'mace',
        name: 'Spiked Mace',
        sprite: 'barbarian/mace/barbarian_mace.gif',
        description: ''
    }
// Add more weapons
];