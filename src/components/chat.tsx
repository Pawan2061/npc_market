"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Download, Copy, Image } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { UIMessage } from "ai";

export default function NFTMetadataAssistant() {
  const [copied, setCopied] = useState(false);
  const systemPrompt = `You are an NFT metadata generator. When the user provides a description, generate JSON metadata with name, description, attributes, and other appropriate fields for an NFT. Always include an "image" field with a placeholder URL from "https://picsum.photos/seed/[SEED]/800/800", where [SEED] is a random string based on the NFT name. Format it as valid JSON with double quotes for all property names and string values.`;

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        id: "system-1",
        role: "system",
        content: systemPrompt,
      },
    ],
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      console.error("JSON parsing error:", e);
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
    <div className="flex flex-col w-screen max-w-md mx-auto h-screen py-8">
      <Card className="flex flex-col h-full shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-center">
            NFT Metadata Generator
          </h2>
          <p className="text-center text-sm text-gray-500 mt-1">
            Enter a description to generate NFT metadata with images
          </p>
        </div>

        <ScrollArea className="flex-1 p-4">
          {messages.length <= 1 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">
                Describe your NFT to generate metadata...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.slice(1).map((message) => {
                const isUser = message.role === "user";
                const messageContent = getMessageContent(message);
                const jsonContent = !isUser
                  ? extractJSON(messageContent)
                  : null;

                return (
                  <div
                    key={message.id}
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
                                <div className="flex justify-center">
                                  <img
                                    src={jsonContent.image}
                                    alt={jsonContent.name || "NFT image"}
                                    className="rounded-md max-h-40 w-auto shadow-sm"
                                  />
                                </div>
                              )}
                              <div className="relative">
                                <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">
                                  {JSON.stringify(jsonContent, null, 2)}
                                </pre>
                                <div className="absolute top-2 right-2 flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 bg-white/80 dark:bg-black/50 rounded-full"
                                    onClick={() =>
                                      copyToClipboard(
                                        JSON.stringify(jsonContent, null, 2)
                                      )
                                    }
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
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
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap">
                              {messageContent}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Describe your NFT..."
              className="flex-1 min-h-20 resize-none"
            />
            <Button type="submit" className="self-end">
              <Send className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </form>
        </div>
      </Card>

      {copied && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}
