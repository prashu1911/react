import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { useAuth } from "customHooks";
import { commonService } from "services/common.service";
import { COMPANY_MANAGEMENT } from "apiEndpoints/OrgStructure/OrgStructure.dashboard";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { ModalComponent } from "../../../../../../../components";
import SurveySection from "./SurveySection";
import ResourceSection from "./ResourceSection";

export default function SurveyFromExistingModel({
  showcreateExisting,
  setshowcreateExisting,
}) {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [selectedAction, setSelectedAction] = useState("surveys");
  const [companyOptions, setCompanyOptions] = useState([]);
  const [surveyOptions, setSurveyOptions] = useState([]);
  const [AssessmentDropdownOption, setAssessmentDropdownOption] = useState([]);

  const [surveyDisable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resourceData, setResourceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const createExistingClose = () => setshowcreateExisting(false);

  const fetchCompanies = async () => {
    try {
      const response = await commonService({
        apiEndPoint: COMPANY_MANAGEMENT.getCompanybasic,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        setCompanyOptions(
          Object.values(response?.data?.data)?.map((company) => ({
            value: company?.companyID,
            label: company?.companyName,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchSurvey = async (companyID) => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.assesmentCopyList,
        queryParams: { companyID },

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        // Update this section to correctly map the surveyType array
        setSurveyOptions(
          response?.data?.data?.map((item) => ({
            value: item?.surveyID,
            label: item?.surveyName,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  };

  const fetchAssessmentDropdown = async () => {
    try {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.assessmentDropdown,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        // Update this section to correctly map the surveyType array
        setAssessmentDropdownOption(
          response?.data?.data?.surveyType?.map((item) => ({
            value: item?.libraryElementID,
            label: item?.value,
          })) || []
        );
      }
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  };

  const copySurvey = async (payload,cloneType) => {
    try {
      setIsSubmitting(true);
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.cloneSurvey,
        bodyData: payload,
        toastType: { success: true, error: true },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      setIsSubmitting(false);
      return response;
    } catch (error) {
      console.error("Error copying survey:", error);
      setIsSubmitting(false);
      throw error;
    }
  };

  const fetchResourceSurveyList = async (companyID, surveyTypeID, keywords) => {
    try {
      setLoading(true);
      const payload = {
        companyID,
        surveyTypeID,
        keywords,
      };

      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.resourceSurveyList,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        setResourceData(response?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching resource surveys:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchAssessmentDropdown();
  }, []);

  const handleInputChange = (ev) => {
    setSelectedAction(ev.target.value);
  };

  return (
    <ModalComponent
      modalHeader="Survey Management: Clone From Existing"
      extraClassName="existingModal"
      show={showcreateExisting}
      onHandleCancel={createExistingClose}
    >
      <Form>
        <Form.Group className="form-group">
          <Form.Label>Source</Form.Label>
          {["radio"].map((type) => (
            <div className="onlyradio flex-wrap" key={`companyAction-${type}`}>
              <Form.Check
                controlid="surveys"
                inline
                label="Survey"
                name="companyAction"
                type={type}
                checked={selectedAction === "surveys"}
                value="surveys"
                id={`companyAction-${type}-1`}
                onChange={handleInputChange}
              />
              <Form.Check
                controlid="resources"
                inline
                label="Resources"
                name="companyAction"
                type={type}
                checked={selectedAction === "resources"}
                value="resources"
                id={`companyAction-${type}-2`}
                onChange={handleInputChange}
              />
            </div>
          ))}
        </Form.Group>

        {selectedAction === "surveys" && (
          <SurveySection
            companyOptions={companyOptions}
            surveyOptions={surveyOptions}
            surveyDisable={surveyDisable}
            isSubmitting={isSubmitting}
            onFetchSurvey={fetchSurvey}
            onCopySurvey={copySurvey}
            createExistingClose={createExistingClose}
          />
        )}
        {selectedAction === "resources" && (
          <ResourceSection
            companyOptions={companyOptions}
            surveyOptions={AssessmentDropdownOption}
            isSubmitting={isSubmitting}
            onFetchSurvey={fetchAssessmentDropdown}
            onCopySurvey={copySurvey}
            resourceData={resourceData}
            loading={loading}
            onFetchResourceSurveys={fetchResourceSurveyList}
            createExistingClose={createExistingClose}
          />
        )}
      </Form>
    </ModalComponent>
  );
}
