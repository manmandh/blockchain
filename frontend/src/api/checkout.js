import Web3 from "web3";
import { getFoodCommerceContract } from "../utils/web3";
import { uploadJSONToIPFS } from "./ipfs";
import api from "./axios";

export async function submitCheckout({
  cart,
  customerAddress,
  notes,
  attachmentCid,
}) {
  if (!cart?.items?.length) {
    throw new Error("Your cart is empty");
  }

  const contract = await getFoodCommerceContract();

  const orderPayload = {
    customer: customerAddress,
    items: cart.items,
    subtotal: cart.subtotal,
    notes,
    attachmentCid,
    createdAt: new Date().toISOString(),
  };

  // 1. Pin order details to IPFS (Pinata)
  const ipfsHash = await uploadJSONToIPFS(orderPayload);

  const totalWei = Web3.utils.toWei(
    cart.subtotal.toString(),
    "ether"
  );

  // 2. Call smart contract to create order
  const tx = await contract.methods
    .createOrder(customerAddress, totalWei, ipfsHash)
    .send({ from: customerAddress });

  // 3. Get chainId from ethereum provider
  let chainId = null;
  try {
    if (window.ethereum) {
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      chainId = parseInt(chainIdHex, 16); // Convert hex to decimal
    }
  } catch (err) {
    console.warn('Failed to get chainId:', err);
  }

  // 4. Call backend API to save Order and Transaction to MongoDB
  try {
    console.log('Calling backend API /orders/checkout with data:', {
      items: cart.items.map(item => ({
        productId: item.id || item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal: cart.subtotal,
      notes,
      attachmentCid,
      txHash: tx.transactionHash,
      chainId: chainId || null,
      totalWei: totalWei.toString(),
      ipfsHash: ipfsHash,
    });

    const backendResponse = await api.post('/orders/checkout', {
      items: cart.items.map(item => ({
        productId: item.id || item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal: cart.subtotal,
      notes,
      attachmentCid,
      txHash: tx.transactionHash,
      chainId: chainId || null,
      totalWei: totalWei.toString(),
      ipfsHash: ipfsHash, // Send frontend IPFS hash (backend will pin again with complete info)
    });

    return {
      ipfsHash,
      transactionHash: tx.transactionHash,
      events: tx.events,
      order: backendResponse.data.order,
      transaction: backendResponse.data.transaction,
    };
  } catch (err) {
    // If backend save fails, still return the blockchain transaction info
    // but log the error
    console.error('Failed to save order to backend:', {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      message: err.message,
      url: err.config?.url,
      baseURL: err.config?.baseURL,
    });
    throw new Error(`Order created on blockchain but failed to save to database: ${err.response?.data?.msg || err.message}`);
  }
}
