"use client";

import Chat from "@/components/chat";
import { Hero } from "@/components/ui/animated-hero";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";

export default function Page() {
  const { connection } = useConnection();
  console.log(connection);

  const { publicKey, connected } = useWallet();
  console.log(publicKey?.toString());

  if (connected) {
    console.log("hi");
  } else {
    console.log("hello");
  }
  return (
    <main>
      hi
      <Hero />
      {/* <Chat /> */}
    </main>
  );
}
