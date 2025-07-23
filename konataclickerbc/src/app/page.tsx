"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./style.css";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  const [scoreObtained, setScore] = useState(0);

  function updateScore() {
    let newVal = scoreObtained + 1;
    setScore(newVal);
  }
  const [walletAddress, setWalletAddress] = useState();

  async function backendFetch(address: any) {
    try {
      console.log("walletAddress before fetch:", address);
      const data = await fetch(`/api/score?wallet=${address}`);
      const json = await data.json();
      console.log(json);
      setScore(parseInt(json.score));
    } catch (err) {
      console.log("Error");
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request wallet access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        console.log("Connected wallet:", accounts[0]);
        backendFetch(accounts[0]);
      } catch (err) {
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
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: scoreObtained }),
      });
      const data = await res.json();
      console.log(data);
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
