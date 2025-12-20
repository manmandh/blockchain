# Food Commerce DApp - Blockchain-based Food Delivery

This project is a comprehensive decentralized food commerce application (DApp) that integrates a React frontend, a Node.js/Express backend with MongoDB, and blockchain/IPFS for enhanced transparency and data integrity.

## Table of Contents

1.  [Features](#features)
2.  [Technologies Used](#technologies-used)
3.  [Project Structure](#project-structure)
4.  [System Requirements](#system-requirements)
5.  [Setup & Installation Guide](#setup--installation-guide)
    *   [1. Backend Setup](#1-backend-setup)
    *   [2. Frontend Setup](#2-frontend-setup)
    *   [3. Smart Contract Deployment (Hardhat)](#3-smart-contract-deployment-hardhat)
6.  [Testing API Endpoints](#testing-api-endpoints)
7.  [Key Features & Functionalities](#key-features--functionalities)
8.  [Access the Application](#access-the-application)

## Features

*   **User Authentication:** Register and login users with JWT for secure access.
*   **MetaMask Integration:** Connects user's MetaMask wallet to their account automatically upon successful login.
*   **Backend with MongoDB:** Stores user data, order history, and transaction records.
*   **Admin Interface:** A dedicated dashboard for administrators to:
    *   View and manage user accounts.
    *   View and manage orders.
    *   View transaction history, with details stored securely on Pinata (IPFS).
*   **IPFS/Pinata Integration:** Order details and transaction history are stored on Pinata for decentralized and immutable record-keeping. The Admin interface can retrieve and display this data.
*   **Smart Contract Interaction:** Utilizes Web3.js to interact with a simple Solidity smart contract for on-chain order receipts.
*   **Responsive UI:** Modern, responsive design using React and TailwindCSS.
*   **Light/Dark Mode:** Theme toggle functionality.

## Technologies Used

### Frontend
*   **Framework:** React (with Vite)
*   **Styling:** TailwindCSS
*   **Routing:** React Router DOM
*   **API Calls:** Axios
*   **State Management:** React Context (AuthContext, WalletContext, CartContext)
*   **Web3 Integration:** Web3.js (for MetaMask interaction)

### Backend
*   **Runtime:** Node.js
*   **Web Framework:** Express.js
*   **Database:** MongoDB (with Mongoose ODM)
*   **Authentication:** JWT (JSON Web Tokens), Bcryptjs (password hashing)
*   **CORS:** Cross-Origin Resource Sharing middleware
*   **IPFS Storage:** Pinata API (via Axios for backend-mediated pinning)
*   **Environment Variables:** Dotenv

### Blockchain
*   **Smart Contract Language:** Solidity
*   **Development Environment:** Hardhat
*   **Wallet Integration:** MetaMask

## Project Structure

```
.
├── backend/                  # Node.js/Express Backend
│   ├── config/               # Database connection
│   ├── middleware/           # Auth & Admin Auth middleware
│   ├── models/               # Mongoose schemas (User, Order, Transaction)
│   ├── routes/               # API routes (auth, admin, orders)
│   ├── utils/                # IPFS Pinata utility functions
│   ├── .env.example          # Example environment variables
│   ├── package.json          # Backend dependencies
│   └── server.js             # Main backend server file
├── contracts/                # Solidity smart contracts
├── frontend/                 # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/              # Frontend API service functions
│   │   ├── assets/
│   │   ├── components/       # Reusable React components (Navbar, WalletButton)
│   │   ├── context/          # React Contexts (AuthContext, WalletContext, CartProvider)
│   │   ├── data/             # Mock data (e.g., products.js)
│   │   ├── hooks/            # Custom React hooks (e.g., useWallet)
│   │   ├── pages/            # React pages (Home, Menu, ProductDetail, Cart, Checkout, Register, Login, AdminDashboard)
│   │   │   └── admin/        # Admin specific pages (AdminUsers, AdminOrders, AdminTransactions)
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx           # Main application component & routes
│   │   └── main.jsx          # Entry point of the React application
│   ├── .env.example          # Example environment variables
│   ├── package.json          # Frontend dependencies
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js        # Vite configuration (including API proxy)
├── scripts/                  # Hardhat deployment scripts
├── test/                     # Smart contract tests
├── hardhat.config.js         # Hardhat configuration
└── README.md
```

## System Requirements

*   Node.js (LTS version recommended)
*   npm (Node Package Manager)
*   MongoDB (Community Edition)
*   MetaMask browser extension

## Setup & Installation Guide

Follow these steps to set up and run the Food Commerce DApp locally.

### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **MongoDB Installation & Configuration:**
    *   **On macOS (using Homebrew):**
        ```bash
        brew tap mongodb/brew
        brew install mongodb-community@6.0 # Or the latest stable version like @8.0
        ```
        *Note: If `mongodb-community@6.0` is not found, Homebrew will suggest available versions like `mongodb-community@8.0` or `mongodb-community@7.0`. Use the suggested version.*
    *   **Start MongoDB Service:**
        ```bash
        brew services start mongodb-community@6.0 # Or your installed version
        ```
    *   **For other OS or detailed instructions, refer to the [MongoDB Documentation](https://docs.mongodb.com/manual/installation/).**

4.  **Create `.env` file:**
    *   In the `backend/` directory, create a file named `.env`.
    *   Add the following environment variables (replace placeholders with your actual values):
        ```env
        MONGO_URI=mongodb://localhost:27017/foodcommerce
        JWT_SECRET=your_jwt_secret_key_here
        PINATA_API_KEY=your_pinata_api_key
        PINATA_SECRET_API_KEY=your_pinata_secret_api_key
        PORT=5001
        ```
        *   `MONGO_URI`: Your MongoDB connection string. For local setup, `mongodb://localhost:27017/foodcommerce` is standard.
        *   `JWT_SECRET`: A strong, random string for JWT signing.
        *   `PINATA_API_KEY` & `PINATA_SECRET_API_KEY`: Obtain these from your [Pinata Cloud dashboard](https://app.pinata.cloud/).
        *   `PORT`: The port your backend will run on. We are using `5001`.

5.  **Run the Backend Server:**
    ```bash
    npm start
    ```
    You should see messages like "MongoDB Connected..." and "Server running on port 5001".

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure API Proxy (Vite):**
    *   Ensure `frontend/vite.config.js` is configured to proxy API requests to the backend:
        ```javascript
        import { defineConfig } from 'vite'
        import react from '@vitejs/plugin-react'

        export default defineConfig({
          plugins: [react()],
          server: {
            port: 5173,
            proxy: {
              '/api': {
                target: 'http://localhost:5001', // Ensure this matches your backend port
                changeOrigin: true,
                secure: false,
              }
            }
          }
        })
        ```
    *   **Important:** All API calls from the frontend should use relative paths like `/api/auth/register`, `/api/admin/users`, etc., to leverage this proxy.

4.  **Create Environment Variables (`frontend/.env` - Optional for contract address if not deploying):**
    *   In the `frontend/` directory, create a file named `.env`.
    *   Add the following (if you are deploying a smart contract):
        ```env
        VITE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
        ```
        *   `VITE_CONTRACT_ADDRESS`: The address of your deployed Solidity smart contract.

5.  **Run the Frontend Development Server:**
    ```bash
    npm run dev
    ```
    This will start the React app, usually accessible at `http://localhost:5173`.

### 3. Smart Contract Deployment (Hardhat)

1.  **Navigate to the root directory of the project (where `hardhat.config.js` is located):**
    ```bash
    cd .. # if you are in frontend or backend directory
    ```
2.  **Install Hardhat (if not already installed):**
    ```bash
    npm install --save-dev hardhat
    npx hardhat
    ```
3.  **Compile Contracts:**
    ```bash
    npx hardhat compile
    ```
4.  **Run Local Hardhat Network:**
    ```bash
    npx hardhat node
    ```
    Leave this terminal running.
5.  **Deploy Contract:**
    *   Open a **new terminal** and navigate to the project root.
    *   Run:
        ```bash
        npx hardhat run scripts/deploy.js --network localhost
        ```
    *   The contract address will be printed to the console. Copy this address and update `VITE_CONTRACT_ADDRESS` in your `frontend/.env` file.

## Testing API Endpoints

You can use **Thunder Client** (VS Code extension)to test the backend API endpoints. Ensure your backend server is running on `http://localhost:5001`.

### Authentication
*   **Register User:**
    *   `POST` `http://localhost:5001/api/auth/register`
    *   **Body (JSON):**
        ```json
        {
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123"
        }
        ```
*   **Login User:**
    *   `POST` `http://localhost:5001/api/auth/login`
    *   **Body (JSON):**
        ```json
        {
            "email": "test@example.com",
            "password": "password123"
        }
        ```
    *   **Result:** You will get a `token` in the response. Copy this token.
*   **Get Current User Info:**
    *   `GET` `http://localhost:5001/api/auth/user`
    *   **Headers:**
        *   `x-auth-token`: `[YOUR_JWT_TOKEN]` (Paste the token from login)
*   **Connect MetaMask Account:**
    *   `PUT` `http://localhost:5001/api/auth/connect-metamask`
    *   **Headers:**
        *   `x-auth-token`: `[YOUR_JWT_TOKEN]`
    *   **Body (JSON):**
        ```json
        {
            "metamaskAccount": "0xYourMetamaskAddress"
        }
        ```

### Admin Panel (Requires `admin` role for the user)
*   **Get All Users:**
    *   `GET` `http://localhost:5001/api/admin/users`
    *   **Headers:** `x-auth-token`: `[YOUR_ADMIN_JWT_TOKEN]`
*   **Get All Orders:**
    *   `GET` `http://localhost:5001/api/admin/orders`
    *   **Headers:** `x-auth-token`: `[YOUR_ADMIN_JWT_TOKEN]`
*   **Get All Transactions:**
    *   `GET` `http://localhost:5001/api/admin/transactions`
    *   **Headers:** `x-auth-token`: `[YOUR_ADMIN_JWT_TOKEN]`
*   **Get IPFS Content by Hash:**
    *   `GET` `http://localhost:5001/api/admin/ipfs/:ipfsHash` (Replace `:ipfsHash` with an actual IPFS hash from a transaction)
    *   **Headers:** `x-auth-token`: `[YOUR_ADMIN_JWT_TOKEN]`
*   **Delete User:**
    *   `DELETE` `http://localhost:5001/api/admin/users/:userId` (Replace `:userId` with an actual user ID)
    *   **Headers:** `x-auth-token`: `[YOUR_ADMIN_JWT_TOKEN]`

## Key Features & Functionalities

*   **User Registration & Login:** Secure user accounts with JWT.
*   **Automatic MetaMask Connection:** Seamlessly links user's MetaMask wallet to their authenticated session.
*   **Admin Dashboard:** Comprehensive tools for managing users, orders, and viewing decentralized transaction history.
*   **Pinata IPFS Integration:** Utilizes Pinata for robust and scalable decentralized storage of order details and transaction proofs.
*   **Decentralized Order Tracking:** Minimal order receipts stored on a Solidity smart contract, referencing detailed data on IPFS.
*   **Real-time Feedback:** Toast notifications for blockchain events.
*   **Theming:** User-friendly light/dark mode.

## Access the Application

Once both the backend and frontend servers are running, open your web browser and navigate to:

```
http://localhost:5173
```
You can now register, log in, connect your MetaMask wallet, browse food items, add them to your cart, and proceed to checkout. Administrators can access the `/admin` route after logging in with an admin account.
