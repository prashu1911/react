import { API_ENDPOINT_V1 } from "config";

const API_ENDPOINT = API_ENDPOINT_V1;

export const ADMIN_MANAGEMENT = {
  getAdmin: (companyID) => ({
    url: `${API_ENDPOINT}admin?${companyID}`,
    method: "GET",
  }),

  createAdmin: {
    url: `${API_ENDPOINT}admin`,
    method: "POST",
  },

  updateAdmin: {
    url: `${API_ENDPOINT}admin`,
    method: "PUT",
  },

  deleteAdmin: {
    url: `${API_ENDPOINT}admin`,
    method: "DELETE",
  },

  resetAdmin: {
    url: `${API_ENDPOINT}admin`,
    method: "PATCH",
  },
  updateDashboardResponseRate: {
    url: `${API_ENDPOINT}dashboard/responseRate`,
    method: "PUT",
  },
  updateDashboardSurveyStatus: {
    url: `${API_ENDPOINT}dashboard/surveyStatus`,
    method: "PUT",
  },
  updateDashboardSurveyProgress: {
    url: `${API_ENDPOINT}dashboard/surveyProgress`,
    method: "PUT",
  },
  getDashboardSurveyScore: {
    url: `${API_ENDPOINT}dashboard/surveyScore`,
    method: "POST",
  },
  updateDashboardSurveyScore: {
    url: `${API_ENDPOINT}dashboard/surveyScore`,
    method: "PUT",
  },
  getDashboardCompanyDetail: {
    url: `${API_ENDPOINT}dashboard/companyDetails`,
    method: "POST",
  },
  getDashboardResponseStatistics: {
    url: `${API_ENDPOINT}dashboard/responseStatistics`,
          method: "POST",
        },
  updateDashboardCompanyDetail: {
    url: `${API_ENDPOINT}dashboard/companyDetails`,
    method: "PUT",
  },
  getOutcomeList: (assessmentID) => ({
    url: `${API_ENDPOINT}AssessmentChart?action=outcome_list_dropdown&assessmentID=${assessmentID}&isIG=false`,
    method: "GET",
  }),
  getIntentionList: {
    url: `${API_ENDPOINT}AssessmentChart`,
    method: "POST",
  },
  getSurveyOverview: {
    url: `${API_ENDPOINT}dashboard/surveyOverview`,
    method: "POST",
  },
  getDashboardWidgets: {
    url: `${API_ENDPOINT}dashboard/admin`,
    method: "GET",
  },
  getSurveyList: (companyID, roleID, companyMasterID) => ({
    url: `${API_ENDPOINT}dashboard/survey?roleID=${roleID}&companyMasterID=${companyMasterID}&companyID=${companyID}`,
    method: "GET",
  }),
  getCompanyList: (companyMasterID) => ({
    url: `${API_ENDPOINT}Report/company?masterCompanyID=${companyMasterID}`,
    method: "GET",
  }),
  getAssessmentList: (companyID) => ({
    url: `${API_ENDPOINT}AssessmentChart?action=assessment_list&companyID=${companyID}`,
    method: "GET",
  }),
  getIRSectionData: (sectionId, TemplateFlag, flag) => ({
    url: `${API_ENDPOINT}IRReport/widgets?sectionID=${sectionId}&templateFlag=${TemplateFlag || flag}`,
    method: "GET",
  }),
  getTemplateList: (assessmentID, companyID) => ({
    url: `${API_ENDPOINT}IRReport/template?compnayID=${companyID}&assessmentID=${assessmentID}`,
    method: "GET",
  }),
  getDatasetList: (assessmentID, flag) => ({
    url: `${API_ENDPOINT}IRReport/dataset?assessmentID=${assessmentID}&list=${flag}`,
    method: "GET",
  }),
  getCompanyWidgetList: (companyMasterID, companyID) => ({
    url: `${API_ENDPOINT}IRReport/reportWidget?companyMasterID=${companyMasterID}&companyID=${companyID}`,
    method: "GET",
  }),
  getTemplateWidgetList: (companyMasterID, companyID) => ({
    url: `${API_ENDPOINT}IRReport/templateWidget?companyMasterID=${companyMasterID}&companyID=${companyID}`,
    method: "GET",
  }),
  deleteIRSection: (SectionId, TemplateFlag) => ({
    url: `${API_ENDPOINT}IRReport/section?primaryID=${SectionId}&templateFlag=${TemplateFlag ? 1 : 0}`,
    method: "DELETE",
  }),
  getReportWidgetList: (reportId, flag) => ({
    url: `${API_ENDPOINT}IRReport/section?primaryID=${reportId}&templateFlag=${flag}`,
    method: "GET",
  }),
  deleteTemplate: (templateId) => ({
    url: `${API_ENDPOINT}IRReport/template?templateID=${templateId}`,
    method: "DELETE",
  }),
  deleteDataset: (datasetId) => ({
    url: `${API_ENDPOINT}Report/dataset?datasetID=${datasetId}`,
    method: "DELETE",
  }),
  getDataset: (datasetId) => ({
    url: `${API_ENDPOINT}Report/dataset/view?datasetID=${datasetId}`,
    method: "GET",
  }),
  getReports: (companyID, assessmentID) => ({
    url: `${API_ENDPOINT}IRReport/report?companyID=${companyID}&surveyID=${assessmentID}`,
    method: "GET",
  }),
  deleteReport: (reportId) => ({
    url: `${API_ENDPOINT}IRReport/report?reportID=${reportId}`,
    method: "DELETE",
  }),
  createTemplate: {
    url: `${API_ENDPOINT}IRReport/template`,
    method: "POST",
  },
  createReport: {
    url: `${API_ENDPOINT}IRReport/report`,
    method: "POST",
  },
  updateSection: {
    url: `${API_ENDPOINT}IRReport/widgets`,
    method: "POST",
  },
  deleteDocument: (SectionId, index, TemplateFlag) => ({
    url: `${API_ENDPOINT}IRReport/widgets?sectionID=${SectionId}&templateFlag=${TemplateFlag}&fileIndex=${index}`,
    method: "DELETE",
  }),
  addIRWidget: {
    url: `${API_ENDPOINT}IRReport/widgets`,
    method: "POST",
  },
  updateHeatmapUpdateAccordian: {
    url: `${API_ENDPOINT}IRReport/widgets`,
    method: "PUT",
  },
  updateIRSectionOrder: {
    url: `${API_ENDPOINT}IRReport/sectionOrder`,
    method: "POST",
  },
  editReportName: {
    url: `${API_ENDPOINT}IRReport/report`,
    method: "PUT",
  },
  editTemplateName: {
    url: `${API_ENDPOINT}IRReport/template`,
    method: "PUT",
  },
  uploadIRLogoImage: {
    url: `${API_ENDPOINT}IRReport/widgets`,
    method: "POST",
  },
  getResponseType: {
    url: `${API_ENDPOINT}IRReport/favorabilityMapping`,
    method: "POST",
  },
  addTheme: {
    url: `${API_ENDPOINT}IRReport/favorableTheme`,
    method: "POST",
  },
  editTheme: {
    url: `${API_ENDPOINT}IRReport/favorableTheme`,
    method: "POST",
  },
  updateResponseType: {
    url: `${API_ENDPOINT}IRReport/favorabilityMapping`,
    method: "PUT",
  },
  getFavorableTheme: (companyMasterID, companyID, assessmentID) => ({
    url: `${API_ENDPOINT}IRReport/favorableTheme?companyMasterID=${companyMasterID}&companyID=${companyID}&assessmentID=${assessmentID}`,
    method: "GET",
  }),
  getTheme: (themeId) => ({
    url: `${API_ENDPOINT}IRReport/favorableTheme?themeID=${themeId}`,
    method: "GET",
  }),
  deleteTheme: (themeId) => ({
    url: `${API_ENDPOINT}IRReport/favorableTheme?themeID=${themeId}`,
    method: "DELETE",
  }),
};
