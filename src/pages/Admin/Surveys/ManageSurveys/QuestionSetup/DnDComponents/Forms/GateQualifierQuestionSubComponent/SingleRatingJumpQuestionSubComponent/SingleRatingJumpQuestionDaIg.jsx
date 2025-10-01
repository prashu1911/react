import React, { useState, useRef } from "react";
import { Row, Col, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { commonService } from "services/common.service";
import { QuestionSetup } from "apiEndpoints/QuestionSetup";
import { useSurveyDataOnNavigations } from "customHooks";
import { toast } from "react-hot-toast";
import {
  Button,
  ImageElement,
  InputField,
  SelectField,
} from "../../../../../../../../../components";
import {
  SingleRatingGateQulifierQuestionInitialValue,
  SingleRatingGateQulifierQuestionValidationSchema,
} from "../../../../validation";
import AddToResourceModel from "../../../../ModelComponent/AddToResourceModel";
import QuestionBankModal from "../../../../ModelComponent/QuestionBankModal";
import ResponseViewTooltip from "../../../../Tooltip";

const SingleRatingJumpQuestionDaIg = ({
  handleCommunicationQuestions,
  parentGateQuestionID,
  parentIntentions,
  parentIntentionShortName,
  responseType,
  grouppedData,
  surveyType,
  userData,
  outcome,
  surveyID,
  companyID,
  fetchQuestion,
  questionOptions,
  parentIntentionID,
  questionType,
  edit,
}) => {
  const submitTypeRef = useRef("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getSurveyDataOnNavigate } = useSurveyDataOnNavigations();
  const surevyData = getSurveyDataOnNavigate();
  const rangeStart = Number.isNaN(Number(surevyData?.rangeEnd))
    ? 0
    : Number(surevyData?.rangeStart);
  const rangeEnd = Number.isNaN(Number(surevyData?.rangeEnd))
    ? 0
    : Number(surevyData?.rangeEnd);
  const [scale, setScale] = useState([]);
  const status = surevyData?.status !== "Design";

  const responseCategory = [
    { value: 1, label: "Positive" },
    { value: 2, label: "Neutral" },
    { value: 3, label: "Negative" },
  ];

  const [draggedItem, setDraggedItem] = useState(null);

  // add question bank modal
  const [showBankAttributes, setShowBankAttributes] = useState(false);
  const handleCheckboxChange = (e) => {
    setShowBankAttributes(e.target.checked);
    // eslint-disable-next-line no-use-before-define
    formik.setFieldValue("addQuestionToResource", e.target.checked);
  };

  // Question Bank Modal start
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const questionBankClose = () => setShowQuestionBank(false);
  const questionBankShow = () => setShowQuestionBank(true);

  function convertResponseData(data) {
    if (data.length === 0) return [];
    return data.map((item) => {
      return {
        response: item.response,
        responseWeightage: parseFloat(item.weightage).toFixed(2),
        responseCategory: item.category.toString(),
        isOEQ: item.hasOeq,
        oeqQuestion: item.openEndedQuestion || "",
      };
    });
  }

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const isValid = values?.responses.some((item) => {
        const weight = parseFloat(item.weightage);
        const range = parseFloat(rangeEnd);

        // Ensure both are valid numbers
        if (Number.isNaN(weight) || Number.isNaN(range)) return false;

        return weight === range;
      });

      if (values?.responses?.length < 2) {
        toast.error("Minimum two responses need to be added", {
          toastId: "response",
        });
        return;
      }

      if (!isValid && questionType) {
        toast.error(
          `At least one response weightage should match the range end (${rangeEnd})`,
          {
            toastId: "rangeEndMismatch",
          }
        );
        return;
      }
      setIsSubmitting(true);
      const payload = {
        companyMasterID: userData?.companyMasterID,
        questionID: parentGateQuestionID,
        companyID,
        surveyID,
        outcomeID: outcome?.id,
        isScore: questionType ? 1 : 0,
        intentionName: values?.intentions,
        intentionShortName: values?.intentionsShortName,
        selectionType: values?.type,
        question: values?.question,
        isSkip: false,
        isSlider:
          !questionType && values.type !== "Single Select Response"
            ? false
            : values?.responseViewOption === "slider",
        intentionID: parentIntentionID,
        scale: values?.scale,
        allResponse: convertResponseData(values?.responses),
        isQuestionAddedToResource: values?.addQuestionToResource ? 1 : 0,
        surveyTypeID: values?.surveyType,
        keywords: values?.keyWord,
        isResponseAddedToResource: values?.addToResource,
      };
      const response = await commonService({
        apiEndPoint: QuestionSetup.createRatingGateQualifierQuestion,
        bodyData: payload,
        toastType: { success: true, error: false },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setIsSubmitting(false);
        if (submitTypeRef.current === "Save & Add Question") {
          resetForm();
          fetchQuestion(parentGateQuestionID);
        } else if (submitTypeRef.current === "Save & Close Jump Block") {
          resetForm();
          fetchQuestion(parentGateQuestionID);
          handleCommunicationQuestions();
        }
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error add outcome:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      ...SingleRatingGateQulifierQuestionInitialValue(surevyData?.isSlider),
      intentions: parentIntentions,
      intentionsShortName: parentIntentionShortName,
    },
    validationSchema: SingleRatingGateQulifierQuestionValidationSchema(
      rangeStart,
      rangeEnd
    ),
    onSubmit: handleSubmit,
  });

  const getSurveyData = (data, key) => {
    // eslint-disable-next-line eqeqeq
    const responsesObject = data.find((value) => value?.responseTypeID == key);

    if (responsesObject && responsesObject?.responses?.length > 0) {
      return responsesObject?.responses;
    } else {
      return [];
    }
  };

  function convertResponseList(Data) {
    return Data.map((item, index) => ({
      id: index + 1,
      response: item.responseName,
      weightage:
        parseFloat(item.responseWeightage) === 0
          ? 0
          : parseFloat(item.responseWeightage).toFixed(2) || rangeEnd,
      category: item.responseCategory,
      hasOeq: item.isOEQ,
      openEndedQuestion: item.oeqQuestion,
    }));
  }
  const fetchResponseType = async (responseTypeID, scaleValue) => {
    try {
      const response = await commonService({
        apiEndPoint: QuestionSetup.getResponseType,
        queryParams: scaleValue
          ? { surveyID, companyID, responseTypeID, scale: scaleValue }
          : { surveyID, companyID, responseTypeID },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        const index = scaleValue ? 1 : 0;
        const responseData = response?.data?.data?.[index];
        if (!responseData) return;
        const rawScale = responseData.scale;
        if (!scaleValue) {
          const scaleResponse = Array.isArray(rawScale)
            ? rawScale.map((item) => ({ value: item, label: item }))
            : [];
          setScale(scaleResponse);
        }
        const responseList = responseData.responses;
        const convertedResponses = convertResponseList(responseList, rangeEnd);
        if (!questionType && formik.values?.type === "Rank Order Response") {
          const updatedRes = convertedResponses.map((ele) => ({
            ...ele,
            hasOeq: 0,
            openEndedQuestion: "",
          }));
          formik.setFieldValue("responses", updatedRes);
          formik.setFieldValue("scale", convertedResponses.length);
        } else {
          formik.setFieldValue("responses", convertedResponses);
          formik.setFieldValue("scale", convertedResponses.length);
        }
       
      }
    } catch (error) {
      console.error("Error add outcome:", error);
    }
  };
  const handleScale = (option) => {
    formik.setFieldValue("scale", option.value);
    fetchResponseType(formik?.values?.responseType, option.value);
  };

  const handleResponseType = (option) => {
    if (option.value == 123456789) {
      const ResponseList = getSurveyData(grouppedData, option.value);
      formik.setFieldValue("responses", convertResponseList(ResponseList));
      formik.setFieldValue("scale", ResponseList?.length);
    } else {
      fetchResponseType(option.value, null);
    }
    formik.setFieldValue("addToResource", false);
    formik.setFieldValue("responseBlockName", "");
    formik.setFieldValue("responseType", option.value);
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
    e.target.style.opacity = "0.4";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    return false;
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    const target = e.target.closest(".response-item");
    if (target) {
      target.classList.add("drag-over");
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    const target = e.target.closest(".response-item");
    if (target) {
      target.classList.remove("drag-over");
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const target = e.target.closest(".response-item");
    if (target) {
      target.classList.remove("drag-over");
    }

    if (draggedItem === null || draggedItem === dropIndex) return;

    const items = Array.from(formik.values.responses);
    const draggedItemContent = items[draggedItem];
    items.splice(draggedItem, 1);
    items.splice(dropIndex, 0, draggedItemContent);

    formik.setFieldValue("responses", items);
    setDraggedItem(null);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedItem(null);
    document.querySelectorAll(".response-item").forEach((item) => {
      item.classList.remove("drag-over");
    });
  };

  const handleCheckboxChangeOeq = (index) => {
    const newValue = !formik.values.responses[index].hasOeq;
    formik.setFieldValue(`responses.${index}.hasOeq`, newValue);
    if (!newValue) {
      formik.setFieldValue(`responses.${index}.openEndedQuestion`, "");
    }
  };

  const handleAddRow = () => {
    const newResponses = [...formik.values.responses];
    const newResponses22 = [...formik.values.responses];
    let isOutOfRange = false;
    newResponses22.forEach((response) => {
      const weightage = Number(response.weightage); // Ensure it's a number

      if (weightage < rangeStart || weightage > rangeEnd) {
        isOutOfRange = true;
      }
    });
    if (isOutOfRange) {
      toast.error(
        `Value Range Should be In between ${rangeStart} - ${rangeEnd}`,
        {
          toastId: "error001",
        }
      );
      return true;
    }
    const weightageAvg = rangeEnd / (newResponses?.length + 1);
    newResponses.push({
      id: Date.now().toString(),
      response: "",
      // weightage: 1,
      weightage: 1,
      category: 1,
      hasOeq: false,
      openEndedQuestion: "",
    });
    const updateResponses = newResponses.map((item, index) => {
      const responseLength = index + 1;
      return {
        ...item,
        weightage: parseFloat((weightageAvg * responseLength).toFixed(2)),
      };
    });
    formik.setFieldValue("responses", updateResponses);
    formik.setFieldValue("scale", newResponses?.length);
    formik?.setFieldValue(`addToResource`, false);
    formik?.setFieldValue(`responseBlockName`, "");
  };

  const handleDeleteRow = (index) => {
    if (formik.values.responses.length > 1) {
      const newResponses = formik.values.responses.filter(
        (_, i) => i !== index
      );
      const weightageAvg = rangeEnd / newResponses?.length;
      const updateResponses = newResponses.map((item, i) => {
        const responseLength = i + 1;
        return {
          ...item,
          weightage: parseFloat((weightageAvg * responseLength).toFixed(2)),
        };
      });
      formik.setFieldValue("responses", updateResponses);
      formik?.setFieldValue(`addToResource`, false);
      formik?.setFieldValue(`responseBlockName`, "");
    }
  };

  const handleSave = (type) => {
    submitTypeRef.current = type;
    formik.handleSubmit();
  };

  const handleAddQuestion = (row) => {
    formik.setFieldValue("question", row?.question);
    questionBankClose();
  };

  const handleAddResponseBlockToResourceTitle = () => {
    if (formik.values.responses.length > 0) {
      if (formik.values.responses.length === 1) {
        let title = formik.values.responses[0]?.response;
        formik?.setFieldValue(`responseBlockName`, title);
      } else if (formik.values.responses.length > 1) {
        let title1 = formik.values.responses[0]?.response;
        let title2 =
          formik.values.responses[formik.values.responses?.length - 1]
            ?.response;

        let title = `${title1}-${title2}`;
        formik?.setFieldValue(`responseBlockName`, title);
      }
    }
  };
  const handleRankOrder = (e) => {
    if (e.target.value === "Rank Order Response") {
      const updatedRes = [...formik.values.responses].map((ele) => ({
        ...ele,
        hasOeq: false,
        openEndedQuestion: "",
      }));
      formik.setFieldValue("type", "Rank Order Response");
      formik.setFieldValue("responses", updatedRes);
    }
  };

  return (
    <>
      <div className="ratingQuestion_cnt">
        <div className="d-flex justify-content-end gap-2 mb-xxl-4 mb-3 flex-wrap">
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
        <Form onSubmit={formik.handleSubmit}>
          <Row className="gy-3 gx-2">
            <Col sm={12}>
              <Form.Group className="form-group mb-0">
                <div className="d-flex justify-content-between mb-2 flex-sm-row flex-column-reverse">
                  <Form.Label className="mb-0">
                    Question <sup>*</sup>
                  </Form.Label>
                  <Form.Group
                    className="form-group mb-sm-0 mb-2 flex-shrink-0"
                    controlId="skip1"
                  >
                    <Form.Check
                      className="me-0"
                      type="checkbox"
                      label={<div> Add Question To Resource </div>}
                      onChange={handleCheckboxChange}
                      disabled={status}
                    />
                  </Form.Group>
                </div>

                <InputField
                  type="text"
                  placeholder="Enter Question"
                  name="question"
                  onChange={formik.handleChange}
                  disabled={status}
                  value={formik.values.question}
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
                  disabled
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
                <Form.Label className="mb-2 d-flex align-items-center">
                  Intentions Short Name <sup>*</sup>
                  <Link to="#!" className="p-0">
                    <OverlayTrigger
                      overlay={
                        <Tooltip id="tooltip-disabled">
                          Provide a short name to be used in reports and chart.
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
                <InputField
                  type="text"
                  placeholder="Enter Question"
                  name="intentionsShortName"
                  onChange={formik.handleChange}
                  value={formik.values.intentionsShortName}
                  disabled
                />
                {formik.touched.intentionsShortName &&
                  formik.errors.intentionsShortName && (
                    <div className="error mt-1 text-danger">
                      {formik.errors.intentionsShortName}
                    </div>
                  )}
              </Form.Group>
            </Col>

            <div className="d-flex column-gap-xxl-5 column-gap-lg-4 column-gap-3 row-gap-1 flex-wrap">
              {/* <Form.Group className="form-group switchaxis d-sm-flex align-items-center mb-1">
                <Form.Label className="mb-sm-0 mb-1 me-xl-3 me-2 w-auto">
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
              </Form.Group> */}
              {!questionType && (
                <Form.Group className="form-group switchaxis d-sm-flex align-items-center mb-1">
                  <Form.Label className="mb-sm-0 mb-1 me-xl-3 me-2 w-auto d-flex align-items-center">
                    Type <sup>*</sup>
                  </Form.Label>
                  <div className="onlyradio flex-wrap">
                    <Form.Check
                      inline
                      type="radio"
                      id="type-singleselect"
                      label="Single Select"
                      name="type"
                      value="Single Select Response"
                      checked={formik.values.type === "Single Select Response"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={status}
                      isInvalid={formik.touched.type && formik.errors.type}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      id="type-selectapply"
                      label="Select All that Apply"
                      name="type"
                      value="Multi-Select Response"
                      checked={formik.values.type === "Multi-Select Response"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={status}
                      isInvalid={formik.touched.type && formik.errors.type}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      id="type-rankorder"
                      label="Rank Order"
                      name="type"
                      value="Rank Order Response"
                      checked={formik.values.type === "Rank Order Response"}
                      onClick={(e) => handleRankOrder(e)}
                      onBlur={formik.handleBlur}
                      disabled={status}
                      isInvalid={formik.touched.type && formik.errors.type}
                    />
                    {formik.touched.type && formik.errors.type && (
                      <div className="error mt-1 text-danger">
                        {formik.errors.type}
                      </div>
                    )}
                  </div>
                </Form.Group>
              )}
              {(questionType ||
                formik.values.type === "Single Select Response") && (
                <Form.Group className="form-group switchaxis d-sm-flex align-items-center mb-1">
                  <Form.Label className="mb-sm-0 mb-1 me-xl-3 me-2 w-auto d-flex align-items-center">
                    Response View Option <sup>*</sup>
                    <ResponseViewTooltip />
                  </Form.Label>
                  <div className="onlyradio flex-wrap">
                    <Form.Check
                      inline
                      type="radio"
                      id="responseViewOption-slider"
                      label="Slider"
                      name="responseViewOption"
                      value="slider"
                      checked={formik.values.responseViewOption === "slider"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      id="responseViewOption-vertical"
                      label="Vertical"
                      name="responseViewOption"
                      value="vertical"
                      checked={formik.values.responseViewOption === "vertical"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.responseViewOption &&
                    formik.errors.responseViewOption && (
                      <div className="error mt-1 text-danger">
                        {formik.errors.responseViewOption}
                      </div>
                    )}
                </Form.Group>
              )}
            </div>
          </Row>

          <h5 className="ratingQuestion_Subhead">Response Block</h5>
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
                  placeholder="Enter Reponse Type"
                  options={responseType}
                  name="responseType"
                  disabled={status}
                  onChange={(option) => {
                    handleResponseType(option);
                  }}
                  value={
                    responseType.find(
                      (option) => option.value === formik.values.responseType
                    ) || null
                  }
                />
                {formik.touched.responseType && formik.errors.responseType ? (
                  <div className="error mt-1 text-danger">
                    {formik.errors.responseType}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group className="form-group">
                <Form.Label className="mb-2">
                  Scale <sup>*</sup>{" "}
                </Form.Label>
                {scale?.length > 1 ? (
                  <SelectField
                    placeholder="scale"
                    options={scale}
                    name="scale"
                    onChange={(option) => {
                      handleScale(option);
                    }}
                    value={scale.find(
                      (option) => option.value === formik.values.scale
                    )}
                  />
                ) : (
                  <InputField
                    type="text"
                    placeholder="Enter Scale"
                    name="scale"
                    onChange={formik.handleChange}
                    value={formik.values.scale}
                    disabled
                  />
                )}
                {formik.touched.scale && formik.errors.scale && (
                  <div className="error mt-1 text-danger">
                    {formik.errors.scale}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>
          <div className="mb-lg-0 mb-md-3 mb-2 scalarSecCover">
            <div className="scalarSec2 scalarappend2 mt-2">
              {formik?.values?.responses?.length > 0 && (
                <Row className="align-items-center fw-bold gx-2 mb-2">
                  <Col xs={1}>Sl.No.</Col>
                  <Col xs={questionType ? 5 : 9}>Response</Col>
                  {questionType && <Col xs={2}>Value</Col>}
                  {questionType && <Col xs={2}>Response Category</Col>}
                  {(questionType ||
                    formik.values.type !== "Rank Order Response") && (
                    <Col xs={1} className="text-center">
                      Oeq
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="tooltip-disabled">
                            Selecting an OEQ box associated with a response will
                            trigger an open-ended question e.g., asking the
                            participant to clarify why they chose this response.
                          </Tooltip>
                        }
                      >
                        <span className="ms-1 d-inline-block">
                          <em className="icon-info-circle" />
                        </span>
                      </OverlayTrigger>
                    </Col>
                  )}

                  <Col xs={1} className="text-center">
                    +/-
                  </Col>
                </Row>
              )}

              {formik.values.responses.map((response, index) => (
                <React.Fragment key={response.id}>
                  <Row
                    className=" scalarappend_list align-items-start gx-2 mb-2"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <Col xs={1} className="d-flex align-items-center">
                      <div className=" d-flex align-items-center mt-3">
                        <em className="icon-drag me-1" />
                        <span>{String(index + 1).padStart(2, "0")}.</span>
                      </div>
                    </Col>

                    <Col xs={questionType ? 5 : 9}>
                      <Form.Group className="form-group">
                        <InputField
                          type="text"
                          name={`responses.${index}.response`}
                          placeholder="Enter Response"
                          value={response.response}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={
                            formik.touched.responses?.[index]?.response &&
                            formik.errors.responses?.[index]?.response
                          }
                          disabled={status}
                        />
                        {formik.touched.responses?.[index]?.response &&
                          formik.errors.responses?.[index]?.response && (
                            <div className="text-danger small">
                              {formik.errors.responses[index].response}
                            </div>
                          )}
                      </Form.Group>
                    </Col>

                    {questionType && (
                      <Col xs={2}>
                        <Form.Group className="form-group">
                          <InputField
                            type="number"
                            name={`responses.${index}.weightage`}
                            placeholder="Enter Value"
                            value={response.weightage}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={
                              formik.touched.responses?.[index]?.weightage &&
                              formik.errors.responses?.[index]?.weightage
                            }
                            disabled={status}
                          />
                          {formik.touched.responses?.[index]?.weightage &&
                            formik.errors.responses?.[index]?.weightage && (
                              <div className="text-danger small">
                                {formik.errors.responses[index].weightage}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                    )}

                    {questionType && (
                      <Col xs={2}>
                        <Form.Group className="form-group">
                          <SelectField
                            name={`responses.${index}.category`}
                            placeholder="Select Response Category"
                            value={responseCategory.find(
                              (cat) => cat.value === response.category
                            )}
                            options={responseCategory}
                            onChange={(option) => {
                              formik.setFieldValue(
                                `responses.${index}.category`,
                                option.value
                              );
                              const currentWeightage =
                                formik?.values?.responses[index].weightage;
                              let updatedWeightage = currentWeightage;
                              if (option.value === 3) {
                                updatedWeightage = -Math.abs(currentWeightage);
                              } else if (currentWeightage < 0) {
                                updatedWeightage = Math.abs(currentWeightage);
                              }
                              formik.setFieldValue(
                                `responses.${index}.weightage`,
                                updatedWeightage
                              );
                            }}
                            isInvalid={
                              formik.touched.responses?.[index]?.category &&
                              formik.errors.responses?.[index]?.category
                            }
                            disabled={status}
                          />
                          {formik.touched.responses?.[index]?.category &&
                            formik.errors.responses?.[index]?.category && (
                              <div className="text-danger small">
                                {formik.errors.responses[index].category}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                    )}
                    {(questionType ||
                      formik.values.type !== "Rank Order Response") && (
                      <Col
                        xs={1}
                        className="d-flex align-items-center justify-content-center"
                      >
                        <Form.Group className="form-group mt-2">
                          <Form.Check
                            type="checkbox"
                            label=" "
                            checked={response.hasOeq}
                            onChange={() => handleCheckboxChangeOeq(index)}
                            disabled={status}
                          />
                        </Form.Group>
                      </Col>
                    )}

                    <Col
                      xs={1}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <div className="addeletebtn ">
                        {index === 0 ? (
                          <Link
                            to="#!"
                            className="addbtn addscaler"
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddRow();
                            }}
                          >
                            <span>+</span>
                          </Link>
                        ) : (
                          <Link
                            to="#!"
                            className="deletebtn deletebtnscaler"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteRow(index);
                            }}
                          >
                            <em className="icon-delete" />
                          </Link>
                        )}
                      </div>
                    </Col>
                  </Row>

                  {Boolean(response.hasOeq) && (
                    <Row className="mb-3">
                      <Col xs={{ span: questionType ? 9 : 9, offset: 1 }}>
                        <Form.Group className="form-group">
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name={`responses.${index}.openEndedQuestion`}
                            placeholder="Enter Open Ended Question"
                            value={response.openEndedQuestion}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={status}
                            isInvalid={
                              formik.touched.responses?.[index]
                                ?.openEndedQuestion &&
                              formik.errors.responses?.[index]
                                ?.openEndedQuestion
                            }
                          />
                          {formik.touched.responses?.[index]
                            ?.openEndedQuestion &&
                            formik.errors.responses?.[index]
                              ?.openEndedQuestion && (
                              <div className="text-danger small">
                                {
                                  formik.errors.responses[index]
                                    .openEndedQuestion
                                }
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                    </Row>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {formik.values.responseType === "123456789" && (
            <Row>
              <Col xxl={4} md={6}>
                <Form.Group className="form-group">
                  <Form.Label className="mb-2 d-flex align-items-center">
                    Add Response Block to Resource
                    <Link to="#!" className="p-0">
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="tooltip-disabled">
                            Choose relevant name for this response block,
                            example: Agreement | Strongly disagree – Strongly
                            agree | 5pt scale.
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

                  <div>
                    <div className="d-flex">
                      <Form.Group
                        className="form-group mb-0 me-2 d-flex align-items-center"
                        controlId="skip1"
                      >
                        <Form.Check
                          type="checkbox"
                          id="switchaxis1"
                          className="me-0 mb-0"
                          name="addToResource"
                          label={<div />}
                          onChange={(e) => {
                            formik?.setFieldValue(
                              `addToResource`,
                              e.target.checked
                            );
                            if (e.target.checked) {
                              handleAddResponseBlockToResourceTitle();
                            } else {
                              formik?.setFieldValue(`responseBlockName`, "");
                            }
                          }}
                          checked={formik.values.addToResource}
                        />
                      </Form.Group>
                      <InputField
                        type="text"
                        placeholder="Enter Response Block Name"
                        name="responseBlockName"
                        onChange={formik.handleChange}
                        value={formik.values.responseBlockName}
                        disabled={!formik.values.addToResource}
                      />
                    </div>
                    {formik.touched.responseBlockName &&
                      formik.errors.responseBlockName && (
                        <div className="error mt-1 text-danger ms-5">
                          {formik.errors.responseBlockName}
                        </div>
                      )}
                  </div>
                </Form.Group>
              </Col>
            </Row>
          )}

          {/* Save & Close Buttons */}
          <div className="d-flex justify-content-end gap-2 flex-wrap mb-5">
            {/* <Button
                            variant="primary"
                            onClick={() => {
                                handleSave("Save & Add Question");
                            }}
                        >
                            {isSubmitting && submitTypeRef.current === "Save & Add Question"
                                ? "Saving..."
                                : "Save & Add Question"}
                        </Button> */}
            <Button variant="secondary" onClick={handleCommunicationQuestions}>
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={() => {
                handleSave("Save & Close Jump Block");
              }}
            >
              {isSubmitting &&
              submitTypeRef.current === "Save & Close Jump Block"
                ? "Saving..."
                : "Save"}
            </Button>
          </div>
        </Form>
      </div>

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

      {showQuestionBank && (
        <QuestionBankModal
          showQuestionBank={showQuestionBank}
          questionBankClose={questionBankClose}
          questionOptions={questionOptions}
          surveyOptions={surveyType}
          userData={userData}
          openFrom="Rating"
          handleAddQuestion={handleAddQuestion}
          surveyID={surveyID}
          companyID={companyID}
          questionType="m"
        />
      )}
    </>
  );
};

export default SingleRatingJumpQuestionDaIg;
