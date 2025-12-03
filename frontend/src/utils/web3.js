import Web3 from "web3";
import FoodCommerceArtifact from "../contracts/FoodCommerce.json";

export function getWeb3() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not available");
  }
  return new Web3(window.ethereum);
}

export function getFoodCommerceContract(web3Instance) {
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("Missing VITE_CONTRACT_ADDRESS environment variable");
  }

  const web3 = web3Instance ?? getWeb3();
  return new web3.eth.Contract(FoodCommerceArtifact.abi, contractAddress);
}

