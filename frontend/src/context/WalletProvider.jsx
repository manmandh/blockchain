import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Web3 from "web3";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      const w3 = new Web3(window.ethereum);
      setWeb3(w3);

      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0] ?? null);
      });

      window.ethereum.on("chainChanged", (id) => {
        setChainId(id);
      });
    }
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      const networkId = await window.ethereum.request({
        method: "eth_chainId",
      });
      setChainId(networkId);
    } finally {
      setIsConnecting(false);
    }
  };

  const switchWallet = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }
    await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [{ eth_accounts: {} }],
    });
    await connectWallet();
  };

  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
  };

  const shortAddress = useMemo(() => {
    if (!account) return "";
    return `${account.slice(0, 6)}...${account.slice(-4)}`;
  }, [account]);

  const value = useMemo(
    () => ({
      account,
      chainId,
      web3,
      isConnecting,
      connectWallet,
      switchWallet,
      disconnectWallet,
      shortAddress,
      isConnected: Boolean(account),
    }),
    [account, chainId, web3, isConnecting, shortAddress]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within WalletProvider");
  }
  return context;
}

