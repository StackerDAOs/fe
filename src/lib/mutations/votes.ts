import { supabase } from '@lib/supabase';
import { useMutation } from 'react-query';
import { useDAO } from '@lib/hooks';

export async function voteFor({ proposalPrincipal, amount }: any) {
  try {
    const { data, error } = await supabase
      .from('Proposals')
      .select('votesFor')
      .eq('contractAddress', proposalPrincipal)
      .limit(1);
    if (error) throw error;
    const votesFor = data[0].votesFor;
    const votesForAmount = votesFor + amount;
    try {
      const { data, error } = await supabase
        .from('Proposals')
        .update({ votesFor: votesForAmount })
        .match({
          contractAddress: proposalPrincipal,
        });
      if (error) throw error;
      return data;
    } catch (e: any) {
      console.error({ e });
    }
  } catch (e: any) {
    console.error({ e });
  }
}

export const useVoteFor = () => {
  const { data: dao } = useDAO();
  return useMutation(voteFor, {
    onSuccess: () => {
      console.log('Successfully voted for', dao);
    },
  });
};

export async function voteAgainst({ proposalPrincipal, amount }: any) {
  try {
    const { data, error } = await supabase
      .from('Proposals')
      .select('votesAgainst')
      .eq('contractAddress', proposalPrincipal)
      .limit(1);
    if (error) throw error;
    const votesAgainst = data[0].votesAgainst;
    const votesAgainstAmount = votesAgainst + amount;
    try {
      const { data, error } = await supabase
        .from('Proposals')
        .update({ votesAgainst: votesAgainstAmount })
        .match({
          contractAddress: proposalPrincipal,
        });
      if (error) throw error;
      return data;
    } catch (e: any) {
      console.error({ e });
    }
  } catch (e: any) {
    console.error({ e });
  }
}

export const useVoteAgainst = () => {
  const { data: dao } = useDAO();
  return useMutation(voteAgainst, {
    onSuccess: () => {
      console.log('Successfully voted against', dao);
    },
  });
};
