import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Form } from "react-bootstrap";
import { commonService } from "services/common.service";
import { QuestionSetup } from "apiEndpoints/QuestionSetup";
import { useAuth } from "customHooks";
import { SelectField, Button } from "../../../../../components";
import { outcomeInitialValue, outComeValidationSchema } from "./validation";

const OutcomeForm = ({
  handleSaveOutcome,
  onCancel,
  currentOutcomeId,
  outComeColors,
  surveyID,
  companyID,
  isEdit = false, // Add this prop
  editData = null, // Add this prop
  status
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isHasColorSwatch = true;

  useEffect(() => {
    if (Array.isArray(outComeColors) && outComeColors.length > 0) {
      formik.setFieldValue("titleBarColor", outComeColors[0].value);
    }
  }, [outComeColors]);

  // Importing user data from custom authentication hook
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);

    console.log("title bar color: ", values?.titleBarColor);

    try {
      const endpoint = isEdit
        ? QuestionSetup.editOutcome
        : QuestionSetup.addOutcome;
      const payload = {
        outcomeName: values?.outcomeName,
        outcomeDefinition: values?.outcomeDescription,
        outcomeTitleColor: values?.titleBarColor || "",
      };

      if (!isEdit) {
        payload.companyID = companyID;
        payload.surveyID = surveyID;
      } else {
        payload.outcomeID = currentOutcomeId;
      }

      const response = await commonService({
        apiEndPoint: endpoint,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: true,
          error: false,
        },
      });

      if (response?.status) {
        resetForm();
        if (handleSaveOutcome) {
          handleSaveOutcome(currentOutcomeId);
        }
      }
    } catch (error) {
      console.error("Error saving outcome:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize formik with edit data if availabl
  const formik = useFormik({
    initialValues:
      isEdit && editData
        ? {
            outcomeName: editData.outcomeName || "",
            outcomeDescription: editData.outcomeDefinition || "",
            titleBarColor: editData?.colorData?.value || "",
          }
        : outcomeInitialValue(),
    validationSchema: outComeValidationSchema(),
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <div className="dataAnalyticsCol">
      <div className="dataAnalyticsCol_inner ps-0">
        <Form onSubmit={formik.handleSubmit}>
          <div className="outcomeName position-relative">
            <Form.Group className="form-group mb-xxl-3 mb-2">
              <Form.Control
                as="textarea"
                className={`form-control form-control-md `}
                placeholder="Outcomes Name..."
                name="outcomeName"
                onChange={formik.handleChange}
                value={formik.values.outcomeName}
                disabled={status}
              />
              {formik.touched.outcomeName && formik.errors.outcomeName && (
                <div className="error mt-1 text-danger">
                  {formik.errors.outcomeName}
                </div>
              )}
            </Form.Group>

            <Form.Group className="form-group mb-0">
              <Form.Control
                as="textarea"
                className="outcomeDescription form-control form-control-md"
                name="outcomeDescription"
                placeholder="Enter Outcome Description"
                onChange={formik.handleChange}
                value={formik.values.outcomeDescription}
                disabled={status}
              />
              {formik.touched.outcomeDescription &&
                formik.errors.outcomeDescription && (
                  <div className="error mt-1 text-danger">
                    {formik.errors.outcomeDescription}
                  </div>
                )}
            </Form.Group>

            <div className="d-flex align-items-lg-center align-items-end justify-content-between outcomeName_select flex-wrap gap-3 pb-2 pe-2">
              <div className="d-flex flex-wrap gap-lg-0 gap-2">
                <Form.Group className="form-group d-lg-flex align-items-center outcomeName_select_color mb-0">
                  <Form.Label className="mb-lg-0">
                    Color For The Title Bar
                  </Form.Label>
                  <SelectField
                    placeholder="Select"
                    options={outComeColors}
                    name="titleBarColor"
                    onChange={(selectedOption) => {
                      formik.setFieldValue(
                        "titleBarColor",
                        selectedOption.value
                      );
                    }}
                    hasColorSwatch={isHasColorSwatch}
                    value={outComeColors.find(
                      (option) => option.value === formik.values.titleBarColor
                    )}
                    disabled={status}
                  />
                  {/* {formik.touched.titleBarColor &&
                    formik.errors.titleBarColor && (
                      <div className="error mt-1 text-danger">
                        {formik.errors.titleBarColor}
                      </div>
                    )} */}
                </Form.Group>
              </div>

              <div className="d-flex gap-2">
                <Button
                  variant="secondary"
                  className="ripple-effect"
                  type="button"
                  onClick={() => onCancel(currentOutcomeId)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="ripple-effect"
                  type="submit"
                  disabled={formik.isSubmitting || status}
                >
                  {isSubmitting
                    ? isEdit
                      ? "Updating...."
                      : "Saving...."
                    : isEdit
                    ? "Update"
                    : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default OutcomeForm;
