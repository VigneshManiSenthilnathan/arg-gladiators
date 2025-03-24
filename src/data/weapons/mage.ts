export interface Weapon extends Record<string, string> {
    id: string;
    name: string;
    sprite: string;
    description: string;
}
  
export const WEAPONS_MAGE: Weapon[] = [
    {
        id: 'staff',
        name: 'Sorcerer\'s Staff',
        sprite: 'mage/staff/mage_staff.gif',
        description: ''
    },
    {
        id: 'gnarled-staff',
        name: 'Cursed Staff',
        sprite: 'mage/gnarled/mage_gnarled.gif',
        description: ''
    }
// Add more weapons
];