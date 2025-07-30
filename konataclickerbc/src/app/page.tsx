"use client";

import { useEffect, useState, useRef } from "react";
import { ethers, BrowserProvider, JsonRpcSigner } from "ethers";
import "./style.css";
import { Contract } from "ethers";

const ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "score",
        type: "uint256",
      },
    ],
    name: "ScoreSaved",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getData",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "scoreData",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "data",
        type: "uint256",
      },
    ],
    name: "setData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const contractAddr = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  const [scoreObtained, setScore] = useState(0);
  const [walletAddress, setWalletAddress] = useState();
  const provider = useRef<BrowserProvider | null>(null);
  const signer = useRef<JsonRpcSigner | null>(null);

  function updateScore() {
    let newVal = scoreObtained + 1;
    setScore(newVal);
  }

  // async function backendFetch(address: any) {
  //   try {
  //     console.log("walletAddress before fetch:", address);
  //     const data = await fetch(`/api/score?wallet=${address}`);
  //     const json = await data.json();
  //     setScore(parseInt(json.score));
  //   } catch (err) {
  //     console.log("Error");
  //   }
  // }

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request wallet access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        provider.current = new ethers.BrowserProvider(window.ethereum);
        signer.current = await provider.current!.getSigner();
        if (contractAddr) {
          const contract = new ethers.Contract(
            contractAddr,
            ABI,
            signer.current
          );
          const tx = await contract.getData(accounts[0]);
          await tx.wait();
          const data = tx.toString();
          setScore(data);
        }

        // backendFetch(accounts[0]);
      } catch (err: any) {
        if (err.code === "BAD_DATA" && err.value === "0x") {
          console.warn("Could not decode data, defaulting to 0");
          setScore(0);
        }
        console.error("User denied wallet connection", err);
      }
    } else {
      alert("Please install MetaMask.");
    }
  };

  useEffect(() => {
    if (walletAddress) {
      const walletButton = document.getElementById("walletbutton");
      walletButton?.classList.remove("visible");
      walletButton?.classList.add("not-visible");

      const saveDataBtn = document.getElementById("savedata");
      saveDataBtn?.classList.remove("not-visible");
      saveDataBtn?.classList.add("visible");
    }
  }, [walletAddress]);

  async function postData() {
    try {
      if (contractAddr) {
        const contract = new ethers.Contract(contractAddr, ABI, signer.current);
        const tx = await contract.setData(scoreObtained);
        tx.await();
        console.log("Save data successful");
      }
    } catch (err) {
      console.log("Error in sending data");
    }
  }

  return (
    <>
      <div id="container">
        <div id="score-text">
          <h1>Your Score:</h1>
          <h1>{scoreObtained}</h1>
        </div>
        <div id="buttons">
          <button id="konata-btn" onClick={updateScore}>
            <img
              id="konata-img"
              src="/konatadead.jpg"
              width="250"
              height="250"
            ></img>
          </button>
          <div id="buttons-bottom">
            <div id="walletbutton" className="visible">
              <button onClick={connectWallet}>Connect Wallet</button>
            </div>
            <div id="savedata" className="not-visible">
              <button onClick={postData}>Save Data</button>
            </div>
          </div>
        </div>
        {walletAddress && <p>Connected: {walletAddress}</p>}
      </div>
    </>
  );
}
