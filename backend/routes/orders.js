const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { addFileToIPFS } = require('../utils/ipfs');

// @route   POST /api/orders/checkout
// @desc    Process checkout: pin order details to Pinata, record order and transaction in DB
// @access  Private
router.post('/checkout', auth, async (req, res) => {
  console.log('POST /api/orders/checkout called');
  console.log('Request body:', req.body);
  console.log('User from auth middleware:', req.user);

  const {
    items, // array of { productId, name, price, quantity }
    subtotal,
    notes,
    attachmentCid, // optional CID if user uploaded an image
    txHash,        // transaction hash from smart contract
    chainId,       // blockchain network ID
    totalWei,      // total amount in wei from the transaction
    ipfsHash: frontendIpfsHash // IPFS hash from frontend (optional, if frontend already pinned)
  } = req.body;

  try {
    // 1. Validate user has a connected MetaMask account
    const user = await User.findById(req.user.id);
    if (!user || !user.metamaskAccount) {
      return res.status(400).json({ msg: 'MetaMask account not connected to user' });
    }

    // 2. Prepare order details for IPFS (with complete info including txHash and chainId)
    const orderDetails = {
      userId: req.user.id,
      metamaskAccount: user.metamaskAccount,
      items,
      subtotal,
      notes,
      attachmentCid,
      txHash,
      chainId,
      createdAt: new Date(),
    };

    // 3. Pin order details JSON to Pinata IPFS (with complete transaction info)
    // If frontend already pinned, we still pin again with complete info (txHash, chainId)
    const ipfsHash = await addFileToIPFS(orderDetails);

    // 4. Create Order document in MongoDB
    const newOrder = new Order({
      userId: req.user.id,
      items,
      subtotal,
      notes,
      attachmentCid,
      ipfsHash,
      txHash,
      chainId,
      status: 'completed', // Assuming it's completed once txHash is received
    });
    const order = await newOrder.save();

    // 5. Create Transaction document in MongoDB
    const newTransaction = new Transaction({
      userId: req.user.id,
      orderId: order._id,
      txHash,
      ipfsHash,
      totalWei,
      // blockNumber could be added if retrieved from transaction receipt on frontend
    });
    const transaction = await newTransaction.save();

    console.log('Order and Transaction saved successfully');
    res.json({ msg: 'Order processed successfully', order, transaction, ipfsHash });
  } catch (err) {
    console.error('Error in /api/orders/checkout:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ msg: 'Server Error', error: err.message });
  }
});

// @route   GET /api/orders/my
// @desc    Get all orders for the current logged-in user
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('userId', 'username email metamaskAccount');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
