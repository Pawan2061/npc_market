"use client";

import { Hero } from "@/components/ui/animated-hero";

export default function Page() {
  // const provider = useAnchorProvider();
  // const { connection } = useConnection();
  // const { cluster } = useCluster();
  // const [marketName, setMarketName] = useState("");
  // const [transactionStatus, setTransactionStatus] = useState<string | null>(
  //   null
  // );

  // const programId = getNpcMarketProgramId(cluster.network as Cluster);
  // const program = useMemo(
  //   () => getNpcMarketProgram(provider, programId),
  //   [provider, programId]
  // );

  // const handleCreateMarket = async () => {
  //   try {
  //     setTransactionStatus("Creating new market...");
  //     const tx = await program.methods
  //       .initNewMarket(marketName)

  //       .rpc();
  //     setTransactionStatus(`Market created successfully: ${tx}`);
  //   } catch (error) {
  //     setTransactionStatus(`Error: ${error}`);
  //   }
  // };

  return (
    // <div className="">
    //   <input
    //     type="text"
    //     value={marketName}
    //     onChange={(e) => setMarketName(e.target.value)}
    //     placeholder="Enter Market Name"
    //   />
    //   <button onClick={handleCreateMarket}>Create Market</button>
    //   {transactionStatus && <p>{transactionStatus}</p>}
    // </div>
    <main>
      <Hero />
    </main>
  );
}
