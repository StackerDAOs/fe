import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Badge, HStack, Icon, Progress, Stack, Text } from '@chakra-ui/react';

// Hooks
import { useBlocks } from '@common/hooks';

// Components
import { Card } from '@components/Card';

// Animation
import { motion } from 'framer-motion';

// Utils
import { getPercentage, tokenToNumber, truncate } from '@common/helpers';
import Avatar from 'boring-avatars';
import { FiArrowUpRight } from 'react-icons/fi';

const FADE_IN_VARIANTS = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 },
};

export const ProposalCard = ({
  contractAddress,
  title,
  type,
  description,
  concluded,
  startBlockHeight,
  endBlockHeight,
  votesFor,
  votesAgainst,
}: any) => {
  const [isHovered, setHovered] = useState(false);
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

  const statusBadge = (
    <>
      {concluded ? (
        <Badge bg='base.800' color='secondary.900' size='sm' py='1' px='3'>
          Executed
        </Badge>
      ) : isClosed ? (
        <Badge bg='base.800' color='secondary.900' size='sm' py='1' px='3'>
          Voting compeleted
        </Badge>
      ) : isOpen ? (
        <Badge bg='base.800' color='secondary.900' size='sm' py='1' px='3'>
          Live
        </Badge>
      ) : (
        <Badge bg='base.800' color='secondary.900' size='sm' py='1' px='3'>
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
      whileHover={{
        scale: 1.015,
      }}
      whileTap={{
        scale: 1,
      }}
    >
      <Link href={`/d/${dao}/proposals/${contractAddress}`}>
        <a>
          <Card
            bg='base.900'
            h='auto'
            position='relative'
            px={{ base: '6', md: '6' }}
            py={{ base: '6', md: '6' }}
            justifyContent='center'
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
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
                <HStack justify='space-between'>
                  {statusBadge}
                  {isHovered && (
                    <motion.div
                      variants={FADE_IN_VARIANTS}
                      initial={FADE_IN_VARIANTS.hidden}
                      animate={FADE_IN_VARIANTS.enter}
                      exit={FADE_IN_VARIANTS.exit}
                      transition={{ duration: 0.5, type: 'linear' }}
                    >
                      <Icon as={FiArrowUpRight} boxSize='5' color='light.900' />
                    </motion.div>
                  )}
                </HStack>
                <Stack>
                  <HStack spacing='3' justify='space-between'>
                    <Stack direction='column' spacing='3'>
                      <HStack align='center' spacing='2'>
                        <Avatar
                          size={40}
                          name={type}
                          variant='bauhaus'
                          colors={[
                            '#50DDC3',
                            '#624AF2',
                            '#EB00FF',
                            '#7301FA',
                            '#25C2A0',
                          ]}
                        />
                        <Text
                          fontWeight='medium'
                          fontSize='lg'
                          lineHeight='1.15'
                        >
                          {title} {type}
                        </Text>
                      </HStack>
                      <Text fontWeight='regular' color='gray.900'>
                        {description && truncate(description, 50)}
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
