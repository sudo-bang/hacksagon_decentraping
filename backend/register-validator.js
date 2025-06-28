import 'dotenv/config';
import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..'); 

const INSTANCE_PATHS = [
    path.join(projectRoot, 'hub'),
    path.join(projectRoot, 'val1'),
    path.join(projectRoot, 'val2'),
    path.join(projectRoot, 'val3'),
];

// --- Boilerplate Setup ---
const idl = JSON.parse(fs.readFileSync('./solana_program.json', 'utf8'));
const connection = new Connection(process.env.SOLANA_RPC_URL, 'confirmed');
const backendWalletKeypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(process.env.BACKEND_WALLET_SECRET_KEY)));

// FIX: Wrap the keypair in an anchor.Wallet object
const wallet = new anchor.Wallet(backendWalletKeypair);

const provider = new anchor.AnchorProvider(connection, wallet, { commitment: 'confirmed' });
const programId = new PublicKey(process.env.SOLANA_PROGRAM_ID);
const program = new anchor.Program(idl, provider);

// Helper function to add a delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const registerValidators = async () => {
    console.log("--- Starting Validator Registration Script ---");

    for (const instancePath of INSTANCE_PATHS) {
        try {
            const keypairPath = path.join(instancePath, 'validator-keypair.json');
            const secretKey = JSON.parse(fs.readFileSync(keypairPath, 'utf-8'));
            const validatorKeypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
            const validatorPublicKey = validatorKeypair.publicKey;

            console.log(`\n--- Processing: ${validatorPublicKey.toBase58()} ---`);

            console.log(`Funding validator with 0.1 SOL...`);
            const transferTx = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: backendWalletKeypair.publicKey,
                    toPubkey: validatorPublicKey,
                    lamports: 0.1 * LAMPORTS_PER_SOL,
                })
            );

            await provider.sendAndConfirm(transferTx);
            console.log(`✅ Funding successful.`);

            const [validatorAccountPDA] = PublicKey.findProgramAddressSync(
                [Buffer.from("validator"), validatorPublicKey.toBuffer()],
                program.programId
            );

            console.log(`Attempting to register...`);
            const txSignature = await program.methods
                .registerValidator()
                .accounts({
                    validatorAccount: validatorAccountPDA,
                    authority: validatorPublicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
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