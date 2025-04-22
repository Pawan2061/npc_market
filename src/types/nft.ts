type NFTAttribute = {
  trait_type: string;
  value: string;
};

export type NFTMetadata = {
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
};
