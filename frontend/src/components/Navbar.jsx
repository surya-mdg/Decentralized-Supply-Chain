import React from "react";

const Navbar = (props) => {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <a className="navbar-brand text-poppins" href="#" style={{color: "#DDE6ED"}}>
          D-Chain
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button type="button" className="btn btn-outline-light connect-text" onClick={() => props.connect()}>{(props.msg == "") ? "Connect" : props.msg}</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
