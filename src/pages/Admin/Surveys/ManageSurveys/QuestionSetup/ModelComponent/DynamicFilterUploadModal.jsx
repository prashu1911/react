import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { commonService } from "services/common.service";
import { QuestionSetup } from "apiEndpoints/QuestionSetup";
import {
  Button,
  InputField,
  ModalComponent,
} from "../../../../../../components";
import toast from "react-hot-toast";

const DynamicFilterUploadModal = ({
  showUpload,
  uploadClose,
  userData,
  companyID,
  surveyID,
}) => {
  // State to store selected files
  const [files, setFiles] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const buttonStyle = {
    textDecoration: "underline",
    color: "#007bff",
    cursor: "pointer",
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
  };
  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFiles = event.target.files[0];
    setFiles(selectedFiles);
  };

  const uploadFile = async () => {
    try {
      setIsSubmitting(true);

      const response = await commonService({
        apiEndPoint: QuestionSetup.uploadParticipant,
        bodyData: {
          file: files,
          companyID,
          surveyID,
        },
        isFormData: true,
        filePresent: true,
        fileKey: "file",
        headers: {
          Authorization: `Bearer ${userData?.apiToken}`,
          "Content-type": "FormData",
        },
        toastType: {
          success: false,
          error: true,
        },
      });

      if (response?.status) {
        if (response?.data.status === "error") {
          toast.error(response?.data.message, { toastId: "error001" });
          if (response?.data?.data?.filePath) {
            setUploadedFileName(response.data.data.filePath);
          }
        } else if (response?.data.status === "success") {
          toast.success(response?.data.message, { toastId: "error001" });
          setUploadedFileName(response.data.data.filePath);
        }
        // uploadClose();
        setIsSubmitting(false);
      } else {
        // uploadClose();
        setUploadedFileName(null);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      setUploadedFileName(null);
      return false;
    }
  };

  const handleDownloadData = async () => {
    const response = await commonService({
      // apiEndPoint: QuestionSetup.getUploadedParticipants,
      apiEndPoint: QuestionSetup.getUploadedParticipants,
      isFormData: false,
      queryParams: { surveyID, companyID },
      headers: {
        Authorization: `Bearer ${userData?.apiToken}`,
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      responseType: "blob",
    });

    if (response?.status) {
      let fileData = response?.data;
      let data = new Blob([fileData]);
      let csvURL = window.URL.createObjectURL(data);
      let tempLink = document.createElement("a");
      tempLink.href = csvURL;
      tempLink.setAttribute("download", `View_Uploaded_Demographic.xlsx`);
      tempLink.click();
    }
  };

  const handleGettingUploadedFile = async () => {
    const response = await commonService({
      apiEndPoint: QuestionSetup.getUploadedFile,
      isFormData: false,
      queryParams: { filename: uploadedFileName },
      headers: {
        Authorization: `Bearer ${userData?.apiToken}`,
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      responseType: "blob",
    });

    if (response?.status) {
      let fileData = response?.data;
      let data = new Blob([fileData]);
      let csvURL = window.URL.createObjectURL(data);
      let tempLink = document.createElement("a");
      tempLink.href = csvURL;
      tempLink.setAttribute("download", `Uploaded_File.xlsx`);
      tempLink.click();
    }
  };

  return (
    <ModalComponent
      modalHeader="Dynamic Filter Upload"
      show={showUpload}
      onHandleCancel={uploadClose}
    >
      <div className="text-end" />
      <Form>
        <Form.Group className="form-group">
          <Form.Label>
            Select Import File<sup>*</sup>
          </Form.Label>
          <InputField
            type="file"
            className="uploadBtn"
            placeholder="Enter Subtitle"
            onChange={handleFileChange}
            accept=".xlsx"
          />
        </Form.Group>
        {uploadedFileName && (
          <div>
            <button
              type="button"
              onClick={handleGettingUploadedFile}
              style={buttonStyle}
            >
              Download Proccessed File
            </button>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center gap-2 ">
          <div>
            <button
              type="button"
              onClick={handleDownloadData}
              style={buttonStyle}
            >
              View Uploaded Data
            </button>
          </div>
          <div className="form-btn d-flex gap-2 justify-content-end">
            <Button
              variant="secondary"
              className="ripple-effect"
              onClick={uploadClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="ripple-effect"
              disabled={!files || files.length === 0}
              onClick={uploadFile}
            >
              {isSubmitting ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </Form>
    </ModalComponent>
  );
};

export default DynamicFilterUploadModal;
