import React from "react";
import { Form } from "react-bootstrap";
import { Button, InputField } from "../../../../../components";

export default function Outcomes() {
    return(
        <>
        <div className="dataAccordion_title">Data Analytics Outcome</div>
        <div className="commonTable dataTable">
            <div className="table-responsive datatable-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                <span>Enterprise Demonstration Survey - DEI 2024TESTING</span>
                                <span className="d-block link-primary text-capitalize">Default Survey</span>
                            </th>
                            <th>DEI (Comparative Assessment 1) TESTING2024</th>
                            <th className="min-w-220">Auditors</th>
                            <th>Outcome Display Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className="d-flex align-items-center">
                                    <em className="icon-drag cursor-pointer" />
                                    <span>How Are We Doing ?</span>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <em className="icon-drag cursor-pointer" />
                                    <span>Board Process</span>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <em className="icon-drag cursor-pointer" />
                                    <span>your feedback is critical</span>
                                </div>
                            </td>
                            <td>
                                <Form.Group className="form-group mb-0" >
                                    <InputField type="text" placeholder="Outcome Name" />
                                </Form.Group>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="d-flex align-items-center">
                                    <em className="icon-drag cursor-pointer" />
                                    <span>Gender</span>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <em className="icon-drag cursor-pointer" />
                                    <span>HR</span>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <em className="icon-drag cursor-pointer" />
                                    <span>Business Development</span>
                                </div>
                            </td>
                            <td>
                                <Form.Group className="form-group mb-0" >
                                    <InputField type="text" placeholder="Outcome Name" />
                                </Form.Group>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div className="dataAccordion_title mt-3">Information Gathering Outcome</div>
        <div className="commonTable dataTable">
            <div className="table-responsive datatable-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                <span>Enterprise Demonstration Survey - DEI 2024TESTING</span>
                                <span className="d-block link-primary text-capitalize">Default Survey</span>
                            </th>
                            <th>DEI (Comparative Assessment 1) TESTING2024</th>
                            <th className="min-w-220">Auditors</th>
                            <th>Outcome Display Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className="d-flex align-items-center">
                                    <em className="icon-drag cursor-pointer" />
                                    <span>Your Experiences</span>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <em className="icon-drag cursor-pointer" />
                                    <span>Areas Of Board Management</span>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <em className="icon-drag cursor-pointer" />
                                    <span>Errors</span>
                                </div>
                            </td>
                            <td>
                                <Form.Group className="form-group mb-0" >
                                    <InputField type="text" placeholder="Outcome Name" />
                                </Form.Group>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="d-flex align-items-center">
                                    <em className="icon-drag cursor-pointer" />
                                    <span>Your Experiences</span>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <em className="icon-drag cursor-pointer" />
                                    <span>Areas Of Board Management</span>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <em className="icon-drag cursor-pointer" />
                                    <span>Errors</span>
                                </div>
                            </td>
                            <td>
                                <Form.Group className="form-group mb-0" >
                                    <InputField type="text" placeholder="Outcome Name" />
                                </Form.Group>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div className="d-flex justify-content-end mt-3">
            <Button variant="primary" className="ripple-effect">Save</Button>
        </div>
        </>
    )
}