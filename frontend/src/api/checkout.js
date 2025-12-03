import { getFoodCommerceContract, getWeb3 } from "../utils/web3";
import { uploadJSONToIPFS } from "./ipfs";

export async function submitCheckout({
  cart,
  customerAddress,
  notes,
  attachmentCid,
}) {
  if (!cart?.items?.length) {
    throw new Error("Your cart is empty");
  }

  const web3 = getWeb3();
  const contract = getFoodCommerceContract(web3);

  const orderPayload = {
    customer: customerAddress,
    items: cart.items,
    subtotal: cart.subtotal,
    notes,
    attachmentCid,
    createdAt: new Date().toISOString(),
  };

  const ipfsHash = await uploadJSONToIPFS(orderPayload);
  const totalWei = web3.utils.toWei(cart.subtotal.toString(), "ether");

  const tx = await contract.methods
    .createOrder(customerAddress, totalWei, ipfsHash)
    .send({ from: customerAddress });

  return {
    ipfsHash,
    transactionHash: tx.transactionHash,
    events: tx.events,
  };
}

