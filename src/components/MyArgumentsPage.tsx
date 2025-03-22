import { Devvit, useState } from '@devvit/public-api';
import { useEffect } from 'react';

interface MyArgumentsPageProps {
  onNavigate: (page: string) => void;
}

export function MyArgumentsPage({ onNavigate }: MyArgumentsPageProps) {
  // const { useEffect } = Devvit;
  const [argument, setArguments] = useState<{ id: string; title: string; sideA: string; sideB: string; createdAt: string; }[]>([]);
  const [loading, setLoading] = useState(true);
  
  // In a real implementation, you would fetch the user's arguments from Redis
  useEffect(() => {
    const fetchArguments = async (context: any) => {
      setLoading(true);
      try {
        // TODO: Fetch user's arguments from Redis
        // Example implementation:
        // const currentUser = await context.reddit.getCurrentUser();
        // const userArguments = await context.redis.hGetAll(`user:${currentUser.username}:arguments`);
        // setArguments(Object.values(userArguments).map(arg => JSON.parse(arg)));
        
        // For now, we'll use placeholder data
        setArguments([
          { id: '1', title: 'Cats vs Dogs', sideA: 'Cats', sideB: 'Dogs', createdAt: new Date().toISOString() },
          { id: '2', title: 'Pizza vs Burgers', sideA: 'Pizza', sideB: 'Burgers', createdAt: new Date().toISOString() }
        ]);
      } catch (error) {
        console.error('Failed to fetch arguments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArguments({});
  }, []);

  return (
    <vstack height="100%" padding="medium" gap="medium">
      <hstack alignment="center middle">
        <text size="xlarge" weight="bold">My Arguments</text>
      </hstack>
      
      <spacer size="medium" />
      
      {loading ? (
        <text>Loading your arguments...</text>
      ) : argument.length === 0 ? (
        <text>You haven't created any arguments yet.</text>
      ) : (
        <vstack gap="small" width="100%">
          {/* Header row */}
          <hstack padding="small" backgroundColor="secondary" cornerRadius="small">
            <text weight="bold" grow>Title</text>
            <text weight="bold" width="30%">Sides</text>
            <text weight="bold" width="20%">Created</text>
          </hstack>
          
          {/* Data rows */}
          {argument.map((arg) => (
            <hstack key={arg.id} padding="small" backgroundColor="neutral" cornerRadius="small">
              <text grow>{arg.title}</text>
              <text width="30%">{arg.sideA} vs {arg.sideB}</text>
              <text width="20%">{new Date(arg.createdAt).toLocaleDateString()}</text>
            </hstack>
          ))}
        </vstack>
      )}
      
      <spacer size="medium" />
      
      <button onPress={() => onNavigate('welcome')}>Back to Home</button>
    </vstack>
  );
}