import { Tilt } from "@/components/ui/tilt";
import { Spotlight } from "./ui/spotlight";
import { useNFTStore } from "@/store/nftStore";
import { Button } from "@/components/ui/button";

function NftCard() {
  const nfts = useNFTStore((state) => state.nfts);
  console.log(nfts, "are here boiz");

  const sellNFT = useNFTStore((state) => state.sellNFT);

  const handleBuy = (id: number) => {
    sellNFT(id, "0xUserWalletAddress");
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6 w-full max-w-full">
      {nfts.map((nft) => (
        <div
          key={nft.id}
          className="flex flex-col rounded-xl overflow-hidden bg-zinc-900 shadow-md hover:shadow-lg transition duration-300"
        >
          <Tilt
            rotationFactor={8}
            isRevese
            style={{ transformOrigin: "center center" }}
            springOptions={{
              stiffness: 26.7,
              damping: 4.1,
              mass: 0.2,
            }}
            className="relative h-48 w-full overflow-hidden"
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
            <img
              src={nft.image}
              alt={nft.name}
              className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition duration-700"
            />
          </Tilt>
          <div className="flex flex-col p-4 space-y-2">
            <h3 className="font-mono text-md font-semibold text-zinc-300 truncate">
              {nft.name}
            </h3>
            <p className="text-sm text-zinc-400 line-clamp-2">
              {nft.description}
            </p>
            <div className="text-sm text-zinc-400">
              <span className="font-semibold">Price:</span> {nft.price}{" "}
              <span className="text-green-400">SOL</span>
            </div>
            <div className="text-sm text-zinc-400">
              {nft.isSold ? (
                <span className="text-green-400">Owner: {nft.owner}</span>
              ) : (
                <span className="text-yellow-400">Available</span>
              )}
            </div>
            {!nft.isSold && (
              <Button
                onClick={() => handleBuy(nft.id)}
                className="mt-2 w-full"
                variant="default"
              >
                Buy NFT
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export { NftCard };
