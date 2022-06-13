// Hook (use-organization.tsx)
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { supabase } from '@utils/supabase';

import { useOrganization } from '../hooks/use-organization';

export function useSubmissions() {
  const [state, setState] = useState<any>({});
  const router = useRouter();
  const { dao: slug } = router.query;

  const { organization }: any = useOrganization();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data: Proposals, error } = await supabase
          .from('Proposals')
          .select(
            'contractAddress, type, submittedBy, Organizations (id, name)',
          )
          .eq('submitted', false);

        if (error) throw error;
        if (Proposals.length > 0) {
          const proposals = Proposals.filter(
            (proposal) => proposal.Organizations.id === organization?.id,
          );
          setState({ ...state, proposals });
        } else {
          setState({ ...state, proposals: [] });
        }
      } catch (error) {
        console.log({ error });
      } finally {
        console.log('done');
      }
    };
    fetchSubmissions();
  }, [organization, slug]);

  return { proposals: state.proposals };
}