import React from 'react';
import { Icon, IconButton } from '@chakra-ui/react';
import { IconProps } from './types';

interface CustomIconProps extends IconProps {
  icon: any;
}

export const CustomIconButton = (props: CustomIconProps) => {
  return (
    <IconButton
      aria-label='icon'
      bg='base.800'
      variant='outline'
      color='light.900'
      borderColor='base.500'
      size='md'
      icon={<Icon as={props.icon} color='whiteAlpha' fontSize='sm' />}
      _hover={{
        bg: 'base.800',
      }}
    />
  );
};
