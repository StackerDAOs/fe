import { AbsoluteCenter, AbsoluteCenterProps, Box } from '@chakra-ui/react';

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
      bg='base.900'
      width='full'
      {...rest}
    >
      <Box bg='base.900' height='inherit' width={`${value}%`} />
    </AbsoluteCenter>
  );
};
