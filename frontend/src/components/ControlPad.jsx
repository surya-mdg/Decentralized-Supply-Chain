import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const ControlPad = (props) => {
    const [index, setIndex] = useState(0);
    const [prodID, setID] = useState(1000000000);
    const [status, setStatus] =  useState({type: "", owner: "", location: "", desc: "", prodName: "", processDesc: "", nodeAdd: ""});
    const [nodeNo, setNodeNo] = useState(0);
    const [location, setLocation] = useState("");

    useEffect(() => {
        try {
            
            const {ethereum} = window;
    
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const supplyChainContract = new ethers.Contract(
                props.address,
                props.abi,
                signer
            );
    
            supplyChainContract.on("ChainUpdated", () => {
              console.log("Updated");
            });
          } 
        } catch (error) {
          console.log(error);
          return null;
        }
      }, []);

    const IncreaseProgress = () => {
        GetNode();
        props.increase();
        setIndex(index + 1);
    }

    const CreateProduct = async () => {
        await props.contract1.CreateProduct(1);
        let count = await props.contract1.prodCount();
        let code = (1 * 1000000000) + (count - 1);
        await props.contract1.UpdateUser("Supplier", "Elon Musk", "Florida #27", "Produces high quality pure butter");
        await props.contract1.UpdateSupplyChain(code, "Peanut Butter", "Packaged 100kg of butter"); 
        setID(code);
    }

    const UpdateChain = async () => {
        if(nodeNo === 0)
        {
            await props.contract1.UpdateUser("Manufacturer", "Edward Wright", "Florida #27", "Processes raw ingredients");
            await props.contract1.UpdateSupplyChain(prodID, "Peanut Butter", "Mixed with Peanuts"); 
            setNodeNo(1);
        }
        else
        {
            await props.contract1.UpdateUser("Store", "Jared Xavier", "Florida #27", "Sells high quality product");
            await props.contract1.UpdateSupplyChain(prodID, "Peanut Butter", "Stored in Cabinet"); 
        }
    }

    const GetNode = async () => {
        const info = await props.contract1.GetSupplyChain(prodID);
        const chainInfo = {type: info[index][0][0], owner: info[index][0][1], location: info[index][0][2], desc: info[index][0][3], prodName: info[index][1], processDesc: info[index][2], nodeAdd: info[index][3]};
        setStatus(chainInfo);
    }

    const UpdateTracker = async () => {
        await props.contract1.SetTracker(location);
    };

    const UpdateText = async (event) => {
        console.log(event.target.value);
        setLocation(event.target.value);
    };

    const GetChain = async () => {
        const info = await props.contract1.GetSupplyChain(prodID);
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
                        <div className="col-md-3 main-text" style={{marginRight: "1vw", padding: "1vh", marginTop: "22vh"}}>
                            <button type="button" className="btn btn-outline-dark round-button" onClick={() => IncreaseProgress()}>Update</button>
                        </div>
                        <div className="col-md-3 main-text" style={{marginRight: "1vw", padding: "1vh", marginTop: "22vh"}}>
                            <button type="button" className="btn btn-outline-dark round-button" onClick={() => GetChain()}>Chain</button>
                        </div>
                        <div className="col-md-3 main-text" style={{marginRight: "1vw", padding: "1vh", marginTop: "22vh"}}>
                            <button type="button" className="btn btn-outline-dark round-button" onClick={() => UpdateChain()}>Add</button>
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
                    <div className="row status-bar-section" style={{height: "30vh"}}>
                        <h6 align="left" >Type - {status.type}</h6>
                        <h6 align="left">Owner - {status.owner}</h6>
                        <h6 align="left">Location - {status.location}</h6>
                        <h6 align="left">Description - {status.desc}</h6>
                        <h6 align="left">Product Name - {status.prodName}</h6>
                        <h6 align="left">Process Description - {status.processDesc}</h6>
                        <h6 align="left">Node Address - {status.nodeAdd}</h6>
                    </div>
                    <div className="row align-items-center justify-content-center status-bar-section text-mono" style={{height: "7vh", border: "0px"}}>
                        <h4 style={{fontSize: "1.5rem", paddingTop: "2vh"}}>ID -  {prodID}</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ControlPad;