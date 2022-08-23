import React from 'react';
import { Icon, IconProps, useClipboard } from '@chakra-ui/react';
import { FiCheck, FiCopy } from 'react-icons/fi';

interface ClipboardProps extends IconProps {
  content: string;
}

export const Clipboard = (props: ClipboardProps) => {
  const { hasCopied, onCopy } = useClipboard(props?.content);
  if (hasCopied) {
    return <Icon aria-hidden as={FiCheck} {...props} />;
  }
  return <Icon onClick={onCopy} aria-hidden as={FiCopy} {...props} />;
};
