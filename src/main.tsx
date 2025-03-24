import type { Context, Post } from '@devvit/public-api';
import { Devvit, useState, useForm } from '@devvit/public-api';

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
    // // Implement navigation between pages
    // const [defaultPage, setDefaultPage] = useState('welcome');

    // Implement navigation between pages
    const [defaultPage, setDefaultPage] = useState(async () => {
      try {
        const [username, postId] = await Promise.all([
          context.reddit.getCurrentUsername(), // Vulnerability: requires user to be logged in
          context.postId
        ]);
        
        if (username && postId) {
          // Check if the user has data in Redis
          const exists = await context.redis.exists(`battle:${postId}:${username}`);
          
          if (exists) {
            // Get the user's data from Redis
            const userData = await context.redis.hGetAll(`battle:${postId}:${username}`);
            
            // If lastPage exists, return it, otherwise return 'welcome'
            return userData.lastPage || 'player-home';
          }
        }
        
        // Default to 'welcome' if no data is found
        return 'player-home';
      } catch (error) {
        console.error('Error retrieving page from Redis:', error);
        return 'player-home';
      }
    });
        
  
    switch(defaultPage) {
      case 'player-home':
        return <PlayerHome onNavigate={setDefaultPage} />;
      case 'pick-side':
        return <PickSidePage onNavigate={setDefaultPage}/>;
      case 'pick-hero':
        return <PickHeroPage onNavigate={setDefaultPage} />;
      case 'pick-weapon':
        return <PickWeaponPage onNavigate={setDefaultPage} />;
      default:
        return <PlayerHome onNavigate={setDefaultPage} />;
    }
  }
});


// let values: ({ title: string; } & { sideA: string; } & { sideB: string; } & { [key: string]: any; }) | null = null;
const argumentForm = Devvit.createForm(
  {
    fields: [
      {
        name: 'title',
        label: 'Argument Title',
        type: 'string',
        required: true,
        helpText: 'Enter a title for your argument battle'
      },
      {
        name: 'sideA',
        label: 'Side A Name',
        type: 'string',
        required: true,
        helpText: 'Description for the first side of the argument'
      },
      {
        name: 'sideB',
        label: 'Side B Name',
        type: 'string',
        required: true,
        helpText: 'Description for the second side of the argument'
      },
      {
        name: 'duel',
        label: 'Enable Duel Mode',
        type: 'boolean',
        defaultValue: false,
        helpText: 'Enable duel mode for this argument battle'
      },
      {
        name: 'bots',
        label: 'Bots',
        type: 'boolean',
        defaultValue: false,
        helpText: 'Allow bots to participate in this argument battle',
      }
    ],
    title: 'Create Argument Battle',
    acceptLabel: 'Create Battle',
  },

  async (event, context) => {

    const [ currentSubredditName, username ] = await Promise.all([
      context.reddit.getCurrentSubredditName(),
      context.reddit.getCurrentUsername() // Vulnerability: requires user to be logged in
    ]);

    const post = await context.reddit.submitPost({
      title: (event.values.title ? event.values.title : 'New Argument Battle'),
      subredditName: currentSubredditName,
      preview: (
        <vstack width="100%" height="100%" alignment="middle center">
          <text>Loading Argument Battle Creator...</text>
        </vstack>
      ),
    });

    if (event) {
      if (username) {
        await context.redis.hSet(`battle:${post.id}:metadata`, {
          creator: username,
          createdAt: Date.now().toString(),
          title: event.values.title,
        });
        await context.redis.hSet(`battle:${post.id}:players`, { 
          players : JSON.stringify([]) 
        });
        await context.redis.hSet(`battle:${post.id}:${username}`, {
          joinedAt: '',
          lastPage: 'player-home',
          side: '',
          hero: '',
          weapon: '',
          warCry: '',
        });

      }
      if (post) {
        await context.redis.hSet(`battle:${post.id}:info`, {
          title: event.values.title,
          sideA: event.values.sideA,
          sideB: event.values.sideB,
          duel: event.values.duel? 'enabled' : 'disabled',
          bots: event.values.bots? 'enabled' : 'disabled',
        });
      } else {
        console.error('No post info found in Redis');
      }
    }
  }
);

async function getArgumentInformation(context: Devvit.Context) {
  // Show the form to the user and get the result
  context.ui.showForm(argumentForm);
}

// Add menu action to create a new argument battle post
Devvit.addMenuItem({
  location: 'subreddit',
  label: 'Create Argument Battle Creator',
  onPress: async (event, context) => {

    const [username] = await Promise.all([
      context.reddit.getCurrentUsername(), // Vulnerability: requires user to be logged in
    ]);
    if (!username) {
      throw new Error('Please log in to create a battle');
    }

    // await getUserInformation(context, username);
    await getArgumentInformation(context);
    context.ui.showToast('Created Argument Battle Creator post!');
  },
});

export default Devvit;