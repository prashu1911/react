import React from "react";
import { Form } from "react-bootstrap";

const OEQResponse = ({ index }) => {
  return (
    <div className="commonQuestion">
      <Form.Group className="form-group mb-0">
        <Form.Control
          as="textarea"
          className="form-control form-control-md"
          placeholder="Enter Response"
          // style={{
          //   width: "40vw"
          // }}
        />
      </Form.Group>
      <Form.Group
        className="form-group mb-0 d-inline-block"
        controlId={`skip${index}`}
      >
        {/* <Form.Check
          className="me-0"
          type="checkbox"
          label={<div className="text-danger">Skip</div>}
        /> */}
      </Form.Group>
    </div>
  );
};

export default OEQResponse;
