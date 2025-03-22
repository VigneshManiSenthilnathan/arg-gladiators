import { Devvit } from '@devvit/public-api';

interface HowToUsePageProps {
  onNavigate: (page: string) => void;
}

export function HowToUsePage({ onNavigate }: HowToUsePageProps) {
  return (
    <vstack width="100%" height="100%" padding="medium" gap="medium">
      <hstack alignment="center middle">
        <text size="xlarge" weight="bold">How to Use Argument Battle</text>
      </hstack>
      
      <spacer size="small" />
      
      <vstack gap="medium" backgroundColor="neutral" padding="medium" cornerRadius="medium">
        <text size="large" weight="bold">For Moderators:</text>
        <text>1. Create an Argument Battle by clicking "New Argument"</text>
        <text>2. Fill in the argument title and the two sides</text>
        <text>3. Submit to create a new battle post</text>
        <text>4. Pin the post to make it visible to your community</text>
        
        <spacer size="small" />
        
        <text size="large" weight="bold">For Players:</text>
        <text>1. Click "JOIN" on an Argument Battle post</text>
        <text>2. Choose your side in the debate</text>
        <text>3. Select a hero character to represent you</text>
        <text>4. Choose your weapon for the battle</text>
        <text>5. Enter your war cry to intimidate opponents</text>
        <text>6. Wait for the battle results to be calculated</text>
        
        <spacer size="small" />
        
        <text size="large" weight="bold">Rules:</text>
        <text>• Each user can only join a battle once</text>
        <text>• Your hero and weapon choices affect your battle stats</text>
        <text>• The side with the most participants has a higher chance of winning</text>
        <text>• Battle results are determined at the scheduled end time</text>
      </vstack>
      
      <spacer size="medium" />
      
      <button onPress={() => onNavigate('welcome')}>Back to Home</button>
    </vstack>
  );
}