import { IconButton } from '@chakra-ui/react';
import { FiCopy } from 'react-icons/fi';

export const CopyClipboard = (props: any) => (
  <IconButton
    aria-label='Copy Vault Address'
    icon={<FiCopy />}
    color='light.900'
    bg='transparent'
    onClick={() => {
      navigator.clipboard.writeText(props.contractAddress);
    }}
  />
);
