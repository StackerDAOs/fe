import Link from 'next/link';
import { Button, Stack, Text } from '@chakra-ui/react';

export const EmptyState = ({ heading, linkTo, buttonTitle }: any) => {
  return (
    <Stack spacing='3' m='6' alignItems='center' color='white'>
      <Text fontSize='lg' fontWeight='medium'>
        {heading}
      </Text>
      <Link href={linkTo}>
        <Button
          my='10'
          py='4'
          color='white'
          bg='secondary.900'
          size='sm'
          _hover={{ opacity: 0.9 }}
          _active={{ opacity: 1 }}
        >
          {buttonTitle}
        </Button>
      </Link>
    </Stack>
  );
};
