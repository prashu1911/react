import { API_ENDPOINT_V1 } from "config";

const API_ENDPOINT = API_ENDPOINT_V1;

export const RESOURSE_MANAGEMENT = {
  /**
   * Get the departments for a given company
   * @param {string} companyID - The ID of the company
   * @returns {object} - An object containing the url and method of the API call
   */
  getEmailList: {
    url: `${API_ENDPOINT}resource/email`,
    method: "POST",
  },
  emailResponseList: {
    url: `${API_ENDPOINT}resource/emailDropdown`,
    method: "GET",
  },
  getEmailById: {
    url: `${API_ENDPOINT}resource/email/preview`,
    method: "GET",
  },
  getSearchFormData: {
    url: `${API_ENDPOINT}resource/searchFrom`,
    method: "GET",
  },
  getSurveyTypeData: {
    url: `${API_ENDPOINT}resource/introductionDropdown`,
    method: "GET",
  },
  getIntroductionList: {
    url: `${API_ENDPOINT}resource/introduction`,
    method: "POST",
  },
  getSearchFormDataForTemplate: {
    url: `${API_ENDPOINT}resource/assessment/searchFrom`,
    method: "GET",
  },
  getSurveyTypeDataForTemplate: {
    url: `${API_ENDPOINT}resource/assessmentDropdown`,
    method: "GET",
  },
  getTemplateDataList: {
    url: `${API_ENDPOINT}resource/assessment`,
    method: "POST",
  },
  deleteTemplateData: {
    url: `${API_ENDPOINT}resource/assessment`,
    method: "DELETE",
  },
  getQuesSurveyTypeData: {
    url: `${API_ENDPOINT}resource/questionDropdown`,
    method: "GET",
  },
  getQuestionList: {
    url: `${API_ENDPOINT}resource/question`,
    method: "POST",
  },
  getQuestionById: {
    url: `${API_ENDPOINT}resource/question/preview`,
    method: "GET",
  },
  getResponseBlockSearchFormData: {
    url: `${API_ENDPOINT}resource/responseDropdown`,
    method: "GET",
  },
  getResponseBlockList: {
    url: `${API_ENDPOINT}resource/response`,
    method: "POST",
  },
  updateQuestiondata: {
    url: `${API_ENDPOINT}resource/question`,
    method: "PUT",
  },
  addQuestiondata: {
    url: `${API_ENDPOINT}resource/question`,
    method: "POST",
  },
  deleteQuestiondata: {
    url: `${API_ENDPOINT}resource/question`,
    method: "DELETE",
  },
  getResponceBlockById: {
    url: `${API_ENDPOINT}resource/response/viewResponse`,
    method: "GET",
  },
  deleteResponceBlockdata: {
    url: `${API_ENDPOINT}resource/response`,
    method: "DELETE",
  },
  updateEmaildata: {
    url: `${API_ENDPOINT}resource/email`,
    method: "PUT",
  },
  addEmaildata: {
    url: `${API_ENDPOINT}resource/email`,
    method: "POST",
  },
  deleteEmaildataById: {
    url: `${API_ENDPOINT}resource/email`,
    method: "DELETE",
  },
  updateResponseBlockData: {
    url: `${API_ENDPOINT}resource/response`,
    method: "PUT",
  },
  addResponseBlockData: {
    url: `${API_ENDPOINT}resource/response`,
    method: "POST",
  },
  deleteIntroductionData: {
    url: `${API_ENDPOINT}resource/introduction`,
    method: "DELETE",
  },
  updateIntroductionData: {
    url: `${API_ENDPOINT}resource/introduction`,
    method: "PUT",
  },
  addIntroductionData: {
    url: `${API_ENDPOINT}resource/introduction`,
    method: "POST",
  },
  getCommunityData: {
    url: `${API_ENDPOINT}resource/assessment/communityName`,
    method: "GET",
  },
  saveResourcedata: {
    url: `${API_ENDPOINT}resource/save-resource`,
    method: "POST",
  },
  copyQuestionToMyresource: {
    url: `${API_ENDPOINT}resource/question/addToMyResource`,
    method: "POST",
  },
  copyResponseBlockToMyresource: {
    url: `${API_ENDPOINT}resource/response/addToMyResource`,
    method: "POST",
  },
  copyIntroductionToMyresource: {
    url: `${API_ENDPOINT}resource/introduction/addToMyResource`,
    method: "POST",
  },
  copyEmailToMyresource: {
    url: `${API_ENDPOINT}resource/email/addToMyResource`,
    method: "POST",
  },
  copyResponseTemplateToMyresource: {
    url: `${API_ENDPOINT}resource/assessment/addToMyAssessment`,
    method: "POST",
  },
  copyResponseTemplateToAnotherResource: {
    url: `${API_ENDPOINT}survey/clone`,
    method: "POST",
  },
  // APIs for branch filter response blocks
  createBranchFilter:{
    url: `${API_ENDPOINT}resource/responseBranchFilter`,
    method: "POST",
  },
  listBranchFilter:{
    url: `${API_ENDPOINT}resource/responseBranchFilter`,
    method: "POST",
  },
  updateBranchFilter:{
    url: `${API_ENDPOINT}resource/responseBranchFilter`,
    method: "PUT",
  },
  deleteBranchFilter:{
    url: `${API_ENDPOINT}resource/responseBranchFilter`,
    method: "DELETE",
  },
  copyBranchFilter:{
    url: `${API_ENDPOINT}resource/responseBranchFilter/addToMyResource`,
    method: "POST",
  }
};