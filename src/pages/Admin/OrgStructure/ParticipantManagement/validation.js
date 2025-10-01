import * as yup from 'yup';

export const initValuesAdd = (data) => {
  return {
    userName: '',
    aliasName: '',
    eMailID: '',
    firstName: '',
    lastName: '',
    departmentID: '',
    companyMasterID: data,
    companyID: '',
    isReportPermission: '',
  };
};

export const initValuesUpdate = (selectedParticipant) => {
  return {
    userName: selectedParticipant?.userName || '',
    eMailID: selectedParticipant?.eMailID || '',
    firstName: selectedParticipant?.firstName || '',
    lastName: selectedParticipant?.lastName || '',
    aliasName: selectedParticipant?.aliasName || '',
    departmentID: selectedParticipant?.departmentID || '',
    companyMasterID: selectedParticipant?.companyMasterID || '',
    companyID: selectedParticipant?.companyID || '',
    participantID: selectedParticipant?.userID || '',
    isReportPermission: selectedParticipant?.isReportPermission,
  }
};

export const validationParticipantAdd = () => {
  return yup.object().shape({
    userName: yup.string().email('Invalid email format').required('Username is required').max(200, 'only at most 200 characters allowed'),
    eMailID: yup.string().email('Invalid email format').required('Email is required').max(50, 'only at most 50 characters allowed'),
    firstName: yup.string().required('First Name is required').max(30, 'only at most 30 characters allowed'),
    lastName: yup.string().required('Last Name is required').max(30, 'only at most 30 characters allowed'),
    aliasName: yup.string().required('Alias Name is required').max(30, 'only at most 30 characters allowed'),
    departmentID: yup.string().required('Department is required'),
    companyMasterID: yup.string().required('Company Master is required'),
    companyID: yup.number().required('Company is required'),
    isReportPermission: yup.boolean().required('Report selection is required'),
  });
};

export const validationParticipantUpdate = () => {
  return yup.object().shape({
    eMailID: yup.string().email('Invalid email format').required('Email is required').max(50, 'only at most 50 characters allowed'),
    firstName: yup.string().required('First Name is required').max(30, 'only at most 30 characters allowed'),
    lastName: yup.string().required('Last Name is required').max(30, 'only at most 30 characters allowed'),
    aliasName: yup.string().required('Alias Name is required').max(30, 'only at most 30 characters allowed'),
    departmentID: yup.string().required('Department is required'),
    isReportPermission: yup.boolean().required('Report selection is required'),
  });
};

export const initValuesFileUpload = () => {
  return {
    companyID: '',
    file: null,
  };
};

export const validationUploadFilePopup = () => {
  return yup.object().shape({
    companyID: yup.string().required("Company is required"),
    file: yup.mixed().required("File is required"),
  });
};