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
  if (!wallet.connected || !wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  console.log("Starting NFT mint process");
  console.log("Wallet public key:", wallet.publicKey.toBase58());

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

  try {
    const balance = await connection.getBalance(wallet.publicKey);
    console.log("Wallet balance:", balance / 1000000000, "SOL");

    const tx = new Transaction();

    // Add a recent blockhash
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.feePayer = wallet.publicKey;

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

    console.log("Sending transaction...");
    const signedTx = await wallet.sendTransaction(tx, connection, {
      signers: [mint],
    });

    console.log("Transaction sent:", signedTx);
    console.log("Confirming transaction...");

    await connection.confirmTransaction(signedTx, "confirmed");
    console.log("First transaction confirmed");

    await program.methods
      .mintNewNft(metadataTitle, metadataUri, metadataSymbol)
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
    return mint.publicKey.toBase58();
  } catch (error) {
    console.error("Error details:", error);

    if (error) {
      throw new Error("Not enough SOL in wallet to complete transaction");
    }

    throw error;
  }
};
