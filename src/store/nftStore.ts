import { create } from "zustand";
import { persist } from "zustand/middleware";

export enum IsSold {
  available,
  bidded,
  sold,
}

export type NFT = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  owner?: string;
  symbol: string;
  isSold: IsSold;
};

type NFTStore = {
  nfts: NFT[];
  getNFTs: () => NFT[];
  getNFTById: (id: number) => NFT | undefined;
  addNFT: (nft: NFT) => void;
  updateNFT: (id: number, data: Partial<NFT>) => void;
  sellNFT: (id: number, newOwner: string) => void;
  getNFTsByUser: (address: string) => NFT[]; // <- ADDED this
};

export const useNFTStore = create<NFTStore>()(
  persist(
    (set, get) => ({
      nfts: [
        // {
        //   id: 1,
        //   name: "Cosmic Explorer",
        //   description: "A digital explorer traversing the cosmos",
        //   image: "https://picsum.photos/seed/cosmic/800/800",
        //   price: 0.5,
        //   symbol: "COSNFT",
        //   isSold: false,
        //   owner: undefined,
        // },
        {
          id: 2,
          name: "Digital Dreamer",
          description: "A surreal digital art piece",
          image: "https://picsum.photos/seed/dreamer/800/800",
          price: 0.3,
          symbol: "DREAMNFT",
          isSold: IsSold.available,
          owner: undefined,
        },
        {
          id: 3,
          name: "Neon Warrior",
          description: "A cyberpunk warrior in neon lights",
          image: "https://picsum.photos/seed/neon/800/800",
          price: 0.7,
          symbol: "DREAMNFT",
          isSold: IsSold.available,
          owner: undefined,
        },
        {
          id: 4,
          name: "Abstract Mind",
          description: "An abstract representation of consciousness",
          image: "https://picsum.photos/seed/abstract/800/800",
          price: 0.4,
          symbol: "DREAMNFT",
          isSold: IsSold.available,
          owner: undefined,
        },
      ],
      getNFTs: () => get().nfts,
      getNFTById: (id) => get().nfts.find((nft) => nft.id === id),
      addNFT: (nft) =>
        set((state) => ({
          nfts: [...state.nfts, nft],
        })),

      getNFTsByUser: (address) =>
        get().nfts.filter((nft) => nft.owner === address),
      updateNFT: (id, data) =>
        set((state) => ({
          nfts: state.nfts.map((nft) =>
            nft.id === id ? { ...nft, ...data } : nft
          ),
        })),
      sellNFT: (id, newOwner) =>
        set((state) => ({
          nfts: state.nfts.map((nft) =>
            nft.id === id
              ? { ...nft, isSold: IsSold.sold, owner: newOwner }
              : nft
          ),
        })),
    }),
    {
      name: "nft-storage",
    }
  )
);
