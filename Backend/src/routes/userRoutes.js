import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import User from '../models/User.js'; // Import the User model

const router = express.Router();

// @route   GET /api/users/me
// @desc    Get current logged-in user's profile
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // req.user.id is set by the authMiddleware
    // .select('-password') removes the password hash from the returned object
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   PUT /api/users/profile
// @desc    Update user profile (e.g., add phone number)
// @access  Private
router.put('/profile', authMiddleware, async (req, res) => {
  const { phone } = req.body;

  // Build a profile object with the fields to update
  const profileFields = {};
  if (phone) profileFields.phone = phone;
  // You can add other fields to update here, like name, etc.

  try {
    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update the user's profile
    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true } // This option returns the document after the update
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;