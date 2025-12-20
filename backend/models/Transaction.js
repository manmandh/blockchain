const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  txHash: {
    type: String,
    required: true,
    unique: true,
  },
  ipfsHash: { // CID of the order details JSON stored on Pinata, same as Order.ipfsHash
    type: String,
    required: true,
  },
  totalWei: {
    type: String, // Store as string to handle large BigInt values from Web3
    required: true,
  },
  blockNumber: {
    type: Number,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
