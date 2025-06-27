import axios from 'axios';
import { signData } from './utils/solana.js';

const POLLING_INTERVAL = 60 * 1000; // 60 seconds

export const runAsValidator = (config, keypair) => {
  console.log('Validator starting poll cycle...');
  
  setInterval(async () => {
    try {
      // 1. Poll the backend for jobs
      const response = await axios.get(`${config.apiEndpoint}/jobs`);
      const jobs = response.data;
      console.log(`Received ${jobs.length} jobs to process.`);

      for (const job of jobs) {
        // 2. Perform checks for each job
        const result = await performChecks(job.url);
        
        // 3. Sign the result
        const signature = signData(result, keypair);
        
        // 4. Send the signed report to the hub
        await sendReportToHub(config.hubUrl, job.siteId, result, keypair.publicKey.toBase58(), signature);
      }
    } catch (error) {
      console.error('❌ An error occurred during the poll cycle:', error.message);
    }
  }, POLLING_INTERVAL);
};

const performChecks = async (url) => {
  // TODO: Implement the actual monitoring logic
  // - Uptime check (e.g., using axios to see if it returns 200 OK)
  // - Performance check (measure response time)
  // - SSL check (using a library like `ssl-checker`)
  console.log(`-> Checking ${url}...`);
  const startTime = Date.now();
  try {
    await axios.get(url, { timeout: 5000 });
    const loadTime = Date.now() - startTime;
    return { uptime: true, loadTime, sslValid: true }; // Placeholder
  } catch (error) {
    return { uptime: false, loadTime: 0, sslValid: false }; // Placeholder
  }
};

const sendReportToHub = async (hubUrl, siteId, result, publicKey, signature) => {
  // TODO: Send the report to the Hub's listening endpoint
  try {
    const payload = {
      siteId,
      result,
      publicKey,
      signature,
    };
    // await axios.post(`${hubUrl}/report`, payload);
    console.log(`✅ Report for ${siteId} sent to hub.`);
  } catch (error) {
    console.error(`❌ Failed to send report for ${siteId} to hub:`, error.message);
  }
};