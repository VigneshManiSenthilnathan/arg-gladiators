import type { Context } from '@devvit/public-api';
import { usePagination } from '@devvit/kit';
import { Devvit, useState, useAsync } from '@devvit/public-api';

import { WEAPONS_KNIGHT } from '../data/weapons/knight';
import { WEAPONS_MAGE } from '../data/weapons/mage';
import { WEAPONS_BARBARIAN } from '../data/weapons/barbarian';
// import { savePlayerProfile, getPlayerProfile } from '../utils/storage';

interface PickWeaponPageProps {
    onNavigate: (page: string) => void;
}

interface Weapon extends Record<string, string> {
    id: string;
    name: string;
    sprite: string;
    description: string;
}

export const PickWeaponPage = ({ onNavigate }: PickWeaponPageProps, _context: Context): JSX.Element => {
    const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
    const [weaponsList, setWeaponsList] = useState<Weapon[]>(async () => {
        const username = await _context.reddit.getCurrentUsername();
        const heroClassRedis = await _context.redis.hGet(`battle:${_context.postId}:${username}`, 'hero');
        
        if (heroClassRedis === 'knight') {
            return WEAPONS_KNIGHT;
        } else if (heroClassRedis === 'mage') {
            return WEAPONS_MAGE;
        } else if (heroClassRedis === 'barbarian') {
            return WEAPONS_BARBARIAN;
        }
        else{
            throw new Error('Failed to retrieve hero class');
        }
        
        return [];
    });

    // Use pagination with 1 item per page
    if (!weaponsList){
        throw new Error('Failed to retrieve weapons list');
    }

    const { 
    currentItems, 
    currentPage, 
    pagesCount, 
    toNextPage, 
    toPrevPage, 
    isFirstPage, 
    isLastPage 
    } = usePagination(_context, weaponsList, 1);

    const handleWeaponSelect = async (weaponName: string) => {
        setSelectedWeapon(weaponName);

        // Get existing profile and update with hero
        const [currentUsername, postId] = await Promise.all([
            await _context.reddit.getCurrentUsername(), // Vulnerability: requires user to be logged in
            _context.postId
        ]);
        if (!currentUsername) {
            throw new Error('Failed to retrieve current user information');
        }
        const existingProfile = await _context.redis.hGetAll(`battle:${postId}:${currentUsername}`);
        const updatedProfile = {
            joinedAt: existingProfile.joinedAt,
            lastPage: 'pick-weapon',
            side: existingProfile.side,
            hero: existingProfile.hero,
            weapon: weaponName,
            warCry: existingProfile.warCry
        };

        // Save updated profile
        await _context.redis.hSet(`battle:${postId}:${currentUsername}`, updatedProfile);
    };

    const handleContinue = () => {
        if (selectedWeapon) {
            onNavigate('war-cry');
        } else {
            // Show error or prevent navigation
            console.log('Please select a weapon');
        }
    };

    return (
        <zstack width="100%" height="100%" alignment="center middle">
            <image url="background1.jpg" imageHeight="256px" imageWidth="256px" width="100%" height="100%" />
            <vstack padding='medium' alignment='center' gap='small'>
                <text size="large" weight="bold" color='black'>
                    Choose Your Weapon
                </text>
                
                {weaponsList?.length === 0 &&
                    <text>Loading weapons...</text>
                }   
                {weaponsList?.length !== 0 &&
                    <hstack alignment="middle center" gap="small" padding="small">
                        <button 
                            onPress={toPrevPage} 
                            disabled={isFirstPage}
                            icon="left"
                        />
                        <text color='black'>Page {currentPage + 1} of {pagesCount}</text>
                        <button 
                            onPress={toNextPage} 
                            disabled={isLastPage}
                            icon="right"
                        />
                    </hstack>
                }
                {weaponsList?.length !== 0 && 
                    <vstack>
                        {currentItems.map((weapon) => (
                        <hstack 
                            key={weapon.id}
                            onPress={() => handleWeaponSelect(weapon.id)}
                            borderColor={selectedWeapon === weapon.id ? 'white' : undefined}
                            padding='small'
                            gap='small'
                            cornerRadius='medium'
                        >
                            <image 
                                url={'weapons/'+weapon.sprite}
                                imageWidth="100px"
                                imageHeight="100px"
                            />
                            <vstack gap='small' padding='small' cornerRadius='small' 
                                backgroundColor={selectedWeapon === weapon.id ? 'rgba(20,28,36,0.2)' : undefined}>
                                <text weight='bold' color='black'>{weapon.name}</text>
                                <text color='black'>{weapon.id}</text>
                            </vstack>
                        </hstack>
                        ))}
                    </vstack>
                }


                <button 
                    onPress={handleContinue}
                    disabled={!selectedWeapon}
                >
                    Continue to Arena
                </button>
            </vstack>
        </zstack>
    );
}