import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import bgImage from "assets/admin/images/login-img.webp";
import adminRouteMap from "routes/Admin/adminRouteMap";
import { Button, ImageElement, InputField } from "components";
import { commonService } from "services/common.service";
import { AUTH_ENDPOINTS } from "apiEndpoints";
import toast from "react-hot-toast";
import participantRouteMap from "routes/Participant/participantRouteMap";
import { Spinner } from "react-bootstrap";
import useAuth from "../../../customHooks/useAuth/index";
import { getDefaultRoute } from "../../../utils/auth.util";

function AdminLogin() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const allowedRoles = ["Master Admin", "Assessment Admin","Company Admin","Company Support User","Company Analyst","Client User Access"];
  const navigate = useNavigate();
  const { dispatcLoginUserData } = useAuth();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async (values) => {
    if (isTermsChecked) {
      setIsLoading(true);
      const response = await commonService({
        apiEndPoint: AUTH_ENDPOINTS.login,
        bodyData: values,
        headers: { "Content-Type": "application/json" },
        toastType: {
          success: "Login successful",
          error: "Login failed",
        },
      });
      if (response?.status) {
        let userData = {
          aliasName: response?.data?.aliasName,
          companyID: response?.data?.companyID,
          companyMasterID: response?.data?.companyMasterID,
          companyMasterName: response?.data?.companyMasterName,
          companyName: response?.data?.companyName,
          departmentID: response?.data?.departmentID,
          eMailID: response?.data?.eMailID,
          firstName: response?.data?.firstName,
          isAnonymous: response?.data?.isAnonymous,
          isRandomUser: response?.data?.isRandomUser,
          isReportPermission: response?.data?.isReportPermission,
          isSampleUser: response?.data?.isSampleUser,
          isSubscriberAdmin: response?.data?.isSubscriberAdmin,
          lastName: response?.data?.lastName,
          menu: response?.data?.menu,
          menuPreference: response?.data?.menuPreference,
          apiToken: response?.data?.webToken,
          roleName: response?.data?.roleName,
          userID: response?.data?.userID,
          roleID: response?.data?.roleID,
          companyConfig: response?.data?.properties || {},
        };
        setIsLoading(false);
        dispatcLoginUserData(userData);
        if (response?.data?.roleName) {
          if (allowedRoles.includes(response?.data?.roleName)) {
            const defaultRoute = getDefaultRoute(response?.data?.menu);
            navigate(`${defaultRoute}`);
          } else {
            navigate(participantRouteMap.PROGRESSDASHBOARD.path);
          }
        } 
      } else {
        setIsLoading(false);
      }
    } else {
      toast.error("Please select Terms and condition to continue.", {
        id: "err008",
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      tUsername: "",
      tPassword: "",
    },
    validationSchema: Yup.object({
      tUsername: Yup.string()
        .min(1, "Mininum 1 characters")
        .max(150, "Maximum 150 characters")
        .required("You must enter a username"),
      tPassword: Yup.string()
        .max(24, "Maximum 24 characters")
        .required("You must enter a password"),
    }),
    onSubmit: (values) => handleSubmit(values),
  });

  return (
    <main className="authpage" style={{ userSelect: "none" }}>
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
              <ImageElement
                previewSource="../../assets/admin-images/logo.svg"
                className="img-fluid"
              />
            </div>
            <h2>Welcome Back!</h2>
            <p>Start managing your surveys faster and better</p>
            <Form onSubmit={formik.handleSubmit}>
              <Form.Group className="form-group">
                <div className="position-relative fieldicon">
                  <InputField
                    type="text"
                    name="tUsername"
                    extraClass="fieldicon-input-left"
                    placeholder="Enter username"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.tUsername}
                  />
                  {formik.touched.tUsername && formik.errors.tUsername ? (
                    <div className="error mt-1 text-danger">
                      {formik.errors.tUsername}
                    </div>
                  ) : null}
                  <span className="icon-email fieldicon-left" />
                </div>
              </Form.Group>
              <Form.Group className="form-group">
                <div className="position-relative fieldicon">
                  <InputField
                    type={isPasswordVisible ? "text" : "password"}
                    name="tPassword"
                    extraClass="fieldicon-input-left fieldicon-input-right"
                    placeholder="Enter password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.tPassword}
                  />
                  {formik.touched.tPassword && formik.errors.tPassword ? (
                    <div className="error mt-1 text-danger">
                      {formik.errors.tPassword}
                    </div>
                  ) : null}
                  <span className="icon-lock fieldicon-left" />
                  <Link
                    href="#!"
                    onClick={togglePasswordVisibility}
                    className={`toggle-password fieldicon-right ${
                      isPasswordVisible ? "icon-eye" : "icon-eye-off"
                    }`}
                  />
                </div>
              </Form.Group>
              <div className="text-end">
                <Link
                  to={adminRouteMap.FORGOTPASSWORD.path}
                  className="forgotpassword d-inline-block"
                  aria-label="forgot password"
                >
                  Forgot Password?
                </Link>
              </div>
              <Form.Group className="form-group" controlId="terms">
                <div className="form-check form-check-inline m-0 me-2">
                  <Form.Check
                    type="checkbox"
                    label={
                      <>
                        I agree that I have read, understand, and agree to be
                        bound by these <Link to="/terms">Terms of Use</Link>
                      </>
                    }
                    onChange={() => setIsTermsChecked(!isTermsChecked)}
                  />
                </div>
              </Form.Group>
              <Button
                disabled={isLoading}
                type="submit"
                variant="primary ripple-effect login_button"
              >
                {isLoading ? (
                  <Spinner animation="border" size="sm" className="me-2" />
                ) : null}
                Login Now
              </Button>
            </Form>
          </div>
        </div>
        <ImageElement
          previewSource="../../assets/admin-images/auth-bg.svg"
          className="img-fluid auth-bg"
        />
      </section>
    </main>
  );
}

export default AdminLogin;
