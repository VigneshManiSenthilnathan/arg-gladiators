import { Devvit } from '@devvit/public-api';

interface WelcomePageProps {
  onNavigate: (page: string) => void;
}

export function WelcomePage({ onNavigate }: WelcomePageProps) {
  return (
    <vstack width="100%" height="100%" alignment="center middle" gap="medium">
      <text size="xlarge" weight="bold">Argument Battle</text>
      <spacer size="medium" />
      <button onPress={() => onNavigate('new-argument')}>New Argument</button>
      <button onPress={() => onNavigate('my-arguments')}>My Arguments</button>
      <button onPress={() => onNavigate('how-to-use')}>How to Use</button>
    </vstack>
  );
}