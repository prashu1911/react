import React from "react";
import { Link } from "react-router-dom";

function CommonEditinfoLink({ isScore }) {
    // In Data Analytics & Information Gathering active class toggle
    return (
        <div className="d-flex align-items-center gap-xl-3 gap-2 flex-wrap">
            {isScore ? (
                <Link
                    className='commonInfoLink commonInfoLink_blue mt-0 active'>
                    Data Analytics
                </Link>
            ) : <Link
                className='commonInfoLink commonInfoLink_blue mt-0  active'>
                   Information Gathering
            </Link>}

        </div>
    );
}

export default CommonEditinfoLink;
