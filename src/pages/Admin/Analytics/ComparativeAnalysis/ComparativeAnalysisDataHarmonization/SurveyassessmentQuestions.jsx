import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { SelectField } from "../../../../../components";

export default function SurveyassessmentQuestions() {
    // outcomes Options
    const outcomesOptions=[
        {label: 'How Are We Doing', value: 'How Are We Doing'},
        {label: 'Your Experience', value: 'Your Experience'}
    ]
    return(
        <Row className="justify-content-between gy-2 gx-3">
            <Col md={6}>
                <p className="m-0">The Survey Questions May Be Comprised Of More Than One Outcome. Each Outcome Must Be Harmonized. Please Select An Outcome To Begin In The Harmonixation Process.</p>
            </Col>
            <Col xl={4} md={6}>
                <Form>
                    <Form.Group className="form-group mb-0" >
                        <Form.Label>Outcome Display Name</Form.Label>
                        <SelectField placeholder="Select Outcome" options={outcomesOptions}/>
                    </Form.Group>
                </Form>
            </Col>
        </Row>
    )
}