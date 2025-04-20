"use client";
import { useCluster } from "@/components/cluster/cluster-data-access";
import DashboardFeature from "@/components/dashboard/dashboard-feature";
import { useAnchorProvider } from "@/components/solana/solana-provider";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import {
  getNpcMarketProgram,
  getNpcMarketProgramId,
  NpcMarketIDL,
} from "@project/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Cluster, Connection, PublicKey } from "@solana/web3.js";
import { useMemo, useState } from "react";

export default function Page() {
  const provider = useAnchorProvider();
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const [marketName, setMarketName] = useState("");
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null
  );

  const programId = getNpcMarketProgramId(cluster.network as Cluster);
  const program = useMemo(
    () => getNpcMarketProgram(provider, programId),
    [provider, programId]
  );

  const handleCreateMarket = async () => {
    try {
      setTransactionStatus("Creating new market...");
      const tx = await program.methods
        .initNewMarket(marketName)

        .rpc();
      setTransactionStatus(`Market created successfully: ${tx}`);
    } catch (error) {
      setTransactionStatus(`Error: ${error}`);
    }
  };
  program.methods.bidNft({});

  return (
    // <div className="">
    //   <input
    //     type="text"
    //     value={marketName}
    //     onChange={(e) => setMarketName(e.target.value)}
    //     placeholder="Enter Market Name"
    //   />
    //   <button onClick={handleCreateMarket}>Create Market</button>
    //   {transactionStatus && <p>{transactionStatus}</p>}
    // </div>
    <h1>hi</h1>
  );
}
