#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

pub mod instructions;
pub mod states;

use instructions::{initialize_npc_market, mint_nft, InitializeNpcMarket, MintNft};

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod npc_market {
    use crate::instructions::{
        bid_nft::bid, evolve_nft, store_character_metadata, transfer_npc, EvolveNft,
    };

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

    pub fn evolve_nft_value(ctx: Context<EvolveNft>, class: String) -> Result<()> {
        evolve_nft(ctx, class);
        Ok(())
    }
    pub fn transfer_npc_ownership(ctx: Context<TransferNpc>, new_owner: Pubkey) -> Result<()> {
        transfer_npc(ctx, new_owner);
        Ok(())
    }

    pub fn bid_nft(ctx: Context<BidNft>, bid_lamports: u64) -> Result<()> {
        bid(ctx, bid_lamports);
        Ok(())
    }

    pub fn sell_nft(ctx: Context<SellNft>, sell_lamports: u64) -> Result<()> {
        Ok(())
    }
}

// burn_npc
// update_npc_metadata
// set_market_config
