
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Server } from 'lucide-react';

export function NetworkStatus() {
  return (
    <div className="w-full flex flex-col gap-6">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-lg m-0">Network</h3>
          <div className="flex items-center gap-1.5 bg-emerald-500/20 px-2 py-1 rounded-full border border-emerald-500/30">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-[10px] font-bold tracking-wider uppercase">Live</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500/10 p-2 rounded-xl mt-0.5">
              <Server className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium m-0">Arc Testnet</p>
              <p className="text-white/40 text-xs m-0">RPC: rpc.testnet.arc.network</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-500/10 p-2 rounded-xl mt-0.5">
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium m-0">Sub-second Finality</p>
              <p className="text-white/40 text-xs m-0">Blazing fast confirmations</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-500/10 p-2 rounded-xl mt-0.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium m-0">Secure TEE Enclave</p>
              <p className="text-white/40 text-xs m-0">Protected transaction logic</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="flex justify-center">
         <p className="text-white/20 text-xs font-mono">Build v1.2.0 • Arc SDK</p>
      </div>
    </div>
  );
}
