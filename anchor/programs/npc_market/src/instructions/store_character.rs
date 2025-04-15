use anchor_lang::prelude::*;
use anchor_spl::token;

use crate::states::Character;

pub fn store_character_metadata(
    ctx: Context<StoreCharacter>,
    class: String,
    level: u8,
) -> Result<()> {
    let character = &mut ctx.accounts.character;

    character.mint = ctx.accounts.mint.key();
    character.owner = ctx.accounts.owner.key();
    character.class = class;
    character.level = level;

    Ok(())
}
#[derive(Accounts)]
pub struct StoreCharacter<'info> {
    #[account(
        init,
        payer = owner,
        space = Character::SPACE,  // Changed from INIT_SPACE to SPACE
        seeds = [b"character", mint.key().as_ref()],
        bump
    )]
    pub character: Account<'info, Character>,
    
    #[account(mut)]
    pub mint: Account<'info, token::Mint>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}