import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import {
  Button,
  InputField,
  ModalComponent,
  SelectField,
} from "../../../../../../components";

const AddToResourceModel = ({
  show,
  onClose,
  formik,
  setFormData,
  surveyType,
  setShowBankAttributes,
  questionType
}) => {
  // Local state to store user input before committing to formik
  const [localSurveyType, setLocalSurveyType] = useState(
    formik?.values?.surveyType
  );
  const [localKeyWord, setLocalKeyWord] = useState(formik?.values?.keyWord);
  const ISMODAL = true;

  // Handle Add Button Click
  const handleAdd = () => {
    if (questionType === 'm') {
      setFormData(prevData => ({
        ...prevData,
        surveyType: localSurveyType,
        keyWord: localKeyWord,
      }));
    } else {
      formik.setValues({
        ...formik.values,
        surveyType: localSurveyType,
        keyWord: localKeyWord,
      });

    }
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
                isModal={ISMODAL}
                name="surveyType"
                // onChange={(option) =>
                //   formik.setFieldValue("surveyType", option.value)
                // }
                // value={surveyType.find(
                //   (option) => option.value === formik.values.surveyType
                // )}

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
                // onChange={formik.handleChange}
                // value={formik.values.keyWord}
                onChange={(e) => setLocalKeyWord(e.target.value)}
                value={localKeyWord}
              />
              {formik?.touched?.keyWord && formik?.errors?.keyWord && (
                <div className="error mt-1 text-danger">
                  {formik?.errors?.keyWord}
                </div>
              )}
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

export default AddToResourceModel;
