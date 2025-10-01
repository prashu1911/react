import React, { useState, useEffect } from "react";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import Flatpickr from "react-flatpickr";
import { useFormik } from "formik";
import { commonService } from "services/common.service";
import { Distribution } from "apiEndpoints/Distribution";
import { formatDate } from "utils/common.util";
import {
  Button,
  SelectField,
  ModalComponent,
  InputField,
  NumCounter,
  BasicAlert,
} from "../../../../../components";

const ScheduleEditModal = ({
  modalHeader,
  show,
  size,
  onHandleCancel,
  onSubmitSuccess,
  reminderOptions,
  initialData,
  validationSchedule,
  userData,
  selectedCompanyId
}) => {
  // State variables for toggle elements
  const [preStartChecked, setPreStartChecked] = useState(
    Boolean(initialData?.is_pre_start_email)
  );
  const [setAutomaticChecked, setSetAutomaticChecked] = useState(
    Boolean(initialData?.is_reminder)
  );
  const [selectedReminder, setSelectedReminder] = useState(
    initialData?.is_reminder_type === 1 ? "once" : "interval"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isPreStartInvalid, setIsPreStartInvalid] = useState(false);
  const alertMessage = "Invalid Pre-Start Mail Configuration";

  // Trigger the Pre Start check on opening the modal
  useEffect(() => {
    if (show) {
      handlePreStartCheck();
    }
  }, [show]);

  // days options
  const daysOptions = [
    { value: 1, label: "Day" },
    { value: 2, label: "Week" },
  ];

  const handleReminderChange = (selectedOption) => {
    setSelectedReminder(selectedOption.value);
    // eslint-disable-next-line no-use-before-define
    formik.setFieldValue("is_reminder_occurance_interval_type", 1);
    // eslint-disable-next-line no-use-before-define
    formik.setFieldValue("is_reminder_complete_days", 1);
  };

  // Form Submission Handler
  const handleSubmitSchedule = async (values, { resetForm }) => {
    try {
      setIsSubmitting(true);
      let payload = {
        surveyScheduleID: initialData?.surveyScheduleID,
        departmentID: initialData?.departmentID,
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
            ? values?.is_reminder_occurance_interval_type
            : "",
        // isCompleteOccuranceIntervalType:
        //   values?.is_reminder_occurance_interval_type ,
      };

      const response = await commonService({
        apiEndPoint: Distribution.updateSchedule,
        bodyData: payload,
        toastType: { success: true, error: true },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        onHandleCancel();
        resetForm();
        setIsSubmitting(false);
        onSubmitSuccess?.(); // Refresh list if form submitted
      } else {
        console.error("error");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  //API to check if survey has preStart mail configured
  const handlePreStartCheck = async () => {
    const queryParams = {
      companyID: selectedCompanyId,
      surveyID: initialData.surveyID,
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
        <h4 className="modalBody_title">Schedule START / STOP</h4>
        <Row className={`rowGap mb-xxl-4 mb-3 `}>
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
                      setIsAlertVisible(true); // Show the alert only on click
                      return; // prevent toggle
                    }
                    formik?.setFieldValue("is_pre_start_days", 1);
                    setPreStartChecked(!preStartChecked);
                  }}
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
                  onChange={() => {
                    setSetAutomaticChecked(!setAutomaticChecked);
                    formik?.setFieldValue("is_reminder_complete_days", 1);
                  }}
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
                                newValue || 1
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
                                selected?.value || 1
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

        <div className="form-btn d-flex gap-2 justify-content-end pt-2">
          <Button
            type="button"
            variant="secondary"
            className="ripple-effect"
            onClick={onHandleCancel}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="ripple-effect">
            {isSubmitting ? "Editting..." : modalHeader}
          </Button>
          <BasicAlert
            title={alertMessage}
            text={"Please configure Pre-Start email content for this survey."}
            show={isAlertVisible}
            icon="warning"
            setIsAlertVisible={setIsAlertVisible}
            buttonText="OK"
          />
        </div>
      </Form>
    </ModalComponent>
  );
};

export default ScheduleEditModal;
