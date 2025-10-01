import React from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { Formik } from "formik";
import { Button, InputField, } from "../../../../components"; // Ensure showToast is available
import toast from "react-hot-toast";

export default function ContactSupport({
  userDetails,
  createContactSupportTicket,
  isCreateTicketBtnDisable,
}) {

  return (
    <Card>
      <div className="contactWrap">
        <Formik
          initialValues={{ subject: "", request: "" }}
          validate={(values) => {
            const errors = {};
            if (!values.subject) {
              errors.subject = "Subject is Required!";
            }
            if (!values.request) {
              errors.request = "Request is Required!";
            }
            return errors;
          }}
          onSubmit={(values, { resetForm }) => {
            createContactSupportTicket(
              values.subject,
              values.request,
              resetForm
            );
          }}
        >
          {({
            values,
            errors,
            setFieldValue,
            handleBlur,
            handleSubmit,
            resetForm,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Row className="g-2">
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label>Name </Form.Label>
                    <InputField
                      type="text"
                      placeholder="Name"
                      value={`${userDetails.first_name} ${userDetails.last_name}`}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="form-group">
                    <Form.Label>Email</Form.Label>
                    <InputField
                      type="text"
                      placeholder="Email"
                      value={userDetails.email_id}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col sm={12}>
                  <Form.Group className="form-group">
                    <Form.Label>Subject</Form.Label>
                    <InputField
                      type="text"
                      placeholder="Subject Name"
                      name="subject"
                      onBlur={handleBlur}
                      value={values.subject}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        if (newValue.length <= 200) {
                          setFieldValue("subject", newValue);
                        } else {
                          toast.error("Subject cannot exceed 200 characters");
                        }
                      }}
                      
                    />
                    {errors.subject && (
                      <h6 className="invalid-feedback d-block">
                        {errors.subject}
                      </h6>
                    )}
                  </Form.Group>
                </Col>
                <Col sm={12}>
                  <Form.Group className="form-group">
                    <Form.Label>Your Request</Form.Label>
                    <InputField
                      as="textarea"
                      rows={4}
                      extraClass="h-auto"
                      placeholder="Your Request"
                      name="request"
                      onChange={(e) =>
                        setFieldValue("request", e.target.value)
                      }
                      onBlur={handleBlur}
                      value={values.request}
                    />
                    {errors.request && (
                      <h6 className="invalid-feedback d-block">
                        {errors.request}
                      </h6>
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex align-items-center">
                <Button
                  variant="secondary"
                  className="ripple-effect me-2"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="ripple-effect"
                  type="submit"
                  disabled={isCreateTicketBtnDisable}
                >
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Card>
  );
}
