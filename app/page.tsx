'use client'
import './globals.css';
import {useState} from 'react';
import {BackgroundLines} from './welcome';
import Thumb from './card/thumb';
import {Header} from './header'

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

    return (
      <div>
        <Header walletAddress={walletAddress} setWalletAddress={setWalletAddress} />
        <BackgroundLines className="flex items-center justify-center w-full flex-col px-4" />
        <div>
        <Thumb />
        </div>
      </div>

    );
}
