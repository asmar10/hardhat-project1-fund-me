require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");


const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API = process.env.ETHERSCAN_API;
const CMC_API = process.env.CMC_API;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.8"
      },
      {
        version: "0.6.6"
      },
    ],
  },
  networks: {
    rinkeby: {
      url: RINKEBY_RPC_URL,
      accounts: [PRIVATE_KEY],
      blockConfirmations: 5,
      chainId: 4,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    //coinmarketcap: CMC_API,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API,
  },

  namedAccounts: {
    deployer: {
      default: 0,
    },

  },
};
