import { API_ENDPOINT_V1 } from "config";

const API_ENDPOINT = API_ENDPOINT_V1;

export const SURVEYS_MANAGEMENT = {
  /**
   * Get the departments for a given company
   * @param {string} companyID - The ID of the company
   * @returns {object} - An object containing the url and method of the API call
   */
  departmentThroughCompany: (companyID) => ({
    url: `${API_ENDPOINT}department?${companyID}`,
    method: "GET",
  }),

  createSurvey: {
    url: `${API_ENDPOINT}survey/create`,
    method: "POST",
  },

  publishSurvey: {
    url: `${API_ENDPOINT}Survey/Publish`,
    method: "POST",
  },

  updateSurvey: {
    url: `${API_ENDPOINT}Survey/Update`,
    method: "PUT",
  },

  getSurvey: {
    url: `${API_ENDPOINT}survey`,
    method: "GET",
  },
  assessmentDropdown: {
    url: `${API_ENDPOINT}resource/assessmentDropdown`,
    method: "GET",
  },

  getSurveyBySubscription: {
    url: `${API_ENDPOINT}subscription/page `,
    method: "GET",
  },

  getResponseScore: {
    url: `${API_ENDPOINT}survey/response-score-range`,
    method: "GET",
  },

  getScalar: {
    url: `${API_ENDPOINT}scalar`,
    method: "GET",
  },

  deleteSurvey: {
    url: `${API_ENDPOINT}survey/delete`,
    method: "DELETE",
  },

  getQuestionLimit: {
    url: `${API_ENDPOINT}survey/question-limit`,
    method: "GET",
  },

  getQuestionPerPage: {
    url: `${API_ENDPOINT}survey/question-per-page`,
    method: "GET",
  },

  getSurveyScalar: {
    url: `${API_ENDPOINT}survey/scalar`,
    method: "GET",
  },

  getCopyComment: {
    url: `${API_ENDPOINT}survey/default-settings/email`,
    method: "GET",
  },

  getResourceEmail: {
    url: `${API_ENDPOINT}survey/resource/email`,
    method: "GET",
  },

  getProgressBar: {
    url: `${API_ENDPOINT}survey/progress`,
    method: "GET",
  },

  faqDefaultSetting: {
    url: `${API_ENDPOINT}survey/default-settings/faq`,
    method: "GET",
  },

  contactDefaultSetting: {
    url: `${API_ENDPOINT}survey/default-settings/contact`,
    method: "GET",
  },

  getReport: {
    url: `${API_ENDPOINT}report`,
    method: "GET",
  },

  getReportSummary: {
    url: `${API_ENDPOINT}report/comment/summary`,
    method: "GET",
  },

  getResourceIntroduction: {
    url: `${API_ENDPOINT}survey/resource/introduction`,
    method: "GET",
  },

  getSurveyType: {
    url: `${API_ENDPOINT}survey/type`,
    method: "GET",
  },

  getManageSurvey: {
    url: `${API_ENDPOINT}survey/view`,
    method: "POST",
  },

  pauseSurvey: {
    url: `${API_ENDPOINT}survey/pause`,
    method: "PATCH",
  },

  continueSurvey: {
    url: `${API_ENDPOINT}survey/continue`,
    method: "PATCH",
  },

  closeSurvey: {
    url: `${API_ENDPOINT}survey/close`,
    method: "PATCH",
  },

  getEditSurvey: {
    url: `${API_ENDPOINT}survey/fetch`,
    method: "GET",
  },

  getQuestionSurvey: {
    url: `${API_ENDPOINT}survey/question/used`,
    method: "GET",
  },

  upDateSurvay: {
    url: `${API_ENDPOINT}survey/update`,
    method: "POST",
  },

  publishSurvay: {
    url: `${API_ENDPOINT}survey/publish`,
    method: "POST",
  },

  findAndReplaceSurvay: {
    url: `${API_ENDPOINT}findAndReplace`,
    method: "POST",
  },

  surveyList: {
    url: `${API_ENDPOINT}survey/list`,
    method: "GET",
  },

  departmentList: {
    url: `${API_ENDPOINT}department/list`,
    method: "GET",
  },

  auditTrial: {
    url: `${API_ENDPOINT}auditTrail`,
    method: "POST",
  },

  copySurvey: {
    url: `${API_ENDPOINT}survey/clone`,
    method: "POST",
  },

  resourceSurveyList: {
    url: `${API_ENDPOINT}survey/resource-survey-list`,
    method: "POST",
  },
  surveyResponseList: {
    url: `${API_ENDPOINT}resource/responseDropdown`,
    method: "GET",
  },
  redirectingUserToSurvey: {
    url: `${API_ENDPOINT}participant/auth`,
    method: "POST",
  },
  // assesmentCopySurvey: {
  //   url: `${API_ENDPOINT}survey/copy-survey`,
  //   method: "POST",
  // },
  cloneSurvey: {
    url: `${API_ENDPOINT}survey/clone`,
    method: "POST",
  },
  assesmentCopyList: {
    url: `${API_ENDPOINT}survey/copy`,
    method: "GET",
  },
  surveyAssessmentChart: {
    url: `${API_ENDPOINT}AssessmentChart`,
    method: "GET",
  },

  surveyAssessmentChartIntention: {
    url: `${API_ENDPOINT}AssessmentChart`,
    method: "POST",
  },

  updateSurveyAssessmentChart: {
    url: `${API_ENDPOINT}AssessmentChart`,
    method: "PUT",
  },
  demogarphicResponses: {
    url: `${API_ENDPOINT}demographic/responses`,
    method: "POST",
  },

  demogarphicQuestionlist: {
    url: `${API_ENDPOINT}demographic/questions`,
    method: "GET",
  },

  demogarphicReportSave: {
    url: `${API_ENDPOINT}demographic/save`,
    method: "POST",
  },
  filterAggregateChart: {
    url: `${API_ENDPOINT}AssessmentChart`,
    method: "POST",
  },

  saveDataset: {
    url: `${API_ENDPOINT}IRReport/dataset`,
    method: "POST",
  },

  updateBenchMarkData: {
    url: `${API_ENDPOINT}AssessmentChart`,
    method: "PUT",
  },

  // codiant

  getDemographicChartOptions: {
    url: `${API_ENDPOINT}AssessmentChart?action=get_chart_option_dropdowns&type=demographic`,
    method: "GET",
  },

  getDefaultChartSettings: {
    url: `${API_ENDPOINT}AssessmentChart`,
    method: "GET",
  },
  getChart: {
    url: `${API_ENDPOINT}survey/default-settings/chart`,
    method: "GET",
  },
  benchmarkListing: {
    url: `${API_ENDPOINT}survey/benchmark-list`,
    method: "GET",
  },
  questionsForBenchmark: {
    url: `${API_ENDPOINT}survey/benchmark/add`,
    method: "GET",
  },
  addBenchmark: {
    url: `${API_ENDPOINT}survey/benchmark`,
    method: "POST",
  },
  updateBenchmark: {
    url: `${API_ENDPOINT}survey/benchmark`,
    method: "PUT",
  },
  deleteBenchmark: {
    url: `${API_ENDPOINT}survey/benchmark`,
    method: "DELETE",
  },
  fetchBenchmark: {
    url: `${API_ENDPOINT}survey/benchmark-fetch`,
    method: "GET",
  },
  benchmarkTemplate: {
    url: `${API_ENDPOINT}survey/benchmark/downloadTemplate`,
    method: "GET",
  },
  benchmarkUpload: {
    url: `${API_ENDPOINT}survey/benchmark/upload`,
    method: "POST",
  },
};
