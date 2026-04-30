import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send, CheckCircle2, Wallet, ExternalLink, AlertCircle } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnectorClient } from 'wagmi';
import { AppKit } from "@circle-fin/app-kit";
import { createViemAdapterFromProvider } from "@circle-fin/adapter-viem-v2";

const RECIPIENT_ADDRESS = "0x0000000000000000000000000000000000000000" as `0x${string}`;
const kit = new AppKit();

type TxState = "idle" | "sending" | "verifying" | "success" | "error";

export function TipWidget() {
  const { isConnected, address } = useAccount();
  const { data: client } = useConnectorClient();
  const [txState, setTxState] = useState<TxState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const sendTip = useCallback(async () => {
    if (!isConnected || !client) return;
    setTxState("sending");
    setErrorMsg(null);
    setSuccessMsg(null);
    
    try {
      // 1. Get the provider from Wagmi connector
      // This supports MetaMask perfectly and WalletConnect.
      let provider;
      try {
        provider = await client.connector.getProvider();
      } catch (e) {
        // Fallback to injected window.ethereum if connector fails to get provider
        provider = (window as any).ethereum;
      }
      if (!provider) throw new Error("Wallet provider not found.");

      const adapter = await createViemAdapterFromProvider({ provider });

      // 2. Send transaction via Arc Network App Kit
      const result = await kit.send({
        from: { adapter, chain: "Arc_Testnet" },
        to: RECIPIENT_ADDRESS,
        amount: "0.10", // Hardcoded per requirements
        token: "USDC",
      });

      const txHash = result.txHash;
      if (!txHash) throw new Error("Transaction hash not found in AppKit result.");

      setTxState("verifying");

      // 3. Verify transaction on backend
      const response = await fetch("http://localhost:3001/verify-tip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txHash }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Verification failed on backend");
      }

      setSuccessMsg(data.message); // e.g. "Creator Role Unlocked!"
      setTxState("success");

    } catch (e: any) {
      console.warn("Transaction workflow failed:", e);
      setErrorMsg(e.message || "Transaction workflow failed");
      setTxState("error");
    }
  }, [isConnected, client]);

  const isLoading = txState === "sending" || txState === "verifying";

  return (
    <div style={{ width: "100%", maxWidth: 380, position: "relative" }}>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="glass-panel"
        style={{ borderRadius: 28, padding: "2rem", position: "relative", overflow: "hidden", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(16px)" }}
      >
        <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, background: "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.35)", borderRadius: "50%", padding: "1rem", marginBottom: "1rem", boxShadow: "0 0 24px rgba(59,130,246,0.2)" }}>
            <Wallet style={{ width: 32, height: 32, color: "#3b82f6" }} />
          </div>

          <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, margin: "0 0 0.25rem", letterSpacing: "-0.02em" }}>Verified Tipping</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.813rem", textAlign: "center", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
            Confirm on-chain with <span style={{ color: "#3b82f6", fontWeight: 600 }}>Arc Network</span>
          </p>

          <div style={{ marginBottom: "1.5rem", width: "100%", display: "flex", justifyContent: "center" }}>
            <ConnectButton showBalance={false} />
          </div>

          {isConnected && (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <AnimatePresence>
                {txState === "error" && errorMsg && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: "0.75rem 1rem" }}>
                    <AlertCircle style={{ width: 16, height: 16, color: "#ef4444", flexShrink: 0, marginTop: 1 }} />
                    <p style={{ margin: 0, fontSize: "0.813rem", color: "#fca5a5" }}>{errorMsg}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.96 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                onClick={sendTip}
                disabled={isLoading}
                style={{ width: "100%", padding: "1rem", borderRadius: 16, border: "none", background: "white", color: "#0a0a0c", fontWeight: 700, fontSize: "1rem", cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.8 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 8px 32px rgba(255,255,255,0.18), 0 2px 8px rgba(0,0,0,0.3)" }}
              >
                <AnimatePresence mode="wait">
                  {txState === "sending" ? (
                    <motion.div key="loading" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Loader2 style={{ width: 20, height: 20, animation: "spin 1s linear infinite" }} />
                      Confirming on Arc...
                    </motion.div>
                  ) : txState === "verifying" ? (
                    <motion.div key="verifying" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                       <Loader2 style={{ width: 20, height: 20, animation: "spin 1s linear infinite" }} />
                       Waiting for Backend Confirmation...
                    </motion.div>
                  ) : (
                    <motion.div key="send" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Send style={{ width: 18, height: 18 }} />
                      Send 0.10 USDC
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
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
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="glass-panel"
            style={{ position: "absolute", bottom: -80, left: 0, right: 0, borderRadius: 18, padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", gap: 12, borderColor: "rgba(16,185,129,0.3)", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.4)", backdropFilter: "blur(12px)" }}
          >
            <CheckCircle2 style={{ width: 24, height: 24, color: "#10b981", flexShrink: 0 }} />
            <div style={{ overflow: "hidden", flex: 1 }}>
              <p style={{ color: "white", fontWeight: 700, fontSize: "0.875rem", margin: 0 }}>Verified!</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", margin: 0 }}>
                {successMsg || "Transaction verified successfully."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
