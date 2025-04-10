#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod npc_market {
    use super::*;

  pub fn close(_ctx: Context<CloseNpcMarket>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.npc_market.count = ctx.accounts.npc_market.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.npc_market.count = ctx.accounts.npc_market.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeNpcMarket>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.npc_market.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeNpcMarket<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + NpcMarket::INIT_SPACE,
  payer = payer
  )]
  pub npc_market: Account<'info, NpcMarket>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseNpcMarket<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub npc_market: Account<'info, NpcMarket>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub npc_market: Account<'info, NpcMarket>,
}

#[account]
#[derive(InitSpace)]
pub struct NpcMarket {
  count: u8,
}
