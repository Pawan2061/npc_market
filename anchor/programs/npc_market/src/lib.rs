#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
pub mod instructions;
pub mod states;

use instructions::initialize_market::*;
declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod npc_market {

    use super::*;

    pub fn init_new_market(ctx: Context<InitializeNpcMarket>, market_name: String) -> Result<()> {
        initialize_npc_market(ctx, market_name);
        Ok(())
    }

    // pub fn mint_npc() -> Result<()> {
    //     Ok(());
    // }
    // pub fn evolve_npc(...) -> Result<()> {
    //     Ok(())
    // }

    // pub fn burn_npc(...) -> Result<()> {
    //     Ok(())
    // }

    // pub fn update_npc_metadata(...) -> Result<()> {
    //     Ok(())
    // }

    // pub fn set_market_config(...) -> Result<()> {
    //     Ok(())
    // }
}

// #[account]
// #[derive(InitSpace)]
// pub struct MarketConfig {
//     #[max_len(50)]
//     pub market_name: String,
//     pub authority: Pubkey,
//     pub bump: u8,
//     pub mint_fee_lamports: u64,
//     pub npc_count: u64,
// }

// initialize_npc_market
// mint_npc
// evolve_npc
// burn_npc
// update_npc_metadata
// set_market_config
