import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { Accordion, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { commonService } from "services/common.service";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import toast from "react-hot-toast";
import {
  TextEditor,
  InputField,
  SelectField,
  ImageElement,
  SweetAlert,
} from "../../../../../../components";
import SurveyFAQModel from "../ModelComponent/surveyFAQForm";
import SurveyHelpContactModel from "../ModelComponent/surveyHelpContactForm";
import SearchAndAddModal from "../ModelComponent/SearchAndAddModal";
import {
  validationFAQ,
  validationHelpContact,
  validationParticipantSearchPopup,
} from "../validation";
import FaqFilterModal from "../ModelComponent/FaqFilterModal";
import ContactFilterModal from "../ModelComponent/ContactFilterModel";
import confetti from "canvas-confetti";
import { useWindowWidth } from "customHooks/useTable";

let faqIndex = 0;
let contactIndex = 0;

const ParticipationTools = (
  { confettiOptopn, startColorOptopn, activeTab, userData, companyID },
  ref
) => {
  const [formData, setFormData] = useState({
    partipation_introduction: "",
    faq: [],
    helpContent: [],
  });
  const [participationTool, setParticipationTool] = useState([]);

  const [showFaq, setshowFaq] = useState(false);
  const [showContact, setshowContact] = useState(false);
  const [buttonText, setbuttonText] = useState("");
  const [errors, setErrors] = useState({});

  const [survey, setSurvey] = useState([]);

  // search add introduction modal
  const [showSearch, setshowSearch] = useState(false);
  const searchClose = () => setshowSearch(false);
  const searchShow = () => setshowSearch(true);
  const width = useWindowWidth();
  const isSmallScreen = width < 768;
  // FAQ filter Modal
  const [showFaqFilter, setshowFaqFilter] = useState(false);

  // Contact model
  const [showContactFilter, setshowContactFilter] = useState(false);

  const [selectedFAQDetails, setSelectedFAQDetails] = useState({
    faqIndex: null,
    isDeleteModelOpen: false,
  });

  const [selectedContactDetails, setSelectedContactDetails] = useState({
    contactIndex: null,
    isDeleteModelOpen: false,
  });

  useEffect(() => {
    console.log("COMPNY ID IN PARTICIPATION TOOLS: ", companyID);
  }, [companyID]);

  const faqFilterOpen = () => setshowFaqFilter(true);

  const contactFilterOpen = () => setshowContactFilter(true);

  const fetchSurvey = async () => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.assessmentDropdown,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setSurvey(
        response?.data?.data?.surveyType?.map((item) => ({
          value: item?.libraryElementID,
          label: item?.value,
        })) || []
      );
    } else {
      console.log("error");
    }
  };

  const fetchProgressBar = async () => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.getProgressBar,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      if (Object.keys(response?.data?.progressBar).length > 0) {
        setParticipationTool([
          {
            confetti_serial_no: response?.data?.progressBar?.branchSerialNo,
            percentage: response?.data?.progressBar?.percentage,
            message: response?.data?.progressBar?.message,
            confetti: "none",
            time_in_sec: 1,
            fireworks: false,
            sound: false,
            star: false,
            star_color: "none",
          },
        ]);
      }
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    fetchProgressBar();
    fetchSurvey();
  }, []);

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "percentage":
        if (value < 0 || value > 100) {
          error = "Percentage must be between 0 and 100.";
        }
        break;
      case "message":
        if (!value.trim()) {
          error = "Message cannot be empty.";
        }
        break;
      case "confetti":
        if (!value) {
          error = "Confetti selection is required.";
        }
        break;
      case "time_in_sec":
        if (value <= 0) {
          error = "Duration must be greater than 0.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const validateParticipationToolFields = (participationToolData) => {
    let firstInvalidField = null;

    participationToolData.forEach((item, index) => {
      const fields = ["percentage", "message"]; // adjust if you validate more fields

      fields.forEach((field) => {
        const error = validateField(field, item[field]);
        if (error) {
          const key = `${index}-${field}`;
          setErrors((prevErrors) => ({
            ...prevErrors,
            [key]: error,
          }));

          // Capture the first invalid field
          if (!firstInvalidField) {
            firstInvalidField = `field-${index}-${field}`;
          }
        }
      });
    });

    return firstInvalidField; // return the first invalid field's ID (or null if none)
  };

  const colorNameToHex = (colorName) => {
    const colors = {
      golden: "#ffd700",
      red: "#ff0000",
      green: "#00ff00",
      blue: "#0000ff",
      purple: "#800080",
      none: "#ffcc00", // fallback color if "none" is selected
    };
    return colors[colorName.toLowerCase()] || "#ffcc00"; // default to golden-ish
  };

  const playSound = () => {
    const audio = new Audio("/assets/sounds/confetti-pop.mp3");
    audio.volume = 0.5; // Set volume to 50%
    audio.play().catch((error) => {
      console.log("Audio playback failed:", error);
    });
  };

  const fireConfetti = ({
    durationInSec = 2,
    star = false,
    sound = false,
    starColor = "#ffcc00",
    position = "center", // new param!
  }) => {
    const colorHex = colorNameToHex(starColor);
    const duration = durationInSec * 1000;
    const end = Date.now() + duration;

    // Play sound if enabled
    if (sound) {
      playSound();
    }

    const getXFromPosition = (pos) => {
      switch (pos) {
        case "left":
          return 0.2;
        case "right":
          return 0.8;
        case "center":
        default:
          return 0.5;
      }
    };

    const originX = getXFromPosition(position);

    const defaults = {
      origin: { x: originX, y: 0.7 },
      colors: [colorHex],
      shapes: star ? ["star"] : ["circle"],
    };

    (function frame() {
      confetti({
        ...defaults,
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: originX, y: 0.7 },
      });
      confetti({
        ...defaults,
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 - originX, y: 0.7 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleAddItem = () => {
    // Validate all fields before adding a new item
    const hasErrors = validateParticipationToolFields(participationTool);
    // Only add new item if no errors
    if (!hasErrors) {
      setParticipationTool((prevTool) => [
        ...prevTool,
        {
          confetti_serial_no: `${prevTool.length + 1}`,
          percentage: "0",
          message: "",
          confetti: "none",
          time_in_sec: 1,
          fireworks: false,
          sound: false,
          star: false,
          star_color: "none",
        },
      ]);
    }
  };

  const handleRemoveItem = (index) => {
    setParticipationTool(participationTool.filter((_, i) => i !== index));
  };

  const addfaqClose = () => {
    setbuttonText("");
    setshowFaq(false);
  };

  const addcontactShow = (text, index) => {
    contactIndex = index;
    setbuttonText(text);
    setshowContact(true);
  };

  const addContactClose = () => {
    setbuttonText("");
    setshowContact(false);
  };

  const faqShow = (text, index) => {
    faqIndex = index;
    setbuttonText(text);
    setshowFaq(true);
  };

  const handleContactSubmit = (data) => {
    if (buttonText === "Add Contact") {
      const FaqData = [
        ...formData.helpContent,
        {
          help_title: data?.help_title,
          help_description: data?.help_description,
        },
      ];
      setFormData((prevData) => ({
        ...prevData,
        helpContent: FaqData,
      }));
      setTimeout(() => {
        toast.success("Contact Added Successfully", { toastId: "scss003" });
      }, [1000]);
    } else {
      const updatedFaq = [...formData.helpContent];
      updatedFaq[contactIndex] = data;
      setFormData((prevData) => ({
        ...prevData,
        helpContent: updatedFaq,
      }));
      setTimeout(() => {
        toast.success("Contact Updated Successfully", { toastId: "scss003" });
      }, [1000]);
    }
  };

  const handleTextAditor = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFaqSubmit = (data) => {
    if (buttonText === "Add FAQ") {
      const FaqData = [
        ...formData.faq,
        {
          faq_title: data?.faq_title,
          faq_description: data?.faq_description,
        },
      ];
      setFormData((prevData) => ({
        ...prevData,
        faq: FaqData,
      }));
    } else {
      const updatedFaq = [...formData.faq];
      updatedFaq[faqIndex] = data;
      setFormData((prevData) => ({
        ...prevData,
        faq: updatedFaq,
      }));
    }
  };

  const deleteFaq = (index) => {
    setFormData((prevFormData) => {
      const updatedFaq = prevFormData.faq.filter((_, idx) => idx !== index);
      return {
        ...prevFormData,
        faq: updatedFaq,
      };
    });
    setSelectedFAQDetails({
      faqIndex: null,
      isDeleteModelOpen: false,
    });

    return true;
  };

  const deleteContact = (index) => {
    setFormData((prevFormData) => {
      const updatedContent = prevFormData.helpContent.filter(
        (_, idx) => idx !== index
      );
      return {
        ...prevFormData,
        helpContent: updatedContent,
      };
    });
    setSelectedContactDetails({
      contactIndex: null,
      isDeleteModelOpen: false,
    });

    return true;
  };

  const handleFieldChange = (index, field, value) => {
    // Validate the field on change
    const error = validateField(field, value);

    // Update the error state
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`${index}-${field}`]: error, // Storing error messages per field for each index
    }));

    // Update the participationTool state
    setParticipationTool((prevTool) => {
      const updatedTool = [...prevTool];
      updatedTool[index][field] = value;
      return updatedTool;
    });
  };

  const handleSubmit = () => {
    const firstInvalidFieldId =
      validateParticipationToolFields(participationTool);

    if (firstInvalidFieldId) {
      const el = document.getElementById(firstInvalidFieldId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      toast.dismiss();
      toast.error("Please enter all the required things to continue");

      return { data: null, isValid: false };
    }

    return {
      data: { ...formData, participationTool },
      isValid: true,
    };
  };

  const handleFaqDefaultSetting = async () => {
    faqFilterOpen();
  };

  const handleContactDefaultSettingPopup = async () => {
    contactFilterOpen();
  };

  const checkFaqById = (dataArray, faqIDToCheck) => {
    return dataArray.some((item) => item.faqID === faqIDToCheck);
  };

  const checkContactById = (dataArray, faqIDToCheck) => {
    return dataArray.some((item) => item.contactID === faqIDToCheck);
  };

  const handleAddFaq = (tempData) => {
    let FaqData = [...formData.faq];
    for (let itrate of tempData) {
      let oneRow = {
        faq_title: itrate?.filterhead,
        faq_description: itrate?.filterpara,
        faqID: itrate?.faqID,
      };

      if (!checkFaqById(formData.faq, itrate?.faqID) && itrate?.checkboxData) {
        FaqData.push(oneRow);
      } else if (!itrate?.checkboxData) {
        // eslint-disable-next-line eqeqeq
        FaqData = FaqData.filter((item) => item.faqID != itrate?.faqID);
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      faq: FaqData,
    }));
    setTimeout(() => {
      toast.success("FAQ Added Successfully", { toastId: "scss003" });
    }, [1000]);
  };

  const handleAddContact = (tempData) => {
    let FaqData = [...formData.helpContent];
    for (let itrate of tempData) {
      let oneRow = {
        help_title: itrate?.filterhead,
        help_description: itrate?.filterpara,
        contactID: itrate?.faqID,
      };

      if (
        !checkContactById(formData.helpContent, itrate?.faqID) &&
        itrate?.checkboxData
      ) {
        FaqData.push(oneRow);
      } else if (!itrate?.checkboxData) {
        // eslint-disable-next-line eqeqeq
        FaqData = FaqData.filter((item) => item.contactID != itrate?.faqID);
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      helpContent: FaqData,
    }));
    setTimeout(() => {
      toast.success("Contact Added Successfully", { toastId: "scss003" });
    }, [1000]);
  };

  const handleAddIntro = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      partipation_introduction: value,
    }));
  };

  // Forward the ref and expose handleSubmit
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  // Button Text for Edit Contact Modal
  const dynamicButtonText =
    buttonText === "Edit Contact" ? "Update Contact" : buttonText;

  // Button Text for Edit FAQ Modal
  const dynamicFaqText = buttonText === "Edit FAQ" ? "Update FAQ" : buttonText;

  const renderProgressBar = () => {
    return (
      <>
        {participationTool.map((item, index) => (
          <span className=" w-100" key={index}>
            <span className="d-flex align-items-start">
              <span style={{ width: "70px", minWidth: "70px" }} className="pe-2 fw-bold">Stage</span>
              <span style={{ width: "150px", minWidth: "150px" }} className="pe-2 fw-bold">
                % complete
              </span>
              <span style={{ minWidth: "200px" }} className="flex-grow-1 pe-2 fw-bold">
                Message
              </span>
              <span style={{ width: "150px", minWidth: "150px" }} className="pe-2 fw-bold">
                Confetti
              </span>
              <span
                style={{
                  width: "150px",
                  minWidth: "150px",
                  justifyContent: "flex-start",
                  paddingLeft: "20px",
                }}
                className="pe-2 fw-bold"
              >
                Action
              </span>
            </span>
            <span className="d-flex align-items-start">
              {/* Stage Input */}
              <span style={{ width: "70px", minWidth: "70px" }} className="pe-2">
                <div className="d-flex align-items-start">
                  <Form.Group className="form-group w-100">
                    <InputField
                      type="text"
                      placeholder="Report"
                      name={`participationTool[${index}].confetti_serial_no`}
                      value={index + 1}
                      readOnly
                    />
                  </Form.Group>
                </div>
              </span>
              {/* Percentage Input */}
              <span style={{ width: "150px", minWidth: "150px" }} className="pe-2">
                <div className="d-flex align-items-start">
                  <Form.Group className="form-group w-100">
                    <InputField
                      type="number"
                      name={`participationTool[${index}].percentage`}
                      id={`field-${index}-percentage`}
                      value={item.percentage || ""}
                      onChange={(e) =>
                        handleFieldChange(index, "percentage", e.target.value)
                      }
                    />
                    {/* Show error message for percentage */}
                    {errors[`${index}-percentage`] && (
                      <div className="error mt-1 text-danger">
                        {errors[`${index}-percentage`]}
                      </div>
                    )}
                  </Form.Group>
                </div>
              </span>
              <span style={{ minWidth: "200px" }} className="flex-grow-1 pe-2">
                {/* Message Input */}
                <div className="d-flex align-items-start">
                  <Form.Group className="form-group w-100">
                    <InputField
                      type="text"
                      placeholder="You're half way there!"
                      id={`field-${index}-message`}
                      name={`participationTool[${index}].message`}
                      value={item.message || ""}
                      onChange={(e) =>
                        handleFieldChange(index, "message", e.target.value)
                      }
                    />
                    {/* Show error message for message */}
                    {errors[`${index}-message`] && (
                      <div className="error mt-1 text-danger">
                        {errors[`${index}-message`]}
                      </div>
                    )}
                  </Form.Group>
                </div>
              </span>

              <span
                style={{ width: "150px", minWidth: "150px" }}
                className="pe-2"
              >
                <div className="d-flex align-items-start w-100">
                  <Form.Group className="form-group w-100">
                    <SelectField
                      options={confettiOptopn}
                      name={`participationTool[${index}].confetti`}
                      onChange={(selected) =>
                        handleFieldChange(index, "confetti", selected?.value)
                      }
                      value={confettiOptopn.find(
                        ({ value }) =>
                          String(value) ===
                          String(participationTool[index].confetti)
                      )}
                    />
                  </Form.Group>
                </div>
              </span>

              <span
                style={{
                  width: "150px",
                  minWidth: "150px",
                }}
                className="px-2"
              >
                <div className="addeletebtn d-flex gap-2 justify-content-start mb-3">
                  <Link
                    className="addbtn addprogress"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddItem(index);
                    }}
                  >
                    <span>+</span>
                  </Link>
                  {index !== 0 && participationTool.length > 1 && (
                    <Link
                      className="btn btn-danger"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveItem(index);
                      }}
                    >
                      -
                    </Link>
                  )}
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip-disabled"> Preview Confetti</Tooltip>
                    }
                  >
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        fireConfetti({
                          durationInSec:
                            participationTool[index]?.time_in_sec || 2,
                          star: participationTool[index]?.star,
                          sound: participationTool[index]?.sound,
                          starColor:
                            startColorOptopn.find(
                              ({ value }) =>
                                value === participationTool[index]?.star_color
                            )?.value || "#ffcc00",
                          position:
                            participationTool[index]?.confetti || "center", // 💥 This line does the magic!
                        });
                      }}
                      className="confettibtn"
                    >
                      <span>
                        <ImageElement
                          src="/assets/admin-images/fireworks.png"
                          alt="fireworks"
                        />
                      </span>
                    </Link>
                  </OverlayTrigger>
                </div>
              </span>
            </span>
          </span>
        ))}
      </>
    );
  };

  return (
    <div className="pageTitle">
      <h2>Participation Tools</h2>
      <div className="generalsetting_inner d-block">
        <Accordion alwaysOpen={activeTab === "toolsTab"}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Introduction</Accordion.Header>
            <Accordion.Body>
              {/* Link to search and add from resource */}
              <div className="d-flex justify-content-end mb-md-3 mb-2">
                <Link
                  className="link-primary d-flex align-items-center lh-1"
                  onClick={searchShow}
                >
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip-disabled">
                        Copy From Resource Email Templates
                      </Tooltip>
                    }
                  >
                    <span className="d-flex align-items-center">
                      <em
                        disabled
                        style={{ pointerEvents: "none" }}
                        className="icon-info-circle me-1"
                      />
                    </span>
                  </OverlayTrigger>
                  Search and Add from Resource
                </Link>
              </div>

              {/* TextEditor for Introduction */}
              <Form.Group className="form-group mb-3">
                <TextEditor
                  value={formData.partipation_introduction}
                  onChange={(value) =>
                    handleTextAditor("partipation_introduction", value)
                  }
                />
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>FAQ</Accordion.Header>
            <Accordion.Body>
              <div className="d-flex justify-content-between flex-wrap mb-md-3 mb-2">
                <Link
                  className="link-primary"
                  onClick={handleFaqDefaultSetting}
                >
                  Copy Default Settings
                </Link>
                <Link
                  href="#!"
                  className="link-primary"
                  onClick={() => faqShow("Add FAQ")}
                >
                  Add New FAQ
                </Link>
              </div>
              <Accordion className="innerAccordion">
                {formData?.faq?.length > 0 &&
                  formData?.faq?.map((data, index) => {
                    return (
                      <Accordion.Item eventKey={index} key={index}>
                        <Accordion.Header>
                          <span className="d-flex flex-1 me-2">
                            {data?.faq_title}
                          </span>
                          <span className="d-flex gap-2 lh-1">
                            <Link onClick={() => faqShow("Edit FAQ", index)}>
                              <em className="icon-edit" />
                            </Link>
                            <Link
                              onClick={() => {
                                setSelectedFAQDetails((prev) => ({
                                  ...prev,
                                  faqIndex: index,
                                  isDeleteModelOpen: true,
                                }));
                              }}
                            >
                              <em className="icon-delete" />
                            </Link>
                          </span>
                        </Accordion.Header>
                        <Accordion.Body>
                          {/* {data?.faq_description} */}
                          <div
                            style={{
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                            }}
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{
                              __html: data?.faq_description?.replace(
                                /\n/g,
                                "<br />"
                              ),
                            }}
                          />
                        </Accordion.Body>
                      </Accordion.Item>
                    );
                  })}
              </Accordion>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Help Contact</Accordion.Header>
            <Accordion.Body>
              <div className="d-flex justify-content-between flex-wrap mb-md-3 mb-2">
                <Link
                  className="link-primary"
                  onClick={handleContactDefaultSettingPopup}
                >
                  Copy Default Settings
                </Link>
                <Link
                  href="#!"
                  className="link-primary"
                  onClick={() => addcontactShow("Add Contact")}
                >
                  Add New Help Contact
                </Link>
              </div>

              <Accordion className="innerAccordion">
                {formData?.helpContent?.length > 0 &&
                  formData?.helpContent?.map((data, index) => {
                    return (
                      <Accordion.Item eventKey={index} key={index}>
                        <Accordion.Header>
                          <span className="d-flex flex-1 me-2">
                            {data?.help_title}
                          </span>
                          <span className="d-flex gap-2 lh-1">
                            <Link
                              onClick={() =>
                                addcontactShow("Edit Contact", index)
                              }
                            >
                              <em className="icon-edit" />
                            </Link>
                            <Link
                              onClick={() => {
                                setSelectedContactDetails((prev) => ({
                                  ...prev,
                                  contactIndex: index,
                                  isDeleteModelOpen: true,
                                }));
                              }}
                            >
                              <em className="icon-delete" />
                            </Link>
                          </span>
                        </Accordion.Header>
                        <Accordion.Body>
                          <div
                            style={{
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                            }}
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{
                              __html: data?.help_description,
                            }}
                          />
                        </Accordion.Body>
                      </Accordion.Item>
                    );
                  })}
              </Accordion>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Header> Progress bar </Accordion.Header>
            <Accordion.Body>
              {isSmallScreen ? (
                <div style={{ width: "100%", overflow: "auto" }}>
                  {renderProgressBar()}
                </div>
              ) : (
                <span>{renderProgressBar()}</span>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

      {/* Add FAQ modal */}
      <SurveyFAQModel
        modalHeader={buttonText}
        show={showFaq}
        onHandleCancel={addfaqClose}
        buttonText={dynamicFaqText}
        initialData={{
          faq_title: formData?.faq[faqIndex]?.faq_title
            ? formData?.faq[faqIndex]?.faq_title
            : "",
          faq_description: formData?.faq[faqIndex]?.faq_description
            ? formData?.faq[faqIndex]?.faq_description
            : "",
        }}
        validationFAQ={validationFAQ()}
        handleFaqSubmit={handleFaqSubmit}
      />

      {/* Add contact modal */}
      <SurveyHelpContactModel
        modalHeader={buttonText}
        show={showContact}
        onHandleCancel={addContactClose}
        buttonText={dynamicButtonText}
        initialData={{
          help_title: formData?.helpContent[contactIndex]?.help_title
            ? formData?.helpContent[contactIndex]?.help_title
            : "",
          help_description: formData?.helpContent[contactIndex]
            ?.help_description
            ? formData?.helpContent[contactIndex]?.help_description
            : "",
        }}
        validationFAQ={validationHelpContact()}
        handleFaqSubmit={handleContactSubmit}
      />

      <SearchAndAddModal
        show={showSearch}
        onClose={searchClose}
        survey={survey}
        initialData={{
          surveyType: "",
          keywords: "",
        }}
        userData={userData}
        handleAddIntro={handleAddIntro}
        companyID={companyID}
        validation={validationParticipantSearchPopup()}
      />

      <FaqFilterModal
        showFaqFilter={showFaqFilter}
        handleAddFaq={handleAddFaq}
        companyID={companyID}
        userData={userData}
        setshowFaqFilter={setshowFaqFilter}
        faqFormData={formData.faq}
      />

      {/* Contact Default */}
      <ContactFilterModal
        showFaqFilter={showContactFilter}
        handleAddFaq={handleAddContact}
        companyID={companyID}
        userData={userData}
        setshowFaqFilter={setshowContactFilter}
        faqFormData={formData.helpContent}
      />

      <SweetAlert
        title="Are you sure?"
        text="You want to delete this FAQ!"
        show={selectedFAQDetails.isDeleteModelOpen}
        icon="warning"
        onConfirmAlert={() => deleteFaq(selectedFAQDetails.faqIndex)}
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={() => {
          setSelectedFAQDetails((prev) => ({
            ...prev,
            faqIndex: null,
            isDeleteModelOpen: false,
          }));
        }}
        isConfirmedTitle="Deleted!"
        isConfirmedText="FAQ has been deleted."
      />

      <SweetAlert
        title="Are you sure?"
        text="You want to delete this Contact!"
        show={selectedContactDetails.isDeleteModelOpen}
        icon="warning"
        onConfirmAlert={() =>
          deleteContact(selectedContactDetails.contactIndex)
        }
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={() => {
          setSelectedContactDetails((prev) => ({
            ...prev,
            contactIndex: null,
            isDeleteModelOpen: false,
          }));
        }}
        isConfirmedTitle="Deleted!"
        isConfirmedText="Contact has been deleted."
      />
    </div>
  );
};

export default forwardRef(ParticipationTools);
