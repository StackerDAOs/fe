import { has } from 'lodash';
import {
  trueCV,
  falseCV,
  contractPrincipalCV,
  listCV,
  standardPrincipalCV,
  tupleCV,
  someCV,
  noneCV,
} from 'micro-stacks/clarity';
import {
  FungibleConditionCode,
  makeContractSTXPostCondition,
  makeContractFungiblePostCondition,
  createAssetInfo,
} from 'micro-stacks/transactions';
import { stxToUstx, tokenToDecimals } from './helpers';

export const getDelegators = ({voteFor, proposalContractAddress, proposalContractName, currentVoterDelegators}: any) => {
  return currentVoterDelegators?.map((item: any) => {
    const delegatorVotes =
      proposalContractAddress &&
      proposalContractName &&
      tupleCV({
        for: voteFor ? trueCV() : falseCV(),
        proposal: contractPrincipalCV(
          proposalContractAddress,
          proposalContractName,
        ),
        delegator: someCV(standardPrincipalCV(item?.delegator?.value)),
      });
    return delegatorVotes;
  });
};

export const generateWithDelegators = ({voteFor, proposalContractAddress, proposalContractName, delegators}: any) => {
  if (proposalContractAddress && proposalContractName && delegators) {
    return [
      tupleCV({
        for: voteFor ? trueCV() : falseCV(),
        proposal: contractPrincipalCV(
          proposalContractAddress,
          proposalContractName,
        ),
        delegator: noneCV(),
      }),
      ...delegators,
    ] as any;
  }
};

export const generatePostConditions = ({postConditions, isPassing, assetName}: any) => {
  if (postConditions) {
    const { from, amount } = postConditions;
    const isFungible = has(postConditions, 'assetAddress');
    if (isFungible) {
      // Fungible Post Conditions
      const { assetAddress } = postConditions;
      const contractAddress = from?.split('.')[0];
      const contractName = from?.split('.')[1];
      const contractAssetAddress = assetAddress?.split('.')[0];
      const contractAssetName = assetAddress?.split('.')[1];
      const fungibleAssetInfo =
        contractAssetAddress &&
        contractAssetName &&
        createAssetInfo(contractAssetAddress, contractAssetName, assetName);
      const pc =
        contractAddress &&
        contractName &&
        fungibleAssetInfo &&
        isPassing
      ? [
          makeContractFungiblePostCondition(
            contractAddress,
            contractName,
            FungibleConditionCode.Equal,
            tokenToDecimals(Number(amount), 2),
            fungibleAssetInfo,
          ),
        ]
      : [];
      return pc;
    } else {
      // STX Post Condition
      const contractAddress = from?.split('.')[0];
      const contractName = from?.split('.')[1];
      const postConditionCode = FungibleConditionCode.Equal;
      const postConditionAmount = stxToUstx(amount);
      const postConditions =
        contractAddress &&
        contractName &&
        isPassing
          ? [
              makeContractSTXPostCondition(
                contractAddress,
                contractName,
                postConditionCode,
                postConditionAmount,
              ),
            ]
          : [];
          return postConditions;
    }
  }
};
