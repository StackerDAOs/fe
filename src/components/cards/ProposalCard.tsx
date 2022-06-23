import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Badge,
  Box,
  HStack,
  Progress,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';

import { motion } from 'framer-motion';

// Hooks
import { useBlocks } from '@common/hooks';

// Components
import { Card } from '@components/Card';

// Utils
import { getPercentage, tokenToNumber, truncate } from '@common/helpers';
import Avatar from 'boring-avatars';

const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 },
};

export const ProposalCard = ({
  contractAddress,
  title,
  description,
  concluded,
  startBlockHeight,
  endBlockHeight,
  votesFor,
  votesAgainst,
}: any) => {
  const { currentBlockHeight } = useBlocks();
  const router = useRouter();
  const { dao } = router.query as any;
  const totalVotes = Number(votesFor) + Number(votesAgainst);
  const isClosed = currentBlockHeight > endBlockHeight;
  const isOpen =
    currentBlockHeight <= endBlockHeight &&
    currentBlockHeight >= startBlockHeight;
  const convertedVotesFor = tokenToNumber(Number(votesFor), 2);
  const convertedVotesAgainst = tokenToNumber(Number(votesAgainst), 2);
  const convertedTotalVotes = tokenToNumber(Number(totalVotes), 2);

  const statusBadge = (
    <>
      {concluded ? (
        <Badge colorScheme='secondary' size='sm' px='4' py='2'>
          Executed
        </Badge>
      ) : isClosed ? (
        <Badge colorScheme='blue' size='sm' px='4' py='2'>
          Voting compeleted
        </Badge>
      ) : isOpen ? (
        <Badge colorScheme='green' size='sm' px='4' py='2'>
          Live
        </Badge>
      ) : (
        <Badge colorScheme='yellow' size='sm' px='4' py='2'>
          Pending
        </Badge>
      )}
    </>
  );

  return (
    <motion.div
      variants={FADE_IN_VARIANTS}
      initial={FADE_IN_VARIANTS.hidden}
      animate={FADE_IN_VARIANTS.enter}
      exit={FADE_IN_VARIANTS.exit}
      transition={{ duration: 0.25, type: 'linear' }}
    >
      <Link href={`/d/${dao}/proposals/${contractAddress}`}>
        <a>
          <Card
            bg='base.800'
            position='relative'
            px={{ base: '6', md: '6' }}
            pt={{ base: '3', md: '3' }}
            pb={{ base: '6', md: '6' }}
            _hover={{
              cursor: 'pointer',
            }}
          >
            <Stack direction='row'>
              <Stack
                spacing='4'
                direction={{
                  base: 'row',
                  md: 'column',
                }}
                justify='space-between'
                color='white'
              >
                <HStack>{statusBadge}</HStack>

                <Stack>
                  <HStack spacing='3' justify='space-between'>
                    <Stack direction='column' spacing='3'>
                      <HStack align='flex-start'>
                        <Avatar
                          size={30}
                          name={title}
                          variant='bauhaus'
                          colors={[
                            '#50DDC3',
                            '#624AF2',
                            '#EB00FF',
                            '#7301FA',
                            '#25C2A0',
                          ]}
                        />
                        <Text fontWeight='medium' fontSize='lg'>
                          {title}
                        </Text>
                      </HStack>
                      <Text fontWeight='regular' color='gray.900'>
                        {truncate(description, 75)}
                      </Text>
                    </Stack>
                  </HStack>
                  <Stack direction='column' spacing='3'>
                    <Stack spacing='3' mt='2'>
                      <Text
                        color='gray.900'
                        fontSize='sm'
                        fontWeight='semibold'
                      >
                        Yes ({convertedVotesFor})
                      </Text>
                      <Progress
                        colorScheme='secondary'
                        size='md'
                        value={getPercentage(totalVotes, Number(votesFor))}
                        bg='base.500'
                      />
                    </Stack>
                    <Stack spacing='3'>
                      <Text
                        color='gray.900'
                        fontSize='sm'
                        fontWeight='semibold'
                      >
                        No ({convertedVotesAgainst})
                      </Text>
                      <Progress
                        colorScheme='whiteAlpha'
                        size='md'
                        value={getPercentage(totalVotes, Number(votesAgainst))}
                        bg='base.500'
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Card>
        </a>
      </Link>
    </motion.div>
  );
};
