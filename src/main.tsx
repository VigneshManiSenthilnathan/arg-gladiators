import { Devvit, useState } from '@devvit/public-api';
import { WelcomePage } from './components/WelcomePage';
import { NewArgumentPage } from './components/NewArgumentPage';
import { MyArgumentsPage } from './components/MyArgumentsPage';
import { HowToUsePage } from './components/HowToUsePage';
import { PlayerHome } from './components/PlayerHome';
import { PickSidePage } from './components/PickSidePage';
import { PickHeroPage } from './components/PickHeroPage';
// Import other components

Devvit.configure({
  redditAPI: true,
  redis: true,
});

// Main mod post type
Devvit.addCustomPostType({
  name: 'Argument Battle Creator',
  render: (context) => {
    // Implement navigation between pages
    const [currentPage, setCurrentPage] = useState('welcome');
    
    switch(currentPage) {
      case 'welcome':
        return <WelcomePage onNavigate={setCurrentPage} />;
      case 'new-argument':
        return <NewArgumentPage onNavigate={setCurrentPage} />;
      case 'my-arguments':
        return <MyArgumentsPage onNavigate={setCurrentPage} />;
      case 'how-to-use':
        return <HowToUsePage onNavigate={setCurrentPage} />;
      case 'player-home':
        return <PlayerHome onNavigate={setCurrentPage} />;
      case 'pick-side':
        return <PickSidePage onNavigate={setCurrentPage} />;
      case 'pick-hero':
        return <PickHeroPage onNavigate={setCurrentPage} />;
      default:
        return <WelcomePage onNavigate={setCurrentPage} />;
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
    const currentSubreddit = await context.reddit.getCurrentSubreddit();
    await getUserInformation(context);
    await context.reddit.submitPost({
      title: 'Argument Battle Creator',
      subredditName: currentSubreddit.name,
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