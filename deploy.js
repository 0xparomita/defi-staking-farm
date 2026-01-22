const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // 1. Deploy Reward Token
  const RewardToken = await hre.ethers.getContractFactory("RewardToken");
  const rewardToken = await RewardToken.deploy(deployer.address);
  await rewardToken.waitForDeployment();
  console.log("RewardToken deployed to:", rewardToken.target);

  // 2. Deploy a Mock Staking Token (usually USDC or LP, but using RewardToken logic for demo)
  const MockStaking = await hre.ethers.getContractFactory("RewardToken");
  const stakingToken = await MockStaking.deploy(deployer.address);
  await stakingToken.waitForDeployment();
  console.log("MockStakingToken deployed to:", stakingToken.target);

  // 3. Deploy Farm
  const StakingFarm = await hre.ethers.getContractFactory("StakingFarm");
  const farm = await StakingFarm.deploy(stakingToken.target, rewardToken.target, deployer.address);
  await farm.waitForDeployment();
  console.log("StakingFarm deployed to:", farm.target);

  // 4. Transfer ownership of RewardToken to Farm so it can mint rewards
  await rewardToken.transferOwnership(farm.target);
  console.log("RewardToken ownership transferred to Farm");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
