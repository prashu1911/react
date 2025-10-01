import React from 'react';
import {Button, InputField, SelectField } from '../../../../../components';
import {  Form } from 'react-bootstrap';
export default function KeyDriversEngagement() {
    
    // number Items Options
    const numberItemsOptions= [
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' }  
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
                <Form.Label>Info</Form.Label>
                <InputField type={"text"} placeholder={"Enter Info"} />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='keyDrivers01'
                    label={<div htmlFor="keyDrivers01" className="primary-color">Show Impact</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='keyDrivers02'
                    label={<div htmlFor="keyDrivers02" className="primary-color">Show Impact Value</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='keyDrivers03'
                    label={<div htmlFor="keyDrivers03" className="primary-color">Show Response</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='keyDrivers04'
                    label={<div htmlFor="keyDrivers04" className="primary-color">Show Overall</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='keyDrivers05'
                    label={<div htmlFor="keyDrivers05" className="primary-color">Show Percentage</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='keyDrivers06'
                    label={<div htmlFor="keyDrivers06" className="primary-color">Show Action Plan</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='keyDrivers07'
                    label={<div htmlFor="keyDrivers07" className="primary-color">Show Benchmark(s)</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group mb-3">
                <Form.Label className='mb-3'>Selection Order</Form.Label>
                <Form.Check inline type="radio" name='keyDriversRadio' id='keyDriversRadio01' className='mb-0' 
                label={<div htmlFor="keyDriversRadio01" className="primary-color">From Negative</div>}
                />
            </Form.Group>
            <Form.Group className="form-group mb-3">
                <Form.Check inline type="radio" name='keyDriversRadio' id='keyDriversRadio02' className='mb-0' 
                label={<div htmlFor="keyDriversRadio02" className="primary-color">From Positive</div>}
                />
            </Form.Group>
            <Form.Group className="form-group mb-3">
                <Form.Check inline type="radio" name='keyDriversRadio' id='keyDriversRadio03' className='mb-0' 
                label={<div htmlFor="keyDriversRadio03" className="primary-color">From Mean</div>}
                />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>No of items to display</Form.Label>
                <SelectField placeholder="Select No of items" options={numberItemsOptions}/>
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>Decimal Places</Form.Label>
                <SelectField placeholder="Select Decimal Places" options={decimalOptions}/>
            </Form.Group>
            <Button variant="primary ripple-effect w-100">Save</Button>
        </div>
    )
}
