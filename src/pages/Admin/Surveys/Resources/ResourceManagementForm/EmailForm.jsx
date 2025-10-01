import { RESOURSE_MANAGEMENT } from "apiEndpoints/ResourseManagement";
import EmailAddEditFormComponent from "components/ResourceForm/EmailAddEditFormComponent";
import { useAuth } from "customHooks";
import logger from "helpers/logger";
import React, { useEffect, useState } from "react";
import { commonService } from "services/common.service";

function EmailAddEditForm({
  emailGroupOptions,
  emailTemplateEditClose,
  rowData,
  alertType,
  companyOptions,
  getEmailList,
}) {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [, setInitialData] = useState();
  const [initialLoader, setInitialLoader] = useState(false);
  const [handleLoading, setHandleLoading] = useState(false);
  const getEmailById = async (emailID) => {
    try {
      setInitialLoader(true);
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.getEmailById,
        queryParams: { libraryEmailID: emailID?.libraryEmailID },
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
    const found = emailGroupOptions?.find(
      (option) => option.label.toLowerCase() === label.toLowerCase()
    );
    return found ? parseInt(found.value) : "";
  };
  const handleSubmit = async (values) => {
    setHandleLoading(true);
    const data = alertType === "edit" ? {
      libraryEmailID: parseInt(rowData?.libraryEmailID),
      libraryElementID : typeof values.emailGroup === "string"
      ? normalizeResponseCategory(values.emailGroup)
      : values.emailGroup,
      subject : values?.subject,
      keywords : values?.keywords,
      content: values?.content
    } : {
      companyMasterID: parseInt(userData?.companyMasterID),
      companyID  : parseInt(values?.company),
      emailTypeID : typeof values.emailGroup === "string"
      ? normalizeResponseCategory(values.emailGroup)
      : values.emailGroup,
      subject : values?.subject,
      keywords : values?.keywords,
      content: values?.content
    };
    try {
      const response = await commonService({
        apiEndPoint: alertType === "edit" ? RESOURSE_MANAGEMENT.updateEmaildata : RESOURSE_MANAGEMENT.addEmaildata,
        bodyData : data,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: { success: true, error: true },
      });
      if (response?.status) {
        getEmailList();
        emailTemplateEditClose();
      }
    } catch (error) {
      logger(error);
    }
    setHandleLoading(false);
  }
  useEffect(() => {
    if (rowData) {
      getEmailById(rowData);
    }
  }, []);

  return (
    <>
      <EmailAddEditFormComponent
        handleSubmit = {handleSubmit}
        emailGroupOptions={emailGroupOptions}
        emailTemplateEditClose={emailTemplateEditClose}
        initialData={rowData}
        initialLoader={initialLoader}
        alertType={alertType}
        companyOptions={companyOptions}
        handleLoading={handleLoading}
      />
    </>
  );
}

export default EmailAddEditForm;
