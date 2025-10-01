import { API_ENDPOINT_V1 } from "config";

const API_ENDPOINT = API_ENDPOINT_V1;

export const Participant = {
    /**
     * Get the departments for a given company
     * @param {string} companyID - The ID of the company
     * @returns {object} - An object containing the url and method of the API call
     */
    fetchFaq: {
        url: `${API_ENDPOINT}participant/faq`,
        method: "GET",
    },
    fetchContact: {
        url: `${API_ENDPOINT}participant/contact`,
        method: "GET",
    },
    fetchQuestionList: {
        url: `${API_ENDPOINT}participant/questionList`,
        method: "GET",
    },
    thankYouMail: {
        url: `${API_ENDPOINT}participant/thankYouMail`,
        method: "GET",
    },
    surveyQuestionList: {
        url: `${API_ENDPOINT}survey/questionList`,
        method: "GET",
    },
    fetchAnonymous: {
        url: `${API_ENDPOINT}Survey/Anonymous`,
        method: "GET",
    },
    startSurvey: {
        url: `${API_ENDPOINT}participant/startSurvey`,
        method: "GET",
    },
    fetchQuestionListAnonymous: {
        url: `${API_ENDPOINT}participant/questionListAnonymous`,
        method: "GET",
    },
    insertResponse: {
        url: `${API_ENDPOINT}participant/insertResponse`,
        method: "POST",
    },
    assessmentFinish: {
        url: `${API_ENDPOINT}participant/assessmentFinish`,
        method: "POST",
    },
    assessmentList: {
        url: `${API_ENDPOINT}participant/assessmentList`,
        method: "GET",
    },
    validParticipantLogin: {
        url: `${API_ENDPOINT}participant/auth`,
        method: "POST",
    },
    annonymousUserLogin: {
        url: `${API_ENDPOINT}participant/auth`,
        method: "POST",
    }
};