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

// @route   POST /api/finalize-job
// @desc    Called by a Hub to finalize a monitoring job
// @access  Public (with signature checks)
router.post('/finalize-job', async (req, res) => {
  const { siteId, result, validatorSignatures } = req.body;

  if (!siteId || !result || !validatorSignatures || validatorSignatures.length === 0) {
    return res.status(400).json({ msg: 'Invalid payload' });
  }

  try {
    // 1. Verify all signatures are legit
    for (const valSig of validatorSignatures) {
      const isVerified = verifySignature(result, valSig.signature, valSig.publicKey);
      if (!isVerified) {
        console.warn(`Invalid signature from validator: ${valSig.publicKey}`);
        return res.status(401).json({ msg: `Invalid signature from ${valSig.publicKey}` });
      }
    }

    // 2. Save the consensus result to the database
    const newResult = new MonitoringResult({
      siteId,
      result,
      participatingValidators: validatorSignatures.map(v => v.publicKey),
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
    
    // 4. Update reputation on Solana (simple +1 for each successful report)
    // In a real app, you'd fetch current reputation and increment it.
    // For the hackathon, this call is simplified.
    await solanaService.updateReputations(validatorSignatures.map(v => v.publicKey));

    // 5. If the site just went down, send notifications
    if (shouldNotify) {
      await notificationService.sendDownAlert(siteId);
    }
    
    res.status(200).json({ msg: "Job finalized successfully" });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;