import React, { useState, useEffect } from "react";
import abi from "./utils/supplychain.json";
import "./App.css";
import Navbar from "./components/Navbar";
import Body from "./components/Body";
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

import { ethers } from "ethers";

const getEthereumObject = () => window.ethereum;
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI = abi.abi;

const App = () => {
  const [message, setMessage] = useState("Loading...");
  const [account, setAccount] = useState("");
  const [status, setStatus] = useState(false);
  const [contract, setContract] = useState({})

  const findAuthorizedWallet = async () => {
    try {
      const ethereum = getEthereumObject();

      if (ethereum == null) {
        setMessage("Install Metamask");
        console.log("No Metamask Found");
        return null;
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

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

  const ConnectWallet = async () => {
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

        let count = await supplyChainContract.GetCount();
        console.log(count.toNumber());

        /*supplyChainContract.on("OnGet", (_message) => {
          setMessage(_message);
        });*/
      } else setMessage("Ethereum Not Found");
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const GetContract = async() => {
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

  return (
    <div>
      <Navbar />
      <Body msg={message} connect={ConnectWallet} getMessage={GetMessage} contract={contract}/>
      {status ? <h1>hello</h1> : null}
    </div>
  );
};

export default App;