const { config, assert } = require("chai")
const { hexDataLength } = require("ethers/lib/utils")
const { getNamedAccounts, ethers, network } = require("hardhat")
const { devChains } = require("../../hardhat-helper-config.js")

devChains.includes(network.name) ? describe.skip :
    describe("FundMe", async function () {
        let fundMe
        let deployer
        const sendValue = ethers.utils.parseEther("1")

        beforeEach(async function () {
            deployer = (await getNamedAccounts()).deployer
            fundMe = await ethers.getContract("FundMe", deployer)
        })

        it("allows peopl to fund and withdraw", async function () {
            await fundMe.fund({ value: sendValue })
            await fundMe.withdaw()
            const endingBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            assert.equal(endingBalance.toString(), "0")
        })
    })