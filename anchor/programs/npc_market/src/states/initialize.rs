use anchor_lang::prelude::*;
use crate::errors::CustomError;

#[account]
pub struct MarketConfig {
    pub market_name: String,  // Remove the max_len attribute
    pub authority: Pubkey,
    pub bump: u8,
    pub mint_fee_lamports: u64,
    pub npc_count: u64,
}

impl MarketConfig {
    pub const SPACE: usize = 8 +  // discriminator
                            (4 + 50) +  // market_name (4 bytes length prefix + max 50 bytes)
                            32 +  // authority (Pubkey)
                            1 +   // bump
                            8 +   // mint_fee_lamports
                            8;    // npc_count
                            
    // Optional: Add validation method
    pub fn validate(&self) -> Result<()> {
        require!(self.market_name.len() <= 50, CustomError::StringTooLong);
        Ok(())
    }
}