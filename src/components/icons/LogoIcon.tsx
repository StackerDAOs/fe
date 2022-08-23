import React from 'react';
import { Image, ImageProps } from '@chakra-ui/react';

export const LogoIcon = (props: ImageProps) => {
  return <Image src='/img/logo-only.png' alt='logo' {...props} />;
};
