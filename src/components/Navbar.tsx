"use client";
import { useEffect, useState } from "react";
import { Wallet, ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletName } from "@solana/wallet-adapter-base";

export default function PhantomNavbar() {
  const wallet = useWallet();
  const { publicKey, connected } = wallet;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDisconnect = async () => {
    try {
      await wallet.disconnect();
      console.log("Wallet disconnected successfully");
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  const handleConnect = async () => {
    try {
      if (wallet.wallets && wallet.wallets.length > 0) {
        const phantomWallet = wallet.wallets.find(
          (w) => w.adapter.name.toLowerCase() === "phantom"
        );

        if (phantomWallet) {
          await wallet.select(phantomWallet.adapter.name as WalletName);
          await wallet.connect();
        } else {
          console.error("Phantom wallet not found");
        }
      } else {
        await wallet.connect();
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      console.log("✅ Connected to:", publicKey.toBase58());
    } else {
      console.log("❌ Wallet disconnected");
    }
  }, [connected, publicKey]);

  return (
    <nav className="bg-slate-900 text-white shadow-md overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 font-bold text-xl">My dApp</div>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <a href="#" className="px-3 py-2 rounded-md hover:bg-slate-800">
                Home
              </a>
              <a href="#" className="px-3 py-2 rounded-md hover:bg-slate-800">
                Dashboard
              </a>
              <a href="#" className="px-3 py-2 rounded-md hover:bg-slate-800">
                About
              </a>
            </div>
          </div>

          <div className="hidden md:block">
            {!connected ? (
              <Button
                onClick={handleConnect}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Phantom
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-purple-500 text-purple-500"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    {publicKey?.toBase58().slice(0, 4)}...
                    {publicKey?.toBase58().slice(-4)}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-slate-800 border-slate-700"
                >
                  <DropdownMenuItem
                    onClick={handleDisconnect}
                    className="text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="#"
              className="block px-3 py-2 rounded-md hover:bg-slate-700"
            >
              Home
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md hover:bg-slate-700"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md hover:bg-slate-700"
            >
              About
            </a>
            {!connected ? (
              <Button
                onClick={handleConnect}
                className="w-full mt-2 bg-purple-600 hover:bg-purple-700"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Phantom
              </Button>
            ) : (
              <div className="p-2">
                <div className="flex items-center justify-between bg-slate-700 p-2 rounded-md">
                  <div className="flex items-center">
                    <Wallet className="mr-2 h-4 w-4 text-purple-400" />
                    <span className="text-sm">
                      {publicKey?.toBase58().slice(0, 4)}...
                      {publicKey?.toBase58().slice(-4)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDisconnect}
                    className="text-red-400 hover:text-red-300"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
