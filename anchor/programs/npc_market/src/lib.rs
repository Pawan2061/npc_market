#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

pub mod instructions;
pub mod states;

use instructions::{initialize_npc_market, mint_nft, InitializeNpcMarket, MintNft};

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod npc_market {
    use crate::instructions::store_character_metadata;

    use super::*;

    pub fn init_new_market(ctx: Context<InitializeNpcMarket>, market_name: String) -> Result<()> {
        initialize_npc_market(ctx, market_name)?;
        Ok(())
    }

    pub fn mint_new_nft(
        ctx: Context<MintNft>,
        metadata_title: String,
        metadata_uri: String,
        metadata_symbol: String,
    ) -> Result<()> {
        mint_nft(ctx, metadata_symbol, metadata_title, metadata_uri)?;
        Ok(())
    }

    pub fn store_character(
        ctx: Context<StoreCharacterMetadata>,
        class: String,
        level: u8,
    ) -> Result<()> {
        store_character_metadata(ctx, class, level)?;
        Ok(())
    }
}

// evolve_npc
// burn_npc
// update_npc_metadata
// set_market_config
