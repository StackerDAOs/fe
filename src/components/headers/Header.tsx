import React from 'react';
import {
  Badge,
  ButtonGroup,
  Text,
  Heading,
  HStack,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';

import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from '@lib/animation';

import Avatar from 'boring-avatars';

import { Clipboard } from '@components/feedback';
import { Wrapper } from '@components/containers';
import { TransferProposal } from '@components/drawers';

import { truncateAddress } from '@stacks-os/utils';
import { getExplorerLink } from '@common/helpers';

import { useDAO } from '@lib/hooks';

export const Header = () => {
  const { data: dao } = useDAO();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Wrapper>
      <Stack
        spacing='6'
        mt='8'
        pt='8'
        display={isMobile ? 'block' : 'flex'}
        direction={{ base: 'column', md: 'row' }}
        justify='flex-start'
        align='center'
        color='white'
      >
        <motion.div
          variants={FADE_IN_VARIANTS}
          initial={FADE_IN_VARIANTS.hidden}
          animate={FADE_IN_VARIANTS.enter}
          exit={FADE_IN_VARIANTS.exit}
          transition={{ duration: 0.75, type: 'linear' }}
        >
          <Stack spacing='3'>
            <HStack justify='space-between'>
              <Stack>
                <HStack>
                  <Avatar
                    size={40}
                    name={dao?.name}
                    variant='marble'
                    colors={[
                      '#50DDC3',
                      '#624AF2',
                      '#EB00FF',
                      '#7301FA',
                      '#25C2A0',
                    ]}
                  />
                  <Heading size='lg' fontWeight='light' color='light.900'>
                    {dao?.name}
                  </Heading>
                </HStack>
                <HStack spacing='3'>
                  <Badge
                    bg='base.800'
                    color='light.900'
                    size='sm'
                    border='1px solid'
                    borderColor='base.500'
                    py='1'
                    px='3'
                    _hover={{ opacity: 0.9 }}
                  >
                    <HStack>
                      <a
                        href={getExplorerLink(dao?.contractAddress)}
                        target='_blank'
                        rel='noreferrer'
                      >
                        <Text as='span' cursor='pointer' fontSize='sm'>
                          {truncateAddress(dao?.contractAddress)}
                        </Text>
                      </a>

                      <Clipboard
                        color='light.900'
                        fontSize='sm'
                        content={dao?.contractAddress}
                        _hover={{ cursor: 'pointer', color: 'light.900' }}
                      />
                    </HStack>
                  </Badge>
                </HStack>
              </Stack>
              <ButtonGroup>
                <TransferProposal
                  bg='light.900'
                  color='base.900'
                  _hover={{ opacity: 0.9 }}
                />
              </ButtonGroup>
            </HStack>
            <Text fontSize='lg' fontWeight='light' color='light.900'>
              MEGA tokens govern MegaDAO. Holders of MEGA can vote on proposals
              or delegate their vote to a third party. A minimum of{' '}
              <Text as='span' color='light.900' fontWeight='bold'>
                250 MEGA{' '}
              </Text>
              tokens are required to submit proposals.{' '}
              <Text as='span' color='light.900' fontWeight='bold'>
                1 MEGA{' '}
              </Text>{' '}
              token is required to vote.
            </Text>
            <HStack spacing='8'>
              <Stack align='space-between'>
                <Heading size='xs' fontWeight='medium'>
                  8{' '}
                  <Text
                    as='span'
                    fontSize='sm'
                    fontWeight='regular'
                    color='gray.900'
                  >
                    proposals
                  </Text>
                </Heading>
              </Stack>
              <Stack align='space-between'>
                <Heading size='xs' fontWeight='medium'>
                  4{' '}
                  <Text
                    as='span'
                    fontSize='sm'
                    fontWeight='regular'
                    color='gray.900'
                  >
                    active
                  </Text>
                </Heading>
              </Stack>
              <Stack align='space-between'>
                <Heading size='xs' fontWeight='medium'>
                  1{' '}
                  <Text
                    as='span'
                    fontSize='sm'
                    fontWeight='regular'
                    color='gray.900'
                  >
                    executed
                  </Text>
                </Heading>
              </Stack>
            </HStack>
          </Stack>
        </motion.div>
      </Stack>
    </Wrapper>
  );
};
