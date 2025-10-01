import { Loader } from "components";
import { ErrorMessage, Field, Formik, Form as FormikForm } from "formik";
import { Button, Col, Form, Row } from "react-bootstrap";
import * as Yup from "yup";

function QuestionAddEditFormComponent({
  handleSubmit,
  surveyTypeOptions,
  questionAddEditClose,
  initialLoader,
  alertType,
  companyOptions,
  initialData,
  questionTypeData,
  handleLoading,
}) {
  const editValidationSchema = Yup.object({
    surveyType: Yup.string().required("Survey Type is required"),
    keywords: Yup.string().required("Keywords are required"),
    questionType: Yup.string().required("Question Type is required"),
    question: Yup.string().required("Question is required"),
  });
  const addValidationSchema = Yup.object({
    surveyType: Yup.string().required("Survey Type is required"),
    company: Yup.string().required("Company is required"),
    keywords: Yup.string().required("Keywords are required"),
    questionType: Yup.string().required("Question Type is required"),
    question: Yup.string().required("Question is required"),
  });
  // Sanitize HTML tags from question text
  const sanitizeHtml = (text) => {
    return text ? text.replace(/<[^>]*>/g, '') : '';
  };
  const initialValues = {
    surveyType:
      parseInt(initialData?.survey_type_id) ||
      parseInt(surveyTypeOptions[0].value),
    company: parseInt(companyOptions[0].value),
    keywords: initialData?.keywords,
    questionType: initialData?.question_type,
    question: sanitizeHtml(initialData?.question), // Remove html tags from API
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
                    name="surveyType"
                    className="form-control"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setFieldValue("surveyType", parseInt(newValue));
                    }}
                  >
                    {surveyTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="surveyType"
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
                    placeholder="Enter Subject"
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
                      {companyOptions.map((option) => (
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
              <Col sm={12}>
                <Form.Group className="form-group">
                  <Form.Label>
                    Question Type <sup>*</sup>
                  </Form.Label>
                  <div className="onlyradio flex-wrap">
                    {questionTypeData &&
                      questionTypeData?.map((type, index) => (
                        <Form.Check
                          key={index}
                          inline
                          label={type?.label}
                          name="questionType"
                          type="radio"
                          value={type?.value}
                          checked={values.questionType === type?.value}
                          onChange={(e) =>
                            setFieldValue("questionType", e.target.value)
                          }
                          disabled={alertType === "edit"}
                        />
                      ))}
                  </div>
                  <ErrorMessage
                    name="questionType"
                    component="div"
                    className="error-help-block"
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group className="form-group">
                  <Form.Label>
                    Question <sup>*</sup>
                  </Form.Label>
                  <Field
                    as="textarea"
                    rows={4}
                    name="question"
                    className="form-control"
                    placeholder="Enter Question"
                    value={values.question}
                    onChange={(e) => {
                      const plainText = e.target.value.replace(/<[^>]*>/g, ''); // Disallow html tags in field
                      setFieldValue("question",plainText);
                    }}
                    style={{ minHeight: "120px" }}
                  />
                  <ErrorMessage
                    name="question"
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
                onClick={questionAddEditClose}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="ripple-effect">
                {alertType === "add"
                  ? handleLoading
                    ? "Saving..."
                    : "Save"
                  : handleLoading
                    ? "Updating..."
                    : "Update"}
              </Button>
            </div>
          </FormikForm>
        )
      )}
    </Formik>
  );
}

export default QuestionAddEditFormComponent;
