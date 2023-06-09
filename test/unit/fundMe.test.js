const {deployments, getNamedAccounts, ethers} = require("hardhat")
const {assert , expect } = require("chai") 
describe("fundMe",async ()=> {
    let fundMe
    let mockV3Aggregator
    let deployer
    const sendValue = ethers.utils.parseEther("1")
    beforeEach(async ()=>{
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe",deployer);
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator",deployer)
    })
    describe("constructor",async ()=>{
        it("sets aggregator addresses correctly" ,async ()=>{
            const response = await fundMe.priceFeed();
            assert.equal(response, mockV3Aggregator.address)
        })
    })
    describe("Fund",async ()=>{
        // it("Fails if u don't send enough ETH", async ()=>{
        //     await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!");
        // })
        it("Updated Amount funded data structure",async ()=>{
            await fundMe.fund({value: sendValue})
            const response = await fundMe.addressToAmountFunded(deployer)
            assert.equal(response.toString(),sendValue.toString());

        })
        it("Adds funder to array of funders", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.funders(0)
            assert.equal(response, deployer)
        })
    })
    // describe("withdraw", function () {
    //     beforeEach(async () => {
    //         await fundMe.fund({ value: sendValue })
    //     })
    //     it("withdraws ETH from a single funder", async () => {
    //         // Arrange
    //         const startingFundMeBalance =
    //             await fundMe.provider.getBalance(fundMe.address)
    //         const startingDeployerBalance =
    //             await fundMe.provider.getBalance(deployer)

    //         // Act
    //         const transactionResponse = await fundMe.withdraw()
    //         const transactionReceipt = await transactionResponse.wait()
    //         const { gasUsed, effectiveGasPrice } = transactionReceipt
    //         const gasCost = gasUsed.mul(effectiveGasPrice)

    //         const endingFundMeBalance = await fundMe.provider.getBalance(
    //             fundMe.address
    //         )
    //         const endingDeployerBalance =
    //             await fundMe.provider.getBalance(deployer)

    //         // Assert
    //         // Maybe clean up to understand the testing
    //         assert.equal(endingFundMeBalance, 0)
    //         assert.equal(
    //             startingFundMeBalance
    //                 .add(startingDeployerBalance)
    //                 .toString(),
    //             endingDeployerBalance.add(gasCost).toString()
    //         )
    //     })
    //     // this test is overloaded. Ideally we'd split it into multiple tests
    //     // but for simplicity we left it as one
    //     it("is allows us to withdraw with multiple funders", async () => {
    //         // Arrange
    //         const accounts = await ethers.getSigners()
    //         for (i = 1; i < 6; i++) {
    //             const fundMeConnectedContract = await fundMe.connect(
    //                 accounts[i]
    //             )
    //             await fundMeConnectedContract.fund({ value: sendValue })
    //         }
    //         const startingFundMeBalance =
    //             await fundMe.provider.getBalance(fundMe.address)
    //         const startingDeployerBalance =
    //             await fundMe.provider.getBalance(deployer)

    //         // Act
    //         const transactionResponse = await fundMe.withdraw()
    //         // Let's comapre gas costs :)
    //         // const transactionResponse = await fundMe.withdraw()
    //         const transactionReceipt = await transactionResponse.wait()
    //         const { gasUsed, effectiveGasPrice } = transactionReceipt
    //         const withdrawGasCost = gasUsed.mul(effectiveGasPrice)
    //         console.log(`GasCost: ${withdrawGasCost}`)
    //         console.log(`GasUsed: ${gasUsed}`)
    //         console.log(`GasPrice: ${effectiveGasPrice}`)
    //         const endingFundMeBalance = await fundMe.provider.getBalance(
    //             fundMe.address
    //         )
    //         const endingDeployerBalance =
    //             await fundMe.provider.getBalance(deployer)
    //         // Assert
    //         assert.equal(
    //             startingFundMeBalance
    //                 .add(startingDeployerBalance)
    //                 .toString(),
    //             endingDeployerBalance.add(withdrawGasCost).toString()
    //         )
    //         // Make a getter for storage variables
    //         await expect(fundMe.funders(0)).to.be.reverted

    //         for (i = 1; i < 6; i++) {
    //             assert.equal(
    //                 await fundMe.getAddressToAmountFunded(
    //                     accounts[i].address
    //                 ),
    //                 0
    //             )
    //         }
    //     })
    // })
});