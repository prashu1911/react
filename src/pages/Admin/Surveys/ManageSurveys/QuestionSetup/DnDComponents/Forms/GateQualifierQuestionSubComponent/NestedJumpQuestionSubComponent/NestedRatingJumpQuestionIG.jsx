import { Col, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useFormik } from "formik";
import { commonService } from "services/common.service";
import { QuestionSetup } from "apiEndpoints/QuestionSetup";
import {
  Button,
  ImageElement,
  InputField,
  SelectField,
} from "../../../../../../../../../components";
import {
  NestedQuestionInitialValue,
  NestedQuestionValidationSchemaIG,
} from "../../../../validation";
import AddToResourceModel from "../../../../ModelComponent/AddToResourceModel";
import QuestionBankModal from "../../../../ModelComponent/QuestionBankModal";

const NestedJumpQuestionIG = ({
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
  handleJumpNestedBlock,
  questionOptions,
  parentIntentionID,
}) => {
  const submitTypeRef = useRef("");

  // Question Bank Modal start
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const questionBankClose = () => setShowQuestionBank(false);
  const questionBankShow = () => setShowQuestionBank(true);

  const [scale, setScale] = useState([]);

  const [draggedItem, setDraggedItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // add question bank modal
  const [showBankAttributes, setShowBankAttributes] = useState(false);
  const handleCheckboxChange = (e) => {
    setShowBankAttributes(e.target.checked);
  };

  function convertResponseData(data) {
    if (data.length === 0) return [];

    return data.map((item) => {
      return {
        response: item.response,
        isOEQ: item.hasOeq,
        oeqQuestion: item.openEndedQuestion || "",
      };
    });
  }

  function convertSubQuestionData(data) {
    if (data.length === 0) return [];

    return data.map((item) => {
      return {
        subQuestion: item.response,
        isAnchor: item.checked ? 1 : 0,
      };
    });
  }

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsSubmitting(true);
      const payload = {
        questionID: parentGateQuestionID,
        companyMasterID: userData?.companyMasterID,
        companyID,
        surveyID,
        outcomeID: outcome?.id,
        intentionName: values?.intentions,
        intentionShortName: values?.intentionsShortName,
        intentionID: parentIntentionID,
        question: values?.question,
        isSlider: values?.responseViewOption === "slider",
        scale: values?.scale,
        isQuestionAddedToResource: values?.addQuestionToResource ? 1 : 0,
        allResponse: convertResponseData(values?.responses),
        isSkip: values?.displaySkipForNow,
        isRandom: values?.randomizeQuestions,
        isScore: 0,
        subQuestion: convertSubQuestionData(values?.subResponses),
        selectionType: values?.type,
        isNestedGraph: false,
        isResponseAddedToResource: values?.addToResource,
        surveyTypeID: values?.surveyType,
        keywords: values?.keyWord,
      };

      const response = await commonService({
        apiEndPoint: QuestionSetup.createNestedQuestion,
        bodyData: payload,
        toastType: { success: true, error: false },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        if (submitTypeRef.current === "Save & Add Question") {
          resetForm();
          fetchQuestion(parentGateQuestionID);
          setIsSubmitting(false);
        } else if (submitTypeRef.current === "Save & Close Jump Block") {
          resetForm();
          fetchQuestion(parentGateQuestionID);
          handleJumpNestedBlock();
          setIsSubmitting(false);
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
      ...NestedQuestionInitialValue(),
      intentions: parentIntentions,
      intentionsShortName: parentIntentionShortName,
    },
    validationSchema: NestedQuestionValidationSchemaIG(),
    onSubmit: handleSubmit,
  });

  const addRow = () => {
    formik.setFieldValue("subResponses", [
      ...formik.values.subResponses,
      { id: Date.now(), response: "", checked: false },
    ]);
  };

  const removeRow = (index) => {
    const newsubResponses = [...formik.values.subResponses];
    newsubResponses.splice(index, 1);
    formik.setFieldValue("subResponses", newsubResponses);
  };

  const handleAddRow = () => {
    const newResponses = [...formik.values.responses];
    newResponses.push({
      id: Date.now().toString(),
      response: "",
      weightage: 1,
      category: "Positive",
      hasOeq: false,
      openEndedQuestion: "",
    });
    formik.setFieldValue("scale", newResponses?.length);
    formik.setFieldValue("responses", newResponses);
  };

  const handleDeleteRow = (index) => {
    if (formik.values.responses.length > 1) {
      const newResponses = formik.values.responses.filter(
        (_, i) => i !== index
      );
      formik.setFieldValue("responses", newResponses);
    }
  };

  const handleCheckboxChangeOeq = (index) => {
    const newValue = !formik.values.responses[index].hasOeq;
    formik.setFieldValue(`responses.${index}.hasOeq`, newValue);
    if (!newValue) {
      formik.setFieldValue(`responses.${index}.openEndedQuestion`, "");
    }
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
      weightage: item.responseWeightage,
      category: item.responseCategory,
      hasOeq: item.isOEQ,
      openEndedQuestion: item.oeqQuestion,
    }));
  }
  const fetchResponseType = async (responseTypeID, scaleValue) => {
    try {
      const response = await commonService({
        apiEndPoint: QuestionSetup.getResponseType,
        queryParams: scaleValue ? { surveyID, companyID, responseTypeID, scale: scaleValue } : { surveyID, companyID, responseTypeID },
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
        console.log(response, "response?.data");
        console.log(responseList, "ResponseList");
        const convertedResponses = convertResponseList(responseList);
        console.log(convertedResponses, "convertedResponses");
        formik.setFieldValue("responses", convertedResponses);
        formik.setFieldValue("scale", convertedResponses.length);
      }
    } catch (error) {
      console.error("Error add outcome:", error);
    }
  };
  const handleScale = (option) => {
    formik.setFieldValue("scale", option.value)
    fetchResponseType(formik?.values?.responseType, option.value);
  };

  const handleResponseType = (option) => {
    fetchResponseType(option.value,null);
    formik.setFieldValue("responseType", option.value);
    const ResponseList = getSurveyData(grouppedData, option.value);
    formik.setFieldValue("responses", convertResponseList(ResponseList));
    formik.setFieldValue("scale", ResponseList?.length);
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
  return (
    <div className="ratingQuestion_cnt">
      <div className="d-flex justify-content-center gap-2 mb-xxl-4 mb-3 flex-wrap">
        <Button
          variant="outline-primary"
          className="ripple-effect"
          onClick={questionBankShow}
        >
          <em className="icon-import me-2 d-sm-block d-none" /> Import from
          Question Bank
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
                  />
                </Form.Group>
              </div>
              <InputField
                type="text"
                placeholder="Enter Question"
                name="question"
                onChange={formik.handleChange}
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
        </Row>
        <div className="d-flex column-gap-xxl-5 column-gap-lg-4 column-gap-3 row-gap-1 mt-3 pt-1 flex-wrap mb-sm-0 mb-2">
          <Form.Group className="form-group switchaxis d-md-flex align-items-center">
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
          <Form.Group className="form-group switchaxis d-md-flex align-items-center">
            <Form.Label className="mb-0 me-xl-3 me-2 w-auto d-flex align-items-center">
              Response View Option <sup>*</sup>
              <Link to="#!" className="p-0">
                <OverlayTrigger
                  overlay={
                    <Tooltip id="tooltip-disabled">
                      <ImageElement
                        source="response-view.png"
                        className="response-view"
                      />
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
              </Link>{" "}
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
        </div>
        <div className="d-flex column-gap-xxl-5 column-gap-lg-4 column-gap-3 row-gap-1 flex-wrap">
          <Form.Group className="form-group switchaxis d-sm-flex align-items-start mb-4">
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
                value="Single Select"
                checked={formik.values.type === "Single Select"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.type && formik.errors.type}
              />
              <Form.Check
                inline
                type="radio"
                id="type-selectapply"
                label="Select All that Apply"
                name="type"
                value="Select All that Apply"
                checked={formik.values.type === "Select All that Apply"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.type && formik.errors.type}
              />
            </div>
          </Form.Group>
        </div>
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
                        Use list value Free Form to create custom response type.
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
                Scale <sup>*</sup>
              </Form.Label>
              {
                scale?.length > 1 ? (
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
                ) :
                  <InputField
                    type="text"
                    placeholder="Enter Scale"
                    name="scale"
                    onChange={formik.handleChange}
                    value={formik.values.scale}
                    disabled
                  />
              }
              {formik.touched.scale && formik.errors.scale && (
                <div className="error mt-1 text-danger">
                  {formik.errors.scale}
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>
        <div className="scalarSec scalarappend mt-2">
          {/* Table Header */}
          {formik?.values?.responses?.length > 0 && (
            <div className="d-flex justify-content-between gap-2 mb-0 align-items-center">
              <div className="sequence title">Sl.No.</div>
              <div className="scalar title">Response </div>
              <div className="color title">
                Oeq
                <Link to="#!" className="p-0">
                  <OverlayTrigger
                    overlay={
                      <Tooltip id="tooltip-disabled">
                        Selecting an OEQ box associated with a response will
                        trigger an open-ended question e.g., asking the
                        participant to clarify why they chose this response.
                      </Tooltip>
                    }
                  >
                    <span className="d-inline-block ms-1">
                      <em
                        className="icon-info-circle"
                        style={{ pointerEvents: "none" }}
                      />
                    </span>
                  </OverlayTrigger>
                </Link>
              </div>
              <div className="addeletebtn title justify-content-center">
                +/-
              </div>
            </div>
          )}

          {formik.values.responses.map((response, index) => (
            <div
              key={response.id}
              className="response-item"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="scalarappend_list d-flex justify-content-between gap-2 align-items-center">
                <div className="sequence d-flex align-items-center">
                  <div className="drag-handle d-flex">
                    <em className="icon-drag" />
                  </div>
                  <span>{String(index + 1).padStart(2, "0")}.</span>
                </div>

                {/* Rest of your form fields remain the same */}
                <Form.Group className="form-group scalar">
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
                  />
                  {formik.touched.responses?.[index]?.response &&
                    formik.errors.responses?.[index]?.response && (
                      <div className="error-message text-danger">
                        {formik.errors.responses[index].response}
                      </div>
                    )}
                </Form.Group>

                <div className="color">
                  <Form.Group className="form-group mb-0 d-flex align-items-center justify-content-center">
                    <Form.Check
                      className="me-0 mb-0"
                      type="checkbox"
                      label={<div />}
                      checked={response.hasOeq}
                      onChange={() => handleCheckboxChangeOeq(index)}
                    />
                  </Form.Group>
                </div>

                <div className="addeletebtn d-flex gap-2">
                  {index === 0 ? (
                    <Link
                      to="#!"
                      className="addbtn addscaler"
                      onClick={handleAddRow}
                    >
                      <span>+</span>
                    </Link>
                  ) : (
                    <Link
                      to="#!"
                      className="deletebtn deletebtnscaler"
                      onClick={() => handleDeleteRow(index)}
                    >
                      <em className="icon-delete" />
                    </Link>
                  )}
                </div>
              </div>

              {Boolean(response.hasOeq) && (
                <div className="textarea-container mt-2">
                  <Form.Group className="form-group col-11">
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name={`responses.${index}.openEndedQuestion`}
                      placeholder="Enter Open Ended Question"
                      value={response.openEndedQuestion}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        formik.touched.responses?.[index]?.openEndedQuestion &&
                        formik.errors.responses?.[index]?.openEndedQuestion
                      }
                    />
                    {formik.touched.responses?.[index]?.openEndedQuestion &&
                      formik.errors.responses?.[index]?.openEndedQuestion && (
                        <div className="error-message text-danger">
                          {formik.errors.responses[index].openEndedQuestion}
                        </div>
                      )}
                  </Form.Group>
                </div>
              )}
            </div>
          ))}
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
                          Choose relevant name for this response block, example:
                          Agreement | Strongly disagree – Strongly agree | 5pt
                          scale.
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

                          handleAddResponseBlockToResourceTitle();
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
        <div className="d-flex justify-content-between gap-2 my-4 align-items-center flex-wrap">
          <h6 className="ratingQuestion_Subhead mb-0">Sub-Questions</h6>
          <Form.Group className="form-group switchaxis d-flex align-items-center mb-0">
            <Form.Label className="mb-0 me-xl-3 me-2 w-auto ">
              Randomize Questions <sup>*</sup>
            </Form.Label>
            <div className="switchBtn switchBtn-success">
              <InputField
                type="checkbox"
                id="switchaxis2"
                className="p-0"
                name="randomizeQuestions"
                onChange={formik.handleChange}
                checked={formik.values.randomizeQuestions}
              />
              <label htmlFor="switchaxis2" />
            </div>
            {formik.touched.randomizeQuestions &&
              formik.errors.randomizeQuestions && (
                <div className="error mt-1 text-danger">
                  {formik.errors.randomizeQuestions}
                </div>
              )}
          </Form.Group>
        </div>
        <div className="mb-lg-0 mb-md-3 mb-2 scalarSecCover">
          <div className="scalarSec subQuestion">
            <div className="d-flex justify-content-between gap-2 mb-0 align-items-center">
              <div className="sequence title">Sl.No.</div>
              <div className="color title">Anchor </div>
              <div className="maximum title">Sub-Questions </div>
              <div className="addeletebtn title justify-content-center">
                +/-
              </div>
            </div>
            {formik.values.subResponses.map((item, index) => (
              <div
                key={index}
                className="scalarappend_list d-flex justify-content-between gap-2 align-items-center"
              >
                <div className="sequence">{index + 1}.</div>

                <div className="color">
                  <Form.Group className="form-group mb-0 d-flex align-items-center justify-content-center">
                    <Form.Check
                      className="me-0 mb-0"
                      type="checkbox"
                      checked={item.checked}
                      label={<div />}
                      onChange={(e) =>
                        formik.setFieldValue(
                          `subResponses.${index}.checked`,
                          e.target.checked
                        )
                      }
                      disabled={!formik.values.randomizeQuestions}
                    />
                  </Form.Group>
                </div>

                <Form.Group className="form-group maximum">
                  <InputField
                    type="text"
                    name={`subResponses.${index}.response`}
                    placeholder="Enter Response"
                    className="form-control"
                    value={formik.values.subResponses[index].response}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.subResponses?.[index]?.response &&
                    formik.errors.subResponses?.[index]?.response && (
                      <div className="text-danger small">
                        {formik.errors.subResponses[index].response}
                      </div>
                    )}
                </Form.Group>

                <div className="addeletebtn d-flex gap-2">
                  {index === 0 ? (
                    <Link to="#!" className="addbtn addscaler" onClick={addRow}>
                      <span>+</span>
                    </Link>
                  ) : (
                    <Link
                      to="#!"
                      className="deletebtn deletebtnscaler"
                      onClick={() => removeRow(index)}
                    >
                      <em className="icon-delete" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 flex-wrap mb-5">
          <Button
            variant="primary"
            onClick={() => {
              handleSave("Save & Add Question");
            }}
          >
            {isSubmitting && submitTypeRef.current === "Save & Add Question"
              ? "Saving..."
              : "Save & Add Question"}
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              handleSave("Save & Close Jump Block");
            }}
          >
            {isSubmitting && submitTypeRef.current === "Save & Close Jump Block"
              ? "Saving..."
              : "Save & Close Jump Block"}
          </Button>
          <Button variant="secondary" onClick={handleJumpNestedBlock}>
            Cancel
          </Button>
        </div>
      </Form>

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
          openFrom="Nested"
          handleAddQuestion={handleAddQuestion}
          surveyID={surveyID}
          companyID={companyID}
          questionType="m"
        />
      )}
    </div>
  );
};

export default NestedJumpQuestionIG;
