export interface PlayerProfile {
    username?: string;
    side?: 'Side A' | 'Side B';
    hero?: string;
    weapon?: string;
    warCry?: string;
}

export interface Hero {
id: string;
name: string;
sprite: string;
description: string;
}

export interface Weapon {
id: string;
name: string;
sprite: string;
description: string;
}

export enum AppPage {
Home = 'Home',
PickSide = 'PickSide',
PickHero = 'PickHero',
PickWeapon = 'PickWeapon',
WarCry = 'WarCry',
Results = 'Results'
}