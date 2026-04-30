import { useState, useCallback } from 'react';

// Mock types and functions for @arc-network/app-kit
export interface ArcWallet {
  address: string;
  isConnected: boolean;
}

export function useAppKit() {
  const [wallet, setWallet] = useState<ArcWallet | null>(null);

  const connect = useCallback(() => {
    // Mock connection
    setWallet({ address: '0x1234...5678', isConnected: true });
  }, []);

  const disconnect = useCallback(() => {
    setWallet(null);
  }, []);

  const sendTransaction = useCallback(async (_amount: number, _to: string) => {
    if (!wallet?.isConnected) throw new Error("Wallet not connected");
    // Simulate Arc's extremely fast sub-second finality
    return new Promise<{ hash: string }>((resolve) => {
      setTimeout(() => {
        resolve({ hash: `0xabc...${Math.floor(Math.random() * 1000)}` });
      }, 600); // 600ms latency for sub-second confirmation simulation
    });
  }, [wallet]);

  return { wallet, connect, disconnect, sendTransaction };
}
