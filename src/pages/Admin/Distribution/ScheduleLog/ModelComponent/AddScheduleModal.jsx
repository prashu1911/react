import React, { useEffect, useState } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import Flatpickr from "react-flatpickr";
import { useFormik } from "formik";
import { commonService } from "services/common.service";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { Distribution } from "apiEndpoints/Distribution";
import { formatDate } from "utils/common.util";
import {
  Button,
  SelectField,
  ModalComponent,
  InputField,
  NumCounter,
  BasicAlert
} from "../../../../../components";

const ScheduleAddModal = ({
  modalHeader,
  show,
  size,
  onHandleCancel,
  onSubmitSuccess,
  companyOptions,
  reminderOptions,
  daysOptions,
  initialData,
  validationSchedule,
  userData,
  selectedCompany, // Add this prop
  selectedActiveSurveyId,
  type,
}) => {
  // State variables for toggle elements
  const [preStartChecked, setPreStartChecked] = useState(false);
  const [setAutomaticChecked, setSetAutomaticChecked] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState("once");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [surveyOptions, setSurveyOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSurveyId, setSelectedSurveyId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");

  const [disableFlag, setDisableFlag] = useState(true);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isPreStartInvalid, setIsPreStartInvalid] = useState(false);
  const [isPreStartAlert, setIsPreStartAlert] = useState(false);
  const preStartMsg = "Invalid Pre-Start Mail Configuration";

  const handleReminderChange = (selectedOption) => {
    setSelectedReminder(selectedOption.value);
  };

  useEffect(() => {
    if (
      selectedCompanyId !== "" &&
      selectedSurveyId !== "" &&
      selectedDepartmentId !== ""
    ) {
      setDisableFlag(false);
      fetchScheduleLog();
      handlePreStartCheck(selectedCompanyId, selectedSurveyId);
    }
  }, [selectedCompanyId, selectedSurveyId, selectedDepartmentId]);

  // Initialize with selected company
  useEffect(() => {
    if (selectedCompany) {
      setSelectedCompanyId(selectedCompany);
      // eslint-disable-next-line no-use-before-define
      fetchSurvey(selectedCompany);
      // eslint-disable-next-line no-use-before-define
      fetchDepartment(selectedCompany);
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedActiveSurveyId) {
      setSelectedSurveyId(selectedActiveSurveyId);
    }
  }, [selectedActiveSurveyId]);

  // Form Submission Handler
  const handleSubmitSchedule = async (values, { resetForm }) => {
    try {
      setIsSubmitting(true);
      let payload = {
        companyID: selectedCompanyId,
        surveyID: Number(selectedSurveyId),
        departmentID: Array.isArray(selectedDepartmentId)
          ? selectedDepartmentId
          : [selectedDepartmentId],
        startDate: formatDate(values?.start_date),
        endDate: formatDate(values?.end_date),
        isPreStartEmail: preStartChecked ? 1 : 0,
        isPreStartDays: preStartChecked ? values?.is_pre_start_days : 0,
        isReminder: setAutomaticChecked ? 1 : 0,
        isReminderType: setAutomaticChecked
          ? selectedReminder === "once"
            ? 1
            : 2
          : "",
        isReminderCompleteDate:
          setAutomaticChecked && selectedReminder === "once"
            ? formatDate(values?.is_reminder_complete_date)
            : "",
        isReminderCompleteDay:
          setAutomaticChecked && selectedReminder !== "once"
            ? values?.is_reminder_complete_days
            : 0,
        isCompleteOccuranceIntervalType:
          setAutomaticChecked && selectedReminder !== "once"
            ? values?.is_reminder_occurance_interval_type === "Day"
              ? 1
              : 2
            : "",
      };

      // Check if initial values are set
      const isEdit = !!values?.surveyScheduleID;
      if (isEdit) {
        payload.surveyScheduleID = values.surveyScheduleID;
      }

      const response = await commonService({
        apiEndPoint: isEdit? Distribution.updateSchedule : Distribution.createSchedule,
        bodyData: payload,
        toastType: { success: true, error: true },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        onHandleCancel(); // Close modal
        resetForm(); // Reset the form
        onSubmitSuccess?.();
      } else {
        console.error("error");
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const fetchSurvey = async (companyID) => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.surveyList,
      queryParams: { companyID },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setSurveyOptions(
        response?.data?.data?.map((item) => ({
          value: item?.surveyID,
          label: item?.surveyName,
        }))
      );
    } else {
      console.error("error");
    }
  };

  const fetchDepartment = async (companyID) => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.departmentList,
      queryParams: { companyID, isAnonymous: true },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setDepartmentOptions(
        response?.data?.data?.map((department) => ({
          value: department?.departmentID,
          label: department?.departmentName,
        }))
      );
    } else {
      console.error("error");
    }
  };

  const fetchScheduleLog = async () => {
    const queryParams = {
      companyID: selectedCompanyId,
      surveyID: selectedSurveyId,
    };

    // Check if all departments are selected
    const isAllSelected =
      Array.isArray(selectedDepartmentId) &&
      selectedDepartmentId.length === departmentOptions.length;

    // Pass multiple department IDs in API call
    if (
      Array.isArray(selectedDepartmentId) &&
      selectedDepartmentId.length > 0 &&
      !isAllSelected
    ) {
      selectedDepartmentId.forEach((id, index) => {
        queryParams[`departmentID[${index}]`] = id;
      });
    } else {
      queryParams["departmentID[]"] = "0";
    }

    const response = await commonService({
      apiEndPoint: Distribution.fetchAllSchedule,
      queryParams: queryParams,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });

    if (response?.status) {
      const allSchedules = response?.data?.allSchedule || [];
      const filteredSchedules = allSchedules.filter(
        (item) => item?.surveyScheduleID?.trim() !== ""
      );
      // setScheduleData(filteredSchedules);

      // Find matching schedule for selected department
      const matchedSchedule = filteredSchedules.find(
        (item) => item?.departmentID === selectedDepartmentId
      );

      if (matchedSchedule) {
        setAlertMessage("Schedule Already Present");
        setIsAlertVisible(true);
        formik.setValues({
          surveyScheduleID: matchedSchedule?.surveyScheduleID,
          departmentID: matchedSchedule?.departmentID,
          surveyID: matchedSchedule?.surveyID,
          start_date: matchedSchedule?.startDate
            ? new Date(matchedSchedule?.startDate)
            : "",
          end_date: matchedSchedule?.endDate
            ? new Date(matchedSchedule?.endDate)
            : "",
          is_pre_start_email: Number(matchedSchedule?.isPreStart),
          is_pre_start_days: matchedSchedule?.preStartDays || 1,
          is_reminder: Number(matchedSchedule?.isReminder),
          is_reminder_type: matchedSchedule?.reminderToStart,
          is_reminder_complete_date: matchedSchedule?.reminderToStartDate
            ? new Date(matchedSchedule?.reminderToStartDate)
            : new Date(),
          is_reminder_complete_days:
            matchedSchedule?.reminderIntervalStart || 1,
          is_reminder_occurance_interval_type:
            matchedSchedule?.reminderIntervalStartType === 1
              ? "Day"
              : matchedSchedule?.reminderIntervalStartType === 2
              ? "Week"
              : "Day",
        });

        setPreStartChecked(matchedSchedule?.isPreStart === 1);
        setSetAutomaticChecked(matchedSchedule?.isReminder === 1);
        setSelectedReminder(
          matchedSchedule?.reminderToStart === 1 ? "once" : "interval"
        );
      }
    } else {
      console.error("error");
    }
  };

  //API to check if survey has preStart mail configured
  const handlePreStartCheck = async (companyId,surveyId) => {
    const queryParams = {
      companyID: companyId,
      surveyID: surveyId,
    };

    try {
      const response = await commonService({
        apiEndPoint: Distribution.checkPreStart,
        queryParams: queryParams,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        // toastType: {
        //   success: "Pre-Start is configured",
        //   error: "Pre-Start is not configured",
        // },
      });
      if (response?.data?.status === "success") {
        if (response?.data?.surveyLevel === 0) {
          setIsPreStartInvalid(true);
        } else {
          setIsPreStartInvalid(false);
        }

      }
    } catch (error) {
      console.error("Error checking PreStart:", error);
      setIsPreStartInvalid(false); // fallback in case of error
    }
  };

  // Single Formik Instance
  const formik = useFormik({
    enableReinitialize: true, // Enable dynamic initial values
    initialValues: initialData,
    validationSchema: validationSchedule,
    onSubmit: handleSubmitSchedule,
  });

  return (
    <ModalComponent
      modalHeader={modalHeader}
      show={show}
      size={size}
      onHandleCancel={onHandleCancel}
    >
      <Form onSubmit={formik.handleSubmit}>
        <Row className="rowGap">
          <Col lg={6} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>Company</Form.Label>
              <SelectField
                name="company_id"
                options={companyOptions}
                placeholder="Select Company"
                onChange={(selected) => {
                  setSelectedCompanyId(selected?.value);
                  fetchSurvey(selected?.value);
                  fetchDepartment(selected?.value);
                  setSelectedSurveyId("");
                  setSelectedDepartmentId("");
                }}
                value={companyOptions.find(
                  (option) => option?.value === selectedCompanyId
                )}
                // isDisabled={!!selectedCompany} // Disable if company is pre-selected
              />
            </Form.Group>
          </Col>
          <Col lg={6} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>Survey</Form.Label>
              <SelectField
                placeholder="Select Survey"
                name="assessment_id"
                options={surveyOptions}
                onChange={(selected) => setSelectedSurveyId(selected?.value)}
                value={
                  surveyOptions.find(
                    (option) => option?.value == selectedSurveyId
                  ) || null
                }
                isDisabled={
                  surveyOptions?.length === 0 || type === "Survey_Managment"
                }
              />
            </Form.Group>
          </Col>
          <Col lg={6} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>Department</Form.Label>
              <SelectField
                name="department_id"
                options={departmentOptions}
                placeholder="Select Department"
                onChange={(selected) =>
                  setSelectedDepartmentId(selected?.value)
                }
                value={
                  departmentOptions.find(
                    (option) => option?.value === selectedDepartmentId
                  ) || null
                }
                isDisabled={departmentOptions?.length === 0}
              />
            </Form.Group>
          </Col>
        </Row>

        <h4 className="modalBody_title">Schedule START / STOP</h4>

        <Row
          className={`rowGap mb-xxl-4 mb-3 ${
            disableFlag ? "opacity-50" : "bg-white"
          }`}
        >
          <Col lg={6}>
            <Form.Group className="flatpickr form-group mb-0">
              <Form.Label>Surveys Start Date</Form.Label>
              <div className="flatpickr_wrap">
                <Flatpickr
                  className="form-control date-range"
                  placeholder="MM/DD/YY"
                  name="start_date"
                  value={formik?.values?.start_date}
                  onChange={(date) => {
                    formik.setFieldValue("start_date", date[0] || "");
                  }}
                  options={{
                    dateFormat: "m-d-Y",
                    // minDate: "today",
                  }}
                  disabled={disableFlag}
                />
                {formik.errors.start_date && formik.touched.start_date && (
                  <div className="text-danger">{formik.errors.start_date}</div>
                )}
                <em className="icon-calendar rightIcon" />
              </div>
            </Form.Group>
          </Col>

          <Col lg={6}>
            <Form.Group className="flatpickr form-group mb-0">
              <Form.Label>Surveys End Date</Form.Label>
              <div className="flatpickr_wrap">
                <Flatpickr
                  className="form-control date-range"
                  placeholder="MM/DD/YY"
                  name="end_date"
                  value={formik?.values?.end_date}
                  onChange={(date) =>
                    formik.setFieldValue("end_date", date[0] || "")
                  }
                  options={{
                    dateFormat: "m-d-Y",
                    minDate: "today",
                  }}
                  disabled={disableFlag}
                />
                {formik.errors.end_date && formik.touched.end_date && (
                  <div className="text-danger">{formik.errors.end_date}</div>
                )}
                <em className="icon-calendar rightIcon" />
              </div>
            </Form.Group>
          </Col>

          <Col lg={6}>
            <Form.Group className="form-group d-flex align-items-center justify-content-between">
              <Form.Label className="mb-0 w-auto">Pre-Start Email</Form.Label>
              <div className="switchBtn">
                <InputField
                  type="checkbox"
                  id="preStart"
                  checked={preStartChecked}
                  name="is_pre_start_email"
                  onChange={() => {
                    if (isPreStartInvalid){
                      setIsPreStartAlert(true); // Show the alert only on click
                      return; // prevent toggle
                    }
                    setPreStartChecked(!preStartChecked)
                  }}
                  disabled={disableFlag}
                />
                {formik?.touched?.is_pre_start_email &&
                formik?.errors?.is_pre_start_email ? (
                  <div className="error mt-1 text-danger">
                    {formik?.errors?.is_pre_start_email}
                  </div>
                ) : null}
                <Form.Label htmlFor="preStart" />
              </div>
            </Form.Group>
            {preStartChecked && (
              <div className="mt-lg-3 mt-1" id="preStartContent">
                <Form.Group className="form-group">
                  <Form.Label className="mb-2 w-auto">
                    How Many Days Before Start Date
                  </Form.Label>
                  <Row>
                    <Col sm={6}>
                      <InputGroup className="numCounter mb-0">
                        <NumCounter
                          value={formik?.values?.is_pre_start_days}
                          name="is_pre_start_days"
                          onChange={(newValue) => {
                            // eslint-disable-next-line no-undef
                            formik?.setFieldValue(
                              "is_pre_start_days",
                              newValue || ""
                            );
                          }}
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                </Form.Group>
              </div>
            )}
          </Col>

          <Col lg={6}>
            <Form.Group className="form-group d-flex align-items-center justify-content-between mb-2">
              <Form.Label className="mb-0 w-auto">
                Set Automatic Reminder
              </Form.Label>
              <div className="switchBtn">
                <InputField
                  type="checkbox"
                  id="setAutomatic"
                  checked={setAutomaticChecked}
                  name="is_reminder"
                  onChange={() => setSetAutomaticChecked(!setAutomaticChecked)}
                  disabled={disableFlag}
                />
                {formik?.touched?.is_reminder && formik?.errors?.is_reminder ? (
                  <div className="error mt-1 text-danger">
                    {formik?.errors?.is_reminder}
                  </div>
                ) : null}
                <Form.Label htmlFor="setAutomatic" />
              </div>
            </Form.Group>

            {setAutomaticChecked && (
              <div className="mt-lg-3 mt-1" id="setAutomaticContent">
                <Form.Group className="form-group">
                  <Form.Label className="mb-2 w-auto">Reminder(S)</Form.Label>
                </Form.Group>

                <Row className="mobileCols g-2">
                  <Col>
                    <Form.Group className="form-group">
                      <SelectField
                        name="is_reminder_type"
                        options={reminderOptions}
                        placeholder="Interval"
                        onChange={handleReminderChange}
                        value={reminderOptions.find(
                          (option) => option?.value === selectedReminder
                        )}
                      />
                      {formik.errors.is_reminder_type &&
                        formik.touched.is_reminder_type && (
                          <div className="error">
                            {formik.errors.is_reminder_type}
                          </div>
                        )}
                    </Form.Group>
                  </Col>
                  {selectedReminder === "once" && (
                    <Col>
                      <Form.Group className="flatpickr form-group mb-0">
                        <div className="flatpickr_wrap">
                          <Flatpickr
                            className="form-control date-range"
                            placeholder="MM/DD/YY"
                            name="is_reminder_complete_date"
                            value={formik.values.is_reminder_complete_date}
                            onChange={(date) =>
                              formik.setFieldValue(
                                "is_reminder_complete_date",
                                date[0] || ""
                              )
                            }
                            options={{
                              dateFormat: "m-d-Y",
                              // minDate: "today",
                            }}
                          />
                          {formik.errors.is_reminder_complete_date &&
                            formik.touched.is_reminder_complete_date && (
                              <div className="error">
                                {formik.errors.is_reminder_complete_date}
                              </div>
                            )}
                          <em className="icon-calendar rightIcon" />
                        </div>
                      </Form.Group>
                    </Col>
                  )}
                  {selectedReminder === "interval" && (
                    <>
                      <Col>
                        <InputGroup className="numCounter mb-0">
                          <NumCounter
                            value={formik?.values?.is_reminder_complete_days}
                            name="is_reminder_complete_days"
                            onChange={(newValue) => {
                              // eslint-disable-next-line no-undef
                              formik?.setFieldValue(
                                "is_reminder_complete_days",
                                newValue || ""
                              );
                            }}
                          />
                        </InputGroup>
                      </Col>
                      <Col>
                        <Form.Group className="form-group">
                          <SelectField
                            name="is_reminder_occurance_interval_type"
                            options={daysOptions}
                            placeholder="Interval"
                            onChange={(selected) =>
                              formik.setFieldValue(
                                "is_reminder_occurance_interval_type",
                                selected?.value || ""
                              )
                            }
                            value={daysOptions.find(
                              (option) =>
                                option?.value ===
                                formik?.values
                                  ?.is_reminder_occurance_interval_type
                            )}
                          />
                          {formik?.errors
                            ?.is_reminder_occurance_interval_type &&
                            formik?.touched
                              ?.is_reminder_occurance_interval_type && (
                              <div className="error">
                                {
                                  formik?.errors
                                    ?.is_reminder_occurance_interval_type
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                    </>
                  )}
                </Row>
              </div>
            )}
          </Col>
        </Row>

        {/*If department has schedule, show a warning*/}
        <BasicAlert
          title={alertMessage}
          text={"The selected department already has a schedule."}
          show={isAlertVisible}
          icon="warning"
          setIsAlertVisible={setIsAlertVisible}
          buttonText="OK"
        />

        {/*Alert if pre start mail not configured*/}
         <BasicAlert
          title={preStartMsg}
          text={"Please configure Pre-Start email content for this survey."}
          show={isPreStartAlert}
          icon="warning"
          setIsAlertVisible={setIsPreStartAlert}
          buttonText="OK"
        />

        <div className="form-btn d-flex gap-2 justify-content-end pt-2">
          <Button
            type="button"
            variant="secondary"
            className="ripple-effect"
            onClick={onHandleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="ripple-effect"
            disabled={disableFlag}
          >
            {isSubmitting ? "Submitting..." : modalHeader}
          </Button>
        </div>
      </Form>
    </ModalComponent>
  );
};

export default ScheduleAddModal;
