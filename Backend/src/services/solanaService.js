import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor'; // Import all of anchor as a namespace
import fs from 'fs';

// NOTE: You must copy the IDL file from your Solana program's /target/idl directory
// into your backend project for this to work. It should be named `solana_program.json`.
const idl = JSON.parse(fs.readFileSync('./solana_program.json', 'utf8'));

// Setup the connection and wallet
const connection = new Connection(process.env.SOLANA_RPC_URL, 'confirmed');
const backendWallet = Keypair.fromSecretKey(new Uint8Array(JSON.parse(process.env.BACKEND_WALLET_SECRET_KEY)));
const provider = new anchor.AnchorProvider(connection, { keypair: backendWallet }, { commitment: 'confirmed' });

// Initialize the program interface
const programId = new PublicKey(process.env.SOLANA_PROGRAM_ID);
const program = new anchor.Program(idl, provider); // Use anchor.Program

export const updateReputations = async (publicKeys) => {
  console.log(`Attempting to update reputations for ${publicKeys.length} validators.`);

  for (const pkString of publicKeys) {
    try {
      const validatorPublicKey = new PublicKey(pkString);
      
      const [validatorAccountPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("validator"), validatorPublicKey.toBuffer()],
        program.programId
      );

      const validatorAccount = await program.account.validatorAccount.fetch(validatorAccountPDA);
      const currentReputation = validatorAccount.reputation;
      
      // Use anchor.BN to create a new BigNumber instance
      const newReputation = new anchor.BN(currentReputation).add(new anchor.BN(1));

      const txSignature = await program.methods
        .updateReputation(newReputation)
        .accounts({
          validatorAccount: validatorAccountPDA,
          updateAuthority: backendWallet.publicKey,
        })
        .signers([backendWallet])
        .rpc();

      console.log(`Successfully updated reputation for ${pkString}. New score: ${newReputation.toString()}. Tx: ${txSignature}`);

    } catch (error) {
      console.error(`Failed to update reputation for ${pkString}:`, error);
    }
  }
  return true;
};