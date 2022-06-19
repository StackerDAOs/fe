import {
  Button,
  Link,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import { items } from '@utils/data';

export const AccountPopover = () => (
  <Popover
    trigger='click'
    openDelay={0}
    placement='right'
    defaultIsOpen={false}
    gutter={12}
  >
    {() => (
      <>
        <PopoverTrigger>
          <Button variant='link'>Projects</Button>
        </PopoverTrigger>
        <PopoverContent
          _focus={{ outline: 'none' }}
          p='5'
          width={{ base: 'sm', md: 'lg' }}
          bg='base.900'
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} columnGap='6' rowGap='2'>
            {items.map((item, id) => (
              <Link variant='menu' href={item.href} key={id} outline='none'>
                <Stack spacing='4' direction='row' p='3'>
                  <Image
                    cursor='pointer'
                    height='35px'
                    src={item.icon}
                    alt='logo'
                    boxSize='6'
                  />
                  {/* <Icon as={item.icon} boxSize='6' color='accent' /> */}
                  <Stack spacing='1'>
                    <Text fontWeight='medium'>{item.title}</Text>
                    <Text fontSize='sm' color='muted'>
                      {item.description}
                    </Text>
                  </Stack>
                </Stack>
              </Link>
            ))}
          </SimpleGrid>
        </PopoverContent>
      </>
    )}
  </Popover>
);
