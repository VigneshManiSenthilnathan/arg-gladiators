import type { Context } from '@devvit/public-api';
import { Devvit, useState, useAsync } from '@devvit/public-api';
// import { savePlayerProfile, getPlayerProfile } from '../utils/storage';

interface PickSidePageProps {
  onNavigate: (page: string) => void;
  options: { leftSide: string; rightSide: string } | null;
}

export const PickSidePage = ({ onNavigate, options }: PickSidePageProps, _context: Context): JSX.Element => {
    // console.log('reached PickSidePage.tsx');
    const [selectedSide, setSelectedSide] = useState<string | null>(null);
    // const [argument, setArgument] = useState<{ leftSide: string, rightSide: string } | null>(null);

    async function getArgumentSides() {
        try {
            const battleId = await _context.redis.get('battleId');
            const argVals = await _context.redis.hGetAll(`battle:${battleId}`);
            // console.log('Argument values:', argVals);

            if (!argVals) return null;

            const argValsParsed = JSON.parse(argVals.values);
            // console.log('Parsed argument values:', argValsParsed);
            const argSides = {
                leftSide: argValsParsed.sideA,
                rightSide: argValsParsed.sideB
            }

            options = argSides;
            // console.log('Argument sides:', argSides);
            return {
                leftSide: argValsParsed.sideA,
                rightSide: argValsParsed.sideB
            };
        }
        catch (error) {
            console.error('Failed to fetch argument sides', error);
            return null;
        }
    }

    // Use useAsync to fetch argument sides once
    const argumentSides = useAsync<{ leftSide: string; rightSide: string } | null>(async () => {
        try {
            return await getArgumentSides();
        } catch (error) {
            console.error('Failed to fetch argument sides', error);
            return null;
        }
    }, {}); // Empty options object ensures it runs only once

    // console.log('Async results:', argumentSides);
    // console.log('ArgLeft:', argLeft);
    // console.log('ArgRight:', argRight);


  // Handle side selection
  const handleSideSelect = (side: string) => {
    let choice = side === 'left' ? argumentSides.data?.leftSide : argumentSides.data?.rightSide;
    if (!choice) {
        choice = ''
    }
    setSelectedSide(choice || '');
  };

  const saveSideSelection = async () => {
    // Redis operations here
    // Get existing profile and update with selected side
    let choice = '';
    if (selectedSide !== null) {
      choice = selectedSide;
    }
    const [username, battleId] = await Promise.all([
      _context.reddit.getCurrentUsername(), // Vulnerability: requires user to be logged in
      _context.redis.get('battleId')
    ]);
    if (!username) {
        throw new Error('Failed to retrieve current user information');
    }
    // console.log('Selected side:', choice);
    const existingProfile = await _context.redis.hGetAll(`battle:${battleId}:${username}`);
    const updatedProfile = {
        joinedAt: existingProfile.joinedAt,
        lastPage: 'pick-side',
        side: choice,
        hero: existingProfile.heroName,
        weapon: existingProfile.weapon,
        warCry: existingProfile.warCry
    };
    console.log('Updated profile:', updatedProfile);

    // Save updated profile
    await _context.redis.hSet(`battle:${battleId}:${username}`, updatedProfile);
  }

  // Continue to next page
  const handleContinue = () => {
    if (selectedSide) {
      saveSideSelection();
      onNavigate('pick-hero');
    } else {
      // Show error or prevent navigation
      _context.ui.showToast('Please select a side');
    }
  };

//   // If sides are not loaded yet, show loading
//   if (!options) {
//     getArgumentSides();
//     return (
//       <blocks>
//         <vstack>
//           <text>Loading argument...</text>
//         </vstack>
//       </blocks>
//     );
//   }

  return (
    <zstack width="100%" height="100%" alignment="center middle">
      <image url="background1.jpg" imageHeight="256px" imageWidth="256px" width="100%" height="100%" />
      <vstack gap="medium" alignment="center middle" >
        <text size="xlarge" weight="bold" alignment='center' color='black' style='heading'>
          Choose Your Side
        </text>

        <text size="large" alignment='center' color='black'>
          Select which perspective you want to argue from
        </text>

        {argumentSides?.data && (
          <hstack gap="large" alignment="center">
            {/* Left Side Button */}
            <button
              onPress={() => handleSideSelect('left')}
              appearance={selectedSide === argumentSides.data?.leftSide ? 'primary' : undefined}
              size='large'
            >
              {argumentSides.data?.leftSide}
            </button>

            {/* Right Side Button */}
            <button
              onPress={() => handleSideSelect('right')}
              appearance={selectedSide === argumentSides.data?.rightSide ? 'primary' : undefined}
              size='large'
            >
              {argumentSides.data?.rightSide}
            </button>
          </hstack>
        )}

        {/* Additional Information
        {selectedSide && (
          <vstack 
            gap="small"
            padding='medium'
          >
            <text weight='bold'>
              You've selected: {selectedSide}
            </text>
            <text>
              Prepare your arguments and choose your hero wisely!
            </text>
          </vstack>
        )} */}

        {/* Continue Button */}
        <button 
          onPress={handleContinue}
          disabled={!selectedSide}
        >
          Continue to Hero Selection
        </button>
      </vstack>
    </zstack>
  );
}
