// import { web3 } from "@coral-xyz/anchor";
// import { useWallet } from "@solana/wallet-adapter-react";
// const wallet = useWallet();

// export const TransferSol = async (amount: number, to: string) => {
//   if (!wallet?.publicKey) {
//     console.error("No wallet connected");
//     return;
//   }

//   try {
//     const connection = new web3.Connection(
//       web3.clusterApiUrl("devnet"),
//       "confirmed"
//     );
//     const from = wallet.publicKey;
//     const toPublicKey = new web3.PublicKey(to);

//     const transaction = new web3.Transaction().add(
//       web3.SystemProgram.transfer({
//         fromPubkey: from,
//         toPubkey: toPublicKey,
//         lamports: web3.LAMPORTS_PER_SOL * amount,
//       })
//     );
//     const signature = await wallet.sendTransaction(transaction, connection);

//     await connection.confirmTransaction(signature, "confirmed");

//     console.log(`Transaction confirmed. Signature: ${signature}`);
//   } catch (error) {
//     console.error("Error during SOL transfer:", error);
//   }
// };
