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
    <Circle
      size='6'
      bg={
        isCompleted
          ? mode('secondary.900', 'primaryGradient.900')
          : isActive
          ? mode(
              'linear(to-l, secondary.900, secondaryGradient.900)',
              'linear(to-l, primary.900, primaryGradient.900)',
            )
          : 'transparent'
      }
      {...props}
    >
      {isCompleted ? (
        <Icon as={FaCheck} color='light.900' boxSize='3' />
      ) : (
        <Circle
          size='5'
          bg={
            isActive
              ? mode('secondary.900', 'primaryGradient.900')
              : mode('secondaryOpacity.20', 'primaryOpacity.20')
          }
        />
      )}
    </Circle>
  );
};
