export const devnet = process.env.NODE_ENV === "development";
export const EXECUTOR_DAO_CONTRACT = devnet ? "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.executor-dao" : "testnet_contract";
export const STACKS_API_URL = devnet ? "http://localhost:3999" : "https://stacks-node-api.testnet.stacks.co";