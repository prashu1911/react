import { Col, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useFormik } from "formik";
import { commonService } from "services/common.service";
import { QuestionSetup } from "apiEndpoints/QuestionSetup";
import { useSurveyDataOnNavigations } from "customHooks";
import { toast } from "react-hot-toast";
import React from "react";

import {
  Button,
  ImageElement,
  InputField,
  SelectField,
  SweetAlert,
} from "../../../../../../../../components";
import {
  SingleRatingQuestionInitialValue,
  SingleRatingQuestionValidationSchema,
  SingleRatingQuestionValidationSchemaEdit,
} from "../../../validation";
import QuestionBankModal from "../../../ModelComponent/QuestionBankModal";
import AddToResourceModel from "../../../ModelComponent/AddToResourceModel";
import ResponseViewTooltip from "../../../Tooltip";

// Move utility functions outside component
const convertResponseData = (data) => {
  if (!data || data.length === 0) return [];

  return data.map((item) => ({
    response: item.response,
    responseWeightage: parseFloat(item.weightage).toFixed(2),
    responseCategory: item.category.toString(),
    ...(item.hasOeq && {
      isOEQ: 1,
      oeqQuestion: item.openEndedQuestion,
    }),
  }));
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

const convertResponseList = (Data, rangeEnd, typeVal) => {
  if (!Data || !Array.isArray(Data)) return [];

  return Data.map((item, index) => {
    console.log(typeVal, "typeVal");
    return {
      id: Date.now().toString() + index,
      response: item.responseName || "",
      weightage:
        parseFloat(item.responseWeightage) === 0
          ? 0
          : parseFloat(item.responseWeightage) || rangeEnd,
      category: parseInt(item.responseCategory) || 1,
      hasOeq: Boolean(item.isOEQ),
      openEndedQuestion: item.oeqQuestion || "",
    };
  });
};

const getInitialValues = (initialQuestionData, questionType, isSlider) => {
  if (!initialQuestionData) {
    return SingleRatingQuestionInitialValue(questionType, isSlider);
  }

  // if (initialQuestionData.isScore !== 1) {
  //     return SingleRatingQuestionInitialValue();
  // }
  // if (initialQuestionData.isScore === 1) {
  //     return SingleRatingQuestionInitialValue();
  // }

  // Ensure each response has a unique id
  const responses =
    initialQuestionData.response?.map((r) => ({
      id: `${Date.now()}-${Math.random()}`, // Ensure unique IDs
      response: r.response || "",
      weightage:
        parseFloat(r.responseWeightage) === 0
          ? 0
          : parseFloat(r.responseWeightage) || 1,
      category: parseInt(r.responseCategory) || 1,
      hasOeq: Boolean(r.isOEQ),
      openEndedQuestion: r.oeqQuestion || "",
    })) || [];

  return {
    question: initialQuestionData.question || "",
    intentions: initialQuestionData.intentionName || "",
    intentionsShortName: initialQuestionData.intentionShortName || "",
    displaySkipForNow: initialQuestionData.isSkip || false,
    responseViewOption: initialQuestionData.isSlider ? "slider" : "vertical",
    type: initialQuestionData?.responseSelectedType || "Single Select Response",
    responseType: initialQuestionData.responseType || "",
    scale: responses.length,
    responses,
    addToResource: initialQuestionData.addResponseBlockToResource || false,
    responseBlockName:
      initialQuestionData.responseBlockToResourceDescription || "",
    addQuestionToResource: initialQuestionData.isQuestionAddedToResource === 1,
    surveyType: initialQuestionData.surveyTypeID || "",
    keywords: initialQuestionData.keywords || "",
    isResponseAddedToResource: false,
  };
};

export default function RatingQuestionDaIg({
  setActiveForm,
  outcome,
  surveyType,
  surveyID,
  companyID,
  responseType,
  grouppedData,
  userData,
  updateQuestionListByOutComeID,
  questionOptions,
  initialQuestionData,
  handleEditClose, // Add this prop
  edit,
  questionType,
  isGate,
  fetchQuestion,
  parentGateQuestionID,
}) {
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onConfirmAlertModal = () => {
    return true;
  };

  const BUTTON_TYPE = edit
    ? {
        load: "Updating...",
        type: "Update",
      }
    : {
        load: "Saving...",
        type: "Save",
      };

  const [scale, setScale] = useState([]);

  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const questionBankClose = () => setShowQuestionBank(false);
  const questionBankShow = () => setShowQuestionBank(true);
  const { getSurveyDataOnNavigate } = useSurveyDataOnNavigations();
  const surevyData = getSurveyDataOnNavigate();

  const rangeStart = Number.isNaN(Number(surevyData?.rangeEnd))
    ? 0
    : Number(surevyData?.rangeStart);
  const rangeEnd = Number.isNaN(Number(surevyData?.rangeEnd))
    ? 0
    : Number(surevyData?.rangeEnd);
  const status = surevyData?.status !== "Design";
  const [draggedItem, setDraggedItem] = useState(null);
  const responseCategory = [
    { value: 1, label: "Positive" },
    { value: 2, label: "Neutral" },
    { value: 3, label: "Negative" },
  ];
  const [showBankAttributes, setShowBankAttributes] = useState(false);
  const handleCheckboxChange = (e) => {
    setShowBankAttributes(e.target.checked);
  };
  // Memoize form submission handler
  const handleSubmit = useCallback(
    async (values, { resetForm }) => {
      try {
        const isValid = values?.responses.some(
          (item) => item.weightage === rangeEnd
        );
        if (values?.responses?.length < 2) {
          toast.error(`minimum two responses need to add`, {
            toastId: "rangeEndMismatch",
          });
          return; // Stop further execution
        }
        if (!isValid && questionType) {
          toast.error(
            `At least one response weightage should match the range end (${rangeEnd})`,
            {
              toastId: "rangeEndMismatch",
            }
          );
          return; // stop further execution if needed
        }
        setIsSubmitting(true);
        const payload = {
          companyMasterID: userData?.companyMasterID,
          companyID,
          surveyID,
          outcomeID: outcome?.id,
          intentionName: values?.intentions,
          intentionShortName: values?.intentionsShortName,
          question: values?.question,
          isSlider:
            !questionType && values.type !== "Single Select Response"
              ? false
              : values?.responseViewOption === "slider",
          scale: values?.scale,
          selectionType: values?.type,
          // isQuestionAddedToResource: values?.addQuestionToResource ? 1 : 0,
          isQuestionAddedToResource: values?.surveyType.length > 0 ? 1 : 0,
          allResponse: convertResponseData(values?.responses),
          isSkip: values?.displaySkipForNow,
          surveyTypeID: values?.surveyType,
          responseBlockName: values?.responseBlockName || "",
          isScore: questionType ? 1 : 0,
          // keywords: values?.keywords || values?.keyword || "this is my keyword",
          keywords: values?.keyWord,

          isResponseAddedToResource: values?.addToResource,
        };

        if (initialQuestionData?.questionID) {
          payload.questionID = initialQuestionData.questionID;
        }

        const apiEndpoint = initialQuestionData?.questionID
          ? QuestionSetup.UpdateRatingQuestion
          : QuestionSetup.createRatingQuestion;

        const response = await commonService({
          apiEndPoint: apiEndpoint,
          bodyData: payload,
          toastType: { success: true, error: false },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.apiToken}`,
          },
        });

        if (response?.status) {
          if (!initialQuestionData?.questionID) {
            resetForm();
            updateQuestionListByOutComeID(outcome?.id);
            setActiveForm([]);
          } else {
            updateQuestionListByOutComeID(outcome?.id);
            handleEditClose();
          }
          if (isGate) {
            fetchQuestion(parentGateQuestionID);
          }
        }
        setIsSubmitting(false);
      } catch (error) {
        console.error("Error updating/adding question:", error);
        setIsSubmitting(false);
      }
    },
    [
      companyID,
      initialQuestionData,
      outcome,
      surveyID,
      userData,
      updateQuestionListByOutComeID,
      setActiveForm,
      handleEditClose,
      questionType,
    ]
  );
  // Memoize formik configuration
  const formikConfig = useMemo(
    () => ({
      initialValues: getInitialValues(
        initialQuestionData,
        questionType,
        surevyData?.isSlider
      ),
      validationSchema: initialQuestionData
        ? SingleRatingQuestionValidationSchemaEdit(
            rangeStart,
            rangeEnd,
            questionType
          )
        : SingleRatingQuestionValidationSchema(
            rangeStart,
            rangeEnd,
            questionType
          ),
      onSubmit: handleSubmit,
      enableReinitialize: !!initialQuestionData,
    }),
    [initialQuestionData, handleSubmit]
  );
  const formik = useFormik(formikConfig);

  // Memoize handlers that update form values
  const handleAddRow = useCallback(() => {
    try {
      const currentResponses = Array.isArray(formik.values.responses)
        ? [...formik.values.responses]
        : [];
      const currentResponses22 = Array.isArray(formik.values.responses)
        ? [...formik.values.responses]
        : [];

      let isOutOfRange = false;
      currentResponses22.forEach((response) => {
        const weightage = Number(response.weightage); // Ensure it's a number

        if (weightage < rangeStart || weightage > rangeEnd) {
          isOutOfRange = true;
        }
      });
      if (isOutOfRange) {
        setIsSubmitting(false);
        toast.error(
          `Weighhatge Range Should be In between ${rangeStart} - ${rangeEnd}`,
          {
            toastId: "error001",
          }
        );
        return true;
      }
      const newResponse = {
        id: `${Date.now()}-${Math.random()}`,
        response: "",
        weightage: 0,
        category: 1,
        hasOeq: false,
        openEndedQuestion: "",
      };

      const newResponses = [...currentResponses, newResponse];

      const weightageAvg = rangeEnd / newResponses?.length;
      const updateResponses = newResponses.map((item, index) => {
        const responseLength = index + 1;
        return {
          ...item,
          weightage: parseFloat((weightageAvg * responseLength).toFixed(2)),
        };
      });

      formik.setFieldValue("responses", updateResponses);
      formik.setFieldValue("scale", updateResponses.length);
      formik?.setFieldValue(`addToResource`, false);
      formik?.setFieldValue(`responseBlockName`, "");
    } catch (error) {
      console.error("Error in handleAddRow:", error);
    }
  }, [formik]);
  const handleDeleteRow = useCallback(
    (index) => {
      try {
        const currentResponses = Array.isArray(formik.values.responses)
          ? [...formik.values.responses]
          : [];

        if (currentResponses.length <= 1) {
          return; // Don't delete if it's the last row
        }

        const newResponses = currentResponses
          .filter((_, i) => i !== index)
          .map((item, i) => ({
            ...item,
            weightage: parseFloat((rangeEnd / (i + 1)).toFixed(2)),
          }));

        const weightageAvg = rangeEnd / newResponses?.length;
        const updateResponses = newResponses.map((item, i) => {
          const responseLength = i + 1;
          return {
            ...item,
            weightage: parseFloat((weightageAvg * responseLength).toFixed(2)),
          };
        });

        formik.setFieldValue("responses", updateResponses);
        formik.setFieldValue("scale", newResponses.length);
        formik?.setFieldValue(`addToResource`, false);
        formik?.setFieldValue(`responseBlockName`, "");
      } catch (error) {
        console.error("Error in handleDeleteRow:", error);
      }
    },
    [formik]
  );
  const handleCheckboxChangeOeq = (index) => {
    const newValue = !formik.values.responses[index].hasOeq;
    formik.setFieldValue(`responses.${index}.hasOeq`, newValue);
    if (!newValue) {
      formik.setFieldValue(`responses.${index}.openEndedQuestion`, "");
    }
  };
  // Memoize drag and drop handlers
  const handleDragStart = useCallback((e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
    e.target.style.opacity = "0.4";
  }, []);

  const handleDragLeave = (e) => {
    e.preventDefault();
    const target = e.target.closest(".response-item");
    if (target) {
      target.classList.remove("drag-over");
    }
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

  const fetchResponseType = async (responseTypeID, scaleValue) => {
    try {
      const questionLevelIDs = responseType
        .filter((item) => item.isQuestionLevel)
        .map((item) => item.value);

      const isQuestionLevel = questionLevelIDs.includes(responseTypeID);
      const queryParams = {
        surveyID,
        companyID,
        responseTypeID,
        ...(scaleValue && { scale: scaleValue }),
        ...(isQuestionLevel && { questionID: initialQuestionData?.questionID }),
      };
      const response = await commonService({
        apiEndPoint: QuestionSetup.getResponseType,
        queryParams,
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
            hasOeq: false,
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

  const handleResponseType = useCallback(
    async (option) => {
      try {
        formik.setValues({
          ...formik.values,
          responseType: option.value,
          addToResource: false,
          responseBlockName: ""
        })
        // formik.setFieldValue("responseType", option.value);

        if (option.value == 123456789) {
          const ResponseList = getSurveyData(grouppedData, option.value);
          const convertedResponses = convertResponseList(
            ResponseList,
            rangeEnd
          );
          formik.setFieldValue("responses", convertedResponses);
          formik.setFieldValue("scale", convertedResponses.length);
        } else {
          fetchResponseType(option.value, null);
        }
      } catch (error) {
        console.error("Error in handleResponseType:", error);
      }
    },
    [formik, grouppedData]
  );
  const handleScale = useCallback(
    async (option) => {
      try {
        formik.setFieldValue("scale", option.value);
        fetchResponseType(formik?.values?.responseType, option.value);
      } catch (error) {
        console.error("Error in handleResponseType:", error);
      }
    },
    [formik, grouppedData]
  );

  const handleAddQuestion = useCallback(
    (row) => {
      formik.setFieldValue("question", row?.question);
      questionBankClose();
    },
    [formik]
  );

  useEffect(() => {
    if (
      responseType?.length > 0 &&
      initialQuestionData &&
      initialQuestionData?.responseTypeName
    ) {
      const reponseID = responseType.find(
        (value) => value?.label === initialQuestionData?.responseTypeName
      );

      formik?.setFieldValue(`responseType`, reponseID?.value);
    }
  }, [responseType?.length]);

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

  const handleCancel = () => {
    if (initialQuestionData?.questionID) {
      handleEditClose();
    } else {
      setActiveForm([]);
    }
  };
  const handleResponseBlockName = (e) => {
    formik?.setFieldValue(`responseBlockName`, e.target.value);
  };

  useEffect(() => {
    if (formik.values.type === "Rank Order Response") {
      const copyArr = formik.values.responses;
      if (copyArr?.length > 0) {
        const updateArr = copyArr.map((ele) => ({
          ...ele,
          openEndedQuestion: "",
          hasOeq: false,
        }));
        formik.setFieldValue("responses", updateArr);
      }
    }
  }, [formik.values.type]);

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <div className="d-flex  justify-content-end mb-3">
          <Button
            variant="outline-primary"
            className="ripple-effect"
            onClick={questionBankShow}
            disabled={status}
          >
            <em className="icon-import me-2 d-sm-block d-none" />
            Import from Question Bank
          </Button>
        </div>{" "}
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
                placeholder="Enter Intentions"
                name="intentions"
                onChange={formik.handleChange}
                value={formik.values.intentions}
                disabled={status || edit}
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
                placeholder="Enter Intentions Short Name"
                name="intentionsShortName"
                onChange={formik.handleChange}
                value={formik.values.intentionsShortName}
                disabled={status || edit}
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
            <Form.Group className="form-group switchaxis d-sm-flex align-items-center mb-1">
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
                  disabled={status}
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
            {!questionType && (
              <div className="d-flex column-gap-xxl-5 column-gap-lg-4 column-gap-3 row-gap-1 flex-wrap">
                <Form.Group className="form-group switchaxis d-sm-flex align-items-start mb-1">
                  <Form.Label className="mb-sm-0 mb-1 me-xl-3 me-2 w-auto d-flex align-items-center">
                    Type <sup>*</sup>
                  </Form.Label>
                  <div className="onlyradio flex-wrap">
                    <Form.Check
                      inline
                      type="radio"
                      id="type-singleselect"
                      label="Single Select Response"
                      name="type"
                      value="Single Select Response"
                      checked={formik.values.type === "Single Select Response"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.type && formik.errors.type}
                      disabled={status}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      id="type-selectapply"
                      label="Multi-Select Response"
                      name="type"
                      value="Multi-Select Response"
                      checked={formik.values.type === "Multi-Select Response"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.type && formik.errors.type}
                      disabled={status}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      id="type-rankorder"
                      label="Rank Order Response"
                      name="type"
                      value="Rank Order Response"
                      checked={formik.values.type === "Rank Order Response"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.type && formik.errors.type}
                      disabled={status}
                    />
                    {formik.touched.type && formik.errors.type && (
                      <div className="error mt-1 text-danger">
                        {formik.errors.type}
                      </div>
                    )}
                  </div>
                </Form.Group>
              </div>
            )}
            {/* Conditionally show Response View Option */}
            {formik.values.type !== "Multi-Select Response" &&
              formik.values.type !== "Rank Order Response" && (
                <div className="response-view-option">
                  <Form.Group className="form-group switchaxis d-sm-flex align-items-center mb-1">
                    <Form.Label className="mb-sm-0 mb-1 me-xl-3 me-2 w-auto d-flex align-items-center">
                      Response View Option <sup>*</sup>
                      {/* <Link to="#!" className="p-0">
                                                            <OverlayTrigger
                                                                placement="right"
                                                                overlay={
                                                                    <Tooltip id="tooltip-disabled" className="tooltip-image">
                                                                        <div style={{ maxWidth: "300px", padding: "5px" }}>
                                                                            <div className="mb-3">
                                                                                <div style={{ fontWeight: 600, marginBottom: "4px" }}>Slider View</div>
                                                                                <ImageElement
                                                                                    previewSource={slider}
                                                                                    className="img-fluid"
                                                                                    style={{
                                                                                        maxWidth: "100%",
                                                                                        border: "1px solid #ccc",
                                                                                        borderRadius: "6px",
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <div>
                                                                                <div style={{ fontWeight: 600, marginBottom: "4px" }}>Vertical View</div>
                                                                                <ImageElement
                                                                                    previewSource={vertical}
                                                                                    className="img-fluid"
                                                                                    style={{
                                                                                        maxWidth: "100%",
                                                                                        border: "1px solid #ccc",
                                                                                        borderRadius: "6px",
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <span className="d-flex ms-1">
                                                                    <em
                                                                        className="icon-info-circle"
                                                                        style={{ pointerEvents: "none" }}
                                                                    />
                                                                </span>
                                                            </OverlayTrigger>
                                                        </Link> */}
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
                        checked={
                          formik.values.responseViewOption === "vertical"
                        }
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
                value={responseType.find(
                  (option) => option.value === formik.values.responseType
                )}
                disabled={status}
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
                  disabled={status}
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
                {questionType ? (
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
                ) : (
                  <>
                    {formik?.values?.type !== "Rank Order Response" && (
                      <Col xs={1} className="text-center">
                        Oeq
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="tooltip-disabled">
                              Selecting an OEQ box associated with a response
                              will trigger an open-ended question e.g., asking
                              the participant to clarify why they chose this
                              response.
                            </Tooltip>
                          }
                        >
                          <span className="ms-1 d-inline-block">
                            <em className="icon-info-circle" />
                          </span>
                        </OverlayTrigger>
                      </Col>
                    )}
                  </>
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
                    <div className=" d-flex align-items-center mt-2">
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

                  {questionType ? (
                    <Col
                      xs={1}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <Form.Group className="form-group d-flex align-items-center mt-1">
                        <Form.Check
                          type="checkbox"
                          label=" "
                          checked={response.hasOeq}
                          onChange={() => handleCheckboxChangeOeq(index)}
                          disabled={status}
                          className="mt-1"
                        />
                      </Form.Group>
                    </Col>
                  ) : (
                    <>
                      {formik?.values?.type !== "Rank Order Response" && (
                        <Col
                          xs={1}
                          className="d-flex align-items-center justify-content-center"
                        >
                          <Form.Group className="form-group d-flex align-items-center mt-1">
                            <Form.Check
                              type="checkbox"
                              label=" "
                              checked={response.hasOeq}
                              onChange={() => handleCheckboxChangeOeq(index)}
                              disabled={status}
                              className="mt-1"
                            />
                          </Form.Group>
                        </Col>
                      )}
                    </>
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
                            if (!status) {
                              handleAddRow();
                            }
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
                            if (!status) {
                              handleDeleteRow(index);
                            }
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
                            formik.errors.responses?.[index]?.openEndedQuestion
                          }
                        />
                        {formik.touched.responses?.[index]?.openEndedQuestion &&
                          formik.errors.responses?.[index]
                            ?.openEndedQuestion && (
                            <div className="text-danger small">
                              {formik.errors.responses[index].openEndedQuestion}
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
                      // onChange={formik.handleChange}
                      // onChange={handleResponseBlockName(e)}
                      onChange={(e) => {
                        handleResponseBlockName(e);
                      }}
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
        <div className="d-flex justify-content-end gap-2">
          <Button
            variant="secondary"
            className="ripple-effect"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="ripple-effect"
            disabled={isSubmitting}
          >
            {isSubmitting ? BUTTON_TYPE?.load : BUTTON_TYPE?.type}
          </Button>
        </div>
      </Form>
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
      <SweetAlert
        title="Are you sure?"
        text="You want to delete this data!"
        show={isAlertVisible}
        icon="warning"
        onConfirmAlert={onConfirmAlertModal}
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={setIsAlertVisible}
        isConfirmedTitle="Deleted!"
        isConfirmedText="Question deleted successfully."
      />
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
