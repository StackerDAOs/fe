import * as React from 'react';
import {
  useColorMode,
  useColorModeValue as mode,
  IconButton,
  IconButtonProps,
} from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

type ColorModeSwitcherProps = Omit<IconButtonProps, 'aria-label'>;

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = (props) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const text = mode('dark', 'light');
  const SwitchIcon = mode(FaMoon, FaSun);

  return (
    <IconButton
      size='sm'
      bg={mode('light.600', 'base.900')}
      variant='outline'
      marginLeft='2'
      onClick={toggleColorMode}
      icon={<SwitchIcon color={colorMode === 'dark' ? 'white' : 'dark'} />}
      aria-label={`Switch to ${text} mode`}
      {...props}
    />
  );
};
