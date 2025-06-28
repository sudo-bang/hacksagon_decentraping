import 'dotenv/config';
import { Connection, PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import fs from 'fs';

const { Program, AnchorProvider } = anchor;

// --- Main execution ---
const checkReputation = async () => {
  // 1. Get the public key from the command line arguments
  const publicKeyString = process.argv[2];
  if (!publicKeyString) {
    console.error("❌ Please provide a validator's public key as an argument.");
    console.error("Example: node check-reputation.js <PUBLIC_KEY>");
    return;
  }
  console.log(`🔎 Checking reputation for validator: ${publicKeyString}`);

  try {
    // 2. Boilerplate setup to connect to the program
    const idl = JSON.parse(fs.readFileSync('./solana_program.json', 'utf8'));
    const connection = new Connection(process.env.SOLANA_RPC_URL, 'confirmed');
    const provider = new AnchorProvider(connection, {}, { commitment: 'confirmed' }); // Read-only, no wallet needed
    const programId = new PublicKey(process.env.SOLANA_PROGRAM_ID);
    const program = new Program(idl, provider);
    
    const validatorPublicKey = new PublicKey(publicKeyString);

    // 3. Find the Program-Derived Address (PDA) for the validator's account
    const [validatorAccountPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("validator"), validatorPublicKey.toBuffer()],
      program.programId
    );

    // 4. Fetch the account data from the blockchain
    const validatorAccount = await program.account.validatorAccount.fetch(validatorAccountPDA);
    
    // 5. Print the result!
    console.log("\n✅ Found Validator Account!");
    console.log(`   On-Chain Address: ${validatorAccountPDA.toBase58()}`);
    console.log(`   Authority (Owner): ${validatorAccount.authority.toBase58()}`);
    console.log(`   Reputation Score: ${validatorAccount.reputation.toString()}`);

  } catch (error) {
    if (error.message.includes("Account does not exist")) {
        console.error(`\n❌ Error: No on-chain reputation account found for this public key.`);
        console.error(`   Please make sure the validator has been registered.`);
    } else {
        console.error("\n❌ An unexpected error occurred:", error.message);
    }
  }
};

checkReputation();