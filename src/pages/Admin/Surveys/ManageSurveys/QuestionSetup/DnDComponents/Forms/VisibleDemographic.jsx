import { Col, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { commonService } from "services/common.service";
import { QuestionSetup } from "apiEndpoints/QuestionSetup";
import toast from "react-hot-toast";
import { useAuth } from "customHooks";
import { buildHierarchy, convertToLevelsAndLevelData } from "utils/common.util";
import { useSurveyDataOnNavigations } from "customHooks";
import {
  Button,
  ImageElement,
  InputField,
  ModalComponent,
  SelectField,
  SweetAlert,
} from "../../../../../../../components";
import FromResourceModel from "../../ModelComponent/FromResourceModel";
import AddToResourceModelNoFormik from "../../ModelComponent/AddToResourceModelNoFormik";
import QuestionBankModal from "../../ModelComponent/QuestionBankModal";
import ResponseViewTooltip from "../../Tooltip";

const TableView = ({ level, title, data }) => {
  const titleVal = title.find((ele) => ele.keyLevel === level).levelName ?? "";

  return (
    <div className="mb-lg-4 mb-3">
      <h2> {`Level-${level}`}</h2>
      <h3> {titleVal}</h3>
      <div className="tablecover">
        <table className="table  table-bordered">
          <thead className="table-grey">
            <tr>
              <th>S.No</th>
              <th>Response</th>
              <th>Related To</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item["s.no"]}</td>
                <td>{item.response}</td>
                <td>{item.relatedTo || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const questionOptions = [
  { value: "Demographic", label: "Demographic" },
  { value: "VisibleDemographic", label: "Demographic" },
  { value: "Rating", label: "Rating" },
  { value: "Nested", label: "Nested" },
  { value: "Multi Response", label: "Multi Response" },
  { value: "Open Ended", label: "Open Ended" },
  { value: "Gate Qualifier", label: "Gate Qualifier" },
];

export default function VisibleDemographic({
  setActiveForm,
  outcome,
  surveyID,
  companyID,
  updateQuestionListByOutComeID,
  totalCount,
  initialQuestionData,
  usedCount,
  handleEditClose,
  edit,
}) {
  // Importing user data from custom authentication hook
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [draggedItem, setDraggedItem] = useState(null);

  const [surveyType, setSurveyType] = useState([]);
  const { getSurveyDataOnNavigate } = useSurveyDataOnNavigations();
  const surevyData = getSurveyDataOnNavigate();
  const status = surevyData?.status !== "Design";
  const [displayBlockShow, setDisplayBlockShow] = useState(false);

  // add question bank modal
  const [showBankAttributes, setShowBankAttributes] = useState(false);
  const handleCheckboxChange = (e) => {
    setShowBankAttributes(e.target.checked);
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

  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const questionBankClose = () => setShowQuestionBank(false);
  const questionBankShow = () => setShowQuestionBank(true);

  const [fromResource, setFromResource] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
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
    levels: [{ value: 1, label: "Level 1" }],
    levelData: [
      {
        keyLevel: 1,
        data: [
          {
            "s.no": 1,
            response: "",
            relatedTo: "",
          },
        ],
      },
      // {
      //   keyLevel: 2,
      //   data: [
      //     {
      //       "s.no": 1,
      //       response: "",
      //       relatedTo: ""
      //     },
      //   ]
      // },
      // {
      //   keyLevel: 3,
      //   data: [
      //     {
      //       "s.no": 1,
      //       response: "",
      //       relatedTo: ""
      //     },
      //   ]
      // }
    ],
    finalLevelData: [],
    levelDisplayName: "",
    surveyType: "",
    keywords: "",
  });

  const [selectedLevel, setSelectedLevel] = useState(1);
  // const [newLevelName, setNewLevelName] = useState("");

  const [responseType, setResponseType] = useState([]);
  const [scale, setScale] = useState([]);
  const [grouppedData, setGrouppedData] = useState([]);

  const [errors, setErrors] = useState({});

  const removePropertyIfExists = (obj, key) => {
    if (key in obj) {
      const newObj = { ...obj }; // Clone to avoid mutating state directly
      delete newObj[key];
      return newObj;
    }
    return obj; // Return original if key doesn't exist
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

  const fetchResponseTypeScale = async (
    responseTypeID,
    scaleValue,
    field,
    isonchange = false
  ) => {
    try {
      const response = await commonService({
        apiEndPoint: QuestionSetup.getResponseType,

        queryParams: scaleValue
          ? {
              surveyID,
              companyID,
              responseTypeID,
              scale: scaleValue,
              questionID: initialQuestionData?.questionID,
            }
          : {
              surveyID,
              companyID,
              responseTypeID,
              questionID: initialQuestionData?.questionID,
            },
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
        updatedData.addToResource = false;
        updatedData.addToResourceDescription = "";

        setFormData(updatedData);
        setDisplayBlockShow(false);
      }
    } catch (error) {
      console.error("Error add outcome:", error);
    }
  };

  const handleScale = (value, responseTypeVal) => {
    fetchResponseTypeScale(responseTypeVal, value);
  };

  const handleSelectChange = async (value, field) => {
    if (value === "123456789") {
      const updatedData = { ...formData };
      updatedData[field] = value;
      if (field === "responseType") {
        await fetchResponseTypeScale(value, null, field);
        const ResponseList = getSurveyData(grouppedData, value);
        updatedData.responses = convertResponseList(ResponseList);
        updatedData.scale = ResponseList?.length;
        updatedData.addToResource = false;
        updatedData.addToResourceDescription = "";
      }
      setFormData(updatedData);
      setDisplayBlockShow(false);
    } else {
      await fetchResponseTypeScale(value, null, field, true);
      // const updatedData = { ...formData };
      // updatedData[field] = value;
      // updatedData.addToResource = false;
      //   updatedData.addToResourceDescription = ""
      // setFormData(updatedData);
    }
    const errorObj = removePropertyIfExists(errors, field);

    setErrors(errorObj);
  };

  const handleNestedInputChange = (e, field, index, errField) => {
    const { value, type, checked } = e.target;
    const updatedData = { ...formData };
    if (type === "checkbox") {
      updatedData[field] = checked;
      updatedData.responses[index][field] = checked;
    } else {
      updatedData.responses[index][field] = value;
    }
    const errorObj = removePropertyIfExists(errors, errField);

    setErrors(errorObj);
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
    const errorObj = removePropertyIfExists(errors, field);

    if (
      field === "configureResponseBlockFilter" &&
      formData?.levelData?.length === 0
    ) {
      updatedData.levelData = [
        {
          keyLevel: 1,
          data: [
            {
              "s.no": 1,
              response: "",
              relatedTo: "",
            },
          ],
        },
      ];
      updatedData.levels = [{ value: 1, label: "Level 1" }];
    }

    setErrors(errorObj);
    setFormData(updatedData);
  };
  const handleLevelName = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      levelData: prevData.levelData.map((level, index) =>
        index === selectedLevel - 1 ? { ...level, levelName: value } : level
      ),
    }));

    setErrors({...errors,[`displayName-${selectedLevel}`]: null})
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
    let isValidLocal = true;
    // if (formData.configureResponseBlockFilter) {
    //   const target = formData.levelData.find(
    //     (levelValue) => levelValue.keyLevel === selectedLevel
    //   );

    //   if (
    //     !target?.levelName ||
    //     (target?.levelName && target?.levelName.trim() === "")
    //   ) {
    //     isValidLocal = false;
    //     toast.error("Display Name is required", { toastId: "resdis" });
    //   } else if (formData.levelData.length < 2) {
    //     isValidLocal = false;
    //     toast.error("Atleast two levels should be added", {
    //       toastId: "reserror",
    //     });
    //   }

    //   if (target?.data.length > 0) {
    //     target.data.forEach((item, index) => {
    //       // Check if 'response' key is empty
    //       if (item.response === "") {
    //         isValidLocal = false;
    //         validationErrors[`levelDataResponse-${index}-${selectedLevel}`] =
    //           "Response is required.";
    //       }

    //       // Check if 'relatedTo' key is empty
    //       if (item.relatedTo === "" && target.keyLevel !== 1) {
    //         isValidLocal = false;
    //         validationErrors[`levelDataRelatedTo-${index}-${selectedLevel}`] =
    //           "Related to is required.";
    //       }
    //     });
    //   }

    //   if (isValidLocal && target?.data.length > 0) {
    //     target.data.forEach((item, index) => {
    //       delete validationErrors[
    //         `levelDataRelatedTo-${index}-${selectedLevel}`
    //       ];
    //       delete validationErrors[
    //         `levelDataResponse-${index}-${selectedLevel}`
    //       ];
    //     });
    //     setErrors(validationErrors);
    //     setFormData((prevData) => ({
    //       ...prevData,
    //       finalLevelData: prevData?.levelData,
    //     }));
    //   }
    // }

    if (formData.configureResponseBlockFilter) {
      let errorFound = false;
      let innerResErr = false;

      for (let i = 0; i < formData.levelData.length; i++) {
        if (errorFound || innerResErr) {
          setSelectedLevel(i);
          break;
        }
        if (formData.levelData[i]?.data.length > 0) {
          formData.levelData[i].data.forEach((item, index) => {
            // Check if 'response' key is empty
            if (item.response === "") {
              innerResErr = true;
              validationErrors[`levelDataResponse-${index}-${i + 1}`] =
                "Response is required.";
            }

            // Check if 'relatedTo' key is empty
            if (item.relatedTo === "" && formData.levelData[i].keyLevel !== 1) {
              innerResErr = true;
              validationErrors[`levelDataRelatedTo-${index}-${i + 1}`] =
                "Related to is required.";
            }
          });
        }
        if (
          !formData.levelData[i].levelName ||
          formData.levelData[i].levelName.trim() === ""
        ) {
          validationErrors[`displayName-${i + 1}`] = "Display Name is required";
          errorFound = true;
        }
      }

      for (const item of formData.levelData) {
        if (item.data.length < 2) {
          toast.error("Atleast two levels should be added for each level", {
            toastId: "reserror",
          });
          isValidLocal = false;
          break;
        }
      }
    }

    if (Object.keys(validationErrors).length > 0 || !isValidLocal) {
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

  // Question Bank Modal start
  const [showfilterpreview, setShowfilterpreview] = useState(false);
  const filterpreviewClose = () => setShowfilterpreview(false);
  const filterpreviewShow = () => setShowfilterpreview(true);

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
        isPreLoad: false,
        allResponse: convertResponseData(values?.responses),
        isQuestionAddedToResource: values?.addToquestionResourse ? 1 : 0,
        surveyTypeID: values?.surveyType,
        keywords: values?.keywords || "",
        isResponseAddedToResource: values?.addToResource,
        responseBlockName: values?.addToResourceDescription || "",
        isSlider: values?.responseView === "slider",
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

  const postDataWithfilter = async (values) => {
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
        response: buildHierarchy(values?.levels, values?.finalLevelData),
        isQuestionAddedToResource: values?.addToquestionResourse ? 1 : 0,
        surveyTypeID: values?.surveyType,
        keywords: values?.keywords,
        isResponseAddedToResource: values?.addToResource,
        responseBlockName: values?.addToResourceDescription || "",
        isSlider: values?.responseViewOption === "slider",
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
      if (formData.configureResponseBlockFilter) {
        const validationErrors = {};
        formData?.levelData.forEach((item, index) => {
          // Check if 'response' key is empty
          item.data.forEach((ele, idx) => {
            if (ele.response === "") {
              validationErrors[`levelDataResponse-${index}-${idx + 1}`] =
                "response is required.";
            }

            // Check if 'relatedTo' key is empty
            if (ele.relatedTo === "" && index !== 0) {
              validationErrors[`levelDataRelatedTo-${index}-${idx + 1}`] =
                "Related to is required.";
            }
          });
        });

        if (Object.keys(validationErrors).length > 0) {
          toast.error(
            "Response or Related To field is missing check in all level"
          );
          return false;
        }
      }

      if (formData?.configureResponseBlockFilter) {
        const filterInsufficientRes = finalData.levelData.filter(
          (ele) => ele.data?.length < 2
        );
        if (filterInsufficientRes?.length > 0) {
          toast.error(
            "A minimum of two responses is required for each level.",
            { toastId: "err002" }
          );
        } else {
          postDataWithfilter(finalData);
        }
      } else {
        if (finalData.responses?.length < 2) {
          toast.error("A minimum of two responses is required", {
            toastId: "err001",
          });
        } else {
          postDataWithoutFilter(finalData);
        }
      }
    }
  };

  const fetchResponseType = async () => {
    try {
      let params = edit
        ? {
            surveyID,
            companyID,
            questionID: initialQuestionData?.questionID,
            responseType: formData.configureResponseBlockFilter
              ? "Demographic_Branch_Filter"
              : "Demographic",
          }
        : { surveyID, companyID, responseType: "Demographic" };

      const response = await commonService({
        apiEndPoint: QuestionSetup.getResponseType,
        queryParams: params,
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
  }, []);

  useEffect(() => {
    fetchResponseType();
  }, [formData.configureResponseBlockFilter]);

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
    if (status) return;
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
    setDisplayBlockShow(true);
  };

  const handleRemoveForm = (index) => {
    if (status) return;
    const updatedParentForms = formData;
    updatedParentForms.responses.splice(index, 1);
    formData.scale = formData?.responses?.length;

    setFormData({
      ...formData,
    });
    setDisplayBlockShow(true);
  };

  // Change selected level
  const handleLevelChange = (value) => {
    setSelectedLevel(value);
    // validateForm();
  };

  // Update input values and validate fields
  const handleInputChangeLevel = (
    levelKey,
    index,
    field,
    value,
    errField,
    preVal
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      levelData: prevData.levelData.map(
        (level) => {
          const nextLevel = levelKey + 1;

          if (level.keyLevel === levelKey) {
            return {
              ...level,
              data: level.data.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
              ),
            };
          } else if (
            level.keyLevel === nextLevel &&
            typeof preVal !== undefined
          ) {
            return {
              ...level,
              data: level.data.map((item, i) =>
                item.relatedTo === preVal ? { ...item, relatedTo: value } : item
              ),
            };
          } else {
            return level;
          }
        }
        // level.keyLevel === levelKey
        //   ? {
        //       ...level,
        //       data: level.data.map((item, i) =>
        //         i === index ? { ...item, [field]: value } : item
        //       ),
        //     }
        //   : level
      ),
    }));
    const errorObj = removePropertyIfExists(errors, errField);

    setErrors(errorObj);
  };

  // Add a new row if all fields are valid
  const addRow = (levelKey) => {
    setFormData((prevData) => ({
      ...prevData,
      levelData: prevData.levelData.map((level) =>
        level.keyLevel === levelKey
          ? {
              ...level,
              data: [
                ...level.data,
                {
                  "s.no": level.data.length + 1,
                  response: "",
                  ...(levelKey > 1 ? { relatedTo: "" } : {}),
                },
              ],
            }
          : level
      ),
    }));
  };

  // Remove a row
  const removeRow = (levelKey, index, preVal) => {
    setFormData((prevData) => ({
      ...prevData,
      levelData: prevData.levelData.map(
        (level) => {
          const nextLevel = levelKey + 1;

          if (level.keyLevel === levelKey) {
            return { ...level, data: level.data.filter((_, i) => i !== index) };
          } else if (
            level.keyLevel === nextLevel &&
            typeof preVal !== undefined
          ) {
            return {
              ...level,
              data: level.data.map((item, i) =>
                item.relatedTo === preVal ? { ...item, relatedTo: "" } : item
              ),
            };
          } else {
            return level;
          }
        }
        // level.keyLevel === levelKey
        //   ? { ...level, data: level.data.filter((_, i) => i !== index) }
        //   : level
      ),
    }));

    // Remove validation error for deleted row
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[`${levelKey}-${index}`];
      return newErrors;
    });
  };
  const validateLevelData = (levelData, checks) => {
    const levelName = levelData?.levelName?.trim();
    if (!levelName) {
      toast.error("Display Name should not be empty");
      return false;
    }

    if (checks.includes("response")) {
      const hasEmptyResponse = levelData?.data.some(
        (item) => !item.response?.trim()
      );
      if (hasEmptyResponse) {
        toast.error("Response field should not be empty");
        return false;
      }
    }

    if (checks.includes("relatedTo")) {
      const hasEmptyRelatedTo = levelData?.data.some(
        (item) => !item.relatedTo?.trim()
      );
      if (hasEmptyRelatedTo) {
        toast.error("Related to  should not be empty");
        return false;
      }
    }

    return true;
  };

  // Add a new level dynamically
  const addNewLevel = () => {
    const newLevelValue = formData.levels.length + 1;
    if (newLevelValue > 3) return;

    const newLevel = { value: newLevelValue, label: `Level ${newLevelValue}` };
    const newLevelObj = {
      keyLevel: newLevelValue,
      levelName: "",
      data: [{ "s.no": 1, response: "", relatedTo: "" }],
    };
    // Validation calls
    if (formData.levels.length === 1) {
      const levelData = formData.levelData[0];
      if (!validateLevelData(levelData, ["response"])) return;
    }

    if (formData.levels.length === 2) {
      const levelData = formData.levelData[1];
      if (!validateLevelData(levelData, ["response", "relatedTo"])) return;
    }

    setFormData((prevData) => ({
      ...prevData,
      levels: [...prevData.levels, newLevel],
      levelData: [...prevData.levelData, newLevelObj],
      finalLevelData: [...prevData.levelData, newLevelObj],
    }));

    setSelectedLevel(newLevelValue);
  };
  // Get previous level options for "Related To" field
  const getRelatedOptions = (levelKey) => {
    const previousLevel = formData.finalLevelData.find(
      (level) => level.keyLevel === levelKey - 1
    );

    return previousLevel
      ? previousLevel.data.map((item) => ({
          value: item["s.no"],
          label: item.response,
        }))
      : [];
  };

  const getRelatedValue = (levelKey, item) => {
    const previousLevel = formData.finalLevelData.find(
      (level) => level.keyLevel === levelKey - 1
    );

    if (previousLevel && item) {
      const previousLevelData = previousLevel.data.find(
        (itemData) => itemData.response === item?.relatedTo
      );

      if (previousLevelData) {
        return {
          value: previousLevelData["s.no"],
          label: previousLevelData.response,
        };
      }
    }

    return {};
  };

  // const handleUpdateLevelData = () => {
  //   validateForm();
  // };

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
    setSelectedLevel(1);

    setFromResource((prev) => !prev);
  };

  // Add this new function to transform demographic data
  const transformDemographicData = (response) => {
    if (!response || !Array.isArray(response))
      return { levels: [], levelData: [] };

    const levels = new Set();
    const levelData = new Map();
    const levelsDisplay = [];

    const processLevel = (items, parentResponse = null) => {
      items.forEach((item) => {
        // Add level to levels set
        levels.add({
          value: item.level,
          // label: item.displayName,
          label: `Level ${item.level}`,
        });
        if (!levelsDisplay.includes(item.displayName)) {
          levelsDisplay.push(item.displayName);
        }

        // Initialize level data if not exists
        if (!levelData.has(item.level)) {
          levelData.set(item.level, []);
        }

        // Add data to level
        levelData.get(item.level).push({
          "s.no": levelData.get(item.level).length + 1,
          response: item.response,
          relatedTo: parentResponse,
        });

        // Process next level if exists
        if (item.nextLevel && item.nextLevel.length > 0) {
          processLevel(item.nextLevel, item.response);
        }
      });
    };

    processLevel(response);

    return {
      levels: Array.from(levels).sort((a, b) => a.value - b.value),
      levelData: Array.from(levelData.entries()).map(([keyLevel, data]) => ({
        keyLevel,
        levelName: levelsDisplay[keyLevel - 1],
        data,
      })),
    };
  };

  function removeDuplicates(arr) {
    const uniqueMap = new Map();

    arr.forEach((item) => {
      if (!uniqueMap.has(item.value)) {
        uniqueMap.set(item.value, item);
      }
    });

    return Array.from(uniqueMap.values());
  }

  useEffect(() => {
    if (initialQuestionData) {
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

      if (initialQuestionData.isBranchFilter && initialQuestionData?.response) {
        const { levels, levelData } = transformDemographicData(
          initialQuestionData.response
        );

        levelsData = removeDuplicates(levels);
        levelDataArray = levelData;
      }

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

  const handleCancel = () => {
    if (initialQuestionData?.questionID) {
      handleEditClose();
    } else {
      setActiveForm([]);
    }
  };

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

  const handleAddQuestion = (row) => {
    setFormData((prevData) => ({
      ...prevData,
      Question: row?.question,
    }));
    questionBankClose();
  };
  const commaText = usedCount > 0 && totalCount - usedCount > 0 ? "," : "";
  return (
    <div className="visibleDemographicPage">
      <div className="dataAnalyticsCol p-0">
        <div id="dataanalyticscol">
          <div className="dataAnalyticsCol_inner">
            <Form>
              <div className="ratingQuestion ">
                <div className="d-flex align-items-start justify-content-between flex-wrap mb-xl-2 mb-3">
                  <div className="me-2">
                    <h4 className="ratingQuestion_Head">Demographic</h4>
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
                          {commaText}&nbsp;{totalCount - usedCount} Questions
                          can be added.
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
                        value={formData.intentions}
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
                        value={formData.intentionsShortName}
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
                      <Form.Label className="mb-sm-0 mb-1 me-xl-3 me-2 w-auto">
                        Configure Response Branch Filter <sup>*</sup>
                      </Form.Label>
                      <div className="switchBtn switchBtn-success switchBtn-label-nf">
                        <InputField
                          type="checkbox"
                          defaultValue="1"
                          id="branchfilter"
                          className="p-0"
                          checked={formData.configureResponseBlockFilter}
                          onChange={(e) =>
                            handleInputChange(e, "configureResponseBlockFilter")
                          }
                          disabled={status}
                        />
                        <label htmlFor="branchfilter" />
                      </div>
                    </Form.Group>
                  </div>
                </Row>
                {!formData.configureResponseBlockFilter && (
                  <Form.Group className="form-group switchaxis d-sm-flex align-items-center mb-1">
                    <Form.Label className="mb-sm-0 mb-1 me-xl-3 me-2 w-auto d-flex align-items-center">
                      Response View Option <sup>*</sup>
                      <ResponseViewTooltip />{" "}
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
                )}
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
                            value={responseType.find(
                              (option) => option.value === formData.responseType
                            )}
                            disabled={status}
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
                                        index,
                                        `subjectResponse-${index}`
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
                                          index,
                                          `childOpenEndedQuestion-${index}`
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
                                  controlId="skip1"
                                >
                                  <Form.Check
                                    type="checkbox"
                                    id="switchaxis1"
                                    className="me-0 mb-0"
                                    name="addToResource"
                                    label={<div />}
                                    onChange={(e) => {
                                      handleInputChange(e, "addToResource");
                                      validateForm();
                                    }}
                                    checked={formData.addToResource}
                                    disabled={status}
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
                {formData.configureResponseBlockFilter && (
                  <div className="addDemographicFilter mt-4">
                    <h5 className="ratingQuestion_Subhead mb-md-0 mb-2 me-2">
                      Add Demographic Filter
                    </h5>
                    <div className="d-flex justify-content-md-between align-items-center my-xl-3 my-2 flex-wrap">
                      <Form.Group className="form-group switchaxis d-sm-flex align-items-center mb-md-0 mb-2 me-2">
                        <Form.Label className="mb-sm-0 mb-1 me-xl-3 me-2 w-auto">
                          From Resource <sup>*</sup>
                        </Form.Label>
                        <div className="switchBtn switchBtn-success switchBtn-label-nf">
                          <InputField
                            type="checkbox"
                            defaultValue="1"
                            id="resource"
                            className="p-0"
                            onChange={(e) => {
                              if (e.target.checked) {
                                // deleteModalResource();
                                setFromResource((prev) => !prev);
                              }
                            }}
                          />
                          <label htmlFor="resource" />
                        </div>
                      </Form.Group>
                    </div>
                    <div className="addDemographicFilter_addlevel d-flex align-items-start">
                      <Form.Group className="form-group">
                        <Form.Label className="mb-2 d-flex align-items-center">
                          Level <sup>*</sup>
                        </Form.Label>
                        <SelectField
                          placeholder="select level"
                          options={formData.levels}
                          onChange={(option) =>
                            handleLevelChange(option?.value)
                          }
                          value={
                            formData.levels.find(
                              (option) => option.value === selectedLevel
                            ) || null
                          }
                        />
                        {errors.levels && (
                          <div className="text-danger">{errors.levels}</div>
                        )}
                      </Form.Group>
                      <Form.Group className="form-group">
                        {" "}
                        <Form.Label className="mb-2">
                          {" "}
                          Display Name <sup>*</sup>{" "}
                        </Form.Label>
                        <InputField
                          type="text"
                          placeholder="Enter Name"
                          value={
                            formData.levelData[selectedLevel - 1]?.levelName
                          }
                          onChange={(e) => handleLevelName(e.target.value)}
                          disabled={status}
                        />
                        {errors[`displayName-${selectedLevel}`] && (
                          <div className="text-danger">
                            {errors[`displayName-${selectedLevel}`]}
                          </div>
                        )}
                      </Form.Group>
                      {formData?.levels.length <= 2 && (
                        <Button
                          variant="primary"
                          className="ripple-effect"
                          onClick={addNewLevel}
                          disabled={status}
                          style={{ marginTop: "25px" }}
                        >
                          Add Level
                        </Button>
                      )}
                    </div>

                    <div className="mb-lg-0 mb-md-3 mb-2 addDemographicFilter_response">
                      <div className="scalarSec scalarappend">
                        <div className="d-flex justify-content-between gap-2 mb-0 align-items-center">
                          <div className="sequence title">Sl.No.</div>
                          <div className="scalar title">Response </div>
                          {selectedLevel > 1 && (
                            <Col xs={3} md={5} className="title">
                              Related To
                            </Col>
                          )}
                          <Col xs={2} md={1}>
                            <div className="addeletebtn title justify-content-center">
                              +/-
                            </div>
                          </Col>
                        </div>

                        {formData.levelData
                          .filter((level) => level.keyLevel === selectedLevel)
                          .map((level) => (
                            <div key={level.keyLevel} className="gap-2">
                              {level.data.map((item, index) => (
                                <div
                                  key={index}
                                  className="scalarappend_list d-flex justify-content-between mb-xl-3 mb-2 pb-xl-1 pb-0 align-items-start gap-2"
                                >
                                  <div className="sequence">
                                    {String(item["s.no"]).padStart(2, "0")}.
                                  </div>
                                  {/* <div className="sequence">{index + 1}</div> */}

                                  <Form.Group className="form-group scalar">
                                    <InputField
                                      type="text"
                                      placeholder="Enter Name"
                                      value={item.response}
                                      onChange={(e) =>
                                        handleInputChangeLevel(
                                          level.keyLevel,
                                          index,
                                          "response",
                                          e.target.value,
                                          `levelDataResponse-${index}-${selectedLevel}`,
                                          item.response
                                        )
                                      }
                                      disabled={status}
                                    />
                                    {errors[
                                      `levelDataResponse-${index}-${selectedLevel}`
                                    ] && (
                                      <div className="text-danger">
                                        {
                                          errors[
                                            `levelDataResponse-${index}-${selectedLevel}`
                                          ]
                                        }
                                      </div>
                                    )}
                                  </Form.Group>

                                  {level.keyLevel > 1 && (
                                    <Col xs={3} md={5}>
                                      <SelectField
                                        options={getRelatedOptions(
                                          level.keyLevel
                                        )}
                                        name="relatedTo"
                                        value={getRelatedValue(
                                          level.keyLevel,
                                          item
                                        )}
                                        onChange={(option) =>
                                          handleInputChangeLevel(
                                            level.keyLevel,
                                            index,
                                            "relatedTo",
                                            option.label,
                                            `levelDataRelatedTo-${index}-${selectedLevel}`
                                          )
                                        }
                                        disabled={status}
                                        className="w-100"
                                      />
                                      {errors[
                                        `levelDataRelatedTo-${index}-${selectedLevel}`
                                      ] && (
                                        <div className="text-danger">
                                          {
                                            errors[
                                              `levelDataRelatedTo-${index}-${selectedLevel}`
                                            ]
                                          }
                                        </div>
                                      )}
                                    </Col>
                                  )}

                                  <Col xs={2} md={1} className="d-flex gap-2">
                                    <div className="addeletebtn d-flex gap-2">
                                      <Link
                                        className="addbtn addscaler"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          if (!status) addRow(level.keyLevel);
                                        }}
                                      >
                                        <span>+</span>
                                      </Link>
                                    </div>
                                    {index !== 0 && (
                                      <div className="addeletebtn d-flex gap-2">
                                        <Link
                                          className="deletebtn deletebtnscaler"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            if (!status)
                                              removeRow(
                                                level.keyLevel,
                                                index,
                                                item.response
                                              );
                                          }}
                                          disabled={status}
                                        >
                                          <em className="icon-delete" />
                                        </Link>
                                      </div>
                                    )}
                                  </Col>
                                </div>
                              ))}
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="d-flex justify-content-sm-center justify-content-end gap-2 mt-xl-4 mt-3">
                      <Button
                        className="btn-warning ripple-effect"
                        onClick={filterpreviewShow}
                      >
                        Preview
                      </Button>
                      {/* <Button
                        type="button"
                        className="btn btn-primary ripple-effect"
                        onClick={handleUpdateLevelData}
                      >
                        Update
                      </Button> */}
                    </div>
                  </div>
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
                    // disabled={isSubmitting}
                  >
                    {isSubmitting ? BUTTON_TYPE?.load : BUTTON_TYPE?.type}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>

      {showQuestionBank && (
        <QuestionBankModal
          showQuestionBank={showQuestionBank}
          questionBankClose={questionBankClose}
          questionOptions={questionOptions}
          surveyOptions={surveyType}
          userData={userData}
          openFrom="VisibleDemographic"
          handleAddQuestion={handleAddQuestion}
          surveyID={surveyID}
          companyID={companyID}
          questionType="d"
        />
      )}

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

      {showfilterpreview && (
        <ModalComponent
          modalHeader="Response Branch Filter Preview"
          extraClassName="responsefilterModal"
          show={showfilterpreview}
          onHandleCancel={filterpreviewClose}
        >
          {formData.levels.length > 0 &&
            formData.levels.map((level) => {
              const levelEntry = formData.levelData.find(
                (l) => l.keyLevel === level.value
              );
              return levelEntry ? (
                <TableView
                  key={level.value}
                  level={level.value}
                  title={formData.levelData}
                  data={levelEntry.data}
                />
              ) : null;
            })}
        </ModalComponent>
      )}

      {fromResource && (
        <FromResourceModel
          showQuestionBank={fromResource}
          questionBankClose={() => {
            setFromResource((prev) => !prev);
          }}
          userData={userData}
          handleAdd={handleAdd}
          companyID={companyID}
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
