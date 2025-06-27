import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import MonitoredSite from '../models/MonitoredSite.js'; // Import the MonitoredSite model

const router = express.Router();

// @route   POST /api/sites/add
// @desc    Add a new site to monitor
// @access  Private (requires JWT)
router.post('/add', authMiddleware, async (req, res) => {
  const { url, name } = req.body;

  // Basic validation
  if (!url || !name) {
    return res.status(400).json({ msg: 'Please provide a URL and a name' });
  }

  try {
    // Create a new MonitoredSite document
    const newSite = new MonitoredSite({
      ownerId: req.user.id, // Get user ID from the authMiddleware
      url,
      name,
    });

    // Save the site to the database
    const site = await newSite.save();

    // Return the newly created site object
    res.json(site);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/sites
// @desc    Get all sites for a logged-in user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Find all MonitoredSite documents where ownerId matches the logged-in user
    const sites = await MonitoredSite.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
    
    // Return the list of sites
    res.json(sites);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;