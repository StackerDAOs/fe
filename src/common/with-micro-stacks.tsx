import { wrapWithMicroStacks } from '@micro-stacks/nextjs';
import {
  StacksMainnet,
  StacksTestnet,
  StacksMocknet,
} from 'micro-stacks/network';

let network: any;
switch (process.env.NODE_ENV) {
  case 'development':
    network = new StacksMocknet();
    // network = new StacksTestnet();
    break;
  case 'production':
    network = new StacksMainnet();
    break;
  default:
    network = new StacksTestnet();
    break;
}

const authOptions = {
  appDetails: {
    name: 'StackerDAOs',
    icon: 'https://pbs.twimg.com/profile_images/1485629030804213763/PQyQmwTT_400x400.jpg',
  },
};

const withMicroStacks = wrapWithMicroStacks({
  authOptions,
  network,
});

export default withMicroStacks;
