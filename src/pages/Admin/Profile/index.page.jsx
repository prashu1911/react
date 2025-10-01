import React, { useEffect, useState } from "react";
import { Card, Form, Nav, Spinner, Tab } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PROFILE_API } from "apiEndpoints/Profile";
import { commonService } from "services/common.service";
import { useAuth } from "customHooks";
import { showSuccessToast } from "helpers/toastHelper";
import { Formik } from "formik";
import ImageElement from "../../../components/ImageElement";
import {
  Breadcrumb,
  Button,
  InputField,
  Loader,
  ModalComponent,
} from "../../../components";
import MyRequests from "./MyRequests/index.page";
import ContactSupport from "./ContactSupport/index.page";

export default function Profile() {
  // edit modal
  const [showEditCompany, setShowEditCompany] = useState(false);
  const editCompanyClose = () => setShowEditCompany(false);
  const editCompanyShow = () => setShowEditCompany(true);

  const { getloginUserData, dispatcLoginUserData } = useAuth();
  const userData = getloginUserData();

  const [userDetails, setUserDetails] = useState({});
  const [ticketData, setTicketData] = useState([]);
  const [isUpdateData, setIsUpdateData] = useState(false);
  const [currenTicketId, setCurrentTicketId] = useState(null);
  const [currentTicketData, setCurrentTicketData] = useState({});
  const [isCurrentTicketLoader, setIsCurrentTicketLoader] = useState(false);
  const [isCreateTicketBtnDisable, setIsCreateTicketBtnDisable] =
    useState(false);
  const [isEditCompanyBtnDisable, setIsEditCompanytnDisable] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // breadcrumb
  const breadcrumb = [
    {
      path: "#",
      name: "Profile",
    },
  ];

  function formatDateTime(date) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return new Date(date).toLocaleString("en-US", options).replace(",", "");
  }

  const fetchProfileDetails = async () => {
    setIsLoading(true);
    const response = await commonService({
      apiEndPoint: PROFILE_API.getProfileDetails,
      bodyData: {
        draw: 1,
        start: 0,
        length: 10,
        search: { value: "", regex: true },
        order: [{ column: 0, dir: "asc" }],
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setUserDetails(response?.data?.data?.user_details || {});
      // updating user image at store
      dispatcLoginUserData({
        ...userData,
        image: response?.data?.data?.user_details?.image || "",
      });
      // window.alert(response?.data?.data?.user_details?.image )

      setTicketData(
        response?.data?.data?.ticket_details?.all_ticket?.map((val, i) => {
          return {
            id: `${i + 1}`.toString().padStart(2, "0"),
            subject: val.subject,
            date: val.created_at ? formatDateTime(val.created_at) : "No Date",
            ticket_id: val.ticket_id,
          };
        }) || []
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfileDetails();
  }, [isUpdateData]);

  const createContactSupportTicket = async (subject, request, resetForm) => {
    setIsCreateTicketBtnDisable(true);
    const response = await commonService({
      apiEndPoint: PROFILE_API.createContactSupportTicket,
      bodyData: { subject, request },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      showSuccessToast(response.data.message);
      setIsUpdateData((p) => !p);
      resetForm();
      setIsCreateTicketBtnDisable(false);
    } else {
      setIsCreateTicketBtnDisable(false);
    }
  };

  const updateCompanyName = async (companyName) => {
    setIsEditCompanytnDisable(true);
    const response = await commonService({
      apiEndPoint: PROFILE_API.updateCompanyName,
      bodyData: { companyName },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      showSuccessToast(response.data.message);
      editCompanyClose();
      setIsUpdateData((p) => !p);
      setIsEditCompanytnDisable(false);
    } else {
      setIsEditCompanytnDisable(false);
    }
  };

  const fetchContactSupportTicketDetails = async () => {
    setIsCurrentTicketLoader(true);
    const response = await commonService({
      apiEndPoint: PROFILE_API.getContactSupportTicketDetails,
      queryParams: { ticket_id: currenTicketId },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.data?.status) {
      setCurrentTicketData(response?.data?.data);
      setIsCurrentTicketLoader(false);
    } else {
      setIsCurrentTicketLoader(false);
    }
  };

  useEffect(() => {
    if (currenTicketId) fetchContactSupportTicketDetails();
  }, [currenTicketId]);

  // Handle file upload
  const handleFileUpload = async (file) => {
    setIsUploading(true);
    try {
      const response = await commonService({
        apiEndPoint: PROFILE_API.uploadProfileImage,
        bodyData: {
          file,
        },
        isFormData: true,
        headers: {
          Authorization: `Bearer ${userData?.apiToken}`,
          "Content-type": "FormData",
        },
      });

      if (response?.status) {
        showSuccessToast("Profile image updated successfully!");
        fetchProfileDetails(); // Refresh profile details
      } else {
        console.error("Failed to upload profile image");
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset the file input value to allow selecting the same file again
    event.target.value = null;
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* head title start */}
          <section className="commonHead">
            <h1 className="commonHead_title">Welcome Back!</h1>
            <Breadcrumb breadcrumb={breadcrumb} />
          </section>
          {/* head title end */}
          <div className="profilePage">
            <Card className="flex-row">
              <div className="card_leftbox align-items-center">
                <div className="profileImg position-relative">
                  {/* Image Element */}
                  <div
                    className="image-wrapper"
                    onClick={() =>
                      document.getElementById("file-input").click()
                    } // Trigger file input on image click
                    style={{ cursor: "pointer" }}
                  >
                    {isUploading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <ImageElement
                        previewSource={
                          userDetails?.image?.replace("com/storage","com/v1/storage") ||
                          "../../assets/admin-images/profile.png"
                        }
                        alt="profile"
                        className="img-fluid"
                      />
                    )}
                  </div>

                  {/* Hidden File Input */}
                  <InputField
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="file-input"
                    onChange={handleFileChange}
                    style={{ display: "none" }} // Hide the file input
                  />
                </div>
                <div className="info">
                  <h2>
                    {userDetails.first_name} {userDetails.last_name}
                  </h2>
                  <p className="mb-0">{userDetails.email_id}</p>
                </div>
              </div>
              <div className="card_rightbox d-flex align-items-center">
                <div className="profileImg">
                  <em className="icon-enterprise" />
                </div>
                <div className="info">
                  <h4 className="mb-0 fw-semibold">
                    {userDetails.company_master_name}
                    <Link to="#!" onClick={editCompanyShow}>
                      <em className="icon-edit" />
                    </Link>
                  </h4>
                </div>
              </div>
            </Card>
            <Card className="p-0 mt-3">
              <Tab.Container defaultActiveKey="contactSupport">
                <Nav variant="pills">
                  {/* <Nav.Item>
            <Nav.Link eventKey="timeline">Timeline</Nav.Link>
          </Nav.Item> */}
                  <Nav.Item>
                    <Nav.Link eventKey="contactSupport">
                      Contact Support
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="myRequests">My Requests</Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content>
                  {/* <Tab.Pane eventKey="timeline">
            <Timeline />
          </Tab.Pane> */}
                  <Tab.Pane eventKey="contactSupport">
                    <ContactSupport
                      userDetails={userDetails}
                      createContactSupportTicket={createContactSupportTicket}
                      isCreateTicketBtnDisable={isCreateTicketBtnDisable}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="myRequests">
                    <MyRequests
                      ticketData={ticketData}
                      setCurrentTicketId={setCurrentTicketId}
                      currentTicketData={currentTicketData}
                      isCurrentTicketLoader={isCurrentTicketLoader}
                      formatDateTime={formatDateTime}
                    />
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card>
          </div>
          {/* ediţ company modal */}
          <ModalComponent
            modalHeader="Edit Company Name"
            show={showEditCompany}
            onHandleCancel={editCompanyClose}
          >
            <Formik
              initialValues={{
                companyName: userDetails.company_master_name || "",
              }}
              validate={(values) => {
                const errors = {};
                if (!values.companyName) {
                  errors.companyName = "Company name is Required!";
                }

                return errors;
              }}
              onSubmit={(values) => {
                updateCompanyName(values.companyName);
              }}
            >
              {({
                values,
                errors,
                handleChange,
                handleBlur,
                handleSubmit,

                /* and other goodies */
              }) => (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="form-group">
                    <Form.Label>Company Name</Form.Label>
                    <InputField
                      placeholder="Company Name"
                      name="companyName"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.companyName}
                    />
                    {errors.companyName && (
                      <h6 className="invalid-feedback d-block">
                        {errors.companyName}
                      </h6>
                    )}
                  </Form.Group>
                  <div className="form-btn d-flex gap-2 justify-content-end">
                    <Button
                      variant="secondary"
                      className="ripple-effect"
                      onClick={editCompanyClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      className="ripple-effect"
                      type="submit"
                      disabled={isEditCompanyBtnDisable}
                    >
                      Update Company
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </ModalComponent>
        </>
      )}
    </>
  );
}
