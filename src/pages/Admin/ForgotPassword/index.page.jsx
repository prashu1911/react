
import React, {useState} from "react";
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup"
import { toast } from "react-hot-toast";
import { commonService } from 'services/common.service';
import { FORGET_PASSWORD } from "apiEndpoints";
import ImageElement from "../../../components/ImageElement";
import bgImage from '../../../assets/admin/images/forget-password-img.webp';
import adminRouteMap from "../../../routes/Admin/adminRouteMap";
import { Button, InputField} from "../../../components";
import useAuth from "../../../customHooks/useAuth/index";

function AdminForgotPassword() {
  const navigate = useNavigate();
  const {dispatcLoginUserData } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const response = await commonService({
        apiEndPoint: FORGET_PASSWORD.passwordForget(`?username=${ values?.username}`),
        bodyData: values,
         headers:{ 'Content-Type': 'application/json' },
      });
      if (response?.errorCode === 204) {
        toast.error("Username does not exist.", { toastId: "error001" });
        setIsSubmitting(false);
      } else if (response?.status) {
        toast.success(response?.data?.message, {
          id: "success",
        });
        setIsSubmitting(false);
        resetForm();
        let userData = {
          "username": values?.username,
          "apiToken": response?.data?.webToken,
          "userID": response?.data?.userID,
          "eMailID": response?.data?.eMailID
        }
        dispatcLoginUserData(userData)
        navigate(adminRouteMap.VERIFYEMAIL.path);
      }else{
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
    },
     validationSchema:Yup.object({
      username: Yup.string().required('username is required'),
    }),
    onSubmit: handleSubmit,
  });

  return (
      <main className="authpage">
        <section className="authSec d-sm-flex">
            <div className="authSec_left d-lg-flex d-none align-items-end" style={{ backgroundImage: `url(${bgImage})` }}>
                <div className="authSec_cnt">
                    <h1>
                        Actionable <br className="d-xl-block d-none"/> real-time analysis <br className="d-xl-block d-none"/> made
                        easy.
                    </h1>
                    <p className="mb-0">Create, send, and analyze intelligent surveys, <br className="d-xl-block d-none"/>
                    then share reports with your team.</p>
                </div>
            </div>
            <div className="authSec_right">
                <div className="authSec_form">
                    <div className="authSec_logo">
                      <ImageElement source="logo.svg" className="img-fluid" />
                    </div>
                    <h2>Reset Password</h2>
                    <p>Please enter your username to Reset your password.</p>
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group className="form-group">
                          <div className="position-relative fieldicon">
                            <InputField
                              extraClass=" fieldicon-input-left"
                              type="username"
                              name="username"
                              placeholder="Enter Username"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.username && formik.errors.username ? (
                              <div className="error mt-1 text-danger">{formik.errors.username}</div>
                            ) : null}
                            <span className="icon-email fieldicon-left" />
                          </div>
                        </Form.Group>
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={isSubmitting || !formik.isValid || !formik.dirty}
                          className="ripple-effect"
                        >
                          {isSubmitting ? 'Reset...' : 'Reset Password'}
                        </Button>
                        <div className="d-flex justify-content-center signin">
                          <span>Remember it? <Link to={adminRouteMap.LOGIN.path}>Sign In Here</Link> </span>
                      </div>
                    </Form>
                </div>
            </div>
            <ImageElement source="auth-bg.svg" className="img-fluid auth-bg" />
        </section>
      </main>
  );
}

export default AdminForgotPassword;
