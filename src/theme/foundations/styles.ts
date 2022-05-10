import { lighten, mode, StyleFunctionProps } from '@chakra-ui/theme/node_modules/@chakra-ui/theme-tools';

export default {
  global: (props: StyleFunctionProps) => ({
    body: {
      color: 'default',
      bg: mode('light.600', 'base.900')(props),
    },
    '*::placeholder': {
      opacity: 1,
      color: 'subtle',
    },
    '*, *::before, &::after': {
      borderColor: mode('gray.200', lighten('gray.700', 3)(props.theme))(props),
    },
  }),
};
