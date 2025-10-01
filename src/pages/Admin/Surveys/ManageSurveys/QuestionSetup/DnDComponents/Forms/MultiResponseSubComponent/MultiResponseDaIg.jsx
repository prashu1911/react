import { Col, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import React from "react";
import { useEffect, useState } from "react";
import { commonService } from "services/common.service";
import { QuestionSetup } from "apiEndpoints/QuestionSetup";
import { useQuestionData, useSurveyDataOnNavigations } from "customHooks";
import {
  Button,
  InputField,
  SelectField,
  SweetAlert,
} from "../../../../../../../../components";
import QuestionBankModal from "../../../ModelComponent/QuestionBankModal";
import AddToResourceModel from "../../../ModelComponent/AddToResourceModel";

export default function MultiResponseDaIG({
  setActiveForm,
  outcome,
  surveyID,
  companyID,
  responseType,
  grouppedData,
  userData,
  updateQuestionListByOutComeID,
  surveyType,
  initialQuestionData,
  questionOptions,
  handleEditClose,
  edit,
  questionType,
}) {
  // sweet alert
  const [formData, setFormData] = useState({
    framingQuestion: "",
    displaySkipForNow: true,
    addToquestionResourse: false,
    randamizeQuestion: false,
    type: "Single Select",
    subject: [
      {
        id: "1",
        anchor: false,
        response: "",
      },
    ],
    parentForms: [
      {
        definingQuestion: "",
        intentions: "",
        intentionsShortName: "",
        responseType: "",
        scale: "",
        childForms: [],
        addToResource: false,
        responseBlockName: "",
      },
    ],
  });

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scale, setScale] = useState([]);
  const onConfirmAlertModal = () => {
    setIsAlertVisible(false);
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
  const [draggedItem, setDraggedItem] = useState(null);
  // Question Bank Modal start
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const questionBankClose = () => setShowQuestionBank(false);
  const questionBankShow = () => setShowQuestionBank(true);
  const { getSurveyDataOnNavigate } = useSurveyDataOnNavigations();
  const { dispatchQuestionData, getQuestionData } = useQuestionData();
  const questionDataResponse = getQuestionData();
  const surevyData = getSurveyDataOnNavigate();
  const rangeStart = Number.isNaN(Number(surevyData?.rangeStart))
    ? 0
    : Number(surevyData?.rangeStart);
  const rangeEnd = Number.isNaN(Number(surevyData?.rangeEnd))
    ? 0
    : Number(surevyData?.rangeEnd);
  const status = surevyData?.status !== "Design";
  const [showBankAttributes, setShowBankAttributes] = useState(false);

  useEffect(() => {
    if (initialQuestionData) {
      // Transform defineQuestion data to match form structure
      const transformedParentForms =
        initialQuestionData.defineQuestion?.map((defineQ) => {
          // Get the first questionSub since that contains our response data
          const questionSub = defineQ.questionSub[0];
          return {
            definingQuestion: defineQ.question || "",
            intentions: defineQ?.intentionName || "",
            intentionsShortName: defineQ?.intentionShortName || "",
            responseType: questionSub?.responseTypeID?.toString() || "",
            responseTypeID: questionSub?.responseTypeID?.toString() || "",
            scale: questionSub?.response?.length || "",
            childForms:
              questionSub?.response?.map((resp) => ({
                id: resp.responseID,
                response: resp.response,
                weightage: parseFloat(resp.responseWeightage),
                category: resp.responseCategory,
                hasOeq: resp.isOEQ === 1,
                openEndedQuestion: resp.oeqQuestion || "",
              })) || [],
          };
        }) || [];

      // Transform subjects from questionSub
      const transformedSubjects =
        initialQuestionData.defineQuestion?.[0]?.questionSub?.map(
          (sub, index) => ({
            id: (index + 1).toString(),
            anchor: sub.questionAnchor === 1,
            response: sub.questionSub,
          })
        ) || [
          {
            id: "1",
            anchor: false,
            response: "",
          },
        ];

      setFormData((prevFormData) => ({
        ...prevFormData,
        framingQuestion: initialQuestionData.question || "",
        displaySkipForNow: initialQuestionData.isSkip || false,
        addToquestionResourse: false, // Set based on your needs
        randamizeQuestion: initialQuestionData.isRandom || false,
        subject: transformedSubjects,
        type: initialQuestionData?.responseSelectedType,
        parentForms:
          transformedParentForms.length > 0
            ? transformedParentForms
            : [
                {
                  definingQuestion: "",
                  intentions: "",
                  intentionsShortName: "",
                  responseType: "",
                  scale: "",
                  childForms: [],
                },
              ],
      }));
    }
  }, [initialQuestionData]);

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
      // weightage: index === 0 ? rangeEnd || item.responseWeightage : item.responseWeightage,
      // weightage: index === 0 ? rangeEnd || parseFloat(item.responseWeightage) : parseFloat(item.responseWeightage),
      weightage:
        parseFloat(item.responseWeightage) === 0
          ? 0
          : parseFloat(item.responseWeightage) || rangeEnd,
      category: item.responseCategory,
      hasOeq: item.isOEQ,
      openEndedQuestion: item.oeqQuestion,
    }));
  }

  const handleAddResponseBlockToResourceTitle = (arrVal) => {
    if (Array.isArray(arrVal) && arrVal.length > 0) {
      if (arrVal.length === 1) {
        let title = arrVal[0]?.response;
        return title;
      } else if (Array.isArray(arrVal) && arrVal.length > 1) {
        let title1 = arrVal[0]?.response;
        let title2 = arrVal[arrVal?.length - 1]?.response;

        let title = `${title1}-${title2}`;
        return title;
      }
    }

    return "";
  };
  const handleInputChange = (e, section, index, field, childIndex) => {
    const { value, type, checked } = e.target;

    const updatedData = { ...formData };

    if (section === "subject") {
      const updatedSubject = [...updatedData.subject];
      updatedSubject[index] = {
        ...updatedSubject[index],
        [field]: type === "checkbox" ? checked : value,
      };
      updatedData.subject = updatedSubject;
    } else if (section === "parentForms") {
      const updatedParentForms = [...updatedData.parentForms];
      let textVal = "";
      if (field === "addToResource" && checked) {
        textVal = handleAddResponseBlockToResourceTitle(
          updatedParentForms[index].childForms
        );
      }
      updatedParentForms[index] = {
        ...updatedParentForms[index],
        [field]: type === "checkbox" ? checked : value,
        responseBlockName: textVal,
      };

      updatedData.parentForms = updatedParentForms;
    } else if (section === "childForms") {
      const updatedParentForms = [...updatedData.parentForms];
      const childForms = [...updatedParentForms[index].childForms];
      childForms[childIndex] = {
        ...childForms[childIndex],
        [field]: type === "checkbox" ? checked : value,
      };
      updatedParentForms[index] = { ...updatedParentForms[index], childForms };
      updatedData.parentForms = updatedParentForms;
    } else {
      updatedData[field] = type === "checkbox" ? checked : value;
      if (type === "checkbox" && section === "addToquestionResourse") {
        setShowBankAttributes(checked);
      }
    }
    setFormData(updatedData);
  };

  // const handleInputChange = (e, section, index, field, childIndex) => {
  //     // const { value } = e.target;
  //     const { value, type, checked } = e.target;

  //     const updatedData = { ...formData };

  //     if (section === "subject" && type === "checkbox") {
  //         updatedData.subject[index][field] = checked;
  //     } else if (section === "subject") {
  //         updatedData.subject[index][field] = value;
  //     } else if (section === "parentForms" && type === "checkbox") {
  //         updatedData.parentForms[index][field] = checked;
  //     } else if (section === "parentForms") {
  //         updatedData.parentForms[index][field] = value;
  //     } else if (section === "childForms" && type === "checkbox") {
  //         updatedData.parentForms[index].childForms[childIndex][field] = checked;
  //     } else if (section === "childForms") {
  //         updatedData.parentForms[index].childForms[childIndex][field] = value;
  //     } else if (type === "checkbox") {
  //         updatedData[field] = checked;
  //         setShowBankAttributes(checked && section === 'addToquestionResourse');
  //     } else {
  //         updatedData[field] = value;
  //     }
  //     console.log(updatedData, "updatedDataIG773");

  //     setFormData(updatedData);
  //     // eslint-disable-next-line no-use-before-define
  //     // validateFormOnchange(updatedData);
  // };

  const fetchResponseType = async (
    responseTypeID,
    section,
    index,
    field,
    childIndex,
    scaleValue
  ) => {
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
        const indexVal = scaleValue ? 1 : 0;
        const responseData = response?.data?.data?.[indexVal];
        if (!responseData) return;
        const rawScale = responseData.scale;
        if (!scaleValue) {
          const scaleResponse = Array.isArray(rawScale)
            ? rawScale.map((item) => ({ value: item, label: item }))
            : [];
          setScale(scaleResponse);
        }
        const responseList = responseData.responses;
        updatedData.parentForms[index].scale = responseList?.length;
        updatedData.parentForms[index].childForms =
          convertResponseList(responseList);
        setFormData(updatedData);
      }
    } catch (error) {
      console.error("Error add outcome:", error);
    }
  };

  const handleScale = (value, section, index, field, scaleV) => {
    fetchResponseType(value, section, index, field, null, scaleV);
  };

  const handleSelectChange = (value, section, index, field, childIndex) => {
    // const { value } = e.target;

    const updatedData = { ...formData };
    if (section === "parentForms" && field === "responseType") {
      updatedData.parentForms[index][field] = value;
      fetchResponseType(value, section, index, field, childIndex, null);
      const ResponseList = getSurveyData(grouppedData, value);
      updatedData.parentForms[index].scale = ResponseList?.length;
      updatedData.parentForms[index].childForms =
        convertResponseList(ResponseList);
      updatedData.parentForms[index].addToResource = false;
      updatedData.parentForms[index].responseBlockName = "";
    } else if (section === "childForms") {
      updatedData.parentForms[index].childForms[childIndex][field] = value;
      if (field === "category" && value === 3) {
        updatedData.parentForms[index].childForms[childIndex]["weightage"] *=
          -1;
      }
    }

    setFormData(updatedData);
    // eslint-disable-next-line no-use-before-define
    // validateFormOnchange(updatedData);
  };

  const handleAddSubject = () => {
    const newSubject = {
      id: `${formData.subject.length + 1}`,
      anchor: false,
      response: "",
    };
    setFormData({
      ...formData,
      subject: [...formData.subject, newSubject],
    });
  };

  const handleAddParentForm = () => {
    const newParentForm = {
      definingQuestion: "",
      intentions: questionType ? "" : "",
      intentionsShortName: questionType ? "" : "",
      responseType: "",
      scale: "",
      childForms: [],
    };
    setFormData({
      ...formData,
      parentForms: [...formData.parentForms, newParentForm],
    });
  };

  const handleAddChildForm = (parentIndex) => {
    let isOutOfRange = false;

    const parentForm = formData.parentForms[parentIndex];
    const childForms = [...parentForm.childForms]; // clone array
    const childForms22 = [...parentForm.childForms];

    childForms22.forEach((response) => {
      const weightage = Number(response.weightage);
      if (weightage < rangeStart || weightage > rangeEnd) {
        isOutOfRange = true;
      }
    });

    if (isOutOfRange) {
      setIsSubmitting(false);
      toast.error(
        `Value Range Should be In between ${rangeStart} - ${rangeEnd}`,
        {
          toastId: "error001",
        }
      );
      return;
    }

    const newChildForm = {
      id: `${childForms.length + 1}`,
      response: "",
      weightage: 1,
      category: 1,
      hasOeq: false,
      openEndedQuestion: "",
    };

    const updatedChildForms = [...childForms, newChildForm];

    const weightageAvg = rangeEnd / updatedChildForms.length;

    const reweightedChildForms = updatedChildForms.map((item, index) => {
      const responseLength = index + 1;
      return {
        ...item,
        weightage: parseFloat((weightageAvg * responseLength).toFixed(2)),
      };
    });

    const updatedParentForms = [...formData.parentForms];
    updatedParentForms[parentIndex] = {
      ...parentForm,
      childForms: reweightedChildForms,
      scale: reweightedChildForms.length,
      addToResource: false,
      responseBlockName: "",
    };

    setFormData({
      ...formData,
      parentForms: updatedParentForms,
    });
  };

  // const handleAddChildForm = (parentIndex) => {
  //     console.log(rangeEnd, "rangeEnd");
  //     console.log(formData.parentForms[parentIndex].childForms.length + 1, "index");
  //     // const responseLength = formData.parentForms[parentIndex].childForms.length + 1;
  //     let isOutOfRange = false;
  //     formData.parentForms[parentIndex].childForms.forEach((response) => {
  //         const weightage = Number(response.weightage); // Ensure it's a number

  //         if (weightage < rangeStart || weightage > rangeEnd) {
  //             isOutOfRange = true;
  //         }
  //     });
  //     if (isOutOfRange) {
  //         setIsSubmitting(false);
  //         toast.error(`Weightage Range Should be In between ${rangeStart} - ${rangeEnd}`, {
  //             toastId: "error001"
  //         });
  //         return true;
  //     }
  //     const newChildForm = {
  //         id: `${formData.parentForms[parentIndex].childForms.length + 1}`,
  //         response: "",
  //         weightage: 1,
  //         category: "",
  //         hasOeq: false,
  //         openEndedQuestion: "",
  //     };
  //     const updatedParentForms = [...formData.parentForms];
  //     updatedParentForms[parentIndex].childForms.push(newChildForm);

  //     const weightageAvg = rangeEnd / (updatedParentForms[parentIndex].childForms?.length);

  //     updatedParentForms[parentIndex].childForms = updatedParentForms[parentIndex].childForms
  //         .reverse()
  //         .map((item, index) => {
  //             const responseLength = index + 1;
  //             return {
  //                 ...item,
  //                 weightage: parseFloat((weightageAvg * responseLength).toFixed(2))
  //             };
  //         });

  //     updatedParentForms[parentIndex].scale =
  //         updatedParentForms[parentIndex]?.childForms?.length || 0;

  //     setFormData({
  //         ...formData,
  //         parentForms: updatedParentForms,
  //     });
  // };

  const handleRemoveSubject = (subjectIndex) => {
    const updatedSubjects = formData.subject.filter(
      (_, index) => index !== subjectIndex
    );
    setFormData({ ...formData, subject: updatedSubjects });
  };

  const handleRemoveParentForm = (parentIndex) => {
    const updatedParentForms = formData.parentForms.filter(
      (_, index) => index !== parentIndex
    );
    setFormData({ ...formData, parentForms: updatedParentForms });
  };

  const handleRemoveChildForm = (parentIndex, childIndex) => {
    const updatedParentForms = [...formData.parentForms];
    updatedParentForms[parentIndex].childForms.splice(childIndex, 1);
    updatedParentForms[parentIndex].addToResource = false;
    updatedParentForms[parentIndex].responseBlockName = "";
    updatedParentForms[parentIndex].scale =
      updatedParentForms[parentIndex]?.childForms?.length || 0;

    setFormData({
      ...formData,
      parentForms: updatedParentForms,
    });
  };

  // const validateFormOnchange = (Data) => {
  //   const validationErrors = {};

  //   if (!Data.framingQuestion) {
  //     validationErrors.framingQuestion = "Framing question is required.";
  //   }

  //   Data.subject.forEach((subject, index) => {
  //     if (!subject.response) {
  //       validationErrors[`subjectResponse-${index}`] =
  //         "Subject response is required.";
  //     }
  //   });

  //   Data.parentForms.forEach((parentForm, parentIndex) => {
  //     if (!parentForm.definingQuestion) {
  //       validationErrors[`parentDefiningQuestion-${parentIndex}`] =
  //         "Defining question is required.";
  //     }
  //     if (!parentForm.intentions) {
  //       validationErrors[`parentIntentions-${parentIndex}`] =
  //         "Intentions are required.";
  //     }
  //     if (!parentForm.intentionsShortName) {
  //       validationErrors[`parentIntentionsShortName-${parentIndex}`] =
  //         "intentions ShortName are required.";
  //     }
  //     if (!parentForm.responseType) {
  //       validationErrors[`parentResponseType-${parentIndex}`] =
  //         "response type is required.";
  //     }

  //     parentForm.childForms.forEach((childForm, childIndex) => {
  //       if (!childForm.response) {
  //         validationErrors[`childResponse-${parentIndex}-${childIndex}`] =
  //           "Child response is required.";
  //       }
  //       if (
  //         childForm.weightage <= 0 ||
  //         childForm.weightage === "" ||
  //         !childForm.weightage ||
  //         (rangeStart >= childForm.weightage && rangeEnd <= childForm.weightage)
  //       ) {
  //         validationErrors[`childWeightage-${parentIndex}-${childIndex}`] =
  //           "Weightage is required and should be greater than zero";
  //       }

  //       if (childForm.category === undefined || childForm.category === null) {
  //         validationErrors[`childCategory-${parentIndex}-${childIndex}`] =
  //           "Category is required";
  //       }

  //       if (
  //         (childForm.openEndedQuestion === undefined ||
  //           childForm.openEndedQuestion === null ||
  //           childForm.openEndedQuestion === "") &&
  //         childForm.hasOeq
  //       ) {
  //         validationErrors[
  //           `childOpenEndedQuestion-${parentIndex}-${childIndex}`
  //         ] = "Open ended question is required";
  //       }
  //     });
  //   });

  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     return false;
  //   }

  //   setErrors({});
  //   return true;
  // };

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.framingQuestion) {
      validationErrors.framingQuestion = "Framing question is required.";
    }

    formData.subject.forEach((subject, index) => {
      if (!subject.response) {
        validationErrors[`subjectResponse-${index}`] =
          "Subject response is required.";
      }
    });

    formData.parentForms.forEach((parentForm, parentIndex) => {
      if (!parentForm.definingQuestion) {
        validationErrors[`parentDefiningQuestion-${parentIndex}`] =
          "Defining question is required.";
      }
      if (!parentForm.intentions) {
        validationErrors[`parentIntentions-${parentIndex}`] =
          "Intentions are required.";
      }
      if (!parentForm.intentionsShortName) {
        validationErrors[`parentIntentionsShortName-${parentIndex}`] =
          "intentions ShortName are required.";
      }
      if (!parentForm.responseType) {
        validationErrors[`parentResponseType-${parentIndex}`] =
          "response type is required.";
      }

      parentForm.childForms.forEach((childForm, childIndex) => {
        if (!childForm.response) {
          validationErrors[`childResponse-${parentIndex}-${childIndex}`] =
            "response is required.";
        }
        if (
          (childForm.weightage < rangeStart ||
            childForm.weightage > rangeEnd) &&
          questionType
        ) {
          validationErrors[
            `childWeightage-${parentIndex}-${childIndex}`
          ] = `Value is required and should be between ${rangeStart} and ${rangeEnd}`;
        }

        if (
          (childForm.category === undefined || childForm.category === null) &&
          questionType
        ) {
          validationErrors[`childCategory-${parentIndex}-${childIndex}`] =
            "Category is required";
        }

        if (
          (childForm.openEndedQuestion === undefined ||
            childForm.openEndedQuestion === null ||
            childForm.openEndedQuestion === "") &&
          childForm.hasOeq
        ) {
          validationErrors[
            `childOpenEndedQuestion-${parentIndex}-${childIndex}`
          ] = "Open ended question is required";
        }
      });
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  function convertSubjectData(data) {
    if (data.length === 0) return [];

    return data.map((item) => {
      return {
        subject: item.response,
        isAnchor: item.anchor === true ? 1 : 0,
      };
    });
  }

  function convertResponseData(data) {
    if (data.length === 0) return [];

    return data.map((item) => {
      return {
        response: item.response,
        responseWeightage: item.weightage
          ? parseFloat(item.weightage).toFixed(2)
          : "0.00",
        responseCategory: item.category ? item.category.toString() : "1",
        isOEQ: item.hasOeq ? 1 : 0,
        oeqQuestion: item.openEndedQuestion || "",
      };
    });
  }

  function convertMultiresponseData(data) {
    if (data.length === 0) return [];

    return data.map((item) => {
      return {
        question: item.definingQuestion,
        scale: parseInt(item.scale),
        intentionName: item.intentions || "",
        intentionShortName: item.intentionsShortName || "",
        allResponse: convertResponseData(item.childForms),
        isResponseAddedToResource: item?.addToResource || false,
        responseType: item?.responseType,
        // addToResource: item?.addToResource,
        responseBlockName: item?.responseBlockName,
      };
    });
  }

  const postData = async (values) => {
    try {
      let hasError = false; // flag to track validation failure

      values?.parentForms?.forEach((item, index) => {
        const childForms = item.childForms || [];

        // Rule 1: At least two childForms
        if (childForms.length < 2) {
          toast.error(
            `"${item.definingQuestion}" must have at least two responses`,
            {
              toastId: `childCount-${index}`,
            }
          );
          hasError = true;
        }

        // Rule 2: At least one weightage === rangeEnd
        if (questionType === 1) {
          const hasMatchingWeightage = childForms.some(
            (child) => Number(child.weightage) === rangeEnd
          );
          if (!hasMatchingWeightage) {
            toast.error(
              `At least one response in "${item.definingQuestion}" must have Value equal to ${rangeEnd}`,
              {
                toastId: `rangeMismatch-${index}`,
              }
            );
            hasError = true;
          }
        }
      });

      // Check top-level parentForms length
      if (values?.parentForms?.length < 2) {
        toast.error(`Responses should be minimum two`, {
          toastId: "error002",
        });
        hasError = true;
      }

      // ❌ Stop submission if any error occurred
      if (hasError) {
        return;
      }

      setIsSubmitting(true);

      const payload = {
        companyMasterID: userData?.companyMasterID,
        companyID,
        surveyID,
        question: values?.framingQuestion,
        outcomeID: outcome?.id,
        selectionType: values?.type,
        isScore: questionType ? 1 : 0,
        isSkip: values?.displaySkipForNow,
        isRandom: values?.randamizeQuestion,
        allSubjects: convertSubjectData(values?.subject),
        multiResponse: convertMultiresponseData(values?.parentForms),
        // isQuestionAddedToResource: values?.addToquestionResourse ? 1 : 0,
        isQuestionAddedToResource: values?.surveyType?.length > 0 ? 1 : 0,
        surveyTypeID: values?.surveyType,
        keywords: values?.keyWord,
      };

      // Add questionID to payload if updating existing question
      if (initialQuestionData?.questionID) {
        payload.questionID = initialQuestionData.questionID;
      }

      const response = await commonService({
        apiEndPoint: initialQuestionData?.questionID
          ? QuestionSetup.updateMultiResponseQuestion
          : QuestionSetup.createMultiResponseQuestion,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatchQuestionData(formData);
      postData(formData);
    }
  };

  const responseCategory = [
    { value: 1, label: "Positive" },
    { value: 2, label: "Neutral" },
    { value: 3, label: "Negative" },
  ];

  const handleDragStart = (e, parentIndex, childIndex) => {
    // Store the parent and child indices
    setDraggedItem({ parentIndex, childIndex });
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

  const handleDrop = (e, parentIndex, dropChildIndex) => {
    e.preventDefault();
    const target = e.target.closest(".response-item");
    if (target) {
      target.classList.remove("drag-over");
    }
    if (
      draggedItem === null ||
      (draggedItem.parentIndex === parentIndex &&
        draggedItem.childIndex === dropChildIndex)
    ) {
      return;
    }
    const updatedForms = [...formData.parentForms];
    const draggedItemContent =
      updatedForms[draggedItem.parentIndex].childForms[draggedItem.childIndex];
    const droppedItemContent =
      updatedForms[parentIndex].childForms[dropChildIndex];

    updatedForms[draggedItem.parentIndex].childForms[draggedItem.childIndex] =
      droppedItemContent;
    updatedForms[parentIndex].childForms[dropChildIndex] = draggedItemContent;

    setFormData({
      ...formData,
      parentForms: updatedForms,
    });
    setDraggedItem(null);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    setDraggedItem(null);
    document.querySelectorAll(".response-item").forEach((item) => {
      item.classList.remove("drag-over");
    });
  };

  const handleAddQuestion = (row) => {
    setFormData({
      ...formData,
      framingQuestion: row?.question,
    });
    questionBankClose();
  };

  const handleCancel = () => {
    if (initialQuestionData?.questionID) {
      handleEditClose();
    } else {
      setActiveForm([]);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
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
        <Form.Group className="form-group mb-0">
          <div className="d-flex justify-content-between mb-2 flex-sm-row flex-column-reverse">
            <Form.Label className="mb-0">
              Framing Question <sup>*</sup>
            </Form.Label>
            <Form.Group
              className="form-group mb-sm-0 mb-2 flex-shrink-0"
              controlId="skip1"
            >
              <Form.Check
                className="me-0 mb-0"
                type="checkbox"
                label={<div> Add Question To Resource </div>}
                checked={formData.addToquestionResourse}
                disabled={status}
                onChange={(e) =>
                  handleInputChange(
                    e,
                    "addToquestionResourse",
                    0,
                    "addToquestionResourse"
                  )
                }
              />
            </Form.Group>
          </div>
          <InputField
            type="text"
            placeholder="Enter Question"
            value={formData.framingQuestion}
            disabled={status}
            onChange={(e) =>
              handleInputChange(e, "framingQuestion", 0, "framingQuestion")
            }
          />
          {errors.framingQuestion && (
            <div className="text-danger">{errors.framingQuestion}</div>
          )}
        </Form.Group>
        <div className="d-flex gap-5 mt-3 pt-1">
          <Form.Group className="form-group switchaxis d-flex align-items-center mb-0">
            <Form.Label className="mb-0 me-xl-3 me-2 w-auto">
              Display Skip For Now <sup>*</sup>
            </Form.Label>
            <div className="switchBtn switchBtn-success switchBtn-label-nf">
              <InputField
                type="checkbox"
                id="switchaxis1displaySkipForNow"
                className="p-0"
                name="displaySkipForNow"
                disabled={status}
                onChange={(e) =>
                  handleInputChange(
                    e,
                    "displaySkipForNow",
                    0,
                    "displaySkipForNow"
                  )
                }
                checked={formData.displaySkipForNow}
              />
              <label htmlFor="switchaxis1displaySkipForNow" />
            </div>
          </Form.Group>
          {!questionType && (
            <Form.Group className="form-group switchaxis d-flex align-items-center mb-0">
              <Form.Label className="mb-0 me-xl-3 me-2 w-auto">
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
                  checked={formData.type === "Single Select"}
                  onChange={(e) => handleInputChange(e, "type", 0, "type")}
                  disabled={status}
                />
                <Form.Check
                  inline
                  type="radio"
                  id="type-selectapply"
                  label="Select All that Apply"
                  name="type"
                  value="Select All that Apply"
                  checked={formData.type === "Select All that Apply"}
                  onChange={(e) => handleInputChange(e, "type", 0, "type")}
                  disabled={status}
                />
                {/* <Form.Check
                                    inline
                                    type="radio"
                                    id="type-rankorder"
                                    label="Rank Order"
                                    name="type"
                                    value="Rank Order Response"
                                    checked={formData.type  === "Rank Order Response"}
                                    onChange={(e) => handleInputChange(e, "type", 0, "type")}
                                    disabled={status}
                                   
                                /> */}
              </div>
            </Form.Group>
          )}
        </div>
        <div className="d-flex justify-content-between gap-2 my-3 py-1 align-items-sm-center flex-sm-row flex-column-reverse">
          <h6 className="ratingQuestion_Subhead mb-0">Subject</h6>
          <Form.Group className="form-group switchaxis d-flex align-items-center mb-0">
            <Form.Label className="mb-0 me-xl-3 me-2 w-auto">
              Randomize Questions{" "}
            </Form.Label>
            <div className="switchBtn switchBtn-success">
              <InputField
                type="checkbox"
                defaultValue="1"
                id="switchaxisRandomize"
                className="p-0"
                name="randamizeQuestion"
                disabled={status}
                onChange={(e) =>
                  handleInputChange(
                    e,
                    "randamizeQuestion",
                    0,
                    "randamizeQuestion"
                  )
                }
                checked={formData.randamizeQuestion}
              />
              <label htmlFor="switchaxisRandomize" />
            </div>
          </Form.Group>
        </div>
        <div className="mb-lg-0 mb-3 scalarSecCover">
          <div className="scalarSec subQuestion">
            <div className="d-flex justify-content-between gap-2 mb-0 align-items-center">
              <div className="sequence title">Sl.No.</div>
              <div className="color title">Anchor </div>
              <div className="maximum title">Subject </div>
              <div className="addeletebtn title justify-content-center">
                +/-
              </div>
            </div>
            {formData.subject.map((subject, subjectIndex) => (
              <div className="scalarappend_list d-flex justify-content-between gap-2 align-items-start">
                <div className="sequence"> {subjectIndex + 1}</div>
                <div className="color">
                  <Form.Group
                    className="form-group mb-0 d-flex align-items-center justify-content-center"
                    controlId="anchor1"
                  >
                    <Form.Check
                      className="me-0 mb-0"
                      type="checkbox"
                      label={<div />}
                      checked={subject.anchor}
                      onChange={(e) =>
                        handleInputChange(e, "subject", subjectIndex, "anchor")
                      }
                      disabled={!formData.randamizeQuestion}
                    />
                  </Form.Group>
                </div>
                <Form.Group className="form-group maximum">
                  <InputField
                    type="text"
                    placeholder="Enter Response"
                    value={subject.response}
                    onChange={(e) =>
                      handleInputChange(e, "subject", subjectIndex, "response")
                    }
                    disabled={status}
                  />
                  {errors[`subjectResponse-${subjectIndex}`] && (
                    <div className="text-danger">
                      {errors[`subjectResponse-${subjectIndex}`]}
                    </div>
                  )}
                </Form.Group>

                <div className="addeletebtn d-flex gap-2">
                  {subjectIndex === 0 ? (
                    <Link
                      to="#!"
                      className="addbtn addscaler"
                      onClick={handleAddSubject}
                    >
                      <span>+</span>
                    </Link>
                  ) : (
                    <Link
                      to="#!"
                      className="deletebtn deletebtnscaler"
                      onClick={() => handleRemoveSubject(subjectIndex)}
                    >
                      <em className="icon-delete" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <h6 className="ratingQuestion_Subhead mb-2 pm-1">Multi Response</h6>
        {formData.parentForms.map((parentForm, parentIndex) => (
          <div className="multiResponse" key={parentForm?.id}>
            {parentIndex !== 0 && (
              <Button
                variant="danger"
                className="multiResponse_deleteBtn"
                onClick={() => handleRemoveParentForm(parentIndex)}
              >
                <em className="icon-delete" />
              </Button>
            )}

            <Row className="gx-2">
              <Col sm={12}>
                <Form.Group className="form-group">
                  <Form.Label>
                    Defining Question <sup>*</sup>
                  </Form.Label>
                  <InputField
                    type="text"
                    placeholder="Enter Question"
                    value={parentForm.definingQuestion}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "parentForms",
                        parentIndex,
                        "definingQuestion"
                      )
                    }
                    disabled={status}
                  />
                  {errors[`parentDefiningQuestion-${parentIndex}`] && (
                    <div className="text-danger">
                      {errors[`parentDefiningQuestion-${parentIndex}`]}
                    </div>
                  )}
                </Form.Group>
              </Col>

              <Col sm={6}>
                <Form.Group className="form-group">
                  <Form.Label>
                    Intentions <sup>*</sup>
                  </Form.Label>
                  <InputField
                    type="text"
                    placeholder="Enter Intentions"
                    value={parentForm.intentions}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "parentForms",
                        parentIndex,
                        "intentions"
                      )
                    }
                    disabled={status}
                  />
                  {errors[`parentIntentions-${parentIndex}`] && (
                    <div className="text-danger">
                      {errors[`parentIntentions-${parentIndex}`]}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="form-group">
                  <Form.Label>
                    Intentions Short Name <sup>*</sup>{" "}
                    <Link to="#!" className="p-0">
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="tooltip-disabled">
                            Provide a short name to be used in reports and
                            chart.
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
                    </Link>{" "}
                  </Form.Label>

                  <InputField
                    type="text"
                    placeholder="Enter Intentions"
                    value={parentForm.intentionsShortName}
                    disabled={status}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "parentForms",
                        parentIndex,
                        "intentionsShortName"
                      )
                    }
                  />
                  {errors[`parentIntentionsShortName-${parentIndex}`] && (
                    <div className="text-danger">
                      {errors[`parentIntentionsShortName-${parentIndex}`]}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="form-group">
                  <Form.Label>
                    Response Type<sup>*</sup>{" "}
                    <Link to="#!" className="p-0">
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="tooltip-disabled">
                            Use list value Free Form to create custom response
                            type.
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
                    </Link>{" "}
                  </Form.Label>
                  <SelectField
                    placeholder="Enter Reponse Type"
                    options={responseType}
                    name="responseType"
                    onChange={(option) =>
                      handleSelectChange(
                        option?.value,
                        "parentForms",
                        parentIndex,
                        "responseType"
                      )
                    }
                    disabled={status}
                    value={responseType.find(
                      (option) => option.value === parentForm.responseType
                    )}
                  />
                  {errors[`parentResponseType-${parentIndex}`] && (
                    <div className="text-danger">
                      {errors[`parentResponseType-${parentIndex}`]}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="form-group">
                  <Form.Label>
                    Scale <sup>*</sup>{" "}
                  </Form.Label>

                  {scale?.length > 1 ? (
                    <SelectField
                      placeholder="scale"
                      options={scale}
                      name="scale"
                      // onChange={(option) => {
                      //   handleScale(option);
                      // }}
                      onChange={(option) =>
                        handleScale(
                          parentForm.responseType,
                          "parentForms",
                          parentIndex,
                          "responseType",
                          option?.value
                        )
                      }
                      disabled={status}
                      value={scale.find(
                        (option) => option.value === parentForm.scale
                      )}
                    />
                  ) : (
                    <InputField
                      type="text"
                      placeholder="Enter Scale"
                      name="scale"
                      value={parentForm.scale}
                      disabled
                    />
                  )}
                </Form.Group>
              </Col>
            </Row>

            <div className="scalarSec2 scalarappend2 mt-2">
              {parentForm.childForms.length > 0 && (
                <Row className=" mb-2">
                  <Col xs={1}>Sl.No.</Col>
                  <Col xs={questionType ? 4 : 8}>Response</Col>
                  {questionType && <Col xs={2}>Value</Col>}
                  {questionType && <Col xs={3}>Response Category</Col>}
                  <Col xs={1}>
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
                  <Col xs={1}>
                    {" "}
                    <span className="ms-2">+/-</span>
                  </Col>
                </Row>
              )}

              {parentForm.childForms.map((childForm, childIndex) => (
                <React.Fragment key={childForm.id}>
                  <Row
                    className="mb-2"
                    draggable
                    onDragStart={(e) =>
                      handleDragStart(e, parentIndex, childIndex)
                    }
                    onDragOver={(e) => handleDragOver(e)}
                    onDragEnter={(e) => handleDragEnter(e)}
                    onDragLeave={(e) => handleDragLeave(e)}
                    onDrop={(e) => handleDrop(e, parentIndex, childIndex)}
                    onDragEnd={(e) => handleDragEnd(e)}
                  >
                    <Col xs={1}>
                      <div className=" d-flex align-items-center mt-2">
                        <em className="icon-drag me-1" />
                        <span>{String(childIndex + 1).padStart(2, "0")}.</span>
                      </div>
                    </Col>

                    <Col xs={questionType ? 4 : 8}>
                      <Form.Group className="form-group scalar">
                        <InputField
                          type="text"
                          placeholder="Enter Response"
                          value={childForm.response}
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              "childForms",
                              parentIndex,
                              "response",
                              childIndex
                            )
                          }
                        />
                        {errors[
                          `childResponse-${parentIndex}-${childIndex}`
                        ] && (
                          <div className="text-danger">
                            {
                              errors[
                                `childResponse-${parentIndex}-${childIndex}`
                              ]
                            }
                          </div>
                        )}
                      </Form.Group>
                    </Col>

                    {questionType && (
                      <Col xs={2}>
                        <Form.Group className="form-group scalar">
                          <InputField
                            type="number"
                            placeholder="Enter Value"
                            value={childForm.weightage}
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                "childForms",
                                parentIndex,
                                "weightage",
                                childIndex
                              )
                            }
                          />
                          {errors[
                            `childWeightage-${parentIndex}-${childIndex}`
                          ] && (
                            <div className="text-danger">
                              {
                                errors[
                                  `childWeightage-${parentIndex}-${childIndex}`
                                ]
                              }
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                    )}

                    {questionType && (
                      <Col xs={3}>
                        <Form.Group className="form-group scalar">
                          <SelectField
                            placeholder="Select Response Category"
                            value={responseCategory.find(
                              (cat) => cat.value === childForm.category
                            )}
                            options={responseCategory}
                            onChange={(option) =>
                              handleSelectChange(
                                option.value,
                                "childForms",
                                parentIndex,
                                "category",
                                childIndex
                              )
                            }
                          />
                          {errors[
                            `childCategory-${parentIndex}-${childIndex}`
                          ] && (
                            <div className="text-danger">
                              {
                                errors[
                                  `childCategory-${parentIndex}-${childIndex}`
                                ]
                              }
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                    )}

                    <Col xs={1} className="">
                      <Form.Group className="form-group mt-2">
                        <Form.Check
                          className="me-0 mb-0"
                          type="checkbox"
                          label={<div />}
                          checked={childForm.hasOeq}
                          onChange={(e) =>
                            handleInputChange(
                              e,
                              "childForms",
                              parentIndex,
                              "hasOeq",
                              childIndex
                            )
                          }
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={1} className="">
                      <div className="addeletebtn">
                        {childIndex === 0 ? (
                          <Link
                            to="#!"
                            className="addbtn addscaler"
                            onClick={() => handleAddChildForm(parentIndex)}
                          >
                            <span>+</span>
                          </Link>
                        ) : (
                          <Link
                            to="#!"
                            className="deletebtn deletebtnscaler"
                            onClick={() =>
                              handleRemoveChildForm(parentIndex, childIndex)
                            }
                          >
                            <em className="icon-delete" />
                          </Link>
                        )}
                      </div>
                    </Col>
                  </Row>

                  {Boolean(childForm.hasOeq) && (
                    <Row className="mb-3">
                      <Col xs={{ span: questionType ? 9 : 9, offset: 1 }}>
                        <Form.Group className="form-group w-100">
                          <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Enter Open Ended Question"
                            value={childForm.openEndedQuestion}
                            onChange={(e) =>
                              handleInputChange(
                                e,
                                "childForms",
                                parentIndex,
                                "openEndedQuestion",
                                childIndex
                              )
                            }
                          />
                        </Form.Group>
                        {errors[
                          `childOpenEndedQuestion-${parentIndex}-${childIndex}`
                        ] && (
                          <div className="text-danger">
                            {
                              errors[
                                `childOpenEndedQuestion-${parentIndex}-${childIndex}`
                              ]
                            }
                          </div>
                        )}
                      </Col>
                    </Row>
                  )}
                </React.Fragment>
              ))}
            </div>

            {parentForm.responseType === "123456789" && (
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
                            value={parentForm.addToResource}
                            onClick={(e) => {
                              handleInputChange(
                                e,
                                "parentForms",
                                parentIndex,
                                "addToResource"
                              );
                            }}
                            checked={parentForm.addToResource}
                          />
                        </Form.Group>
                        <InputField
                          type="text"
                          placeholder="Enter Response Block Name"
                          name="responseBlockName"
                          // onChange={formik.handleChange}
                          // onChange={handleResponseBlockName(e)}
                          onChange={(e) => {
                            handleInputChange(
                              e,
                              "parentForms",
                              parentIndex,
                              "responseBlockName"
                            );
                          }}
                          value={parentForm.responseBlockName}
                          disabled={!parentForm.addToResource}
                        />
                      </div>
                      {/* {formik.touched.responseBlockName &&
                        formik.errors.responseBlockName && (
                          <div className="error mt-1 text-danger ms-5">
                            {formik.errors.responseBlockName}
                          </div>
                        )} */}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            )}
          </div>
        ))}
        <div className="d-flex justify-content-between gap-2 flex-wrap">
          {formData.parentForms.length <= 2 ? (
            <Button
              variant="primary"
              className="ripple-effect"
              onClick={handleAddParentForm}
            >
              {" "}
              <em className="icon-plus me-1" /> Add Response
            </Button>
          ) : (
            <div className="d-flex gap-2">
              {/* Content to display when formData.parentForms.length is greater than 2 */}
              {/* <span>Maximum number of responses reached.</span> */}
              {/* You can add more elements or components here */}
            </div>
          )}

          <div className="d-flex gap-2">
            <Button
              variant="secondary"
              className="ripple-effect"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            {formData.parentForms.length > 1 && (
              <Button
                variant="primary"
                className="ripple-effect"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? BUTTON_TYPE?.load : BUTTON_TYPE?.type}
              </Button>
            )}
          </div>
        </div>
      </Form>

      {showQuestionBank && (
        <QuestionBankModal
          showQuestionBank={showQuestionBank}
          questionBankClose={questionBankClose}
          questionOptions={questionOptions}
          surveyOptions={surveyType}
          userData={userData}
          openFrom="Multi Response"
          handleAddQuestion={handleAddQuestion}
          surveyID={surveyID}
          companyID={companyID}
          questionType="m"
        />
      )}
      {showBankAttributes && (
        <AddToResourceModel
          show={showBankAttributes}
          onClose={() => setShowBankAttributes(false)}
          setFormData={setFormData}
          surveyType={surveyType}
          questionType="m"
          setShowBankAttributes={setShowBankAttributes}
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
    </>
  );
}
