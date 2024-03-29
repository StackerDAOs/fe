import { useEffect, useState } from 'react';
import { Button, ButtonProps, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useAuth } from '@micro-stacks/react';

// Components
import { ConnectWalletModal } from '@components/Modal/ConnectWalletModal';

export const WalletConnectButton = (props: ButtonProps) => {
  const [installed, setInstalled] = useState(false);
  const { isSignedIn, openAuthRequest, signOut, isRequestPending } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      if (window?.StacksProvider) {
        setInstalled(true);
      }
    }, 500);
  }, [installed]);

  function handleClick() {
    if (isSignedIn) {
      signOut();
      localStorage.setItem('chakra-ui-color-mode', 'dark');
      router.push('/');
    } else {
      openAuthRequest();
    }
  }

  if (installed) {
    return (
      <Button {...props} onClick={handleClick}>
        {isRequestPending ? (
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
