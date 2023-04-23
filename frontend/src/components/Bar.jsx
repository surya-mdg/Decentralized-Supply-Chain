import React, { useState, useEffect } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar';

const Bar = (props) => {
    const [progress, setProgress] = useState(51);

    const IncreaseProgress = () => {
        const intervalId = setInterval(() => {
            setProgress(progress => progress + 1);
        }, 100);
        if(progress == 25)
            clearInterval(intervalId);
    }

    return (
        <div className="container main-body">
            <div className="row d-flex align-items-center justify-content-center button-row">              
                <div className="col-md-3">
                    <img src="src\images\BlackArrow.png" alt="My Image" className="image"/>
                </div>
                <div className="col-md-3">
                    <img src="src\images\BlackArrow.png" alt="My Image" className="image" style={{opacity: "0"}}/>
                </div>
                <div className="col-md-3">
                    <img src="src\images\BlackArrow.png" alt="My Image" className="image"/>
                </div>
                <div className="col-md-3">
                    <img src="src\images\BlackArrow.png" alt="My Image" className="image" style={{opacity: "0"}}/>
                </div>
                <div className="col-md-3">
                    <img src="src\images\BlackArrow.png" alt="My Image" className="abs-image"/>
                </div>
            </div>
            <div className="row d-flex align-items-center justify-content-center button-row">
                <div className="col-md-12">
                    <ProgressBar animated now={props.progress} />
                </div>
            </div>
        </div>
    );
}

export default Bar;