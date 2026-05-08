import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send, CheckCircle2, Wallet, AlertCircle, Search, XCircle } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnectorClient } from 'wagmi';
import { AppKit } from "@circle-fin/app-kit";
import { createViemAdapterFromProvider } from "@circle-fin/adapter-viem-v2";
import { isAddress } from "viem";

const kit = new AppKit();
const PRESET_AMOUNTS = ["0.10", "0.50", "1.00"] as const;

type TxState = "idle" | "sending" | "verifying" | "success" | "error";

export function TipWidget() {
  const { isConnected, address: senderAddress, connector } = useAccount();
  const { data: client } = useConnectorClient();
  const [txState, setTxState] = useState<TxState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<string>("0.10");
  const [recipientAddress, setRecipientAddress] = useState("");

  const isValidAddress = recipientAddress ? isAddress(recipientAddress) : false;
  const isSelf = isValidAddress && senderAddress && recipientAddress.toLowerCase() === senderAddress.toLowerCase();
  const canSend = isValidAddress && !isSelf && (customAmount || selectedAmount);

  const displayAmount = customAmount || selectedAmount;

  const sendTip = useCallback(async () => {
    if (!isConnected || !client) return;
    setTxState("sending");
    setErrorMsg(null);
    
    try {
      let provider;
      try {
        if (!connector) throw new Error("No connector");
        provider = await connector.getProvider();
      } catch (e) {
        provider = (window as any).ethereum;
      }
      if (!provider) throw new Error("Wallet provider not found.");

      const adapter = await createViemAdapterFromProvider({ provider });

      const result = await kit.send({
        from: { adapter, chain: "Arc_Testnet" },
        to: recipientAddress as `0x${string}`,
        amount: displayAmount || "0.10",
        token: "USDC",
      });

      const txHash = result.txHash;
      if (!txHash) throw new Error("Transaction hash not found in AppKit result.");

      setTxState("verifying");

      const response = await fetch("http://localhost:3001/verify-tip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txHash, recipient: recipientAddress }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Verification failed on backend");
      }

      setTxState("success");

    } catch (e: any) {
      console.warn("Transaction workflow failed:", e);
      setErrorMsg(e.message || "Transaction failed. Make sure you have enough testnet USDC.");
      setTxState("error");
    }
  }, [isConnected, client, displayAmount, recipientAddress]);

  const isLoading = txState === "sending" || txState === "verifying";

  return (
    <div className="w-full max-w-[380px] mx-auto relative px-2 sm:px-0">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="rounded-[28px] p-5 sm:p-8 relative overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl"
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-blue-500/15 border border-blue-500/30 rounded-full p-4 mb-4 shadow-[0_0_24px_rgba(59,130,246,0.2)]">
            <Wallet className="w-8 h-8 text-blue-500" />
          </div>

          <h2 className="text-white text-2xl font-bold mb-1 tracking-tight text-center">Verified Tipping</h2>
          <p className="text-white/50 text-sm text-center mb-6 leading-relaxed">
            Confirm on-chain with <span className="text-blue-500 font-semibold">Arc Network</span>
          </p>

          <div className="mb-6 w-full flex justify-center">
            <ConnectButton showBalance={false} />
          </div>

          {isConnected && (
            <div className="w-full flex flex-col gap-4 sm:gap-5">
              
              {/* Recipient Input */}
              <div className="relative">
                <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Recipient Address (0x...)"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className={`w-full bg-black/25 border rounded-2xl py-3 sm:py-4 pr-12 pl-11 sm:pl-12 text-white text-sm sm:text-base font-medium outline-none transition-colors ${
                    !recipientAddress
                      ? "border-white/10 focus:border-white/30 focus:bg-white/10"
                      : isValidAddress
                      ? isSelf ? "border-amber-500/50 bg-amber-500/10" : "border-emerald-500/50 bg-emerald-500/10"
                      : "border-red-500/50 bg-red-500/10"
                  }`}
                />
                {recipientAddress && (
                  <div className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2">
                    {isValidAddress && !isSelf && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {(!isValidAddress || isSelf) && <XCircle className="w-5 h-5 text-red-400" />}
                  </div>
                )}
                {isSelf && (
                   <p className="text-amber-400 text-xs mt-1 ml-1 absolute -bottom-5">Cannot send to yourself</p>
                )}
              </div>

              {/* Quick Tip Buttons */}
              <div className="flex gap-2 w-full mt-2">
                {[
                  { name: "arc-dev", address: "0x1111111111111111111111111111111111111111" },
                  { name: "arc-mods", address: "0x2222222222222222222222222222222222222222" },
                  { name: "arc-dao", address: "0x3333333333333333333333333333333333333333" },
                ].map((preset) => (
                  <motion.button
                    key={preset.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRecipientAddress(preset.address)}
                    className="flex-1 py-2 px-1 rounded-xl text-[10px] sm:text-xs font-semibold transition-all bg-white/5 text-blue-300 border border-blue-400/20 hover:bg-blue-500/20"
                  >
                    {preset.name}
                  </motion.button>
                ))}
              </div>

              {/* Amounts Selection */}
              <div className="flex gap-2 w-full">
                {PRESET_AMOUNTS.map((preset) => {
                  const isActive = selectedAmount === preset && !customAmount;
                  return (
                    <motion.button
                      key={preset}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setSelectedAmount(preset); setCustomAmount(""); }}
                      className={`flex-1 py-3 px-1 sm:px-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                        isActive 
                          ? 'bg-white text-gray-900 shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                          : 'bg-white/5 text-white/90 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      ${preset}
                    </motion.button>
                  );
                })}
              </div>

              {/* Custom Amount */}
              <div className="relative">
                <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-white/50 font-semibold text-lg pointer-events-none">$</span>
                <input
                  type="number"
                  placeholder="Custom"
                  step="0.10"
                  min="0.10"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); if (e.target.value) setSelectedAmount(""); }}
                  className="w-full bg-black/25 border border-white/10 rounded-2xl py-3 sm:py-4 pr-4 pl-9 sm:pl-10 text-white text-base sm:text-lg font-medium outline-none transition-colors focus:border-white/30 focus:bg-white/10"
                />
              </div>

              <AnimatePresence>
                {txState === "error" && errorMsg && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-2 items-start bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="m-0 text-xs sm:text-sm text-red-300 break-words">{errorMsg}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.96 } : {}}
                onClick={sendTip}
                disabled={isLoading || !canSend}
                className="w-full p-4 rounded-2xl bg-white text-gray-900 font-bold flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(255,255,255,0.15)] disabled:opacity-80 disabled:cursor-not-allowed"
              >
                <AnimatePresence mode="wait">
                  {txState === "sending" ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-sm sm:text-base">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Confirming...
                    </motion.div>
                  ) : txState === "verifying" ? (
                    <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-sm sm:text-base">
                       <Loader2 className="w-5 h-5 animate-spin" />
                       Verifying...
                    </motion.div>
                  ) : (
                    <motion.div key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-sm sm:text-base">
                      <Send className="w-5 h-5" />
                      Send ${isNaN(parseFloat(displayAmount)) ? "0.00" : parseFloat(displayAmount).toFixed(2)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
              
              <div className="text-center mt-1">
                 <p className="text-[11px] sm:text-xs text-white/40">
                   Need funds? <a href="https://faucet.circle.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300">Circle Faucet ↗</a>
                 </p>
                 <p className="text-[10px] text-white/30 mt-1">Select Arc Network</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Success Toast */}
      <AnimatePresence>
        {txState === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92 }}
            className="absolute -bottom-20 left-2 right-2 sm:-bottom-24 sm:left-0 sm:right-0 p-4 rounded-2xl flex items-center gap-3 border border-emerald-500/40 bg-emerald-500/10 backdrop-blur-xl z-50 shadow-xl"
          >
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="overflow-hidden flex-1 w-full">
              <p className="text-white font-bold text-sm m-0">Verified!</p>
              <div className="mt-2 flex flex-col gap-1 text-[11px] sm:text-xs text-white/80">
                <p className="m-0 flex justify-between w-full"><span>Amount:</span> <span className="font-bold text-white">${parseFloat(displayAmount).toFixed(2)} USDC</span></p>
                <p className="m-0 flex justify-between w-full"><span>To:</span> <span className="font-mono text-white/90">{recipientAddress.slice(0,6)}...{recipientAddress.slice(-4)}</span></p>
                <p className="m-0 flex justify-between w-full"><span>Network:</span> <span>Arc Testnet</span></p>
                <p className="m-0 flex justify-between w-full"><span>Status:</span> <span className="text-emerald-400 font-medium">Confirmed in &lt; 1s</span></p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
