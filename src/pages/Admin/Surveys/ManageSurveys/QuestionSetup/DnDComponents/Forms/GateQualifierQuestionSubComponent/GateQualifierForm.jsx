import { Col, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useSurveyDataOnNavigations } from "customHooks";

import { commonService } from "services/common.service";
import { QuestionSetup } from "apiEndpoints/QuestionSetup";
import {
  Button,
  InputField,
  SelectField,
} from "../../../../../../../../components";

import {
  GateQualifierInitialValue,
  GateQualifierValidationSchema,
} from "../../../validation";
import AddToResourceModel from "../../../ModelComponent/AddToResourceModel";
import QuestionBankModal from "../../../ModelComponent/QuestionBankModal";

function GateQualifierForm({
  setActiveForm, // Add this prop
  handleJumpSequence,
  handleSaveAddNestedQuestion,
  userData,
  outcome,
  surveyID,
  companyID,
  initialQuestionData,
  setParentGateQuestionID,
  handleEditClose,
  setParentIntentionID,
  setParentIntentions,
  setParentIntentionShortName,
  surveyType,
  totalCount,
  usedCount,
  questionOptions,
  isGate
}) {
  // add question bank modal
  const [showBankAttributes, setShowBankAttributes] = useState(false);
  const [buttonClicked, setButtonClicked] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleCheckboxChange = (e) => {
    setShowBankAttributes(e.target.checked);
    // eslint-disable-next-line no-use-before-define
    formik.setFieldValue(`addToresource`, e.target.checked);
  };
  const { getSurveyDataOnNavigate } = useSurveyDataOnNavigations();
  const surevyData = getSurveyDataOnNavigate();
  const status = surevyData?.status !== 'Design';

  // Question Bank Modal start
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const questionBankClose = () => setShowQuestionBank(false);
  const questionBankShow = () => setShowQuestionBank(true);

  const [skipjumpOptions, setSkipjumpOptions] = useState([
    {
      value: "Yes",
      label: "Yes",
    },
    {
      value: "No",
      label: "No",
    },
  ]);

  const responseType = [
    { value: "Yes-No", label: "Yes - No" },
    { value: "True-False", label: "True - False" },
    { value: "Fair-Unfair", label: "Fair - Unfair" },
    { value: "Agree-Disagree", label: "Agree - Disagree" },
  ];

  const responseTypeDynamicFeilds = {
    "Yes-No": [
      {
        id: "Yes",
        response: "Yes",
      },
      {
        id: "No",
        response: "No",
      },
    ],
    "True-False": [
      {
        id: "True",
        response: "True",
      },
      {
        id: "False",
        response: "False",
      },
    ],
    "Fair-Unfair": [
      {
        id: "Fair",
        response: "Fair",
      },
      {
        id: "Unfair",
        response: "Unfair",
      },
    ],
    "Agree-Disagree": [
      {
        id: "Agree",
        response: "Agree",
      },
      {
        id: "Disagree",
        response: "Disagree",
      },
    ],
  };

  const skipjumpOptionsDynamicFeilds = {
    "Yes-No": [
      {
        value: "Yes",
        label: "Yes",
      },
      {
        value: "No",
        label: "No",
      },
    ],
    "True-False": [
      {
        value: "True",
        label: "True",
      },
      {
        value: "False",
        label: "False",
      },
    ],
    "Fair-Unfair": [
      {
        value: "Fair",
        label: "Fair",
      },
      {
        value: "Unfair",
        label: "Unfair",
      },
    ],
    "Agree-Disagree": [
      {
        value: "Agree",
        label: "Agree",
      },
      {
        value: "Disagree",
        label: "Disagree",
      },
    ],
  };

  const handleSelectChange = (value) => {
    // eslint-disable-next-line no-use-before-define
    formik.setFieldValue(`responsesType`, value);
    // eslint-disable-next-line no-use-before-define
    formik.setFieldValue(`responses`, responseTypeDynamicFeilds[value]);

    // eslint-disable-next-line no-use-before-define
    formik.setFieldValue(
      `jumpSequence`,
      responseTypeDynamicFeilds[value][0]?.id
    );

    setSkipjumpOptions(skipjumpOptionsDynamicFeilds[value]);
  };

  const handleCancel = () => {
    if (initialQuestionData?.questionID) {
      handleEditClose();
    } else {
      setActiveForm([]);
    }
  };

  function convertResponseData(data) {
    if (data.length === 0) return [];

    return data.map((item) => {
      return {
        response: item.response,
      };
    });
  }

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsSubmitting(true);
      const payload = {
        companyMasterID: userData?.companyMasterID,
        companyID,
        surveyID,
        outcomeID: outcome?.id,
        isScore: 1,
        intentionName: values?.intentions,
        intentionShortName: values?.intentionsShortName,
        question: values?.question,
        isSkip: values?.displaySkipForNow,
        scale: 2,
        allResponse: convertResponseData(values?.responses),
        jumpSequenceSkip: values?.jumpSequence,
        isQuestionAddedToResource: values?.addToresource ? 1 : 0,
        surveyTypeID: values?.surveyType,
        keywords: values?.keyWord,
      };

      // Add questionID to payload if in edit mode
      if (initialQuestionData?.questionID) {
        payload.questionID = initialQuestionData.questionID;
      }

      const apiEndPoint = initialQuestionData
        ? QuestionSetup.updateGateQulifier
        : QuestionSetup.createGateQulifier;

      const response = await commonService({
        apiEndPoint,
        bodyData: payload,
        toastType: { success: true, error: false },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        if (!initialQuestionData) {
          resetForm();
        }
        setIsSubmitting(false);
        setParentGateQuestionID(
          response?.data?.result?.questionID || initialQuestionData?.questionID
        );
        setParentIntentions(values?.intentions);
        setParentIntentionID(
          response?.data?.result?.intentionID ||
          initialQuestionData?.intentionID
        );
        setParentIntentionShortName(values?.intentionsShortName);
        if (buttonClicked === "Save&AddRatingQuestion") {
          handleJumpSequence(
            response?.data?.result?.questionID ||
            initialQuestionData?.questionID
          );
        } else {
          handleSaveAddNestedQuestion(
            response?.data?.result?.questionID ||
            initialQuestionData?.questionID
          );
        }
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error handling gate qualifier:", error);
      setIsSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: GateQualifierInitialValue(),
    validationSchema: GateQualifierValidationSchema(),
    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (initialQuestionData) {
      formik.setValues({
        question: initialQuestionData.question || "",
        intentions: initialQuestionData.intentionName || "",
        intentionsShortName: initialQuestionData.intentionShortName || "",
        displaySkipForNow: initialQuestionData.isSkip || false,
        responsesType: initialQuestionData.responseType || "Yes-No",
        responses:
          initialQuestionData.allResponse ||
          responseTypeDynamicFeilds["Yes-No"],
        jumpSequence: initialQuestionData.jumpSequenceSkip,
        addToresource: initialQuestionData.isQuestionAddedToResource === 1,
        surveyType: initialQuestionData.surveyTypeID || "",
        keyWord: initialQuestionData.keywords || "",
      });

      // Update the UI state for question bank attributes
      setShowBankAttributes(
        initialQuestionData.isQuestionAddedToResource === 1
      );

      // Update skip jump options based on response type
      if (initialQuestionData.responseType) {
        setSkipjumpOptions(
          skipjumpOptionsDynamicFeilds[initialQuestionData.responseType]
        );
      }
    }
  }, [initialQuestionData]);

  const handleAddQuestion = (row) => {
    formik.setFieldValue("question", row?.question);
    questionBankClose();
  };

   const commaText = usedCount > 0 && ((totalCount - usedCount) > 0) ? ',' : ""

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <>
          <div className="d-flex align-items-start justify-content-between flex-wrap mb-xl-2 mb-3">
            <div className="me-2">
              <h4 className="ratingQuestion_Head">Gate Qualifier Question</h4>
              {/* <p className="ratingQuestion_Para mb-2">
                {usedCount} Questions added so far, {totalCount - usedCount}{" "}
                Questions can be added.
              </p> */}
              <p className="ratingQuestion_Para mb-2">
                {usedCount > 0 && (<> {usedCount} Questions added so far</>)}
                {(totalCount - usedCount) > 0 && (
                  <>{commaText}&nbsp;{totalCount - usedCount} Questions can be added.</>
                )}
              </p>
            </div>

            <Button
              variant="outline-primary"
              className="ripple-effect"
              onClick={questionBankShow}
              disabled={status}
            >
              <em className="icon-import me-2 d-sm-block d-none" />
              Import from Question Bank
            </Button>
          </div>
          <Row className="gy-3 gx-2">
            <Col sm={12}>
              <Form.Group className="form-group mb-0">
                <div className="d-flex justify-content-between mb-2 flex-sm-row flex-column-reverse">
                  <Form.Label className="mb-0">Question</Form.Label>
                  <Form.Group
                    className="form-group mb-sm-0 mb-2 flex-shrink-0"
                    controlId="skip1"
                  >
                    <Form.Check
                      className="me-0"
                      type="checkbox"
                      label={<div> Add Question To Resource </div>}
                      onClick={handleCheckboxChange}
                      disabled={status}
                    />
                  </Form.Group>
                </div>
                <InputField
                  type="text"
                  placeholder="Enter Question"
                  name="question"
                  onChange={formik.handleChange}
                  value={formik.values.question}
                  disabled={status}
                />
                {formik.touched.question && formik.errors.question && (
                  <div className="error mt-1 text-danger">
                    {formik.errors.question}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="form-group mb-0">
                <Form.Label className="mb-2">
                  Intentions <sup>*</sup>
                </Form.Label>
                <InputField
                  type="text"
                  placeholder="Enter Question"
                  name="intentions"
                  onChange={formik.handleChange}
                  value={formik.values.intentions}
                  disabled={status}
                />
                {formik.touched.intentions && formik.errors.intentions && (
                  <div className="error mt-1 text-danger">
                    {formik.errors.intentions}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="form-group mb-0">
                <Form.Label className="mb-2">
                  Intentions Short Name <sup>*</sup>
                  <Link to="#!" className="p-0">
                    <OverlayTrigger
                      overlay={
                        <Tooltip id="tooltip-disabled">
                          Provide a short name to be used in reports and chart.
                        </Tooltip>
                      }
                    >
                      <span className="d-inline-block ms-1">
                        <em
                          disabled
                          style={{ pointerEvents: "none" }}
                          className="icon-info-circle"
                        />
                      </span>
                    </OverlayTrigger>
                  </Link>
                </Form.Label>
                <InputField
                  type="text"
                  placeholder="Enter Question"
                  name="intentionsShortName"
                  onChange={formik.handleChange}
                  value={formik.values.intentionsShortName}
                  disabled={status}
                />
                {formik.touched.intentionsShortName &&
                  formik.errors.intentionsShortName && (
                    <div className="error mt-1 text-danger">
                      {formik.errors.intentionsShortName}
                    </div>
                  )}
              </Form.Group>
            </Col>
          </Row>
          <div className=" mt-3 pt-1">
            <Form.Group className="form-group switchaxis d-flex align-items-center">
              <Form.Label className="mb-0 me-xl-3 me-2 w-auto">
                Display Skip For Now <sup>*</sup>
              </Form.Label>
              <div className="switchBtn switchBtn-success switchBtn-label-nf">
                <InputField
                  type="checkbox"
                  id="switchaxis1"
                  className="p-0"
                  name="displaySkipForNow"
                  onChange={formik.handleChange}
                  checked={formik.values.displaySkipForNow}
                  
                />
                <label htmlFor="switchaxis1" />
              </div>
              {formik.touched.displaySkipForNow &&
                formik.errors.displaySkipForNow && (
                  <div className="error mt-1 text-danger">
                    {formik.errors.displaySkipForNow}
                  </div>
                )}
            </Form.Group>
          </div>
          <Row className="gx-2">
            <Col sm={6}>
              <Form.Group className="form-group">
                <Form.Label className="mb-2 d-flex align-items-center">
                  Response Type <sup>*</sup>
                  <Link to="#!" className="p-0">
                    <OverlayTrigger
                      overlay={
                        <Tooltip id="tooltip-disabled">
                          Use list value Free Form to create custom response
                          type.
                        </Tooltip>
                      }
                    >
                      <span className="d-flex ms-1">
                        <em
                          disabled
                          style={{ pointerEvents: "none" }}
                          className="icon-info-circle"
                        />
                      </span>
                    </OverlayTrigger>
                  </Link>
                </Form.Label>

                <SelectField
                  placeholder="Select Response Type"
                  name="responsesType"
                  options={responseType}
                  disabled={status}
                  onChange={(option) => handleSelectChange(option?.value)}
                  value={responseType.find(
                    (type) => type.value === formik.values.responsesType
                  )}
                />
                {formik.touched.responsesType &&
                  formik.errors.responsesType && (
                    <div className="error mt-1 text-danger">
                      {formik.errors.responsesType}
                    </div>
                  )}
              </Form.Group>
            </Col>
          </Row>
          <div className="mb-lg-0 mb-md-3 mb-2 scalarSecCover">
            <div className="scalarSec scalarappend">
              <div className="d-flex gap-2 mb-0 align-items-center">
                <div className="sequence title">Sl.No.</div>
                <div className="scalar title">Response </div>
              </div>
              {formik.values.responses.map((item, index) => (
                <div
                  className="scalarappend_list d-flex gap-2 align-items-center"
                  key={index}
                >
                  <div className="sequence"> {index + 1}</div>
                  <Form.Group className="form-group scalar">
                    <InputField
                      type="text"
                      placeholder="Enter Response"
                      value={item.response}
                      disabled
                    />
                  </Form.Group>
                </div>
              ))}
            </div>
          </div>
          <div className="d-flex justify-content-between gap-2 flex-wrap">
            <div className="jumpSequence d-flex align-items-center gap-2 flex-wrap">
              <p className="mb-0">If The Response Is</p>
              <SelectField
                options={skipjumpOptions}
                placeholder="Select Response"
                value={skipjumpOptions.find(
                  (option) => option.value === formik.values.jumpSequence
                )}
                onChange={(option) =>
                  formik.setFieldValue(`jumpSequence`, option.value)
                }
                disabled={status}
              />
              <p className="mb-0">Skip Jump Sequence Questions.</p>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-3 flex-wrap">
              <Button
                variant="secondary"
                className="ripple-effect"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              {!initialQuestionData && (
                <Button
                  variant="primary"
                  className="ripple-effect"
                  onClick={() => {
                    formik.handleSubmit();
                    setButtonClicked("Save&AddRatingQuestion");
                  }}
                >
                  {isSubmitting && buttonClicked === "Save&AddRatingQuestion"
                    ? "Saving..."
                    : "Save & Add Rating Question"}
                </Button>
              )}

              <Button
                variant="primary"
                className="ripple-effect"
                onClick={() => {
                  formik.handleSubmit();
                  setButtonClicked("Save&AddNestedQuestion");
                }}
              >
                {isSubmitting && buttonClicked === "Save&AddNestedQuestion"
                  ? "Saving..."
                  : initialQuestionData
                    ? "Update"
                    : "Save & Add Nested Question"}
              </Button>
            </div>
          </div>
        </>
      </Form>

      {showQuestionBank && (
        <QuestionBankModal
          showQuestionBank={showQuestionBank}
          questionBankClose={questionBankClose}
          questionOptions={questionOptions}
          surveyOptions={surveyType}
          userData={userData}
          openFrom="Gate Qualifier"
          handleAddQuestion={handleAddQuestion}
          surveyID={surveyID}
          companyID={companyID}
          questionType="g"
        />
      )}

      {/* Add Question Bank Attributes modal */}
      {showBankAttributes && (
        <AddToResourceModel
          show={showBankAttributes}
          onClose={() => setShowBankAttributes(false)}
          formik={formik}
          surveyType={surveyType}
          setShowBankAttributes={setShowBankAttributes}
        />
      )}
    </>
  );
}

export default GateQualifierForm;
