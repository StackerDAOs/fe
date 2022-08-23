import React from 'react';
import { Image, ImageProps } from '@chakra-ui/react';

export const LogoWithName = (props: ImageProps) => {
  return <Image src='/img/logo-with-name.png' alt='logo' {...props} />;
};
