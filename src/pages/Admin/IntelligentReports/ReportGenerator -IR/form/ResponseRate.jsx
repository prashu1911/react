import React, { useState } from 'react';
import {Button, InputField, SelectField } from '../../../../../components';
import {  Form } from 'react-bootstrap';
export default function ResponseRate() {
    const [selectedBreakout, setSelectedBreakout] = useState(null);
    // Handler for breakout selection
    const handleBreakoutChange = (selectedOption) => {
        setSelectedBreakout(selectedOption ? selectedOption.value : null);
    };

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
    // decimal Options
    const decimalOptions = [
        { value: '0', label: '0' },
        { value: '1', label: '1' },
        { value: '2', label: '2' } 
    ]


    return (
        <div className='mt-xl-4 mt-3'>
            <Form.Group className="form-group" >
                <Form.Label>Title</Form.Label>
                <InputField type={"text"} placeholder={"Enter Title"} />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='check1'
                    label={<div htmlFor="check1" className="primary-color">Show Invited</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='check2'
                    label={<div htmlFor="check2" className="primary-color">Show responded</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='check3'
                    label={<div htmlFor="check3" className="primary-color">Show Percentage</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>Breakout</Form.Label>
                <SelectField placeholder="Select Breakout" options={breakoutOptions} onChange={handleBreakoutChange}/>
            </Form.Group>
            {selectedBreakout === 'Department' && (
            <Form.Group className="form-group" >
                <Form.Label>Departments</Form.Label>
                <SelectField isMulti placeholder="Select Departments" options={departmentsOptions}/>
            </Form.Group>
            )}
            {selectedBreakout === 'What is your marital status?' && (
            <Form.Group className="form-group" >
                <Form.Label>What is your marital status?</Form.Label>
                <SelectField isMulti placeholder="Select Marital Status" options={maritalStatusOptions}/>
            </Form.Group>
            )}
            <Form.Group className="form-group" >
                <Form.Label>Decimal Places</Form.Label>
                <SelectField placeholder="Select Decimal Places" options={decimalOptions}/>
            </Form.Group>
            <Button variant="primary ripple-effect w-100">Save</Button>
        </div>
    )
}
