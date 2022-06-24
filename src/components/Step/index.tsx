import {
  BoxProps,
  Divider,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

// Components
import { StepCircle } from '@components/StepCircle';

interface StepProps extends BoxProps {
  title: string;
  description?: any;
  isCompleted: boolean;
  isActive: boolean;
  isLastStep: boolean;
  isFirstStep: boolean;
}

export const Step = (props: StepProps) => {
  const {
    isActive,
    isCompleted,
    isLastStep,
    isFirstStep,
    title,
    description,
    ...stackProps
  } = props;
  const isMobile = useBreakpointValue({ base: true, md: false });

  const orientation = useBreakpointValue<'horizontal' | 'vertical'>({
    base: 'vertical',
    md: 'horizontal',
  });

  return (
    <Stack
      spacing='0'
      direction={{ base: 'row', md: 'column' }}
      flex='1'
      {...stackProps}
    >
      <Stack
        spacing='0'
        align='center'
        direction={{ base: 'column', md: 'row' }}
      >
        <Divider
          display={isMobile ? 'none' : 'initial'}
          orientation={orientation}
          borderWidth='1px'
          borderColor={
            isFirstStep
              ? 'transparent'
              : isCompleted || isActive
              ? 'accent'
              : 'inherit'
          }
        />
        <StepCircle isActive={isActive} isCompleted={isCompleted} />
        <Divider
          orientation={orientation}
          borderWidth='1px'
          borderColor={
            isCompleted ? 'base.500' : isLastStep ? 'transparent' : 'base.500'
          }
        />
      </Stack>
      <Stack spacing='2' pb={isLastStep ? '0' : isCompleted ? '3' : '8'}>
        <Text color='light.900' fontSize='md' fontWeight='regular'>
          {title}
        </Text>
        {description}
      </Stack>
    </Stack>
  );
};
