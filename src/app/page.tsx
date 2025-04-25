"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, ShoppingCart } from "lucide-react";
import { containerVariants, fadeInUp, itemVariants } from "@/utils/motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary text-white">
      <div className="bg-background bg-opacity-90 min-h-screen">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative h-screen flex items-center justify-center overflow-hidden"
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          />

          <div className="container mx-auto px-4 z-10">
            <motion.div
              variants={itemVariants}
              className="text-center max-w-3xl mx-auto"
            >
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Create & Trade AI-Generated NFTs
              </motion.h1>
              <motion.p
                className="text-xl text-muted-foreground mb-8"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Experience the future of digital art with our AI-powered NFT
                marketplace. Create unique NFTs with just a description and
                trade them in our vibrant marketplace.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link href="/mint">
                  <Button size="lg" className="group">
                    Create with AI{" "}
                    <Sparkles className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  </Button>
                </Link>
                <Link href="/market">
                  <Button size="lg" variant="outline" className="group">
                    Explore Market{" "}
                    <ShoppingCart className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="py-20"
        >
          <div className="container mx-auto px-4">
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-center mb-12"
            >
              Why Choose Our Platform?
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "AI-Powered Creation",
                  description:
                    "Generate unique NFTs with just a description using advanced AI technology.",
                  icon: "🤖",
                },
                {
                  title: "Instant Trading",
                  description:
                    "Buy and sell NFTs instantly in our secure marketplace.",
                  icon: "⚡",
                },
                {
                  title: "Community Driven",
                  description:
                    "Join a vibrant community of creators and collectors.",
                  icon: "👥",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="py-20"
        >
          <div className="container mx-auto px-4 text-center">
            <motion.div variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Start Creating?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of creators and collectors in our AI-powered NFT
                marketplace. Start creating unique digital art today!
              </p>
              <Link href="/mint">
                <Button size="lg" className="group">
                  Get Started{" "}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
