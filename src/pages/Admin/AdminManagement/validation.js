import * as yup from 'yup';

export const initValuesAdd = (data) => {
  return {
    userName: '',
    eMailID: '',
    firstName: '',
    lastName: '',
    aliasName: '',
    roleID: '',
    companyMasterID: data,
    companyID: '',
    isViewAlias: false
  };
};

export const initValuesUpdate = (selectedAdmin) => {
  return {
    userName: selectedAdmin?.userName,
    adminID: selectedAdmin?.userID,
    companyMasterID: selectedAdmin?.companyMasterID,
    companyID: selectedAdmin?.companyID,
    roleID: selectedAdmin?.roleID,
    eMailID: selectedAdmin?.eMailID,
    firstName: selectedAdmin?.firstName,
    lastName: selectedAdmin?.lastName,
    aliasName: selectedAdmin?.aliasName,
    isViewAlias: selectedAdmin?.isViewAlias
  }
};

export const validationAdminManageAdd = () => {
  return yup.object().shape({
    companyMasterID: yup.string().required('Company Master is required'),
    companyID: yup.number().required('Company is required'),
    userName: yup.string().email('Invalid email format').required('Username is required').max(200, 'only at most 200 characters allowed'),
    firstName: yup.string().required('First Name is required').max(30, 'only at most 30 characters allowed'),
    lastName: yup.string().required('Last Name is required').max(30, 'only at most 30 characters allowed'),
    aliasName: yup.string().required('Alias Name is required').max(30, 'only at most 30 characters allowed'),
    eMailID: yup.string().email('Invalid email format').required('Email is required').max(50, 'only at most 50 characters allowed'),
    roleID: yup.string().required('Role is required'),
  });
};

export const validationAdminManageUpdate = () => {
  return yup.object().shape({
    adminID: yup.number().required('Admin ID is required'),
    companyMasterID: yup.number().required('Company Master is required'),
    roleID: yup.number().required('Role is required'),
    eMailID: yup.string().email('Invalid email format').required('Email is required').max(50, 'only at most 50 characters allowed'),
    firstName: yup.string().required('First Name is required').max(30, 'only at most 30 characters allowed'),
    lastName: yup.string().required('Last Name is required').max(30, 'only at most 30 characters allowed'),
    aliasName: yup.string().required('Alias Name is required').max(30, 'only at most 30 characters allowed'),
    isViewAlias: yup.boolean().required('View Alias Only is required'),
  });
};

