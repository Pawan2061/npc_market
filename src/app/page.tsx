import DashboardFeature from "@/components/dashboard/dashboard-feature";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { NpcMarketIDL } from "@project/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";

export default function Page() {
  return <DashboardFeature />;
}
