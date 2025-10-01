import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { commonService } from "services/common.service";
import {
  Button,
  InputField,
  ModalComponent,
} from "../../../../../../components";
import useAuth from "../../../../../../customHooks/useAuth/index";


export default function SurveyFindAndReplaceModel({
  modalHeader,
  show,
  onHandleCancel,
  initialData, // Pass initialData for edit mode
  validationFAQ,
  survey,
  reviewData,
}) {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Submission Handler
  const handleSubmitFAQ = async (values, { resetForm }) => {
    try {
      if (userData) {
        if (values?.filterQuestion || values?.filterResponse) {
          const response = await commonService({
            apiEndPoint: SURVEYS_MANAGEMENT.findAndReplaceSurvay,
            bodyData: {
              companyID: reviewData?.survey_details?.companyID,
              surveyID: survey?.survey_id,
              findWhat: values?.findReplace,
              replaceWith: values?.replace_with,
              filterQuestion: values?.filterQuestion,
              filterResponse: values?.filterResponse,
            },
            toastType: {
              success: false,
              error: false,
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData?.apiToken}`,
            },
          });
          if (response?.status) {

            if (response?.data?.text_changed) {
              toast.success(response?.data?.Message,{toastId:"successF&R"})
            } else {
              toast.error("No matching results found for the entered input.",{toastId:"errorF&R"})
            }
            setIsSubmitting(false);
            onHandleCancel(); // Close modal
            resetForm(); // Reset the form
            // navigate(adminRouteMap.MANAGESURVEY.path);
            return true;
          } else {
            console.log("error");
            setIsSubmitting(false);
            return false;
          }
        } else {
          toast.error("Either Question or Response should be selected", {
            toastId: "err001",
          });
        }
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  // Single Formik Instance
  const formik = useFormik({
    enableReinitialize: true, // Enable dynamic initial values
    initialValues: initialData,
    validationSchema: validationFAQ,
    onSubmit: handleSubmitFAQ,
  });

  return (
    <ModalComponent
      modalHeader={modalHeader}
      size="sm"
      extraClassName="reviewEditModal"
      show={show}
      onHandleCancel={onHandleCancel}
    >
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group className="form-group mb-3">
          <Form.Label>
            Find What<sup>*</sup>
          </Form.Label>
          <InputField
            type="text"
            placeholder="Enter Find What"
            name="findReplace"
            value={formik?.values?.findReplace}
            onChange={formik?.handleChange}
            onBlur={formik?.handleBlur}
          />
          {formik?.touched?.findReplace && formik?.errors?.findReplace && (
            <div className="error mt-1 text-danger">
              {formik?.errors?.findReplace}
            </div>
          )}
        </Form.Group>
        <Form.Group className="form-group mb-3">
          <Form.Label>
            Replace With<sup>*</sup>
          </Form.Label>
          <InputField
            type="text"
            placeholder="Enter Replace With"
            name="replace_with"
            value={formik?.values?.replace_with}
            onChange={formik?.handleChange}
            onBlur={formik?.handleBlur}
          />
          {formik?.touched?.replace_with && formik?.errors?.replace_with && (
            <div className="error mt-1 text-danger">
              {formik?.errors?.replace_with}
            </div>
          )}
        </Form.Group>
        <Form.Group className="form-group mb-3">
          <div className="onlyradio flex-wrap">
            {["checkbox"].map((type) => (
              <React.Fragment key={`assessment-${type}`}>
                <Form.Check
                  controlid="questions"
                  inline
                  label="Question"
                  name="filterQuestion"
                  type={type}
                  value="English"
                  checked={formik?.values?.filterQuestion}
                  onChange={formik?.handleChange}
                />
                <Form.Check
                  controlid="responses"
                  inline
                  label="Response"
                  name="filterResponse"
                  type={type}
                  value="Others"
                  checked={formik?.values?.filterResponse}
                  onChange={formik?.handleChange}
                />
              </React.Fragment>
            ))}
          </div>
        </Form.Group>
        <div className="form-btn d-flex justify-content-end gap-2">
          <Button
            variant="secondary"
            className="ripple-effect"
            onClick={onHandleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="ripple-effect"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Replace..." : " Replace"}
          </Button>
        </div>
      </Form>
    </ModalComponent>
  );
}
