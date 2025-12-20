const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      productId: { type: String, required: true }, // Assuming product IDs are strings for now
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  subtotal: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
    default: '',
  },
  attachmentCid: {
    type: String,
    required: false, // Optional if no image uploaded
  },
  ipfsHash: { // CID of the order details JSON stored on Pinata
    type: String,
    required: true,
  },
  txHash: { // Transaction hash from the blockchain
    type: String,
    required: true,
    unique: true,
  },
  chainId: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'failed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', OrderSchema);
