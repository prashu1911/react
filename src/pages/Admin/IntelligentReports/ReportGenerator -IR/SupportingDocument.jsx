import React from "react";
import { Link } from "react-router-dom";

export default function SupportingDocument() {
    return (
        <ol className="list-group-numbered p-0 uploadedFile">
            <li className="list-group-item text-truncate"><Link>Lorem-ipsum-dolor.pdf</Link></li>
            <li className="list-group-item text-truncate"><Link>Lorem-ipsum-dolor.pdf</Link></li>
            <li className="list-group-item text-truncate"><Link>Lorem-ipsum-dolor.pdf</Link></li>
        </ol>
    )
}