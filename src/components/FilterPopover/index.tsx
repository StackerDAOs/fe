import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';

// Components
import { Card } from '@components/Card';
import { FilterIcon } from '@components/ProjectsPopover/FilterIcon';

export const FilterPopover = () => (
  <Popover
    trigger='hover'
    openDelay={0}
    placement='bottom'
    defaultIsOpen={false}
    gutter={12}
  >
    {({ isOpen, onClose }) => (
      <>
        <PopoverTrigger>
          <Button variant='link' leftIcon={<FilterIcon isOpen={isOpen} />}>
            Filter
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
                  onClick={onClose}
                  _hover={{
                    cursor: 'pointer',
                    bg: 'base.800',
                  }}
                >
                  <Text px='2' fontSize='sm' fontWeight='regular' color='white'>
                    All
                  </Text>
                </Card>
                <Card
                  bg='base.900'
                  border='none'
                  minW='150px'
                  px={{ base: '2', md: '2' }}
                  py={{ base: '2', md: '2' }}
                  onClick={onClose}
                  _hover={{
                    cursor: 'pointer',
                    bg: 'base.800',
                  }}
                >
                  <Text px='2' fontSize='sm' fontWeight='regular' color='white'>
                    Active
                  </Text>
                </Card>
                <Card
                  bg='base.900'
                  border='none'
                  minW='150px'
                  px={{ base: '2', md: '2' }}
                  py={{ base: '2', md: '2' }}
                  onClick={onClose}
                  _hover={{
                    cursor: 'pointer',
                    bg: 'base.800',
                  }}
                >
                  <Text px='2' fontSize='sm' fontWeight='regular' color='white'>
                    Pending
                  </Text>
                </Card>
                <Card
                  bg='base.900'
                  border='none'
                  minW='150px'
                  px={{ base: '2', md: '2' }}
                  py={{ base: '2', md: '2' }}
                  onClick={onClose}
                  _hover={{
                    cursor: 'pointer',
                    bg: 'base.800',
                  }}
                >
                  <Text px='2' fontSize='sm' fontWeight='regular' color='white'>
                    Active
                  </Text>
                </Card>
                <Card
                  bg='base.900'
                  border='none'
                  minW='150px'
                  px={{ base: '2', md: '2' }}
                  py={{ base: '2', md: '2' }}
                  onClick={onClose}
                  _hover={{
                    cursor: 'pointer',
                    bg: 'base.800',
                  }}
                >
                  <Text px='2' fontSize='sm' fontWeight='regular' color='white'>
                    Complete
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
