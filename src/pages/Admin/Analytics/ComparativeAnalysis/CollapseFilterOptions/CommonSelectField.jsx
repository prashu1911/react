import React from "react";
import { Col, Form } from "react-bootstrap";
import { SelectField } from "../../../../../components";
import { departmentOptions, participantOptions, managerOptions, genderOptions, ageOptions, tenureOptions, locationOptions, roleOptions } from "./CommonSelectFieldOptions";

export default function CommonSelectField() {
    
    return (
        <>
        <Col xxl={3} lg={4} sm={6}>
            <Form.Group className="form-group">
                <Form.Label>Department</Form.Label>
                <SelectField placeholder="Select Department" isMulti options={departmentOptions} />
            </Form.Group>
        </Col>
        <Col xxl={3} lg={4} sm={6}>
            <Form.Group className="form-group">
                <Form.Label>Participant</Form.Label>
                <SelectField placeholder="Select Participant" isMulti options={participantOptions}/>
            </Form.Group>
        </Col>
        <Col xxl={3} lg={4} sm={6}>
            <Form.Group className="form-group">
                <Form.Label>Manager</Form.Label>
                <SelectField placeholder="Select Manager" isMulti options={managerOptions}/>
            </Form.Group>
        </Col>
        <Col xxl={3} lg={4} sm={6}>
            <Form.Group className="form-group">
                <Form.Label>Age</Form.Label>
                <SelectField placeholder="Select Age" isMulti options={ageOptions}/>
            </Form.Group>
        </Col>
        <Col xxl={3} lg={4} sm={6}>
            <Form.Group className="form-group">
                <Form.Label>Gender</Form.Label>
                <SelectField placeholder="Select Gender" isMulti options={genderOptions}/>
            </Form.Group>
        </Col>
        <Col xxl={3} lg={4} sm={6}>
            <Form.Group className="form-group">
                <Form.Label>Tenure</Form.Label>
                <SelectField placeholder="Select Tenure" isMulti options={tenureOptions}/>
            </Form.Group>
        </Col>
        <Col xxl={3} lg={4} sm={6}>
            <Form.Group className="form-group">
                <Form.Label>Office Location</Form.Label>
                <SelectField placeholder="Select Location" isMulti options={locationOptions}/>
            </Form.Group>
        </Col>
        <Col xxl={3} lg={4} sm={6}>
            <Form.Group className="form-group">
                <Form.Label>Role</Form.Label>
                <SelectField placeholder="Select Role" isMulti options={roleOptions}/>
            </Form.Group>
        </Col>
        </>
    )
}