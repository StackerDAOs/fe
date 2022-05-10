import { mode, StyleFunctionProps } from '@chakra-ui/theme/node_modules/@chakra-ui/theme-tools';

const baseStyle = (props: StyleFunctionProps) => ({
  borderColor: 'base.800',
  borderWidth: '1px',
  borderRadius: 'lg',
  p: '2',
  bg: 'transparent',
  transitionProperty: 'common',
  transitionDuration: 'normal',
  _checked: {
    bg: 'base.800',
    borderColor: mode('base.800', 'base.800')(props),
    
  },
});

export default {
  baseStyle,
};
