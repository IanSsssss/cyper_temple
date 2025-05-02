// hardhat.config.js
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/CgIS8gBoKOp3atEMXs4ZhEwuJVdFiAU0",
      accounts: ["d2b1bbbbb4f2f3884673bb1ae44a33b5f9d42e78a264717168ba7c13caad257d"]
    }
  }
};