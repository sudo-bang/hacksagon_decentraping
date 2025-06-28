import axios from 'axios';
import getSslCertificate from 'ssl-checker';
import { signData } from './utils/solana.js';

const POLLING_INTERVAL = 60 * 1000;

export const runAsValidator = (config, keypair) => {
  console.log('Validator starting poll cycle...');
  const poll = async () => {
    try {
      const response = await axios.get(`${config.apiEndpoint}/jobs`);
      const jobs = response.data;
      if (jobs.length > 0) console.log(`Received ${jobs.length} jobs to process.`);
      for (const job of jobs) {
        const result = await performChecks(job.url);
        const signature = signData(result, keypair);
        await sendReportToHub(config.hubUrl, job.siteId, result, keypair.publicKey.toBase58(), signature);
      }
    } catch (error) {
      console.error('❌ An error occurred during the poll cycle:', error.message);
    }
  };
  poll();
  setInterval(poll, POLLING_INTERVAL);
};

const performChecks = async (url) => {
  console.log(`-> Checking ${url}...`);
  const result = { uptime: false, loadTime: -1, sslValid: false };
  
  const startTime = Date.now();
  try {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    await axios.get(fullUrl, { timeout: 10000 });
    result.uptime = true;
    result.loadTime = Date.now() - startTime;
  } catch (error) {
    result.uptime = false;
    result.loadTime = -1;
  }

  try {
    const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    const sslDetails = await getSslCertificate(hostname);
    result.sslValid = sslDetails.valid;
  } catch (error) {
    result.sslValid = false;
  }
  
  return result;
};

const sendReportToHub = async (hubUrl, siteId, result, publicKey, signature) => {
  try {
    const payload = { siteId, result, publicKey, signature };
    await axios.post(`${hubUrl}/report`, payload);
    console.log(`✅ Report for ${siteId} sent to hub.`);
  } catch (error) {
    console.error(`❌ Failed to send report for ${siteId} to hub:`, error.message);
  }
};