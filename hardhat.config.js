require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      loggingEnabled: false,
      chainId: 31337,
      mining: {
        auto: true,
        interval: 5000,
      },

      hardfork: "london", 
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        count: 10,
      },
      
      initialBaseFeePerGas: 0,
    
      gasPrice: 8000000000, 
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
  },
};