import React from 'react';
import {Button, InputField, SelectField } from '../../../../../components';
import {  Form } from 'react-bootstrap';


export default function ManagerEffectiveness() {
    
    // Chart Options
    const chartOptions= [
        { value: 'Donut', label: 'Donut' },
        { value: 'Progress', label: 'Progress' },
        { value: 'Speedometer', label: 'Speedometer' }  
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
                <Form.Label>Chart Type</Form.Label>
                <SelectField placeholder="Select Chart Type" options={chartOptions}/>
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>Chart Title</Form.Label>
                <InputField type={"text"} placeholder={"Enter Chart Title"} />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>Chart Info.</Form.Label>
                <InputField type={"text"} placeholder={"Enter Chart Info"} />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>Title</Form.Label>
                <InputField type={"text"} placeholder={"Enter Title"} />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>Info.</Form.Label>
                <InputField type={"text"} placeholder={"Enter Info"} />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='equipFactors01'
                    label={<div htmlFor="equipFactors01" className="primary-color">Show Response Counts</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='equipFactors02'
                    label={<div htmlFor="equipFactors02" className="primary-color">Show Overall</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='equipFactors03'
                    label={<div htmlFor="equipFactors03" className="primary-color">Show Percentage</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='equipFactors04'
                    label={<div htmlFor="equipFactors04" className="primary-color">Show Benchmark(s)</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Check className='me-0 form-check-sm' type="checkbox" id='equipFactors05'
                    label={<div htmlFor="equipFactors05" className="primary-color">Show Action Plan</div>}
                    />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>Decimal Places</Form.Label>
                <SelectField placeholder="Select Decimal Places" options={decimalOptions}/>
            </Form.Group>
            <Button variant="primary ripple-effect w-100">Save</Button>
        </div>
    )
}
