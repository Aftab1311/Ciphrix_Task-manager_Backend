require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

(async function() {
  await connectDB();
  const email = process.env.ADMIN_EMAIL;
  if(!email) return console.log('Set ADMIN_EMAIL in .env');
  const existing = await User.findOne({ email });
  if(existing) return console.log('Admin exists');
  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  const admin = new User({ name: 'Admin', email, password: hashed, role: 'admin' });
  await admin.save();
  console.log('Admin created'); process.exit(0);
})();
