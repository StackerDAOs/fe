import { wrapWithMicroStacks } from '@micro-stacks/nextjs';
import { StacksMocknet } from 'micro-stacks/network';

const withMicroStacks = wrapWithMicroStacks({
  authOptions: {
    appDetails: {
      name: 'StackerDAOs',
      icon: 'https://pbs.twimg.com/profile_images/1485629030804213763/PQyQmwTT_400x400.jpg',
    },
  },
  network: new StacksMocknet(),
});

export default withMicroStacks;
