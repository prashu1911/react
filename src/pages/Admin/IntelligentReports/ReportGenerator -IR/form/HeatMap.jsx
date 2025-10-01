import React, { useState } from 'react';
import { Button, InputField, ModalComponent, SelectField, TextEditor } from '../../../../../components';
import { Form } from 'react-bootstrap';
export default function HeatMap() {

    const [selectedBreakout, setSelectedBreakout] = useState(null);
    // Handler for breakout selection
    const handleBreakoutChange = (selectedOption) => {
        setSelectedBreakout(selectedOption ? selectedOption.value : null);
    };
    //Add Instructions edit icon show/hide
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
    };

    // comparision Options
    const comparisionOptions = [
        { value: 'Survey Overall', label: 'Survey Overall' },
        { value: 'Arts, Entertainment, and Recreation', label: 'Arts, Entertainment, and Recreation' },
        { value: 'Construction', label: 'Construction' },
        { value: 'WSA 2022 Overall', label: 'WSA 2022 Overall' }
    ]
    // breakout Options
    const breakoutOptions = [
        { value: 'Department', label: 'Department' },
        { value: 'What is your marital status?', label: 'What is your marital status?' }
    ]
    // departments Options
    const departmentsOptions = [
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Finance', label: 'Finance' }
    ]
    // marital Status Options
    const maritalStatusOptions = [
        { value: 'Single', label: 'Single' },
        { value: 'Married or domestic partnership', label: 'Married or domestic partnership' },
        { value: 'Separated', label: 'Separated' },
        { value: 'Divorced', label: 'Divorced' },
        { value: 'Widowed', label: 'Widowed' },
        { value: 'Prefer not to say', label: 'Prefer not to say' }
    ]
    //Heat Map Instructions modal
    const [heatMapControl, setHeatMapControl] = useState(false);
    const heatMapClose = () => setHeatMapControl(false);
    const heatMapShow = () => setHeatMapControl(true);

    return (
        <>
            <div className='mt-xl-4 mt-3'>
                <Form.Group className="form-group" >
                    <Form.Label>Title</Form.Label>
                    <InputField type={"text"} placeholder={"Enter Title"} />
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Label>Comparision</Form.Label>
                    <SelectField placeholder="Select Comparision" options={comparisionOptions} />
                </Form.Group>
                <Form.Group className="form-group" >
                    <Form.Label>Breakout</Form.Label>
                    <SelectField placeholder="Select Breakout" options={breakoutOptions} onChange={handleBreakoutChange} />
                </Form.Group>
                {selectedBreakout === 'Department' && (
                    <Form.Group className="form-group" >
                        <Form.Label>Departments</Form.Label>
                        <SelectField isMulti placeholder="Select Departments" options={departmentsOptions} />
                    </Form.Group>
                )}
                {selectedBreakout === 'What is your marital status?' && (
                    <Form.Group className="form-group" >
                        <Form.Label>What is your marital status?</Form.Label>
                        <SelectField isMulti placeholder="Select Marital Status" options={maritalStatusOptions} />
                    </Form.Group>
                )}
                <Form.Group className="form-group d-flex" >
                    <Form.Check className='me-0 form-check-sm' type="checkbox" id='heatmap01'
                        label={<div htmlFor="heatmap01" className="primary-color">Add Instructions</div>}
                        onChange={handleCheckboxChange}
                    />
                    {isChecked && (
                        <Button variant="btn-link link-primary" className="p-0 h-auto ms-2" onClick={heatMapShow}><em className="icon-table-edit"></em></Button>
                    )}
                </Form.Group>
                <Button variant="primary ripple-effect w-100">Save</Button>
            </div>

            {/* Heat Map Instructions modal */}
            <ModalComponent modalHeader="Heat Map Instructions" show={heatMapControl} onHandleCancel={heatMapClose}>
                <Form>
                    <Form.Group className="form-group mb-0" >
                        <TextEditor
                            placeholder="Enter Instructions"
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button variant='primary' className='ripple-effect'>Save</Button>
                    </div>
                </Form>
            </ModalComponent>
        </>
    )
}
