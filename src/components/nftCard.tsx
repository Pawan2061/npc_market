"use client";

import { Tilt } from "@/components/ui/tilt";
import { Spotlight } from "./ui/spotlight";
import { IsSold, NFT, useNFTStore } from "@/store/nftStore";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, BadgeInfo } from "lucide-react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl, PublicKey, SystemProgram } from "@solana/web3.js";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";
import { uploadToIPFS } from "@/utils/ipfs";
import { web3 } from "@coral-xyz/anchor";
import Image from "next/image";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";

function NftCard() {
  const nfts = useNFTStore((state) => state.nfts);
  const { wallet, signMessage } = useWallet();
  const router = useRouter();
  const connection = new web3.Connection(
    web3.clusterApiUrl("devnet"),
    "confirmed"
  );
  const updateNFT = useNFTStore((state) => state.updateNFT);
  const { getNFTById } = useNFTStore();

  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState<"all" | "available" | "sold">("all");

  const priceInputRef = useRef<HTMLInputElement>(null);

  const handleSelectNft = (id: number) => {
    const nft = getNFTById(id);
    if (nft) {
      setSelectedNft(nft);
      setShowModal(true);
    }
  };

  const handlePlaceBid = async () => {
    if (!selectedNft || !wallet?.adapter.publicKey) return;

    if (selectedNft.owner === wallet.adapter.publicKey.toString()) {
      toast.error("cannot bid your own nft");
      return;
    }

    if (!selectedNft.price) {
      selectedNft.price = 0;
    }

    try {
      await updateNFT(selectedNft.id, {
        isSold: IsSold.sold,
        biddedBy: wallet.adapter.publicKey.toString(),
        owner: wallet.adapter.publicKey.toString(),
      });

      const toPubkey = new PublicKey(selectedNft.owner!);
      const lamports = selectedNft.price * 1e9;

      const transaction = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey: wallet.adapter.publicKey,
          toPubkey: toPubkey,
          lamports: web3.LAMPORTS_PER_SOL * selectedNft.price,
        })
      );
      const signature = await wallet.adapter.sendTransaction(
        transaction,
        connection
      );

      await connection.confirmTransaction(signature, "confirmed");

      console.log(`Transaction confirmed. Signature: ${signature}`);

      setShowModal(false);
    } catch (err) {
      console.error("Failed to place bid:", err);
    }
  };

  if (!wallet?.adapter) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-zinc-400">Connect your wallet to view NFTs</p>
      </div>
    );
  }

  const filteredNFTs = nfts.filter((nft) => {
    if (tab === "available") return nft.isSold === IsSold.available;
    if (tab === "sold") return nft.isSold === IsSold.sold;
    return true;
  });
  console.log(filteredNFTs, "nfts");

  return (
    <>
      <Toaster position="top-center" richColors expand closeButton />

      <div className="flex justify-center gap-4 pt-6">
        {["all", "available", "sold"].map((key) => (
          <Button
            key={key}
            variant={tab === key ? "default" : "secondary"}
            onClick={() => setTab(key as typeof tab)}
            className={`capitalize ${
              tab === key
                ? "bg-white text-black dark:bg-white dark:text-black"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {key}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8 w-full">
        {filteredNFTs.map((nft) => (
          <div
            key={nft.id}
            className="flex flex-col rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-xl hover:shadow-2xl transition-all duration-300 border border-zinc-800 hover:border-zinc-700 group"
          >
            <Tilt
              rotationFactor={6}
              isRevese
              style={{ transformOrigin: "center center" }}
              springOptions={{
                stiffness: 26.7,
                damping: 4.1,
                mass: 0.2,
              }}
              className="relative h-56 w-full overflow-hidden"
            >
              <Spotlight
                className="z-10 from-white/50 via-white/20 to-white/10 blur-2xl"
                size={250}
                springOptions={{
                  stiffness: 26.7,
                  damping: 4.1,
                  mass: 0.2,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image
                width={50}
                height={50}
                src={nft.image}
                alt={nft.name}
                className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition duration-700 scale-100 group-hover:scale-105"
              />
              {nft.isSold === IsSold.available && (
                <div className="absolute top-4 right-4 bg-green-500/90 text-white text-xs font-medium px-2 py-1 rounded-full z-20">
                  Available
                </div>
              )}

              {nft.isSold === IsSold.sold && (
                <div className="absolute top-4 right-4 bg-red-500/90 text-white text-xs font-medium px-2 py-1 rounded-full z-20">
                  Sold
                </div>
              )}
            </Tilt>
            <div className="flex flex-col p-5 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-mono text-lg font-bold text-white truncate">
                  {nft.name}
                </h3>
                <span className="text-xs font-semibold px-2 py-1 bg-zinc-800 rounded-md text-zinc-400">
                  {nft.symbol}
                </span>
              </div>

              <p className="text-sm text-zinc-400 line-clamp-2">
                {nft.description}
              </p>

              <div className="flex justify-between items-center mt-2 pt-3 border-t border-zinc-800">
                <div className="text-sm">
                  <span className="text-zinc-500">Price</span>
                  <div className="text-lg font-bold text-white flex items-center">
                    {nft.price} <span className="text-green-400 ml-1">SOL</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {nft.isSold === IsSold.available && (
                    <Button
                      onClick={() => handleSelectNft(nft.id)}
                      className="px-4 py-2 mt-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg flex items-center gap-1 text-sm"
                      variant="default"
                    >
                      <PlusCircle size={14} />
                      Buy
                    </Button>
                  )}

                  <Button
                    onClick={() => {
                      console.log(nft.mintedNftAddress);

                      const url = `https://explorer.solana.com/address/${nft.mintedNftAddress}?cluster=devnet`;
                      window.open(url, "_blank");
                    }}
                    className="px-4 py-2 mt-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg flex items-center gap-1 text-sm"
                    variant="default"
                  >
                    <BadgeInfo size={14} />
                  </Button>

                  {nft.isSold === IsSold.sold && (
                    <span className="text-xs font-medium px-2 py-1 bg-yellow-600 rounded-md text-white">
                      {nft.biddedBy &&
                        `${nft.biddedBy.slice(0, 4)}...${nft.biddedBy.slice(
                          -4
                        )}`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedNft && (
        <div className="fixed  inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-6">
              {selectedNft.name}
            </h4>

            <div className="flex justify-center items-center">
              <motion.div
                key={"image"}
                style={{
                  rotate: Math.random() * 20 - 10,
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: 0,
                  zIndex: 100,
                }}
                whileTap={{
                  scale: 1.1,
                  rotate: 0,
                  zIndex: 100,
                }}
                className="rounded-xl mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
              >
                <Image
                  width={20}
                  height={20}
                  src={selectedNft.image}
                  alt={selectedNft.name}
                  className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
                />
              </motion.div>
            </div>

            <div className="py-8 flex flex-wrap gap-x-4 gap-y-6 items-start justify-start max-w-sm mx-auto">
              <div className="flex flex-col space-y-2 w-full">
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Price: {selectedNft.price} SOL
                </span>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  {selectedNft.description}
                </p>
                <span className="text-xs font-semibold px-2 py-1 bg-zinc-800 rounded-md text-zinc-400 w-fit">
                  {selectedNft.symbol}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-zinc-800">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="w-28 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handlePlaceBid}
                disabled={!wallet?.adapter.publicKey}
                className="w-28 bg-black text-white dark:bg-white dark:text-black border border-black"
              >
                Place Bid
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export { NftCard };
