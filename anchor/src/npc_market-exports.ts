// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Cluster, PublicKey } from "@solana/web3.js";
import NpcMarketIDL from "../target/idl/npc_market.json";
import type { NpcMarket } from "../target/types/npc_market";

// Re-export the generated IDL and type
export { NpcMarket, NpcMarketIDL };

// The programId is imported from the program IDL.
export const NPC_MARKET_PROGRAM_ID = new PublicKey(NpcMarketIDL.address);
// This is a helper function to get the NpcMarket Anchor program.
export function getNpcMarketProgram(
  provider: AnchorProvider,
  address?: PublicKey
) {
  return new Program<NpcMarket>(
    {
      ...NpcMarketIDL,
      address: address ? address.toBase58() : NpcMarketIDL.address,
    } as NpcMarket,
    provider
  );
}

// This is a helper function to get the program ID for the NpcMarket program depending on the cluster.
export function getNpcMarketProgramId(cluster: Cluster) {
  switch (cluster) {
    case "devnet":
      return new PublicKey(NpcMarketIDL.address);

    case "testnet":
      // This is the program ID for the NpcMarket program on devnet and testnet.
      return new PublicKey(NpcMarketIDL.address);
    case "mainnet-beta":
    default:
      return NPC_MARKET_PROGRAM_ID;
  }
}
