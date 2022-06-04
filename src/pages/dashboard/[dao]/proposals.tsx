// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';
// import {
//   Badge,
//   Box,
//   Button,
//   Container,
//   Stack,
//   HStack,
//   Image,
//   SimpleGrid,
//   Text,
//   useToast,
// } from '@chakra-ui/react';

// // Store
// import { useStore as ProposalStore } from 'store/ProposalStore';

// // Components
// import { Card } from '@components/Card';
// import { AppLayout } from '@components/Layout/AppLayout';
// import { RadioButton, RadioButtonGroup } from '@components/RadioButtonGroup';
// import { VaultActionPopover } from '@components/VaultActionPopover';
// import { FilterPopover } from '@components/FilterPopover';

// //  Animation
// import { motion } from 'framer-motion';

// // Icons
// import { FaCheck, FaTimes, FaArrowRight } from 'react-icons/fa';

// // Stacks
// import {
//   useAuth,
//   useNetwork,
//   useUser,
//   useCurrentStxAddress,
//   useContractCall,
// } from '@micro-stacks/react';
// import type { FinishedTxData } from 'micro-stacks/connect';
// import { fetchTransaction, fetchReadOnlyFunction } from 'micro-stacks/api';
// import { uintCV, principalCV } from 'micro-stacks/clarity';
// import {
//   FungibleConditionCode,
//   PostConditionMode,
//   makeStandardSTXPostCondition,
//   makeStandardFungiblePostCondition,
//   createAssetInfo,
// } from 'micro-stacks/transactions';

// import { usePolling } from '@common/hooks/use-polling';

// // import { Notification } from '@components/Notification';
// // import { CloseButton } from '@components/CloseButton';
// // import { useCallFunction } from '@common/hooks/use-call-function';
// // import { useTransaction } from '@common/hooks/use-transaction';
// // import ContractCallButton from 'widgets/ContractCallButton';

// // interface State {
// //   txId: string | null;
// //   delay: number | null;
// // }

// const Proposals = () => {
//   const { isSignedIn } = useAuth();
//   const currentStxAddress = useCurrentStxAddress();
//   const { network } = useNetwork();
//   const router = useRouter();
//   const { dao } = router.query;

//   // Store
//   const { proposals } = ProposalStore();

//   const toast = useToast();

//   const FADE_IN_VARIANTS = {
//     hidden: { opacity: 0, x: 0, y: 0 },
//     enter: { opacity: 1, x: 0, y: 0 },
//     exit: { opacity: 0, x: 0, y: 0 },
//   };

//   const SLIDE_UP_BUTTON_VARIANTS = {
//     hidden: { opacity: 0, x: 0, y: 15 },
//     enter: { opacity: 1, x: 0, y: 0 },
//     exit: { opacity: 0, x: 0, y: -15 },
//   };

//   // usePolling(() => {
//   //   console.log('make api call');
//   // }, 7500);

//   const contractAddress = 'ST3CK642B6119EVC6CT550PW5EZZ1AJW6608HK60A';
//   const contractName = 'citycoin-token';
//   const functionName = 'burn';

//   const functionArgs = [
//     uintCV(10),
//     principalCV('ST143YHR805B8S834BWJTMZVFR1WP5FFC00V8QTV4'),
//   ];
//   const postConditionAddress =
//     currentStxAddress || 'ST3CK642B6119EVC6CT550PW5EZZ1AJW6608HK60A';
//   const postConditionCode = FungibleConditionCode.LessEqual;
//   const postConditionAmount = 10;
//   const fungibleAssetInfo = createAssetInfo(
//     contractAddress,
//     contractName,
//     'citycoins',
//   );
//   const postConditions = [
//     makeStandardFungiblePostCondition(
//       postConditionAddress,
//       postConditionCode,
//       postConditionAmount,
//       fungibleAssetInfo,
//     ),
//   ];

//   const { handleContractCall, isLoading } = useContractCall({
//     contractAddress,
//     contractName,
//     functionName,
//     functionArgs,
//     postConditions,
//   });

//   const handleClick = () => {
//     handleContractCall();
//   };

//   return (
//     <motion.div
//       variants={FADE_IN_VARIANTS}
//       initial={FADE_IN_VARIANTS.hidden}
//       animate={FADE_IN_VARIANTS.enter}
//       exit={FADE_IN_VARIANTS.exit}
//       transition={{ duration: 0.75, type: 'linear' }}
//     >
//       <Box as='section'>
//         <Container maxW='5xl'>
//           <Stack spacing={{ base: '8', lg: '6' }}>
//             <Stack w='auto'>
//               <Box as='section'>
//                 <Container>
//                   <Stack spacing='5'>
//                     <Stack
//                       spacing='4'
//                       my='6'
//                       direction={{ base: 'column', md: 'row' }}
//                       justify='space-between'
//                       alignItems='center'
//                       color='white'
//                     >
//                       <Box>
//                         <Text fontSize='2xl' fontWeight='medium'>
//                           Proposals
//                         </Text>
//                         <Text color='gray.900' fontSize='sm'>
//                           All registered users in the overview
//                         </Text>
//                       </Box>
//                       {/* <FilterPopover /> */}
//                     </Stack>
//                   </Stack>
//                   <SimpleGrid
//                     columns={{ base: 1, md: 2, lg: 2 }}
//                     spacing='6'
//                     py='4'
//                     color='white'
//                   >
//                     {proposals.map(
//                       ({ concluded, votesFor, votesAgainst }: any) => {
//                         return (
//                           <Link href={`/dashboard/${dao}/proposals/create`}>
//                             <Card
//                               bg='base.900'
//                               position='relative'
//                               px={{ base: '6', md: '6' }}
//                               py={{ base: '6', md: '6' }}
//                               border='1px solid rgb(134, 143, 152)'
//                               _hover={{ cursor: 'pointer', bg: 'base.800' }}
//                             >
//                               <Stack
//                                 spacing={{ base: '0', md: '2' }}
//                                 justify='space-between'
//                               >
//                                 <HStack>
//                                   <Badge
//                                     size='sm'
//                                     maxW='fit-content'
//                                     variant='subtle'
//                                     colorScheme={concluded ? 'white' : 'red'}
//                                     px='3'
//                                     py='2'
//                                   >
//                                     <HStack spacing='2'>
//                                       <Text>{status}</Text>
//                                     </HStack>
//                                   </Badge>
//                                   {concluded && (
//                                     <Badge
//                                       size='sm'
//                                       maxW='fit-content'
//                                       variant='subtle'
//                                       colorScheme={
//                                         votesFor.toString() >
//                                         votesAgainst.toString()
//                                           ? 'green'
//                                           : 'red'
//                                       }
//                                       px='3'
//                                       py='2'
//                                     >
//                                       <HStack spacing='1'>
//                                         {concluded &&
//                                         votesFor.toString() >
//                                           votesAgainst.toString() ? (
//                                           <>
//                                             <FaCheck />
//                                             <Text>Approved</Text>
//                                           </>
//                                         ) : (
//                                           <>
//                                             <FaTimes />
//                                             <Text>Failed</Text>
//                                           </>
//                                         )}
//                                       </HStack>
//                                     </Badge>
//                                   )}
//                                 </HStack>
//                                 <Stack spacing='1'>
//                                   <Text fontSize='lg' fontWeight='medium'>
//                                     Transfer Assets
//                                   </Text>
//                                   <Text fontSize='sm' color='gray.900'>
//                                     Transfer STX to a wallet for funding
//                                     subDAOs,
//                                   </Text>
//                                 </Stack>
//                               </Stack>
//                             </Card>
//                           </Link>
//                         );
//                       },
//                     )}
//                   </SimpleGrid>
//                 </Container>
//               </Box>
//             </Stack>
//           </Stack>
//         </Container>
//       </Box>
//     </motion.div>
//   );
// };

// Proposals.getLayout = (page: any) => <AppLayout>{page}</AppLayout>;

// export default Proposals;
