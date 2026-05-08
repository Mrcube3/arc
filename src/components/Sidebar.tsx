
import { motion } from 'framer-motion';
import { History, Zap, ExternalLink } from 'lucide-react';

const mockHistory = [
  { id: 1, to: "0x12...34ab", amount: "0.50", time: "2m ago" },
  { id: 2, to: "0xab...89cd", amount: "1.00", time: "1hr ago" },
  { id: 3, to: "0x99...44ef", amount: "0.10", time: "5hr ago" },
];

export function Sidebar() {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Quick Info / Stats */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-amber-500/15 p-2 rounded-full border border-amber-500/30">
            <Zap className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-white font-bold text-lg m-0">Fast Tips</h3>
        </div>
        <p className="text-white/60 text-sm leading-relaxed m-0">
          Tipping on Arc Network is instant and gas-free for users. Send USDC seamlessly across the globe.
        </p>
      </motion.div>

      {/* History */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-500/15 p-2 rounded-full border border-purple-500/30">
            <History className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-white font-bold text-lg m-0">Recent Tips</h3>
        </div>
        
        <div className="flex flex-col gap-3">
          {mockHistory.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex flex-col">
                <span className="text-white text-sm font-medium">${item.amount} USDC</span>
                <span className="text-white/40 text-xs flex items-center gap-1">
                  To: <span className="font-mono text-white/60">{item.to}</span>
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-white/30 text-xs">{item.time}</span>
                <ExternalLink className="w-3 h-3 text-white/20 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
