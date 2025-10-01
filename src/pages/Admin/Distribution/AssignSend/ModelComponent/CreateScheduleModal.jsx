import React, { useState, useEffect } from "react";
import { Form, Row, Col, InputGroup } from "react-bootstrap";
import Flatpickr from "react-flatpickr";
import { useFormik } from "formik";
import {
  Button,
  InputField,
  ModalComponent,
  NumCounter,
  SelectField,
  BasicAlert,
} from "../../../../../components";

const CreateScheduleModal = ({
  showeCreateSch,
  createSchClose,
  reminder,
  daysOptions,
  modalData,
  departmentOptions,
  validationSchedule,
  onSubmit,
  isSubmitting,
  alertConfirmed, // New prop
  isPreStartInvalid,
}) => {
  const [preStartChecked, setPreStartChecked] = useState(false);
  const [setAutomaticChecked, setSetAutomaticChecked] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState("once");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const alertMessage = "Invalid Pre-Start Mail Configuration";

  const formik = useFormik({
    initialValues: {
      start_date: "",
      end_date: "",
      is_pre_start_days: 0,
      is_reminder_complete_date: "",
      is_reminder_complete_days: 0,
      is_reminder_occurance_interval_type: "",
    },
    validationSchema: validationSchedule,
    onSubmit: (values, formikHelpers) => {
     
      onSubmit(
        {
          ...values,
          preStartChecked,
          setAutomaticChecked,
          selectedReminder
        },
        formikHelpers
      );
    },
  });

  const handleReminderChange = (selectedOption) => {
    setSelectedReminder(selectedOption.value);
    if (selectedOption.value === 'interval') {
      formik.setFieldValue(
        "is_reminder_complete_days",
        1
      )
    } else {
      formik.setFieldValue(
        "is_reminder_complete_days",
        0
      )
    }
    
  };

  // Decode html entities
  const htmlDecode = (str) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  };

  return (
    <ModalComponent
      modalHeader="Create Schedule"
      extraBodyClassName="modalBody pt-0"
      size="lg"
      show={showeCreateSch}
      onHandleCancel={createSchClose}
    >
      <Form onSubmit={formik.handleSubmit}>
        <Form.Group className="form-group">
          <Form.Label>Survey: {htmlDecode(modalData?.surveyName)}</Form.Label>
          {/* <Form.Label>Department: {departmentOptions?.length > 0 
            ? departmentOptions.map((dept) => dept.label).join(", ") 
            : "N/A"}
          </Form.Label> */}
          <Form.Label>Department: {!alertConfirmed ? htmlDecode(modalData?.departmentName) : departmentOptions?.length > 0 
            ? departmentOptions.map((dept) => htmlDecode(dept.label)).join(", ") 
            : "N/A"}
          </Form.Label>
        </Form.Group>

        <h4 className="modalBody_title">Schedule START / STOP</h4>

        <Row className="rowGap mb-xxl-4 mb-3">
          <Col lg={6}>
            <Form.Group className="flatpickr form-group mb-0">
              <Form.Label>Surveys Start Date</Form.Label>
              <div className="flatpickr_wrap">
                <Flatpickr
                  className="form-control date-range"
                  placeholder="MM/DD/YY"
                  options={{
                    dateFormat: "m-d-Y",
                    disableMobile: "true",
                  }}
                  value={formik.values.start_date}
                  onChange={(date) => formik.setFieldValue("start_date", date)}
                />
                <em className="icon-calendar-outline rightIcon" />
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
                  options={{
                    dateFormat: "m-d-Y",
                    disableMobile: "true",
                  }}
                  value={formik.values.end_date}
                  onChange={(date) => formik.setFieldValue("end_date", date)}
                />
                <em className="icon-calendar-outline rightIcon" />
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
                    onChange={() => {
                    if (isPreStartInvalid){
                      setIsAlertVisible(true); // Show the alert only on click
                      return; // prevent toggle
                    }
                    setPreStartChecked(!preStartChecked);
                    formik.setFieldValue(
                      "is_pre_start_days",
                      !preStartChecked ? 1 : 0
                    );
                  }}
                    
                />
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
                    <Col xs={6}>
                      <InputGroup className="numCounter mb-0">
                        <NumCounter
                          value={formik.values.is_pre_start_days}
                          onChange={(value) =>
                            formik.setFieldValue("is_pre_start_days", value)
                          }
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                </Form.Group>
              </div>
            )}
          </Col>

          <Col lg={6}>
            <Form.Group className="form-group d-flex align-items-center justify-content-between">
              <Form.Label className="mb-0 w-auto">
                Set Automatic Reminder
              </Form.Label>
              <div className="switchBtn">
                <InputField
                  type="checkbox"
                  id="setAutomatic"
                  checked={setAutomaticChecked}
                  onChange={() => setSetAutomaticChecked(!setAutomaticChecked)}
                />
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
                        placeholder="Select Reminder"
                        options={reminder}
                        onChange={handleReminderChange}
                      />
                    </Form.Group>
                  </Col>
                  {selectedReminder === "once" && (
                    <Col>
                      <Form.Group className="flatpickr form-group mb-0">
                        <div className="flatpickr_wrap">
                          <Flatpickr
                            className="form-control date-range"
                            placeholder="MM/DD/YY"
                            options={{
                              dateFormat: "m-d-Y",
                              disableMobile: "true",
                            }}
                            value={formik.values.is_reminder_complete_date}
                            onChange={(date) =>
                              formik.setFieldValue(
                                "is_reminder_complete_date",
                                date
                              )
                            }
                          />
                          <em className="icon-calendar-outline rightIcon" />
                        </div>
                      </Form.Group>
                    </Col>
                  )}
                  {selectedReminder === "interval" && (
                    <Col>
                      <InputGroup className="numCounter mb-0">
                        <NumCounter
                          value={formik.values.is_reminder_complete_days}
                          onChange={(value) =>
                            formik.setFieldValue(
                              "is_reminder_complete_days",
                              value
                            )
                          }
                        />
                      </InputGroup>
                    </Col>
                  )}
                  {selectedReminder === "interval" && (
                    <Col>
                      <Form.Group className="form-group">
                        <SelectField
                          placeholder="Time"
                          options={daysOptions}
                          value={daysOptions.find(
                            ({ value }) =>
                              value ===
                            formik.is_reminder_occurance_interval_type
                          )}
                          onChange={(option) =>
                            formik.setFieldValue(
                              "is_reminder_occurance_interval_type",
                              option.value
                            )
                          }
                        />
                      </Form.Group>
                    </Col>
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
            onClick={createSchClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            className="ripple-effect"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
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

export default CreateScheduleModal;
