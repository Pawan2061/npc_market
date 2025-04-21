"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, ChevronDown, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Type definitions for Phantom wallet
type PhantomEvent = "disconnect" | "connect" | "accountChanged";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

interface PhantomProvider {
  publicKey: { toString(): string } | null;
  isPhantom?: boolean;
  isConnected: boolean;
  connect: (
    opts?: Partial<ConnectOpts>
  ) => Promise<{ publicKey: { toString(): string } }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, callback: (args: any) => void) => void;
  request: (method: object) => Promise<object>;
}

export default function PhantomNavbar() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check if Phantom is installed and get provider
  const getProvider = (): PhantomProvider | null => {
    // Make TypeScript ignore the type checking for window.phantom
    const provider = (window as any).phantom?.solana;

    if (provider?.isPhantom) {
      return provider as PhantomProvider;
    }

    return null;
  };

  // Connect to Phantom wallet
  const connectWallet = async () => {
    try {
      const provider = getProvider();

      if (!provider) {
        window.open("https://phantom.app/", "_blank");
        return;
      }

      const response = await provider.connect();
      setWalletAddress(response.publicKey.toString());
      setIsConnected(true);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  // Disconnect from Phantom wallet
  const disconnectWallet = () => {
    const provider = getProvider();
    if (provider) {
      provider.disconnect();
      setIsConnected(false);
      setWalletAddress("");
    }
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 font-bold text-xl">My dApp</div>
          </div>

          {/* Desktop menu */}
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

          {/* Wallet connection */}
          <div className="hidden md:block">
            {!isConnected ? (
              <Button
                onClick={connectWallet}
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
                    {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-slate-800 border-slate-700"
                >
                  <DropdownMenuItem
                    onClick={disconnectWallet}
                    className="text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
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

      {/* Mobile menu */}
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
            {!isConnected ? (
              <Button
                onClick={connectWallet}
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
                      {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={disconnectWallet}
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
