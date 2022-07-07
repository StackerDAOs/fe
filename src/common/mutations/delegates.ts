import { supabase } from '@utils/supabase';
import { useMutation, useQueryClient } from 'react-query';
import { useDAO } from '@common/queries';

export async function createDelegate({ organizationId, delegatorAddress, delegateAddress }: any) {
  try {
    const { data, error } = await supabase
      .from('Delegates')
      .insert([{organizationId, delegatorAddress, delegateAddress}])
    if (error) throw error;
    console.log(data);
    return data;
  } catch (e: any) {
    console.error({ e });
  }
}

export const useAddDelegate = (delegateAddress: string) => {
  const { dao } = useDAO()
  const queryClient = useQueryClient();
  return useMutation(createDelegate, {
    onSuccess: () => {
      queryClient.invalidateQueries(['delegates', dao?.name, delegateAddress]);
    }
  });
}

export async function deleteDelegate({ organizationId, delegatorAddress }: any) {
  try {
    const { data, error } = await supabase
      .from('Delegates')
      .delete()
      .match({organizationId, delegatorAddress})
    if (error) throw error;
    console.log(data);
    return data;
  } catch (e: any) {
    console.error({ e });
  }
}

export const useDeleteDelegate = (delegateAddress: string) => {
  const { dao } = useDAO()
  const queryClient = useQueryClient();
  return useMutation(deleteDelegate, {
    onSuccess: () => {
      queryClient.invalidateQueries(['delegates', dao?.name, delegateAddress]);
    }
  });
}