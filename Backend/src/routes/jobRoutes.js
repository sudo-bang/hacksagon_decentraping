import express from 'express';
import MonitoredSite from '../models/MonitoredSite.js';
import MonitoringResult from '../models/MonitoringResult.js';
import * as solanaService from '../services/solanaService.js';
import * as notificationService from '../services/notificationService.js';
import { verifySignature } from '../utils/solanaUtils.js';

const router = express.Router();

// @route   GET /api/jobs
// @desc    Get a list of active sites for validators to check
// @access  Public
router.get('/', async (req, res) => {
  try {
    // 1. Find all MonitoredSite documents where isActive is true
    const activeSites = await MonitoredSite.find({ isActive: true }).select('_id url');
    
    // 2. Map to the required format
    const jobs = activeSites.map(site => ({
      siteId: site._id,
      url: site.url,
    }));
    
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// @route   POST /api/jobs/finalize-job
// @desc    Called by a Hub to finalize a monitoring job
// @access  Public (with signature checks)
router.post('/finalize-job', async (req, res) => {
  // FIX: Destructure the correct keys from the Hub's payload
  const { siteId, result, participatingValidators, hubSignature, hubPublicKey } = req.body;

  if (!siteId || !result || !participatingValidators || !hubSignature || !hubPublicKey) {
    return res.status(400).json({ msg: 'Invalid payload from Hub' });
  }

  try {
    // 1. Verify the Hub's signature
    if (!verifySignature(result, hubSignature, hubPublicKey)) {
      console.warn(`Invalid signature from HUB: ${hubPublicKey}`);
      return res.status(401).json({ msg: `Invalid signature from Hub ${hubPublicKey}` });
    }

    // 2. Save the consensus result to the database
    const newResult = new MonitoringResult({
      siteId,
      result,
      participatingValidators: participatingValidators,
    });
    await newResult.save();

    // 3. Update the site's status
    const site = await MonitoredSite.findById(siteId);
    if (!site) {
      return res.status(404).json({ msg: 'Site not found' });
    }

    const newStatus = result.uptime ? 'UP' : 'DOWN';
    const shouldNotify = site.lastStatus === 'UP' && newStatus === 'DOWN';
    
    site.lastStatus = newStatus;
    site.lastChecked = Date.now();
    await site.save();
    
    // 4. Update reputation on Solana for the Hub and all participating validators
    const allParticipants = [...participatingValidators, hubPublicKey];
    await solanaService.updateReputations(allParticipants);

    // 5. If the site just went down, send notifications
    if (shouldNotify) {
      await notificationService.sendDownAlert(siteId);
    }
    
    res.status(200).json({ msg: "Job finalized successfully by Hub" });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
