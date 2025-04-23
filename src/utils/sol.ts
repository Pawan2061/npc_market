import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  SYSVAR_RENT_PUBKEY,
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
// import {
//   findMetadataPda,
//   findMasterEditionPda,
// } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";

import { uploadToIPFS } from "@/utils/ipfs";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

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
  connection: any;
  wallet: any;
  program: any;
}) => {
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

  const tx = new Transaction();
  console.log(wallet.publicKey.toBase58(), "is here");

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

  try {
    const signedTx = await wallet.sendTransaction(tx, connection);
    console.log(signedTx, "signed tx is here");
    await connection.confirmTransaction(signedTx, "confirmed");
  } catch (error) {
    console.error("Transaction error details:", error);
    throw error;
  }

  //   await connection.confirmTransaction(signedTx, "confirmed");

  await program.methods
    .mintNewNft(metadataTitle, metadataSymbol, metadataUri)
    .accounts({
      mint: mint.publicKey,
      tokenAccount,
      metadata: metadataPDA,
      masterEdition: masterEditionPDA,
      mintAuthority: wallet.publicKey,
      payer: wallet.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
      tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
    })
    .signers([mint])
    .rpc();

  console.log("NFT minted:", mint.publicKey.toBase58());
};
