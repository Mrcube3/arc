import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { arcTestnet } from './arcConfig';

const arcChain = {
  id: arcTestnet.id,
  name: arcTestnet.name,
  nativeCurrency: arcTestnet.nativeCurrency,
  rpcUrls: arcTestnet.rpcUrls,
  blockExplorers: arcTestnet.blockExplorers,
  testnet: arcTestnet.testnet,
};

// WalletConnect requires a valid Project ID. 
// Get one for free at: https://cloud.walletconnect.com/
// We use a fallback one for testing, but if it's rate-limited it won't connect.
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'cba65ad1615f7b44d37d2ce8fa20fb97';

export const config = getDefaultConfig({
  appName: 'Arc Tipper Application',
  projectId,
  chains: [arcChain as any],
  transports: {
    [arcTestnet.id]: http(),
  },
});
