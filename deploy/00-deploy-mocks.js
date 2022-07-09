const { network } = require("hardhat")
const {
    devChains,
    DECIMALS,
    _INITIALANSWER,
} = require("../hardhat-helper-config")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    // we need to edploy mocks if we are on a local network
    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator", // to be really specific
            from: deployer,
            log: true,
            args: [DECIMALS, _INITIALANSWER],
        })
        log("Mocks deployed!")
        log("-----------------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]