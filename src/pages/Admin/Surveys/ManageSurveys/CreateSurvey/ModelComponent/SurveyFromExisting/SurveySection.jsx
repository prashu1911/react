import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  InputField,
  SelectField,
} from "../../../../../../../components";
import adminRouteMap from "../../../../../../../routes/Admin/adminRouteMap";
import {
  validationCreateFromExisting, // validationCreateFromExisting,
} from "../../validation";
import { useSurveyDataOnNavigations } from "customHooks";

export default function SurveySection({
  companyOptions,
  surveyOptions,
  isSubmitting,
  onFetchSurvey,
  onCopySurvey,
  createExistingClose,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const { dispatcSurveyDataOnNavigateData } = useSurveyDataOnNavigations();

  const handleSubmitCloneExisting = async (values) => {
    const payload = {
      surveyID: parseInt(values.selectedSurveyId), // Changed from surveyID to selectedSurveyId
      fromCompanyID: values.fromCompanyID,
      toCompanyID: values.toCompanyID,
      surveyName: values.newSurveyName, // Changed from surveyName to newSurveyName
      sourceType: "SURVEY",
      buttonType: values.action === "copy-edit" ? "EDIT" : "PUBLISH",
    };

    try {
      const response = await onCopySurvey(payload);
      if (response?.status) {
        if (values.action === "copy-edit") {
          const holdValue = {
            companyID: values.toCompanyID,
            survey: {
              survey_id: response?.data?.surveyID,
              survey_name: values.newSurveyName,
              // Add any other required survey properties from the response
            },
          };
          // Navigate to review and edit page with the new survey data
          // navigate(adminRouteMap.REVIEWANDEDIT.path, {
          //   state: {
          //     companyID: values.toCompanyID,
          //     survey: {
          //       survey_id: response?.data?.surveyID,
          //       survey_name: values.newSurveyName,
          //       // Add any other required survey properties from the response
          //     },
          //   },
          // });
          navigate(adminRouteMap.REVIEWANDEDIT.path, {
            state: holdValue,
          });
          if (location.pathname === adminRouteMap.REVIEWANDEDIT.path) {
            dispatcSurveyDataOnNavigateData(holdValue);
            createExistingClose();
            window.location.reload();
          }
        } else {
          createExistingClose();
          navigate("/manage-surveys"); // Redirect to manage surveys page
        }
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
    }
  };

  const formikCloneExisting = useFormik({
    initialValues: {
      fromCompanyID: "",
      toCompanyID: "",
      selectionConfirm: false,
      action: "",
      selectedSurveyId: "",
      selectedSurveyName: "",
      newSurveyName: "",
    },
    validationSchema: validationCreateFromExisting(),
    onSubmit: handleSubmitCloneExisting,
  });

  // Handle button clicks without form reload
  const handleButtonClick = (action, e) => {
    e.preventDefault(); // Prevent the button's default submit behavior
    formikCloneExisting.setFieldValue("action", action);
    formikCloneExisting.handleSubmit(); // Manually trigger form submission
  };

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <div id="surveys" className="show-hide" style={{ display: "block" }}>
        <span className="formToLabal">From</span>
        <Row className="row rowGap align-items-start">
          <Col lg={6}>
            <Form.Group className="form-group">
              <Form.Label>
                Company<sup>*</sup>
              </Form.Label>
              <SelectField
                name="fromCompanyID"
                options={companyOptions}
                placeholder="Company Name"
                onChange={(selected) => {
                  // formikCloneExisting.setFieldValue(
                  //   "fromCompanyID",
                  //   selected?.value || ""
                  // );
                  formikCloneExisting.setValues((prev) => ({
                    ...prev,
                    fromCompanyID: selected?.value || "",
                    selectedSurveyId: "",
                    selectedSurveyName: "",
                    newSurveyName: "",
                  }));
                  onFetchSurvey(selected?.value);
                }}
                onBlur={formikCloneExisting.handleBlur}
                value={
                  companyOptions?.find(
                    (option) =>
                      option?.value === formikCloneExisting.values.fromCompanyID
                  ) || null
                }
              />
              {formikCloneExisting.touched.fromCompanyID &&
              formikCloneExisting.errors.fromCompanyID ? (
                <div className="error text-danger">
                  {formikCloneExisting.errors.fromCompanyID}
                </div>
              ) : null}
            </Form.Group>
          </Col>
          <Col lg={6}>
            <Form.Group className="form-group">
              <Form.Label>
                Survey<sup>*</sup>
              </Form.Label>
              <SelectField
                name="selectedSurvey"
                options={surveyOptions}
                placeholder="Survey Name"
                onChange={(selected) => {
                  // formikCloneExisting.setFieldValue(
                  //   "selectedSurveyId",
                  //   selected?.value || ""
                  // );
                  // formikCloneExisting.setFieldValue(
                  //   "selectedSurveyName",
                  //   selected?.label || ""
                  // );

                  formikCloneExisting.setValues((prev) => ({
                    ...prev,
                    selectedSurveyId: selected?.value || "",
                    selectedSurveyName: selected?.label || "",
                    newSurveyName: `Clone - ${selected?.label}`,
                  }));
                }}
                onBlur={formikCloneExisting.handleBlur}
                value={
                  surveyOptions?.find(
                    (option) =>
                      option?.value ===
                      formikCloneExisting.values.selectedSurveyId
                  ) || null
                }
                isDisabled={
                  !formikCloneExisting.values.fromCompanyID ||
                  surveyOptions?.length === 0
                }
              />
              {formikCloneExisting.touched.selectedSurveyId &&
              formikCloneExisting.errors.selectedSurveyId ? (
                <div className="error text-danger">
                  {formikCloneExisting.errors.selectedSurveyId}
                </div>
              ) : null}
            </Form.Group>
          </Col>
        </Row>
        <span className="formToLabal mt-4">To</span>
        <Row className="rowGap">
          <Col lg={6}>
            <Form.Group className="form-group">
              <Form.Label>
                Company<sup>*</sup>
              </Form.Label>
              <SelectField
                name="toCompanyID"
                options={companyOptions}
                placeholder="Company Name"
                onChange={(selected) =>
                  formikCloneExisting.setFieldValue(
                    "toCompanyID",
                    selected?.value || ""
                  )
                }
                onBlur={formikCloneExisting.handleBlur}
                value={
                  companyOptions?.find(
                    (option) =>
                      option?.value === formikCloneExisting.values.toCompanyID
                  ) || null
                }
              />
              {formikCloneExisting.touched.toCompanyID &&
              formikCloneExisting.errors.toCompanyID ? (
                <div className="error text-danger">
                  {formikCloneExisting.errors.toCompanyID}
                </div>
              ) : null}
            </Form.Group>
          </Col>
          <Col lg={6}>
            <Form.Group className="form-group">
              <Form.Label>
                New Survey Name<sup>*</sup>
              </Form.Label>
              <InputField
                type="text"
                placeholder="Enter new survey name"
                name="newSurveyName"
                value={formikCloneExisting.values.newSurveyName}
                onChange={formikCloneExisting.handleChange}
                onBlur={formikCloneExisting.handleBlur}
              />
              {formikCloneExisting.touched.newSurveyName &&
              formikCloneExisting.errors.newSurveyName ? (
                <div className="error text-danger">
                  {formikCloneExisting.errors.newSurveyName}
                </div>
              ) : null}
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap">
          <div className="form-check form-check-inline m-0 me-2 mb-lg-0 mb-2">
            <InputField
              className="form-check-input"
              type="checkbox"
              id="selectionConfirm"
              name="selectionConfirm"
              onChange={formikCloneExisting.handleChange}
              onBlur={formikCloneExisting.handleBlur}
              checked={formikCloneExisting.values.selectionConfirm}
            />
            <label className="form-check-label" htmlFor="selectionConfirm">
              Confirm this is the right selection
            </label>
            {formikCloneExisting.touched.selectionConfirm &&
              formikCloneExisting.errors.selectionConfirm && (
                <div className="error text-danger">
                  {formikCloneExisting.errors.selectionConfirm}
                </div>
              )}
          </div>
          <div className="d-flex gap-2 justify-content-end">
            <Button
              variant="primary"
              type="button"
              disabled={
                isSubmitting || !formikCloneExisting.values.selectionConfirm
              }
              className="ripple-effect"
              onClick={(e) => handleButtonClick("copy-edit", e)}
            >
              {isSubmitting ? "Copy & Edit..." : "Copy & Edit"}
            </Button>
            <Button
              variant="warning"
              type="button"
              disabled={
                isSubmitting || !formikCloneExisting.values.selectionConfirm
              }
              className="ripple-effect"
              onClick={(e) => handleButtonClick("copy-publish", e)}
            >
              {isSubmitting ? "Copy & Publish..." : "Copy & Publish"}
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
}
