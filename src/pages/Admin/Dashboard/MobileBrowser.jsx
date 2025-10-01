import React from "react";
import { ProgressBar } from "react-bootstrap";
import { ImageElement} from "../../../components";


export default function MobileBrowser() {
    return ( 
        <div className="table-responsive datatable-wrap">
            <table className="table browserTable mb-0">
                <thead>
                    <tr>
                        <th>NO</th>
                        <th>BROWSER</th>
                        <th>VISITS</th>
                        <th>DATA IN PERCENTAGE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>
                            <div className="d-flex align-items-center">
                                <ImageElement source="chrome.svg" className="logo"/>
                                <span className="ml-2">Chrome</span>
                            </div>
                        </td>
                        <td>450</td>
                        <td>
                            <div className="d-flex align-items-center gap-2">
                                <ProgressBar variant="success" now={64.75} className="w-100"/>
                                <span>64.75%</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>
                            <div className="d-flex align-items-center">
                                <ImageElement source="safari.svg" className="logo"/>
                                <span className="ml-2">Safari</span>
                            </div>
                        </td>
                        <td>450</td>
                        <td>
                            <div className="d-flex align-items-center gap-2">
                                <ProgressBar variant="info" now={18.43} className="w-100"/>
                                <span>18.43%</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>
                            <div className="d-flex align-items-center">
                                <ImageElement source="firefox.svg" className="logo"/>
                                <span className="ml-2">Firefox</span>
                            </div>
                        </td>
                        <td>450</td>
                        <td>
                            <div className="d-flex align-items-center gap-2">
                                <ProgressBar variant="warning" now={8.37} className="w-100"/>
                                <span>8.37%</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>
                            <div className="d-flex align-items-center">
                                <ImageElement source="edge.svg" className="logo"/>
                                <span className="ml-2">Edge</span>
                            </div>
                        </td>
                        <td>450</td>
                        <td>
                            <div className="d-flex align-items-center gap-2">
                                <ProgressBar variant="info" now={6.12} className="w-100"/>
                                <span>6.12%</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>
                            <div className="d-flex align-items-center">
                                <ImageElement source="opera.svg" className="logo"/>
                                <span className="ml-2">Opera</span>
                            </div>
                        </td>
                        <td>450</td>
                        <td>
                            <div className="d-flex align-items-center gap-2">
                                <ProgressBar variant="danger" now={12.12} className="w-100"/>
                                <span>12.12%</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>
                            <div className="d-flex align-items-center">
                                <ImageElement source="uc.svg" className="logo"/>
                                <span className="ml-2">UC Browser</span>
                            </div>
                        </td>
                        <td>450</td>
                        <td>
                            <div className="d-flex align-items-center gap-2">
                                <ProgressBar variant="warning" now={20.14} className="w-100"/>
                                <span>20.14%</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}