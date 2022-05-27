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

export const transferAssetsSteps = [
  {
    title: 'Asset Type',
    description: 'Choose the type of asset you want to transfer',
  },
  {
    title: 'Select Asset',
    description: 'Select the asset you want to transfer',
  },
  {
    title: 'Proposal Details',
    description: 'Provide details about the proposal',
  },
  {
    title: 'Review & Submit',
    description: 'Review and submit the proposal',
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

export const inbox = [
  {
    type: 'Transfer assets',
    description:
      'This proposal transfers assets from one account to another.',
    status: 'ACTIVE',
    logo: 'https://assets.website-files.com/618b0aafa4afde65f2fe38fe/618b0aafa4afde5f2afe3a33_icons-cards%20(2).svg',
    result: null,
  },
  {
    type: 'Add new asset',
    description: 'This proposal whitelists a new asset to the vault.',
    status: 'PENDING',
    logo: 'https://assets.website-files.com/618b0aafa4afde65f2fe38fe/618b0aafa4afde0ffcfe3a49_icons-cards%20(1).svg',
    result: null,
  },
];

export const stats = [
  {
    label: 'Vault',
    value: '885.79 STX',
    delta: { value: '0 pending transactions', isUpwardsTrend: true },
    path: 'vault',
  },
  {
    label: 'Proposals',
    value: '3',
    delta: { value: '2 active, 1 pending', isUpwardsTrend: true },
    path: 'governance',
  },
  {
    label: 'Governance',
    value: '2.87%',
    delta: { value: '> 0.5% required', isUpwardsTrend: true },
    path: 'delegates',
  },
];

export const proposals = [
  {
    type: 'Transfer assets',
    description:
      'This proposal transfers assets from one account to another.',
    status: 'ACTIVE',
    logo: 'https://assets.website-files.com/618b0aafa4afde65f2fe38fe/618b0aafa4afde5f2afe3a33_icons-cards%20(2).svg',
    result: null,
  },
  {
    type: 'Add new asset',
    description: 'This proposal whitelists a new asset to the vault.',
    status: 'PENDING',
    logo: 'https://assets.website-files.com/618b0aafa4afde65f2fe38fe/618b0aafa4afde0ffcfe3a49_icons-cards%20(1).svg',
    result: null,
  },
  {
    type: 'Funding proposal',
    description:
      'This proposal creates a simple dev fund that pays developers on a monthly basis.',
    status: 'COMPLETE',
    logo: 'https://assets.website-files.com/618b0aafa4afde65f2fe38fe/618b0aafa4afde6ca8fe3a32_icons-cards%20(4).svg',
    result: false,
  },
];

export const extensions = [
  {
    type: '$ALEX Staking',
    description:
      'Transfer assets to the ALEX staking protocol and earn a yield.',
    status: 'ACTIVE',
    result: null,
  },
  {
    type: 'CityCoins Mining',
    description: 'Start mining CityCoins ($MIA, $NYC)',
    status: 'PENDING',
    result: null,
  },
  {
    type: 'Delegation Voting',
    description:
      'Add the ability to delegate your voting power to other members of the community.',
    status: 'COMPLETE',
    result: false,
  },
  {
    type: 'Governance Token',
    description:
      'Launch your own Governance Token to manage your community.',
    status: 'PENDING',
    result: false,
  },
];

export const transactions = [
  {
    title: 'Delegate vote',
    createdBy: 'SP9Y...1TGM',
    createdAt: '~ 9 hours ago',
    type: 'vote',
  },
  {
    title: 'Submitted proposal',
    createdBy: 'STTF...K04A',
    createdAt: '~ 3 days ago',
    type: 'submission',
  },
  {
    title: 'Deployed proposal',
    createdBy: 'STTF...K04A',
    createdAt: '~ 4 days ago',
    type: 'deploy',
  },
];