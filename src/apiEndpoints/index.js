import { API_ENDPOINT_V1 } from "config";

const API_ENDPOINT = API_ENDPOINT_V1;

export const AUTH_ENDPOINTS = {
  login: {
    url: `${API_ENDPOINT}auth`,
    method: "POST",
  },
  ssocompanies: (username,password) => ({
    url: `${API_ENDPOINT}auth?tUsername=${username}&tPassword=${password}`,
    method: "GET",
  }),
  ssoFinalLogin: {
    url: `${API_ENDPOINT}auth/sso`,
    method: "POST",
  },
  changePassword: {
    url: `${API_ENDPOINT}reset-password`,
    method: "PATCH",
  }
};

export const FORGET_PASSWORD = {
  passwordForget: (path) => ({
    url: `${API_ENDPOINT}reset-password${path}`,
    method: "GET",
  }),
  passwordVerification: {
    url: `${API_ENDPOINT}reset-password`,
    method: "POST",
  },
  passwordUpdate: {
    url: `${API_ENDPOINT}reset-password`,
    method: "PUT",
  }
}

