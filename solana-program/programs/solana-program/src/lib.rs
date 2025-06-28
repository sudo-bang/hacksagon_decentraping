// This is the updated code for your on-chain program.
// It supports the new "Two-Wallet" registration system.
// Place this in `/programs/solana-program/src/lib.rs` and redeploy.

use anchor_lang::prelude::*;

// Remember to replace this with your new Program ID after deploying.
declare_id!("GQbbAJNxL4cy8ixzokQwBqeZYuguXz8aEedLwEuCa9KM"); 

#[program]
pub mod solana_program {
    use super::*;

    // The user signs with their Identity Wallet, but passes in the public key
    // of their newly generated Operational Wallet.
    pub fn register_validator(ctx: Context<RegisterValidator>, operational_key: Pubkey) -> Result<()> {
        let validator_account = &mut ctx.accounts.validator_account;
        
        validator_account.identity_authority = *ctx.accounts.identity_authority.key;
        validator_account.operational_authority = operational_key;
        validator_account.reputation = 10;
        validator_account.bump = ctx.bumps.validator_account;
        
        msg!("Validator registered successfully!");
        msg!("Identity: {}", validator_account.identity_authority);
        msg!("Operational: {}", validator_account.operational_authority);
        Ok(())
    }

    // This function remains the same, but now it's clear which key is used.
    // The backend will use the on-chain data to know which operational key to update.
    pub fn update_reputation(ctx: Context<UpdateReputation>, new_reputation: u64) -> Result<()> {
        ctx.accounts.validator_account.reputation = new_reputation;
        msg!("Reputation for validator {} updated to {}!", ctx.accounts.validator_account.identity_authority, new_reputation);
        Ok(())
    }
}

// --- Account State ---
// The account now stores both keys for clarity and security.
#[account]
pub struct ValidatorAccount {
    pub identity_authority: Pubkey,    // The main wallet that controls this account.
    pub operational_authority: Pubkey, // The key the kit uses to sign reports.
    pub reputation: u64,
    pub bump: u8,
}

// --- Instruction Contexts ---

#[derive(Accounts)]
pub struct RegisterValidator<'info> {
    // The PDA is now seeded by the IDENTITY authority, ensuring one user can only
    // have one validator account.
    #[account(
        init, 
        payer = identity_authority, 
        space = 8 + 32 + 32 + 8 + 1, // Increased space for the second public key
        seeds = [b"validator", identity_authority.key().as_ref()], 
        bump
    )]
    pub validator_account: Account<'info, ValidatorAccount>,
    
    // The user's main wallet, signing the transaction.
    #[account(mut)]
    pub identity_authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateReputation<'info> {
    // We find the account using the identity authority, but the reputation update
    // is based on the work of the operational authority.
    #[account(
        mut,
        seeds = [b"validator", validator_account.identity_authority.as_ref()],
        bump = validator_account.bump
    )]
    pub validator_account: Account<'info, ValidatorAccount>,
    
    // The backend's wallet is still the only one allowed to update scores.
    pub update_authority: Signer<'info>,
}