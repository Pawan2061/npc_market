use anchor_lang::prelude::*;
use crate::errors::CustomError;

#[account]
pub struct Character {
    pub mint: Pubkey,     // 32 bytes
    pub owner: Pubkey,    // 32 bytes
    pub class: String,    // 4 + 50 = 54 bytes (we'll enforce the max length in code)
    pub level: u8,        // 1 byte
}

impl Character {
    pub const SPACE: usize = 8 + // discriminator
                            32 + // mint
                            32 + // owner
                            (4 + 50) + // class (4 bytes length prefix + max 50 bytes)
                            1;   // level
                            
    // Optional: Add validation method
    pub fn validate(&self) -> Result<()> {
        require!(self.class.len() <= 50, CustomError::StringTooLong);
        Ok(())
    }
}