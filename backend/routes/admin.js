const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const { getFileFromIPFS } = require('../utils/ipfs');

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/users/:id/orders
// @desc    Get all orders for a specific user (Admin only)
// @access  Private (Admin only)
router.get('/users/:id/orders', auth, adminAuth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id }).populate('userId', 'username email metamaskAccount');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Private (Admin only)
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Optionally, delete related orders and transactions here if desired
    await Order.deleteMany({ userId: req.params.id });
    await Transaction.deleteMany({ userId: req.params.id });

    await User.deleteOne({ _id: req.params.id });
    res.json({ msg: 'User and associated data removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders
// @access  Private (Admin only)
router.get('/orders', auth, adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', ['username', 'email', 'metamaskAccount']);
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/transactions
// @desc    Get all transactions
// @access  Private (Admin only)
router.get('/transactions', auth, adminAuth, async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('userId', ['username', 'email', 'metamaskAccount']).populate('orderId');
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/ipfs/:ipfsHash
// @desc    Get content from IPFS by hash
// @access  Private (Admin only)
router.get('/ipfs/:ipfsHash', auth, adminAuth, async (req, res) => {
  try {
    const ipfsContent = await getFileFromIPFS(req.params.ipfsHash);
    res.json({ content: ipfsContent });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
