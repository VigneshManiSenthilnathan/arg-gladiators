import { Devvit, useState } from '@devvit/public-api';
import { WelcomePage } from './components/WelcomePage';
import { NewArgumentPage } from './components/NewArgumentPage';
import { MyArgumentsPage } from './components/MyArgumentsPage';
import { HowToUsePage } from './components/HowToUsePage';
import { PlayerHome } from './components/PlayerHome';
import { PickSidePage } from './components/PickSidePage';
import { PickHeroPage } from './components/PickHeroPage';
import { PickWeaponPage } from './components/PickWeaponPage';

Devvit.configure({
  redditAPI: true,
  redis: true,
  http: true,
});

// Main mod post type
Devvit.addCustomPostType({
  name: 'Argument Battle Creator',
  render: (context) =>{
    // Implement navigation between pages
    const [defaultPage, setDefaultPage] = useState(async () => {
      try {
        const [username, battleId] = await Promise.all([
          context.reddit.getCurrentUsername(), // Vulnerability: requires user to be logged in
          context.redis.get('battleId')
        ]);
        
        if (username && battleId) {
          // Check if the user has data in Redis
          const exists = await context.redis.exists(`battle:${battleId}:${username}`);
          
          if (exists) {
            // Get the user's data from Redis
            const userData = await context.redis.hGetAll(`battle:${battleId}:${username}`);
            
            // If lastPage exists, return it, otherwise return 'welcome'
            return userData.lastPage || 'welcome';
          }
        }
        
        // Default to 'welcome' if no data is found
        return 'welcome';
      } catch (error) {
        console.error('Error retrieving page from Redis:', error);
        return 'welcome';
      }
    });
    

    switch(defaultPage) {
      case 'welcome':
        return <WelcomePage onNavigate={setDefaultPage} />;
      case 'new-argument':
        return <NewArgumentPage onNavigate={setDefaultPage} />;
      case 'my-arguments':
        return <MyArgumentsPage onNavigate={setDefaultPage} />;
      case 'how-to-use':
        return <HowToUsePage onNavigate={setDefaultPage} />;
      case 'player-home':
        return <PlayerHome onNavigate={setDefaultPage} />;
      case 'pick-side':
        return <PickSidePage onNavigate={setDefaultPage} options={null}/>;
      case 'pick-hero':
        return <PickHeroPage onNavigate={setDefaultPage} />;
      case 'pick-weapon':
        return <PickWeaponPage onNavigate={setDefaultPage} />;
      default:
        return <WelcomePage onNavigate={setDefaultPage} />;
    }
  }
});

async function getUserInformation(context: Devvit.Context) {
  // Set a key
  const username = await context.reddit.getCurrentUsername();
  console.log('User Name:', username);
  if (username) {
    await context.redis.set('createdBy', username);
    await context.redis.set('createdAt', new Date().toISOString());
    await context.redis.set('battleId', `${username}_${new Date().toISOString()}`);
    await context.redis.hSet(`battle:${username}_${new Date().toISOString()}:players`, { players : JSON.stringify([]) });
    await context.redis.hSet(`battle:${username}_${new Date().toISOString()}:${username}`, {
      joinedAt: '',
      side: '',
      hero: '',
      weapon: '',
      warCry: '',
    });
  } else {
    console.error('Failed to get current user');
  }
}

// Add menu action to create a new argument battle post
Devvit.addMenuItem({
  location: 'subreddit',
  label: 'Create Argument Battle Creator',
  onPress: async (event, context) => {
    const currentSubredditName = await context.reddit.getCurrentSubredditName();
    await getUserInformation(context);
    await context.reddit.submitPost({
      title: 'Argument Battle Creator',
      subredditName: currentSubredditName,
      preview: (
        <vstack width="100%" height="100%" alignment="middle center">
          <text>Loading Argument Battle Creator...</text>
        </vstack>
      ),
    });
    context.ui.showToast('Created Argument Battle Creator post!');
  },
});

export default Devvit;