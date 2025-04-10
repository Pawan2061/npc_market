import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { NpcMarket } from '../target/types/npc_market'

describe('npc_market', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.NpcMarket as Program<NpcMarket>

  const npc_marketKeypair = Keypair.generate()

  it('Initialize NpcMarket', async () => {
    await program.methods
      .initialize()
      .accounts({
        npc_market: npc_marketKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([npc_marketKeypair])
      .rpc()

    const currentCount = await program.account.npc_market.fetch(npc_marketKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment NpcMarket', async () => {
    await program.methods.increment().accounts({ npc_market: npc_marketKeypair.publicKey }).rpc()

    const currentCount = await program.account.npc_market.fetch(npc_marketKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment NpcMarket Again', async () => {
    await program.methods.increment().accounts({ npc_market: npc_marketKeypair.publicKey }).rpc()

    const currentCount = await program.account.npc_market.fetch(npc_marketKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement NpcMarket', async () => {
    await program.methods.decrement().accounts({ npc_market: npc_marketKeypair.publicKey }).rpc()

    const currentCount = await program.account.npc_market.fetch(npc_marketKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set npc_market value', async () => {
    await program.methods.set(42).accounts({ npc_market: npc_marketKeypair.publicKey }).rpc()

    const currentCount = await program.account.npc_market.fetch(npc_marketKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the npc_market account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        npc_market: npc_marketKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.npc_market.fetchNullable(npc_marketKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
