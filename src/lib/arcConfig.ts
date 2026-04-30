/**
 * Arc Testnet Chain Configuration
 * Chain ID: 5042002
 * RPC: https://rpc.testnet.arc.network
 * Explorer: https://testnet.arcscan.app
 *
 * Arc uses USDC as its native gas token — users don't need a separate
 * "gas" token, which massively simplifies the UX for micro-tipping.
 */
import { createPublicClient, http } from "viem";

export const arcTestnet = {
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: {
    decimals: 6,
    name: "USDC",
    symbol: "USDC",
  },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.arc.network"] },
  },
  blockExplorers: {
    default: {
      name: "ArcScan",
      url: "https://testnet.arcscan.app",
    },
  },
  testnet: true,
} as const;

/**
 * USDC contract address on Arc Testnet.
 * Used for reading balances via publicClient.
 */
export const USDC_ADDRESS_ARC_TESTNET =
  "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9" as const;

/** ERC-20 minimal ABI for balanceOf */
export const ERC20_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/**
 * Public client for reading chain state (balances, receipts).
 * Sub-second block times mean balance checks resolve almost instantly.
 */
export const arcPublicClient = createPublicClient({
  chain: arcTestnet,
  transport: http("https://rpc.testnet.arc.network"),
});
