import React from "react";
import { ImageElement } from "components";
import { useAuth } from "customHooks";

function FallBackLoader({ customStyles }) {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  return (
    <div className="mainLoader" style={customStyles || {}}>
      <div className="loaderImg d-flex">
        <svg
          xmlns="
                http://www.w3.org/2000/svg"
          width="53.632999420166016"
          height="29.493999481201172"
          viewBox="0 0 53.633 29.494"
        >
          <path
            id="Path_265082"
            data-name="Path 265082"
            d="M32.912,51.726s1.395-10.783,5.93-10.652a3.228,3.228,0,0,1,2.971,1.6c2.08,2.977,4.006,9.479,4.006,9.479s4.666,10.465,8.873-.807c2.077-8.67,3.107-18.423,8.019-18.233,1.266.15,2.61.1,4.1,3.155C69.62,44,69.882,52.344,72.594,55.877c1.529,1.36,3.657,1.953,7.02-.589"
            transform="translate(-29.832 -30.355)"
            fill="none"
            stroke="#fff"
            strokeLinecap="round"
            strokeWidth="5.5"
            className="path svg-elem-1"
          />
        </svg>
        {/* <ImageElement source="loader-text.svg"  alt="logo" /> */}
        <ImageElement
          previewSource={`../../assets/admin-images/busy_icon/${
            userData?.companyConfig?.busy_icon ?? "loader-text.svg"
          }`}
          className="loader ms-2"
          alt="logo"
        />
      </div>
    </div>
  );
}

export default FallBackLoader;
