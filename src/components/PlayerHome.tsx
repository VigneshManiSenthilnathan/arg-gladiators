import type { Context } from '@devvit/public-api';
import { Devvit, useState } from '@devvit/public-api';
import { useGameState } from '../hooks/useGameState';

interface PlayerHomeProps {
  onNavigate: (page: string) => void;
}

export const PlayerHome = ({ onNavigate }: PlayerHomeProps, _context: Context): JSX.Element => {
  // const { useState } = Devvit;
  // const { updateProfile } = useGameState();
  const [joining, setJoining] = useState(false);
  
  const handleJoin = async () => {
    // TODO: Implement user information extraction
    setJoining(true);
    
    try {
      // Get current user information
      const currentUsername = await _context.reddit.getCurrentUsername();
      const postId = _context.postId;
      
      if (!currentUsername) {
        throw new Error('Failed to retrieve current user information');
      }

      
      // Store in running memory
      //setPlayerData(playerProfile);
      
      // TODO: Store in Redis for persistence
      const players = await _context.redis.hGet(`battle:${postId}:player`, 'players');
      const player_curr = await _context.redis.hKeys(`battle:${postId}:${currentUsername}`);

      if (!player_curr) {
        await _context.redis.hSet(`battle:${postId}:${currentUsername}`, {
          joinedAt: new Date().toISOString(),
          lastPage: 'player-home',
          side: '',
          hero: '',
          weapon: '',
          warCry: '',
        });
      }

      const playersArray = players ? JSON.parse(players) : [];
      if (playersArray.includes(currentUsername)) {
        _context.ui.showToast('You have already joined this battle');
      } else {
        playersArray.push(currentUsername);
        const newPlayers = JSON.stringify(playersArray);
        await _context.redis.hSet(`battle:${postId}:players`, { players: newPlayers });
        await _context.redis.hSet(`battle:${postId}:${currentUsername}`, {
          joinedAt: new Date().toISOString(),
          side: '',
          hero: '',
          weapon: '',
          warCry: '',
        });
        _context.ui.showToast('You have joined the battle!');
      }
     
      // updateProfile({ currentUser.username });
      
      // Navigate to pick side page
      onNavigate('pick-side');
    } catch (error) {
      if (error instanceof Error) {
        _context.ui.showToast('Failed to join battle: ' + error.message);
      } else {
        _context.ui.showToast('Failed to join battle');
      }
      console.error('Join error:', error);
      setJoining(false);
    }
  };
  
  return (
    <zstack width="100%" height="100%" alignment="center middle">
      <image url="background1.jpg" imageHeight="256px" imageWidth="256px" width="100%" height="100%" />
      <vstack height="100%" padding="medium" gap="medium" alignment="center middle">
        
        {/* // Consider changing to the arg istself */}
        <image url="logo.png" imageHeight="256px" imageWidth="256px" width="40%" height="40%" />
        <text size="large" color='black'>Join the epic debate!</text>
    
        {/* <image
          url="logo.png"
          imageWidth="100px"
          imageHeight="100px"
          resizeMode="fit"
        /> */}
        
        <button
          onPress={handleJoin}
          disabled={joining}
          size="large"
        >
          {joining ? "JOINING..." : "JOIN"}
        </button>
        
        <text size="small" color='black'>By joining, you'll be able to pick a side and enter the battle!</text>
      </vstack>
    </zstack>
  );
}