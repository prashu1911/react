import React from 'react';
import {Button, SelectField } from '../../../../../components';
import {  Form} from 'react-bootstrap';
export default function WordCloud() {
    // maximum Word Options
    const maximumWordOptions = [
        { value: '50', label: '50' },
        { value: '100', label: '100' },
        { value: '150', label: '150' },
        { value: '200', label: '200' }
    ]
    // minimum Word Options
    const minimumWordOptions = [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' }
    ]
    // text Source Options
    const textSourceOptions = [
        { value: 'Select Source for Cloud ', label: 'Select Source for Cloud ' },
        { value: 'What additional resources or tools would enhance your ability to perform your job more effectively, and how could they be implemented?', label: 'What additional resources or tools would enhance your ability to perform your job more effectively, and how could they be implemented?' }
    ]


    return (
        <div className="mt-xl-4 mt-3">
            <Form.Group className="form-group" >
                <Form.Label>Text Source</Form.Label>
                <SelectField placeholder="Select Source for Cloud" options={textSourceOptions}/>
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>Minimum word Size</Form.Label>
                <SelectField placeholder="Select Word Size" options={minimumWordOptions}/>
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='check24'
                    label={<div htmlFor="check24" className="primary-color">Random Color</div>}
                    />
            </Form.Group>
            <div className="d-flex align-items-center mb-3">
                <Form.Control
                    type="color"
                    id="exampleColorInput"
                    defaultValue="#0968AC"
                    title="Choose a color"
                />
                <Form.Label className='form-color-label mb-0' htmlFor="exampleColorInput">Font color</Form.Label>
            </div>
            <Form.Group className="form-group" >
                <Form.Label>Maximum word</Form.Label>
                <SelectField placeholder="Select Max Word" options={maximumWordOptions}/>
            </Form.Group>
            <Button variant="primary ripple-effect w-100">Save</Button>
        </div>
    )
}
