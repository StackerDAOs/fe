import type { AlertProps } from '@chakra-ui/react';

export interface AlertBannerProps extends AlertProps {
  title: string;
  description: string;
  proposalPrincipal: string;
}
