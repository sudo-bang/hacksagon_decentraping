// This is a standalone script to test your backend's /finalize-job endpoint.
// Save it as something like `test-finalize.js` in your backend project's root.
// Run it with `node test-finalize.js`.

import axios from 'axios';
import { Keypair } from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { TextEncoder } from 'util';

// --- Configuration ---
const API_ENDPOINT = 'http://localhost:5000/api/jobs/finalize-job'; 
const MOCK_SITE_ID = '685ee19d723f5df5a09ba37d'; // Replace with a real siteId from your DB

// --- CHOOSE YOUR TEST ---
// Change this value to 'UP' or 'DOWN' to run the desired scenario.
// 1. Run with 'UP' to set the initial status.
// 2. Run with 'DOWN' to trigger the notification.
const TEST_SCENARIO = 'DOWN'; // Can be 'UP' or 'DOWN'

// --- Helper function to sign data ---
const signData = (data, keypair) => {
  const message = JSON.stringify(data);
  const messageBytes = new TextEncoder().encode(message);
  const signatureBytes = nacl.sign.detached(messageBytes, keypair.secretKey);
  return bs58.encode(signatureBytes);
};

const runTest = async () => {
  console.log(`--- Starting Backend Test Script (Scenario: ${TEST_SCENARIO}) ---`);

  // 1. Create mock validators
  const mockValidators = [Keypair.generate(), Keypair.generate(), Keypair.generate()];
  console.log('✅ Created 3 mock validators.');

  // 2. Define the consensus result based on the chosen scenario
  const consensusResult = {
    uptime: TEST_SCENARIO === 'UP', // This will be true or false based on the variable
    loadTime: TEST_SCENARIO === 'UP' ? 350 : 5000,
    sslValid: true,
  };
  console.log('📝 Test Result:', consensusResult);

  // 3. Generate signatures
  const validatorSignatures = mockValidators.map(validator => ({
    publicKey: validator.publicKey.toBase58(),
    signature: signData(consensusResult, validator),
  }));
  console.log('✍️ Generated valid signatures.');

  // 4. Construct the payload
  const payload = {
    siteId: MOCK_SITE_ID,
    result: consensusResult,
    validatorSignatures: validatorSignatures,
  };

  // 5. Send the request
  try {
    console.log(`\n🚀 Sending POST request to ${API_ENDPOINT}...`);
    const response = await axios.post(API_ENDPOINT, payload);
    console.log('✅ Success! Backend responded with:');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
  } catch (error) {
    console.error('❌ Error! The backend responded with an error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error message:', error.message);
    }
  }
};

runTest();
