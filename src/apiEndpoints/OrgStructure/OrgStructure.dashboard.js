import { API_ENDPOINT_V1 } from "config";

const API_ENDPOINT = API_ENDPOINT_V1;

export const DEPARTMENT_MANAGEMENT = {
  departmentThroughCompany: (companyID) => ({
    url: `${API_ENDPOINT}department?${companyID}`,
    method: "GET",
  }),

  // Endpoint for Server Side Processing
  getDepartmentServerSide: { // New endpoint definition
    url: `${API_ENDPOINT}department`,
    method: "POST",
  },
  
  createDepartment: {
    url: `${API_ENDPOINT}department`,
    method: "POST",
  },

  updateDepartment: {
    url: `${API_ENDPOINT}department`,
    method: "PUT",
  },

  deleteDepartment: {
    url: `${API_ENDPOINT}department`,
    method: "DELETE",
  },
};


export const PARTICIPANT_MANAGEMENT = {
  departmentThroughCompany: {
    url: `${API_ENDPOINT}participant `,
    method: "GET",
  },

  createParticipant: {
    url: `${API_ENDPOINT}participant`,
    method: "POST",
  },

  updateParticipant: {
    url: `${API_ENDPOINT}participant`,
    method: "PUT",
  },

  deleteParticipant: {
    url: `${API_ENDPOINT}participant`,
    method: "DELETE",
  },

  resetPassword: {
    url: `${API_ENDPOINT}participant`,
    method: "PATCH",
  },

  uploadFile: {
    url: `${API_ENDPOINT}participant/upload`,
    method: "POST",
  },

  downloadExcelErrorFile: {
    url: `${API_ENDPOINT}download/participant`,
    method: "GET",
  },

  downloadTemplateFile: {
    url: `${API_ENDPOINT}download/template/participant`,
    method: "GET",
  },

  // Endpoint for Server Side Processing
  getParticipantsServerSide: { // New endpoint definition
    url: `${API_ENDPOINT}participant`,
    method: "POST",
  },

};


export const COMPANY_MANAGEMENT = {
  getCompany: (companyMasterID) => ({
    url: `${API_ENDPOINT}company?${companyMasterID}`,
    method: "GET",
  }),

  getCompanybasic:{
    url: `${API_ENDPOINT}company`,
    method: "GET",
  },
  // Endpoint for Server Side Processing
  getCompaniesServerSide: { // New endpoint definition
    url: `${API_ENDPOINT}company`,
    method: "POST",
  },
  createCompany: {
    url: `${API_ENDPOINT}company`,
    method: "POST",
  },
  updateCompany: {
    url: `${API_ENDPOINT}company`,
    method: "PUT",
  },

  deleteCompany: {
    url: `${API_ENDPOINT}company`,
    method: "DELETE",
  },
  timeZones: {
    url: `${API_ENDPOINT}timezone`,
    method: "GET",
  },
};

export const COMMANAPI = {
  getComman: (CommanPath) => ({
    url: `${API_ENDPOINT}${CommanPath}`,
    method: "GET",
  }),
   // Endpoint for Server Side Processing
  getAdminsServerSide: { // New endpoint definition
    url: `${API_ENDPOINT}admin`,
    method: "POST",
  },
}