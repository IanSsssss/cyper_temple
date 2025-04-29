import { ShimmerButton } from './card/shimmer-button';

declare const window: {ethereum: {
  isMetaMask?: boolean;
  request: (args: { method: string }) => Promise<string[]>;
  enable?: () => Promise<string[]>;
};};

export const Header = function ({ walletAddress, setWalletAddress }: { walletAddress: string | null, setWalletAddress: (address: string | null) => void }) {
  const wall = async (setWalletAddress: (address: string | null) => void) => {
    if (typeof window.ethereum === 'undefined') {
      alert('请先安装 MetaMask 插件，请安装后刷新页面，并确保 MetaMask 已连接到本地链');
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];
      localStorage.setItem('walletAddress', accounts[0]);
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.log(error);
      alert('MetaMask连接失败');
    }
  };
  
  return (
    <header className="bg-transparent flex justify-between items-center p-2 border-b border-gray-300">
      <div className="font-semibold text-xl bg-clip-text px-16 py-2">Cyper Temple 🙏🏻</div>
      {walletAddress ? (
        <span>Connected: {walletAddress}</span>
      ) : (
        <ShimmerButton className="shadow-2xl" onClick={()=>wall}>
          <span className="whitespace-pre-wrap text-center text-sm font-xs leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
            Connect Wallet
          </span>
        </ShimmerButton>
      )}
    </header>
  );
};
