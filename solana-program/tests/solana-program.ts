// This is the test script for your on-chain program.
// Place this code in `/tests/solana-program.ts`.

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaProgram } from "../target/types/solana_program";
import { assert } from "chai";

describe("solana-program", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaProgram as Program<SolanaProgram>;

  // We will use this keypair to simulate a new validator registering.
  const newValidator = anchor.web3.Keypair.generate();

  // This is the wallet that runs the test, we'll use it to simulate the backend.
  const updateAuthority = provider.wallet;

  it("Allows a new validator to register!", async () => {
    // --- Setup ---
    // Airdrop some SOL to the new validator's wallet so they can pay for the transaction.
    const airdropSignature = await provider.connection.requestAirdrop(
      newValidator.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL // 2 SOL
    );
    // Confirm the transaction
    await provider.connection.confirmTransaction(airdropSignature);
    console.log(`Airdropped 2 SOL to new validator: ${newValidator.publicKey.toBase58()}`);

    // --- Action ---
    // Now, call the `register_validator` instruction.
    // We sign this transaction with the newValidator's keypair, simulating them doing it from the frontend.
    await program.methods
      .registerValidator()
      .accounts({
        validatorAccount: anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("validator"), newValidator.publicKey.toBuffer()],
          program.programId
        )[0],
        authority: newValidator.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([newValidator]) // The new validator must sign to approve the creation.
      .rpc();

    // --- Verification ---
    // Fetch the newly created account from the blockchain to verify its data.
    const validatorAccount = await program.account.validatorAccount.fetch(
      anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("validator"), newValidator.publicKey.toBuffer()],
        program.programId
      )[0]
    );

    // Assert that the data was set correctly.
    assert.ok(validatorAccount.authority.equals(newValidator.publicKey), "Authority does not match");
    assert.strictEqual(validatorAccount.reputation.toNumber(), 10, "Initial reputation is not 10");
    console.log("✅ Validator registered successfully!");
  });


  it("Allows the backend to update a validator's reputation!", async () => {
    // --- Setup ---
    // We will update the reputation for the validator we created in the previous test.
    const newReputation = new anchor.BN(150);

    // --- Action ---
    // Call the `update_reputation` instruction.
    // This time, the `updateAuthority` (our test runner wallet) is the signer.
    await program.methods
      .updateReputation(newReputation)
      .accounts({
        validatorAccount: anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("validator"), newValidator.publicKey.toBuffer()],
          program.programId
        )[0],
        updateAuthority: updateAuthority.publicKey,
      })
      // No need to specify signers here, Anchor uses the default provider wallet.
      .rpc();

    // --- Verification ---
    // Fetch the account again to see if the reputation changed.
    const updatedValidatorAccount = await program.account.validatorAccount.fetch(
      anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("validator"), newValidator.publicKey.toBuffer()],
        program.programId
      )[0]
    );

    // Assert that the reputation score was updated correctly.
    assert.strictEqual(updatedValidatorAccount.reputation.toNumber(), newReputation.toNumber(), "Reputation was not updated");
    console.log(`✅ Reputation updated successfully to ${newReputation.toNumber()}`);
  });
});
