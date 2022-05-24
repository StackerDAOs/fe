import * as React from 'react';
import {
  Box,
  BoxProps,
  Button,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Stack,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { StepCircle } from '@components/StepCircle';

// Store
import { useStore } from 'store/DeployStepStore';

// Components
import { ActionModal } from '@components/Modal';

interface StepProps extends BoxProps {
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
  isLastStep: boolean;
  payload: any;
}

export const VerticalStep = (props: StepProps) => {
  const {
    isActive,
    isCompleted,
    isLastStep,
    title,
    description,
    payload,
    ...stackProps
  } = props;
  const { currentStep, setStep } = useStore();

  const handleClick = () => {
    // TODO: open modal for review and deploy
    setStep(currentStep + 1);
  };

  return (
    <Stack spacing='4' direction='row' {...stackProps}>
      <Stack spacing='0' align='center'>
        <StepCircle isActive={isActive} isCompleted={isCompleted} />
        {!isLastStep && (
          <Divider
            orientation='vertical'
            borderWidth='1px'
            borderColor={isCompleted ? 'light.900' : 'gray.900'}
          />
        )}
      </Stack>
      <Stack spacing='0.5' pb='2'>
        {isActive && payload ? (
          <ActionModal payload={payload}>
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Amount</FormLabel>
                <Input
                  placeholder='Amount'
                  name='amount'
                  onChange={(e) => console.log(e)}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Recipient</FormLabel>
                <Input
                  placeholder='Recipient'
                  name='recipientAddress'
                  onChange={(e) => console.log(e)}
                />
              </FormControl>
            </ModalBody>
          </ActionModal>
        ) : (
          <>
            <Text
              color={mode('base.900', 'light.900')}
              fontWeight='regular'
              fontSize='md'
            >
              {title}
            </Text>
            <Text color='gray.900' fontSize='sm'>
              {description}
            </Text>
          </>
        )}
      </Stack>
    </Stack>
  );
};
