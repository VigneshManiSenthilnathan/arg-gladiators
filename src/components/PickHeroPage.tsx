import { usePagination } from '@devvit/kit';
import type { Context } from '@devvit/public-api';
import { Devvit, useState, useInterval } from '@devvit/public-api';
import { HEROES } from '../data/heroes';
//import { savePlayerProfile, getPlayerProfile } from '../utils/storage';

interface PickHeroPageProps {
  onNavigate: (page: string) => void;
}

export const PickHeroPage = ({ onNavigate }: PickHeroPageProps, _context: Context): JSX.Element => {
  const [selectedHero, setSelectedHero] = useState<string | null>(null);
  
  // Use pagination with 1 item per page
  const { 
    currentItems, 
    currentPage, 
    pagesCount, 
    toNextPage, 
    toPrevPage, 
    isFirstPage, 
    isLastPage 
  } = usePagination(_context, HEROES, 1);

  // Client-side UI updates
  const handleHeroSelectUI = (heroName: string) => {
    setSelectedHero(heroName);
  };

  // Server-side data operations
  const saveHeroSelection = async () => {
    // Redis operations here
    // Get existing profile and update with hero
    let choice = '';
    if (selectedHero !== null) {
      choice = selectedHero;
    }

    const [username, postId] = await Promise.all([
      _context.reddit.getCurrentUsername(), // Vulnerability: requires user to be logged in
      _context.postId
    ]);
    if (!username) {
        throw new Error('Failed to retrieve current user information');
    }
    const existingProfile = await _context.redis.hGetAll(`battle:${postId}:${username}`);
    const updatedProfile = {
        joinedAt: existingProfile.joinedAt,
        lastPage: 'pick-hero',
        side: existingProfile.side,
        hero: choice,
        weapon: existingProfile.weapon,
        warCry: existingProfile.warCry
    };
    console.log('Updated profile:', updatedProfile);

    // Save updated profile
    await _context.redis.hSet(`battle:${postId}:${username}`, updatedProfile);
  };

  const handleHeroSelect = async (heroName: string) => {
    handleHeroSelectUI(heroName);
  };

  const handleContinue = async () => {
    if (selectedHero) {
        saveHeroSelection();
        const username = await _context.reddit.getCurrentUsername();
        let heroRedis = await _context.redis.hGet(`battle:${_context.postId}:${username}`, 'hero');
        while (heroRedis !== selectedHero) {
          heroRedis = await _context.redis.hGet(`battle:${_context.postId}:${username}`, 'hero');
        }
        console.log('Redis hero:', heroRedis); 
        onNavigate('pick-weapon');
    } else {
        // Show error or prevent navigation
        _context.ui.showToast('Please select a hero');
    }
  };

  return (
    <zstack width="100%" height="100%" alignment="center middle">
      <image url="background1.jpg" imageHeight="256px" imageWidth="256px" width="100%" height="100%" />
      <vstack padding='medium' alignment='center' gap='small'>
        <text size="xlarge" weight="bold" color='black'>
          Choose Your Hero
        </text>

        {/* Pagination Controls */}
        <hstack alignment="middle center" gap="small" padding="small">
          <button 
            onPress={toPrevPage} 
            disabled={isFirstPage}
            icon="left"
          />
          <text color='black'>Hero {currentPage + 1} of {pagesCount}</text>
          <button 
            onPress={toNextPage} 
            disabled={isLastPage}
            icon="right"
          />
        </hstack>
        
        <vstack>
          {currentItems.map((hero) => (
            <hstack 
              key={hero.id}
              onPress={() => handleHeroSelect(hero.id)}
              // borderColor={selectedHero === hero.id ? 'white' : undefined}
              padding='small'
              gap='small'
              cornerRadius='medium'
            >
              <image 
                url={'heroes/' + hero.sprite}
                imageWidth="100px"
                imageHeight="100px"
              />
          
              <vstack gap='small' padding='small' cornerRadius='small' 
                backgroundColor={selectedHero === hero.id ? 'rgba(20,28,36,0.2)' : undefined}>
                <text weight='bold' color='black'>{hero.name}</text>
                <text color='black'>{hero.description}</text>
              </vstack>
            </hstack>
          ))}
        </vstack>

        <button 
          onPress={handleContinue}
          disabled={!selectedHero}
        >
          Continue to Weapon Selection
        </button>
      </vstack>
    </zstack>
  );
}