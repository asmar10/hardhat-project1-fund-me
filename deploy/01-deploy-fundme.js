const { network } = require("hardhat");
const { networkConfig, devChains } = require("../hardhat-helper-config.js");
const { verify } = require("../utils/verify.js");

async function deployFunc(hre) {

    hre.deployments;
    hre.getNamedAccounts;

    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let ethUsdPriceFeedAddress;

    if (devChains.includes(network.name)) {
        const ethUsdAggregator = await get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }


    const FundMe = await deploy("FundMe", {
        contract: "FundMe",
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
        waitConfirmations: network.config.blockConfirmations,
    })

    if (!devChains.includes(network.name)) {
        verify(FundMe.address, [ethUsdPriceFeedAddress]);

    }
}
module.exports.tags = ["all", "FundMe"]
module.exports.default = deployFunc;
