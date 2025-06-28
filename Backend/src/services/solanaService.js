import { Connection, PublicKey, Keypair, Transaction } from '@solana/web3.js';
import anchor from '@coral-xyz/anchor';
import fs from 'fs';

const { Program, AnchorProvider, Wallet, BN } = anchor;

const idl = JSON.parse(fs.readFileSync('./solana_program.json', 'utf8'));
const connection = new Connection(process.env.SOLANA_RPC_URL, 'confirmed');
const backendWalletKeypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(process.env.BACKEND_WALLET_SECRET_KEY)));
const wallet = new Wallet(backendWalletKeypair);
const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
const programId = new PublicKey(process.env.SOLANA_PROGRAM_ID);
const program = new Program(idl, provider);

export const updateReputations = async (publicKeys) => {
  console.log(`Attempting to update reputations for ${publicKeys.length} participants.`);
  
  try {
    // --- BATCHING LOGIC ---
    const instructions = [];

    for (const pkString of publicKeys) {
      try {
        const validatorPublicKey = new PublicKey(pkString);
        const [validatorAccountPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from("validator"), validatorPublicKey.toBuffer()],
          program.programId
        );

        const validatorAccount = await program.account.validatorAccount.fetch(validatorAccountPDA);
        const currentReputation = validatorAccount.reputation;
        const newReputation = new BN(currentReputation).add(new BN(1));

        // Build the instruction but don't send it yet
        const instruction = await program.methods
          .updateReputation(newReputation)
          .accounts({
            validatorAccount: validatorAccountPDA,
            updateAuthority: wallet.publicKey,
          })
          .instruction();
        
        instructions.push(instruction);
        console.log(`Prepared reputation update for ${pkString} to new score: ${newReputation.toString()}`);
      } catch (error) {
        console.error(`Skipping reputation update for ${pkString}:`, error.message);
      }
    }

    // If we have any valid instructions, send them all in ONE transaction
    if (instructions.length > 0) {
      const transaction = new Transaction().add(...instructions);
      const txSignature = await provider.sendAndConfirm(transaction);
      console.log(`✅ Successfully sent batched reputation update. Tx: ${txSignature}`);
    } else {
      console.log("No valid accounts to update reputation for.");
    }

  } catch (error) {
    console.error('❌ Major failure during reputation update process:', error);
  }
  
  return true;
};