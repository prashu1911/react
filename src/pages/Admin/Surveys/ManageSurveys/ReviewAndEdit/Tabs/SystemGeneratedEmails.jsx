/* eslint-disable react/no-unescaped-entities */
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import {
  Accordion,
  Form,
  OverlayTrigger,
  Tooltip,
  Row,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { commonService } from "services/common.service";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { useTable } from "customHooks/useTable";
import { htmlToPlainText } from "utils/common.util";
import {
  InputField,
  TextEditor,
  SelectField,
  Button,
  ModalComponent,
  ReactDataTable,
} from "../../../../../../components";
import toast from "react-hot-toast";
import { getAccordianString } from "../../constants/util";

const emailDropdownData = [
  { value: "Pre-Start", label: "PreStart" },
  { value: "Assign", label: "Assign" },
  { value: "Reminder", label: "Reminder" },
  { value: "Thank You", label: "ThankYou" },
];

const SystemGeneratedEmails = ({ userData, companyID, reviewData }, ref) => {
  const [formData, setFormData] = useState({
    pre_start_email_subject: "",
    pre_start_email_header: "",
    pre_start_email_content: "",
    assign_email_subject_line: "",
    assign_email_header_graphic: "",
    assign_email_pre_credential_content: "",
    assign_email_post_credential_content: "",
    reminder_email_subject_line: "",
    reminder_email_header_graphic: "",
    reminder_email_content: "",
    thank_you_email_subject_line: "",
    thank_you_email_header_graphic: "",
    thank_you_email_content: "",
    email_footer: "",
  });

  const [searchValue] = useState("");
  const [tableFilters] = useState({});

  const [tableData, setTableData] = useState([]);
  const [tempSubject, setTempSubject] = useState("");
  const [tempcontent, setTempcontent] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearching, setSearching] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // email modal
  const [showEmail, setShowEmail] = useState(false);
  const [emailType, setEmailType] = useState("");
  const emailClose = () => {
    setEmailType("");
    setShowEmail(false);
    setTableData([]);
    setTempSubject("");
    setTempcontent("");
    setSearching(false);
  };
  const emailShow = (type) => {
    setEmailType(type);
    setShowEmail(true);
  };

  // Initialize the checkedItems state based on unassignModalData
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    if (reviewData?.survey_email && reviewData?.survey_email.length > 0) {
      for (let iteratedData of reviewData?.survey_email) {
        if (iteratedData?.mailType === "PreStart") {
          setFormData((prevData) => ({
            ...prevData,
            pre_start_email_subject: htmlToPlainText(
              iteratedData?.emailPreStartSubject
            ),
            pre_start_email_header: htmlToPlainText(
              iteratedData?.emailPreStartHeader
            ),
            pre_start_email_content: htmlToPlainText(
              iteratedData?.emailPreStartContent
            ),
          }));
        } else if (iteratedData?.mailType === "Assign") {
          setFormData((prevData) => ({
            ...prevData,
            assign_email_subject_line: htmlToPlainText(
              iteratedData?.emailAssignSubject
            ),
            assign_email_header_graphic: htmlToPlainText(
              iteratedData?.emailAssignHeader
            ),
            assign_email_pre_credential_content: htmlToPlainText(
              iteratedData?.emailAssignPreContent
            ),
            assign_email_post_credential_content: htmlToPlainText(
              iteratedData?.emailAssignPostContent
            ),
          }));
        } else if (iteratedData?.mailType === "Reminder") {
          setFormData((prevData) => ({
            ...prevData,
            reminder_email_subject_line: htmlToPlainText(
              iteratedData?.emailReminderSubject
            ),
            reminder_email_header_graphic: htmlToPlainText(
              iteratedData?.emailReminderHeader
            ),
            reminder_email_content: htmlToPlainText(
              iteratedData?.emailReminderContent
            ),
          }));
        } else if (iteratedData?.mailType === "ThankYou") {
          setFormData((prevData) => ({
            ...prevData,
            thank_you_email_subject_line: htmlToPlainText(
              iteratedData?.emailThankYouSubject
            ),
            thank_you_email_header_graphic: htmlToPlainText(
              iteratedData?.emailThankYouHeader
            ),
            thank_you_email_content: htmlToPlainText(
              iteratedData?.emailThankYouContent
            ),
          }));
        } else if (iteratedData.mailType === "Footer") {
          setFormData((prevData) => ({
            ...prevData,
            email_footer: htmlToPlainText(iteratedData?.emailFooter),
          }));
        }
      }
    }
  }, []);

  // Handler to update the form data
  const handleChangeReport = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  const handleTextAditor = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const errors = {};
    let isValid = true;
    let firstErrorFieldId = null;

    // Assign Email validation
    if (!formData.assign_email_subject_line?.trim()) {
      errors.assign_email_subject_line = "Assign email subject is required.";
      if (!firstErrorFieldId)
        firstErrorFieldId = "assign_email_subject_line_field";
      isValid = false;
    }
    if (!formData.assign_email_pre_credential_content?.trim()) {
      errors.assign_email_pre_credential_content =
        "Assign email pre-credential content is required.";
      if (!firstErrorFieldId)
        firstErrorFieldId = "assign_email_pre_credential_content_field";
      isValid = false;
    }
    if (!formData.assign_email_post_credential_content?.trim()) {
      errors.assign_email_post_credential_content =
        "Assign email post-credential content is required.";
      if (!firstErrorFieldId)
        firstErrorFieldId = "assign_email_post_credential_content_field";
      isValid = false;
    }

    // Reminder Email validation
    if (!formData.reminder_email_subject_line?.trim()) {
      errors.reminder_email_subject_line =
        "Reminder email subject is required.";
      if (!firstErrorFieldId)
        firstErrorFieldId = "reminder_email_subject_line_field";
      isValid = false;
    }
    if (!formData.reminder_email_content?.trim()) {
      errors.reminder_email_content = "Reminder email content is required.";
      if (!firstErrorFieldId)
        firstErrorFieldId = "reminder_email_content_field";
      isValid = false;
    }

    // Thank You Email validation
    if (!formData.thank_you_email_subject_line?.trim()) {
      errors.thank_you_email_subject_line =
        "Thank you email subject is required.";
      if (!firstErrorFieldId)
        firstErrorFieldId = "thank_you_email_subject_line_field";
      isValid = false;
    }
    if (!formData.thank_you_email_content?.trim()) {
      errors.thank_you_email_content = "Thank you email content is required.";
      if (!firstErrorFieldId)
        firstErrorFieldId = "thank_you_email_content_field";
      isValid = false;
    }

    if (formData.pre_start_email_subject || formData.pre_start_email_content) {
      if (!formData.pre_start_email_subject?.trim()) {
        errors.pre_start_email_subject = "Pre Start Email Subject is required.";
        if (!firstErrorFieldId)
          firstErrorFieldId = "pre_start_email_subject_field";
        isValid = false;
      }

      if (!formData.pre_start_email_content?.trim()) {
        errors.pre_start_email_content = "Pre Start Email Content is required.";
        if (!firstErrorFieldId)
          firstErrorFieldId = "pre_start_email_content_field";
        isValid = false;
      }
    }

    setFormErrors(errors);

    // Scroll to the first error field if there are any errors
    if (!isValid && firstErrorFieldId) {
      toast.dismiss(); // Dismiss all active toasts
      toast.error("Please enter all the required things to continue");
      // First ensure the DOM has updated with the error messages
      // requestAnimationFrame(() => {
      //   setTimeout(() => {
      //     const errorElement = document.getElementById(firstErrorFieldId);
      //     console.log(errorElement, "errorElement");
      //     if (errorElement) {
      //       // Find the parent Accordion.Item
      //       const accordionItem = errorElement.closest(".accordion-item");
      //       if (accordionItem) {
      //         // Expand the accordion if it's collapsed
      //         const accordionButton =
      //           accordionItem.querySelector(".accordion-button");
      //         if (
      //           accordionButton &&
      //           accordionButton.getAttribute("aria-expanded") === "false"
      //         ) {
      //           accordionButton.click();
      //           // Wait for the accordion to expand before scrolling
      //           setTimeout(() => {
      //             requestAnimationFrame(() => {
      //               // First scroll to the accordion item
      //               accordionItem.scrollIntoView({
      //                 behavior: "smooth",
      //                 block: "center",
      //               });
      //               // Then scroll to the specific field
      //               setTimeout(() => {
      //                 errorElement.scrollIntoView({
      //                   behavior: "smooth",
      //                   block: "center",
      //                 });
      //                 errorElement.focus();
      //               }, 100);
      //             });
      //           }, 300);
      //         } else {
      //           // If accordion is already expanded, scroll immediately
      //           requestAnimationFrame(() => {
      //             // First scroll to the accordion item
      //             accordionItem.scrollIntoView({
      //               behavior: "smooth",
      //               block: "center",
      //             });
      //             // Then scroll to the specific field
      //             setTimeout(() => {
      //               errorElement.scrollIntoView({
      //                 behavior: "smooth",
      //                 block: "center",
      //               });
      //               errorElement.focus();
      //             }, 100);
      //           });
      //         }
      //       } else {
      //         // If no accordion item found, just scroll to the error element
      //         requestAnimationFrame(() => {
      //           errorElement.scrollIntoView({
      //             behavior: "smooth",
      //             block: "center",
      //           });
      //           errorElement.focus();
      //         });
      //       }
      //     }
      //   }, 0);

      // });
      const accName = getAccordianString(firstErrorFieldId);
      const accElement = document.getElementById(accName);

      const accordionButton = accElement.querySelector(".accordion-button");
      accordionButton.click();
      const errorElement = document.getElementById(firstErrorFieldId);

      if (accElement) {
        setTimeout(() => {
          requestAnimationFrame(() => {
            // First scroll to the accordion item
            accElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            if (errorElement) {
              // Then scroll to the specific field
              setTimeout(() => {
                errorElement.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
                errorElement.focus();
              }, 500);
            }
          });
        }, 300);
      } else if (errorElement) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            errorElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            errorElement.focus();
          }, 500);
        }, 0);
      }
    }

    return {
      data: formData,
      isValid,
      errors,
      firstErrorFieldId,
    };
  };

  // This hook is not usefull when we handle search,filter,pagination from api.
  const {
    currentData,
    totalRecords,
    totalPages,
    offset,
    limit,
    sortState,
    setOffset,
    setLimit,
    handleSort,
  } = useTable({
    searchValue,
    searchKeys: [],
    tableFilters,
    initialLimit: 10,
    data: tableData,
  });

  const handleLimitChange = (value) => {
    setLimit(value);
    setOffset(1);
  };

  const handleOffsetChange = (value) => {
    setOffset(value);
  };

  // Forward the ref and expose handleSubmit
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const handleCopyComment = async (type) => {
    setShowLoader(true);
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.getCopyComment,
      queryParams: { companyID, emailType: type },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setShowLoader(false);
      if (type === "PreStart") {
        setFormData((prevData) => ({
          ...prevData,
          pre_start_email_subject:
            response?.data?.data[0]?.emailPreStartSubject,
          pre_start_email_header: response?.data?.data[0]?.emailPreStartHeader,
          pre_start_email_content:
            response?.data?.data[0]?.emailPreStartContent,
        }));
      }

      if (type === "Assign") {
        setFormData((prevData) => ({
          ...prevData,
          assign_email_subject_line:
            response?.data?.data[0]?.emailAssignSubject,
          assign_email_header_graphic:
            response?.data?.data[0]?.emailAssignHeader,
          assign_email_pre_credential_content:
            response?.data?.data[0]?.emailAssignPreContent,
          assign_email_post_credential_content:
            response?.data?.data[0]?.emailAssignPostContent,
        }));
      }

      if (type === "Reminder") {
        setFormData((prevData) => ({
          ...prevData,
          reminder_email_subject_line:
            response?.data?.data[0]?.emailReminderSubject,
          reminder_email_header_graphic:
            response?.data?.data[0]?.emailReminderHeader,
          reminder_email_content: response?.data?.data[0]?.emailReminderContent,
        }));
      }
    } else {
      console.log("error");
    }
  };

  function transformEmailData(data) {
    return data.map((item, index) => ({
      id: index,
      subject: item.emailSubject,
      emailContent: item.emailBody,
      checkboxData: "false",
    }));
  }

  const handleSearch = async () => {
    setIsSubmitting(true);

    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.getResourceEmail,
      queryParams: { companyID, emailType },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setSearching(true);

      let DataList = transformEmailData(response?.data?.data);

      let checkListData = DataList?.reduce(
        (acc, item) => ({ ...acc, [item.id]: false }),
        {}
      );
      setCheckedItems(checkListData);

      setTableData(DataList);
      setIsSubmitting(false);
    } else {
      console.log("error");
      setIsSubmitting(false);
    }
  };

  const updateCheckObject = (rowData, checkObject) => {
    // Create a copy of the checkObject to avoid mutating the original object
    const updatedCheckObject = { ...checkObject };

    // Iterate over the checkObject keys and set the corresponding value based on the rowData.id
    Object.keys(updatedCheckObject).forEach((key) => {
      // Set the value to true if the key matches the rowData.id
      updatedCheckObject[key] = parseInt(key) === rowData.id;
    });

    return updatedCheckObject;
  };

  const handleCheckboxChange = (e, row) => {
    const returnCheck = updateCheckObject(row, checkedItems);

    setCheckedItems(returnCheck);

    setTempSubject(row?.subject);
    setTempcontent(row?.emailContent);
  };

  const handleAddEmailContent = () => {
    if (emailType === "Pre-Start") {
      setFormData((prevData) => ({
        ...prevData,
        pre_start_email_subject: tempSubject,

        pre_start_email_content: tempcontent,
      }));
    }

    if (emailType === "Assign") {
      setFormData((prevData) => ({
        ...prevData,
        assign_email_subject_line: tempSubject,

        assign_email_pre_credential_content: tempcontent,
      }));
    }

    if (emailType === "Reminder") {
      setFormData((prevData) => ({
        ...prevData,
        reminder_email_subject_line: tempSubject,

        reminder_email_content: tempcontent,
      }));
    }

    if (emailType === "ThankYou") {
      setFormData((prevData) => ({
        ...prevData,
        thank_you_email_subject_line: tempSubject,

        thank_you_email_content: tempcontent,
      }));
    }

    emailClose();
  };

  const unassignColumns = [
    {
      title: "S.No.",
      dataKey: "s.no",
      data: "s.no",
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: "#",
      dataKey: "checkboxData",
      columnHeaderClassName: "w-1 text-center",
      columnOrderable: false,
      render: (data, row) => {
        return (
          <>
            <Form.Group className="form-group mb-0" controlId={row.id}>
              <Form.Check
                className="me-0 p-0"
                type="checkbox"
                id={row.id}
                checked={checkedItems[row.id]}
                onChange={(e) => handleCheckboxChange(e, row)}
                label={<div className="primary-color" />}
              />
            </Form.Group>
          </>
        );
      },
    },
    {
      title: "Subject",
      dataKey: "subject",
      columnHeaderClassName: "no-sorting",
      render: (data, row) => {
        return (
          <div className="faqFilter">
            <div className="faqFilter_Head">{row.subject}</div>
          </div>
        );
      },
    },
    {
      title: "Content",
      dataKey: "emailContent",
      columnHeaderClassName: "no-sorting",
      render: (data, row) => {
        return (
          <div className="faqFilter">
            <div className="faqFilter_Head">{row.emailContent}</div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="pageTitle">
      <h2>System Generated Emails</h2>
      <div className="generalsetting_inner d-block">
        <Accordion>
          <Accordion.Item eventKey="0" id="acc-preStartEmail">
            <Accordion.Header>Pre Start Email</Accordion.Header>
            <Accordion.Body>
              <div className="d-flex justify-content-between flex-wrap mb-md-3 mb-2">
                {/* Link to copy from default settings */}
                <Link
                  className="link-primary d-flex align-items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCopyComment("PreStart");
                  }}
                >
                  {showLoader ? "Copying....." : "Copy Default Settings"}
                </Link>

                {/* Link to search and add from resource */}
                <Link
                  className="link-primary d-flex align-items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    emailShow("Pre-Start");
                  }}
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

              {/* Email Subject Line */}
              <Form.Group className="form-group mb-3">
                <Form.Label>
                  Email Subject Line <span className="text-danger">*</span>
                </Form.Label>
                <InputField
                  type="text"
                  name="pre_start_email_subject"
                  id="pre_start_email_subject_field"
                  placeholder="Email Subject Line"
                  value={formData.pre_start_email_subject}
                  onChange={handleChangeReport}
                  required
                  isInvalid={!!formErrors.pre_start_email_subject}
                  error={formErrors.pre_start_email_subject}
                />
                {formErrors.pre_start_email_subject && (
                  <div className="error text-danger">
                    {formErrors.pre_start_email_subject}
                  </div>
                )}
              </Form.Group>

              {/* Header Graphic */}
              <Form.Group className="form-group mb-3">
                <Form.Label>Header Graphic</Form.Label>
                <Form.Label className="form-label d-inline-block">
                  <span className="text-danger d-inline-block">Note:</span>
                  "Please make sure the size of the image that you might upload
                  here be 660 X 100 pixels, in order that it renders correctly
                  in Mail."
                </Form.Label>
                <TextEditor
                  value={formData.pre_start_email_header}
                  onChange={(value) =>
                    handleTextAditor("pre_start_email_header", value)
                  }
                  extraToolbar={["uploadImage"]}
                />

                <span>
                  The System Based Greeting will be inserted here (i.e., Dear
                  First and last Name)
                </span>
              </Form.Group>

              {/* Email Content */}
              <Form.Group
                className="form-group mb-3"
                id="pre_start_email_content_field"
              >
                <Form.Label>Email Content</Form.Label>
                <TextEditor
                  value={formData.pre_start_email_content}
                  onChange={(value) =>
                    handleTextAditor("pre_start_email_content", value)
                  }
                  extraToolbar={["uploadImage"]}
                />
                {formErrors.pre_start_email_content && (
                  <div className="error text-danger">
                    {formErrors.pre_start_email_content}
                  </div>
                )}
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1" id="acc-assignEmail">
            <Accordion.Header>Assign Email</Accordion.Header>
            <Accordion.Body>
              <div className="d-flex justify-content-between flex-wrap mb-md-3 mb-2">
                <Link
                  className="link-primary d-flex align-items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCopyComment("Assign");
                  }}
                >
                  {showLoader ? "Copying....." : "Copy Default Settings"}
                </Link>
                <Link
                  className="link-primary d-flex align-items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    emailShow("Assign");
                  }}
                >
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip-disabled">
                        {" "}
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
              <Form.Group className="form-group mb-3">
                <Form.Label>
                  Email Subject Line <span className="text-danger">*</span>
                </Form.Label>
                <InputField
                  type="text"
                  placeholder="Email Subject Line"
                  name="assign_email_subject_line"
                  id="assign_email_subject_line_field"
                  value={formData.assign_email_subject_line}
                  onChange={handleChangeReport}
                  required
                  isInvalid={!!formErrors.assign_email_subject_line}
                  error={formErrors.assign_email_subject_line}
                />
                {formErrors.assign_email_subject_line && (
                  <div className="error text-danger">
                    {formErrors.assign_email_subject_line}
                  </div>
                )}
              </Form.Group>

              <Form.Group className="form-group mb-3">
                <Form.Label>Header Graphic</Form.Label>
                <Form.Label className="form-label d-inline-block">
                  <span className="text-danger d-inline-block">Note:</span>
                  &quot;Please make sure the size of the image that you might
                  upload here be 660 X 100 pixels, in order that it renders
                  correctly in Mail.&quot;
                </Form.Label>
                <TextEditor
                  value={formData.assign_email_header_graphic}
                  onChange={(value) =>
                    handleTextAditor("assign_email_header_graphic", value)
                  }
                  extraToolbar={["uploadImage"]}
                />
                <span>
                  The System Based Greeting will be inserted here (i.e., Dear
                  First and last Name)
                </span>
              </Form.Group>
              <Form.Group
                className="form-group mb-3"
                id="assign_email_pre_credential_content_field"
              >
                <Form.Label>Pre-Credential Content</Form.Label>
                <TextEditor
                  value={formData.assign_email_pre_credential_content}
                  onChange={(value) =>
                    handleTextAditor(
                      "assign_email_pre_credential_content",
                      value
                    )
                  }
                  extraToolbar={["uploadImage"]}
                />
                <span>
                  The users or participant&quot;s system-based login credentials
                  will be inserted here.{" "}
                </span>
                {formErrors.assign_email_pre_credential_content && (
                  <div className="error text-danger">
                    {formErrors.assign_email_pre_credential_content}
                  </div>
                )}
              </Form.Group>
              <Form.Group className="form-group mb-3">
                <Form.Label>Post-Credential Content</Form.Label>
                <TextEditor
                  value={formData.assign_email_post_credential_content}
                  onChange={(value) =>
                    handleTextAditor(
                      "assign_email_post_credential_content",
                      value
                    )
                  }
                  extraToolbar={["uploadImage"]}
                  id="assign_email_post_credential_content_field"
                />
                {formErrors.assign_email_post_credential_content && (
                  <div className="error text-danger">
                    {formErrors.assign_email_post_credential_content}
                  </div>
                )}
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" id="acc-reminderEmail">
            <Accordion.Header>Reminder Email</Accordion.Header>
            <Accordion.Body>
              <div className="d-flex justify-content-between flex-wrap mb-md-3 mb-2">
                <Link
                  className="link-primary d-flex align-items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCopyComment("Reminder");
                  }}
                >
                  {showLoader ? "Copying....." : "Copy Default Settings"}
                </Link>
                <Link
                  className="link-primary d-flex align-items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    emailShow("Reminder");
                  }}
                >
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip-disabled">
                        {" "}
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
              <Form.Group className="form-group mb-3">
                <Form.Label>
                  Email Subject Line <span className="text-danger">*</span>
                </Form.Label>
                <InputField
                  type="text"
                  placeholder="Email Subject Line"
                  value={formData?.reminder_email_subject_line}
                  name="reminder_email_subject_line"
                  id="reminder_email_subject_line_field"
                  onChange={handleChangeReport}
                  required
                  isInvalid={!!formErrors.reminder_email_subject_line}
                  error={formErrors.reminder_email_subject_line}
                />
                {formErrors.reminder_email_subject_line && (
                  <div className="error text-danger">
                    {formErrors.reminder_email_subject_line}
                  </div>
                )}
              </Form.Group>

              <Form.Group className="form-group mb-3">
                <Form.Label>Header Graphic</Form.Label>
                <Form.Label className="form-label d-inline-block">
                  <span className="text-danger d-inline-block">Note:</span>
                  &quot;Please make sure the size of the image that you might
                  upload here be 660 X 100 pixels, in order that it renders
                  correctly in Mail.&quot;
                </Form.Label>
                <TextEditor
                  value={formData.reminder_email_header_graphic}
                  onChange={(value) =>
                    handleTextAditor("reminder_email_header_graphic", value)
                  }
                  extraToolbar={["uploadImage"]}
                />
                <span>
                  The System Based Greeting will be inserted here (i.e., Dear
                  First and last Name)
                </span>
              </Form.Group>
              <Form.Group className="form-group mb-3">
                <Form.Label>Email Content</Form.Label>
                <TextEditor
                  value={formData.reminder_email_content}
                  onChange={(value) =>
                    handleTextAditor("reminder_email_content", value)
                  }
                  extraToolbar={["uploadImage"]}
                  id="reminder_email_content_field"
                />
                {formErrors.reminder_email_content && (
                  <div className="error text-danger">
                    {formErrors.reminder_email_content}
                  </div>
                )}
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3" id="acc-thanksEmail">
            <Accordion.Header>Thank You</Accordion.Header>
            <Accordion.Body>
              <div className="d-flex justify-content-between flex-wrap mb-md-3 mb-2">
                <Link
                  className="link-primary d-flex align-items-center mb-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCopyComment("ThankYou");
                  }}
                >
                  {showLoader ? "Copying....." : "Copy Default Settings"}
                </Link>
                <Link
                  className="link-primary d-flex align-items-center mb-2"
                  onClick={(e) => {
                    e.preventDefault();
                    emailShow("ThankYou");
                  }}
                >
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip-disabled">
                        {" "}
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
              <Form.Group className="form-group mb-3">
                <Form.Label>
                  Email Subject Line <span className="text-danger">*</span>
                </Form.Label>
                <InputField
                  type="text"
                  placeholder="Email Subject Line"
                  name="thank_you_email_subject_line"
                  id="thank_you_email_subject_line_field"
                  value={formData.thank_you_email_subject_line}
                  onChange={handleChangeReport}
                  required
                  isInvalid={!!formErrors.thank_you_email_subject_line}
                  error={formErrors.thank_you_email_subject_line}
                />
                {formErrors.thank_you_email_subject_line && (
                  <div className="error text-danger">
                    {formErrors.thank_you_email_subject_line}
                  </div>
                )}
              </Form.Group>

              <Form.Group className="form-group mb-3">
                <Form.Label>Header Graphic</Form.Label>
                <Form.Label className="form-label d-inline-block">
                  <span className="text-danger d-inline-block">Note:</span>
                  &quot;Please make sure the size of the image that you might
                  upload here be 660 X 100 pixels, in order that it renders
                  correctly in Mail.&quot;
                </Form.Label>
                <TextEditor
                  value={formData.thank_you_email_header_graphic}
                  onChange={(value) =>
                    handleTextAditor("thank_you_email_header_graphic", value)
                  }
                  extraToolbar={["uploadImage"]}
                />
                <span>
                  The System Based Greeting will be inserted here (i.e., Dear
                  First and last Name)
                </span>
              </Form.Group>
              <Form.Group
                className="form-group mb-3"
                id="thank_you_email_content_field"
              >
                <Form.Label>Email Content</Form.Label>
                <TextEditor
                  value={formData.thank_you_email_content}
                  onChange={(value) =>
                    handleTextAditor("thank_you_email_content", value)
                  }
                  extraToolbar={["uploadImage"]}
                />
                {formErrors.thank_you_email_content && (
                  <div className="error text-danger">
                    {formErrors.thank_you_email_content}
                  </div>
                )}
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4">
            <Accordion.Header>Email Footer</Accordion.Header>
            <Accordion.Body>
              <Form.Group className="form-group mb-3">
                <Form.Label className="form-label d-inline-block">
                  <span className="text-danger d-inline-block">Note:</span>
                  &quot;Please make sure the size of the image that you might
                  upload here be 660 X 100 pixels, in order that it renders
                  correctly in Mail.&quot;
                </Form.Label>
                <TextEditor
                  value={formData.email_footer}
                  onChange={(value) => handleTextAditor("email_footer", value)}
                  extraToolbar={["uploadImage"]}
                />
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
      {/* email template modal */}
      <ModalComponent
        modalHeader="Email Template"
        show={showEmail}
        onHandleCancel={emailClose}
        size="lg"
      >
        <Form action="">
          <Row className="row rowGap align-items-end">
            <Col lg={10}>
              <Form.Group className="form-group">
                <Form.Label>
                  Email Group<sup>*</sup>
                </Form.Label>
                <SelectField
                  defaultValue={emailDropdownData.find(
                    (option) => option.value === emailType
                  )}
                  placeholder="Select Email Group"
                  options={emailDropdownData}
                  isDisabled="true"
                />
              </Form.Group>
            </Col>
            <Col lg={2} className="d-flex justify-content-end">
              <Button
                variant="primary"
                className="ripple-effect px-3 py-2"
                onClick={handleSearch}
              >
                {isSubmitting ? "Searching..." : "Search"}
              </Button>
            </Col>
          </Row>
          {isSearching && (
            <Row className="row rowGap align-items-end mt-2">
              <Col lg={12}>
                <ReactDataTable
                  data={currentData}
                  columns={unassignColumns}
                  page={offset}
                  totalLength={totalRecords}
                  totalPages={totalPages}
                  sizePerPage={limit}
                  handleLimitChange={handleLimitChange}
                  handleOffsetChange={handleOffsetChange}
                  searchValue={searchValue}
                  handleSort={handleSort}
                  sortState={sortState}
                />
                <div className="form-btn d-flex gap-2 justify-content-end pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="ripple-effect"
                    onClick={emailClose}
                  >
                    Close
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    className="ripple-effect"
                    disabled={tempSubject === "" && tempcontent === ""}
                    onClick={handleAddEmailContent}
                  >
                    Add
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </Form>
      </ModalComponent>
    </div>
  );
};

export default forwardRef(SystemGeneratedEmails);
