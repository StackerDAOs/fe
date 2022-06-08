// Hook (use-organization.tsx)
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { supabase } from '@utils/supabase';

import { useStore as DashboardStore } from 'store/DashboardStore';

export function useOrganization() {
  // TODO: check if slug is present and return error if not
  const router = useRouter();
  const { dao: slug } = router.query;

  const { organization, setOrganization } = DashboardStore();

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const { data: Organizations, error } = await supabase
          .from('Organizations')
          .select(
            'id, name, slug, contract_address, Extensions (contract_address, ExtensionTypes (name))',
          )
          .eq('slug', slug);
        if (error) throw error;
        if (Organizations.length > 0) {
          const organization = Organizations[0];
          setOrganization(organization);
        }
      } catch (error) {
        console.log({ error });
      } finally {
        console.log('done');
      }
    };
    fetchOrganization();
  }, [slug]);

  return { organization };
}
