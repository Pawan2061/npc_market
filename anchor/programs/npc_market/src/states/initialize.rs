use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct MarketConfig {
    #[max_len(50)]
    pub market_name: String,

    pub authority: Pubkey,
    pub bump: u8,
    pub mint_fee_lamports: u64,
    pub npc_count: u64,
}
