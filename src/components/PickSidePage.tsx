import type { Context } from '@devvit/public-api';
import { Devvit, useState, useAsync } from '@devvit/public-api';
// import { savePlayerProfile, getPlayerProfile } from '../utils/storage';

interface PickSidePageProps {
  onNavigate: (page: string) => void;
}

export const PickSidePage = ({ onNavigate }: PickSidePageProps, _context: Context): JSX.Element => {
    console.log('reached PickSidePage.tsx');
    const [selectedSide, setSelectedSide] = useState<string | null>(null);
    const [argument, setArgument] = useState<{ leftSide: string; rightSide: string } | null>(null);

    // Use useAsync to fetch argument sides once
    const argumentSides = useAsync<{ leftSide: string; rightSide: string } | null>(async () => {
        try {
            const battleId = await _context.redis.get('battleId');
            const argVals = await _context.redis.hGetAll(`battle:${battleId}`);
            console.log('Argument values:', argVals);

            if (!argVals) return null;

            const argValsParsed = JSON.parse(argVals.values);
            console.log('Parsed argument values:', argValsParsed);
            const argSides = {
                leftSide: argValsParsed.sideA,
                rightSide: argValsParsed.sideB
            }
            setArgument(argSides);
            return {
                leftSide: argValsParsed.sideA,
                rightSide: argValsParsed.sideB
            };
        } catch (error) {
            console.error('Failed to fetch argument sides', error);
            return null;
        }
    }, {}); // Empty options object ensures it runs only once

    console.log('Argument sides:', argumentSides);


  // Handle side selection
  const handleSideSelect = async (side: string) => {
    setSelectedSide(side);
    
    // Get existing profile and update with selected side
    const battleId = await _context.redis.get('battleId');
    const currentUser = await _context.reddit.getCurrentUser(); // Vulnerability: requires user to be logged in
    if (!currentUser) {
        throw new Error('Failed to retrieve current user information');
    }
    const existingProfile = await _context.redis.hGetAll(`battle:${battleId}:${currentUser.username}`);
    const updatedProfile = {
        joinedAt: existingProfile.joinedAt,
        side: side,
        hero: existingProfile.heroName,
        weapon: existingProfile.weapon,
        warCry: existingProfile.warCry
    };

    // Save updated profile
    await _context.redis.hSet(`battle:${battleId}:${currentUser.username}`, updatedProfile);
  };

  // Continue to next page
  const handleContinue = () => {
    if (selectedSide) {
      onNavigate('pick-hero');
    } else {
      // Show error or prevent navigation
      _context.ui.showToast('Please select a side');
    }
  };

  // If sides are not loaded yet, show loading
  if (!argument) {
    return (
      <blocks>
        <vstack>
          <text>Loading argument...</text>
        </vstack>
      </blocks>
    );
  }

  return (
    <blocks>
      <vstack gap="medium" alignment="center">
        <text size="xlarge" weight="bold" alignment='center'>
          Choose Your Side
        </text>

        <text size="large" alignment='center'>
          Select which perspective you want to argue from
        </text>

        <hstack gap="medium" alignment="center">
          {/* Left Side Button */}
          <button
            onPress={() => handleSideSelect(argument.leftSide)}
            appearance='primary'
            size='medium'
          >
            {argument.leftSide}
          </button>

          {/* Right Side Button */}
          <button
            onPress={() => handleSideSelect(argument.rightSide)}
            appearance='primary'
            size='medium'
          >
            {argument.rightSide}
          </button>
        </hstack>

        {/* Additional Information */}
        {selectedSide && (
          <vstack 
            gap="small"
            padding='medium'
            backgroundColor='lightyellow' 
          >
            <text weight='bold'>
              You've selected: {selectedSide}
            </text>
            <text>
              Prepare your arguments and choose your hero wisely!
            </text>
          </vstack>
        )}

        {/* Continue Button */}
        <button 
          onPress={handleContinue}
          disabled={!selectedSide}
        >
          Continue to Hero Selection
        </button>
      </vstack>
    </blocks>
  );
}
