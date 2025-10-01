import React, { useEffect } from "react";
import { useFormik } from "formik";
import { Row, Col, Form, Button } from "react-bootstrap";
import { InputField, ModalComponent } from "../../../../../../components";

const SurveyTextModel = ({
  show,
  onClose,
  initialData,
  validation,
  handleSurveytext,
}) => {
  // Formik Hook
  const formik = useFormik({
    initialValues: initialData,
    validationSchema: validation,
    onSubmit: (values) => {
      handleSurveytext(values);
      onClose();
    },
  });

  return (
    <ModalComponent
      modalHeader={<span>Other language text for &ldquo;Skip for now&rdquo; {"  "}{<sup className="text-danger">*</sup>}</span>}
      show={show}
      onHandleCancel={onClose}
    >
      <Form onSubmit={formik.handleSubmit}>
        <Row className="row rowGap align-items-end">
          <Col lg={10}>
            <Form.Group className="form-group">
              {/* <Form.Label>
              Survey Language Text<sup>*</sup>
              </Form.Label> */}
              <InputField
                type="text"
                placeholder="Enter Survey Text"
                name="surveyText"
                value={formik.values.surveyText}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.surveyText && formik.errors.surveyText && (
                <div className="text-danger">{formik.errors.surveyText}</div>
              )}
            </Form.Group>
          </Col>
          <Col lg={2} className="d-flex justify-content-end">
            <Button
              type="submit"
              variant="primary"
              className="ripple-effect px-3 py-2"
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </ModalComponent>
  );
};

export default SurveyTextModel;
