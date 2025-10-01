
import React, {useState} from "react";
import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { Link, useNavigate  } from "react-router-dom";
import { commonService } from 'services/common.service';
import { FORGET_PASSWORD } from "apiEndpoints";
import bgImage from 'assets/admin/images/login-img.webp';
import adminRouteMap from "../../../routes/Admin/adminRouteMap";
import { Button, InputField} from "../../../components";
import ImageElement from "../../../components/ImageElement";
import useAuth from "../../../customHooks/useAuth/index";

function VerifyEmail() {
  const navigate = useNavigate();
  const { getloginUserData, dispatcLoginUserData } = useAuth();
  const userData = getloginUserData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const otpFields = ["otp1", "otp2", "otp3", "otp4", "otp5", "otp6"];
    // Initialize Formik
    const formik = useFormik({
        initialValues: { otp1: "", otp2: "", otp3: "", otp4: "",  otp5: "",  otp6: "" },
        validationSchema: Yup.object(
            otpFields.reduce((schema, field) => {
                schema[field] = Yup.string()
                    .required("Required")
                    .length(1, "Must be exactly 1 character");
                return schema;
            }, {})
        ),
        onSubmit: async(values, { resetForm }) => {
          setIsSubmitting(true);
            const otp = Object.values(values).join(""); 
            const usersID = userData?.userID;
            if (!usersID) throw new Error("Missing token or userID");
            try {
              const response = await commonService({
                apiEndPoint: FORGET_PASSWORD.passwordVerification,
                bodyData: {
                  userID:usersID,
                  verificationCode:Number(otp),
                },
                 headers:{ 'Content-Type': 'application/json',
                  Authorization: `Bearer ${userData?.apiToken}`,
                  },
                toastType: {
                  success: "Verification Code Accepted",
                  error: "verification failed",
                },
              });
              if (response?.status) {
                setIsSubmitting(false);
                resetForm();
                let userResponse = {
                  "apiToken": response?.data?.webToken,
                  "userID": response?.data?.userID
                }
                dispatcLoginUserData(userResponse)
                navigate(adminRouteMap.CONFIRMPASSWORD.path);
              }else{
                setIsSubmitting(false);
                 resetForm();
              }
            } catch (error) {
              setIsSubmitting(false);
            }
        },
    });

    // Reset Code
    const formikResetCode = useFormik({
      initialValues: {
        username:userData?.username,
      },
      onSubmit: async(values, { resetForm }) => {
        try {
          const response = await commonService({
            apiEndPoint: FORGET_PASSWORD.passwordForget(`?username=${ userData?.username}`),
            bodyData: values,
             headers:{ 'Content-Type': 'application/json' },
          });
          if (response?.status) {
            toast.success(response?.data?.message, {
              id: "success",
            });
            setIsSubmitting(false);
            resetForm();
            let userResponse = {
              "apiToken": response?.data?.webToken,
              "userID": response?.data?.userID,
              "username": values?.username,
            }
            dispatcLoginUserData(userResponse)
          }else{
            setIsSubmitting(false);
          }
        } catch (error) {
          setIsSubmitting(false);
        }
      },
    });

    const handleLinkClick = (e) => {
      e.preventDefault(); 
      formikResetCode.handleSubmit(); 
    };

    console.log(formik.values,'formik.values')

  return (
      <main className="authpage">
        <section className="authSec d-sm-flex">
            <div className="authSec_left d-lg-flex d-none align-items-end" style={{backgroundImage: `url(${bgImage})`}}>
                <div className="authSec_cnt">
                    <h1>
                        Actionable <br className="d-xl-block d-none"/> real-time analysis <br className="d-xl-block d-none"/> made
                        easy.
                    </h1>
                    <p className="mb-0">Build, deploy and analyze Intelligent surveys <br className="d-xl-block d-none"/>
                      and share reports with your team and <br className="d-xl-block d-none"/>
                      stakeholders.</p>
                </div>
            </div>
            <div className="authSec_right">
                <div className="authSec_form">
                    <div className="authSec_logo">
                    <ImageElement source="logo.svg" className="img-fluid" />
                    </div>
                    <h2>Verify Your Email</h2>
                    <p>Please enter The 6 digit code sent to <br /><span> {userData?.eMailID}</span></p>
                    <Form onSubmit={formik.handleSubmit}>
                        <div className="authSec_opt">
                      
                          <Form.Group className="form-group d-flex">
                        {otpFields.map((field, index) => (
                        <InputField
                            key={index}
                            name={field}
                            type="text"
                            className={`text-center form-control ${
                                formik.errors[field] && formik.touched[field]
                                    ? "is-invalid"
                                    : ""
                            }`}
                            maxLength="1"
                            value={formik.values[field]}
                            onChange={(e) => {
                          
                              if (!/[0-9]/.test(e.target.value)) {
                                formik.setFieldValue(field,'');
                                e.preventDefault();  // Block non-numeric keys
                                return
                              }
                            
                                formik.handleChange(e);
                                if (e.target.value.length === 1 && index < otpFields.length - 1) {
                                    const nextSibling = document.getElementsByName(otpFields[index + 1])[0];
                                    nextSibling?.focus();
                                }
                            }}
                            onKeyDown={(e) => {
                             
                              if (e.code === "Backspace" ) {
                               setTimeout(() => {
                                 
                                if (index > 0) {
                                  const nextSibling = document.getElementsByName(otpFields[index - 1])[0];
                                  nextSibling?.focus();
                                }
                               },[300])
                               

                              }
                            }}
                            onBlur={formik.handleBlur}
                              />
                          ))}
                          </Form.Group>
                        </div>
                        <div className="d-flex align-items-center justify-content-end p-2">
                          <span className="fs-12" style={{color: '#0d6efd'}}>The code is valid for 10 minutes</span>
                        </div>
                        <div className="d-flex justify-content-center signin">
                          <span><Link type="submit"  onClick={handleLinkClick} disabled={isSubmitting}> {isSubmitting ? "Sending..." : "Resend Code"}</Link> </span>
                      </div>
                      <Button
                          variant="primary"
                          type="submit"
                          className="ripple-effect"
                          disabled={isSubmitting || Object.values(formik.values).some((value) => value === "" || value === undefined || value === null) }
                        >
                          {isSubmitting ? 'Verify...' : 'Verify'}
                        </Button>
                       
                    </Form>
                </div>
            </div>
            <ImageElement source="auth-bg.svg" className="img-fluid auth-bg" />
        </section>
      </main>
  );
}

export default VerifyEmail;
