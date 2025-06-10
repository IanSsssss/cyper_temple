// app/header.tsx
"use client";
import { ShimmerButton } from "./card/shimmer-button";
import { AnimatePresence, motion, MotionProps } from "motion/react";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams} from "next/navigation";
import { CreateGodModal } from "./createGod";
import { CreatePrayerModal } from "./card/createPrayer";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      enable?: () => Promise<string[]>;
    };
  }
}

export const Header = function ({
  walletAddress,
  setWalletAddress,
}: {
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
}) {
  const [storedAddress, setStoredAddress] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setStoredAddress(sessionStorage.getItem('walletAddress'));
    }
  }, []);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (walletAddress) {
        sessionStorage.setItem('walletAddress', walletAddress);
      } else {
        sessionStorage.removeItem('walletAddress');
      }
    }
  }, [walletAddress]);
  
  const isHome = usePathname() == '/';
  const [godId, godName] = getGodIdAndName(useSearchParams().toString());

  const wall = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("请先安装 MetaMask 插件，请安装后刷新页面，并确保 MetaMask 已连接到本地链");
      return;
    }
    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.log(error);
      alert("MetaMask连接失败");
    }
  };

  return (
    <header className="bg-gray-20 flex justify-between items-center p-2 border-b border-gray-300">
      <div className="font-semibold text-xl bg-clip-text px-16 py-2">
        {" "}
        🙏🏻 Cyper Temple
      </div>
      {storedAddress || walletAddress ? (
        <div className="flex gap-0.5">
          <WordRotate
            className="text-xl text-black dark:text-white px-12"
            words={[
              "Vistor",
              `0x...${(storedAddress || walletAddress)?.slice(38)}`,
            ]}
          />
          {isHome ? <CreateGodModal /> : <CreatePrayerModal id={godId} godName={godName} />}
        </div>
      ) : (
        <ShimmerButton
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-2xl hover:from-blue-600 hover:to-purple-700 transition-all cursor-pointer z-10"
          onClick={wall}
        >
          <span className="text-sm font-medium">Connect Wallet</span>
        </ShimmerButton>
      )}
    </header>
  );
};

interface WordRotateProps {
  words: string[];
  duration?: number;
  motionProps?: MotionProps;
  className?: string;
}

function WordRotate({
  words,
  duration = 2500,
  motionProps = {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.25, ease: "easeOut" },
  },
  className,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words, duration]);

  return (
    <div className="overflow-hidden py-2">
      <AnimatePresence mode="wait">
        <motion.h1
          key={words[index]}
          className={cn(className)}
          {...motionProps}
        >
          {words[index]}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}

function getGodIdAndName(url:string) {
  if (url.indexOf('data') < 0) return ['', ''];

  return [url.split('%3A')[1].split('%2C')[0], url.split('%3A')[2].split('%2C')[0].replace(/%22/g, '').replace('+', ' ')]
}