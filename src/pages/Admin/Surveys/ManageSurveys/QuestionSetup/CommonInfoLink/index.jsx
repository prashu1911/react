import React, { useState } from "react";
import { Link } from "react-router-dom";

function CommonInfoLink({ showDataAnalytics, showInfoGather, handleClick }) {
  // In Data Analytics & Information Gathering active class toggle
  const [activeElement, setActiveElement] = useState("Data Analytics");
  return (
    <div className="d-flex align-items-center gap-xl-3 gap-2 flex-wrap">
      {showDataAnalytics || (
        <Link
          onClick={(e) => {
            e.preventDefault();
            handleClick("Data Analytics");
            setActiveElement("Data Analytics");
          }}
          className={`commonInfoLink commonInfoLink_blue mt-0 ${activeElement === "Data Analytics" ? "active" : ""}`}
        >
          Data Analytics
        </Link>
      )}
      {showInfoGather || (
        <Link
          onClick={(e) => {
            e.preventDefault();
            handleClick("Information Gathering");
            setActiveElement("Information Gathering");
          }}
          className={`commonInfoLink mt-0 ${activeElement === "Information Gathering" ? "active" : ""}`}
        >
          Information Gathering
        </Link>
      )}
    </div>
  );
}

export default CommonInfoLink;
