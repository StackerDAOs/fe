// Hook (use-organization.tsx)
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { supabase } from '@utils/supabase';

import { useOrganization } from '../hooks/use-organization';

export function useSubmissions() {
  const [state, setState] = useState<any>({});
  const router = useRouter();
  const { dao } = router.query as any;

  const { organization }: any = useOrganization({ name: dao });

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data: Proposals, error } = await supabase
          .from('Proposals')
          .select(
            'contractAddress, type, transactionId, submittedBy, Organizations (id, name)',
          )
          .eq('submitted', false);

        if (error) throw error;
        if (Proposals.length > 0) {
          const proposals = Proposals?.filter(
            (proposal) => proposal.Organizations.id === organization?.id,
          );
          setState({ ...state, isLoading: false, proposals });
        } else {
          setState({ ...state, isLoading: false, proposals: [] });
        }
      } catch (error) {
        console.log({ error });
      } finally {
        console.log('done');
      }
    };
    fetchSubmissions();
  }, [organization]);

  return { isLoading: state.isLoading, proposals: state.proposals };
}
