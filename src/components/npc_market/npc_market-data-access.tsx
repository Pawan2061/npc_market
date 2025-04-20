"use client";

import { getNpcMarketProgram, getNpcMarketProgramId } from "@project/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, Keypair, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";

export function useNpcMarketProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();

  const programId = useMemo(
    () => getNpcMarketProgramId(cluster.network as Cluster),
    [cluster]
  );

  const program = useMemo(
    () => getNpcMarketProgram(provider, programId),
    [provider, programId]
  );

  const marketConfigs = useQuery({
    queryKey: ["npc_market", "marketConfig", { cluster }],
    queryFn: () => program.account.marketConfig.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  // const initializeMarket = useMutation({
  //   mutationKey: ["npc_market", "initializeMarket", { cluster }],
  //   mutationFn: ({
  //     keypair,
  //     marketName,
  //   }: {
  //     keypair: Keypair;
  //     marketName: string;
  //   }) =>
  //     program.methods
  //       .initNewMarket(marketName)
  //       .accounts({
  //         authority: provider.wallet.publicKey,
  //         npcMarket: keypair.publicKey, // Correcting this as per program's requirements
  //         systemProgram: PublicKey.default,
  //       })
  //       .signers([keypair])
  //       .rpc(),
  //   onSuccess: (signature) => {
  //     transactionToast(signature);
  //     return marketConfigs.refetch();
  //   },
  //   onError: () => toast.error("Failed to initialize market"),
  // });

  return {
    program,
    programId,
    marketConfigs,
    getProgramAccount,
    // initializeMarket,
  };
}

export function useMarketConfigAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, marketConfigs } = useNpcMarketProgram();

  const accountQuery = useQuery({
    queryKey: ["npc_market", "marketConfigFetch", { cluster, account }],
    queryFn: () => program.account.marketConfig.fetch(account),
  });

  // const closeMarket = useMutation({
  //   mutationKey: ["npc_market", "closeMarket", { cluster, account }],
  //   mutationFn: () =>
  //     program.methods
  //       .closeMarket() // Ensure the method exists and is correctly implemented
  //       .accounts({
  //         npcMarket: account, // Fixing the account structure
  //         systemProgram: PublicKey.default,
  //       })
  //       .rpc(),
  //   onSuccess: (tx) => {
  //     transactionToast(tx);
  //     return marketConfigs.refetch();
  //   },
  //   onError: () => toast.error("Failed to close market"),
  // });

  return {
    accountQuery,
  };
}
