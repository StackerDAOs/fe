import {
  Avatar,
  Badge,
  HStack,
  IconButton,
  Table,
  TableProps,
  Tbody,
  Td,
  Text,
  Tr,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import * as React from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { members } from '@utils/data';

export const DataTable = (props: TableProps) => (
  <Table {...props}>
    <Tbody color={mode('base.900', 'light.900')}>
      {members.map((member) => (
        <Tr
          key={member.id}
          borderTop={`1px solid #1F2129`}
          borderBottom={`1px solid #1F2129`}
          cursor='pointer'
          _hover={{
            bg: mode('light.700', 'base.700'),
          }}
        >
          <Td border='none'>
            <Badge size='md' colorScheme='base'>
              {member.status}
            </Badge>
          </Td>
          <Td border='none'>
            <HStack spacing='3'>
              <Avatar name={member.name} src={member.avatarUrl} boxSize='6' />
              <Text color='muted'>
                28,290 sent to{' '}
                <Badge size='md' colorScheme='base'>
                  SP1234...9876
                </Badge>
              </Text>
            </HStack>
          </Td>
          <Td border='none'>
            <Text color='muted'>{member.role}</Text>
          </Td>
          <Td border='none'>
            <HStack spacing='1'>
              <IconButton
                icon={<FiExternalLink />}
                variant='ghost'
                aria-label='Edit member'
              />
            </HStack>
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);
