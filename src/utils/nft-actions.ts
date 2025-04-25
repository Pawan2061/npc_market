import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Program } from "@coral-xyz/anchor";
import { NpcMarket } from "@project/anchor";
import {
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
} from "@solana/spl-token";
import { Keypair } from "@solana/web3.js";

interface MintNftActionParams {
  metadataTitle: string;
  metadataSymbol: string;
  metadataUri: string;
  connection: Connection;
  wallet: WalletContextState;
  program: Program<NpcMarket>;
}

export const createMintNftAction = async ({
  metadataTitle,
  metadataSymbol,
  metadataUri,
  connection,
  wallet,
  program,
}: MintNftActionParams) => {
  if (!wallet.connected || !wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  const mint = Keypair.generate();
  console.log("Generated mint:", mint.publicKey.toBase58());

  const tokenAccount = await getAssociatedTokenAddress(
    mint.publicKey,
    wallet.publicKey
  );

  const createMintTx = new Transaction();
  createMintTx.feePayer = wallet.publicKey;
  createMintTx.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;

  createMintTx.add(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mint.publicKey,
      space: MINT_SIZE,
      lamports: await connection.getMinimumBalanceForRentExemption(MINT_SIZE),
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

  const mintTx = new Transaction();
  mintTx.feePayer = wallet.publicKey;
  mintTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  const instruction = await program.methods
    .mintNewNft(metadataTitle, metadataUri, metadataSymbol)
    .accounts({
      mint: mint.publicKey,
      tokenAccount,
      metadata: PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          new PublicKey(
            "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
          ).toBuffer(),
          mint.publicKey.toBuffer(),
        ],
        new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
      )[0],
      masterEdition: PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          new PublicKey(
            "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
          ).toBuffer(),
          mint.publicKey.toBuffer(),
          Buffer.from("edition"),
        ],
        new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
      )[0],
      mintAuthority: wallet.publicKey,
      payer: wallet.publicKey,
      tokenMetadataProgram: new PublicKey(
        "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
      ),
    })
    .remainingAccounts([
      { pubkey: TOKEN_PROGRAM_ID, isWritable: false, isSigner: false },
      { pubkey: SystemProgram.programId, isWritable: false, isSigner: false },
      {
        pubkey: new PublicKey("SysvarRent111111111111111111111111111111111"),
        isWritable: false,
        isSigner: false,
      },
    ])
    .signers([mint])
    .instruction();

  mintTx.add(instruction);
  mintTx.sign(mint);

  return {
    createMintTx,
    mintTx,
    mint,
  };
};

export const executeMintNftAction = async (
  createMintTx: Transaction,
  mintTx: Transaction,
  mint: Keypair,
  wallet: WalletContextState,
  connection: Connection
) => {
  if (!wallet.signTransaction) {
    throw new Error("Wallet does not support signing transactions");
  }

  try {
    const signedCreateMintTx = await wallet.signTransaction(createMintTx);
    signedCreateMintTx.partialSign(mint);
    const createMintTxId = await connection.sendRawTransaction(
      signedCreateMintTx.serialize()
    );
    await connection.confirmTransaction(createMintTxId, "confirmed");

    const signedMintTx = await wallet.signTransaction(mintTx);
    const mintTxId = await connection.sendRawTransaction(
      signedMintTx.serialize()
    );
    await connection.confirmTransaction(mintTxId, "confirmed");

    return mintTxId;
  } catch (error) {
    console.error("Error executing mint NFT action:", error);
    throw error;
  }
};
