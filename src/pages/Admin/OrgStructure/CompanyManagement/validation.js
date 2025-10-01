import * as yup from 'yup';

/**
 * Initialize the default values for adding a new company.
 * @param {string} data - The company master ID.
 * @returns {object} Default values for the new company form.
 */
export const initValuesAdd = (data) => {
  return {
    companyMasterID: data, // Unique identifier for the company master
    companyName: '',
    companyDescription: '',
    timezoneID: '',
  };
};

/**
 * Initialize the default values for updating a company.
 * @param {string} data - The company ID.
 * @param {object} selectedCompany - The selected company object.
 * @returns {object} Default values for the update company form.
 */
export const initValuesUpdate = (data, selectedCompany) => {
  return {
    companyID: data, // Unique identifier for the company
    companyName: selectedCompany?.companyName || '',
    companyDescription: selectedCompany?.companyDescription || '',
    timezoneID: selectedCompany?.timezoneID || '',
  };
};

/**
 * Validation schema for adding a new company.
 * @returns {yup.ObjectSchema} Validation schema for adding a new company.
 */
export const validationCompanyAdd = () => {
  return yup.object().shape({
    companyMasterID: yup.string().required('Master Name is required'),
    companyName: yup.string().required('Company Name is required').max(30, 'Company Name must be at most 30 characters'),
      
    companyDescription: yup.string().required('Company Description is required').max(200, 'Company Description must be at most 200 characters'),
    timezoneID: yup.string().required('Time Zone is required'),
  });
};


/**
 * Validation schema for updating a company.
 * @returns {yup.ObjectSchema} Validation schema for updating a company.
 */
export const validationCompanyUpdate = () => {
  return yup.object().shape({
    companyID: yup.string().required('Master Name is required'),
    companyName: yup.string().required('Company Name is required').max(30, 'Company Name must be at most 30 characters'),
      
    companyDescription: yup.string().required('Company Description is required').max(200, 'Company Description must be at most 200 characters'),
    timezoneID: yup.string().required('Time Zone is required'),
  });
};

