import {
  Button,
  Divider,
  Link,
  Icon,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';

// Animation
import { motion } from 'framer-motion';

import { items } from '@utils/data';
import { PopoverIcon } from './PopoverIcon';

// Icon
import { FiArrowUpRight } from 'react-icons/fi';

export const ProjectsPopover = () => (
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
          <Button
            variant='link'
            size='sm'
            fontWeight='medium'
            rightIcon={<PopoverIcon isOpen={isOpen} />}
          >
            Projects
          </Button>
        </PopoverTrigger>
        <PopoverContent
          _focus={{ outline: 'none' }}
          p='3'
          w='xs'
          bg='base.700'
          borderColor='base.800'
        >
          <Stack spacing='4'>
            <Text fontSize='sm' fontWeight='medium' color='light.900'>
              Top projects
            </Text>

            {items.map((item, id) => (
              <Link
                variant='menu'
                href={item.href}
                key={id}
                outline='none'
                _hover={{ textDecoration: 'none' }}
              >
                <HStack
                  justify='space-between'
                  borderRadius='lg'
                  p='3'
                  _hover={{ bg: 'base.500' }}
                >
                  <Stack
                    spacing='4'
                    direction='row'
                    color='white'
                    align='center'
                  >
                    <Image
                      borderRadius='full'
                      src={item.icon}
                      alt='logo'
                      boxSize='6'
                    />
                    {/* <Icon as={item.icon} boxSize='6' color='accent' /> */}
                    <Stack spacing='1'>
                      <Text fontWeight='medium'>{item.title}</Text>
                    </Stack>
                  </Stack>
                </HStack>
              </Link>
            ))}
            <Divider borderColor='base.500' />
            <Button
              color='white'
              bg='base.500'
              p='6'
              my='8'
              size='md'
              fontWeight='medium'
              _hover={{ opacity: 0.9 }}
            >
              View all
            </Button>
          </Stack>
        </PopoverContent>
      </>
    )}
  </Popover>
);
