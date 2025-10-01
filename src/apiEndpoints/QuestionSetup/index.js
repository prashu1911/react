
import { API_ENDPOINT_V1 } from "config";

const API_ENDPOINT = API_ENDPOINT_V1;

export const QuestionSetup = {
    addOutcome: {
        url: `${API_ENDPOINT}outcome`,
        method: "POST",
    },
    getOutcome: {
        url: `${API_ENDPOINT}outcome`,
        method: "GET",
    },
    getOutcomeColor: { 
        url: `${API_ENDPOINT}outcome/color`,
        method: "GET",
    },
    fetchQuestionList: {
        url: `${API_ENDPOINT}resource/question`,
        method: "POST",
    },
    fetchQuestion: {
        url: `${API_ENDPOINT}question/fetch`,
        method: "GET",
    },
    addOeq: {
        url: `${API_ENDPOINT}question/oeq`,
        method: "POST",
    },

    updateOeq: {
        url: `${API_ENDPOINT}question/oeq`,
        method: "PUT",
    },
    getSurveyType: {
        url: `${API_ENDPOINT}resource/questionDropdown`,
        method: "GET",
    },
    getResponseType: {
        url: `${API_ENDPOINT}question/resource/type`,
        method: "GET",
    },
    createRatingQuestion: {
        url: `${API_ENDPOINT}question/rating`,
        method: "POST",
    },
    UpdateRatingQuestion: {
        url: `${API_ENDPOINT}question/rating`,
        method: "PUT",
    },
    createNestedQuestion: {
        url: `${API_ENDPOINT}question/nested`,
        method: "POST",
    },
    updateNestedQuestion: {
        url: `${API_ENDPOINT}question/nested`,
        method: "PUT",
    },
    createMultiResponseQuestion: {
        url: `${API_ENDPOINT}question/multiresponse`,
        method: "POST",
    },
    updateMultiResponseQuestion: {
        url: `${API_ENDPOINT}question/multiresponse`,
        method: "PUT",
    },
    fetchQuestionCount: {
        url: `${API_ENDPOINT}survey/question/count`,
        method: "GET",
    },
    createGateQulifier: {
        url: `${API_ENDPOINT}question/gate`,
        method: "POST",
    },
    updateGateQulifier: {
        url: `${API_ENDPOINT}question/gate`,
        method: "PUT",
    },
    createRatingGateQualifierQuestion: {
        url: `${API_ENDPOINT}question/rating`,
        method: "POST",
    },
    editOutcome: {
        url: `${API_ENDPOINT}outcome`,
        method: "PUT",
    },
    deleteOutcome: {
        url: `${API_ENDPOINT}outcome`,
        method: "DELETE",
    },
    deleteQuestion: {
        url: `${API_ENDPOINT}question/delete`,
        method: "DELETE",
    },
    createVisibleDemographic: {
        url: `${API_ENDPOINT}question/demographic`,
        method: "POST",
    },
    updateVisibleDemographic: {
        url: `${API_ENDPOINT}question/demographic`,
        method: "PUT",
    },
    fetchBranchFilter: {
        url: `${API_ENDPOINT}resource/responseBranchFilter`,
        method: "POST",
    },
    downLoadTemplate: {
        url: `${API_ENDPOINT}download/template/demographic`,
        method: "GET",
    },
    uploadParticipant: {
        url: `${API_ENDPOINT}upload/question/demographic`,
        method: "POST",
    },
    rearrangeOutcomes: {
        url: `${API_ENDPOINT}question/sequence`,
        method: "PUT",
    },
    deleteTemplate:{
        url: `${API_ENDPOINT}delete/demographic`,
        method: "GET",
    },
     getUploadedParticipants: {
        url: `${API_ENDPOINT}download/demographic_data`,
        method: "GET"
    },
     getUploadedFile: {
        url: `${API_ENDPOINT}download/demographic`,
        method: "GET"
    },

};
