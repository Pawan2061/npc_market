import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  SYSVAR_RENT_PUBKEY,
  Connection,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import {
  findMetadataPda,
  findMasterEditionPda,
  mplTokenMetadata,
  MPL_TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Program } from "@coral-xyz/anchor";
import { NpcMarket } from "@project/anchor";

export const mintNftWithMetadata = async ({
  metadataTitle,
  metadataSymbol,
  metadataUri,
  connection,
  wallet,
  program,
}: {
  metadataTitle: string;
  metadataSymbol: string;
  metadataUri: string;
  connection: Connection;
  wallet: WalletContextState;
  program: Program<NpcMarket>;
}) => {
  console.log(Object.keys(program.methods));

  if (!wallet.connected || !wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected or missing signing methods");
  }

  console.log(program.methods);

  const mint = Keypair.generate();
  const umi = createUmi(connection);
  umi.use(mplTokenMetadata());

  const tokenAccount = await getAssociatedTokenAddress(
    mint.publicKey,
    wallet.publicKey
  );

  const metadataPDA = findMetadataPda(umi, {
    mint: publicKey(mint.publicKey.toBase58()),
  });

  const masterEditionPDA = findMasterEditionPda(umi, {
    mint: publicKey(mint.publicKey.toBase58()),
  });
  console.log(
    "Signers:",
    mint.publicKey.toBase58(),
    wallet.publicKey.toBase58()
  );

  try {
    const tx = new Transaction();
    tx.feePayer = wallet.publicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    tx.add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mint.publicKey,
        space: 82,
        lamports: await connection.getMinimumBalanceForRentExemption(82),
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mint.publicKey,
        0,
        wallet.publicKey,
        wallet.publicKey
      ),
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        tokenAccount,
        wallet.publicKey,
        mint.publicKey
      )
    );

    tx.partialSign(mint);

    const signedTx = await wallet.signTransaction(tx);

    const txId = await connection.sendRawTransaction(signedTx.serialize());
    await connection.confirmTransaction(txId, "confirmed");
    console.log("Mint keypair (base58):", mint.publicKey.toBase58());

    try {
      const ix = await program.methods
        .mintNewNft(metadataTitle, metadataUri, metadataSymbol)
        .accounts({
          mint: mint.publicKey,
          tokenAccount: tokenAccount,
          metadata: new PublicKey(metadataPDA[0]),
          masterEdition: new PublicKey(masterEditionPDA[0]),
          mintAuthority: wallet.publicKey,
          payer: wallet.publicKey,
          tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
        })

        .rpc();

      return mint.publicKey.toBase58();
    } catch (error) {
      console.error("Error during NFT minting:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error during NFT minting:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "An unknown error occurred during minting"
    );
  }
};
