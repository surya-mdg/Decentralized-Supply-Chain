import React, { useState, useEffect } from "react";

import { ethers } from "ethers";
import abi from "../utils/supplychain.json";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI = abi.abi;
let supplyChainContract;
let lock = true; //To prevent status from updating on start
let updateCount = 0; //Used for testing purpose to keep track how many times event was called

const ControlPad = (props) => {
    const [index, setIndex] = useState(0);
    const [prodID, setID] = useState(1000000000);
    const [status, setStatus] =  useState({type: "", owner: "", location: "", desc: "", prodName: "", processDesc: "", nodeAdd: ""});
    const [nodeNo, setNodeNo] = useState(0);
    const [location, setLocation] = useState("");

    useEffect(() => {
        const reloadRun = async () => {
            await GetContract();
        }

        reloadRun();
      }, [props.increase]);

    const GetContract = async () => { //Retrieves the contract from the blockchain
        const {ethereum} = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        supplyChainContract = new ethers.Contract(contractAddress, contractABI, signer);

        supplyChainContract.on("ChainUpdated", () => {
            
            console.log(updateCount++ + ": Event Called");
            IncreaseProgress();
        });
    }

    const IncreaseProgress = () => { //Updates the progress bar when called
        console.log("Updated Chain");
        GetNode(prodID);
        setIndex(index + 1);
    }

    const CreateProduct = async () => { //Creates a new product
        lock = false;

        await props.contract1.CreateProduct(1);
        props.increase(true, 0);
        setStatus({type: "", owner: "", location: "", desc: "", prodName: "", processDesc: "", nodeAdd: ""});
        let count = await props.contract1.prodCount();
        let code = 1 * 1000000000 + parseInt(count);
        console.log("Product ID: " + code);
        setID(code);
    }

    const UpdateChain = async () => { //Test function to update the supply chain
        if(nodeNo === 0)
        {
            await props.contract1.UpdateUser("Manufacturer", "Vigneshwar Ravindran", "Mandya-670016", "Produce finest finished food products using the very best ingredients");
            await props.contract1.UpdateSupplyChain(prodID, "Peanut Butter", "Processed butter,peanuts & additives into packaged 200g peanut butter"); 
            setNodeNo(1);
        }
        else
        {
            await props.contract1.UpdateUser("Distributor", "Dinesh Balivada", "Bangalore-770016", "Purchases & distributes the finest products to your nearest store");
            await props.contract1.UpdateSupplyChain(prodID, "Peanut Butter", "Stored inside container with surronding temperature within range 20-25°C");
        }
    }

    const GetNode = async (id) => { //Gets info of the latest node in the supply chain
        if(lock) return;

        let count = await supplyChainContract.prodCount();
        let code = 1 * 1000000000 + parseInt(count - 1);
        const info = await supplyChainContract.GetSupplyChain(code);
        const index1 = info.length - 1;
        props.increase(false, index1);
        const bigNum = BigInt(info[index1][4]);
        const timestamp = new Date(Number(bigNum) * 1000);
        const chainInfo = {type: info[index1][0][1], owner: info[index1][0][2], location: info[index1][0][3], desc: info[index1][0][4], prodName: info[index1][1], processDesc: (info[index1][2].substring(0, 24) + "..."), nodeAdd: info[index1][3], timestamp: timestamp.toLocaleString()};
        setStatus(chainInfo);
    }

    const UpdateTracker = async () => { //Updates the location
        await props.contract1.SetTracker(location);
    };

    const UpdateText = async (event) => { //Handles text input for location tracker
        setLocation(event.target.value);
    };

    const GetChain = async () => { //Gets the supply chain for a product using the product ID
        console.log("Chain Info for: " + prodID);
        const info = await supplyChainContract.GetSupplyChain(prodID);
        info.map((node) => {
            const chainInfo = {type: node[0][0], owner: node[0][1], location: node[0][2], desc: node[0][3], prodName: node[1], processDesc: node[2], nodeAdd: node[3]};
            console.log(chainInfo);
        })
    }

    return (
        <div className="container control-pad">
            <div className="row d-flex align-items-center justify-content-center button-row control-pad-row">
                <div className="col-md-4 main-text control-pad-item">
                    <div className="row align-items-center justify-content-center control-pad-section">
                        <div className="col-md-5 main-text" style={{marginRight: "1vw", paddingTop: "1vh", fontSize: "1rem", marginLeft: "1vw"}}>
                            <h4 style={{fontSize: "1.4rem"}}>Product - 1</h4>
                        </div>
                        <div className="col-md-4 main-text" style={{marginRight: "1vw", padding: "1vh", marginLeft: "2.5vw"}}>
                            <button type="button" className="btn btn-dark round-button" onClick={() => CreateProduct()}>Create</button>
                        </div>
                        {/*<div className="col-md-3 main-text" style={{marginRight: "1vw", padding: "1vh", marginTop: "22vh"}}>
                            <button type="button" className="btn btn-outline-dark round-button" onClick={() => IncreaseProgress()}>Update</button>
                        </div>
                        <div className="col-md-3 main-text" style={{marginRight: "1vw", padding: "1vh", marginTop: "22vh"}}>
                            <button type="button" className="btn btn-outline-dark round-button" onClick={() => GetChain()}>Chain</button>
                        </div>
                        <div className="col-md-3 main-text" style={{marginRight: "1vw", padding: "1vh", marginTop: "22vh"}}>
                            <button type="button" className="btn btn-outline-dark round-button" onClick={() => UpdateChain()}>Add</button>
                        </div>*/}
                        <div className="row align-items-center justify-content-center prod-id text-mono" style={{height: "7vh", marginTop: "25vh"}}>
                            <h4 style={{fontSize: "1.5rem", paddingTop: "2vh"}}>ID -  {prodID}</h4>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 align-items-center justify-content-center control-pad-item">
                    <div className="mb-3 main-text  control-pad-section">
                        <h4>Tracker</h4>
                        <textarea className="form-control input-box" id="exampleFormControlTextarea1" rows="3" onChange={(event) => UpdateText(event)}></textarea>
                        <button type="button" className="btn btn-dark round-button" onClick={() => UpdateTracker()}>Update</button>
                    </div>
                </div>
                <div className="col-md-4 main-text status-bar-item">
                    <div className="row align-items-center justify-content-center status-bar-section">
                        <h4 style={{fontSize: "1.5rem", paddingTop: "2vh"}}>Status</h4>
                    </div>
                    <div className="row status-bar-section" style={{height: "37vh", border: "none"}}>
                        <h6 align="left">Type - {status.type}</h6>
                        <h6 align="left">Owner - {status.owner}</h6>
                        <h6 align="left">Location - {status.location}</h6>
                        <h6 align="left">Description - {status.desc}</h6>
                        <h6 align="left">Product Name - {status.prodName}</h6>
                        <h6 align="left">Process Description - {status.processDesc}</h6>
                        <h6 align="left">Time - {status.timestamp}</h6>
                        <h6 align="left">Node Address - {status.nodeAdd}</h6>
                    </div>
                    {/*<div className="row align-items-center justify-content-center status-bar-section text-mono" style={{height: "7vh", border: "0px"}}>
                        <h4 style={{fontSize: "1.5rem", paddingTop: "2vh"}}>ID -  {prodID}</h4>
                    </div>*/}
                </div>
            </div>
        </div>
    );
}

export default ControlPad;