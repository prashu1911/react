import { RESOURSE_MANAGEMENT } from "apiEndpoints/ResourseManagement";
import QuestionAddEditFormComponent from "components/ResourceForm/QuestionAddEditFormComponent";
import { useAuth } from "customHooks";
import logger from "helpers/logger";
import React, { useEffect, useState } from "react";
import { commonService } from "services/common.service";

function QuestionAddEditForm({
  surveyTypeOptions,
  questionAddEditClose,
  rowData,
  alertType,
  companyOptions,
  getQuestionList,
  questionTypeData,
}) {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [initialData, setInitialData] = useState();
  const [initialLoader, setInitialLoader] = useState(false);
  const [handleLoading, setHandleLoading] = useState(false);
  const getQuestionById = async (row) => {
    const { libraryQuestionID } = row;
    try {
      setInitialLoader(true);
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.getQuestionById,
        queryParams: { libraryQuestionID },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setInitialData(response?.data?.data);
      }
    } catch (error) {
      logger(error);
    }
    setInitialLoader(false);
  };
  const normalizeResponseCategory = (label) => {
    const found = surveyTypeOptions?.find(
      (option) => option.label.toLowerCase() === label.toLowerCase()
    );
    return found ? parseInt(found.value) : "";
  };
  const handleSubmit = async (values) => {
    setHandleLoading(true);
    const data =
      alertType === "edit"
        ? {
            libraryQuestionID: parseInt(rowData?.libraryQuestionID),
            surveyTypeID: parseInt(values.surveyType),
            keywords: values.keywords,
            questionType: values.questionType,
            question: values.question,
          }
        : {
            companyMasterID: parseInt(userData?.companyMasterID),
            companyID: parseInt(values?.company),
            surveyTypeID:
              typeof values.surveyType === "string"
                ? normalizeResponseCategory(values.surveyType)
                : values.surveyType,
            questionType: values?.questionType,
            keywords: values?.keywords,
            question: values?.question,
          };
    try {
      const response = await commonService({
        apiEndPoint:
          alertType === "edit"
            ? RESOURSE_MANAGEMENT.updateQuestiondata
            : RESOURSE_MANAGEMENT.addQuestiondata,
        bodyData: data,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType : { success: true, error: true },
      });
      if (response?.status) {
        getQuestionList();
        questionAddEditClose();
      }
    } catch (error) {
      logger(error);
    }
    setHandleLoading(false);
  };
  useEffect(() => {
    if (rowData) {
      getQuestionById(rowData);
    }
  }, []);

  return (
    <>
      <QuestionAddEditFormComponent
        handleSubmit={handleSubmit}
        surveyTypeOptions={surveyTypeOptions}
        questionAddEditClose={questionAddEditClose}
        initialData={initialData}
        initialLoader={initialLoader}
        alertType={alertType}
        companyOptions={companyOptions}
        questionTypeData={questionTypeData}
        handleLoading = {handleLoading}
      />
    </>
  );
}

export default QuestionAddEditForm;
