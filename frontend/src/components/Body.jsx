import React from "react";

const Body = (props) => {
    return (
        <div className="container main-body">
            <div className="row d-flex align-items-center justify-content-center">
                <div className="col-md-12 main-text">
                    <h1>{props.msg}</h1>
                </div>
            </div>

            <div className="row d-flex align-items-center justify-content-center button-row">
                <div className="col-md-2 main-text">
                    <button type="button" className="btn btn-dark" onClick={() => props.connect()}>Connect Account</button>
                </div>
            </div>
            
            <div className="row d-flex align-items-center justify-content-center button-row">
                <div className="col-md-2 main-text">
                    <button type="button" className="btn btn-dark" onClick={() => props.getMessage()}>Get Message</button>
                </div>
            </div>
            
            <div className="row d-flex align-items-center justify-content-center button-row">
                <div className="col-md-2">
                    <h1 className="text-mono">Working</h1>
                </div>
            </div>
        </div>
    );
}

export default Body;