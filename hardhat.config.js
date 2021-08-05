require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 137,
      forking: {
        url: "https://polygon-mainnet.g.alchemy.com/v2/Ooi3CJTeq230aXBxs2JINU4LeZOTsCij",
      },
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [
        `0x137e99faa9dc8efdbec1516a2914e79d070f92970e7a2eae8db859d9324e7230`,
      ],
    },
    polygon: {
      url: process.env.RPC_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};
