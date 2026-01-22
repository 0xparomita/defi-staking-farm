// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardToken is ERC20, Ownable {
    constructor(address initialOwner) ERC20("Farm Reward", "FRM") Ownable(initialOwner) {}

    // Only the Farm contract should be allowed to mint
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
