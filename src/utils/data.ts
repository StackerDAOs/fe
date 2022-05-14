import { FiBarChart, FiFileText, FiGrid, FiMousePointer, FiRepeat, FiShield } from 'react-icons/fi';

export const steps = [
  {
    title: 'Members',
    extensionName: 'membershipExtension',
    payload: {
      header: 'Membership Contract',
      action: { title: 'Deploy', event: null },
      button: { title: 'Membership', type: 'primary' },
    },
  },
  {
    title: 'Vault',
    extensionName: 'vaultExtension',
    payload: {
      header: 'Vault Contract',
      action: { title: 'Deploy', event: null },
      button: { title: 'Vault', type: 'primary' },
    },
  },
  {
    title: 'Submitting Proposals',
    extensionName: 'proposalExtension',
    payload: {
      header: 'Proposal Contract',
      action: { title: 'Deploy', event: null },
      button: { title: 'Submitting Proposals', type: 'primary' },
    },
  },
  {
    title: 'Voting on Proposals',
    extensionName: 'votingExtension',
    payload: {
      header: 'Voting Contract',
      action: { title: 'Deploy', event: null },
      button: { title: 'Voting on Proposals', type: 'primary' },
    },
  },
  {
    title: 'Emergency Proposals',
    extensionName: 'emergencyExtension',
    payload: {
      header: 'Emergency Proposal Contract',
      action: { title: 'Deploy', event: null },
      button: { title: 'Emergency Proposals', type: 'primary' },
    },
  },
  {
    title: 'Emergency Team',
    extensionName: 'emergencyExtension',
    payload: {
      header: 'Emergency Team Contract',
      action: { title: 'Deploy', event: null },
      button: { title: 'Emergency Team', type: 'primary' },
    },
  },
];

export const paths = [
  {
    path: '/communities/get-started',
    nextPath: '/communities/setup-vault',
    previousPath: '',
  },
  {
    path: '/communities/setup-vault',
    nextPath: '/communities/proposals',
    previousPath: '/communities/get-started',
  },
  {
    path: '/communities/proposals',
    nextPath: '/communities/voting',
    previousPath: '/communities/setup-vault',
  },
  {
    path: '/communities/voting',
    nextPath: '/communities/emergency-rules',
    previousPath: '/communities/proposals',
  },
  {
    path: '/communities/emergency-rules',
    nextPath: '/communities/ready',
    previousPath: '/communities/voting',
  },
  {
    path: '/communities/ready',
    nextPath: '/dashboard',
    previousPath: '/communities/emergency-rules',
  },
];

export const members = [
  {
    id: '1',
    name: 'Christian Nwamba',
    handle: '@christian',
    email: 'christian@chakra-ui.com',
    avatarUrl: 'https://bit.ly/code-beast',
    status: 'Send',
    role: 'Senior Developer Advocate',
  },
  {
    id: '2',
    name: 'Kent C. Dodds',
    handle: '@kent',
    email: 'kent@chakra-ui.com',
    avatarUrl: 'https://bit.ly/kent-c-dodds',
    status: 'Send',
    role: 'Director of DX',
  },
  {
    id: '3',
    name: 'Prosper Otemuyiwa',
    handle: '@prosper',
    email: 'prosper@chakra-ui.com',
    avatarUrl: 'https://bit.ly/prosper-baba',
    status: 'Send',
    role: 'Director of Evangelism',
  },
  {
    id: '4',
    name: 'Ryan Florence',
    handle: '@ryan',
    email: 'ryan@chakra-ui.com',
    avatarUrl: 'https://bit.ly/ryan-florence',
    status: 'Send',
    role: 'Co-Founder',
  },
  {
    id: '5',
    name: 'Segun Adebayo',
    handle: '@segun',
    email: 'segun@chakra-ui.com',
    avatarUrl: 'https://bit.ly/sage-adebayo',
    status: 'Send',
    role: 'Frontend UI Engineer',
  },
]

export const whitelistAssets = [
  {
    asset: 'MiamiCoin',
    symbol: 'MIA',
    icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/10300.png',
    contractAddress: 'SP466FNC0P7JWTNM2R9T199QRZN1MYEDTAR0KP27.miamicoin-token',
  },
  {
    asset: 'New York Coin',
    symbol: 'NYC',
    icon: 'https://uploads-ssl.webflow.com/6183fee77b05811a9e7eff91/6183fee77b05813bd67f001c_CC_NYCCoin_StandAloneCoin.png',
    contractAddress: 'SP2H8PY27SEZ03MWRKS5XABZYQN17ETGQS3527SA5.newyorkcitycoin-token',
  },
  {
    asset: 'ALEX',
    symbol: 'ALEX',
    icon: 'https://uploads-ssl.webflow.com/61202e49cdb38130154c0900/613eca73cd6715469da40555_ALEX_logo_TM_stacked_large.png',
    contractAddress: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.age000-governance-token',
  },
]

export const items = [
  {
    title: 'Megapont DAO',
    description: 'Powered by $MEGACOIN',
    href: '/megapont',
    icon: 'https://www.megapont.com/images/logo.svg',
  },
  {
    title: 'Stacks Mfers',
    description: 'just a bunch of mfers on stacks',
    href: '/mfers',
    icon: 'https://stxnft.mypinata.cloud/ipfs/QmUL7yELAmF1wnbqt6yaNLmCVbBa7BSbSNXYKijpku2r45/1.png?img-width=240&img-fit=contain&img-quality=60&img-onerror=redirect&img-fit=pad&img-format=webp',
  },
]