import { BASE_NAME } from "config";
import React from "react";
import { Link } from "react-router-dom";

export default function SupportingDocumentFileTable({ SectionData }) {
    console.log("SectionData", SectionData)
    return (
        <div className="table-responsive datatable-wrap">
            <table className="table reportTable withBorder">
                <tbody>
                    {SectionData?.attributeData?.widgetData?.files?.map((item, index) => (
                        <tr key={index}>
                            <td className='text-center'>{index + 1}</td>
                            <td>
                                <Link
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (item?.file_name) {
                                            window.open(`${BASE_NAME}/v1/storage/uploads/documents/IRSupportDocs/${item?.file_name}`, "_blank");
                                        }
                                    }}
                                >
                                    {item.name}
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}