import { useState, useEffect } from 'react';
import { supabase } from '@utils/supabase';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from '@chakra-ui/react';

export const ErrorAlertBanner = (props: any) => {
  const [state, setState] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error }: any = await supabase
          .from('Proposals')
          .select('isVerified')
          .eq('contractAddress', props.id);
        if (error) throw error;
        if (data[0].isVerified) {
          setState(true);
        } else {
          setState(false);
        }
      } catch (e: any) {
        console.error({ e });
      }
    };
    fetchData();
  }, []);

  const displayError = (
    <Alert status='error' bg='secondary.900'>
      <AlertIcon color='light.900' />
      <Box>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription fontSize='sm'>
          This proposal was submitted outside of the UI and its code has not
          been verified by StackerDAOs. Executing this proposal may have
          unintended consequences.
        </AlertDescription>
      </Box>
    </Alert>
  );

  if (state) {
    return null;
  } else {
    return displayError;
  }
};
