require('dotenv').config()
const HDWalletProvider = require("@truffle/hdwallet-provider")
module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 5000000
    },
    goerli: {
      provider: () => new HDWalletProvider({
        privateKeys: [process.env.PRIVATE_KEY_1],
        providerOrUrl: process.env.ALCHEMY_API_URL
      }),
      network_id: 5,
      gas:5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: '0.8.11',
      settings: {
        optimizer: {
          enabled: false, // Default: false
          runs: 200      // Default: 200
        },
      }
    }
  }
};
