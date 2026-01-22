# DeFi Staking Farm

A professional, flat-structure implementation of a DeFi Yield Farming protocol. Users can stake a specific ERC-20 token (LP Token or Stablecoin) and earn reward tokens based on the duration of their stake.

## Features

- **Staking:** Users lock tokens to start earning rewards.
- **Yield Farming:** Rewards accrue per second based on a fixed rate.
- **Security:** Implements `ReentrancyGuard` to prevent attack vectors.
- **Admin Controls:** Owner can adjust reward rates (with safeguards).
- **View Functions:** Check earned rewards in real-time.

## Prerequisites

- Node.js & NPM
- Hardhat

## Quick Start

1. **Install:**
   ```bash
   npm install
