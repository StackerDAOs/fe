import { Circle, SquareProps } from '@chakra-ui/react';

interface RadioCircleProps extends SquareProps {
  isCompleted: boolean;
  isActive: boolean;
}

export const StepCircle = (props: RadioCircleProps) => {
  const { isCompleted, isActive } = props;
  return (
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
