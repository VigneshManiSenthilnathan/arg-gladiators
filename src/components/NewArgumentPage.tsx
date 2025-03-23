import type { Context, Post } from '@devvit/public-api';
import { Devvit, useForm, useState } from '@devvit/public-api';
import { PlayerHome } from './PlayerHome';

interface NewArgumentPageProps {
  onNavigate: (page: string) => void;
}

export function NewArgumentPage({ onNavigate }: NewArgumentPageProps, _context: Context) {
  const form = useForm(
    {
      fields: [
        {
          type: 'string',
          name: 'title',
          label: "Argument Title ",
          required: true,
        },
        {
          type: 'string',
          name: 'sideA',
          label: "Side A",
          required: true,
        },
        {
          type: 'string',
          name: 'sideB',
          label: "Side B",
          required: true,
        },
      ],
    },
    async (values) => {
      // TODO: Create a new argument battle post
      // Store the argument data in Redis
      // Naviagte to the player home page
      const battleId = await _context.redis.get('battleId');
      _context.redis.hSet(`battle:${battleId}`, { values: JSON.stringify(values) });

      onNavigate('player-home');

    }
  );

  return (
    <zstack width="100%" height="100%" alignment="center middle">
      <image url="background1.jpg" imageHeight="256px" imageWidth="256px" width="100%" height="100%" />
      <vstack height="100%" alignment="center middle" gap="medium">
        <text size="large" weight="bold" color='black'>Create New Argument</text>
        <spacer size="medium" />
        <button onPress={() => _context.ui.showForm(form)}>Create Argument</button>
        <button onPress={() => onNavigate('welcome')}>Back</button>
      </vstack>
    </zstack>
  );
}