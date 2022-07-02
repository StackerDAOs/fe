// Hook (use-dao.tsx)
import { useCallback, useEffect, useState } from 'react';
import { useUser, useNetwork } from '@micro-stacks/react';
import { fetchReadOnlyFunction } from 'micro-stacks/api';
import { standardPrincipalCV, stringAsciiCV } from 'micro-stacks/clarity';
import { tokenToNumber } from '@common/helpers';

// Hooks
import {
  useGovernanceTokenExtension,
  useSubmissionExtension,
  useVotingExtension,
} from '@common/hooks';

interface IDAO {
  organization?: any;
}

export function useDAO({ organization }: IDAO = {}) {
  const [state, setState] = useState<any>({
    proposeThreshold: 0,
    canPropose: false,
    voteThreshold: 0,
    canVote: false,
  });
  const { network } = useNetwork();
  const { currentStxAddress: senderAddress } = useUser();
  const {
    contractAddress: governanceTokenContractAddress,
    contractName: governanceTokenContractName,
  } = useGovernanceTokenExtension({ organization });
  const {
    contractAddress: submissionContractAddress,
    contractName: submissionContractName,
  } = useSubmissionExtension({ organization });
  const {
    contractAddress: votingContractAddress,
    contractName: votingContractName,
  } = useVotingExtension({ organization });

  async function fetchBalance() {
    if (governanceTokenContractName && governanceTokenContractName) {
      try {
        const balance: any = await fetchReadOnlyFunction({
          network,
          contractAddress: governanceTokenContractAddress,
          contractName: governanceTokenContractName,
          senderAddress,
          functionArgs: [standardPrincipalCV(senderAddress || '')],
          functionName: 'get-balance',
        });
        const decimals: any = await fetchReadOnlyFunction({
          network,
          contractAddress: governanceTokenContractAddress,
          contractName: governanceTokenContractName,
          senderAddress,
          functionArgs: [],
          functionName: 'get-decimals',
        });
        const symbol: any = await fetchReadOnlyFunction({
          network,
          contractAddress: governanceTokenContractAddress,
          contractName: governanceTokenContractName,
          senderAddress,
          functionArgs: [],
          functionName: 'get-symbol',
        });
        return { balance, decimals, symbol };
      } catch (e: any) {
        console.error({ e });
      }
    }
  }

  async function fetchCanPropose() {
    if (submissionContractAddress && submissionContractName) {
      try {
        const canPropose: any = await fetchReadOnlyFunction({
          network,
          contractAddress: submissionContractAddress,
          contractName: submissionContractName,
          senderAddress,
          functionArgs: [stringAsciiCV('proposeThreshold')],
          functionName: 'get-parameter',
        });
        return canPropose;
      } catch (e: any) {
        console.error(e);
      }
    }
  }

  async function fetchCanVote() {
    if (votingContractAddress && votingContractName) {
      try {
        const canVote: any = await fetchReadOnlyFunction({
          network,
          contractAddress: votingContractAddress,
          contractName: votingContractName,
          senderAddress,
          functionArgs: [stringAsciiCV('voteThreshold')],
          functionName: 'get-parameter',
        });
        return canVote;
      } catch (e: any) {
        console.error(e);
      }
    }
  }

  const fetchDAO = useCallback(async () => {
    if (organization) {
      try {
        const data: any = await fetchBalance();
        const proposeThreshold = await fetchCanPropose();
        const voteThreshold = await fetchCanVote();

        const canPropose =
          tokenToNumber(Number(data?.balance), Number(data?.decimals)) >=
          Number(proposeThreshold);
        const canVote =
          tokenToNumber(Number(data?.balance), Number(data?.decimals)) >=
          Number(voteThreshold);
        setState({
          ...state,
          balance: tokenToNumber(Number(data?.balance), Number(data?.decimals)),
          symbol: data?.symbol,
          proposeThreshold: Number(proposeThreshold),
          voteThreshold: Number(voteThreshold),
          canPropose,
          canVote,
        });
      } catch (e: any) {
        console.log(e);
      } finally {
        console.log('finally');
      }
    }
  }, [
    organization,
    governanceTokenContractAddress,
    submissionContractAddress,
    votingContractAddress,
  ]);

  useEffect(() => {
    fetchDAO();
  }, [
    organization,
    governanceTokenContractAddress,
    submissionContractAddress,
    votingContractAddress,
  ]);

  return {
    balance: state.balance,
    symbol: state.symbol,
    proposeThreshold: state.proposeThreshold,
    canPropose: state.canPropose,
    voteThreshold: state.voteThreshold,
    canVote: state.canVote,
  };
}
