// Hook (use-organization.tsx)
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { supabase } from '@utils/supabase';

import { useOrganization } from '../hooks/use-organization';

export function useSubmission() {
  const [state, setState] = useState<any>({});
  const router = useRouter();
  const { dao } = router.query as any;

  const { organization }: any = useOrganization({ name: dao });

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const { data: Proposals, error } = await supabase
          .from('Proposals')
          .select(
            'contractAddress, type, transactionId, submittedBy, Organizations (id, name)',
          )
          .eq('submitted', false);

        if (error) throw error;
        if (Proposals.length > 0) {
          const proposals = Proposals.filter(
            (proposal) => proposal.Organizations.id === organization?.id,
          );
          setState({ ...state, isLoading: false, proposals });
        } else {
          setState({ ...state, isLoading: false, proposals: [] });
        }
      } catch (e: any) {
        console.error({ e });
      }
    };
    fetchSubmission();
  }, [organization]);

  return { isLoading: state.isLoading, proposals: state.proposals };
}
