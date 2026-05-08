import express from 'express';
import cors from 'cors';
import { createPublicClient, http } from 'viem';


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
  const { txHash, recipient } = req.body;
  if (!txHash || !recipient) {
    return res.status(400).json({ error: 'txHash and recipient are required' });
  }

  const TARGET_ADDRESS = recipient.toLowerCase();

  try {
    const receipt = await publicClient.getTransactionReceipt({ hash: txHash });
    
    if (receipt.status !== 'success') {
      return res.status(400).json({ error: 'Transaction failed or is pending' });
    }

    const tx = await publicClient.getTransaction({ hash: txHash });

    // Method 1: Check if the transaction logs contain an ERC-20 Transfer event to the TARGET_ADDRESS
    const transferEventTopic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
    const paddedVault = "0x000000000000000000000000" + TARGET_ADDRESS.substring(2);
    
    let foundValidTransfer = false;
    for (const log of receipt.logs) {
      if (log.topics[0] === transferEventTopic && log.topics[2]?.toLowerCase() === paddedVault) {
        const amountSent = BigInt(log.data || '0');
        if (amountSent >= MIN_AMOUNT) {
          foundValidTransfer = true;
          break;
        }
      }
    }

    // Method 2: Check standard native EVM transfers
    const isNativeTransferToVault = tx.to && tx.to.toLowerCase() === TARGET_ADDRESS && tx.value >= MIN_AMOUNT;

    // Method 3: Check standard ERC-20 transfer(address,uint256) transaction input payload
    let isDirectErc20ToVault = false;
    if (tx.input && tx.input.startsWith("0xa9059cbb")) {
        const parsedRecipient = "0x" + tx.input.substring(34, 74).toLowerCase();
        const amountSegment = tx.input.substring(74);
        if (amountSegment) {
          const amount = BigInt("0x" + amountSegment);
          if (parsedRecipient === TARGET_ADDRESS && amount >= MIN_AMOUNT) {
               isDirectErc20ToVault = true;
          }
        }
    }

    if (!foundValidTransfer && !isNativeTransferToVault && !isDirectErc20ToVault) {
      return res.status(400).json({ error: 'Invalid recipient address or insufficient tip amount' });
    }

    console.log(`Tip verified! Sender: ${tx.from}, Recipient: ${TARGET_ADDRESS}, TxHash: ${txHash}`);
    return res.json({ verified: true, message: "Tip verified successfully!" });
  } catch (error) {
    console.error('Error validating transaction:', error);
    return res.status(500).json({ error: 'Error validating transaction on backend' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
