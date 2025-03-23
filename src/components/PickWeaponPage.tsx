import type { Context } from '@devvit/public-api';
import { usePagination } from '@devvit/kit';
import { Devvit, useState } from '@devvit/public-api';
import { WEAPONS } from '../data/weapons';
// import { savePlayerProfile, getPlayerProfile } from '../utils/storage';

interface PickWeaponPageProps {
    onNavigate: (page: string) => void;
}
  

export const PickWeaponPage = ({ onNavigate }: PickWeaponPageProps, _context: Context): JSX.Element => {
    const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);

      // Use pagination with 1 item per page
      const { 
        currentItems, 
        currentPage, 
        pagesCount, 
        toNextPage, 
        toPrevPage, 
        isFirstPage, 
        isLastPage 
      } = usePagination(_context, WEAPONS, 1);

    const handleWeaponSelect = async (weaponName: string) => {
        setSelectedWeapon(weaponName);

        // Get existing profile and update with hero
        const currentUser = await _context.reddit.getCurrentUser(); // Vulnerability: requires user to be logged in
        const battleId = await _context.redis.get('battleId');
        if (!currentUser) {
            throw new Error('Failed to retrieve current user information');
        }
        const existingProfile = await _context.redis.hGetAll(`battle:${battleId}:${currentUser.username}`);
        const updatedProfile = {
            joinedAt: existingProfile.joinedAt,
            lastPage: 'pick-weapon',
            side: existingProfile.side,
            hero: existingProfile.hero,
            weapon: weaponName,
            warCry: existingProfile.warCry
        };

        // Save updated profile
        await _context.redis.hSet(`battle:${battleId}:${currentUser.username}`, updatedProfile);
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
            <vstack padding='medium' alignment='center'>
                <text size="large" weight="bold">
                    Choose Your Weapon
                </text>
                
                <vstack>
                    {currentItems.map((weapon) => (
                    <hstack 
                        key={weapon.id}
                        onPress={() => handleWeaponSelect(weapon.id)}
                        borderColor={selectedWeapon === weapon.name ? 'white' : 'black'}
                        padding='small'
                        gap='small'
                        cornerRadius='medium'
                    >
                        <image 
                            url='logo.png'
                            imageWidth="100px"
                            imageHeight="100px"
                        />
                        <vstack>
                            <text weight='bold'>{weapon.name}</text>
                            <text>{weapon.id}</text>
                        </vstack>
                    </hstack>
                    ))}
                </vstack>

                {/* Pagination Controls */}
                <hstack alignment="middle center" gap="small" padding="small">
                <button 
                    onPress={toPrevPage} 
                    disabled={isFirstPage}
                    icon="left"
                />
                <text>Page {currentPage + 1} of {pagesCount}</text>
                <button 
                    onPress={toNextPage} 
                    disabled={isLastPage}
                    icon="right"
                />
                </hstack>

                <button 
                    onPress={handleContinue}
                    disabled={!selectedWeapon}
                    width={'50%'}
                >
                    Continue
                </button>
            </vstack>
        </zstack>
    );
}