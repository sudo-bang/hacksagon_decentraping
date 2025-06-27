import express from 'express';
import * as solanaService from '../services/solanaService.js';
import * as notificationService from '../services/notificationService.js';
const router = express.Router();

// @route   GET /api/jobs
// @desc    Get a list of active sites for validators to check
// @access  Public
router.get('/', (req, res) => {
  // TODO:
  // 1. Find all MonitoredSite documents where isActive is true
  // 2. Return a list of { siteId, url }
  res.json([{ siteId: "placeholder_id", url: "https://example.com" }]);
});

// @route   POST /api/finalize-job
// @desc    Called by a Hub to finalize a monitoring job
// @access  Public (with signature checks)
router.post('/finalize-job', async (req, res) => {
  const { siteId, result, validatorSignatures } = req.body;
  
  // TODO:
  // 1. Verify all signatures in validatorSignatures. This is a critical security step.
  //    - You'll need a function to verify Solana signatures.
  
  // 2. If signatures are valid, save the consensus result to the monitoring_results collection.
  
  // 3. Update reputation on Solana by calling the service
  // await solanaService.updateReputations(validatorSignatures.map(v => v.publicKey));
  
  // 4. If the site is down, send notifications
  if (result.uptime === false) {
    await notificationService.sendDownAlert(siteId);
  }
  
  res.status(200).json({ msg: "Job finalized successfully" });
});

export default router;