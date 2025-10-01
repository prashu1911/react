import React from 'react';
import {Button, InputField, SelectField } from '../../../../../components';
import {  Form } from 'react-bootstrap';
export default function DimensionItemSummary({dimensionItemControlShow}) {
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
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='dimensionItem01'
                    label={<div htmlFor="dimensionItem01" className="primary-color">Show Response Counts</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='dimensionItem02'
                    label={<div htmlFor="dimensionItem02" className="primary-color">Show Overall</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='dimensionItem03'
                    label={<div htmlFor="dimensionItem03" className="primary-color"> Show Percentage</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='dimensionItem04'
                    label={<div htmlFor="dimensionItem04" className="primary-color"> Show Benchmark(s)</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='dimensionItem05'
                    label={<div htmlFor="dimensionItem05" className="primary-color"> Show Action Plan</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>Decimal Places</Form.Label>
                <SelectField placeholder="Select Decimal Places" options={decimalOptions}/>
            </Form.Group>
            <Form.Group className="form-group" >
                <Button variant="primary ripple-effect w-100" onClick={dimensionItemControlShow}>Dimension & Item Control Panel</Button>
            </Form.Group>
            <Button variant="primary ripple-effect w-100">Save</Button>
        </div>
    )
}
