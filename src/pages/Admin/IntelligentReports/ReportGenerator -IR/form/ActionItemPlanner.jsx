import React from 'react';
import {Button, InputField } from '../../../../../components';
import {  Form } from 'react-bootstrap';
export default function ActionItemPlanner() {

    return (
        <div className='mt-xl-4 mt-3'>
            <Form.Group className="form-group" >
                <Form.Label>Title</Form.Label>
                <InputField type={"text"} placeholder={"Enter Title"} />
            </Form.Group>
            <Form.Group className="form-group" >
                <Form.Label>Sub Title</Form.Label>
                <InputField type={"text"} placeholder={"Enter Sub Title"} />
            </Form.Group>
            <Button variant="primary ripple-effect w-100">Save</Button>
        </div>
    )
}
