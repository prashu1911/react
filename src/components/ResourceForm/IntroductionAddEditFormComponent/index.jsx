import { Loader, TextEditor } from "components";
import { ErrorMessage, Field, Formik, Form as FormikForm } from "formik";
import { Button, Col, Form, Row } from "react-bootstrap";
import * as Yup from "yup";

function IntroductionAddEditFormComponent({
  handleSubmit,
  surveyTypeData,
  introductionEditClose,
  initialData,
  initialLoader = false,
  alertType,
  companyOptions,
  handleLoading,
}) {
  const editValidationSchema = Yup.object({
    surveyTypeID: Yup.string().required("Survey Type is required"),
    keywords: Yup.string().required("Keywords are required"),
    introduction: Yup.string().required("Introduction is required"),
  });
  const addValidationSchema = Yup.object({
    surveyTypeID: Yup.string().required("Survey Type is required"),
    company: Yup.string().required("Company is required"),
    keywords: Yup.string().required("Keywords are required"),
    introduction: Yup.string().required("Introduction is required"),
  });
  const initialValues = {
    surveyTypeID: parseInt(initialData?.surveyTypeID) || parseInt(surveyTypeData[0].value) || "",
    company: companyOptions[0].value || "",
    keywords: initialData?.keywords || "",
    introduction: initialData?.introduction || "",
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={
        alertType === "add" ? addValidationSchema : editValidationSchema
      }
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {initialLoader ? (
        <div className="d-flex justify-content-center mb-3">
          <Loader />
        </div>
      ) : (
        ({ values, setFieldValue }) => (
          <FormikForm>
            <Row className="row rowGap align-items-start">
              <Col sm={6}>
                <Form.Group className="form-group">
                  <Form.Label>
                    Survey Type <sup>*</sup>
                  </Form.Label>
                  <Field
                    as="select"
                    name="surveyTypeID"
                    className="form-control"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setFieldValue("surveyTypeID", parseInt(newValue));
                    }}
                  >
                    {surveyTypeData.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="surveyTypeID"
                    component="div"
                    className="error-help-block"
                  />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="form-group">
                  <Form.Label>
                    Keywords <sup>*</sup>
                  </Form.Label>
                  <Field
                    type="text"
                    name="keywords"
                    className="form-control"
                    placeholder="Enter Keywords"
                    value={values.keywords}
                    onChange={(e) => setFieldValue("keywords", e.target.value)}
                  />
                  <ErrorMessage
                    name="keywords"
                    component="div"
                    className="error-help-block"
                  />
                </Form.Group>
              </Col>
              {alertType === "add" && (
                <Col sm={12}>
                  <Form.Group className="form-group">
                    <Form.Label>
                      Company <sup>*</sup>
                    </Form.Label>
                    <Field
                      as="select"
                      name="company"
                      className="form-control"
                      value={companyOptions.find(
                        (option) => option.value === values
                      )}
                      onChange={(e) =>
                        setFieldValue("company", parseInt(e.target.value))
                      }
                    >
                      {companyOptions?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="company"
                      component="div"
                      className="error-help-block"
                    />
                  </Form.Group>
                </Col>
              )}
              <Col xs={12}>
                <Form.Group className="form-group">
                 <Form.Label>
                   Introduction  <sup>*</sup>
                  </Form.Label>
                  <TextEditor
                    name="introduction"
                    value={values.introduction}
                    onChange={(value) => setFieldValue("introduction", value)}
                    extraToolbar = {["uploadImage"]}
                  />
                  <ErrorMessage
                    name="introduction"
                    component="div"
                    className="error-help-block"
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="form-btn d-flex justify-content-end gap-2">
              <Button
                type="button"
                variant="secondary"
                className="ripple-effect"
                onClick={introductionEditClose}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="ripple-effect">
               {alertType === "add" ? (handleLoading ? "Saving..." : "Save") : (handleLoading ? "Updating..." : "Update")}
              </Button>
            </div>
          </FormikForm>
        )
      )}
    </Formik>
  );
}

export default IntroductionAddEditFormComponent;
