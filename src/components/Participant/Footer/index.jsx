import React from "react";
import ImageElement from "../../ImageElement";


function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
        <div className="container">
            <div className="d-flex flex-wrap flex-sm-nowrap align-items-center justify-content-between text-center">
                <p className="mb-0 order-2 order-sm-1">Metolius V5.0 © {currentYear}, All Rights Reserved.</p>
                <ImageElement imageFor="participant" source="logo-icon-dark.svg" className="img-fluid order-1 order-md-2 darkLogo" alt="metolius-logo" />
                <ImageElement imageFor="participant" source="logo-icon-white.svg" className="img-fluid order-1 order-md-2 whiteLogo d-none" alt="metolius-logo" />
            </div>
        </div>
    </footer>
    );
  }

  export default Footer;