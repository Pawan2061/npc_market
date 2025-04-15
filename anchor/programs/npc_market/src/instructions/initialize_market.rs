use anchor_lang::prelude::*;

use crate::states::MarketConfig;


pub fn initialize_npc_market(ctx: Context<InitializeNpcMarket>,market_name:String) -> Result<()> {
    let npc_market=&mut ctx.accounts.npc_market;

    npc_market.market_name=market_name;
    npc_market.authority=ctx.accounts.authority.key();
    npc_market.bump = *ctx.bumps.get("npc_market").unwrap();
    npc_market.npc_count = 0;
    npc_market.mint_fee_lamports = 1_000_000;
    Ok(())
}


#[derive(Accounts)]
#[instruction(market_name:String)]

pub struct InitializeNpcMarket<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
      init_if_needed,
    
      seeds = [b"npc_market",market_name.as_bytes()],
      bump,
      payer=authority,
      space=8+MarketConfig::SPACE,


    )]
    pub npc_market: Account<'info, MarketConfig>,

    pub system_program:Program<'info,System>

}
