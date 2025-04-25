"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { marketContainerVariants, marketItemVariants } from "@/utils/motion";

const mockNfts = [
  {
    id: 1,
    name: "Cosmic Explorer",
    description: "A digital explorer traversing the cosmos",
    image: "https://picsum.photos/seed/cosmic/800/800",
    price: "0.5 SOL",
  },
  {
    id: 2,
    name: "Digital Dreamer",
    description: "A surreal digital art piece",
    image: "https://picsum.photos/seed/dreamer/800/800",
    price: "0.3 SOL",
  },
  {
    id: 3,
    name: "Neon Warrior",
    description: "A cyberpunk warrior in neon lights",
    image: "https://picsum.photos/seed/neon/800/800",
    price: "0.7 SOL",
  },
  {
    id: 4,
    name: "Abstract Mind",
    description: "An abstract representation of consciousness",
    image: "https://picsum.photos/seed/abstract/800/800",
    price: "0.4 SOL",
  },
];

export default function Market() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <Link href="/">
            <Button variant="ghost" className="group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">NFT Marketplace</h1>
        </motion.div>

        <motion.div
          variants={marketContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {mockNfts.map((nft) => (
            <motion.div
              key={nft.id}
              variants={marketItemVariants}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="overflow-hidden">
                <div className="relative aspect-square">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{nft.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {nft.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{nft.price}</span>
                    <Button size="sm" className="group">
                      Buy{" "}
                      <ShoppingCart className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
