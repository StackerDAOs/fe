// Hook (use-organization.tsx)
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@utils/supabase';

type TOrganization = {
  isLoading: boolean;
  organization?: any;
};

interface IOrganization {
  name?: string | undefined;
}

const initialState = {
  isLoading: true,
  organization: null,
};

export function useOrganization({ name }: IOrganization = {}) {
  const [state, setState] = useState<TOrganization>(initialState);
  const router = useRouter();
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const { data: Organizations, error } = await supabase
          .from('Organizations')
          .select(
            'id, name, slug, contractAddress, prefix, Extensions (contractAddress, ExtensionTypes (name))',
          )
          .eq('slug', name);
        if (error) throw error;
        if (Organizations.length > 0) {
          const organization = Organizations[0];
          setState({ ...state, isLoading: false, organization });
        }
      } catch (e: any) {
        console.error({ e });
      }
    };
    fetchOrganization();
  }, [name, router.isReady]);

  return { isLoading: state.isLoading, organization: state.organization };
}
