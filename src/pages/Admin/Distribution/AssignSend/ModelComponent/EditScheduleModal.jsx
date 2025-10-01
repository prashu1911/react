import React, { useEffect, useState } from "react";
import { Form, Row, Col, InputGroup } from "react-bootstrap";
import { decodeHtmlEntities } from "utils/common.util";

import Flatpickr from "react-flatpickr";
import {
  Button,
  InputField,
  ModalComponent,
  NumCounter,
  SelectField,
  BasicAlert
} from "../../../../../components";

const EditScheduleModal = ({
  showeEditSch,
  editSchClose,
  reminder,
  daysOptions,
  modalData,
  onSubmit,
  isSubmitting,
  isPreStartInvalid
}) => {
  // Initialize state with modalData values

  const [formData, setFormData] = useState({});
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const alertMessage = "Invalid Pre-Start Mail Configuration";

  useEffect(() => {
    setFormData({
      start_date: modalData?.startDate
        ? [new Date(modalData.startDate)]
        : [new Date()],
      end_date: modalData?.endDate
        ? [new Date(modalData.endDate)]
        : [new Date()],
      preStartChecked: modalData?.isPreStart === 1,
      is_pre_start_days: modalData?.preStartDays,
      setAutomaticChecked: modalData?.isReminder === 1,
      selectedReminder: modalData?.reminderToStart === 1 ? "once" : "interval",
      is_reminder_complete_date: modalData?.reminderToStartDate
        ? [new Date(modalData.reminderToStartDate)]
        : [new Date()],
      is_reminder_complete_days: modalData?.reminderIntervalStart || 1,
      is_reminder_occurance_interval_type:
        modalData?.isCompleteOccuranceIntervalType === 1 ? "Day" : "Week",
    });
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, {
      resetForm: () =>
        setFormData({
          start_date: [new Date()],
          end_date: [new Date()],
          preStartChecked: false,
          is_pre_start_days: 0,
          setAutomaticChecked: false,
          selectedReminder: "once",
          is_reminder_complete_date: [new Date()],
          is_reminder_complete_days: 1,
          is_reminder_occurance_interval_type: "Day",
        }),
    });
  };

  const handleInputChange = (name, value) => {
 

    if (name === 'preStartChecked') {
      if (value) {
        setFormData((prev) => ({
          ...prev,
          is_pre_start_days: 1,[name]: value,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          is_pre_start_days: 0,[name]: value,
        }));
      }
    } else {
   
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <ModalComponent
      modalHeader="Edit Schedule"
      extraBodyClassName="modalBody pt-0"
      size="lg"
      show={showeEditSch}
      onHandleCancel={editSchClose}
    >
      <Form onSubmit={handleFormSubmit}>
        <Form.Group className="form-group">
          <Form.Label>Survey: {decodeHtmlEntities(modalData?.surveyName)}</Form.Label>
          <Form.Label>Department: {decodeHtmlEntities(modalData?.departmentName)}</Form.Label>
        </Form.Group>

        <h4 className="modalBody_title">Schedule START / STOP</h4>

        <Row className="rowGap mb-xxl-4 mb-3">
          <Col lg={6}>
            <Form.Group className="flatpickr form-group mb-0">
              <Form.Label>Surveys Start Date</Form.Label>
              <div className="flatpickr_wrap">
                <Flatpickr
                  className="form-control date-range"
                  value={formData.start_date}
                  onChange={(date) => handleInputChange("start_date", date)}
                  options={{
                    dateFormat: "m-d-Y",
                    disableMobile: "true",
                  }}
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
                  value={formData.end_date}
                  onChange={(date) => handleInputChange("end_date", date)}
                  options={{
                    dateFormat: "m-d-Y",
                    disableMobile: "true",
                  }}
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
                  checked={formData.preStartChecked}
                  onChange={() =>{
                    if (isPreStartInvalid){
                      setIsAlertVisible(true); // Show the alert only on click
                      return; // prevent toggle
                    }
                    handleInputChange(
                      "preStartChecked",
                      !formData.preStartChecked
                    )
                  }}
                />
                <Form.Label htmlFor="preStart" />
              </div>
            </Form.Group>

            {formData.preStartChecked && (
              <div className="mt-lg-3 mt-1" id="preStartContent">
                <Form.Group className="form-group">
                  <Form.Label className="mb-2 w-auto">
                    How Many Days Before Start Date
                  </Form.Label>
                  <Row>
                    <Col xs={6}>
                      <InputGroup className="numCounter mb-0">
                        <NumCounter
                          value={formData.is_pre_start_days}
                          onChange={(value) =>
                            handleInputChange("is_pre_start_days", value)
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
                  checked={formData.setAutomaticChecked}
                  onChange={() =>
                    handleInputChange(
                      "setAutomaticChecked",
                      !formData.setAutomaticChecked
                    )
                  }
                />
                <Form.Label htmlFor="setAutomatic" />
              </div>
            </Form.Group>

            {formData.setAutomaticChecked && (
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
                        value={reminder.find(
                          ({ value }) => value === formData.selectedReminder
                        )}
                        onChange={(selectedOption) =>
                          handleInputChange(
                            "selectedReminder",
                            selectedOption?.value
                          )
                        }
                      />
                    </Form.Group>
                  </Col>
                  {formData.selectedReminder === "once" && (
                    <Col>
                      <Form.Group className="flatpickr form-group mb-0">
                        <div className="flatpickr_wrap">
                          <Flatpickr
                            className="form-control date-range"
                            value={formData.is_reminder_complete_date}
                            onChange={(date) =>
                              handleInputChange(
                                "is_reminder_complete_date",
                                date
                              )
                            }
                            placeholder="MM/DD/YY"
                            options={{
                              dateFormat: "m-d-Y",
                              disableMobile: "true",
                            }}
                          />
                          <em className="icon-calendar-outline rightIcon" />
                        </div>
                      </Form.Group>
                    </Col>
                  )}
                  {formData.selectedReminder === "interval" && (
                    <Col>
                      <InputGroup className="numCounter mb-0">
                        <NumCounter
                          value={formData.is_reminder_complete_days}
                          onChange={(value) =>
                            handleInputChange(
                              "is_reminder_complete_days",
                              value
                            )
                          }
                        />
                      </InputGroup>
                    </Col>
                  )}
                  {formData.selectedReminder === "interval" && (
                    <Col>
                      <Form.Group className="form-group">
                        <SelectField
                          placeholder="Time"
                          options={daysOptions}
                          value={daysOptions.find(
                            ({ value }) =>
                              value ===
                              formData.is_reminder_occurance_interval_type
                          )}
                          onChange={(selectedOption) =>
                            handleInputChange(
                              "is_reminder_occurance_interval_type",
                              selectedOption.value
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
            onClick={editSchClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="ripple-effect"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update"}
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

export default EditScheduleModal;
