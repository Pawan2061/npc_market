// #![allow(clippy::result_large_err)]

// use anchor_lang::prelude::*;

// pub mod instructions;
// pub mod states;

// use crate::instructions::{
//     bid_nft::{bid, BidNft},
//     evolve_nft,
//     sell_nft::{sell, SellNft},
//     store_character_metadata, transfer_npc, EvolveNft, StoreCharacterMetadata, TransferNpc,
// };
// use instructions::{initialize_npc_market, mint_nft, InitializeNpcMarket, MintNft};

// declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

// #[program]
// pub mod npc_market {
//     use super::*;

//     pub fn init_new_market(ctx: Context<InitializeNpcMarket>, market_name: String) -> Result<()> {
//         initialize_npc_market(ctx, market_name)?;
//         Ok(())
//     }

//     pub fn mint_new_nft(
//         ctx: Context<MintNft>,
//         metadata_title: String,
//         metadata_uri: String,
//         metadata_symbol: String,
//     ) -> Result<()> {
//         mint_nft(ctx, metadata_symbol, metadata_title, metadata_uri)?;
//         Ok(())
//     }

//     pub fn store_character(
//         ctx: Context<StoreCharacterMetadata>,
//         class: String,
//         level: u8,
//     ) -> Result<()> {
//         store_character_metadata(ctx, class, level)?;
//         Ok(())
//     }

//     pub fn evolve_nft_value(ctx: Context<EvolveNft>, class: String) -> Result<()> {
//         evolve_nft(ctx, class)?;
//         Ok(())
//     }

//     pub fn transfer_npc_ownership(ctx: Context<TransferNpc>, new_owner: Pubkey) -> Result<()> {
//         transfer_npc(ctx, new_owner)?;
//         Ok(())
//     }

//     pub fn bid_nft(ctx: Context<BidNft>, bid_lamports: u64) -> Result<()> {
//         bid(ctx, bid_lamports)?;
//         Ok(())
//     }

//     pub fn sell_nft(ctx: Context<SellNft>, sell_lamports: u64) -> Result<()> {
//         sell(ctx, sell_lamports)?;
//         Ok(())
//     }
// }

// // burn_npc
// // update_npc_metadata
// // set_market_config

pub mod instructions;
pub mod states;
pub mod errors;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod npc_market {
    use super::*;

    pub fn init_new_market(ctx: Context<InitializeNpcMarket>, market_name: String) -> Result<()> {
        instructions::initialize_npc_market(ctx, market_name)
    }

    pub fn mint_new_nft(ctx: Context<MintNft>, metadata_title: String, metadata_uri: String, metadata_symbol: String) -> Result<()> {
        instructions::mint_nft(ctx, metadata_symbol, metadata_title, metadata_uri)
    }

    pub fn store_character(ctx: Context<StoreCharacter>, class: String, level: u8) -> Result<()> {
        instructions::store_character_metadata(ctx, class, level)
    }

    pub fn evolve_nft_value(ctx: Context<EvolveNft>, class: String) -> Result<()> {
        instructions::evolve_nft(ctx, class)
    }

    pub fn transfer_npc_ownership(ctx: Context<TransferNpc>, new_owner: Pubkey) -> Result<()> {
        instructions::transfer_npc(ctx, new_owner)
    }

    pub fn bid_nft(ctx: Context<BidNft>, bid_lamports: u64) -> Result<()> {
        instructions::bid(ctx, bid_lamports)
    }

    pub fn sell_nft(ctx: Context<SellNft>, sell_lamports: u64) -> Result<()> {
        instructions::sell(ctx, sell_lamports)
    }
}
