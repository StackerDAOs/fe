import * as React from 'react';
import {
  Circle,
  Icon,
  SquareProps,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { FaCheck } from 'react-icons/fa';

interface RadioCircleProps extends SquareProps {
  isCompleted: boolean;
  isActive: boolean;
}

export const StepCircle = (props: RadioCircleProps) => {
  const { isCompleted, isActive } = props;
  return (
    // <Circle size='6' bg={isCompleted ? 'base.500' : 'transparent'} {...props}>
    //   {isCompleted ? (
    //     <Icon as={FaCheck} color='light.900' boxSize='3' />
    //   ) : (
    //     <Circle size='6' bg={isActive ? 'light.700' : 'base.700'} />
    //   )}
    // </Circle>
    <Circle
      size='4'
      bg={isCompleted ? 'light.700' : 'inherit'}
      borderWidth={isCompleted ? '0' : '2px'}
      borderColor={isActive ? 'light.700' : 'base.700'}
      {...props}
    >
      <Circle bg={isActive ? 'accent' : 'border'} size='3' />
    </Circle>
  );
};
