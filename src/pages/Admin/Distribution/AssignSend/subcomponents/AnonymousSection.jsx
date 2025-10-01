import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import { commonService, showErrorToast } from "services/common.service"; // Assuming showErrorToast is here or from toastHelper
import {
  showSuccessToast,
  showErrorToast as showErrorToastHelper,
} from "helpers/toastHelper"; // Use specific alias if names clash
import {
  Button,
  ImageElement,
  InputField,
  SelectField,
} from "../../../../../components";
import { Distribution } from "../../../../../apiEndpoints/Distribution";

const AnonymousSection = ({
  companyOptions,
  surveyOptions,
  departmentOptions,
  addAnonymousShow,
  fetchDepartment,
  fetchSurvey,
  userData,
  selectedCompanyId,
  selectedSurveyId,
  setSelectedCompanyId,
  setSelectedSurveyId,
}) => {
  const [timingSecond, setTimingSecond] = useState("immediate2");
  const [anonymousLink, setAnonymousLink] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [showScheduleDatePickers, setShowScheduleDatePickers] = useState(false);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [userSelectedTiming, setUserSelectedTiming] = useState(null);
  const [hasFetchedExistingSchedule, setHasFetchedExistingSchedule] = useState(false);

  const [formData, setFormData] = useState({
    companyMasterID: userData?.companyMasterID || null,
    companyID: null,
    surveyID: null,
    departmentID: null,
    startDate: null,
    endDate: null,
    surveyScheduleID: null,
  });

  const qrCodeRef = useRef();

  const downloadQRCode = async () => {
    if (!formData.companyID || !formData.surveyID || !formData.departmentID) {
      return;
    }

    const response = await commonService({
      apiEndPoint: {
        ...Distribution.downloadQRCode,
        url: `${Distribution.downloadQRCode.url}?companyID=${formData.companyID}&surveyID=${formData.surveyID}&departmentID=${formData.departmentID}`,
      },
      isFormData: false,
      headers: {
        Authorization: `Bearer ${userData?.apiToken}`,
        Accept: "image/png",
      },
      responseType: "blob",
      toastType: {
        success: false,
        error: false,
      },
    });

    if (response?.status) {
      let fileData = response?.data;
      let data = new Blob([fileData], { type: "image/png" });
      let csvURL = window.URL.createObjectURL(data);
      let tempLink = document.createElement("a");
      tempLink.href = csvURL;
      tempLink.setAttribute("download", `qr-code.png`);
      tempLink.click();
    }
  };

  const timingSecondChange = (e) => {
    const newTiming = e.target.id;
    setTimingSecond(newTiming);
    setUserSelectedTiming(newTiming);
    // Clear data that might be associated with the previous timing/C/S/D combo
    setAnonymousLink("");
    setQrCodeUrl("");
    setFormData((prev) => ({
      ...prev,
      startDate: null,
      endDate: null,
      surveyScheduleID: null,
    }));
    // Reset UI states that depend on fetched data
    setShowGenerateButton(false);
    setIsEditingSchedule(false); // Reset edit mode
    // Default UI state for pickers, useEffect might override if data is found for C/S/D
    setShowScheduleDatePickers(newTiming === "schedule2");
  };

  const handleCompanyChange = async (selectedOption) => {
    if (selectedOption?.value) {
      setFormData((prev) => ({
        ...prev,
        companyID: selectedOption.value,
        surveyID: null, // Reset survey when company changes
        departmentID: null, // Reset department when company changes
      }));
      // fetchSurvey(selectedOption.value);
      // fetchDepartment(selectedOption.value);
      setAnonymousLink(""); // Clear link/QR
      setQrCodeUrl("");
      setIsEditingSchedule(false);
      setSelectedCompanyId(selectedOption?.value);
      setUserSelectedTiming(null);
      // setShowGenerateButton(false); // useEffect will handle this
    } else {
      setFormData((prev) => ({
        ...prev,
        companyID: null,
        surveyID: null,
        departmentID: null,
      }));
      setAnonymousLink("");
      setQrCodeUrl("");
      setShowGenerateButton(false);
      setIsEditingSchedule(false);
      setShowScheduleDatePickers(false);
    }
  };

  const handleSurveyChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      surveyID: selectedOption?.value ? Number(selectedOption.value) : null,
      departmentID: null, // Reset department when survey changes
    }));
    setAnonymousLink(""); // Clear link/QR
    setQrCodeUrl("");
    setIsEditingSchedule(false);
    setSelectedSurveyId(selectedOption?.value);
    setUserSelectedTiming(null);
    // setShowGenerateButton(false); // useEffect will handle this
  };

  const handleDepartmentChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      departmentID: selectedOption?.value ? Number(selectedOption.value) : null,
    }));
    setAnonymousLink(""); // Clear link/QR
    setQrCodeUrl("");
    setIsEditingSchedule(false);
    setUserSelectedTiming(null);
    // setShowGenerateButton(false); // useEffect will handle this
  };

  // Function to fetch existing immediate schedule
  const fetchImmediateSchedule = async () => {
    // This function now primarily fetches and sets data, returning the core data or null.
    // It does not set isLoading directly here; the caller (useEffect) handles it.
    if (!formData.companyID || !formData.surveyID || !formData.departmentID) {
      setAnonymousLink("");
      setQrCodeUrl("");
      setFormData((prev) => ({
        ...prev,
        startDate: null,
        endDate: null,
        surveyScheduleID: null,
      }));
      return null;
    }

    // setIsLoading(true); // Caller will set isLoading
    try {
      const response = await commonService({
        apiEndPoint: {
          ...Distribution.assignScheduleAnonymousImmediate,
          url: `${Distribution.assignScheduleAnonymousImmediate.url}?companyID=${formData.companyID}&surveyID=${formData.surveyID}&departmentID=${formData.departmentID}`,
        },
        headers: {
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        // No toastType here for automatic checks, handled by calling function if needed
      });

      if (response?.status && response.data?.data) {
        const scheduleAPIData = response.data.data;
        setHasFetchedExistingSchedule(
          !!(scheduleAPIData.startDate && scheduleAPIData.endDate)
        );
        setAnonymousLink(scheduleAPIData.quickResponseContent || "");
        setQrCodeUrl(scheduleAPIData.quickResponseCode || "");
        // Store fetched start/end dates if available
        setFormData((prev) => ({
          ...prev,
          startDate: scheduleAPIData.startDate || null,
          endDate: scheduleAPIData.endDate || null,
          surveyScheduleID:
            scheduleAPIData.surveyScheduleID ||
            scheduleAPIData.quickResponseID ||
            null,
        }));
        return scheduleAPIData; // Return the actual data part
      } else {
        // API call might be 'ok' but no content means no existing schedule/link.
        setAnonymousLink("");
        setQrCodeUrl("");
        // Clear dates and surveyScheduleID if no schedule found or no content
        setFormData((prev) => ({
          ...prev,
          startDate: null,
          endDate: null,
          surveyScheduleID: null,
        }));
        return null; // Not found
      }
    } catch (error) {
      console.error("Error fetching immediate schedule:", error);
      setAnonymousLink("");
      setQrCodeUrl("");
      // Clear dates and surveyScheduleID on error
      setFormData((prev) => ({
        ...prev,
        startDate: null,
        endDate: null,
        surveyScheduleID: null,
      }));
      return null; // Error occurred
    }
    // finally { setIsLoading(false); } // Caller will reset isLoading
  };

  const createImmediateSchedule = async () => {
    if (!formData.companyID || !formData.surveyID || !formData.departmentID) {
      return false;
    }

    try {
      const response = await commonService({
        apiEndPoint: Distribution.createAssignScheduleAnonymousImmediate,
        bodyData: {
          companyMasterID: userData?.companyMasterID, // Ensure using potentially updated userData
          companyID: formData.companyID,
          surveyID: formData.surveyID,
          departmentID: formData.departmentID,
        },
        toastType: { error: "Failed to create anonymous schedule entry." }, // Only error toast from commonService
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      return response?.status || false; // Return true if API reports success
    } catch (error) {
      console.error("Error creating immediate schedule:", error);
      // commonService should have shown the toast if it was an API error.
      return false;
    }
  };

  useEffect(() => {
    const performCheckAndSetVisibility = async () => {
      // Reset states that depend on these inputs
      setShowGenerateButton(false);
      setIsEditingSchedule(false); // Ensure edit mode is off initially
      setShowScheduleDatePickers(false); // Default to false, logic below will set if needed

      if (formData.companyID && formData.surveyID && formData.departmentID) {
        setIsLoading(true);
        try {
          // fetchImmediateSchedule updates anonymousLink, qrCodeUrl, and formData dates/IDs internally
          const fetchedScheduleAPIData = await fetchImmediateSchedule();

          if (
            fetchedScheduleAPIData &&
            fetchedScheduleAPIData.quickResponseContent
          ) {
            const endDate = fetchedScheduleAPIData.endDate;
            const now = new Date();
            const endDateObj = endDate
              ? new Date(endDate.replace(/-/g, "/"))
              : null;

            if (
              fetchedScheduleAPIData.startDate &&
              endDateObj &&
              endDateObj < now
            ) {
              // End date is in the past — expired schedule, create new
              if (!userSelectedTiming) {
                setTimingSecond("schedule2");
              }
              setShowScheduleDatePickers(true);
              setIsEditingSchedule(false);
              setAnonymousLink("");
              setQrCodeUrl("");
              setFormData((prev) => ({
                ...prev,
                startDate: null,
                endDate: null,
                surveyScheduleID: null,
              }));
            } else if (fetchedScheduleAPIData.startDate && !userSelectedTiming) {
              // Valid existing schedule
              setTimingSecond("schedule2");
              setIsEditingSchedule(false);
              setShowScheduleDatePickers(false);
            } else {
              setTimingSecond("immediate2"); // Existing immediate link found, force radio to "Immediate"
              // UI will show QR. Date pickers and generate button remain hidden.
            }
            if (
              timingSecond === "immediate2" &&
              (!fetchedScheduleAPIData?.quickResponseContent || anonymousLink === "")
            ) {
              setShowGenerateButton(true);
            }
          } else {
            // No existing QR/Link found for this C/S/D combination
            // anonymousLink, qrCodeUrl, formData dates/IDs are already cleared by fetchImmediateSchedule on failure/no data
            // If user hasn't selected a timing yet, default to immediate
            if (!userSelectedTiming) {
              // setTimingSecond("schedule2");
              // setShowScheduleDatePickers(true);
              // If that dept doesnt have a schedule(start date, end date) default to immediate
              if(!fetchedScheduleAPIData?.startDate && !fetchedScheduleAPIData?.endDate){
                setTimingSecond("immediate2");
                setShowGenerateButton(true);
              }else{
                setTimingSecond("schedule2");
                setShowScheduleDatePickers(true);
              }
            } else if (userSelectedTiming === "immediate2") {
              setShowGenerateButton(true);
            } else if (userSelectedTiming === "schedule2") {
              setShowScheduleDatePickers(true);
            }
          }
        } catch (e) {
          console.error("Unexpected error during visibility check:", e);
          // Fallback to default visibility based on mode
          if (timingSecond === "immediate2") setShowGenerateButton(true);
          else if (timingSecond === "schedule2")
            setShowScheduleDatePickers(true);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Incomplete form data
        setAnonymousLink("");
        setQrCodeUrl("");
        setFormData((prev) => ({
          ...prev,
          startDate: null,
          endDate: null,
          surveyScheduleID: null,
        }));

        if (timingSecond === "schedule2") {
          setShowScheduleDatePickers(true); // Show schedule UI if data incomplete
        }
        // No generate button if data is incomplete, showGenerateButton remains false
      }
    };

    performCheckAndSetVisibility();
  }, [
    formData.companyID,
    formData.surveyID,
    formData.departmentID,
    timingSecond,
  ]);

  useEffect(() => {
    if (selectedCompanyId) {
      setFormData((prev) => ({
        ...prev,
        companyID: selectedCompanyId,
        surveyID: selectedSurveyId ?? null,
        departmentID: null,
      }));
      fetchSurvey(selectedCompanyId);
      fetchDepartment(selectedCompanyId);
      setAnonymousLink("");
      setQrCodeUrl("");
      setIsEditingSchedule(false);
      setHasFetchedExistingSchedule(false);
    }
  }, [selectedCompanyId,selectedSurveyId]);

  // useEffect(() => {
  //   if (selectedSurveyId) {
  //     setFormData((prev) => ({ ...prev, surveyID: selectedSurveyId }));
  //   }
  // }, [selectedSurveyId]);

  const handleGenerateClick = async () => {
    if (!formData.companyID || !formData.surveyID || !formData.departmentID) {
      showErrorToastHelper("Please select Company, Survey, and Department.");
      return;
    }
    setIsLoading(true);
    setAnonymousLink(""); // Clear previous link/QR before generating new
    setQrCodeUrl("");

    try {
      const creationSuccess = await createImmediateSchedule();
      if (creationSuccess) {
        const fetchSuccess = await fetchImmediateSchedule(); // Attempt to fetch the newly created/updated link
        if (fetchSuccess) {
          setShowGenerateButton(false); // Successfully generated and fetched, hide button
          showSuccessToast("Link and QR code generated successfully!");
        } else {
          // Creation might have succeeded, but fetching failed or returned no data.
          showErrorToastHelper(
            "Link and QR code could not be retrieved after generation."
          );
          setShowGenerateButton(true); // Allow user to try again
        }
      } else {
        // createImmediateSchedule failed and should have shown its own error toast.
        setShowGenerateButton(true); // Keep button visible for another attempt
      }
    } catch (error) {
      console.error("Error in handleGenerateClick:", error);
      showErrorToastHelper("An unexpected error occurred during generation.");
      setShowGenerateButton(true); // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const displayFormatDate = (dateString) => {
    if (!dateString) return "N/A";
    // Assuming API returns dates in a format like YYYY-MM-DD or MM-DD-YYYY.
    // If specific re-formatting is needed (e.g., to DD/MM/YYYY), implement here.
    // For now, returning as is.
    // Example: const date = new Date(dateString.replace(/-/g, '/')); return date.toLocaleDateString('en-GB');
    return dateString;
  };

  const formatDateToAPI = (date) => {
    return date
      .toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  const handleScheduleSubmit = async () => {
    try {
      if (
        !formData.companyID ||
        !formData.surveyID ||
        !formData.departmentID ||
        !formData.startDate ||
        !formData.endDate
      ) {
        showErrorToastHelper(
          "Please select Company, Survey, Department, Start Date, and End Date."
        );
        return;
      }

      setIsLoading(true);

      if (isEditingSchedule) {
        // Update existing schedule
        // if (!formData.surveyScheduleID) {
        //   showErrorToastHelper("Schedule ID is missing. Cannot update.");
        //   setIsLoading(false);
        //   return;
        // }

        const scheduleDetailsResponse = await commonService({
          apiEndPoint: Distribution.fetchAllSchedule,
          queryParams: {
            companyID: formData.companyID,
            surveyID: formData.surveyID,
            "departmentID[]": [formData.departmentID], // API expects an array
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.apiToken}`,
          },
          // No toastType here, handle manually
        });

        let surveyIdForUpdate = null;

        if (
          scheduleDetailsResponse?.status &&
          scheduleDetailsResponse?.data?.allSchedule?.length > 0
        ) {
          // Find the specific schedule for the current department
          const scheduleInfo = scheduleDetailsResponse.data.allSchedule.find(
            (sch) => Number(sch.departmentID) === Number(formData.departmentID)
          );
          if (scheduleInfo && scheduleInfo.surveyScheduleID) {
            surveyIdForUpdate = scheduleInfo.surveyScheduleID;
            setFormData((prev) => ({
            ...prev,
            surveyScheduleID: surveyIdForUpdate,
          }));
          }
        }

        if (!surveyIdForUpdate) {
          showErrorToastHelper(
            "Could not retrieve a valid Schedule ID for the update. Please ensure the schedule exists or try again."
          );
          setIsLoading(false);
          return;
        }

        if (!formData.surveyScheduleID) {
          showErrorToastHelper("Schedule ID is missing. Cannot update.");
          setIsLoading(false);
          return;
        }

        const payload = {
          surveyScheduleID: surveyIdForUpdate,
          companyID: formData.companyID,
          surveyID: formData.surveyID, 
          departmentID: formData.departmentID, 
          startDate: formData.startDate,
          endDate: formData.endDate,
          isPreStartEmail: 0,
          isPreStartDays: "",
          isReminder: 0,
          isReminderType: "",
          isReminderCompleteDate: "",
          isReminderCompleteDay: "",
          isCompleteOccuranceIntervalType: "",
        };
        const response = await commonService({
          apiEndPoint: Distribution.updateSchedule, // PUT request
          bodyData: payload,
          toastType: {
            success: "Updated Successfully",
            error: "Failed to update schedule",
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.apiToken}`,
          },
        });
        if (response?.status) {
          setIsEditingSchedule(false);
          await fetchImmediateSchedule(); // Refresh data
        }
      } else {
        // Create new schedule
        const response = await commonService({
          apiEndPoint: Distribution.createAnonymousSchedule, // POST request
          bodyData: formData, // Contains companyMasterID, companyID, surveyID, departmentID, startDate, endDate
          toastType: {
            success: "Schedule created successfully",
            error: "Failed to create schedule",
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.apiToken}`,
          },
        });
        if (response?.status) {
          setShowScheduleDatePickers(false);
          await fetchImmediateSchedule(); // This would show the QR/Link
        }
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (anonymousLink) {
      navigator.clipboard
        .writeText(anonymousLink)
        .then(() => {
          showSuccessToast("Link copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy link: ", err);
          showErrorToastHelper("Failed to copy link.");
        });
    }
  };

  // Download zip folder with link, QR code , images
  const handleDownloadZip = async () => {
    if (!formData.companyID || !formData.surveyID || !formData.departmentID) {
      showErrorToastHelper("Please select Company, Survey, and Department.");
      return;
    }
    // setIsLoading(true);
    try {
      const response = await commonService({
        apiEndPoint: {
          ...Distribution.assignScheduleAnonymousImmediate,
          url: `${Distribution.assignScheduleAnonymousImmediate.url}?companyID=${formData.companyID}&surveyID=${formData.surveyID}&departmentID=${formData.departmentID}&isZipDownload=1`,
        },
        headers: {
          Authorization: `Bearer ${userData?.apiToken}`,
          Accept: "application/zip",
        },
        responseType: "blob",
        toastType: {
          success: false,
          error: "Failed to download survey package.",
        },
      });

      if (response?.data) {
        const blob = new Blob([response.data], { type: "application/zip" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "survey_package.zip");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showSuccessToast("Survey package downloaded successfully!");
      } else {
        showErrorToastHelper("Survey package could not be downloaded.");
      }
    } catch (err) {
      console.error("ZIP download error:", err);
      showErrorToastHelper("Something went wrong while downloading ZIP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="anonymous" className="anonymous">
      <Row className="gx-2 flex-grow-1">
        <Col xxl={4} sm={6}>
          <Form.Group className="form-group">
            <Form.Label>Company</Form.Label>
            <SelectField
              placeholder="Select Company"
              options={companyOptions}
              value={companyOptions.find(
                (option) => option?.value === formData.companyID
              )}
              onChange={handleCompanyChange}
            />
          </Form.Group>
        </Col>
        <Col xxl={4} sm={6}>
          <Form.Group className="form-group">
            <Form.Label>Survey</Form.Label>
            <SelectField
              placeholder="Select Survey"
              options={surveyOptions}
              onChange={handleSurveyChange}
              isDisabled={!formData.companyID}
              value={surveyOptions.find(
                (option) => option?.value == formData.surveyID
              )}
            />
          </Form.Group>
        </Col>
        <Col xxl={4} md={6}>
          <Form.Group className="form-group">
            <Form.Label className="d-flex align-items-center flex-wrap justify-content-between gap-1">
              <div>Department</div>
              <div
                className="link-primary fw-medium cursor-pointer"
                onClick={() => addAnonymousShow(formData.companyID)} // Modified to pass companyID
              >
                + Add Anonymous Department
              </div>
            </Form.Label>
            <SelectField
              placeholder="Select Department"
              options={departmentOptions}
              onChange={handleDepartmentChange}
              isDisabled={!formData.companyID}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="form-group">
        <Form.Label>Timing</Form.Label>
        <div className="onlyradio flex-wrap">
          <Form.Check
            inline
            label="Schedule"
            name="timingSecond"
            type="radio"
            className={`toggle-label ${
              isLoading || !!anonymousLink ? "non-interactive" : ""
            }`}
            id="schedule2"
            checked={timingSecond === "schedule2"}
            onChange={timingSecondChange}
          />
          <Form.Check
            inline
            label="Immediate"
            name="timingSecond"
            type="radio"
            className={`toggle-label ${
              isLoading || !!anonymousLink ? "non-interactive" : ""
            }`}
            id="immediate2"
            checked={timingSecond === "immediate2"}
            onChange={timingSecondChange}
          />
        </div>
      </Form.Group>

      {(anonymousLink || qrCodeUrl) && !isLoading && !isEditingSchedule && (
        <Form.Group className="form-group my-3">
          {/* Alert for existing schedule details in "schedule2" mode */}
          {timingSecond === "schedule2" && (
            <div className="alert alert-info p-3 my-3" role="alert">
              {formData.startDate && formData.endDate ? (
                <>
                  <h6 className="alert-heading">Schedule Already Present</h6>
                  <div className="d-flex justify-content-between align-items-center">
                    <li className="mb-1">
                      Assessment Start Date:{" "}
                      {displayFormatDate(formData.startDate)}
                    </li>
                    {/* Edit Schedule Button - moved to be on the same line as Start Date */}
                    {(!isEditingSchedule && (anonymousLink || qrCodeUrl || hasFetchedExistingSchedule)) && (
                      <Button
                        variant="outline-primary"
                        size="sm" // Optional: make button slightly smaller
                        onClick={() => setIsEditingSchedule(true)}
                      >
                        Edit Schedule
                      </Button>
                    )}
                  </div>
                  <li className="mb-0">
                    Assessment End Date: {displayFormatDate(formData.endDate)}
                  </li>
                </>
              ) : (
                // This case (no start/end date) usually means it's an immediate link,
                // so the "Edit Schedule" button wouldn't apply here anyway based on its own conditions.
                <strong>
                  This is an immediate anonymous link, active indefinitely.
                </strong>
              )}
            </div>
          )}
          {(anonymousLink || qrCodeUrl) && (
          <div className="anonymous_qr">
            <Row>
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label>Anonymous Link For The Survey:</Form.Label>
                  <InputGroup className="mb-3">
                    <InputField
                      placeholder="Anonymous Link"
                      value={anonymousLink}
                      className={"h-100"}
                      readOnly
                    />
                    <Button
                      variant="primary"
                      className="ripple-effect"
                      onClick={handleCopyLink}
                      disabled={!anonymousLink}
                    >
                      <em className="icon-copy me-2" />
                      Copy
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>
            </Row>
            <div className="qrCode">
              <Form.Label className="mb-2 pb-1">QR Code:</Form.Label>
              <div className="d-sm-flex">
                <div className="qrCode_img flex-shrink-0" ref={qrCodeRef}>
                  {qrCodeUrl && (
                    <img
                      src={qrCodeUrl}
                      className="w-100 h-100 object-fit-cover"
                      alt="QR Code"
                    />
                  )}
                </div>
                <div className="qrCode_cnt">
                  {qrCodeUrl && (
                    <Button
                      variant="primary"
                      className="ripple-effect d-inline-block"
                      onClick={downloadQRCode}
                    >
                      Download QR Code
                    </Button>
                  )}
                  <p className="qrCode_cnt_link">
                    Click {" "}<span className="link-primary cursor-pointer" onClick={(e) => {
                    e.preventDefault(); 
                    handleDownloadZip();
                    }}>here</span>{" "} to download the image with
                    HTML/Survey Link
                  </p>
                  <ImageElement
                    source="brand-logos.png"
                    className="img-fluid"
                  />
                </div>
              </div>
            </div>
          </div>
          )}
        </Form.Group>
      )}

      {timingSecond === "immediate2" &&
        showGenerateButton &&
        !isLoading &&
        !(anonymousLink || qrCodeUrl) && (
          <Form.Group className="form-group my-3">
            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                className="ripple-effect"
                onClick={handleGenerateClick}
                disabled={
                  !formData.companyID ||
                  !formData.surveyID ||
                  !formData.departmentID ||
                  isLoading
                }
              >
                {isLoading ? "Processing..." : "Generate"}
              </Button>
            </div>
          </Form.Group>
        )}

      {/* Date pickers for creating or editing a schedule */}
      {timingSecond === "schedule2" &&
        (showScheduleDatePickers || isEditingSchedule) &&
        !isLoading &&
        (!(anonymousLink || qrCodeUrl) || isEditingSchedule) && ( // Show if no QR OR if QR present AND editing
          <div>
            <h3 className="h6 fw-medium mb-sm-3 mb-2">Schedule START / STOP</h3>
            <Row className="g-2">
              <Col sm={6}>
                <Form.Group className="flatpickr form-group mb-0">
                  <Form.Label>Surveys Start Date</Form.Label>
                  <div className="flatpickr_wrap">
                    <Flatpickr
                      className="form-control date-range"
                      placeholder="DD/MM/YY"
                      value={formData.startDate} // Pre-fill for editing
                      options={{
                        dateFormat: "m-d-Y",
                        disableMobile: "true",
                      }}
                      onChange={([date]) =>
                        setFormData((prev) => ({
                          ...prev,
                          startDate: formatDateToAPI(date),
                        }))
                      }
                    />
                    <em className="icon-calendar-outline rightIcon" />
                  </div>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="flatpickr form-group mb-0">
                  <Form.Label>Surveys End Date</Form.Label>
                  <div className="flatpickr_wrap">
                    <Flatpickr
                      className="form-control date-range"
                      placeholder="DD/MM/YY"
                      value={formData.endDate} // Pre-fill for editing
                      options={{
                        dateFormat: "m-d-Y",
                        disableMobile: "true",
                      }}
                      onChange={([date]) =>
                        setFormData((prev) => ({
                          ...prev,
                          endDate: formatDateToAPI(date),
                        }))
                      }
                    />
                    <em className="icon-calendar-outline rightIcon" />
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex mt-xxl-5 mt-lg-4 mt-3 justify-content-end">
              <Button
                variant="primary"
                className="ripple-effect"
                disabled={isLoading}
                onClick={handleScheduleSubmit}
              >
                {isLoading
                  ? "Processing..."
                  : isEditingSchedule
                  ? "Update Schedule"
                  : "Add to Schedule"}
              </Button>
            </div>
          </div>
        )}
    </div>
  );
};

export default AnonymousSection;
