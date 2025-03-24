export interface Weapon {
  id: string;
  name: string;
  sprite: string;
  desc: string;
}

export interface WeaponDictionary {
  hero: string;
  weapons: Weapon[];
}

export const WEAPONS: WeaponDictionary[] = [
  {
    hero: 'knight',
    weapons: [
      {
        id: 'longsword',
        name: 'Longsword',
        sprite: 'knight/longsword/knight_longsword.gif',
        desc: ''
      },
      {
        id: 'saber',
        name: 'Saber',
        sprite: 'knight/saber/knight_saber.gif',
        desc: ''
      }
    ]
  },
  {
    hero: 'mage',
    weapons: [
      {
        id: 'staff',
        name: 'Sorcerer\'s Staff',
        sprite: 'mage/staff/mage_staff.gif',
        desc: ''
      },
      {
        id: 'gnarled-staff',
        name: 'Cursed Staff',
        sprite: 'mage/gnarled/mage_gnarled.gif',
        desc: ''
      }
    ]
  }
  // Add more weapons
];