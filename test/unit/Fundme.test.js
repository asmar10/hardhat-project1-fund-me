const { expect, assert } = require("chai");
const { ethers, deployments, getNamedAccounts } = require("hardhat");

describe("FundMe", async function () {

  let fundMe;
  let deployer;
  let MockV3Aggregator;
  const sendValue = ethers.utils.parseEther("1")

  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer
    await deployments.fixture(["all"]);
    MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)

    fundMe = await ethers.getContract("FundMe", deployer)
  })

  describe("constructor", async function () {
    it("sets the aggregator addresses correctly", async function () {
      const response = await fundMe.priceFeed()
      assert.equal(response, MockV3Aggregator.address)
    })
  })

  describe("fund", async function () {
    it("should validate the enough ETH are sent", async function () {
      await expect(fundMe.fund()).to.be.revertedWith(
        "Yoou need to send more ETH"
      )
    })

    it("should update amount funded dat structure", async function () {
      await fundMe.fund({ value: sendValue })
      const response = await fundMe.addressToAmountFunded(deployer)
      assert.equal(response.toString(), sendValue.toString());
    })
    it("should add funder to array of funders", async function () {
      await fundMe.fund({ value: sendValue })
      const funder = await fundMe.funders(0)
      assert.equal(funder, deployer)
    })

  })

  describe("withdraw", async function () {
    it("Withdraw ETH from a single founder", async function () {
      //arrange
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      )
      const startingDeployerBalacne = await fundMe.provider.getBalance(
        deployer
      )
      //act
      const transactionResponse = await fundMe.withdraw()
      const transactionReceipt = await transactionResponse.wait(1)
      const { gesUsed, effectiveGasPrice } = transactionReceipt
      const gasCost = gasUsed.mul(effectiveGasPrice)

      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      )

      const endingDeployerBalance = await fundMe.provider.getBalance(
        deployer
      )

      //assert
      assert.equal(endingFundMebalacne, 0)
      assert.equal(startingFundMeBalance.add(startingDeployerBalacne), endingDeployerBalance.add(gasCost).toString())
    })

    it("allows us to withdraw with multiple funders", async function () {
      const accounts = await ethers.getSigners()
      for (let i = 1; i < 6; i++) {
        const fundMeConnectedContract = await fundMe.connect(
          accounts[i]
        )
        await fundMeConnectedContract.fund({ value: sendValue })
      }
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      )
      const startingDeployerBalacne = await fundMe.provider.getBalance(
        deployer
      )

      const transactionResponse = await fundMe.withdraw()
      const transactionReceipt = await transactionResponse.wait(1)
      const { gasUsed, effectiveGasPrice } = transactionReceipt
      const gasCost = gasUsed.mul(effectiveGasPrice)


      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      )

      const endingDeployerBalance = await fundMe.provider.getBalance(
        deployer
      )

      //assert
      assert.equal(endingFundMebalacne, 0)
      assert.equal(
        startingFundMeBalance.add(startingDeployerBalacne.toString(),
          endingDeployerBalance.add(gasCost).toString()
        ))

      await expect(fundMe.funders(0)).to.be.reverted

      for (i = 1; i < 6; i++) {
        assert.equal(await fundMe.addressToAmountFunded(accounts[i].address), 0)
      }

    })

    it("only allows the owner to withdraw", async function () {
      const accounts = await ethers.getSigners()
      const attacker = accounts[i]
      const attackerConnectedContract = await fundMe.connect(
        attacker
      )
      await expect(attackerConnectedContract.withdraw()).to.be.revertedWith("FundMe__NotOwner")
    })
  })



})
