import express from 'express';
import axios from 'axios';
import { verifySignature } from './utils/solana.js';
import { runAsValidator as runValidatorChecks } from './validator.js';

const CONSENSUS_THRESHOLD = 3; // Need 3 reports to form consensus
const reportsPool = {}; // In-memory store for reports: { [siteId]: [reports] }

export const runAsHub = (config, keypair) => {
  const app = express();
  app.use(express.json());

  // Endpoint for validators to send reports to
  app.post('/report', (req, res) => {
    const { siteId, result, publicKey, signature } = req.body;
    
    // TODO:
    // 1. Verify the signature of the incoming report
    // const isVerified = verifySignature(result, signature, publicKey);
    // if (!isVerified) {
    //   return res.status(401).send('Invalid signature');
    // }
    
    // 2. Add the verified report to the pool
    if (!reportsPool[siteId]) {
      reportsPool[siteId] = [];
    }
    reportsPool[siteId].push({ result, publicKey, signature });
    console.log(`Received report for ${siteId}. Total reports: ${reportsPool[siteId].length}`);
    
    // 3. Check if consensus can be reached
    if (reportsPool[siteId].length >= CONSENSUS_THRESHOLD) {
      console.log(`Consensus threshold reached for ${siteId}. Processing...`);
      processConsensus(siteId, config.apiEndpoint);
    }
    
    res.status(200).send('Report received');
  });

  app.listen(config.port, () => {
    console.log(`Hub listening for reports on port ${config.port}`);
  });
  
  // A hub is also a validator, so it should run its own checks too
  runValidatorChecks(config, keypair);
};

const processConsensus = async (siteId, apiEndpoint) => {
  const reports = reportsPool[siteId];
  
  // TODO:
  // 1. Implement the consensus logic
  //    - Count votes for `uptime` (true/false)
  //    - Average the `loadTime`
  const consensusResult = { uptime: true, loadTime: 100, sslValid: true }; // Placeholder
  
  // 2. Collect the signatures of participating validators
  const validatorSignatures = reports.map(r => ({
    publicKey: r.publicKey,
    signature: r.signature,
  }));
  
  // 3. Finalize the job by calling the main backend API
  try {
    const payload = {
      siteId,
      result: consensusResult,
      validatorSignatures,
    };
    await axios.post(`${apiEndpoint}/finalize-job`, payload);
    console.log(`✅ Consensus for ${siteId} finalized and sent to backend.`);
  } catch (error) {
    console.error(`❌ Failed to finalize job for ${siteId}:`, error.message);
  }
  
  // 4. Clear the reports from the pool
  delete reportsPool[siteId];
};