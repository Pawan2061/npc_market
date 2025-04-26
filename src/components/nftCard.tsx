import { Tilt } from "@/components/ui/tilt";
import { Spotlight } from "./ui/spotlight";
import { NFT, useNFTStore } from "@/store/nftStore";
import { Button } from "@/components/ui/button";
import { PlusCircle, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { AnimatedModalDemo } from "./nft-update";
import { ModalTrigger } from "./ui/animated-modal";

function NftCard() {
  const nfts = useNFTStore((state) => state.nfts);
  const [selectedNft, setSelectedNft] = useState<NFT | null | undefined>(null);
  const { getNFTById } = useNFTStore();
  const sellNFT = useNFTStore((state) => state.sellNFT);
  const [show, setShow] = useState(false);

  const handleBuy = (id: number) => {
    const nft = getNFTById(id);
    setSelectedNft(nft); // Set the selected NFT
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8 w-full">
      {nfts.map((nft) => (
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
            <img
              src={nft.image}
              alt={nft.name}
              className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition duration-700 scale-100 group-hover:scale-105"
            />
            {!nft.isSold && (
              <div className="absolute top-4 right-4 bg-green-500/90 text-white text-xs font-medium px-2 py-1 rounded-full z-20">
                Available
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
                {/* <AnimatedModalDemo selectedNft={selectedNft} />{" "} */}
                <>
                  <AnimatedModalDemo selectedNft={selectedNft} />
                </>

                {/* Pass selectedNft */}
                <Button
                  onClick={() => handleBuy(nft.id)}
                  className="px-4 py-2 mt-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg flex items-center gap-1 text-sm"
                  variant="default"
                >
                  <PlusCircle size={14} />
                  Bid
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export { NftCard };
