import express from 'express';
import cors from 'cors';
import { createPublicClient, http } from 'viem';

// Ensure 0x prefix and lowercase formatting
const VAULT_ADDRESS = "0x0000000000000000000000000000000000000000";
// 0.10 USDC (amount is in 6 decimals, so 100000 units)
const MIN_AMOUNT = 100000n; 

const app = express();
app.use(cors());
app.use(express.json());

const arcTestnet = {
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: { decimals: 6, name: "USDC", symbol: "USDC" },
  rpcUrls: { default: { http: ["https://rpc.testnet.arc.network"] } },
};

const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http(),
});

app.post('/verify-tip', async (req, res) => {
  const { txHash } = req.body;
  if (!txHash) {
    return res.status(400).json({ error: 'txHash is required' });
  }

  try {
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
    
    if (receipt.status !== 'success') {
      return res.status(400).json({ error: 'Transaction failed or is pending' });
    }

    const tx = await publicClient.getTransaction({ hash: txHash });

    if (!tx.to || tx.to.toLowerCase() !== VAULT_ADDRESS.toLowerCase()) {
      return res.status(400).json({ error: 'Invalid recipient address' });
    }

    if (tx.value < MIN_AMOUNT) {
      return res.status(400).json({ error: 'Insufficient tip amount.' });
    }

    return res.json({ verified: true, message: "Creator Role Unlocked!" });
  } catch (error) {
    console.error('Error validating transaction:', error);
    return res.status(500).json({ error: 'Error validating transaction' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
