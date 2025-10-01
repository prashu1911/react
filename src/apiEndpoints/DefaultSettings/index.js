import { API_ENDPOINT_V1 } from "config";

const API_ENDPOINT = API_ENDPOINT_V1;

export const DEFAULT_SETTINGS = {
  /**
   * Get the departments for a given company
   * @param {string} companyID - The ID of the company
   * @returns {object} - An object containing the url and method of the API call
   */

  saveEmailContent: {
    url: `${API_ENDPOINT}default_settings_email`,
    method: "POST",
  },
  getAllSettings: {
    url: `${API_ENDPOINT}default_settings`,
    method: "GET",
  },
  updatedThreshold: {
    url: `${API_ENDPOINT}default_settings_update_threshold`,
    method: "PUT",
  },
  addFaq: {
    url: `${API_ENDPOINT}default_settings_faq`,
    method: "POST",
  },
  updateFaq: {
    url: `${API_ENDPOINT}default_settings_faq`,
    method: "PUT",
  },
  deleteFaq: {
    url: `${API_ENDPOINT}default_settings_faq`,
    method: "DELETE",
  },
  addContact: {
    url: `${API_ENDPOINT}default_settings_contact`,
    method: "POST",
  },
  updateContact: {
    url: `${API_ENDPOINT}default_settings_contact`,
    method: "PUT",
  },
  deleteContact: {
    url: `${API_ENDPOINT}default_settings_contact`,
    method: "DELETE",
  },
  setDefaultColor: {
    url: `${API_ENDPOINT}default_settings_set_default_color`,
    method: "POST",
  },
  createCustomColor: {
    url: `${API_ENDPOINT}default_settings_create_color`,
    method: "POST",
  },
  updateDefaultSettingLogo: {
    url: `${API_ENDPOINT}default_settings_logo`,
    method: "POST",
  },
  updateDefaultSettingResultOutput: {
    url: `${API_ENDPOINT}default_settings_result_output`,
    method: "POST",
  },
  updateDefaultSettingDynamicOutput: {
    url: `${API_ENDPOINT}default_settings_dynamic_outcome_label`,
    method: "POST",
  },
  updateDefaultSettingLayout: {
    url: `${API_ENDPOINT}default_settings_layout`,
    method: "POST",
  },
  updateChartOption: {
    url: `${API_ENDPOINT}chartOption`,
    method: "POST",
  },
};
