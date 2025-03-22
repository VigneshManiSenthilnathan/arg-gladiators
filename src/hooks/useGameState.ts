import { useState } from 'react';
import { Hero } from '../data/heroes';
import { Weapon } from '../data/weapons';

export interface PlayerProfile {
  username?: string;
  side?: string;
  hero?: Hero;
  weapon?: Weapon;
  warCry?: string;
}

export const useGameState = () => {
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>({});

  const updateProfile = (updates: Partial<PlayerProfile>) => {
    setPlayerProfile(prev => ({ ...prev, ...updates }));
  };

  return { playerProfile, updateProfile };
};