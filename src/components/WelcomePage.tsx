import { Devvit } from '@devvit/public-api';

interface WelcomePageProps {
  onNavigate: (page: string) => void;
}

export function WelcomePage({ onNavigate }: WelcomePageProps) {
  return (
    <zstack width="100%" height="100%">
      <image url="background1.jpg" imageHeight="256px" imageWidth="256px" width="100%" height="100%" />
      <vstack width="100%" height="100%" alignment="center middle" gap="small">
        <image url="logo.png" imageHeight="256px" imageWidth="256px" width="40%" height="40%" />
        <button onPress={() => onNavigate('new-argument')}>New Battle</button>
        <button onPress={() => onNavigate('my-arguments')}>My Battles</button>
        <button onPress={() => onNavigate('how-to-use')}>How to Use</button>
      </vstack>
    </zstack>
  );
}