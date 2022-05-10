import {
  AbsoluteCenter,
  AbsoluteCenterProps,
  Box,
  useColorModeValue as mode,
} from '@chakra-ui/react';

interface ProgressbarProps extends AbsoluteCenterProps {
  value: number;
}

export const Progressbar = (props: ProgressbarProps) => {
  const { value, ...rest } = props;
  return (
    <AbsoluteCenter
      role='progressbar'
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-valuetext={`Progress: ${value}%`}
      position='absolute'
      height='2'
      axis='vertical'
      bg={mode('light.700', 'base.700')}
      width='full'
      {...rest}
    >
      <Box
        bg={mode('primary.500', 'primary.500')}
        height='inherit'
        width={`${value}%`}
      />
    </AbsoluteCenter>
  );
};
