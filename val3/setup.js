import fs from 'fs';
import inquirer from 'inquirer';
import { Keypair } from '@solana/web3.js';

const setup = async () => {
  console.log('--- Uptime Monitor Validator Kit Setup ---');
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toBase58();
  const secretKey = `[${keypair.secretKey.toString()}]`;
  fs.writeFileSync('./validator-keypair.json', secretKey);
  console.log('✅ New keypair generated and saved to validator-keypair.json');
  console.log(`\nYour validator's public key is: ${publicKey}`);
  console.log('Please go to the web portal to register this public key.\n');
  if (!fs.existsSync('./config.json')) {
    fs.copyFileSync('./config.template.json', './config.json');
    console.log('✅ Default config.json created. Please review it before starting the kit.');
  } else {
    console.log('ℹ️ config.json already exists. Skipping creation.');
  }
  console.log('\n--- Setup Complete ---');
};
setup();