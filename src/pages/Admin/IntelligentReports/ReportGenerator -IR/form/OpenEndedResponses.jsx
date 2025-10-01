import React from 'react';
import {Button, InputField, SelectField } from '../../../../../components';
import {  Form} from 'react-bootstrap';
export default function OpenEndResponses() {
    // question Options
    const questionOptions = [
        { value: 'Select Open End Question', label: 'Select Open End Question' },
        { value: 'What additional resources or tools would enhance your ability to perform your job more effectively, and how could they be implemented?', label: 'What additional resources or tools would enhance your ability to perform your job more effectively, and how could they be implemented?' }
    ]
    return (
        <div className="mt-xl-4 mt-3">
            <Form.Group className="form-group" >
                <Form.Label>Open End Question</Form.Label>
                <SelectField placeholder="Select Open End Question" options={questionOptions}/>
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='responses01'
                    label={<div htmlFor="responses01" className="primary-color">All</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='responses02'
                    label={<div htmlFor="responses02" className="primary-color">None</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group d-flex align-items-center gap-3 showResponse" >
                <span>Show</span>
                <div className="w-25">
                    <InputField type={"text"} placeholder="No. of Response"/>
                </div>
                <span>Response out of 0</span>
            </Form.Group>
            <Button variant="primary ripple-effect w-100">Save</Button>
        </div>
    )
}
