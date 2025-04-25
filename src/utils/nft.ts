import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
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

interface MintNftParams {
  metadataTitle: string;
  metadataSymbol: string;
  metadataUri: string;
  connection: Connection;
  wallet: WalletContextState;
  program: Program<NpcMarket>;
}

export const mintNft = async ({
  metadataTitle,
  metadataSymbol,
  metadataUri,
  connection,
  wallet,
  program,
}: MintNftParams): Promise<string> => {
  if (!wallet.connected || !wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Wallet not connected or missing signing methods");
  }

  // Initialize UMI for Metaplex
  const umi = createUmi(connection);
  umi.use(mplTokenMetadata());

  // Generate mint keypair
  const mint = Keypair.generate();
  console.log("Generated mint:", mint.publicKey.toBase58());

  // Get associated token account address
  const tokenAccount = await getAssociatedTokenAddress(
    mint.publicKey,
    wallet.publicKey
  );

  // Get PDAs for metadata and master edition
  const metadataPDA = findMetadataPda(umi, {
    mint: publicKey(mint.publicKey.toBase58()),
  });

  const masterEditionPDA = findMasterEditionPda(umi, {
    mint: publicKey(mint.publicKey.toBase58()),
  });

  try {
    // Create mint account transaction
    const createMintTx = new Transaction();
    createMintTx.feePayer = wallet.publicKey;
    createMintTx.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    // Add instructions to create mint account and token account
    createMintTx.add(
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

    // Sign and send create mint transaction
    const signedCreateMintTx = await wallet.signTransaction(createMintTx);
    signedCreateMintTx.partialSign(mint);
    const createMintTxId = await connection.sendRawTransaction(
      signedCreateMintTx.serialize()
    );
    await connection.confirmTransaction(createMintTxId, "confirmed");

    // Mint NFT using program
    const mintTx = await program.methods
      .mintNewNft(metadataTitle, metadataUri, metadataSymbol)
      .accounts({
        mint: mint.publicKey,
        tokenAccount,
        metadata: new PublicKey(metadataPDA[0]),
        masterEdition: new PublicKey(masterEditionPDA[0]),
        mintAuthority: wallet.publicKey,
        payer: wallet.publicKey,
        tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
      })
      .remainingAccounts([
        { pubkey: TOKEN_PROGRAM_ID, isWritable: false, isSigner: false },
        { pubkey: SystemProgram.programId, isWritable: false, isSigner: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isWritable: false, isSigner: false },
      ])
      .signers([mint])
      .rpc();

    console.log("NFT minted successfully!");
    console.log("Mint address:", mint.publicKey.toBase58());
    console.log("Transaction signature:", mintTx);

    return mint.publicKey.toBase58();
  } catch (error) {
    console.error("Error during NFT minting:", error);
    throw error;
  }
};
