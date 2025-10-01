import { API_ENDPOINT_V1 } from "config";

const API_ENDPOINT = API_ENDPOINT_V1;

export const Distribution = {
    /**
     * Get the departments for a given company
     * @param {string} companyID - The ID of the company
     * @returns {object} - An object containing the url and method of the API call
     */
    fetchAllSchedule: {
        url: `${API_ENDPOINT}assign/schedule`,
        method: "GET",
    },
    createSchedule: {
        url: `${API_ENDPOINT}assign/schedule`,
        method: "POST",
    },
    updateSchedule: {
        url: `${API_ENDPOINT}assign/schedule`,
        method: "PUT",
    },
    deleteSchedule: {
        url: `${API_ENDPOINT}assign/schedule`,
        method: "DELETE",
    },
    createAnonymousDepartment: {
        url: `${API_ENDPOINT}anonymous/department`,
        method: "POST",
    },
    createAnonymousSchedule: {
        url: `${API_ENDPOINT}anonymous/schedule`,
        method: "POST",
    },
    createAssignScheduleAnonymousImmediate: {
        url: `${API_ENDPOINT}anonymous/immediate`,
        method: "POST",
    },
    assignScheduleAnonymousImmediate: {
        url: `${API_ENDPOINT}anonymous/immediate`,
        method: "GET",
    },
    assignImmediate: {
        url: `${API_ENDPOINT}assign/immediate`,
        method: "POST",
    },

    assignUnAssign: {
        url: `${API_ENDPOINT}assign/unAssign`,
        method: "POST",
    },

    downloadQRCode: {
        url: `${API_ENDPOINT}anonymous/downloadQR`,
        method: "GET",
    },

    fetchAllParticipant: {
        url: `${API_ENDPOINT}participant/surveys`,
        method: "POST",
    },

    participantDownload: {
        url: `${API_ENDPOINT}participant/download`,
        method: "POST",
    },


    participantRemainder: {
        url: `${API_ENDPOINT}participant/remainder`,
        method: "POST",
    },
    addToSchdule: {
        url: `${API_ENDPOINT}assign/addToSchedule`,
        method: "POST",
    },
    // API to check if survey has Pre Start configured or not
    checkPreStart: {
        url: `${API_ENDPOINT}assign/checkPreStartMail`,
        method: "GET",
    }
};