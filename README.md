# BlockBazzar - Online Crypto NFT Marketplace

BlockBazzar is an online crypto NFT marketplace built using Truffle, npm, and React.js. This platform allows users to buy, sell, and trade digital assets in the form of Non-Fungible Tokens (NFTs) securely and efficiently.

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [MetaMask](#MetaMask)
5. [Usage](#usage)
6. [License](#license)

## Features

- Create and manage NFT collections.
- Mint new NFTs.
- Buy and sell NFTs securely.
- User-friendly React.js frontend.
- Integration with Ethereum using Truffle.
- Secure authentication and authorization.
- User profiles and transaction history.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed.
- Truffle framework installed globally.
- A running Ethereum node or a service like Infura.
- A compatible Ethereum wallet (e.g., MetaMask) with test ETH.
- Git for cloning the repository.

## Installation

1. Clone the BlockBazzar repository to your local machine:

   ```bash
   git clone https://github.com/vatsalm30/BlockBazzar.git
2. Navigate to the project directory:
   ```bash
   cd BlockBazzar
3. Install the required npm packages for the frontend and the Truffle project:
   ```bash
   npm install
   cd client
   npm install
4. Configure your Ethereum network and wallet settings in "truffle-config.js"
5. Migrate the smart contracts to the Ethereum network:
   ```bash
   truffle migrate --network yourNetworkName
6. Start the React.js development server:
   ```bash
   cd client
   npm start


## MetaMask


1. Run Ganache local blockchauin on port 7545
   
2. Instal Metamask on Chrome
   
3. Go to drop down in upper left side corner
   
4. Enable test networks

5. Scroll all the way down to add a network

6. Click on add a network manually

7. Set Network Name to 'Ganache'

8. Set RPC URL to 'HTTP://127.0.0.1:7545'

9. Set chain id to '1337'

10. Set currencey symbol to 'ETH'

   
## Usage

   
1. Access the BlockBazzar frontend at http://localhost:3000.

2. Create an account and log in using your Ethereum wallet.

3. Create your NFT collections and mint NFTs.

4. Browse, buy, and sell NFTs securely on the platform.

## License

This project is under an All Rights Reserved Liscence. See the License file for details.
