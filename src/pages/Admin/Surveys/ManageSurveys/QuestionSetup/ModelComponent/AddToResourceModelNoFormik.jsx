import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import {
  Button,
  InputField,
  ModalComponent,
  SelectField,
} from "../../../../../../components";

const AddToResourceModelNoFormik = ({
  show,
  onClose,
  formData,
  setFormData,
  surveyType,
  setShowBankAttributes,
}) => {
  // Local state to store user input before committing to formData
  const [localSurveyType, setLocalSurveyType] = useState(formData?.surveyType);
  const [localKeyWord, setLocalKeyWord] = useState(formData?.keyWord);

  // Handle Add Button Click
  const handleAdd = () => {
    setFormData((prevData) => ({
      ...prevData,
      surveyType: localSurveyType,
      keywords: localKeyWord,
    }));

    setShowBankAttributes(false); // Close modal
  };

  return (
    <ModalComponent
      modalHeader="Add Question Bank Attributes"
      extraBodyClassName="bankAttributes"
      size="lg"
      show={show}
      onHandleCancel={onClose}
    >
      <Form>
        <Row className="rowGap">
          {/* Survey Type */}
          <Col lg={6}>
            <Form.Group className="form-group">
              <Form.Label>Survey Type</Form.Label>
              <SelectField
                placeholder="Select Survey Type"
                options={surveyType}
                name="surveyType"
                onChange={(option) => setLocalSurveyType(option.value)}
                value={surveyType.find(
                  (option) => option.value === localSurveyType
                )}
              />
            </Form.Group>
          </Col>

          {/* Keywords */}
          <Col lg={6}>
            <Form.Group className="form-group">
              <Form.Label>Keywords</Form.Label>
              <InputField
                type="text"
                placeholder="Enter Keywords"
                name="keyWord"
                onChange={(e) => setLocalKeyWord(e.target.value)}
                value={localKeyWord}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Buttons */}
        <div className="d-flex gap-2 justify-content-end mt-3">
          <Button
            type="button"
            variant="warning"
            className="ripple-effect"
            onClick={handleAdd}
            disabled={!localSurveyType}
          >
            Add
          </Button>
          <Button
            type="button"
            variant="primary"
            className="ripple-effect"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </Form>
    </ModalComponent>
  );
};

export default AddToResourceModelNoFormik;
