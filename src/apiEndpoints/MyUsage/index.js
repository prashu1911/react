import { API_ENDPOINT_V1 } from "config";

const API_ENDPOINT = API_ENDPOINT_V1;

export const MyUsageEndPoint = {
    /**
     * Get the departments for a given company
     * @param {string} companyID - The ID of the company
     * @returns {object} - An object containing the url and method of the API call
     */
    myUsageGetDetails: {
        url: `${API_ENDPOINT}myUsage`,
        method: "GET",
    },
    surveyInstruments :{
        url: `${API_ENDPOINT}myUsage/getSurvey`,
        method: "GET",
    },
    publishedSurvey :{
        url: `${API_ENDPOINT}myUsage/published`,
        method: "GET",
    },
    usageSummary :{
        url: `${API_ENDPOINT}myUsage/summary`,
        method: "GET",
    },
    responseCount :{
        url: `${API_ENDPOINT}myUsage/getResponses`,
        method: "GET",
    },
    adminCount :{
        url: `${API_ENDPOINT}myUsage/getAdmins`,
        method: "GET",
    },
};