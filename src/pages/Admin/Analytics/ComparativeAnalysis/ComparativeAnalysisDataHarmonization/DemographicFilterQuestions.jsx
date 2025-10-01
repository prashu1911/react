import React, { useState } from "react";
import { Dropdown, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button, InputField, ModalComponent, SelectField } from "../../../../../components";

export default function DemographicFilterQuestions() {
    // department options
    const departmentOptions = [
        { value: 'Department', label: 'Department' },
        { value: 'Department 1', label: 'Department 1' },
        { value: 'Department 2', label: 'Department 2' }
    ];
    
    // Combine Department modal
    const [showCombineDepartment, setShowCombineDepartment] = useState(false);
    const combineDepartmentClose = () => setShowCombineDepartment(false);
    const combineDepartmentShow = () => setShowCombineDepartment(true);

    // Responses Harmonization modal
    const [showResponsesHarmonization, setShowResponsesHarmonization] = useState(false);
    const responsesHarmonizationClose = () => setShowResponsesHarmonization(false);
    const responsesHarmonizationShow = () => setShowResponsesHarmonization(true);

    // Exclude/Restore toggle
    const [toggleStates, setToggleStates] = useState([false, false]);
    const excludeRestoreToggle = (index) => {
        const updatedStates = [...toggleStates];
        updatedStates[index] = !updatedStates[index];
        setToggleStates(updatedStates);
    };
    
    // add new row in table
    const [rows, setRows] = useState([{ id: 'row_0', visible: false }]);
    const addRow = () => {
        setRows(prevRows => {
          // Clone the first row and set it to visible
          const newRow = { ...prevRows[0], id: `row_${prevRows.length}`, visible: true };
          // Append the new row
          return [...prevRows, newRow];
        });
    };
    // for modal
    const [modalrows, setModalRows] = useState([{ id: 'row_0', visible: false }]);
    const addModalRow = () => {
        setModalRows(prevRows => {
          // Clone the first row and set it to visible
          const newRow = { ...prevRows[0], id: `row_${prevRows.length}`, visible: true };
          // Append the new row
          return [...prevRows, newRow];
        });
    };
    // end
    return(
        <>
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
                            <th>Responses Block</th>
                            <th>Category Display Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className="d-flex align-items-center gap-2 justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <em className="icon-drag cursor-pointer" />
                                        <span>Role</span>
                                    </div>
                                    <Dropdown drop="bottom" align="end">
                                        <Dropdown.Toggle as="div" className={toggleStates[21] ? 'icon-red' : 'icon-secondary'}>
                                            <em className="icon-settings-outline" />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu >
                                            <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(21)}>
                                            <em className={toggleStates[21] ? 'icon-clear' : 'icon-close-circle'} />
                                             {toggleStates[21] ? 'Restore' : 'Exclude'}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center gap-2 justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <em className="icon-drag cursor-pointer" />
                                        <span>Finance</span>
                                    </div>
                                    <Dropdown drop="bottom" align="end">
                                        <Dropdown.Toggle as="div" className={toggleStates[22] ? 'icon-red' : 'icon-secondary'}>
                                            <em className="icon-settings-outline" />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu >
                                            <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(22)}>
                                            <em className={toggleStates[22] ? 'icon-clear' : 'icon-close-circle'} />
                                             {toggleStates[22] ? 'Restore' : 'Exclude'}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center gap-2 justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <em className="icon-drag cursor-pointer" />
                                        <span>Business Analysis</span>
                                    </div>
                                    <Dropdown drop="bottom" align="end">
                                        <Dropdown.Toggle as="div" className={toggleStates[23] ? 'icon-red' : 'icon-secondary'}>
                                            <em className="icon-settings-outline" />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu >
                                            <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(23)}>
                                            <em className={toggleStates[23] ? 'icon-clear' : 'icon-close-circle'} />
                                             {toggleStates[23] ? 'Restore' : 'Exclude'}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </td>
                            <td>
                                <Link href="#!" className="link-primary" onClick={responsesHarmonizationShow}><em className="icon-shuffle" /></Link>
                            </td>
                            <td>
                                <Form.Group className="form-group mb-0" >
                                    <InputField type="text" placeholder="Category Name" />
                                </Form.Group>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="d-flex align-items-center gap-2 justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <em className="icon-drag cursor-pointer" />
                                        <span>Gender</span>
                                    </div>
                                    <Dropdown drop="bottom" align="end">
                                        <Dropdown.Toggle as="div" className={toggleStates[24] ? 'icon-red' : 'icon-secondary'}>
                                            <em className="icon-settings-outline" />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu >
                                            <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(24)}>
                                            <em className={toggleStates[24] ? 'icon-clear' : 'icon-close-circle'} />
                                             {toggleStates[24] ? 'Restore' : 'Exclude'}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center gap-2 justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <em className="icon-drag cursor-pointer" />
                                        <span>HR</span>
                                    </div>
                                    <Dropdown drop="bottom" align="end">
                                        <Dropdown.Toggle as="div" className={toggleStates[25] ? 'icon-red' : 'icon-secondary'}>
                                            <em className="icon-settings-outline" />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu >
                                            <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(25)}>
                                            <em className={toggleStates[25] ? 'icon-clear' : 'icon-close-circle'} />
                                             {toggleStates[25] ? 'Restore' : 'Exclude'}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center gap-2 justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <em className="icon-drag cursor-pointer" />
                                        <span>Business Development</span>
                                    </div>
                                    <Dropdown drop="bottom" align="end">
                                        <Dropdown.Toggle as="div" className={toggleStates[26] ? 'icon-red' : 'icon-secondary'}>
                                            <em className="icon-settings-outline" />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu >
                                            <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(26)}>
                                            <em className={toggleStates[26] ? 'icon-clear' : 'icon-close-circle'} />
                                             {toggleStates[26] ? 'Restore' : 'Exclude'}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </td>
                            <td>
                                <Link href="#!" className="link-primary" onClick={responsesHarmonizationShow}><em className="icon-shuffle" /></Link>
                            </td>
                            <td>
                                <Form.Group className="form-group mb-0" >
                                    <InputField type="text" placeholder="Category Name" />
                                </Form.Group>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="d-flex align-items-center gap-2 justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <em className="icon-drag cursor-pointer" />
                                        <span>Age</span>
                                    </div>
                                    <Dropdown drop="bottom" align="end">
                                        <Dropdown.Toggle as="div" className={toggleStates[27] ? 'icon-red' : 'icon-secondary'}>
                                            <em className="icon-settings-outline" />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu >
                                            <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(27)}>
                                            <em className={toggleStates[27] ? 'icon-clear' : 'icon-close-circle'} />
                                             {toggleStates[27] ? 'Restore' : 'Exclude'}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center gap-2 justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <em className="icon-drag cursor-pointer" />
                                        <span>QA</span>
                                    </div>
                                    <Dropdown drop="bottom" align="end">
                                        <Dropdown.Toggle as="div" className={toggleStates[28] ? 'icon-red' : 'icon-secondary'}>
                                            <em className="icon-settings-outline" />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu >
                                            <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(28)}>
                                            <em className={toggleStates[28] ? 'icon-clear' : 'icon-close-circle'} />
                                             {toggleStates[28] ? 'Restore' : 'Exclude'}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center gap-2 justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <em className="icon-drag cursor-pointer" />
                                        <span>React JS</span>
                                    </div>
                                    <Dropdown drop="bottom" align="end">
                                        <Dropdown.Toggle as="div" className={toggleStates[29] ? 'icon-red' : 'icon-secondary'}>
                                            <em className="icon-settings-outline" />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu >
                                            <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(29)}>
                                            <em className={toggleStates[29] ? 'icon-clear' : 'icon-close-circle'} />
                                             {toggleStates[29] ? 'Restore' : 'Exclude'}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </td>
                            <td>
                                <Link href="#!" className="link-primary" onClick={responsesHarmonizationShow}><em className="icon-shuffle" /></Link>
                            </td>
                            <td>
                                <Form.Group className="form-group mb-0" >
                                    <InputField type="text" placeholder="Category Name" />
                                </Form.Group>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="d-flex align-items-center gap-2 justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <em className="icon-drag cursor-pointer" />
                                        <span>Office Location</span>
                                    </div>
                                    <Dropdown drop="bottom" align="end">
                                        <Dropdown.Toggle as="div" className={toggleStates[30] ? 'icon-red' : 'icon-secondary'}>
                                            <em className="icon-settings-outline" />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu >
                                            <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(30)}>
                                            <em className={toggleStates[30] ? 'icon-clear' : 'icon-close-circle'} />
                                             {toggleStates[30] ? 'Restore' : 'Exclude'}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center gap-2 justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <em className="icon-drag cursor-pointer" />
                                        <span>QA</span>
                                    </div>
                                    <Dropdown drop="bottom" align="end">
                                        <Dropdown.Toggle as="div" className={toggleStates[31] ? 'icon-red' : 'icon-secondary'}>
                                            <em className="icon-settings-outline" />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu >
                                            <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(31)}>
                                            <em className={toggleStates[31] ? 'icon-clear' : 'icon-close-circle'} />
                                             {toggleStates[31] ? 'Restore' : 'Exclude'}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center gap-2 justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <em className="icon-drag cursor-pointer" />
                                        <span>Testing team</span>
                                    </div>
                                    <Dropdown drop="bottom" align="end">
                                        <Dropdown.Toggle as="div" className={toggleStates[32] ? 'icon-red' : 'icon-secondary'}>
                                            <em className="icon-settings-outline" />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu >
                                            <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(32)}>
                                            <em className={toggleStates[32] ? 'icon-clear' : 'icon-close-circle'} />
                                             {toggleStates[32] ? 'Restore' : 'Exclude'}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </td>
                            <td>
                                <Link href="#!" className="link-primary" onClick={responsesHarmonizationShow}><em className="icon-shuffle" /></Link>
                            </td>
                            <td>
                                <Form.Group className="form-group mb-0" >
                                    <InputField type="text" placeholder="Category Name" />
                                </Form.Group>
                            </td>
                        </tr>
                        {rows.map((row, index) => row.visible && (
                        <tr key={index}>
                            <td>
                                <div className="d-flex align-items-center gap-2 justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <em className="icon-drag cursor-pointer" />
                                        <span />
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center gap-2 justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <em className="icon-drag cursor-pointer" />
                                        <span />
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex align-items-center gap-2 justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <em className="icon-drag cursor-pointer" />
                                        <span />
                                    </div>
                                </div>
                            </td>
                            <td>
                                <Link href="#!" className="link-primary"><em className="icon-shuffle" /></Link>
                            </td>
                            <td>
                                <Form.Group className="form-group mb-0" >
                                    <InputField type="text" placeholder="Category Name" />
                                </Form.Group>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        <div className="d-flex align-items-center gap-2 justify-content-between mt-3 flex-wrap">
            <div className="d-flex align-items-center gap-2">
                <Button variant="secondary" className="ripple-effect" onClick={addRow}>Add Row</Button>
                <Button variant="primary" className="ripple-effect"><em className="icon-settings-outline me-2" />Excluded</Button>
            </div>
            <Button variant="primary" className="ripple-effect">Save</Button>
        </div>
        {/* responses Harmonization */}
        <ModalComponent modalHeader="Responses Harmonization" modalExtraClass="responsesHarmonization" size="xl" show={showResponsesHarmonization} onHandleCancel={responsesHarmonizationClose}>
            <div className="commonTable dataTable">
                <div className="table-responsive datatable-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Enterprise Demonstration Survey - DEI 2024TESTING</th>
                                <th>DEI (Comparative Assessment 1) TESTING2024</th>
                                <th className="min-w-220">Auditors</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <em className="icon-drag cursor-pointer" />
                                            <span>President</span>
                                        </div>
                                        <Dropdown drop="bottom" align="end">
                                            <Dropdown.Toggle as="div" className={toggleStates[0] ? 'icon-red' : 'icon-secondary'}>
                                                <em className="icon-settings-outline" />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                <Dropdown.Item href="#!" onClick={combineDepartmentShow}><em className="icon-copy" />Combine</Dropdown.Item>
                                                <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(0)}>
                                                <em className={toggleStates[0] ? 'icon-clear' : 'icon-close-circle'} />
                                                    {toggleStates[0] ? 'Restore' : 'Exclude'}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <em className="icon-drag cursor-pointer" />
                                            <span>Finance</span>
                                        </div>
                                        <Dropdown drop="bottom" align="end">
                                            <Dropdown.Toggle as="div" className={toggleStates[1] ? 'icon-red' : 'icon-secondary'}>
                                                <em className="icon-settings-outline" />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                <Dropdown.Item href="#!" onClick={combineDepartmentShow}><em className="icon-copy" />Combine</Dropdown.Item>
                                                <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(1)}>
                                                <em className={toggleStates[1] ? 'icon-clear' : 'icon-close-circle'} />
                                                    {toggleStates[1] ? 'Restore' : 'Exclude'}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <em className="icon-drag cursor-pointer" />
                                            <span>Business Analysis</span>
                                        </div>
                                        <Dropdown drop="bottom" align="end">
                                            <Dropdown.Toggle as="div" className={toggleStates[2] ? 'icon-red' : 'icon-secondary'}>
                                                <em className="icon-settings-outline" />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                <Dropdown.Item href="#!" onClick={combineDepartmentShow}><em className="icon-copy" />Combine</Dropdown.Item>
                                                <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(2)}>
                                                <em className={toggleStates[2] ? 'icon-clear' : 'icon-close-circle'} />
                                                    {toggleStates[2] ? 'Restore' : 'Exclude'}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <em className="icon-drag cursor-pointer" />
                                            <span>Finance</span>
                                        </div>
                                        <Dropdown drop="bottom" align="end">
                                            <Dropdown.Toggle as="div" className={toggleStates[3] ? 'icon-red' : 'icon-secondary'}>
                                                <em className="icon-settings-outline" />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                <Dropdown.Item href="#!" onClick={combineDepartmentShow}><em className="icon-copy" />Combine</Dropdown.Item>
                                                <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(3)}>
                                                <em className={toggleStates[3] ? 'icon-clear' : 'icon-close-circle'} />
                                                    {toggleStates[3] ? 'Restore' : 'Exclude'}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <em className="icon-drag cursor-pointer" />
                                            <span>HR</span>
                                        </div>
                                        <Dropdown drop="bottom" align="end">
                                            <Dropdown.Toggle as="div" className={toggleStates[4] ? 'icon-red' : 'icon-secondary'}>
                                                <em className="icon-settings-outline" />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                <Dropdown.Item href="#!" onClick={combineDepartmentShow}><em className="icon-copy" />Combine</Dropdown.Item>
                                                <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(4)}>
                                                <em className={toggleStates[4] ? 'icon-clear' : 'icon-close-circle'} />
                                                    {toggleStates[4] ? 'Restore' : 'Exclude'}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <em className="icon-drag cursor-pointer" />
                                            <span>Business Development</span>
                                        </div>
                                        <Dropdown drop="bottom" align="end">
                                            <Dropdown.Toggle as="div" className={toggleStates[5] ? 'icon-red' : 'icon-secondary'}>
                                                <em className="icon-settings-outline" />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                <Dropdown.Item href="#!" onClick={combineDepartmentShow}><em className="icon-copy" />Combine</Dropdown.Item>
                                                <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(5)}>
                                                <em className={toggleStates[5] ? 'icon-clear' : 'icon-close-circle'} />
                                                    {toggleStates[5] ? 'Restore' : 'Exclude'}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <em className="icon-drag cursor-pointer" />
                                            <span>HR</span>
                                        </div>
                                        <Dropdown drop="bottom" align="end">
                                            <Dropdown.Toggle as="div" className={toggleStates[6] ? 'icon-red' : 'icon-secondary'}>
                                                <em className="icon-settings-outline" />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                <Dropdown.Item href="#!" onClick={combineDepartmentShow}><em className="icon-copy" />Combine</Dropdown.Item>
                                                <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(6)}>
                                                <em className={toggleStates[6] ? 'icon-clear' : 'icon-close-circle'} />
                                                    {toggleStates[6] ? 'Restore' : 'Exclude'}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <em className="icon-drag cursor-pointer" />
                                            <span>QA</span>
                                        </div>
                                        <Dropdown drop="bottom" align="end">
                                            <Dropdown.Toggle as="div" className={toggleStates[7] ? 'icon-red' : 'icon-secondary'}>
                                                <em className="icon-settings-outline" />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                <Dropdown.Item href="#!" onClick={combineDepartmentShow}><em className="icon-copy" />Combine</Dropdown.Item>
                                                <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(7)}>
                                                <em className={toggleStates[7] ? 'icon-clear' : 'icon-close-circle'} />
                                                    {toggleStates[7] ? 'Restore' : 'Exclude'}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <em className="icon-drag cursor-pointer" />
                                            <span>React JS</span>
                                        </div>
                                        <Dropdown drop="bottom" align="end">
                                            <Dropdown.Toggle as="div" className={toggleStates[8] ? 'icon-red' : 'icon-secondary'}>
                                                <em className="icon-settings-outline" />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                <Dropdown.Item href="#!" onClick={combineDepartmentShow}><em className="icon-copy" />Combine</Dropdown.Item>
                                                <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(8)}>
                                                <em className={toggleStates[8] ? 'icon-clear' : 'icon-close-circle'} />
                                                    {toggleStates[8] ? 'Restore' : 'Exclude'}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <em className="icon-drag cursor-pointer" />
                                            <span>IT</span>
                                        </div>
                                        <Dropdown drop="bottom" align="end">
                                            <Dropdown.Toggle as="div" className={toggleStates[9] ? 'icon-red' : 'icon-secondary'}>
                                                <em className="icon-settings-outline" />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                <Dropdown.Item href="#!" onClick={combineDepartmentShow}><em className="icon-copy" />Combine</Dropdown.Item>
                                                <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(9)}>
                                                <em className={toggleStates[9] ? 'icon-clear' : 'icon-close-circle'} />
                                                    {toggleStates[9] ? 'Restore' : 'Exclude'}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <em className="icon-drag cursor-pointer" />
                                            <span>QA</span>
                                        </div>
                                        <Dropdown drop="bottom" align="end">
                                            <Dropdown.Toggle as="div" className={toggleStates[10] ? 'icon-red' : 'icon-secondary'}>
                                                <em className="icon-settings-outline" />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                <Dropdown.Item href="#!" onClick={combineDepartmentShow}><em className="icon-copy" />Combine</Dropdown.Item>
                                                <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(10)}>
                                                <em className={toggleStates[10] ? 'icon-clear' : 'icon-close-circle'} />
                                                    {toggleStates[10] ? 'Restore' : 'Exclude'}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <em className="icon-drag cursor-pointer" />
                                            <span>Testing team</span>
                                        </div>
                                        <Dropdown drop="bottom" align="end">
                                            <Dropdown.Toggle as="div" className={toggleStates[11] ? 'icon-red' : 'icon-secondary'}>
                                                <em className="icon-settings-outline" />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                <Dropdown.Item href="#!" onClick={combineDepartmentShow}><em className="icon-copy" />Combine</Dropdown.Item>
                                                <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(11)}>
                                                <em className={toggleStates[11] ? 'icon-clear' : 'icon-close-circle'} />
                                                    {toggleStates[11] ? 'Restore' : 'Exclude'}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <em className="icon-drag cursor-pointer" />
                                            <span>Marketing</span>
                                        </div>
                                        <Dropdown drop="bottom" align="end">
                                            <Dropdown.Toggle as="div" className={toggleStates[12] ? 'icon-red' : 'icon-secondary'}>
                                                <em className="icon-settings-outline" />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                <Dropdown.Item href="#!" onClick={combineDepartmentShow}><em className="icon-copy" />Combine</Dropdown.Item>
                                                <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(12)}>
                                                <em className={toggleStates[12] ? 'icon-clear' : 'icon-close-circle'} />
                                                    {toggleStates[12] ? 'Restore' : 'Exclude'}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <em className="icon-drag cursor-pointer" />
                                            <span>QA</span>
                                        </div>
                                        <Dropdown drop="bottom" align="end">
                                            <Dropdown.Toggle as="div" className={toggleStates[13] ? 'icon-red' : 'icon-secondary'}>
                                                <em className="icon-settings-outline" />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                <Dropdown.Item href="#!" onClick={combineDepartmentShow}><em className="icon-copy" />Combine</Dropdown.Item>
                                                <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(13)}>
                                                <em className={toggleStates[13] ? 'icon-clear' : 'icon-close-circle'} />
                                                    {toggleStates[13] ? 'Restore' : 'Exclude'}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <em className="icon-drag cursor-pointer" />
                                            <span>Testing team</span>
                                        </div>
                                        <Dropdown drop="bottom" align="end">
                                            <Dropdown.Toggle as="div" className={toggleStates[14] ? 'icon-red' : 'icon-secondary'}>
                                                <em className="icon-settings-outline" />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                <Dropdown.Item href="#!" onClick={combineDepartmentShow}><em className="icon-copy" />Combine</Dropdown.Item>
                                                <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(14)}>
                                                <em className={toggleStates[14] ? 'icon-clear' : 'icon-close-circle'} />
                                                    {toggleStates[14] ? 'Restore' : 'Exclude'}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <em className="icon-drag cursor-pointer" />
                                            <span>Operations</span>
                                        </div>
                                        <Dropdown drop="bottom" align="end">
                                            <Dropdown.Toggle as="div" className={toggleStates[15] ? 'icon-red' : 'icon-secondary'}>
                                                <em className="icon-settings-outline" />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                <Dropdown.Item href="#!" onClick={combineDepartmentShow}><em className="icon-copy" />Combine</Dropdown.Item>
                                                <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(15)}>
                                                <em className={toggleStates[15] ? 'icon-clear' : 'icon-close-circle'} />
                                                    {toggleStates[15] ? 'Restore' : 'Exclude'}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <em className="icon-drag cursor-pointer" />
                                            <span>QA</span>
                                        </div>
                                        <Dropdown drop="bottom" align="end">
                                            <Dropdown.Toggle as="div" className={toggleStates[16] ? 'icon-red' : 'icon-secondary'}>
                                                <em className="icon-settings-outline" />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                <Dropdown.Item href="#!" onClick={combineDepartmentShow}><em className="icon-copy" />Combine</Dropdown.Item>
                                                <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(16)}>
                                                <em className={toggleStates[16] ? 'icon-clear' : 'icon-close-circle'} />
                                                    {toggleStates[16] ? 'Restore' : 'Exclude'}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <em className="icon-drag cursor-pointer" />
                                            <span>Testing team</span>
                                        </div>
                                        <Dropdown drop="bottom" align="end">
                                            <Dropdown.Toggle as="div" className={toggleStates[17] ? 'icon-red' : 'icon-secondary'}>
                                                <em className="icon-settings-outline" />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu >
                                                <Dropdown.Item href="#!" onClick={combineDepartmentShow}><em className="icon-copy" />Combine</Dropdown.Item>
                                                <Dropdown.Item href="#!" onClick={() => excludeRestoreToggle(17)}>
                                                <em className={toggleStates[17] ? 'icon-clear' : 'icon-close-circle'} />
                                                    {toggleStates[17] ? 'Restore' : 'Exclude'}
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </td>
                            </tr>
                            {modalrows.map((row, index2) => row.visible && (
                            <tr key={index2}>
                                <td>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <em className="icon-drag cursor-pointer" />
                                            <span />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <em className="icon-drag cursor-pointer" />
                                            <span />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center gap-2 justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <em className="icon-drag cursor-pointer" />
                                            <span />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="d-flex align-items-center gap-2 justify-content-between mt-3 flex-wrap">
                <div className="d-flex align-items-center gap-2">
                    <Button variant="secondary" className="ripple-effect" onClick={addModalRow}>Add Row</Button>
                    <Button variant="primary" className="ripple-effect"><em className="icon-settings-outline me-2" />Excluded</Button>
                </div>
                <Button variant="primary" className="ripple-effect">Save</Button>
            </div>
        </ModalComponent>

        {/* Combine Department */}
        <ModalComponent modalHeader="Combine Department" modalExtraClass="combineDepartment" show={showCombineDepartment} onHandleCancel={combineDepartmentClose}>
            <Form>
                <Form.Group className="form-group" >
                    <Form.Label>Select Departments</Form.Label>
                    <SelectField placeholder="Select Departments"  options={departmentOptions} />
                </Form.Group>
                <div className="d-flex justify-content-end">
                    <Button variant='primary' className='ripple-effect'>Combine</Button>
                </div>
            </Form>
        </ModalComponent>
        </>
    )
}