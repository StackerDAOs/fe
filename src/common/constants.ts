export const baseUrl =
process.env.NODE_ENV === 'production'
  ? 'https://app.stackerdaos.com'
  : 'http://localhost:3001/';
export const devnet = process.env.NODE_ENV === "development";
export const EXECUTOR_DAO_CONTRACT = devnet ? "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.executor-dao" : "testnet_contract";
export const STACKS_API_URL = devnet ? "http://localhost:3999" : "https://stacks-node-api.testnet.stacks.co";
export const traitPrincipal = devnet ? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM' : 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
export const appDetails = {
  name: 'StackerDAO Labs',
  icon: 'https://stackerdaos-assets.s3.us-east-2.amazonaws.com/app/stackerdaos-hiro-logo.png',
};