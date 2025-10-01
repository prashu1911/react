import { Col, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { commonService } from "services/common.service";
import { QuestionSetup } from "apiEndpoints/QuestionSetup";
import { useSurveyDataOnNavigations, useAuth } from "customHooks";
import { convertToLevelsAndLevelData } from "utils/common.util";
import {
  Button,
  ImageElement,
  InputField,
  SelectField,
  SweetAlert,
} from "../../../../../../../components";
import FromResourceModel from "../../ModelComponent/FromResourceModel";
import AddToResourceModelNoFormik from "../../ModelComponent/AddToResourceModelNoFormik";
import QuestionBankModal from "../../ModelComponent/QuestionBankModal";
import ResponseViewTooltip from "../../Tooltip";
import toast from "react-hot-toast";

const questionOptions = [
  { value: "Demographic", label: "Demographic" },
  { value: "VisibleDemographic", label: "Demographic" },
  { value: "Rating", label: "Rating" },
  { value: "Nested", label: "Nested" },
  { value: "Multi Response", label: "Multi Response" },
  { value: "Open Ended", label: "Open Ended" },
  { value: "Gate Qualifier", label: "Gate Qualifier" },
];
export default function DemographicUpload({
  setActiveForm,
  outcome,
  surveyID,
  companyID,
  initialQuestionData,
  handleEditClose,
  updateQuestionListByOutComeID,
  totalCount,
  usedCount,
  edit,
}) {
  // Importing user data from custom authentication hook
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [draggedItem, setDraggedItem] = useState(null);
  const [displayBlockShow, setDisplayBlockShow] = useState(false);

  const [surveyType, setSurveyType] = useState([]);
  const [scale, setScale] = useState([]);
  const BUTTON_TYPE = edit
    ? {
        load: "Updating...",
        type: "Update",
      }
    : {
        load: "Saving...",
        type: "Save",
      };

  // add question bank modal
  const [showBankAttributes, setShowBankAttributes] = useState(false);
  const handleCheckboxChange = (e) => {
    setShowBankAttributes(e.target.checked);
  };

  const [fromResource, setFromResource] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getSurveyDataOnNavigate } = useSurveyDataOnNavigations();
  const surevyData = getSurveyDataOnNavigate();
  const status = surevyData?.status !== "Design";
  const [formData, setFormData] = useState({
    addToquestionResourse: false,

    Question: "",
    intentions: "Demographic Essential",
    intentionsShortName: "Demographic Essential Alias",
    displaySkipForNow: true,
    responseView: surevyData?.isSlider ? "slider" : "vertical",
    type: "Single Select",
    responseType: "",
    responses: [],
    addToResource: false,
    addToResourceDescription: "",
    configureResponseBlockFilter: false,
    fromResource: false,
    levels: [],
    levelData: [],
    finalLevelData: [],
    levelDisplayName: "",
    surveyType: "",
    keywords: "",
  });

  const [selectedLevel, setSelectedLevel] = useState(1);

  const [responseType, setResponseType] = useState([]);
  const [grouppedData, setGrouppedData] = useState([]);

  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const questionBankClose = () => setShowQuestionBank(false);
  const questionBankShow = () => setShowQuestionBank(true);

  const [errors, setErrors] = useState({});

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

  const fetchResponseTypeScale = async (responseTypeID, scaleValue, field) => {
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
        const updatedData = { ...formData };
        updatedData[field] = responseTypeID;
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
        const ResponseList = responseData.responses;
        updatedData.responses = convertResponseList(ResponseList);
        updatedData.scale = ResponseList?.length;
        setFormData(updatedData);
      }
    } catch (error) {
      console.error("Error add outcome:", error);
    }
  };

  const handleScale = (value, responseTypeVal) => {
    fetchResponseTypeScale(responseTypeVal, value);
  };

  const handleSelectChange = (value, field) => {
    const updatedData = { ...formData };
    updatedData[field] = value;
    if (field === "responseType") {
      fetchResponseTypeScale(value, null, field);
      console.log(grouppedData, "grouppedDataNew");
      const ResponseList = getSurveyData(grouppedData, value);
      updatedData.responses = convertResponseList(ResponseList);
      updatedData.scale = ResponseList?.length;
      setFormData(false);
    }
    setFormData(updatedData);
  };

  const handleNestedInputChange = (e, field, index) => {
    const { value, type, checked } = e.target;
    const updatedData = { ...formData };
    if (type === "checkbox") {
      updatedData[field] = checked;
      updatedData.responses[index][field] = checked;
    } else {
      updatedData.responses[index][field] = value;
    }

    setFormData(updatedData);
  };

  const handleInputChange = (e, field) => {
    const { value, type, checked } = e.target;
    const updatedData = { ...formData };

    if (field === "addToResource") {
      updatedData[field] = checked;
      if (formData.responses.length > 0 && checked) {
        if (formData.responses.length === 1) {
          let title = formData.responses[0].response;
          updatedData.addToResourceDescription = title;
        } else if (formData.responses.length > 1) {
          let title1 = formData.responses[0].response;
          let title2 =
            formData.responses[formData?.responses?.length - 1].response;
          let title = `${title1}-${title2}`;
          updatedData.addToResourceDescription = title;
        }
      } 
     if (!checked) {
        updatedData.addToResourceDescription = "";
      }
    } else if (type === "checkbox") {
      updatedData[field] = checked;
    } else {
      updatedData[field] = value;
    }
    setFormData(updatedData);
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.Question) {
      validationErrors.Question = "Question is required.";
    }

    if (!formData.intentions) {
      validationErrors.intentions = "Intentions is required.";
    }

    if (!formData.intentionsShortName) {
      validationErrors.intentionsShortName =
        "Intentions short name is required.";
    }

    if (!formData.responseView) {
      validationErrors.responseView = "Response view is required.";
    }

    if (!formData.responseType && !formData.configureResponseBlockFilter) {
      validationErrors.responseType = "Response type is required.";
    }

    if (!formData.scale && !formData.configureResponseBlockFilter) {
      validationErrors.scale = "Scale is required.";
    }

    if (
      formData?.levels?.length === 0 &&
      formData.configureResponseBlockFilter
    ) {
      validationErrors.levels = "Please add levels";
    }

    if (!formData.configureResponseBlockFilter) {
      formData.responses.forEach((data, index) => {
        if (!data.response) {
          validationErrors[`subjectResponse-${index}`] =
            "response is required.";
        }
      });
    }

    if (formData.configureResponseBlockFilter) {
      let isValidLocal = true;
      const target = formData.levelData.find(
        (levelValue) => levelValue.keyLevel === selectedLevel
      );

      if (target?.data.length > 0) {
        target.data.forEach((item, index) => {
          // Check if 'response' key is empty
          if (item.response === "") {
            isValidLocal = false;
            validationErrors[`levelDataResponse-${index}-${selectedLevel}`] =
              "response is required.";
          }

          // Check if 'relatedTo' key is empty
          if (item.relatedTo === "" && target.keyLevel !== 1) {
            isValidLocal = false;
            validationErrors[`levelDataRelatedTo-${index}-${selectedLevel}`] =
              "Related to is required.";
          }
        });
      }

      if (isValidLocal && target?.data.length > 0) {
        target.data.forEach((item, index) => {
          delete validationErrors[
            `levelDataRelatedTo-${index}-${selectedLevel}`
          ];
          delete validationErrors[
            `levelDataResponse-${index}-${selectedLevel}`
          ];
        });
        setErrors(validationErrors);
        setFormData((prevData) => ({
          ...prevData,
          finalLevelData: prevData?.levelData,
        }));
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  // sweet alert
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isAlertVisibleResource, setIsAlertVisibleResource] = useState(false);
  const onConfirmAlertModal = () => {
    setIsAlertVisible(false);
    return true;
  };

  const onConfirmAlertModalResource = () => {
    setIsAlertVisibleResource(false);
    return true;
  };

  function convertResponseData(data) {
    if (data.length === 0) return [];

    return data.map((item) => {
      return {
        response: item.response,
      };
    });
  }

  const postDataWithoutFilter = async (values) => {
    try {
      setIsSubmitting(true);
      const payload = {
        companyMasterID: userData?.companyMasterID,
        companyID,
        surveyID,
        outcomeID: outcome?.id,
        intentionName: values?.intentions,
        intentionShortName: values?.intentionsShortName,
        question: values?.Question,
        isSkip: values?.displaySkipForNow,
        isBranchFilter: values?.configureResponseBlockFilter,
        scale: values?.scale,
        isSlider: values?.responseView === "slider",
        isPreLoad: true,
        allResponse: convertResponseData(values?.responses),
        isQuestionAddedToResource: values?.addToquestionResourse ? 1 : 0,
        surveyTypeID: values?.surveyType,
        keywords: values?.keywords,
        isResponseAddedToResource: values?.addToResource,
      };

      // Add questionID to payload if we're updating
      if (initialQuestionData?.questionID) {
        payload.questionID = initialQuestionData.questionID;
      }

      const apiEndPoint = initialQuestionData?.questionID
        ? QuestionSetup.updateVisibleDemographic
        : QuestionSetup.createVisibleDemographic;

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
        if (!initialQuestionData?.questionID) {
          updateQuestionListByOutComeID(outcome?.id);
          setActiveForm([]);
        } else {
          updateQuestionListByOutComeID(outcome?.id);
          handleEditClose();
        }
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error updating/adding question:", error);
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const finalData = formData;

      finalData.finalLevelData = formData?.levelData;
      if (formData?.responses?.length < 2) {
        toast.error("A minimum of two responses is required", {
          toastId: "err002",
        });
      } else {
        postDataWithoutFilter(finalData);
      }
    }
  };

  const fetchResponseType = async () => {
    try {
      const response = await commonService({
        apiEndPoint: QuestionSetup.getResponseType,
        queryParams: edit
          ? {
              surveyID,
              companyID,
              questionID: initialQuestionData?.questionID,
              responseType: "Demographic",
            }
          : { surveyID, companyID, responseType: "Demographic" },
        // queryParams: { surveyID, companyID },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        let transformedData = [{ value: "123456789", label: "Free-From" }];
        for (let temp of response?.data?.data) {
          transformedData.push({
            value: temp?.responseTypeID,
            label: temp?.responseType,
          });
        }

        setResponseType(transformedData);
        setGrouppedData([
          {
            responseType: "Free-From",
            responseTypeID: "123456789",
            responses: [
              {
                responseName: "",
                scale: 1,
                responseWeightage: ".0000",
                responseCategory: 1,
                isOEQ: 0,
                oeqQuestion: "",
              },
            ],
          },
          ...(Array.isArray(response?.data?.data) ? response?.data?.data : []),
        ]);
      }
    } catch (error) {
      console.error("Error add outcome:", error);
    }
  };

  function convertSurveyData(surveyData) {
    return surveyData.map((item) => ({
      label: item.value,
      value: item.libraryElementID,
    }));
  }

  const fetchSurveyType = async () => {
    try {
      const response = await commonService({
        apiEndPoint: QuestionSetup.getSurveyType,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status && response?.data?.data?.surveyType?.length > 0) {
        const convertedData = convertSurveyData(
          response?.data?.data?.surveyType
        );

        setSurveyType(convertedData);
      } else {
        setSurveyType([]);
      }
    } catch (error) {
      console.error("Error add outcome:", error);
    }
  };

  useEffect(() => {
    fetchSurveyType();
    fetchResponseType();
  }, []);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
    e.target.style.opacity = "0.4";
  };

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

    const items = Array.from(formData.responses);
    const draggedItemContent = items[draggedItem];
    items.splice(draggedItem, 1);
    items.splice(dropIndex, 0, draggedItemContent);

    const updatedData = { ...formData };

    updatedData.responses = items;
    setFormData(updatedData);
    setDraggedItem(null);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedItem(null);
    document.querySelectorAll(".response-item").forEach((item) => {
      item.classList.remove("drag-over");
    });
  };

  const handleAddResponseForm = (index) => {
    const newChildForm = {
      id: `${formData.responses[index] + 1}`,
      response: "",
      weightage: 1,
      category: 1,
      hasOeq: false,
      openEndedQuestion: "",
    };
    const updatedParentForms = formData;
    updatedParentForms.responses = [
      ...updatedParentForms.responses,
      newChildForm,
    ];
    updatedParentForms.scale = updatedParentForms.responses?.length;
    setFormData(updatedParentForms);
    setDisplayBlockShow(false);
  };

  const handleRemoveForm = (index) => {
    const updatedParentForms = formData;
    updatedParentForms.responses.splice(index, 1);
    updatedParentForms.scale = updatedParentForms.responses?.length;
    setFormData({
      ...formData,
    });
    setDisplayBlockShow(false);
  };

  const handleAdd = (row) => {
    const { levelData, levels } = convertToLevelsAndLevelData(
      row?.response_data?.levels,
      row?.hierarchy
    );

    setFormData((prevData) => ({
      ...prevData,
      finalLevelData: levelData,
      levelData,
      levels,
    }));

    setFromResource((prev) => !prev);
  };

  useEffect(() => {
    if (initialQuestionData) {
      console.log(initialQuestionData, "initialQuestionData");
      const responses = initialQuestionData?.response || [];
      const transformedResponses = responses.map((resp) => ({
        id: resp.responseID,
        response: resp.response,
        weightage: parseFloat(resp.responseWeightage),
        category: parseInt(resp.responseCategory),
        hasOeq: resp.isOEQ === 1,
        openEndedQuestion: resp.oeqQuestion || "",
      }));

      let levelsData = [];
      let levelDataArray = [];

      setFormData((prevFormData) => ({
        ...prevFormData,
        Question: initialQuestionData?.question || "",
        intentions: initialQuestionData?.intentionName || "",
        intentionsShortName: initialQuestionData?.intentionShortName || "",
        displaySkipForNow: initialQuestionData?.isSkip || false,
        responseView: initialQuestionData?.isSlider ? "slider" : "vertical",
        type: "Single Select",
        responseType: initialQuestionData?.responseTypeID?.toString() || "",
        scale: responses?.length || "",
        responses: transformedResponses,
        addToquestionResourse:
          initialQuestionData?.isQuestionAddedToResource === 1,
        configureResponseBlockFilter:
          initialQuestionData?.isBranchFilter || false,
        levels: levelsData,
        levelData: levelDataArray,
        finalLevelData: levelDataArray,
      }));

      // Set initial selected level if levels exist
      if (levelsData.length > 0) {
        setSelectedLevel(levelsData[0].value);
      }
    }
  }, [initialQuestionData]);

  useEffect(() => {
    if (
      responseType?.length > 0 &&
      initialQuestionData &&
      initialQuestionData?.responseTypeName
    ) {
      const reponseID = responseType.find(
        (value) => value?.label === initialQuestionData?.responseTypeName
      );

      setFormData((prevFormData) => ({
        ...prevFormData,
        responseType: reponseID?.value,
      }));
    }
  }, [responseType?.length]);

  const handleCancel = () => {
    if (initialQuestionData?.questionID) {
      handleEditClose();
    } else {
      setActiveForm([]);
    }
  };

  const handleAddQuestion = (row) => {
    setFormData((prevData) => ({
      ...prevData,
      Question: row?.question,
    }));
    questionBankClose();
  };
const commaText = usedCount > 0 && ((totalCount - usedCount) > 0) ? ',' : ""
  return (
    <div className="visibleDemographicPage">
      <div className="dataAnalyticsCol p-0">
        <div id="dataanalyticscol">
          <div className="dataAnalyticsCol_inner">
            <Form>
              <div className="ratingQuestion ">
                <div className="d-flex align-items-start justify-content-between flex-wrap mb-xl-2 mb-3">
                  <div className="me-2">
                    <h4 className="ratingQuestion_Head">Demographic Upload</h4>
                    {/* <p className="ratingQuestion_Para mb-2">
                      {usedCount} Questions added so far,{" "}
                      {totalCount - usedCount} Questions can be added.
                    </p> */}
                    <p className="ratingQuestion_Para mb-2">
                      {usedCount > 0 && (
                        <> {usedCount} Questions added so far</>
                      )}
                      {totalCount - usedCount > 0 && (
                        <>
                          {commaText}&nbsp;{totalCount - usedCount} Questions can be
                          added.
                        </>
                      )}
                    </p>
                  </div>
                </div>
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
                            onChange={(e) => {
                              handleInputChange(e, "addToquestionResourse");
                              handleCheckboxChange(e);
                            }}
                            disabled={status}
                          />
                        </Form.Group>
                      </div>
                      <InputField
                        type="text"
                        placeholder="Enter Question"
                        value={formData.Question}
                        onChange={(e) => handleInputChange(e, "Question")}
                        disabled={status}
                      />
                      {errors.Question && (
                        <div className="text-danger">{errors.Question}</div>
                      )}
                    </Form.Group>
                  </Col>
                  {/* <Col sm={6}>
                    <Form.Group className="form-group mb-0">
                      <Form.Label className="mb-2">
                        Intentions <sup>*</sup>
                      </Form.Label>
                      <InputField
                        type="text"
                        placeholder="Enter Intentions"
                        value="IG"
                        onChange={(e) => handleInputChange(e, "intentions")}
                      />
                      {errors.intentions && (
                        <div className="text-danger">{errors.intentions}</div>
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
                                Provide a short name to be used in reports and
                                chart.
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
                        // value={formData.intentionsShortName}
                        value="IG"
                        onChange={(e) =>
                          handleInputChange(e, "intentionsShortName")
                        }
                      />
                      {errors.intentionsShortName && (
                        <div className="text-danger">
                          {errors.intentionsShortName}
                        </div>
                      )}
                    </Form.Group>
                  </Col> */}

                  <div className="d-flex column-gap-xxl-5 column-gap-lg-4 column-gap-3 row-gap-1 flex-wrap">
                    <Form.Group className="form-group switchaxis d-sm-flex align-items-center mb-1">
                      <Form.Label className="mb-sm-0 mb-1 me-xl-3 me-2 w-auto">
                        Display Skip For Now <sup>*</sup>
                      </Form.Label>
                      <div className="switchBtn switchBtn-success switchBtn-label-nf">
                        <InputField
                          type="checkbox"
                          id="switchaxis1displaySkipForNow"
                          name="displaySkipForNow"
                          className="p-0"
                          onChange={(e) =>
                            handleInputChange(e, "displaySkipForNow")
                          }
                          checked={formData.displaySkipForNow}
                          disabled={status}
                        />
                        <label htmlFor="switchaxis1displaySkipForNow" />
                      </div>
                    </Form.Group>
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
                          name="responseView"
                          value="slider"
                          onChange={(e) => handleInputChange(e, "responseView")}
                          checked={formData.responseView === "slider"}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          id="responseViewOption-vertical"
                          label="Vertical"
                          name="responseView"
                          value="vertical"
                          checked={formData.responseView === "vertical"}
                          onChange={(e) => handleInputChange(e, "responseView")}
                        />
                      </div>
                      {errors.responseView && (
                        <div className="text-danger">{errors.responseView}</div>
                      )}
                    </Form.Group>
                  </div>
                </Row>
                {!formData.configureResponseBlockFilter && (
                  <>
                    <h5 className="ratingQuestion_Subhead mt-4">
                      Response Block
                    </h5>
                    <Row className="gx-2">
                      <Col sm={6}>
                        <Form.Group className="form-group">
                          <Form.Label className="mb-2 d-flex align-items-center">
                            Response Type <sup>*</sup>
                            <Link to="#!" className="p-0">
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="tooltip-disabled">
                                    Use list value Free Form to create custom
                                    response type.
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
                              handleSelectChange(option.value, "responseType");
                            }}
                            disabled={status}
                            isModal={edit}
                            value={responseType.find(
                              (option) => option.value === formData.responseType
                            )}
                          />
                          {errors.responseType && (
                            <div className="text-danger">
                              {errors.responseType}
                            </div>
                          )}
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
                                handleScale(
                                  option.value,
                                  formData.responseType
                                );
                              }}
                              value={scale.find(
                                (option) => option.value === formData.scale
                              )}
                              disabled={status}
                            />
                          ) : (
                            <InputField
                              type="text"
                              placeholder="Enter Scale"
                              name="scale"
                              value={formData.scale}
                              disabled
                            />
                          )}
                          {errors.scale && (
                            <div className="text-danger">{errors.scale}</div>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="mb-lg-0 mb-md-3 mb-2 scalarSecCover">
                      <div className="scalarSec2 scalarappend2 mt-2">
                        {/* Table Header */}

                        {formData.responses?.length > 0 && (
                          <Row className="mb-2 align-items-center">
                            <Col xs={2} sm={1}>
                              Sl.No.
                            </Col>
                            <Col xs={8} sm={10}>
                              Response
                            </Col>
                            <Col xs={2} sm={1} className="text-center">
                              +/-
                            </Col>
                          </Row>
                        )}

                        {formData.responses.map((response, index) => (
                          <div key={response.id}>
                            <Row
                              className="align-items-center mb-2"
                              draggable
                              onDragStart={(e) => handleDragStart(e, index)}
                              onDragOver={(e) => handleDragOver(e, index)}
                              onDragEnter={(e) => handleDragEnter(e, index)}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, index)}
                              onDragEnd={handleDragEnd}
                            >
                              {/* Sl.No. and Drag Icon */}
                              <Col xs={2} sm={1}>
                                <div className="sequence d-flex align-items-center">
                                  <div className="mt-1 drag-handle d-flex justify-content-center align-items-center">
                                    <em className="icon-drag" />
                                    <span className="fs-16">
                                      {String(index + 1).padStart(2, "0")}.
                                    </span>
                                  </div>
                                </div>
                              </Col>

                              {/* Input Field */}
                              <Col xs={8} sm={10}>
                                <Form.Group className="form-group  mb-0">
                                  <InputField
                                    type="text"
                                    name={`responses.${index}.response`}
                                    placeholder="Enter Response"
                                    value={response.response}
                                    onChange={(e) =>
                                      handleNestedInputChange(
                                        e,
                                        "response",
                                        index
                                      )
                                    }
                                    disabled={status}
                                  />
                                  {errors[`subjectResponse-${index}`] && (
                                    <div className="text-danger">
                                      {errors[`subjectResponse-${index}`]}
                                    </div>
                                  )}
                                </Form.Group>
                              </Col>

                              {/* Add/Delete Button */}
                              <Col xs={2} sm={1}>
                                <div className="addeletebtn d-flex gap-2 r">
                                  {index === 0 ? (
                                    <Link
                                      to="#!"
                                      className="addbtn addscaler"
                                      onClick={handleAddResponseForm}
                                    >
                                      <span>+</span>
                                    </Link>
                                  ) : (
                                    <Link
                                      to="#!"
                                      className="deletebtn deletebtnscaler"
                                      onClick={() => handleRemoveForm(index)}
                                    >
                                      <em className="icon-delete" />
                                    </Link>
                                  )}
                                </div>
                              </Col>
                            </Row>

                            {/* Open Ended Question */}
                            {Boolean(response.hasOeq) && (
                              <Row className="mt-2">
                                <Col xs={12}>
                                  <Form.Group className="form-group">
                                    <Form.Control
                                      as="textarea"
                                      rows={2}
                                      name={`responses.${index}.openEndedQuestion`}
                                      placeholder="Enter Open Ended Question"
                                      value={response.openEndedQuestion}
                                      onChange={(e) =>
                                        handleNestedInputChange(
                                          e,
                                          "openEndedQuestion",
                                          index
                                        )
                                      }
                                      disabled={status}
                                    />
                                    {errors[
                                      `childOpenEndedQuestion-${index}`
                                    ] && (
                                      <div className="text-danger">
                                        {
                                          errors[
                                            `childOpenEndedQuestion-${index}`
                                          ]
                                        }
                                      </div>
                                    )}
                                  </Form.Group>
                                </Col>
                              </Row>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {(formData.responseType === "123456789" ||
                      displayBlockShow) && (
                      <Row>
                        <Col xxl={4} lg={6}>
                          <Form.Group className="form-group">
                            <Form.Label className="mb-2 d-flex align-items-center">
                              Add Response Block to Resource
                              <Link to="#!" className="p-0">
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="tooltip-disabled">
                                      Choose relevant name for this response
                                      block, example: Agreement | Strongly
                                      disagree – Strongly agree | 5pt scale.
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
                                  controlId="switchaxis1"
                                >
                                  <Form.Check
                                    type="checkbox"
                                    id="switchaxis1"
                                    className="me-0 mb-0"
                                    name="addToResource"
                                    label={<div />}
                                    disabled={status}
                                    onChange={(e) => {
                                      handleInputChange(e, "addToResource");

                                      validateForm();
                                    }}
                                    checked={formData.addToResource}
                                  />
                                </Form.Group>
                                <InputField
                                  type="text"
                                  placeholder="Enter Response Block Name"
                                  name="addToResourceDescription"
                                  onChange={(e) =>
                                    handleInputChange(
                                      e,
                                      "addToResourceDescription"
                                    )
                                  }
                                  value={formData.addToResourceDescription}
                                  disabled={!formData.addToResource}
                                />
                              </div>

                              {errors.addToResourceDescription && (
                                <div className="text-danger">
                                  {errors.addToResourceDescription}
                                </div>
                              )}
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                    )}
                  </>
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
                    className="ripple-effect"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? BUTTON_TYPE?.load : BUTTON_TYPE?.type}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>

      <SweetAlert
        text="Already there are some responses in your draft. Do you want to continue with those data or do you want to go to Resources."
        show={isAlertVisibleResource}
        icon="info"
        onConfirmAlert={onConfirmAlertModalResource}
        showSuccessAlert={false}
        showCancelButton
        cancelButtonText="Continue "
        confirmButtonText="Go to Resources"
        setIsAlertVisible={setIsAlertVisibleResource}
        isConfirmedTitle="Deleted!"
        isConfirmedText="Question deleted successfully."
        customClass={{
          popup: "resource_modal",
          confirmButton: "resource_confirmbutton",
          cancelButton: "resource_cancelbutton",
        }}
      />

      {showQuestionBank && (
        <QuestionBankModal
          showQuestionBank={showQuestionBank}
          questionBankClose={questionBankClose}
          questionOptions={questionOptions}
          surveyOptions={surveyType}
          userData={userData}
          openFrom="Demographic"
          handleAddQuestion={handleAddQuestion}
          surveyID={surveyID}
          companyID={companyID}
          questionType="d"
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

      {fromResource && (
        <FromResourceModel
          showQuestionBank={fromResource}
          questionBankClose={() => {
            setFromResource((prev) => !prev);
          }}
          userData={userData}
          handleAdd={handleAdd}
        />
      )}

      {showBankAttributes && (
        <AddToResourceModelNoFormik
          show={showBankAttributes}
          onClose={() => setShowBankAttributes(false)}
          surveyType={surveyType}
          setShowBankAttributes={setShowBankAttributes}
          formData={formData}
          setFormData={setFormData}
        />
      )}
    </div>
  );
}
