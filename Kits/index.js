import fs from 'fs';
import { Keypair } from '@solana/web3.js';
import { runAsValidator } from './src/validator.js';
import { runAsHub } from './src/hub.js';

console.log('--- Starting Uptime Monitor Kit ---');

// 1. Load configuration
let config;
try {
  config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
} catch (error) {
  console.error('❌ Error: config.json not found or is invalid. Please run `npm run setup` first.');
  process.exit(1);
}

// 2. Load the validator's keypair
let keypair;
try {
  const secretKey = JSON.parse(fs.readFileSync(config.keypairPath, 'utf-8'));
  keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
  console.log(`🔑 Wallet loaded. Public Key: ${keypair.publicKey.toBase58()}`);
} catch (error) {
  console.error(`❌ Error: Could not load keypair from ${config.keypairPath}.`);
  process.exit(1);
}

// 3. Start in the appropriate mode
if (config.isHub) {
  console.log('🚀 Starting in HUB mode.');
  runAsHub(config, keypair);
} else {
  console.log('🚀 Starting in VALIDATOR mode.');
  runAsValidator(config, keypair);
}