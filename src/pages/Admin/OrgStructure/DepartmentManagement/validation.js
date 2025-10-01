import * as yup from 'yup';

export const initValuesAdd = () => {
  return {
    companyID: '',
    departmentName: '',
    isAnonymous: false,
  };
};

export const initValuesUpdate = (selectedCompany) => {
  return {
    companyID: selectedCompany?.companyID ? selectedCompany?.companyID : '',
    departmentName: selectedCompany?.departmentName ? selectedCompany?.departmentName : '',
    isAnonymous: false
  }
};

export const validationDepartmentAdd = () => {
  return yup.object().shape({
    companyID: yup.string().required('Company Name is required'),
    departmentName: yup.string().required('Department Name is required').max(30, 'Department Name must be at most 30 characters')
      ,
  });
};



