import { wrapWithMicroStacks } from '@micro-stacks/nextjs';
import { StacksTestnet } from 'micro-stacks/network';
import { appDetails } from '@common/constants';

const network: any = new StacksTestnet();

const authOptions = {
  appDetails,
};

const withMicroStacks = wrapWithMicroStacks({
  authOptions,
  network,
});

export default withMicroStacks;
