use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("String exceeds maximum length")]
    StringTooLong,
    // Add other custom errors as needed
}