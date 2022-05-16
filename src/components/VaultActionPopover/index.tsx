import * as React from 'react';
import {
  Button,
  Icon,
  Link,
  Image,
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

export const VaultActionPopover = () => (
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
            New action
          </Button>
        </PopoverTrigger>
        <PopoverContent _focus={{ outline: 'none' }} width='auto' bg='base.900'>
          <SimpleGrid columns={{ base: 1 }}>
            <Stack spacing='4' direction='row' p='3'>
              <Stack spacing='1'>
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
                  <Text px='2' fontSize='sm' fontWeight='regular' color='white'>
                    Transfer assets
                  </Text>
                </Card>
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
                  <Text px='2' fontSize='sm' fontWeight='regular' color='white'>
                    Buy an NFT
                  </Text>
                </Card>
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
                  <Text px='2' fontSize='sm' fontWeight='regular' color='white'>
                    Add new asset
                  </Text>
                </Card>
              </Stack>
            </Stack>
          </SimpleGrid>
        </PopoverContent>
      </>
    )}
  </Popover>
);
