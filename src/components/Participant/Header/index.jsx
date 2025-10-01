/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import { Link, useResolvedPath, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Dropdown, Form, Modal, Offcanvas } from "react-bootstrap";
import Fade from "react-bootstrap/Fade";
import { useAuth } from "customHooks";
import ImageElement from "../../ImageElement";
import InputField from "../../Input";
import { ModalComponent } from "../..";
import participantRouteMap from "../../../routes/Participant/participantRouteMap";
import adminRouteMap from "../../../routes/Admin/adminRouteMap";
import { USER_LOGO } from "config";
import { COMPANY_LOGO } from "config";
import { PARTICIPANT_IMAGE_URL } from "config";
import { ContactUs, Faq } from "pages";

function Header() {
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 991);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const navigate = useNavigate();
  const [showChangePass, setShowChangePass] = useState(false);
  const changepassClose = () => setShowChangePass(false);
  const changepassShow = () => setShowChangePass(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const [searchParams] = useSearchParams();
  const assessmentID = searchParams.get("assessment");

  const [showSuccessFull, setShowSuccessFull] = useState(false);
  const successFullClose = () => setShowSuccessFull(false);
  const successFullShow = () => {
    setShowSuccessFull(true);
    changepassClose();
  };

  const [open, setOpen] = useState(false);
  const [isCanvas, setIsCanvas] = useState({});
  const handleCanvasClose = () => setIsCanvas({});
  const handleCanvasShow = (val) => setIsCanvas({ type: val.type, status: val.status });

  const { pathname } = useResolvedPath();
  const handleLogout = () => {
    localStorage.clear();
    navigate(adminRouteMap.LOGIN.path);
  };

  const getIconClass = (menuName) => {
    switch (menuName.toLowerCase()) {
      case "progress dashboard":
        return "dashboard";
      case "faq":
        return "question-circle";
      case "contact":
        return "mail";
      default:
        return "dashboard"; // fallback icon
    }
  };

  const getMenuPreferenceIconClass = (menuName) => {
    switch (menuName.toLowerCase()) {
      case "change password":
        return "lock";
      case "faq":
        return "question-circle";
      default:
        return "dashboard"; // fallback
    }
  };

  const handleMenuAction = (menu) => {
    if (["/participant/faq", "/participant/contact"].includes(menu.menuPath)) {
      handleCanvasShow({ type: menu.menuName, status: true });
    } else {
      navigate(menu.menuPath);
    }
  };

  const handleToggleMenu = (path) => {
    if (path === "/participant/change-password") {
      changepassShow();
    } else {
      navigate(path);
    }
  };

  console.log(userData, "userData");

  return (
    <>
      <header className="header">
        <div className="container">
          <nav className="navbar navbar-expand-lg">
            <Link className="navbar-brand" to={participantRouteMap.STARTSURVEY.path}>
              {/* <ImageElement imageFor="participant" source="logo.svg" className="img-fluid" alt="metolius-logo" /> */}
              <ImageElement
                previewSource={
                  userData?.companyConfig?.logo
                    ? `${COMPANY_LOGO}/${userData.companyConfig.logo}`
                    : `${PARTICIPANT_IMAGE_URL}/logo.svg`
                }
                styling={{ width: "100%" }}
              />
            </Link>

            {userData?.menu?.length > 0 && (
              <Fade in={open}>
                <div className="collapse navbar-collapse justify-content-center " id="example-fade-text">
                  <ul className="navbar-nav">
                    {userData?.menu?.map((item, index) => (
                      <li className={`nav-item ${index === 0 ? "ms-0" : ""}`} key={item.menuID}>
                        <span
                          style={{ cursor: "pointer" }}
                          // to={
                          //   assessmentID && item.menuPath !== "/participant/survey-dashboard"
                          //     ? `${item.menuPath}?assessment=${assessmentID}`
                          //     : item.menuPath
                          // }
                          className={`nav-link p-lg-0 ${pathname === item.menuPath ? "active" : ""}`}
                          onClick={() => handleMenuAction(item)}
                        >
                          <em className={`icon-${getIconClass(item.menuName)}`} /> {item.menuName}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Fade>
            )}

            <div className="d-flex actionBtn align-items-center ms-auto">
              {userData?.isAnonymous ? (
                <div className="d-flex align-items-center">
                  <span className="me-2">
                    <ImageElement
                      styling={{ width: "44px", height: "44px", objectFit: " cover" }}
                      previewSource={
                        userData?.companyConfig?.user_icon
                          ? `${USER_LOGO}/${userData?.companyConfig?.user_icon}`
                          : `${PARTICIPANT_IMAGE_URL}/user-profile.png`
                      }
                    />
                  </span>
                  <p className="mb-0 text-capitalize">{userData.aliasName}</p>
                </div>
              ) : (
                <Dropdown>
                  <Dropdown.Toggle as="button" className="btn d-flex align-items-center">
                    <span>
                      <ImageElement
                        previewSource={
                          userData?.companyConfig?.user_icon
                            ? `${USER_LOGO}/${userData?.companyConfig?.user_icon}`
                            : `${PARTICIPANT_IMAGE_URL}/user-profile.png`
                        }
                      />
                    </span>
                    <p className="mb-0 text-capitalize">{userData.aliasName}</p>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {userData?.menuPreference?.length > 0 &&
                      userData?.menuPreference.map((item) => (
                        <Dropdown.Item key={item.menuID} href="#!" onClick={() => handleToggleMenu(item.menuPath)}>
                          <em className={`icon-${getMenuPreferenceIconClass(item.menuName)}`} />
                          {item.menuName}
                        </Dropdown.Item>
                      ))}
                    {/* 
                  {userData?.isAnonymous && (
                    <Dropdown.Item href="#!" onClick={handleFaq}>
                      <em className="icon-question-circle" /> Faq's
                    </Dropdown.Item>
                  )} */}

                    <Dropdown.Item href={adminRouteMap.LOGIN.path} onClick={handleLogout}>
                      <em className="icon-logout" />
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </div>

            <Link
              className="navbar-toggler border-0 p-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#toggle"
              aria-label="Toggle navigation"
              onClick={() => setOpen(!open)}
              aria-controls="navbarSupportedContent"
              aria-expanded={open}
            >
              <span className="navbar-toggler-icon" />
              <span className="navbar-toggler-icon" />
              <span className="navbar-toggler-icon" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Change Password Modal Start */}
      <ModalComponent modalHeader="Change Password" show={showChangePass} onHandleCancel={changepassClose}>
        <Form>
          <Form.Group className="form-group">
            <Form.Label>
              Current Password<sup>*</sup>
            </Form.Label>
            <InputField
              type="text"
              placeholder="Current Password"
              //  defaultValue="Current Password"
            />
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>
              New Password<sup>*</sup>
            </Form.Label>
            <InputField
              type="text"
              placeholder="New Password"
              // defaultValue="New Password"
            />
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>
              Confirm Password<sup>*</sup>
            </Form.Label>
            <InputField
              type="text"
              placeholder="Confirm Password"
              // defaultValue="Confirm Password"
            />
          </Form.Group>

          <div className="form-btn d-flex gap-2 justify-content-end">
            <Button variant="secondary" className="ripple-effect btn-sm" onClick={changepassClose}>
              Cancel
            </Button>
            <Button variant="primary" className="ripple-effect btn-sm" onClick={successFullShow}>
              Submit
            </Button>
          </div>
        </Form>
      </ModalComponent>
      {/* Change Password Modal End */}

      {/* Completed Successfully Modal Start */}
      <ModalComponent className="commonModal" show={showSuccessFull} onHandleCancel={successFullClose} centered>
        <Modal.Body className="text-center pt-0">
          <em className="successfully icon-check-circle" />
          <h3>
            Survey Completed <br className="d-none d-lg-block" /> Successfully
          </h3>
          <Button variant="primary" className="ripple-effect btn-sm mx-auto mb-lg-3" onClick={successFullClose}>
            Okay
          </Button>
        </Modal.Body>
      </ModalComponent>
      {/* Completed Successfully Modal End */}

      <Offcanvas
        show={isCanvas?.status || false}
        onHide={handleCanvasClose}
        placement="end"
        style={{ width: isMobile ? "100%" : "50%" }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {
              <h3 className="mb-1">
                <span style={{ color: "#0968ac" }}>
                  {isCanvas?.type === "FAQ" ? `FAQ's` : isCanvas?.type === "Contact" ? "Contact Us" : ""}
                </span>
              </h3>
            }
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {isCanvas?.type === "FAQ" ? <Faq initialCallParticipant={isCanvas?.status || false} /> : ""}
          {isCanvas?.type === "Contact" ? <ContactUs initialCallParticipant={isCanvas?.status || false} /> : ""}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Header;
