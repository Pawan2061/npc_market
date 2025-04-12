use {
    anchor_lang::{prelude::*, system_program},
    anchor_spl::{associated_token, token},
};

pub fn sell(ctx: Context<SellNft>, sale_lamports: u64) -> Result<()> {
    msg!("Initiating transfer of {} lamports...", sale_lamports);
    msg!(
        "Purchaser (sending lamports): {}",
        ctx.accounts.buyer_authority.key()
    );
    msg!(
        "Seller (receiving lamports): {}",
        ctx.accounts.owner_authority.key()
    );

    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.buyer_authority.to_account_info(),
                to: ctx.accounts.owner_authority.to_account_info(),
            },
        ),
        sale_lamports,
    )?;
    msg!("Lamports transferred successfully.");

    msg!("Transferring NFT...");
    msg!(
        "Owner Token Address: {}",
        ctx.accounts.owner_token_account.key()
    );
    msg!(
        "Buyer Token Address: {}",
        ctx.accounts.buyer_token_account.key()
    );

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.owner_token_account.to_account_info(),
                to: ctx.accounts.buyer_token_account.to_account_info(),
                authority: ctx.accounts.owner_authority.to_account_info(),
            },
        ),
        1,
    )?;
    msg!("NFT transferred successfully.");

    msg!("Sale completed successfully!");
    Ok(())
}

#[derive(Accounts)]
pub struct SellNft<'info> {
    #[account(mut)]
    pub mint: Account<'info, token::Mint>,

    #[account(mut)]
    pub owner_token_account: Account<'info, token::TokenAccount>,

    #[account(mut)]
    pub owner_authority: Signer<'info>,

    #[account(
        init_if_needed,
        payer = buyer_authority,
        associated_token::mint = mint,
        associated_token::authority = buyer_authority
    )]
    pub buyer_token_account: Account<'info, token::TokenAccount>,

    #[account(mut)]
    pub buyer_authority: Signer<'info>,

    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, token::Token>,
    pub associated_token_program: Program<'info, associated_token::AssociatedToken>,
}
