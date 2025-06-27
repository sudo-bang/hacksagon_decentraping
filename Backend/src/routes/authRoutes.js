import express from 'express';
const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new customer
// @access  Public
router.post('/register', (req, res) => {
  // TODO:
  // 1. Destructure email, password from req.body
  // 2. Check if user already exists in DB
  // 3. Hash the password using bcryptjs
  // 4. Create a new User document in MongoDB
  // 5. Create a JWT token
  // 6. Return the token to the user
  res.json({ msg: "Register route placeholder" });
});

// @route   POST /api/auth/login
// @desc    Login a customer
// @access  Public
router.post('/login', (req, res) => {
  // TODO:
  // 1. Destructure email, password from req.body
  // 2. Find user in DB by email
  // 3. Compare hashed password with plain text password
  // 4. If match, create and return a JWT token
  res.json({ msg: "Login route placeholder" });
});

export default router;