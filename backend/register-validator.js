import 'dotenv/config';
import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction } from '@solana/web3.js';
import anchor from '@coral-xyz/anchor';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Program, AnchorProvider, Wallet } = anchor;

// --- Configuration ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..'); 

const INSTANCE_PATHS = [
    path.join(projectRoot, 'hub'),
    path.join(projectRoot, 'val1'),
    path.join(projectRoot, 'val2'),
    // path.join(projectRoot, 'val3'),
];

// --- Boilerplate Setup ---
const idl = JSON.parse(fs.readFileSync('./solana_program.json', 'utf8'));

// FIX: Manually add the `types` field to the IDL object for compatibility
if (!idl.types) {
  idl.types = idl.accounts;
}

const connection = new Connection(process.env.SOLANA_RPC_URL, 'confirmed');
const backendWalletKeypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(process.env.BACKEND_WALLET_SECRET_KEY)));
const wallet = new Wallet(backendWalletKeypair);
const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
const program = new Program(idl, provider);

// Helper function to add a delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const registerValidators = async () => {
    console.log("--- Starting Validator Registration Script ---");

    for (const instancePath of INSTANCE_PATHS) {
        try {
            // 1. Load the validator's keypair from its specific folder
            const keypairPath = path.join(instancePath, 'validator-keypair.json');
            const secretKey = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
            const validatorKeypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
            const validatorPublicKey = validatorKeypair.publicKey;

            console.log(`\n--- Processing: ${validatorPublicKey.toBase58()} ---`);

            // 2. Fund the new validator from our backend wallet
            console.log(`Funding validator with 0.1 SOL...`);
            const transferTx = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: validatorPublicKey,
                    lamports: 0.1 * LAMPORTS_PER_SOL,
                })
            );
            await provider.sendAndConfirm(transferTx);
            console.log(`✅ Funding successful.`);

            // 3. Find the PDA for the validator's account
            const [validatorAccountPDA] = PublicKey.findProgramAddressSync(
                [Buffer.from("validator"), validatorPublicKey.toBuffer()],
                program.programId
            );

            // 4. Register the validator on-chain
            console.log(`Attempting to register...`);
            // In this script, the validator's identity and operational key are the same.
            const txSignature = await program.methods
                .registerValidator(validatorKeypair.publicKey) // Pass operational key
                .accounts({
                    validatorAccount: validatorAccountPDA,
                    identityAuthority: validatorPublicKey, // Set the correct account name
                    systemProgram: SystemProgram.programId,
                })
                .signers([validatorKeypair]) 
                .rpc();

            console.log(`✅ Successfully registered. Tx: ${txSignature}`);
        } catch (error) {
            if (error.toString().includes("already in use")) {
                console.log(`ℹ️ Validator at path ${instancePath} is already registered.`);
            } else {
                console.error(`❌ Failed to process instance at ${instancePath}:`, error);
            }
        }
        await sleep(1000);
    }
};

registerValidators();