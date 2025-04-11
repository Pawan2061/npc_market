#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod npc_market {
    use super::*;

    pub fn initialize_npc_market() -> Result<()> {
        Ok(());
    }

    pub fn mint_npc() -> Result<()> {
        Ok(());
    }
    pub fn evolve_npc(...) -> Result<()> {
        Ok(())
    }

    pub fn burn_npc(...) -> Result<()> {
        Ok(())
    }

    pub fn update_npc_metadata(...) -> Result<()> {
        Ok(())
    }

    pub fn set_market_config(...) -> Result<()> {
        Ok(())
    }
}

// initialize_npc_market
// mint_npc
// evolve_npc
// burn_npc
// update_npc_metadata
// set_market_config
