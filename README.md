# Food Commerce DApp

This project is a decentralized food commerce web application built with React, TailwindCSS, Web3.js, and IPFS.

## Features

- Home page showing featured food items
- Menu page
- Product detail page
- Shopping cart (add/remove/update)
- Checkout page
- Connect Crypto Wallet (MetaMask)
- Store order data + uploaded images on IPFS
- Generate IPFS CID and show it on UI
- Save on-chain a minimal order receipt (customer wallet + cart total + IPFS CID)
- Web3.js to interact with a simple Solidity smart contract
- WalletConnect or MetaMask login button
- Light/dark mode

## Smart Contract

- `createOrder(address customer, uint total, string memory ipfsHash)`: Creates a new order on the blockchain.
- `getOrders()`: Retrieves all orders from the blockchain.
- Deployed on local Hardhat or Ganache network.
- Emits events for transactions.

## Frontend

- **Framework:** React + Vite
- **Styling:** TailwindCSS
- **Web3 Integration:** Web3.js
- **IPFS Storage:** web3.storage (or Pinata)
- **Components:** Navbar, Footer, ProductCard, CartDrawer, WalletButton
- **Hooks:** useCart, useWallet, useIPFS
- **API Services:**
    - Upload image/file to IPFS
    - Read product list (mock JSON)
    - Submit checkout to IPFS and smart contract
- **UI/UX:** Modern, responsive design with rounded corners, soft shadows, orange + green color theme, and smooth animations.

## Project Structure

```
.
├── public/
├── src/
│   ├── api/             # API service functions (IPFS, product, checkout)
│   ├── assets/          # Images, icons, etc.
│   ├── components/      # Reusable React components
│   ├── hooks/           # Custom React hooks (useCart, useWallet, useIPFS)
│   ├── pages/           # React pages (Home, Menu, ProductDetail, Cart, Checkout)
│   ├── styles/          # TailwindCSS configuration and custom styles
│   ├── utils/           # Utility functions (web3.js config, helpers)
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Entry point of the React application
├── contracts/           # Solidity smart contracts
├── scripts/             # Hardhat deployment scripts
├── test/                # Smart contract tests
├── hardhat.config.js    # Hardhat configuration
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Deployment Guide

### 1. Smart Contract Deployment (Hardhat)

1. **Install Hardhat:**
   ```bash
   npm install --save-dev hardhat
   npx hardhat
   ```
2. **Compile Contracts:**
   ```bash
   npx hardhat compile
   ```
3. **Run Local Hardhat Network:**
   ```bash
   npx hardhat node
   ```
4. **Deploy Contract:**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

### 2. Frontend Setup

1. **Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Create Environment Variables (`frontend/.env`):**
   ```
   VITE_PINATA_JWT=eyJhbGciOiJI...
   VITE_CONTRACT_ADDRESS=0xYourDeployedContract
   ```
   - Generate a Pinata JWT (Dashboard → API Keys → Create key with pinFile/pinJSON scopes) and paste it into `VITE_PINATA_JWT`.
   - The contract address comes from the Hardhat deployment step.
3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   The app uses Vite, so it will be available on http://localhost:5173 by default.

4. **Build for Production:**
   ```bash
   npm run build && npm run preview
   ```

### 3. Features Recap
- Responsive React + Vite + Tailwind UI with orange/green food aesthetic.
- Global cart state via context + `useCart` hook.
- Wallet connection (MetaMask) with `useWallet` hook and Web3.js contract calls.
- Image + order payload uploads to IPFS via Pinata (JWT protected) through `useIPFS`.
- Checkout flow pushes receipts on-chain (`createOrder`) and surfaces IPFS CID + tx hash.
- Real-time toast when `OrderCreated` event fires.
- Light/Dark theme toggle stored in localStorage.
- Components: Navbar, Footer, ProductCard, CartDrawer, WalletButton.

### 3. Access the Application

- Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).
