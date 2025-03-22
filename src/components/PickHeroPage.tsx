import type { Context } from '@devvit/public-api';
import { Devvit, useState } from '@devvit/public-api';
import { HEROES } from '../data/heroes';
//import { savePlayerProfile, getPlayerProfile } from '../utils/storage';

interface PickHeroPageProps {
  onNavigate: (page: string) => void;
}

export function PickHeroPage({ onNavigate }: PickHeroPageProps, _context: Context) {
  const [selectedHero, setSelectedHero] = useState<string | null>(null);

  const handleHeroSelect = async (heroName: string) => {
    setSelectedHero(heroName);
    
    // Get existing profile and update with hero
    const currentUser = await _context.reddit.getCurrentUser(); // Vulnerability: requires user to be logged in
    const battleId = await _context.redis.get('battleId');
    if (!currentUser) {
        throw new Error('Failed to retrieve current user information');
    }
    const existingProfile = await _context.redis.hGetAll(`battle:${battleId}:${currentUser.username}`);
    const updatedProfile = {
        joinedAt: existingProfile.joinedAt,
        side: existingProfile.side,
        hero: heroName,
        weapon: existingProfile.weapon,
        warCry: existingProfile.warCry
    };

    // Save updated profile
    await _context.redis.hSet(`battle:${battleId}:${currentUser.username}`, updatedProfile);
  };

  const handleContinue = () => {
    if (selectedHero) {
        onNavigate('pick-weapon');
    } else {
      // Show error or prevent navigation
      console.log('Please select a hero');
    }
  };

  return (
    <blocks>
      <vstack>
        <text size="large" weight="bold">
          Choose Your Hero
        </text>
        
        <vstack>
          {HEROES.map((hero) => (
            <hstack 
              key={hero.id}
              onPress={() => handleHeroSelect(hero.name)}
            //   style={{
            //     backgroundColor: selectedHero === hero.id 
            //       ? 'lightblue' 
            //       : 'white',
            //     padding: 'md',
            //     borderRadius: 'md',
            //     marginBottom: 'sm'
            //   }}
            >
              <image 
                url={hero.sprite}
                imageWidth="100px"
                imageHeight="100px"
              />
              <vstack>
                <text weight='bold'>{hero.name}</text>
                <text>{hero.description}</text>
              </vstack>
            </hstack>
          ))}
        </vstack>

        <button 
          onPress={handleContinue}
          disabled={!selectedHero}
        >
          Continue
        </button>
      </vstack>
    </blocks>
  );
}