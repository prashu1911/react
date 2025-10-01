import { API_ENDPOINT_V1 } from "config";

const API_ENDPOINT = API_ENDPOINT_V1;

export const PROFILE_API = {
  getProfileDetails: {
    url: `${API_ENDPOINT}profile`,
    method: "POST",
  },
  createContactSupportTicket: {
    url: `${API_ENDPOINT}ticket`,
    method: "POST",
  },
  updateCompanyName: {
    url: `${API_ENDPOINT}profile/company`,
    method: "PUT",
  },
  getContactSupportTicketDetails: {
    url: `${API_ENDPOINT}ticket`,
    method: "GET",
  },
  uploadProfileImage:{
    url: `${API_ENDPOINT}upload/profile-image`,
    method: "POST",
  }
};
