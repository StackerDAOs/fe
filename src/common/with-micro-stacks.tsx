import { wrapWithMicroStacks } from '@micro-stacks/nextjs';
import {
  StacksMainnet,
  StacksTestnet,
  StacksMocknet,
} from 'micro-stacks/network';
import { appDetails } from '@common/constants';

let network: any;
switch (process.env.NODE_ENV) {
  case 'development':
    network = new StacksMocknet();
    break;
  case 'production':
    network = new StacksMainnet();
    break;
  default:
    network = new StacksTestnet();
    break;
}

const authOptions = {
  appDetails,
};

const withMicroStacks = wrapWithMicroStacks({
  authOptions,
  network,
});

export default withMicroStacks;
