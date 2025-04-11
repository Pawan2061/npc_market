use anchor_lang::{prelude::*, require};
use anchor_spl::token::{Token, TokenAccount};

use crate::{program::NpcMarket, states::Character};

pub fn evolve_nft(ctx: Context<EvolveNft>, class: String) -> Result<()> {
    let character = &mut ctx.accounts.character;

    require!(
        ctx.accounts.nft_token_account.amount == 1,
        ErrorCode::InvalidOwner
    );

    character.class = class;
    character.level += 1;

    Ok(())
}

#[derive(Accounts)]
pub struct EvolveNft<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub mint: AccountInfo<'info>,

    #[account(
        seeds = [b"character", mint.key().as_ref()],
        bump,
        mut
    )]
    pub character: Account<'info, Character>,

    #[account(
        constraint = nft_token_account.mint == mint.key(),
        constraint = nft_token_account.owner == payer.key()
    )]
    pub nft_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Token account does not belong to payer or doesn't hold NFT.")]
    InvalidOwner,
}
