"use client";
import React, { useState, useRef } from "react";
import { ShoppingCart, Plus } from "lucide-react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "@/components/ui/animated-modal";
import { Button } from "@/components/ui/button";

function NFTPriceActions() {
  // Reference to hold the modal close function
  const closeModalRef = useRef(null);

  const openModal = () => {
    // Find the modal trigger button and click it programmatically
    document.getElementById("bid-modal-trigger")?.click();
  };

  return (
    <div className="bg-zinc-900 p-4 rounded-lg flex items-center justify-between mt-2">
      <div>
        <div className="text-zinc-500 text-sm mb-1">Price</div>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-white">0.5</span>
          <span className="text-green-400 text-2xl ml-2 font-medium">SOL</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        {/* Regular button that will trigger the modal programmatically */}
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-full flex flex-col items-center justify-center cursor-pointer"
          onClick={openModal}
        >
          <div className="flex items-center gap-1 rounded-full">Bid</div>
        </button>

        {/* Hidden modal with its trigger */}
        <Modal>
          <ModalTrigger>
            <button id="bid-modal-trigger" className="hidden">
              Hidden Trigger
            </button>
          </ModalTrigger>
          <ModalBody>
            <ModalContent>
              <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
                Place your bid for{" "}
                <span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
                  NFT
                </span>
              </h4>

              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-700 dark:text-neutral-300">
                    Current Price
                  </span>
                  <div className="flex items-center">
                    <span className="font-bold">0.5</span>
                    <span className="text-green-400 ml-1">SOL</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="bid-amount"
                    className="text-neutral-700 dark:text-neutral-300 text-sm"
                  >
                    Your Bid (SOL)
                  </label>
                  <input
                    type="number"
                    id="bid-amount"
                    min="0.5"
                    step="0.1"
                    defaultValue="0.5"
                    className="w-full p-2 rounded-md bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700"
                  />
                  <p className="text-xs text-neutral-500">
                    Must be at least 0.5 SOL
                  </p>
                </div>
              </div>
            </ModalContent>
            <ModalFooter className="gap-4">
              <Button
                variant="secondary"
                className="w-28 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                className="w-28 bg-green-500 hover:bg-green-600 text-white border-none"
              >
                Place Bid
              </Button>
            </ModalFooter>
          </ModalBody>
        </Modal>

        <button className="bg-zinc-800 hover:bg-zinc-700 h-10 w-10 text-white font-medium rounded-full flex items-center justify-center">
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
}

export { NFTPriceActions };
