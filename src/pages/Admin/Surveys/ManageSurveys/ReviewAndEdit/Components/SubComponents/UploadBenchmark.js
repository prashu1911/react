import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { InputField, ModalComponent } from "components";
import { useAuth } from "customHooks";
import React, { useState } from "react";
import { Button, Row, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { commonService } from "services/common.service";

const UploadBenchmark = ({
  type,
  companyMasterID,
  companyID,
  surveyID,
  setActionType,
}) => {
  const [files, setFiles] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const uploadClose = () => {
    setFiles(null);
    setActionType();
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files[0];
    setFiles(selectedFiles);
  };

  const handleUploadedFile = async () => {
    console.log(files,"files")
    if (files) {
      try {

        const response = await commonService({
                apiEndPoint: SURVEYS_MANAGEMENT.benchmarkUpload,
                bodyData: {
                  file: files,
                  companyMasterID, companyID, surveyID
                  // companyMasterID: userData?.companyMasterID,
                },
                isFormData: true,
                isToast: true,
                headers: {
                  Authorization: `Bearer ${userData?.apiToken}`,
                  "Content-type": "FormData",
                },
                toastType: {
                  success: true,
                  error: "Password reset failed!",
                },
                toastMessage: {
                  success: "Data Upload successfully!",
                  error: "Data upload failed. Kindly select an updated file and retry.",
                },
                filePresent: true,
                fileKey: "file",
              });
        // const response = await commonService({
        //   apiEndPoint: SURVEYS_MANAGEMENT.benchmarkUpload,
        //   isFormData: true,
        //   bodyData: { file: files, companyMasterID, companyID, surveyID },
        //   filePresent: true,
        //   fileKey: "file",
        //   headers: {
        //     Authorization: `Bearer ${userData?.apiToken}`,
        //     Accept:
        //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        //   },
        //   responseType: "blob",
        // });

        if (response?.status) {
          toast.success("Uploaded Successfully", { toastId: "success001" });
          uploadClose();
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("File is required", { toastId: "error0002" });
    }
  };

  const handleDownloadTemplate = async () => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.benchmarkTemplate,
      isFormData: true,
      queryParams: { companyID, surveyID },
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
  //   return (
  //     <ModalComponent
  //       modalHeader="Upload Benchmark"
  //       show={type === "upload"}
  //       onHandleCancel={uploadClose}
  //     >

  //     </ModalComponent>
  //   );
  return (
    <ModalComponent
      modalHeader="Upload Benchmark"
      show={type === "upload"}
      onHandleCancel={uploadClose}
    >
      <>
        <div className="d-flex align-items-center justify-content-end">
          <Link
            href="#!"
            className="link-primary"
            onClick={(e) => {
              e.preventDefault();
              handleDownloadTemplate();
            }}
          >
            Download Template
          </Link>
        </div>
        <Row>
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
        </Row>
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
            onClick={handleUploadedFile}
          >
            {isSubmitting ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </>
    </ModalComponent>
  );
};

export default UploadBenchmark;
