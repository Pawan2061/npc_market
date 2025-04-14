use anchor_lang::prelude::*;

use crate::states::Character;

pub fn transfer_npc(ctx: Context<TransferNpc>, new_owner: Pubkey) -> Result<()> {
    let character = &mut ctx.accounts.character_account;

    character.owner = new_owner;
    Ok(())
}

#[derive(Accounts)]
pub struct TransferNpc<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    pub mint: Account<'info, token::Mint>,

    #[account(
        mut,
        seeds = [b"character", mint.key().as_ref()],
        bump
    )]
    pub character_account: Account<'info, Character>,

    pub system_program: Program<'info, System>,
}
