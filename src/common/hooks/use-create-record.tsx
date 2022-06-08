// Hook (use-balance.tsx)
import { useEffect, useState } from 'react';
import { supabase } from '@utils/supabase';

interface ICreateRecord {
  tableName: string;
  attributes: any;
}

export function useCreateRecord({ tableName, attributes }: ICreateRecord) {
  const [state, setState] = useState<any>({});

  useEffect(() => {
    const createRecord = async () => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .insert([{ ...attributes }]);
        if (error) throw error;
        setState({ ...state, attributes: data });
      } catch (error) {
        console.log({ error });
      } finally {
        console.log('done');
        setState({ ...state, isLoading: false });
      }
    };
    createRecord();
  }, []);

  return { isLoading: state.isLoading, attributes: state.data };
}
