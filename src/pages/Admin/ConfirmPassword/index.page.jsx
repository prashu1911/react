import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { commonService } from "services/common.service";
import { FORGET_PASSWORD } from "apiEndpoints";
import ImageElement from "../../../components/ImageElement";
import bgImage from "../../../assets/admin/images/login-img.webp";
import adminRouteMap from "../../../routes/Admin/adminRouteMap";
import { Button, InputField } from "../../../components";
import useAuth from "../../../customHooks/useAuth/index";

function AdminConfirmPassword() {
  const navigate = useNavigate();
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const togglePasswordVisibility2 = () => {
    setIsPasswordVisible2(!isPasswordVisible2);
  };

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required("New password is required.")
        .min(6, "New password should be at least 8 characters long.")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
          "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        ),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        if (!userData?.userID) throw new Error("Missing token or userID");

        const response = await commonService({
          apiEndPoint: FORGET_PASSWORD.passwordUpdate,
          bodyData: {
            userID: userData?.userID,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.apiToken}`,
          },
          toastType: {
            success: "Password Updated Successfully",
            error: "verification failed",
          },
        });
        if (response?.status) {
          setIsSubmitting(false);
          resetForm();
          // dispatcLogout();
          localStorage.clear();
          setTimeout(() => {
            navigate(adminRouteMap?.LOGIN?.path);
          }, [400]);
        } else {
          setIsSubmitting(false);
        }
      } catch (error) {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <main className="authpage">
      <section className="authSec d-sm-flex">
        <div
          className="authSec_left d-lg-flex d-none align-items-end"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="authSec_cnt">
            <h1>
              Actionable <br className="d-xl-block d-none" /> real-time analysis{" "}
              <br className="d-xl-block d-none" /> made easy.
            </h1>
            <p className="mb-0">
              Create, send, and analyze intelligent surveys,{" "}
              <br className="d-xl-block d-none" />
              then share reports with your team.
            </p>
          </div>
        </div>
        <div className="authSec_right">
          <div className="authSec_form">
            <div className="authSec_logo">
              <ImageElement source="logo.svg" className="img-fluid" />
            </div>
            <h2>Confirm Password</h2>
            <p>Please enter your new password and confirm password. </p>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="form-group">
                <div className="position-relative fieldicon">
                  <InputField
                    type={isPasswordVisible ? "text" : "password"}
                    extraClass=" fieldicon-input-left fieldicon-input-right"
                    placeholder="Enter New Password"
                    name="newPassword"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <span className="icon-lock fieldicon-left" />
                  <Link
                    href="#!"
                    onClick={togglePasswordVisibility}
                    className={`toggle-password fieldicon-right ${isPasswordVisible ? "icon-eye-off" : "icon-eye"}`}
                  />
                </div>
                {formik.errors.newPassword && formik.touched.newPassword && (
                  <div className="error mt-1 text-danger">
                    {formik.errors.newPassword}
                  </div>
                )}
              </Form.Group>
              <Form.Group className="form-group">
                <div className="position-relative fieldicon">
                  <InputField
                    type={isPasswordVisible2 ? "text" : "password"}
                    extraClass=" fieldicon-input-left fieldicon-input-right"
                    placeholder="Enter Confirm Password"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <span className="icon-lock fieldicon-left" />
                  <Link
                    href="#!"
                    onClick={togglePasswordVisibility2}
                    className={`toggle-password fieldicon-right ${isPasswordVisible2 ? "icon-eye-off" : "icon-eye"}`}
                  />
                </div>
                {formik.errors.confirmPassword &&
                  formik.touched.confirmPassword && (
                    <div className="error mt-1 text-danger">
                      {formik.errors.confirmPassword}
                    </div>
                  )}
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="ripple-effect"
              >
                {isSubmitting ? "Update..." : "Update Password"}
              </Button>
            </Form>
          </div>
        </div>
        <ImageElement source="auth-bg.svg" className="img-fluid auth-bg" />
      </section>
    </main>
  );
}

export default AdminConfirmPassword;
