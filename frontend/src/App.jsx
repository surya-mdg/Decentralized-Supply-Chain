import React, { useEffect, useState } from "react";
import abi from "./utils/waveportal.json"
import "./App.css";
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

import {ethers} from "ethers";

const getEthereumObject = () => window.ethereum;
//const contractAddress = "0x835E3193f16ff2838668BcEd2B18EBDEdFe9eb01";
const contractAddress = "0x469B4b11F4ad86714E04a6fAb424977fEd2af5F4";
const contractABI = abi.abi;

const findMetaMaskWallet = async () => {
  try{
    const ethereum = getEthereumObject();

    if(!ethereum)
    {
      console.log("Metamask not installed");
      return null;
    }

    const accounts = await ethereum.request({method: "eth_accounts"});

    if(accounts.length !== 0)
    {
      const account = accounts[0];
      console.log("Found authorized account " + account);
      return account
    }
    else
    {
      console.log("No authorized account found");
      return null;
    }
  }
  catch(error){
    console.error(error);
    return null;
  }
}

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [message,setMessage] = useState("");

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({method:"eth_requestAccounts"});
      
      console.log("Account set to: ", accounts[0]);
      setCurrentAccount(accounts[0]);
      getAllWaves();
    } catch (error) {
      console.error(error);
    }
  };

  const wave = async () => {
    try{
      const {ethereum} = window;

      if(ethereum){
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress,contractABI, signer);

      let count = await wavePortalContract.getTotalWaves();
      console.log("Total number of waves: " + count.toNumber());

      const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
      console.log("Mining: " + waveTxn.hash);

      await waveTxn.wait();
      console.log("Mined- " + waveTxn.hash);

      count = await wavePortalContract.getTotalWaves();
      console.log("Total number of waves: " + count.toNumber());
      }
    }
    catch(error){
      console.log(error);
    }
  }

  const onNewWave = (from, timestamp, message) => {
    setAllWaves(prevState => [...prevState, {
      address: from,
      timestamp: new Date(timestamp * 1000),
      message: message
    }]);
  }

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        wavePortalContract.on("NewWave", onNewWave);

        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function getAccount() {
    const account = await findMetaMaskWallet();
    if(account !== null)
    {
      setCurrentAccount(account);
      getAllWaves();
    }}
    getAccount();
  },[]);

  function SetMessage(event)
  {
    setMessage(event.target.value);
  }

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        <input type="text" placeholder="Message..." value={message} onChange={SetMessage} className="login-box" />

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
};

export default App;
