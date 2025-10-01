import React from 'react';
import {Button, InputField, SelectField } from '../../../../../components';
import {  Form } from 'react-bootstrap';
export default function ResponseRateResponsesByDay() {
    // frequency options
    const frequencyOptions = [
        { value: 'Day', label: 'Day' },
        { value: 'Week', label: 'Week' },
        { value: 'Months', label: 'Months' }  
    ]
    // rate Chart Options
    const rateChartOptions= [
        { value: 'Donut', label: 'Donut' },
        { value: 'Progress', label: 'Progress' },
        { value: 'Speedometer', label: 'Speedometer' }  
    ]
    // day Chart Options
    const dayChartOptions= [
        { value: 'Line', label: 'Line' },
        { value: 'Column', label: 'Column' },
        { value: 'Bar', label: 'Bar' }  
    ]


    return (
        <div className='mt-xl-4 mt-3'>
            <Form.Group className="form-group" >
                <Form.Label>Title</Form.Label>
                <InputField type={"text"} placeholder={"Enter Title"} />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>Chart Type</Form.Label>
                <SelectField placeholder="Select Chart Type" options={rateChartOptions}/>
            </Form.Group>
            <div className="reportTitle mb-3">
                <span>Response Rate by Day</span>
            </div>
            <Form.Group className="form-group" >
                <Form.Label>Title</Form.Label>
                <InputField type={"text"} placeholder={"Enter Title"} />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>Frequency</Form.Label>
                <SelectField placeholder="Select Frequency" options={frequencyOptions}/>
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>Chart Type</Form.Label>
                <SelectField placeholder="Select Chart Type" options={dayChartOptions}/>
            </Form.Group>
            <Button variant="primary ripple-effect w-100">Save</Button>
        </div>
    )
}
