import {
  Divider,
  HStack,
  StackProps,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { StepCircle } from '@components/StepCircle';

interface StepProps extends StackProps {
  isCompleted: boolean;
  isActive: boolean;
  isLastStep: boolean;
}

export const Step = (props: StepProps) => {
  const { isActive, isCompleted, isLastStep, ...stackProps } = props;

  return (
    <HStack flex={isLastStep ? '0' : '1'} spacing='0' {...stackProps}>
      <StepCircle isActive={isActive} isCompleted={isCompleted} />
      {!isLastStep && (
        <Divider
          orientation='horizontal'
          borderWidth='1px'
          borderColor={
            isCompleted
              ? mode('secondary.900', 'primaryGradient.900')
              : mode('secondaryOpacity.20', 'primaryOpacity.20')
          }
        />
      )}
    </HStack>
  );
};
