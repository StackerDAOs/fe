import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

export const ErrorAlertBanner = (props: any) => {
  const { title, description } = props;
  return (
    <Alert
      status='error'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      textAlign='center'
    >
      <AlertIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};
