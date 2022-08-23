import React from 'react';
import { supabase } from '@lib/supabase';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from '@chakra-ui/react';
import { AlertBannerProps } from './types';

export const AlertBanner = (props: AlertBannerProps) => {
  const [isVerified, setVerified] = React.useState<boolean>(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error }: any = await supabase
          .from('Proposals')
          .select('isVerified')
          .eq('contractAddress', props.proposalPrincipal);
        if (error) throw error;
        if (data[0].isVerified) {
          setVerified(true);
        } else {
          setVerified(false);
        }
      } catch (e: any) {
        console.error({ e });
      }
    };
    fetchData();
  }, []);

  if (isVerified) return null;

  return (
    <Alert {...props}>
      <AlertIcon />
      <Box>
        <AlertTitle>{props.title}</AlertTitle>
        <AlertDescription>{props.description}</AlertDescription>
      </Box>
    </Alert>
  );
};
