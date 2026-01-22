// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./RewardToken.sol";

contract StakingFarm is Ownable, ReentrancyGuard {
    IERC20 public stakingToken;
    RewardToken public rewardToken;

    // Rewards per second per token staked (Simplified model)
    uint256 public rewardRate = 100; 

    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public startTime;
    mapping(address => uint256) public rewards;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    constructor(address _stakingToken, address _rewardToken, address initialOwner) 
        Ownable(initialOwner) 
    {
        stakingToken = IERC20(_stakingToken);
        rewardToken = RewardToken(_rewardToken);
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        
        updateReward(msg.sender);
        
        stakingToken.transferFrom(msg.sender, address(this), amount);
        stakingBalance[msg.sender] += amount;
        startTime[msg.sender] = block.timestamp;
        
        emit Staked(msg.sender, amount);
    }

    function withdraw() external nonReentrant {
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, "Staking balance is 0");
        
        updateReward(msg.sender);
        
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardToken.mint(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }

        stakingBalance[msg.sender] = 0;
        stakingToken.transfer(msg.sender, balance);
        
        emit Withdrawn(msg.sender, balance);
    }

    function calculateReward(address user) public view returns (uint256) {
        uint256 duration = block.timestamp - startTime[user];
        return (stakingBalance[user] * duration * rewardRate) / 1e18;
    }

    function updateReward(address user) internal {
        if (stakingBalance[user] > 0) {
            rewards[user] += calculateReward(user);
            startTime[user] = block.timestamp;
        }
    }
}
