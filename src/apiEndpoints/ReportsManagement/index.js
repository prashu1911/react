import { API_ENDPOINT_V1 } from "config";
 
const API_ENDPOINT = API_ENDPOINT_V1;
 
export const REPORTS_MANAGEMENT = {
  fetchReportUsingSurveyANDCompanyId: {
    url: `${API_ENDPOINT}reports/surveyAnalysis/listOfQuestions`,
    method: "GET",
  },
  downloadAssessmentResponse: {
    url: `${API_ENDPOINT}reports/surveyAnalysis/responsesExcel`,
    method: "GET",
  },
  downloadRBOEQResponse: {
    url: `${API_ENDPOINT}reports/surveyAnalysis/rboeqExcel`,
    method: "GET",
  },
  downloadQuestionList: {
    url: `${API_ENDPOINT}reports/surveyAnalysis/questionListExcel`,
    method: "GET",
  },
  fetchSurveyAssessmentResponse: {
    url: `${API_ENDPOINT}reports/surveyAnalysis/responses`,
    method: "POST",
  },
  fetchSurveyRBOEQResponse: {
    url: `${API_ENDPOINT}reports/surveyAnalysis/rboeqResponse`,
    method: "POST",
  },
  fetchMyReportData: {
    url: `${API_ENDPOINT}Reports/reportList`,
    method: "GET",
  },
  editMyReport: {
    url: `${API_ENDPOINT}demographic/edit`,
    method: "PUT",
  },
  publishMyReport: {
    url: `${API_ENDPOINT}demographic/publish`,
    method: "PUT",
  },
  deleteMyReport: {
    url: `${API_ENDPOINT}demographic/delete`,
    method: "DELETE",
  },
  singleChartReport: {
    url: `${API_ENDPOINT}Reports/singleChart`,
    method: "POST",
  },
  summaryChartReport: {
    url: `${API_ENDPOINT}Reports/summaryChart`,
    method: "POST",
  },
  detailedChartReport: {
    url: `${API_ENDPOINT}Reports/detailedChart`,
    method: "POST",
  },
  igChartReport: {
    url: `${API_ENDPOINT}Reports/igChart`,
    method: "POST",
  },
  drillDownChartReport: {
    url: `${API_ENDPOINT}Reports/drillDownChart`,
    method: "POST",
  },


  fetchReportById: {
    url: `${API_ENDPOINT}Reports/fetchReport`,
    method: "GET",
  },
};
