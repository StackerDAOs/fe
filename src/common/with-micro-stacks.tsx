import { wrapWithMicroStacks } from '@micro-stacks/nextjs';
import { StacksTestnet } from 'micro-stacks/network';

// let network: any;
// switch (process.env.NODE_ENV) {
//   case 'development':
//     network = new StacksMocknet();
//     break;
//   case 'production':
//     network = new StacksMainnet();
//     break;
//   default:
//     network = new StacksTestnet();
//     break;
// }

const network = new StacksTestnet();

const authOptions = {
  appDetails: {
    name: 'StackerDAO Labs',
    icon: 'https://stackerdaos-assets.s3.us-east-2.amazonaws.com/app/stackerdaos-hiro-logo.png',
  },
};

const withMicroStacks = wrapWithMicroStacks({
  authOptions,
  network,
});

export default withMicroStacks;
