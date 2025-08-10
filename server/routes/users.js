// server/routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');

// @route   GET api/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
   res.status(500).send('Server error');
  }
});

module.exports = router;