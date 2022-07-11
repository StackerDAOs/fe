import { supabase } from '@utils/supabase';
import { stacksNetwork } from '@common/constants';
import {
  fetchContractSource,
  fetchContractEventsById,
  fetchReadOnlyFunction,
  fetchAccountBalances,
  fetchFtMetadataForContractId,
  fetchTransaction,
} from 'micro-stacks/api';
import {
  contractPrincipalCV,
  cvToValue,
  deserializeCV,
  standardPrincipalCV,
  stringAsciiCV,
  uintCV
} from 'micro-stacks/clarity';
import { pluckSourceCode } from './helpers';

export async function getDAO(name: string){
  try {
    const { data, error } = await supabase
      .from('Organizations')
      .select(
        'id, name, slug, contractAddress, prefix, Extensions (contractAddress, ExtensionTypes (name))',
      )
      .eq('slug', name);
    if (error) throw error;
    return data[0];
  } catch (e: any) {
    console.error({ e });
  }
};

export async function generateContractName(organization: any) {
  try {
    const { data: Proposals, error } = await supabase
      .from('Proposals')
      .select('contractAddress, Organizations!inner(id, name, prefix)')
      .eq('Organizations.id', organization?.id);
    if (error) throw error;
    if (Proposals.length > 0) {
      const proposalSize = (Proposals?.length + 1).toString();
      const [proposal] = Proposals;
      const targetLength = Proposals?.length + 1 < 1000 ? 3 : 4;
      const contractName = `${
        proposal?.Organizations?.prefix
      }-${proposalSize.padStart(targetLength, '0')}`;
      return contractName;
      
    } else {
      const contractName = `${organization?.prefix}-001`;
      return contractName;
    }
  } catch (error) {
    
  }
}

export async function getExtension(name: string) {
  try {
    const normalizedName = name.toLowerCase();
    const { data, error } = await supabase
      .from('ExtensionTypes')
      .select(
        'id, name',
      )
      .eq('name', normalizedName)
      .limit(1);
      
    if (error) throw error;
    return data[0]?.name;
  } catch (e: any) {
    console.error({ e });
  }
};

export async function getContractProposalByAddress(contractAddress: string) {
  try {
    const { data, error } = await supabase
      .from('Proposals')
      .select(
        'id, contractAddress',
      )
      .eq('contractAddress', contractAddress)
      .limit(1);
    if (error) throw error;
    return data[0];
  } catch (e: any) {
    console.error({ e });
  }
};

export async function getContractProposalByTx(transactionId: string) {
  try {
    const { data, error } = await supabase
      .from('Proposals')
      .select(
        'id, contractAddress',
      )
      .eq('transactionId', transactionId)
      .limit(1);
    if (error) throw error;
    return data[0];
  } catch (e: any) {
    console.error({ e });
  }
};

export async function getTokenMetadata(contractId: string) {
  try {
    const network = new stacksNetwork();
    const tokenMetadata = await fetchFtMetadataForContractId({
      url: network.getCoreApiUrl(),
      contractId: contractId,
    })
    return tokenMetadata;
  } catch (e: any) {
    console.error({ e });
  }
};

export async function getVaultBalance(address: string) {
  try {
    
    const network = new stacksNetwork();
    const balance = await fetchAccountBalances({
      url: network.getCoreApiUrl(),
      principal: address,
    });
    return balance;
  } catch (e: any) {
    console.error({ e });
  }
};

export async function getBalanceOf(vaultAddress: string, assetAddress: string) {
  try {
    const network = new stacksNetwork();
    const balance: any = await fetchReadOnlyFunction({
      network,
      contractAddress: vaultAddress.split('.')[0],
      contractName: vaultAddress.split('.')[1],
      senderAddress: vaultAddress.split('.')[0],
      functionArgs: [standardPrincipalCV(assetAddress)],
      functionName: 'get-balance-of',
    });
    return balance;
  } catch (e: any) {
    console.error({ e });
  }
};

export async function getTokenBalance(address: string, contractAddress: string) {
  try {
    const network = new stacksNetwork();
    const balance: any = await fetchReadOnlyFunction({
      network,
      contractAddress: contractAddress.split('.')[0],
      contractName: contractAddress.split('.')[1],
      senderAddress: address,
      functionArgs: [standardPrincipalCV(address)],
      functionName: 'get-balance',
    });
    return balance;
  } catch (e: any) {
    console.error({ e });
  }
};

export async function getProposalCount(contractAddress: string) {
  try {
    const network = new stacksNetwork();
    const proposalsCount = await fetchReadOnlyFunction({
      network,
      contractAddress: contractAddress.split('.')[0],
      contractName: contractAddress.split('.')[1],
      senderAddress: contractAddress,
      functionArgs: [],
      functionName: 'get-proposals-count',
    });
    return proposalsCount;
  } catch (e: any) {
    console.error({ e });
  }
};

export async function getProposalAddress(contractAddress: string, id: string) {
  try {
    const network = new stacksNetwork();
    const proposal: any = await fetchReadOnlyFunction({
      network,
      contractAddress: contractAddress.split('.')[0],
      contractName: contractAddress.split('.')[1],
      senderAddress: contractAddress,
      functionArgs: [uintCV(id)],
      functionName: 'get-proposals',
    });
    return proposal;
  } catch (e: any) {
    console.error({ e });
  }
};

export async function getProposal(contractAddress: string, proposalAddress: string) {
  try {
    const network = new stacksNetwork();
    const proposal: any = await fetchReadOnlyFunction({
      network,
      contractAddress: contractAddress?.split('.')[0],
      contractName: contractAddress?.split('.')[1],
      senderAddress: contractAddress,
      functionArgs: [
        contractPrincipalCV(
          proposalAddress?.split('.')[0],
          proposalAddress?.split('.')[1],
        ),
      ],
      functionName: 'get-proposal-data',
    });

    const proposalContractAddress = proposalAddress?.split('.')[0];
    const proposalContractName = proposalAddress?.split('.')[1];

    // Fetch the source code for the proposal
    const contractSource = await fetchContractSource({
      url: network.getCoreApiUrl(),
      contract_address: proposalContractAddress,
      contract_name:  proposalContractName,
      proof: 0x0,
      tip: '',
    });
    const { source } = contractSource;
    const title = pluckSourceCode(source, 'title');
    const description = pluckSourceCode(source, 'description');
    const type = pluckSourceCode(source, 'type');

    // Fetch quorum threshold for proposals
    const quorumThreshold: any = await fetchReadOnlyFunction({
      network,
      contractAddress: contractAddress.split('.')[0],
      contractName: contractAddress?.split('.')[1],
      senderAddress: contractAddress.split('.')[0],
      functionArgs: [stringAsciiCV('quorumThreshold')],
      functionName: 'get-parameter',
    });

    // Fetch execution delay for executing proposals
    const executionDelay: any = await fetchReadOnlyFunction({
      network,
      contractAddress: contractAddress.split('.')[0],
      contractName: contractAddress?.split('.')[1],
      senderAddress: contractAddress.split('.')[0],
      functionArgs: [stringAsciiCV('executionDelay')],
      functionName: 'get-parameter',
    });
    return {
      contractAddress: proposalAddress,
      title,
      description,
      type,
      proposal,
      quorumThreshold,
      executionDelay
    };
  } catch (e: any) {
    console.log('here', e)
    console.error({ e });
  }
};

type TEvent = {
  extensionAddress: string,
  eventName?: string,
  filterByProposal?: string,
  offset: number,
}

export async function getEvents({
    extensionAddress,
    eventName,
    filterByProposal,
    offset
  }: TEvent = {
    extensionAddress: '',
    eventName: undefined,
    filterByProposal:
    undefined,
    offset: 50
  }) {
  try {
    const network = new stacksNetwork();
    const url = network.getCoreApiUrl();
      const data = await fetchContractEventsById({
        url,
        limit: 50,
        contract_id: extensionAddress,
        offset: offset,
        unanchored: false,
      });
      const { results } = data as any;
      const serializedEvents = results.map((event: any) => {
        const hex = event?.contract_log?.value.hex;
        const deserialized = deserializeCV(hex);
        const decoded = cvToValue(deserialized);
        return decoded;
      });
     
      const filteredEvents = eventName && filterByProposal
      ? serializedEvents?.filter(
          (item: any) =>
            item?.event?.value === eventName &&
            item?.proposal?.value === filterByProposal,
        )
      : eventName
      ? serializedEvents?.filter((item: any) => item?.event?.value === eventName)
      : filterByProposal
      ? serializedEvents?.filter((item: any) =>  item?.proposal?.value === filterByProposal)
      : serializedEvents;

      return filteredEvents;
  } catch (e: any) {
    console.error({ e });
  }
}

export async function getParameter(contractAddress: string, parameterName: string) {
  try {
    const network = new stacksNetwork();
    const parameter = await fetchReadOnlyFunction({
      network,
      contractAddress: contractAddress.split('.')[0],
      contractName: contractAddress.split('.')[1],
      senderAddress: contractAddress,
      functionArgs: [stringAsciiCV(parameterName)],
      functionName: 'get-parameter',
    });
    return parameter;
  } catch (e: any) {
    console.error({ e });
  }
}

export async function getContractsToDeploy(organizationId: number, currentStxAddress: string) {
  try {
    const { data, error } = await supabase
      .from('Proposals')
      .select(
        'id, contractAddress, type, transactionId, submitted, disabled, submittedBy, Organizations!inner(id, name, prefix)',
      )
      .eq('Organizations.id', organizationId)
      .eq('submittedBy', currentStxAddress)
      .eq('submitted', false)
      .eq('disabled', false);
    if (error) throw error;
    return data;
  } catch (e: any) {
    console.error({ e });
  }
}

export async function getTransaction(transactionId: string) {
  try {
    const network = new stacksNetwork();
    const transaction = await fetchTransaction({
      url: network.getCoreApiUrl(),
      txid: transactionId,
      event_offset: 0,
      event_limit: 1,
    });
    return transaction;
  } catch (e: any) {
    console.error({ e });
  }
}

export async function getDelegates(organizationId: number, currentStxAddress: string | null) {
  try {
    const { data, error } = await supabase
      .from('Delegates')
      .select(
        'id, delegatorAddress, delegateAddress, Organizations!inner(id, name, prefix)',
      )
      .eq('Organizations.id', organizationId)
      .eq('delegateAddress', currentStxAddress)
      .limit(100);
    if (error) throw error;
    return data;
  } catch (e: any) {
    console.error({ e });
  }
}

export async function getPostConditions(proposalPrincipal: string) {
  try {
    const { data, error } = await supabase
      .from('Proposals')
      .select('postConditions')
      .eq(
        'contractAddress',
        proposalPrincipal,
      );
    if (error) throw error;
    if (data) {
      const [postConditions] = data;
      // If postCondition?.asset return postConditions
      // If postConditions?.assetName then... 
      // // TODO: Need to fetchReadOnly function to `get-name` of token contract
      return postConditions;
    }
  } catch (e: any) {
    console.error({ e });
  }
}