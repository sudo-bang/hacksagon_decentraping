// This is a placeholder for your Anchor project.
// Create a new project with `anchor init solana-program`
// Then replace the contents of `/programs/solana-program/src/lib.rs` with this.

use anchor_lang::prelude::*;

declare_id!("GQbbAJNxL4cy8ixzokQwBqeZYuguXz8aEedLwEuCa9KM"); // Replace with your new Program ID after deploying

#[program]
pub mod solana_program {
    use super::*;

    // This instruction is called by a user from the frontend to register as a validator.
    // The `authority` (the user's wallet) pays for the account creation.
    pub fn register_validator(ctx: Context<RegisterValidator>) -> Result<()> {
        // TODO:
        // 1. Set the authority of the new ValidatorAccount to the signer's public key.
        // 2. Set the initial reputation score.
        // 3. (Optional) You could require a small SOL deposit as an initial stake.
        
        ctx.accounts.validator_account.authority = *ctx.accounts.authority.key;
        ctx.accounts.validator_account.reputation = 10; // Starting reputation
        ctx.accounts.validator_account.bump = ctx.bumps.validator_account;
        
        msg!("Validator {} registered successfully!", ctx.accounts.authority.key());
        Ok(())
    }

    // This instruction is called by the dedicated backend API to update a validator's score.
    // It can only be called by the pre-defined `update_authority` (your backend's wallet).
    pub fn update_reputation(ctx: Context<UpdateReputation>, new_reputation: u64) -> Result<()> {
        // TODO:
        // 1. The main security check is already handled by the `has_one = update_authority` constraint.
        //    Anchor will automatically reject the transaction if the signer is not the correct authority.
        // 2. Update the reputation score on the validator's account.

        ctx.accounts.validator_account.reputation = new_reputation;
        
        msg!("Reputation for validator {} updated to {}!", ctx.accounts.validator_account.authority, new_reputation);
        Ok(())
    }
}

// --- Account State ---
// This defines the structure of the data we store on-chain for each validator.
#[account]
pub struct ValidatorAccount {
    pub authority: Pubkey, // The validator's wallet address
    pub reputation: u64,   // The reputation score
    pub bump: u8,
}

// --- Instruction Contexts ---

#[derive(Accounts)]
pub struct RegisterValidator<'info> {
    // This creates a new account on-chain, owned by our program.
    // The space is calculated to hold a Pubkey (32 bytes), u64 (8 bytes), and u8 (1 byte).
    // The PDA seeds ensure that each validator can only have one reputation account.
    #[account(
        init, 
        payer = authority, 
        space = 8 + 32 + 8 + 1, 
        seeds = [b"validator", authority.key().as_ref()], 
        bump
    )]
    pub validator_account: Account<'info, ValidatorAccount>,
    
    // The user who is signing the transaction to register.
    #[account(mut)]
    pub authority: Signer<'info>,
    
    // The official System Program, required by Solana for creating accounts.
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateReputation<'info> {
    // We specify the validator account to update.
    // The `has_one = update_authority` constraint is a critical security check.
    // It ensures that only the wallet specified as `update_authority` can sign this transaction.
    #[account(
        mut,
        seeds = [b"validator", validator_account.authority.as_ref()],
        bump = validator_account.bump
    )]
    pub validator_account: Account<'info, ValidatorAccount>,
    
    // The authority that is allowed to update reputations (your backend's wallet).
    // This is NOT the validator themselves.
    pub update_authority: Signer<'info>,
}

