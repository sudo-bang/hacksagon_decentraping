import express from 'express';
import axios from 'axios';
import { verifySignature } from './utils/solana.js';
import { runAsValidator as runValidatorChecks } from './validator.js';

const CONSENSUS_THRESHOLD = 3;
const reportsPool = {};

export const runAsHub = (config, keypair) => {
  const app = express();
  app.use(express.json());
  app.post('/report', (req, res) => {
    const { siteId, result, publicKey, signature } = req.body;
    if (!verifySignature(result, signature, publicKey)) {
      console.warn(`⚠️ Received invalid signature from ${publicKey}. Discarding.`);
      return res.status(401).send('Invalid signature');
    }
    if (!reportsPool[siteId]) {
      reportsPool[siteId] = [];
    }
    reportsPool[siteId].push({ result, publicKey, signature });
    console.log(`Received report for ${siteId}. Total reports: ${reportsPool[siteId].length}`);
    if (reportsPool[siteId].length >= CONSENSUS_THRESHOLD) {
      console.log(`Consensus threshold reached for ${siteId}. Processing...`);
      processConsensus(siteId, config.apiEndpoint);
    }
    res.status(200).send('Report received');
  });
  app.listen(config.port, () => {
    console.log(`Hub listening for reports on port ${config.port}`);
  });
  runValidatorChecks(config, keypair);
};

const processConsensus = async (siteId, apiEndpoint) => {
  const reports = reportsPool[siteId];
  if (!reports) return;
  const uptimeVotes = reports.map(r => r.result.uptime);
  const uptimeConsensus = uptimeVotes.filter(Boolean).length > uptimeVotes.length / 2;
  const validLoadTimes = reports.filter(r => r.result.uptime).map(r => r.result.loadTime);
  const loadTimeAvg = validLoadTimes.length ? Math.round(validLoadTimes.reduce((a, b) => a + b, 0) / validLoadTimes.length) : -1;
  const sslVotes = reports.map(r => r.result.sslValid);
  const sslConsensus = sslVotes.filter(Boolean).length > sslVotes.length / 2;
  const consensusResult = {
    uptime: uptimeConsensus,
    loadTime: loadTimeAvg,
    sslValid: sslConsensus,
  };
  const validatorSignatures = reports.map(r => ({
    publicKey: r.publicKey,
    signature: r.signature,
  }));
  try {
    const payload = { siteId, result: consensusResult, validatorSignatures };
    await axios.post(`${apiEndpoint}/jobs/finalize-job`, payload);
    console.log(`✅ Consensus for ${siteId} finalized and sent to backend.`);
  } catch (error) {
    console.error(`❌ Failed to finalize job for ${siteId}:`, error.message);
  }
  delete reportsPool[siteId];
};