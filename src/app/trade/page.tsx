"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { marketContainerVariants, marketItemVariants } from "@/utils/motion";
import { NftCard } from "@/components/nftCard";
import { useEffect } from "react";
import { useNFTStore } from "@/store/nftStore";
import { BiddedNfts } from "@/components/bidded-nfts";

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
          <h1 className="text-3xl font-bold">Your Arena</h1>
        </motion.div>

        <motion.div
          variants={marketContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <BiddedNfts />
        </motion.div>
      </div>
    </div>
  );
}
