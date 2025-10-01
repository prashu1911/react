import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import {
  Button,
  InputField,
  ModalComponent,
  TextEditor,
} from "../../../../../../components";

export default function SurveyHelpContactModel({
  modalHeader,
  show,
  onHandleCancel,
  buttonText,
  initialData, // Pass initialData for edit mode
  validationFAQ,
  handleFaqSubmit,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitFAQ = async (value, { resetForm }) => {
    handleFaqSubmit(value);
    resetForm();
    onHandleCancel();
    setIsSubmitting(false);
  };

  // Single Formik Instance
  const formik = useFormik({
    enableReinitialize: true, // Enable dynamic initial values
    initialValues: initialData,
    validationSchema: validationFAQ,
    onSubmit: handleSubmitFAQ,
  });

  const handleCancel = () => {
    formik.resetForm();
    onHandleCancel();
  };

  return (
    <ModalComponent
      modalHeader={modalHeader}
      show={show}
      onHandleCancel={handleCancel}
    >
      <Form onSubmit={formik?.handleSubmit}>
        <Form.Group className="form-group mb-3">
          <Form.Label>
            Title<sup>*</sup>
          </Form.Label>
          <InputField
            type="text"
            placeholder="Contact Title"
            name="help_title"
            value={formik?.values?.help_title}
            onChange={formik?.handleChange}
            onBlur={formik?.handleBlur}
          />
          {formik?.touched?.help_title && formik?.errors?.help_title && (
            <div className="error mt-1 text-danger">
              {formik?.errors?.help_title}
            </div>
          )}
        </Form.Group>
        <Form.Group className="form-group mb-3">
          <Form.Label>
            Description<sup>*</sup>
          </Form.Label>
          <TextEditor
            value={formik?.values?.help_description}
            onChange={(value) =>
              formik?.setFieldValue("help_description", value)
            }
              compRemovePlugins={['Image', 'ImageToolbar', 'ImageUpload', 'ImageInsert']}
          />
          {formik?.touched?.help_description &&
            formik?.errors?.help_description && (
              <div className="error mt-1 text-danger">
                {formik?.errors?.help_description}
              </div>
            )}
        </Form.Group>
        <div className="form-btn d-flex justify-content-end">
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
