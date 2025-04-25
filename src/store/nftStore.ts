import { create } from "zustand";

type NFT = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  owner?: string;
  isSold: boolean;
};

type NFTStore = {
  nfts: NFT[];
  getNFTs: () => NFT[];
  addNFT: (nft: NFT) => void;
  updateNFT: (id: number, data: Partial<NFT>) => void;
  sellNFT: (id: number, newOwner: string) => void;
};

export const useNFTStore = create<NFTStore>((set, get) => ({
  nfts: [
    {
      id: 1,
      name: "Cosmic Explorer",
      description: "A digital explorer traversing the cosmos",
      image: "https://picsum.photos/seed/cosmic/800/800",
      price: "0.5 SOL",
      isSold: false,
      owner: undefined,
    },
  ],
  getNFTs: () => get().nfts,
  addNFT: (nft) =>
    set((state) => ({
      nfts: [...state.nfts, nft],
    })),
  updateNFT: (id, data) =>
    set((state) => ({
      nfts: state.nfts.map((nft) =>
        nft.id === id ? { ...nft, ...data } : nft
      ),
    })),
  sellNFT: (id, newOwner) =>
    set((state) => ({
      nfts: state.nfts.map((nft) =>
        nft.id === id ? { ...nft, isSold: true, owner: newOwner } : nft
      ),
    })),
}));
