import { ShoppingCart, Plus } from "lucide-react";

function NFTPriceActions() {
  return (
    <div className="bg-zinc-900 p-4 rounded-lg flex items-center justify-between mt-2">
      <div>
        <div className="text-zinc-500 text-sm mb-1">Price</div>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-white">0.5</span>
          {/* <img
            width={20}
            height={20}
            src="https://cdn.iconscout.com/icon/premium/png-256-thumb/solana-8544144-7002700.png"
            alt=""
          /> */}
          <span className="text-green-400 text-2xl ml-2 font-medium">SOL</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-full flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 rounded-full">
            Bid Nft
            {/* <ShoppingCart size={12} /> */}
            {/* <span>Buy</span> */}
          </div>
          {/* <span>Now</span> */}
        </button>

        <button className="bg-zinc-800 hover:bg-zinc-700 h-10 w-10 text-white font-medium rounded-full flex items-center justify-center">
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}

export { NFTPriceActions };
