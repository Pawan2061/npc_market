"use client";

import { useState, useEffect, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Download, Copy, MoveRight, PhoneCall } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { UIMessage } from "ai";
import { motion, AnimatePresence } from "framer-motion";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { MintNftArgs, NFTMetadata } from "@/types/nft";
import { uploadToIPFS } from "@/utils/ipfs";
import { getNpcMarketProgram } from "@project/anchor";
import { useNpcMarketProgram } from "./npc_market/npc_market-data-access";
import { createMintNftAction, executeMintNftAction } from "@/utils/nft-actions";

export default function NFTMetadataAssistant() {
  const { program } = useNpcMarketProgram();

  const [copied, setCopied] = useState(false);
  const systemPrompt = `You are an NFT metadata generator. When the user provides a description, generate JSON metadata including the following fields: "name", "description", "attributes" "symbol", and any other relevant fields for an NFT. Always include an "image" field using the URL format "https://picsum.photos/seed/[SEED]/800/800", where [SEED] is a deterministic string derived from the NFT's name or description (e.g., a slugified version or hash) and a symbol too. Ensure the JSON output is valid and uses double quotes for all property names and string values. The image must match the name or description provided so dont just pick out any random images, read the description carefully and provide the image`;

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        id: "system-1",
        role: "system",
        content: systemPrompt,
      },
    ],
  });
  const { connection } = useConnection();
  const wallet = useWallet();

  const copyToClipboard = async (text: string) => {
    try {
      const resp = JSON.parse(text);

      const metadataUri = await uploadToIPFS(resp);

      const input: MintNftArgs = {
        metadataSymbol: resp.symbol,
        metadataTitle: resp.name,
        metadataUri,
      };

      if (!wallet.publicKey || !program) {
        alert("Wallet not connected or program not loaded");
        return;
      }

      // Create the mint NFT transaction
      const { createMintTx, mintTx, mint } = await createMintNftAction({
        metadataTitle: input.metadataTitle,
        metadataSymbol: input.metadataSymbol,
        metadataUri: input.metadataUri,
        connection,
        wallet,
        program,
      });

      // Execute the transaction
      const txId = await executeMintNftAction(
        createMintTx,
        mintTx,
        mint,
        wallet,
        connection
      );
      console.log("NFT minted successfully! Transaction ID:", txId);

      navigator.clipboard.writeText(JSON.stringify(resp, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Minting failed:", error);
      alert("Something went wrong during minting.");
    }
  };

  const downloadJSON = (content: string, fileName: string) => {
    try {
      const jsonObject =
        typeof content === "object" ? content : JSON.parse(content);
      const jsonString = JSON.stringify(jsonObject, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = fileName || "nft-metadata.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    } catch (error) {
      console.error("Error downloading JSON:", error);
      alert("There was an error processing the JSON. Please check the format.");
    }
  };

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
      // console.error("JSON parsing error:", e);
      return null;
    }
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
    <div id="nft-generator" className="bg-muted/40 py-16 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col max-w-2xl mx-auto h-[600px] px-4"
      >
        <h2 className="text-2xl font-bold text-center mb-6">NFT Generator</h2>
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="flex flex-col h-full"
        >
          <Card className="flex flex-col h-full shadow-lg overflow-hidden">
            <motion.div
              className="p-4 border-b"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <h3 className="text-xl font-bold text-center">
                NFT Metadata Generator
              </h3>
              <p className="text-center text-sm text-gray-500 mt-1">
                Enter a description to generate NFT metadata with images
              </p>
            </motion.div>

            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="p-4 h-full">
                {messages.length <= 1 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex items-center justify-center h-64"
                  >
                    <p className="text-gray-500">
                      Describe your NFT to generate metadata...
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-4 pb-2">
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
                              className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                                isUser
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              {isUser ? (
                                <div className="whitespace-pre-wrap">
                                  {messageContent}
                                </div>
                              ) : (
                                <>
                                  <div className="font-medium mb-2">
                                    Generated Metadata:
                                  </div>
                                  {jsonContent ? (
                                    <div className="space-y-3">
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
                                          <motion.img
                                            whileHover={{ scale: 1.05 }}
                                            transition={{
                                              type: "spring",
                                              stiffness: 300,
                                            }}
                                            src={jsonContent.image}
                                            alt={
                                              jsonContent.name || "NFT image"
                                            }
                                            className="rounded-md max-h-40 w-auto shadow-sm"
                                          />
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
                                        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">
                                          {JSON.stringify(jsonContent, null, 2)}
                                        </pre>
                                        <div className="absolute top-2 right-2 flex gap-1">
                                          <motion.div
                                            whileHover={{ scale: 1.1 }}
                                          >
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-6 w-6 bg-white/80 dark:bg-black/50 rounded-full"
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
                                              <Copy className="h-3 w-3" />
                                            </Button>
                                          </motion.div>
                                          <motion.div
                                            whileHover={{ scale: 1.1 }}
                                          >
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-6 w-6 bg-white/80 dark:bg-black/50 rounded-full"
                                              onClick={() =>
                                                downloadJSON(
                                                  jsonContent,
                                                  "nft-metadata.json"
                                                )
                                              }
                                            >
                                              <Download className="h-3 w-3" />
                                            </Button>
                                          </motion.div>
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
              className="p-4 border-t mt-auto"
            >
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Describe your NFT..."
                  className="flex-1 min-h-20 resize-none"
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button type="submit" className="self-end h-full">
                    <Send className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </Card>
        </motion.div>

        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg"
            >
              Copied to clipboard!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
