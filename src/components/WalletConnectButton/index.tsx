import { useEffect, useState } from 'react';
import { Button, ButtonProps, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useAuth } from '@micro-stacks/react';

// Components
import { ConnectWalletModal } from '@components/Modal/ConnectWalletModal';

export const WalletConnectButton = (props: ButtonProps) => {
  const [installed, setInstalled] = useState(false);
  const { isSignedIn, handleSignIn, handleSignOut, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      if (window?.StacksProvider) {
        setInstalled(true);
      }
    }, 250);
  }, [installed]);

  const handleClick = () => {
    if (isSignedIn) {
      handleSignOut();
      localStorage.setItem('chakra-ui-color-mode', 'dark');
      router.push('/');
    } else {
      handleSignIn();
    }
  };

  if (installed) {
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
  }

  return <ConnectWalletModal {...props} />;
};
