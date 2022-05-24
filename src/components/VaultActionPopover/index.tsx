import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';

// Data
import { items } from '@utils/data';

// Components
import { Card } from '@components/Card';
import { PopoverIcon } from '@components/ProjectsPopover/PopoverIcon';

export const VaultActionPopover = () => {
  const router = useRouter();
  const { dao } = router.query;
  return (
    <Popover
      trigger='click'
      openDelay={0}
      placement='bottom'
      defaultIsOpen={false}
      gutter={12}
    >
      {({ isOpen }) => (
        <>
          <PopoverTrigger>
            <Button variant='link' rightIcon={<PopoverIcon isOpen={isOpen} />}>
              Create a proposal
            </Button>
          </PopoverTrigger>
          <PopoverContent
            _focus={{ outline: 'none' }}
            width='auto'
            bg='base.900'
          >
            <SimpleGrid columns={{ base: 1 }}>
              <Stack spacing='4' direction='row' p='3'>
                <Stack spacing='1'>
                  <Link href={`/dashboard/${dao}/proposals/create`}>
                    <Card
                      bg='base.900'
                      border='none'
                      minW='150px'
                      px={{ base: '2', md: '2' }}
                      py={{ base: '2', md: '2' }}
                      _hover={{
                        cursor: 'pointer',
                        bg: 'base.800',
                      }}
                    >
                      <Text
                        px='2'
                        fontSize='sm'
                        fontWeight='regular'
                        color='white'
                      >
                        Transfer assets
                      </Text>
                    </Card>
                  </Link>
                  <Link href={`/dashboard/${dao}/proposals/create`}>
                    <Card
                      bg='base.900'
                      border='none'
                      minW='150px'
                      px={{ base: '2', md: '2' }}
                      py={{ base: '2', md: '2' }}
                      _hover={{
                        cursor: 'pointer',
                        bg: 'base.800',
                      }}
                    >
                      <Text
                        px='2'
                        fontSize='sm'
                        fontWeight='regular'
                        color='white'
                      >
                        Buy an NFT
                      </Text>
                    </Card>
                  </Link>
                  <Link href={`/dashboard/${dao}/proposals/create`}>
                    <Card
                      bg='base.900'
                      border='none'
                      minW='150px'
                      px={{ base: '2', md: '2' }}
                      py={{ base: '2', md: '2' }}
                      _hover={{
                        cursor: 'pointer',
                        bg: 'base.800',
                      }}
                    >
                      <Text
                        px='2'
                        fontSize='sm'
                        fontWeight='regular'
                        color='white'
                      >
                        Add new asset
                      </Text>
                    </Card>
                  </Link>
                </Stack>
              </Stack>
            </SimpleGrid>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};
