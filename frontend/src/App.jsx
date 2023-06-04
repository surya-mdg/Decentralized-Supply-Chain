import React, { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Bar from "./components/Bar";
import ControlPad from "./components/ControlPad";

import { ethers } from "ethers";
import abi from "./utils/supplychain.json";
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

const getEthereumObject = () => window.ethereum;
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI = abi.abi;

const App = () => {
  const [message, setMessage] = useState("");
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState({});
  const [updated, setUpdated] = useState(false);
  const [progress, setProgress] = useState(0);

  const findAuthorizedWallet = async () => { //Searches for authroized account in Metamask
    try {
      const ethereum = getEthereumObject();

      if (ethereum == null) {
        setMessage("Install Metamask");
        console.log("No Metamask Found");
        return null;
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length == 0) {
        setMessage("Connect");
        console.log("No Authorized Account");
        return null;
      } else {
        setMessage("" + accounts[0]);
        setAccount(accounts[0]);
        GetContract();
        GetMessage();
        console.log("Account connected to: " + accounts[0]);
        accounts[0];
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const ConnectWallet = async () => { //Requests authorization from Metamask to connect account
    try {
      const ethereum = getEthereumObject();

      if (ethereum == null) {
        setMessage("Install Metamask");
        console.log("No Metamask Found");
        return null;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length == 0) {
        setMessage("No Authorized Account");
        console.log("No Authorized Account");
        return null;
      } else {
        setMessage("" + accounts[0]);
        setAccount(accounts[0]);
        GetContract();
        console.log("Account connected to: " + accounts[0]);
        accounts[0];
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const GetMessage = async () => {
    try {
        //const ethereum = getEthereumObject();
        const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const supplyChainContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        supplyChainContract.on("ChainUpdated", () => {
          setUpdated(true);
        });
      } 
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const GetContract = async() => { //Retrieves contract from the blockchain
    try {
      const ethereum = getEthereumObject();

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const supplyChainContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setContract(supplyChainContract);
    } else setMessage("Ethereum Not Found");
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  useEffect(() => {
    async function getAccount() {
      const acc = findAuthorizedWallet();
      if (acc != null) {
      }
    }
    getAccount();
  }, []);

  const IncreaseProgress = (reset, stage) => { //Updates the progress bar when called
    if(reset)
    {
      setProgress(0);
      return;
    }
    switch(stage)
    {
      case 0:
        setProgress(51);
        break;
      case 1:
        setProgress(100);
        break;
      default:
        break;
    }
  }

  return (
    <div className="body">
      <Navbar msg={message} connect={ConnectWallet}/>
      <Bar progress={progress} className="bar"/>
      <ControlPad getMessage={GetMessage} contract1={contract} address={contractAddress} abi={contractABI} increase={IncreaseProgress}/>
    </div>
  );
};

export default App;