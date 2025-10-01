import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import {
  Button,
  InputField,
  ModalComponent,
  TextEditor,
} from "../../../../../../components";


export default function SurveyFAQModel({
  modalHeader,
  show,
  onHandleCancel,
  buttonText,
  initialData, 
  validationFAQ,
  handleFaqSubmit,
}) {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitFAQ = async (value, { resetForm }) => {
    handleFaqSubmit(value);
    resetForm();
    onHandleCancel();
    setIsSubmitting(false);
    toast.success(`FAQ ${buttonText === 'Add FAQ' ? 'Added' : 'Updated'} Successfully`,{toastId:'suc001'})
  };

  // Single Formik Instance
  const formik = useFormik({
    enableReinitialize: true, 
    initialValues: initialData,
    validationSchema: validationFAQ,
    onSubmit: handleSubmitFAQ,
  });

  const handleCancel = () =>{
    formik.resetForm()
    onHandleCancel()
  }

  return (
    <ModalComponent
      modalHeader={modalHeader}
      show={show}
      onHandleCancel={  handleCancel}
    >
      <Form onSubmit={formik?.handleSubmit}>
        <Form.Group className="form-group mb-3">
          <Form.Label>
            Title<sup>*</sup>
          </Form.Label>
          <InputField
            type="text"
            placeholder="FAQ Title"
            name="faq_title"
            value={formik?.values?.faq_title}
            onChange={formik?.handleChange}
            onBlur={formik?.handleBlur}
          />
          {formik?.touched?.faq_title && formik?.errors?.faq_title && (
            <div className="error mt-1 text-danger">
              {formik?.errors?.faq_title}
            </div>
          )}
        </Form.Group>
        <Form.Group className="form-group mb-3">
          <Form.Label>
            Description<sup>*</sup>
          </Form.Label>
          <TextEditor
            value={formik?.values?.faq_description}
            onChange={(value) =>
              formik?.setFieldValue("faq_description", value)
            }
            compRemovePlugins={['Image', 'ImageToolbar', 'ImageUpload', 'ImageInsert']}
          />
          {formik?.touched?.faq_description &&
            formik?.errors?.faq_description && (
              <div className="error mt-1 text-danger">
                {formik?.errors?.faq_description}
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
