import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Button, SelectField } from "../../../../../components";


export default function ReferenceDataOptions() {
    const savedOptions = [
        { value: 'Saved Lorem01', label: 'Saved Lorem01' },
        { value: 'Saved Lorem02', label: 'Saved Lorem02' }
    ]
    return (
        <div className="formCard">
            <div className="d-xxl-flex align-items-end gap-2">
              <div className="flex-grow-1">
                <Row className="align-items-end gx-2">
                  <Col lg={4} md={6}>
                    <Form.Group className="form-group">
                      <Form.Label>Saved Filtered Subsets</Form.Label>
                      <SelectField placeholder="Select Saved Filtered Subsets" options={savedOptions} />
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={6}>
                    <Form.Group className="form-group">
                      <Form.Label>Saved Quick Compare View</Form.Label>
                      <SelectField placeholder="Select Saved Quick Compare View" options={savedOptions}/>
                    </Form.Group>
                  </Col>
                  <Col lg={4} md={6}>
                    <Form.Group className="form-group">
                      <Form.Label>Saved Composite View </Form.Label>
                      <SelectField placeholder="Select Saved Composite View " options={savedOptions}/>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
              <div className="flex-shrink-0">
                <Form.Group className="form-group">
                  <Button variant="primary" className="ripple-effect">Generate Hotspots With AI</Button>
                </Form.Group>
              </div>
            </div>
            <div className="d-flex gap-2 justify-content-end flex-wrap">
              <Button variant="secondary" className="ripple-effect gap-2"><em className="icon-clear" /><span>Clear</span></Button>
              <Button variant="primary" className="ripple-effect gap-2"><em className="icon-run" /><span>Run</span></Button>
            </div>
        </div>
    )
}