import { API_ENDPOINT_V1 } from "config";

const API_ENDPOINT = API_ENDPOINT_V1;

export const Crosswalks = {
    /**
     * Get the departments for a given company
     * @param {string} companyID - The ID of the company
     * @returns {object} - An object containing the url and method of the API call
     */

    viewCrosswalk: {
        url: `${API_ENDPOINT}survey/crosswalk`,
        method: "GET",
    },
};