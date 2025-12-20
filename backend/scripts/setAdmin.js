const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

// Set user role to admin
const setAdmin = async () => {
  // Get email from command line argument
  const email = process.argv[2];

  if (!email) {
    console.error('Please provide user email as argument');
    console.log('Usage: node scripts/setAdmin.js <user-email>');
    console.log('Example: node scripts/setAdmin.js admin@example.com');
    process.exit(1);
  }

  try {
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.error(`User with email "${email}" not found`);
      process.exit(1);
    }

    // Update role to admin
    user.role = 'admin';
    await user.save();
    console.log('Successfully set user as admin!');
    console.log('User details:');
    console.log(`  - Username: ${user.username}`);
    console.log(`  - Email: ${user.email}`);
    console.log(`  - Role: ${user.role}`);
    console.log(`  - Metamask Account: ${user.metamaskAccount || 'Not connected'}`);

    // Close connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the script
setAdmin();

