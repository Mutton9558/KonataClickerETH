import { ethers } from "ethers";
require("dotenv").config();

const ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "score",
          "type": "uint256"
        }
      ],
      "name": "ScoreSaved",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getData",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "scoreData",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "data",
          "type": "uint256"
        }
      ],
      "name": "setData",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

export default async function handler(req, res) {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const code = await provider.getCode(process.env.CONTRACT_ADDRESS);

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ABI, wallet);
  console.log("Code at contract address:", code);

  if (req.method === "POST") {
    const score = req.body.score;
    try {
      console.log(score)
      const tx = await contract.setData(score);
      const receipt = await tx.wait();
      for (const log of receipt.logs) {
        if (log.address.toLowerCase() !== contract.target.toLowerCase()) continue;

        try {
          const parsed = contract.interface.parseLog(log);
          if (parsed.name === "ScoreSaved") {
            console.log("🎯 Score saved for:", parsed.args.user);
            console.log("📊 Score:", parsed.args.score.toString());
          }
        } catch (err) {
          console.warn("Could not parse log:", err);
        }
      }
      console.log("Success")
      return res.status(200).json({ status: "Success", message: "Score saved", txHash: tx.hash });
    } catch (err) {
      console.error("Error saving score:", err);
      return res.status(500).json({ status: "Error", message: "Failed to save score" });
    }
  }

  if (req.method === "GET") {
    const walletAddress = req.query.wallet;
    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      return res.status(400).json({ status: "Error", message: "Invalid wallet address" });
    }
    let s = 0;

    try {
      console.log("Contract address:", contract.target || contract.address);
      console.log(walletAddress)
      const data = await contract.getData(walletAddress);
      s = data.toString();
      console.log("Score from contract:", s);
    } catch (err) {
      if (err.code === 'BAD_DATA' && err.value === '0x') {
        console.warn("Could not decode data, defaulting to 0");
        s = 0;
      } else {
        console.error("Unexpected error fetching data:", err);
        return res.status(500).json({ status: "Error", message: "Failed to fetch score" });
      }
    }

    return res.status(200).json({ status: "Success", score: s });
  }

  // Method not allowed
  return res.status(405).json({ status: "Error", message: "Method not allowed" });
}
