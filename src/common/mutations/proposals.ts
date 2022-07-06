import { supabase } from '@utils/supabase';
import { useMutation, useQueryClient } from 'react-query';

type Proposal = {
  organizationId: string,
  contractAddress: string,
  submittedBy: string,
  type: string,
  transactionId: string,
  name: string,
}

export async function createProposalContract(proposal: Proposal) {
  try {
    const { data, error } = await supabase
      .from('Proposals')
      .insert([{...proposal}])
    if (error) throw error;
    console.log(data);
    return data;
  } catch (e: any) {
    console.error({ e });
  }
}

export async function updateSubmittedProposal(proposal: { contractAddress: string, submitted: boolean }) {
  try {
    const { data, error } = await supabase
      .from('Proposals')
      .update({ submitted: proposal.submitted })
      .match({
        contractAddress: proposal.contractAddress,
      });
    if (error) throw error;
    console.log({ data });
    return data;
  } catch (e: any) {
    console.error({ e });
  }
}

export const useSubmitProposal = () => {
  const queryClient = useQueryClient();
  return useMutation(updateSubmittedProposal, {
    onSuccess: () => {
      queryClient.invalidateQueries('contracts');
    }
  });
}

export async function updateDisabledProposal(proposal: { contractAddress: string, disabled: boolean }) {
  try {
    const { data, error } = await supabase
      .from('Proposals')
      .update({ disabled: proposal.disabled })
      .match({
        contractAddress: proposal.contractAddress,
      });
    if (error) throw error;
    console.log({ data });
    return data;
  } catch (e: any) {
    console.error({ e });
  }
}

export const useDisableProposal = () => {
  const queryClient = useQueryClient();
  return useMutation(updateDisabledProposal, {
    onSuccess: () => {
      queryClient.invalidateQueries('contracts');
    }
  });
}