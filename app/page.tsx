"use client";
import "./globals.css";
import { useState } from "react";
import { BackgroundLines } from "./welcome";
import Thumb from "./card/thumb";
import { Header } from "./header";
import { CreateGodModal } from "./createGod";
import ParyerMarqueue from "./marqueue";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  return (
    <div className="">
      <Header
        walletAddress={walletAddress}
        setWalletAddress={setWalletAddress}
      />
      <BackgroundLines className="flex items-center justify-center w-full flex-col px-4" />
      <div className="flex items-center align-center justify-center flex-col">
        <Thumb />
      </div>
      <div className="h-4 " />
      <ParyerMarqueue />
    </div>
  );
}
