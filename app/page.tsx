'use client'
import './globals.css';
import {BackgroundLines} from './welcome';
import Thumb from './card/thumb';
import { ShimmerButton } from "./card/shimmer-button";

export default function Home() {

    return (
      <div>
        <Header />
        <BackgroundLines className="flex items-center justify-center w-full flex-col px-4" />
        <div>
        <Thumb />
        </div>
      </div>

    );
}

const Header = () => {
  return (
      <header className="bg-transparent flex justify-between items-center p-2 border-b border-gray-300">
          <div className="font-semibold text-xl bg-clip-text px-16 py-2">Cyper Temple 🙏🏻</div>
          <ShimmerButton className="shadow-g" >
                        <span className="whitespace-pre-wrap text-center text-sm font-xs leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                        Connect Wallet
                        </span>
                </ShimmerButton>
      </header>
  );
};

