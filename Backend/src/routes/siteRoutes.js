import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

// @route   POST /api/sites/add
// @desc    Add a new site to monitor
// @access  Private (requires JWT)
router.post('/add', authMiddleware, (req, res) => {
  // TODO:
  // 1. Get user ID from the authMiddleware (req.user.id)
  // 2. Destructure url, name from req.body
  // 3. Create a new MonitoredSite document linked to the ownerId
  // 4. Return the newly created site object
  res.json({ msg: "Add site route placeholder" });
});

// @route   GET /api/sites
// @desc    Get all sites for a logged-in user
// @access  Private
router.get('/', authMiddleware, (req, res) => {
  // TODO:
  // 1. Get user ID from req.user.id
  // 2. Find all MonitoredSite documents where ownerId matches
  // 3. Return the list of sites
  res.json({ msg: "Get sites route placeholder" });
});

export default router;