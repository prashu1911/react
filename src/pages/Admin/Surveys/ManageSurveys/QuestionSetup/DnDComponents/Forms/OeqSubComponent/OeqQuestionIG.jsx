import {
  Button,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useFormik } from "formik";
import { commonService } from "services/common.service";
import { useAuth } from "customHooks";
import { QuestionSetup } from "apiEndpoints/QuestionSetup";
import { InputField, SweetAlert } from "../../../../../../../../components";
import {
  OEQFormInitialValue,
  OEQFormValidationSchema,
} from "../../../validation";
import AddToResourceModel from "../../../ModelComponent/AddToResourceModel";

export default function OpenEndedQuestionIG({
  setActiveForm,
  surveyID,
  companyID,
  outcome,
}) {
  // Importing user data from custom authentication hook
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  // sweet alert
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const onConfirmAlertModal = () => {
    setIsAlertVisible(false);
    return true;
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBankAttributes, setShowBankAttributes] = useState(false);
  const handleCheckboxChange = (e) => {
    setShowBankAttributes(e.target.checked);
  };
  const surveyType = [
    { value: "Brand Awareness", label: "Brand Awareness" },
    { value: "Compliance Assessment", label: "Compliance Assessment" },
    { value: "Customer Satisfaction", label: "Customer Satisfaction" },
  ];

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const response = await commonService({
        apiEndPoint: QuestionSetup.addOeq,
        bodyData: {
          companyMasterID: userData?.companyMasterID,
          companyID,
          surveyID,
          outcomeID: outcome?.id,
          intentionName: values?.intentions,
          intentionShortName: values?.intentionsShortName,
          question: values?.question,
          isSkip: values?.displaySkipForNow,
          isQuestionAddedToResource: 0,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`, // Ensure userData exists.
        },
        toastType: {
          success: true,
          error: false,
        },
      });
      if (response?.status) {
        resetForm(); // Reset the form.
        setActiveForm([]);
      }
      // for now add static condition , because api is not working
      // handleSaveOutcome(currentOutcomeId);
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error add outcome:", error); // Handle error scenarios.
    }
  };

  // Initialize formik
  const formik = useFormik({
    initialValues: OEQFormInitialValue(),
    validationSchema: OEQFormValidationSchema(),
    onSubmit: handleSubmit,
  });

  const handleCancel = () => {
    setActiveForm([]);
  };

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <h1>IG</h1>
        <Row className="gy-3 gx-2">
          <Col sm={12}>
            <Form.Group className="form-group mb-0">
              <div className="d-flex justify-content-between mb-2 flex-sm-row flex-column-reverse">
                <Form.Label className="mb-0">
                  Question <sup>*</sup>
                </Form.Label>
                <Form.Group
                  className="form-group mb-sm-0 mb-2 flex-shrink-0"
                  controlId="skip1"
                >
                  <Form.Check
                    className="me-0"
                    type="checkbox"
                    onChange={handleCheckboxChange}
                    label={<div> Add Question To Resource </div>}
                  />
                </Form.Group>
              </div>
              <InputField
                type="text"
                placeholder="Enter Response"
                name="question"
                onChange={formik.handleChange}
                value={formik.values.question}
              />
              {formik.touched.question && formik.errors.question && (
                <div className="error mt-1 text-danger">
                  {formik.errors.question}
                </div>
              )}
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group className="form-group mb-0">
              <Form.Label className="mb-2">
                Intentions <sup>*</sup>
              </Form.Label>
              <InputField
                type="text"
                placeholder="Enter Intentions"
                name="intentions"
                onChange={formik.handleChange}
                value={formik.values.intentions}
              />
              {formik.touched.intentions && formik.errors.intentions && (
                <div className="error mt-1 text-danger">
                  {formik.errors.intentions}
                </div>
              )}
            </Form.Group>
          </Col>
          <Col sm={6}>
            <Form.Group className="form-group mb-0">
              <Form.Label className="mb-2 d-flex justify-content-center align-items-center">
                Intentions Short Name <sup>*</sup>
                <Link to="#!" className="p-0">
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip-disabled">
                        Provide a short name to be used in reports and chart.
                      </Tooltip>
                    }
                  >
                    <span className="d-flex ms-1">
                      <em
                        disabled
                        style={{ pointerEvents: "none" }}
                        className="icon-info-circle"
                      />
                    </span>
                  </OverlayTrigger>
                </Link>
              </Form.Label>
              <InputField
                type="text"
                placeholder="Enter Intentions Short Name"
                name="intentionsShortName"
                onChange={formik.handleChange}
                value={formik.values.intentionsShortName}
              />
              {formik.touched.intentionsShortName &&
                formik.errors.intentionsShortName && (
                  <div className="error mt-1 text-danger">
                    {formik.errors.intentionsShortName}
                  </div>
                )}
            </Form.Group>
          </Col>
        </Row>
        <div className=" mt-3 pt-xl-1 pt-0">
          <Form.Group className="form-group switchaxis d-sm-flex align-items-center">
            <Form.Label className="mb-0 me-xl-3 me-2 w-auto ">
              Display Skip For Now <sup>*</sup>
            </Form.Label>
            <div className="switchBtn switchBtn-success switchBtn-label-nf">
              <InputField
                type="checkbox"
                defaultValue="1"
                id="switchaxis1"
                className="p-0"
                name="displaySkipForNow"
                onChange={formik.handleChange}
                checked={formik.values.displaySkipForNow}
              />
              <label htmlFor="switchaxis1" />
            </div>
            {formik.touched.displaySkipForNow &&
              formik.errors.displaySkipForNow && (
                <div className="error mt-1 text-danger">
                  {formik.errors.displaySkipForNow}
                </div>
              )}
          </Form.Group>
        </div>
        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button
            variant="secondary"
            className="ripple-effect"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="ripple-effect" disabled={isSubmitting}>
            {isSubmitting ? "Saving...." : "Save"}
          </Button>
        </div>
      </Form>

      <SweetAlert
        title="Are you sure?"
        text="You want to delete this data!"
        show={isAlertVisible}
        icon="warning"
        onConfirmAlert={onConfirmAlertModal}
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={setIsAlertVisible}
        isConfirmedTitle="Deleted!"
        isConfirmedText="Your file has been deleted."
      />

      {/* Add Question Bank Attributes modal */}
      {showBankAttributes && (
        <AddToResourceModel
          show={showBankAttributes}
          onClose={() => setShowBankAttributes(false)}
          formik={formik}
          surveyType={surveyType}
          setShowBankAttributes={setShowBankAttributes}
        />
      )}
    </>
  );
}
