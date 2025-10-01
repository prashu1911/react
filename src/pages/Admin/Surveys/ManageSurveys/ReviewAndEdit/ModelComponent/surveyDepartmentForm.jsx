import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import {
  Button,
  InputField,
  ModalComponent,
  SelectField,
} from "../../../../../../components";
import useAuth from "../../../../../../customHooks/useAuth/index";

export default function SurveyDepartmentModel({
  modalHeader,
  show,
  onHandleCancel,
  buttonText,
  initialData, // Pass initialData for edit mode
  validationFAQ,
  companyOptions,
}) {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Submission Handler
  const handleSubmitHelpContact = async (values, { resetForm }) => {
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
    onSubmit: handleSubmitHelpContact,
  });

  return (
    <ModalComponent
      modalHeader={modalHeader}
      show={show}
      onHandleCancel={onHandleCancel}
    >
      <Form onSubmit={formik?.handleSubmit}>
        <Form.Group className="form-group mb-3">
          <Form.Label>
            Company Name<sup>*</sup>
          </Form.Label>
          <SelectField placeholder="Company Name" options={companyOptions} />
        </Form.Group>
        <Form.Group className="form-group mb-3">
          <Form.Label>
            Department Name<sup>*</sup>
          </Form.Label>
          <InputField
            type="text"
            placeholder="Help Contact Title"
            name="departmentName"
            value={formik?.values?.departmentName}
            onChange={formik?.handleChange}
            onBlur={formik?.handleBlur}
          />
          {formik?.touched?.departmentName &&
            formik?.errors?.departmentName && (
              <div className="error mt-1 text-danger">
                {formik?.errors?.departmentName}
              </div>
            )}
        </Form.Group>
        <div className="form-btn d-flex justify-content-end">
          <Button
            variant="secondary"
            className="ripple-effect"
            onClick={onHandleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
            className="ripple-effect"
          >
            {isSubmitting ? `${buttonText}...` : buttonText}
          </Button>
        </div>
      </Form>
    </ModalComponent>
  );
}
