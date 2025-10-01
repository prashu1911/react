import { RESOURSE_MANAGEMENT } from "apiEndpoints/ResourseManagement";
import IntroductionAddEditFormComponent from "components/ResourceForm/IntroductionAddEditFormComponent";
import { useAuth } from "customHooks";
import logger from "helpers/logger";
import React, { useState } from "react";
import { commonService } from "services/common.service";

function IntroductionAddEditForm({
  surveyTypeData,
  introductionEditClose,
  rowData,
  alertType,
  companyOptions,
  getIntroductionList,
}) {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [handleLoading, setHandleLoading] = useState(false);
  const normalizeResponseCategory = (label) => {
    const found = surveyTypeData?.find(
      (option) => option.label.toLowerCase() === label.toLowerCase()
    );
    return found ? parseInt(found.value) : "";
  };
  const handleSubmit = async (values) => {
    setHandleLoading(true);
    const data =
      alertType === "edit"
        ? {
            libraryIntroductionID: parseInt(rowData?.libraryIntroductionID),
            surveyTypeID:
              typeof values.surveyTypeID === "string"
                ? normalizeResponseCategory(values.surveyTypeID)
                : values.surveyTypeID,
            keywords: values?.keywords,
            introduction: values?.introduction,
          }
        : {
            companyMasterID: parseInt(userData?.companyMasterID),
            companyID: parseInt(values?.company),
            surveyTypeID:
              typeof values.surveyTypeID === "string"
                ? normalizeResponseCategory(values.surveyTypeID)
                : values.surveyTypeID,
            keywords: values?.keywords,
            introduction: values?.introduction,
          };
    try {
      const response = await commonService({
        apiEndPoint:
          alertType === "edit"
            ? RESOURSE_MANAGEMENT.updateIntroductionData
            : RESOURSE_MANAGEMENT.addIntroductionData,
        bodyData: data,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: { success: true, error: true },
      });
      if (response?.status) {
        introductionEditClose();
        getIntroductionList();
      }
    } catch (error) {
      logger(error);
    }
    setHandleLoading(false);
  };

  return (
    <>
      <IntroductionAddEditFormComponent
        handleSubmit={handleSubmit}
        surveyTypeData={surveyTypeData}
        introductionEditClose={introductionEditClose}
        initialData={rowData}
        alertType={alertType}
        companyOptions={companyOptions}
        handleLoading={handleLoading}
      />
    </>
  );
}

export default IntroductionAddEditForm;
