import { useEffect, useState } from 'react';
import { supabase } from '@utils/supabase';
import {
  HStack,
  IconButton,
  Table,
  Thead,
  Th,
  TableProps,
  Tbody,
  Td,
  Text,
  Tr,
  Skeleton,
} from '@chakra-ui/react';

// Components
import { EmptyState } from '@components/EmptyState';

// Web3
import { useAccount } from '@micro-stacks/react';

// Utils
import Avatar from 'boring-avatars';

// Animation
import { motion } from 'framer-motion';
import { FADE_IN_VARIANTS } from '@utils/animation';

// Icons
import { FaArrowRight } from 'react-icons/fa';

type TProjectsTable = {
  isLoading: boolean;
  projects: any[];
};

const initialState = {
  isLoading: true,
  projects: [],
};

export const ProjectsTable = (props: TableProps) => {
  const [state, setState] = useState<TProjectsTable>(initialState);
  const { stxAddress } = useAccount();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data: Organizations, error } = await supabase
          .from('Organizations')
          .select('id, name, slug, contractAddress');
        if (error) throw error;
        if (Organizations.length > 0) {
          const projects = Organizations;
          setState({ ...state, isLoading: false, projects });
        }
      } catch (e: any) {
        console.error({ e });
      }
    };
    fetchProjects();
  }, [stxAddress]);

  if (state.projects.length === 0) {
    return <EmptyState heading='No projects found' />;
  }

  return (
    <Skeleton isLoaded={!state.isLoading}>
      <motion.div
        variants={FADE_IN_VARIANTS}
        initial={FADE_IN_VARIANTS.hidden}
        animate={FADE_IN_VARIANTS.enter}
        exit={FADE_IN_VARIANTS.exit}
        transition={{ duration: 1, type: 'linear' }}
      >
        <Table {...props}>
          <Thead color='gray.900'>
            <Tr>
              <Th bg='transparent' border='none'>
                Project
              </Th>
              <Th bg='transparent' border='none'></Th>
            </Tr>
          </Thead>
          <Tbody color='light.900'>
            {state.projects.map((project: any) => {
              return (
                <Tr
                  key={project.id}
                  cursor='pointer'
                  _hover={{ bg: 'base.800' }}
                >
                  <Td borderColor='base.500'>
                    <HStack spacing='2' align='center'>
                      <Avatar
                        size={25}
                        name={project.name}
                        variant='marble'
                        colors={[
                          '#50DDC3',
                          '#624AF2',
                          '#EB00FF',
                          '#7301FA',
                          '#25C2A0',
                        ]}
                      />
                      <HStack align='baseline'>
                        <Text color='light.900' fontWeight='medium'>
                          {project.name}
                        </Text>
                      </HStack>
                    </HStack>
                  </Td>

                  <Td borderColor='base.500' w='10%'>
                    <IconButton
                      icon={<FaArrowRight fontSize='0.75em' />}
                      bg='base.900'
                      size='sm'
                      border='1px solid'
                      borderColor='base.500'
                      aria-label='Transfer'
                      _hover={{ bg: 'base.500' }}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </motion.div>
    </Skeleton>
  );
};
