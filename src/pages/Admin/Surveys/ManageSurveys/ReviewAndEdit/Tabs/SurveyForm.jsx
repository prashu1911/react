import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import toast from "react-hot-toast";
import { Form } from "react-bootstrap";
import { InputField, SelectField } from "../../../../../../components";

const SurveyForm = (
  { companyOptions, isEditableFlag, reviewData, survey },
  ref
) => {
  // State to store form values
  const [formData, setFormData] = useState({
    companyID: "",
    surveyName: "",
  });
const diableCompanySelect = true;
  // State for validation errors
  const [errors, setErrors] = useState({
    companyID: "",
    surveyName: "",
  });

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      companyID: reviewData?.survey_details?.companyID,
      surveyName: reviewData?.survey_details?.surveyName,
    }));
  }, [companyOptions.length]);

  // Handler to update the form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Call the validation function to check the field as it's changed
    // eslint-disable-next-line no-use-before-define
    validateField(name, value);
  };

  // Handle select field change
  const handleSelectChange = (selectedOption) => {
    const value = selectedOption ? selectedOption.value : "";
    setFormData((prevData) => ({
      ...prevData,
      companyID: value,
    }));

    // Call the validation function to check the select field as it's changed
    // eslint-disable-next-line no-use-before-define
    validateField("companyID", value);
  };

  // Custom validation function for each field
  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "companyID":
        newErrors.companyID = value ? "" : "Company is required";
        break;
      case "surveyName":
        newErrors.surveyName = value ? "" : "Survey Name is required";
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

    // Validate all fields on submit
    const validateForm = () => {
      let valid = true;
      let newErrors = { companyID: "", surveyName: "" };
    
      const errorFields = [];
    
      if (!formData.companyID) {
        newErrors.companyID = "Company Name is required";
        errorFields.push("companyID");
        valid = false;
      }
    
      if (!formData.surveyName) {
        newErrors.surveyName = "Survey Name is required";
        errorFields.push("surveyName");
        valid = false;
      }
    
      setErrors(newErrors);
    
      // Scroll to the first field with an error
      if (errorFields.length > 0) {
        const firstErrorElement = document.getElementById(errorFields[0]);
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    
      return valid;
    };
    

  // Handle form submit
  const handleSubmit = () => {
    // e.preventDefault();
    // Validate all fields before submit
    const isValid = validateForm()

    if (!isValid) {
      toast.dismiss(); // Dismiss all active toasts
      toast.error("Please enter all the required things to continue");
      return { data: null, isValid: false };
    }

    return {
      data: formData,
      // eslint-disable-next-line no-use-before-define
      isValid: validateForm(),
    };
  };

  // Forward the ref and expose handleSubmit
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  return (
    <Form onSubmit={handleSubmit}>
      <div className="pageTitle">
        <h2>Survey Name</h2>
      </div>
      <div className="d-sm-flex namefield">
        <Form.Group className="form-group" id="companyID">
          <Form.Label>
            Company Name <sup>*</sup>
          </Form.Label>
          <SelectField
            name="companyID"
            placeholder="Select Company Name"
            options={companyOptions}
            onChange={handleSelectChange}
            value={companyOptions?.find(
              (option) => option?.value === Number(formData.companyID)
            )}
            isDisabled={diableCompanySelect}
          />
          {errors.companyID && (
            <div className="text-danger">{errors.companyID}</div>
          )}
        </Form.Group>

        <Form.Group className="form-group" id="surveyName">
          <Form.Label>
            Survey Name <sup>*</sup>
          </Form.Label>
          <InputField
            type="text"
            placeholder="Enter Survey Name"
            name="surveyName"
            value={formData.surveyName}
            onChange={handleChange}
            // disabled={survey?.status !== "Design"}
          />
          {errors.surveyName && (
            <div className="text-danger">{errors.surveyName}</div>
          )}
        </Form.Group>
      </div>
    </Form>
  );
};

export default forwardRef(SurveyForm);
