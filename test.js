const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StakingFarm", function () {
  it("Should stake and accumulate rewards", async function () {
    const [owner, user] = await ethers.getSigners();
    
    // Deploy Contracts
    const RewardToken = await ethers.getContractFactory("RewardToken");
    const rToken = await RewardToken.deploy(owner.address);
    const sToken = await RewardToken.deploy(owner.address); // Using same logic for mock
    
    const Farm = await ethers.getContractFactory("StakingFarm");
    const farm = await Farm.deploy(sToken.target, rToken.target, owner.address);

    // Setup: Give reward token rights to farm, give user staking tokens
    await rToken.transferOwnership(farm.target);
    await sToken.mint(user.address, ethers.parseEther("100"));

    // User approves and stakes
    await sToken.connect(user).approve(farm.target, ethers.parseEther("100"));
    await farm.connect(user).stake(ethers.parseEther("100"));

    expect(await farm.stakingBalance(user.address)).to.equal(ethers.parseEther("100"));

    // Simulate time passing (100 seconds)
    await ethers.provider.send("evm_increaseTime", [100]); 
    await ethers.provider.send("evm_mine");

    // Withdraw
    await farm.connect(user).withdraw();
    
    // User should have original stake + rewards
    const userBal = await sToken.balanceOf(user.address);
    expect(userBal).to.equal(ethers.parseEther("100"));
    
    const rewardBal = await rToken.balanceOf(user.address);
    expect(rewardBal).to.be.gt(0);
  });
});
