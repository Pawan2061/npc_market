use anchor_lang::{prelude::*, InitSpace};

#[account]
#[derive(InitSpace)]
pub struct Character {
    pub mint: Pubkey,
    pub owner: Pubkey,
    #[max_len(50)]
    pub class: String,
    pub level: u8,
}
