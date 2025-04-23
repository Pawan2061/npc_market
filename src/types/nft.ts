type NFTAttribute = {
  trait_type: string;
  value: string;
};

export type NFTMetadata = {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
};

export interface MintNftArgs {
  metadataTitle: string;
  metadataSymbol: string;
  metadataUri: string;
}
