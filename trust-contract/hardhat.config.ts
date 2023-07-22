import "@nomicfoundation/hardhat-toolbox";
require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    goerli_optimism: {
      url: `https://goerli.optimism.io`,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
