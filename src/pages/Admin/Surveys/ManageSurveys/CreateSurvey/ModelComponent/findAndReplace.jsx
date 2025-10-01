import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useFormik } from "formik";
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
}) {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Submission Handler
  const handleSubmitFAQ = async ({ resetForm }) => {
    try {
      if (userData) {
        onHandleCancel(); // Close modal
        resetForm(); // Reset the form
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
