'use client'

import { getNpcMarketProgram, getNpcMarketProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useNpcMarketProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getNpcMarketProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getNpcMarketProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['npc_market', 'all', { cluster }],
    queryFn: () => program.account.npc_market.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['npc_market', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ npc_market: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useNpcMarketProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useNpcMarketProgram()

  const accountQuery = useQuery({
    queryKey: ['npc_market', 'fetch', { cluster, account }],
    queryFn: () => program.account.npc_market.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['npc_market', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ npc_market: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['npc_market', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ npc_market: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['npc_market', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ npc_market: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['npc_market', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ npc_market: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
