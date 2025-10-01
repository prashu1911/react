import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, ImageElement, InputField } from "components";
import { commonService } from "services/common.service";
import { AUTH_ENDPOINTS } from "apiEndpoints";
import toast from "react-hot-toast";
import { Spinner } from "react-bootstrap";
import useAuth from "../../../customHooks/useAuth/index";
import { getDefaultRoute } from "../../../utils/auth.util";
import buildingIcon from "../../../assets/admin/images/building-icon.png";
import bgImage from "../../../assets/admin/images/background-img.png"; 

function SSOLogin() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(""); 
  const [selectedCompanyName, setSelectedCompanyName] = useState(""); 
  const [webToken, setWebToken] = useState("");
  const [companies, setCompanies] = useState([]);

  const { dispatcLoginUserData } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Function to get list of companies associated with SSO
  const getSSOCompanies = async () => {
    const { tUsername, tPassword } = formik.values;
    setIsLoading(true);

    try {
      const encodedUsername = encodeURIComponent(tUsername);
      const encodedPassword = encodeURIComponent(tPassword);

      const endpoint = AUTH_ENDPOINTS.ssocompanies(encodedUsername, encodedPassword);

      const response = await commonService({
        apiEndPoint: endpoint,
        headers: { "Content-Type": "application/json" },
        isToast: false,
      });

      if (response?.status === true) {
        const ssoData = response.data;
        if (ssoData?.status === "success") {
          setCompanies(ssoData.ssoInfo || []);
          setWebToken(ssoData.webToken|| "");
          setShowCompanyDropdown(true);
        } else {
          toast.error(ssoData?.message || "Failed to fetch companies");
        }
      } else {
        console.error("Could not fetch companies:", error);
      }
    } catch (error) {
      console.error("SSO Error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle SSO login
   const handleFinalLogin = async () => {
    if (!selectedCompanyId) {
      toast.error("Please select a company to login");
      return;
    }

    setIsLoading(true);
    try {
      const response = await commonService({
        apiEndPoint: AUTH_ENDPOINTS.ssoFinalLogin,
        method: "POST",
        bodyData: {
          id: parseInt(selectedCompanyId), // Ensure ID is an integer
        },
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${webToken}`, 
        },
        isToast: true,
        toastType: { success: "Login successful", error: "Login failed" },
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
        dispatcLoginUserData(userData); 
        // Redirect 
        const defaultRoute = getDefaultRoute(response?.data?.menu);
        navigate(`${defaultRoute}`);
      }
    } catch (error) {
      toast.error("SSO Login failed:", error); // Generic error message
    } finally {
      setIsLoading(false);
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
    onSubmit: getSSOCompanies
  });

  return (
    <main
      className="authpage"
      style={{
        userSelect: 'none',
        minHeight: '100vh',
        height: '100vh',
        overflow: 'hidden',
        backgroundImage: `url(${bgImage})`, 
        backgroundSize: '110% 100%',         
        backgroundPosition: 'center center', 
        backgroundRepeat: 'no-repeat',       
        display: 'flex',                     
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <section className="authSec_cnt">
        <div>
        </div>
        <div className="authSec_cnt justify-content-center align-items-center">
          <div className="authSec_form">
            <div className="authSec_logo" style={{ marginTop: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <br /><br />
              <ImageElement
                previewSource="../../assets/admin-images/logo.svg"
                className="img-fluid"
              />
            </div>
            <br />
            {/* <h2>SSO Login</h2> */}
            <br />
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
                    disabled={showCompanyDropdown}
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
                    disabled={showCompanyDropdown} // Make fields read only when company selected
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
                    className={`toggle-password fieldicon-right ${isPasswordVisible ? "icon-eye" : "icon-eye-off"}`}
                  />
                </div>
              </Form.Group>
              <div className="text-end">
              </div>
              {!showCompanyDropdown ? (
                <Button
                  disabled={isLoading || !formik.isValid}
                  type="button"
                  variant="primary ripple-effect"
                  onClick={getSSOCompanies}
                >
                  {isLoading ? (
                    <Spinner animation="border" size="sm" className="me-2" />
                  ) : null}
                  Get Company
                </Button>
              ) : (
                <>
                  <Form.Group className="form-group">
                    <Form.Select
                      value={selectedCompanyId} // Bind to the ID for value
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        setSelectedCompanyId(selectedId);
                        const selectedCompany = companies.find(company => company.id === selectedId);
                        setSelectedCompanyName(selectedCompany ? selectedCompany.name : "");
                        console.log("Selected Company:",selectedCompanyName);
                      }}
                      style={{ height: "55px" , paddingLeft: "3rem"}}
                    >
                      <option value="">--Select Master Company--</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </Form.Select>
                    <img
                    src={buildingIcon}
                    alt="Building Icon"
                    style={{
                      position: 'absolute',
                      left: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '1.7rem',
                      height: '1.7rem',
                    }}
                  />
                  </Form.Group>
                  <Button
                    type="button"
                    variant="primary ripple-effect"
                    onClick={handleFinalLogin}
                    disabled={isLoading || !selectedCompanyId || !webToken}
                    style={{ marginTop: "10px", height: "50px" }}
                  >
                    Login
                  </Button>
                </>
              )}
            </Form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SSOLogin;