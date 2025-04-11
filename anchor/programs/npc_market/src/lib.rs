#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

pub mod instructions;
pub mod states;

use instructions::{initialize_npc_market, mint_nft, InitializeNpcMarket, MintNft};

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod npc_market {
    use super::*;

    pub fn init_new_market(ctx: Context<InitializeNpcMarket>, market_name: String) -> Result<()> {
        initialize_npc_market(ctx, market_name)
    }

    pub fn mint_new_nft(
        ctx: Context<MintNft>,
        metadata_title: String,
        metadata_uri: String,
        metadata_symbol: String,
    ) -> Result<()> {
        mint_nft(ctx, metadata_symbol, metadata_title, metadata_uri)
    }
}

// initialize_npc_market
// mint_npc
// evolve_npc
// burn_npc
// update_npc_metadata
// set_market_config
