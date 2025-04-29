"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Download,
  Copy,
  Wand2,
  Loader2,
  CircleCheckBig,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { UIMessage } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast, Toaster } from "sonner";
import { uploadToIPFS } from "@/utils/ipfs";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { clusterApiUrl } from "@solana/web3.js";
import { IsSold, useNFTStore } from "@/store/nftStore";
import Image from "next/image";

export default function NFTMetadataAssistant() {
  const { addNFT } = useNFTStore();
  const { wallet } = useWallet();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  if (!wallet?.adapter) {
    console.error("Wallet not connected");
    return null;
  }

  const umi = createUmi(clusterApiUrl("devnet"))
    .use(walletAdapterIdentity(wallet.adapter))
    .use(mplTokenMetadata());

  const mint = generateSigner(umi);

  const systemPrompt = `You are an NFT metadata generator. When the user provides a description, generate JSON metadata including the following fields: "name", "description", "attributes" "symbol", and any other relevant fields for an NFT. Always include an "image" field using the URL format "https://picsum.photos/seed/[SEED]/800/800", where [SEED] is a deterministic string derived from the NFT's name or description (e.g., a slugified version or hash) and a symbol too. Ensure the JSON output is valid and uses double quotes for all property names and string values. The image must match the name or description provided so dont just pick out any random images, read the description carefully and provide the image`;

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages: [
        {
          id: "system-1",
          role: "system",
          content: systemPrompt,
        },
      ],
      onFinish: () => {
        toast.success("Metadata generated successfully!");
      },
      onError: (error) => {
        toast.error("Failed to generate metadata", {
          description: error.message,
        });
      },
    });

  const extractJSON = (text: string) => {
    try {
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      let jsonContent = null;

      if (jsonMatch && jsonMatch[1]) {
        jsonContent = jsonMatch[1].trim();
      } else {
        const possibleJSON = text.match(/(\{[\s\S]*\})/);
        if (possibleJSON && possibleJSON[1]) {
          jsonContent = possibleJSON[1].trim();
        }
      }

      if (!jsonContent) return null;

      jsonContent = jsonContent
        .replace(/(\w+)'/g, '$1"')
        .replace(/'(\w+)/g, '"$1');

      const parsed = JSON.parse(jsonContent);

      return parsed;
    } catch (e) {
      return null;
    }
  };

  const generateNft = async (text: string) => {
    try {
      setIsMinting(true);
      const mintingToast = toast.loading("Minting your NFT...");

      const resp = JSON.parse(text);
      const ipfsHash = await uploadToIPFS(resp);
      const metadataUri = `https://ipfs.io/ipfs/${ipfsHash}`;

      toast.loading("Uploading to IPFS successful", {
        id: mintingToast,
        description: "Now creating on-chain asset...",
      });

      const mintedNftAddress = await createNft(umi, {
        mint,
        name: resp.name,
        symbol: resp.symbol,
        uri: metadataUri,
        sellerFeeBasisPoints: percentAmount(2.5),
        isMutable: true,
      }).sendAndConfirm(umi);

      addNFT({
        id: Date.now(),
        name: resp.name,
        description: resp.description,
        image: resp.image,
        price: 0,
        isSold: IsSold.available,
        symbol: resp.symbol,
        owner: wallet.adapter.publicKey
          ? wallet.adapter.publicKey.toString()
          : "",
        mintedNftAddress: mint.publicKey,
      });

      toast.success("NFT minted successfully!", {
        id: mintingToast,
        description: `Your ${resp.name} NFT is now on the blockchain`,
        action: {
          label: "View Collection",
          onClick: () => console.log("Navigate to collection"),
        },
        duration: 5000,
      });
    } catch (error) {
      console.error("Error in generateNft:", error);
      toast.error("Failed to mint NFT", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsMinting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "nft-metadata.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Metadata downloaded");
  };

  const getMessageContent = (message: UIMessage) => {
    if (!message.parts || message.parts.length === 0) return "";

    return message.parts.reduce((content, part) => {
      if ("text" in part) {
        return content + part.text;
      }
      return content;
    }, "");
  };

  return (
    <div
      id="nft-generator"
      className="bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 py-16 overflow-hidden"
    >
      <Toaster position="top-center" richColors expand closeButton />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col max-w-3xl mx-auto h-[700px] px-4"
      >
        <div className="flex items-center justify-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-xl"
          >
            <div className="bg-white dark:bg-slate-900 px-6 py-2 rounded-lg flex items-center">
              <Wand2 className="h-5 w-5 text-indigo-500 mr-2" />
              <h2 className="text-2xl font-bold">NFT Generator</h2>
            </div>
          </motion.div>
        </div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="flex flex-col h-full"
        >
          <Card className="flex flex-col h-full shadow-2xl overflow-hidden border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <motion.div
              className="p-5 border-b bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <h3 className="text-xl font-bold text-center">
                NFT Metadata Generator
              </h3>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                Describe your NFT vision and we'll generate the perfect metadata
              </p>
            </motion.div>

            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="p-6 h-full">
                {messages.length <= 1 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex flex-col items-center justify-center h-72 gap-4"
                  >
                    <div className="p-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                      <Wand2 className="h-12 w-12 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                      Describe your NFT in detail to generate metadata and
                      images.
                      <br />
                      <span className="text-xs mt-2 block text-gray-400 dark:text-gray-500">
                        Example: "A cosmic tiger with glowing blue stripes in a
                        neon jungle"
                      </span>
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-6 pb-2">
                    <AnimatePresence>
                      {messages.slice(1).map((message) => {
                        const isUser = message.role === "user";
                        const messageContent = getMessageContent(message);
                        const jsonContent = !isUser
                          ? extractJSON(messageContent)
                          : null;

                        return (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", damping: 15 }}
                            className={`flex ${
                              isUser ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-sm md:max-w-lg rounded-2xl p-4 shadow-md ${
                                isUser
                                  ? "bg-indigo-600 text-white"
                                  : "bg-white dark:bg-slate-800"
                              }`}
                            >
                              {isUser ? (
                                <div className="whitespace-pre-wrap">
                                  {messageContent}
                                </div>
                              ) : (
                                <>
                                  <div className="font-medium mb-3 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Generated Metadata
                                  </div>
                                  {jsonContent ? (
                                    <div className="space-y-4">
                                      {jsonContent.image && (
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.8 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{
                                            delay: 0.3,
                                            duration: 0.5,
                                          }}
                                          className="flex justify-center"
                                        >
                                          <motion.div
                                            whileHover={{
                                              scale: 1.05,
                                              rotate: 1,
                                            }}
                                            transition={{
                                              type: "spring",
                                              stiffness: 300,
                                            }}
                                            className="relative group"
                                          >
                                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                                            <Image
                                              src={jsonContent.image}
                                              alt={
                                                jsonContent.name || "NFT image"
                                              }
                                              className="relative rounded-lg max-h-52 w-auto shadow-lg object-cover"
                                            />
                                          </motion.div>
                                        </motion.div>
                                      )}
                                      <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{
                                          delay: 0.5,
                                          duration: 0.5,
                                        }}
                                        className="relative"
                                      >
                                        <div className="mb-2 flex justify-between items-center">
                                          <div className="flex items-center">
                                            <div className="mr-2 h-2 w-2 rounded-full bg-indigo-500"></div>
                                            <h4 className="font-medium text-sm">
                                              {jsonContent.name ||
                                                "Untitled NFT"}
                                            </h4>
                                          </div>
                                          <div className="flex gap-1">
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="h-7 text-xs"
                                              onClick={() =>
                                                copyToClipboard(
                                                  JSON.stringify(
                                                    jsonContent,
                                                    null,
                                                    2
                                                  )
                                                )
                                              }
                                            >
                                              <Copy className="h-3 w-3 mr-1" />
                                              Copy
                                            </Button>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="h-7 text-xs"
                                              onClick={() =>
                                                downloadJSON(
                                                  jsonContent,
                                                  `${jsonContent.name
                                                    .toLowerCase()
                                                    .replace(/\s+/g, "-")}.json`
                                                )
                                              }
                                            >
                                              <Download className="h-3 w-3 mr-1" />
                                              Save
                                            </Button>
                                          </div>
                                        </div>
                                        <pre className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-xs overflow-x-auto border border-slate-200 dark:border-slate-700">
                                          {JSON.stringify(jsonContent, null, 2)}
                                        </pre>
                                        <div className="mt-3 flex justify-end">
                                          <Button
                                            variant="default"
                                            size="sm"
                                            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                                            onClick={() =>
                                              generateNft(
                                                JSON.stringify(
                                                  jsonContent,
                                                  null,
                                                  2
                                                )
                                              )
                                            }
                                            disabled={isMinting}
                                          >
                                            {isMinting ? (
                                              <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Minting...
                                              </>
                                            ) : (
                                              <>
                                                <CircleCheckBig className="h-4 w-4 mr-2" />
                                                Mint NFT
                                              </>
                                            )}
                                          </Button>
                                        </div>
                                      </motion.div>
                                    </div>
                                  ) : (
                                    <div className="whitespace-pre-wrap">
                                      {messageContent}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </ScrollArea>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="p-4 border-t mt-auto bg-slate-50 dark:bg-slate-900"
            >
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Describe your NFT in detail..."
                  className="flex-1 min-h-24 resize-none border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 rounded-xl"
                  disabled={isLoading}
                />
                <div className="flex justify-end">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md"
                      disabled={isLoading || !input.trim()}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generate Metadata
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </form>
            </motion.div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
