import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import { commonService } from "services/common.service";
import { useAuth } from "customHooks";
import { AUTH_ENDPOINTS } from "apiEndpoints";
import ModalComponent from "../../../Modal";
import Button from "../../../Button";
import InputField from "../../../Input";
import SweetAlert from "../../../SweetAlert";
import { initValuesAdd, validationParticipantAdd } from "./validate";  

function ChangePasswordModel({
  showResetPassword,
  resetPasswordClose,
  isAlertVisible,
  onConfirmAlertModal, 
  setIsAlertVisible,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  
  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const response = await commonService({
        apiEndPoint: AUTH_ENDPOINTS.changePassword,
        bodyData: {
          currentPassword: values?.currentPassword,
          newPassword: values?.newPassword,
          confirmPassword: values?.confirmPassword,
          userID: userData?.userID,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: "Update Admin Successfully",
          error: "admin failed",
        },
      });
      if (response?.status) {
        setIsSubmitting(false);
        resetForm();
        resetPasswordClose()
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: initValuesAdd(),
    validationSchema: validationParticipantAdd,
    onSubmit: handleSubmit,
  });

  const handleCancel = () =>{
    formik.resetForm()
    resetPasswordClose()
  }

  return (
    <div>
      <ModalComponent
        modalHeader="Reset Password"
        modalExtraClass="resetPassword"
        show={showResetPassword}
        onHandleCancel={handleCancel}
      >
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label>Current Password</Form.Label>
            <InputField
              type="password"
              placeholder="Enter Current Password"
              name="currentPassword"
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.currentPassword &&
              formik.errors.currentPassword && (
                <div className="error mt-1 text-danger">
                  {formik.errors.currentPassword}
                </div>
              )}
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>New Password</Form.Label>
            <InputField
              type="password"
              placeholder="Enter New Password"
              name="newPassword"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.newPassword && formik.errors.newPassword && (
              <div className="error mt-1 text-danger">
                {formik.errors.newPassword}
              </div>
            )}
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>Confirm Password</Form.Label>
            <InputField
              type="password"
              placeholder="Enter Confirm Password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <div className="error mt-1 text-danger">
                  {formik.errors.confirmPassword}
                </div>
              )}
          </Form.Group>
          <div className="form-btn d-flex gap-2 justify-content-end">
            <Button
              variant="secondary"
              className="ripple-effect"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="ripple-effect"
            >
              {isSubmitting ? "Submiting..." : "Submit"}
            </Button>
          </div>
        </Form>
      </ModalComponent>

      <SweetAlert
        icon="success"
        title="Change Password Successfully"
        timer="1500"
        showConfirmButton={false}
        confirmButtonColor="#0968AC"
        width="475"
        show={isAlertVisible}
        onConfirmAlert={onConfirmAlertModal}
        setIsAlertVisible={setIsAlertVisible}
      />
    </div>
  );
}

export default ChangePasswordModel;
