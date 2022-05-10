import { Button, ButtonProps, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useAuth } from '@micro-stacks/react';

export const WalletConnectButton = (props: ButtonProps) => {
  const { isSignedIn, handleSignIn, handleSignOut, isLoading } = useAuth();
  const router = useRouter();
  const handleClick = () => {
    if (isSignedIn) {
      handleSignOut();
      localStorage.setItem('chakra-ui-color-mode', 'dark');
      router.push('/');
    } else {
      handleSignIn();
    }
  };
  return (
    <Button {...props} onClick={handleClick}>
      {isLoading ? (
        'Loading...'
      ) : isSignedIn ? (
        <Text isTruncated>Disconnect</Text>
      ) : (
        'Connect'
      )}
    </Button>
  );
};
