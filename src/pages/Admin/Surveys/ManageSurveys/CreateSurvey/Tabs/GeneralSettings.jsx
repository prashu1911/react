import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import toast from "react-hot-toast";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { commonService } from "services/common.service";
import { InputField, SelectField } from "../../../../../../components";
import SurveyTextModel from "../ModelComponent/SurveyTextModel";
import { validationTextPopup } from "../validation";
import ResponseViewTooltip from "../../QuestionSetup/Tooltip";
const GeneralSettings = (
  { defaultOptions, responseScore, companyID, userData },
  ref
) => {
  // State to store form values
  const [formData, setFormData] = useState({
    assessment_language: "English",
    response_slider: { value: false, label: "No" },
    question_limit: "",
    randomize_question: { value: false, label: "No" },
    response_score_range: { value: 1, label: "0 to 5" },
    question_per_page: { value: 5, label: 5 },
    surveyLanguageText: "Skip for now",
    isHideOutcome: { value: false, label: "No" },
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    assessment_language: "",
    response_slider: "",
    question_limit: "",
    randomize_question: "",
    response_score_range: "",
    question_per_page: "",
    isHideOutcome: "",
  });

  const [questionPerPagedata, setQuestionPerPagedata] = useState([]);

  useEffect(() => {
    if (questionPerPagedata?.length > 0) {
      const defaultOption = questionPerPagedata.find(
        (option) => option.isDefault
      );
      handleSelectChange(defaultOption, "question_per_page");
    }
  }, [questionPerPagedata]);

  // text modal
  const [showText, setshowText] = useState(false);
  const textClose = () => setshowText(false);
  const textShow = () => setshowText(true);

  // custom option for score range

  const [customResponseScore, setCustomResponseScore] = useState({
    rangeID: -1,
    rangeStart: "",
    rangeEnd: "",
  });

  const extendedResponseScore = [
    ...responseScore,
    {
      value: -1,
      label: "Custom",
    },
  ];

  const handleBlurCustomRange = (e) => {
    const { name, value } = e.target;

    if (
      name === "To" &&
      customResponseScore.rangeStart &&
      parseFloat(value) < parseFloat(customResponseScore.rangeStart)
    ) {
      toast.error('"To" value cannot be less than "From" value', {
        toastId: "err0001",
      });
      const updatedScore = {
        ...customResponseScore,
        rangeEnd: "",
      };
      setCustomResponseScore(updatedScore);
      return;
    }

    if (
      name === "From" &&
      customResponseScore.rangeEnd &&
      parseFloat(customResponseScore.rangeEnd) < parseFloat(value)
    ) {
      toast.error('"From" value cannot be greater than "To" value', {
        toastId: "err0002",
      });
      const updatedScoreTwo = {
        ...customResponseScore,
        rangeStart: "",
      };
      setCustomResponseScore(updatedScoreTwo);
    }
  };

  const handleCustomRange = (e) => {
    const { name, value } = e.target;

    // Update the state first
    const updatedScore = {
      ...customResponseScore,
      [name === "From" ? "rangeStart" : "rangeEnd"]: value,
    };

    // Validation: Ensure "To" is not less than "From"
    // if (
    //   name === "To" &&
    //   updatedScore.rangeStart &&
    //   parseFloat(value) < parseFloat(updatedScore.rangeStart)
    // ) {
    //   toast.error('"To" value cannot be less than "From" value');
    //   return;
    // }

    // if (
    //   name === "From" &&
    //   updatedScore.rangeEnd &&
    //   parseFloat(updatedScore.rangeEnd) < parseFloat(value)
    // ) {
    //   toast.error('"From" value cannot be greater than "To" value');
    //   return;
    // }

    setCustomResponseScore(updatedScore);
  };

  const fetchQuestionLimit = async () => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.getQuestionLimit,
      queryParams: { companyID },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setFormData((prevData) => ({
        ...prevData,
        question_limit: response?.data?.questionLimit,
      }));
    } else {
      console.log("error");
    }
  };

  const fetchQuestionPerPage = async () => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.getQuestionPerPage,
      queryParams: { companyID: companyID ?? "" },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setQuestionPerPagedata(
        response?.data?.data?.map((item) => ({
          value: item.layoutOption,
          label: item.layoutOption,
          isDefault: item.isDefaultLayout,
        }))
      );

      if (
        Array.isArray(response?.data?.data) &&
        response?.data?.data?.length > 0
      ) {
        const findDefault = response?.data?.data?.find(
          (ele) => ele.isDefaultLayout === 1
        );

        if (findDefault) {
          setFormData((prev) => ({
            ...prev,
            isHideOutcome: {
              value: findDefault?.isHideOutcome,
              label: findDefault?.isHideOutcome ? "Yes" : "No",
            },
          }));
        }
      }
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    if (companyID) {
      fetchQuestionLimit();
      fetchQuestionPerPage();
    }
  }, [companyID]);

  // Handler to update the form data
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (value === "Others") {
      textShow();
    }

    // Update formData state
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "radio" ? (checked ? value : "") : value,
    }));

    // eslint-disable-next-line no-use-before-define
    validateField(name, value);
  };

  // Handle select field change
  const handleSelectChange = (selectedOption, name) => {
    const value = selectedOption;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (value.value !== -1 && name === "response_score_range") {
      setCustomResponseScore({
        rangeID: -1,
        rangeStart: "",
        rangeEnd: "",
      });
    }

    // Call the validation function to check the select field as it's changed
    // eslint-disable-next-line no-use-before-define
    validateField(name, value);
  };

  // Custom validation function for each field
  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "response_slider":
        newErrors.response_slider = value
          ? ""
          : "Default Response View As Slider is required";
        break;
      case "question_limit":
        newErrors.question_limit = value ? "" : "Question Limit is required";
        break;
      case "randomize_question":
        newErrors.randomize_question = value
          ? ""
          : "Randomize Question is required";
        break;
      case "response_score_range":
        newErrors.response_score_range = value
          ? ""
          : "Response score range is required";
        break;
      case "question_per_page":
        newErrors.question_per_page = value
          ? ""
          : "Question per page is required";
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };
  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!formData.response_slider) {
      newErrors.response_slider = "Default Response View As Slider is required";
      valid = false;
    }

    if (!formData.question_limit) {
      newErrors.question_limit = "Question Limit is required";
      valid = false;
    }

    if (!formData.randomize_question) {
      newErrors.randomize_question = "Randomize Questions is required";
      valid = false;
    }

    if (!formData.response_score_range) {
      newErrors.response_score_range = "Response Score Range is required";
      valid = false;
    }

    if (formData.response_score_range) {
      if (
        formData.response_score_range.value === -1 &&
        (!customResponseScore.rangeEnd || !customResponseScore.rangeStart)
      ) {
        newErrors.response_score_range = "Response Score Range is required";
        valid = false;
      }
    }

    if (!formData.question_per_page) {
      newErrors.question_per_page = "Question Per Page is required";
      valid = false;
    }
    const errorField = Object.keys(newErrors);
    if (errorField.length > 0) {
     
      const firstErrorElement = document.getElementById(errorField[0]);
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle form submit
  const handleSubmit = () => {
    // e.preventDefault();
    // Validate all fields before submit

    const isValid = validateForm();

    if (!isValid) {
      toast.dismiss(); // Dismiss all active toasts
      toast.error("Please enter all the required things to continue");
      return { data: null, isValid: false };
    }

    let obj = {
      value: formData.response_score_range.value,
      label: formData.response_score_range.label,
      customResponse: customResponseScore,
    };
    return {
      data: { ...formData, response_score_range: obj },
      // eslint-disable-next-line no-use-before-define
      isValid: validateForm(),
    };
  };

  // Validate all fields on submit

  // Forward the ref and expose handleSubmit
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const handleSurveytext = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      surveyLanguageText: value?.surveyText,
    }));
  };

  return (
    <div className="generalsettings-container">
      <div className="pageTitle">
        <h2>General Settings </h2>
      </div>
      <div className="generalsetting_inner flex-wrap gap-2">
        {/* Survey Text Selection */}
        <div className="generalsetting_field">
          <div className="form-group">
            <Form.Label>
              Survey Text<sup>*</sup>
              <Link>
                <OverlayTrigger
                  overlay={
                    <Tooltip id="tooltip-disabled">
                      Select the language in which the assessment will be
                      displayed to users
                    </Tooltip>
                  }
                >
                  <span className="d-inline-block">
                    <em
                      disabled
                      style={{ pointerEvents: "none" }}
                      className="icon-info-circle"
                    />
                  </span>
                </OverlayTrigger>
              </Link>
            </Form.Label>
            <div className="onlyradio flex-wrap">
              {["radio"].map((type) => (
                <React.Fragment key={`assessment-${type}`}>
                  <Form.Check
                    controlid="english"
                    inline
                    label="English"
                    name="assessment_language"
                    type={type}
                    value="English"
                    checked={formData.assessment_language === "English"}
                    onChange={handleChange}
                  />
                  <Form.Check
                    controlid="navigation"
                    inline
                    label={`Navigation Shows Icon Only`}
                    name="assessment_language"
                    type={type}
                    value="Others"
                    checked={formData.assessment_language === "Others"}
                    onChange={handleChange}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Default Response View As Slider */}
        <div className="generalsetting_field">
          <div className="form-group">
            <Form.Label>
              Default Response View As Slider<sup>*</sup>
              <OverlayTrigger>
                <ResponseViewTooltip></ResponseViewTooltip>
              </OverlayTrigger>
            </Form.Label>
            <SelectField
              id="response_slider"
              name="response_slider"
              options={defaultOptions}
              placeholder="Default Response"
              onChange={(value) => handleSelectChange(value, "response_slider")}
              defaultValue={{ value: false, label: "No" }}
            />
            {errors.response_slider && (
              <div className="text-danger">{errors.response_slider}</div>
            )}
          </div>
        </div>

        {/* Question Limit */}
        <div className="generalsetting_field">
          <div className="form-group">
            <Form.Label>
              Question Limit<sup>*</sup>
            </Form.Label>
            <InputField
              type="text"
              name="question_limit"
              id="question_limit"
              placeholder="Question Limit"
              onChange={handleChange}
              value={
                // eslint-disable-next-line eqeqeq
                formData.question_limit == -1
                  ? "unlimited"
                  : formData.question_limit
              }
              // eslint-disable-next-line eqeqeq
              // disabled={formData.question_limit == -1}
            />
            {errors.question_limit && (
              <div className="text-danger">{errors.question_limit}</div>
            )}
          </div>
        </div>

        {/* Randomize Questions */}
        <div className="generalsetting_field">
          <div className="form-group">
            <Form.Label>
              Randomize Questions<sup>*</sup>
            </Form.Label>
            <SelectField
              id="randomize_question"
              name="randomize_question"
              options={defaultOptions}
              placeholder="Randomize Questions"
              //   onChange={handleChange}
              onChange={(value) =>
                handleSelectChange(value, "randomize_question")
              }
              defaultValue={{ value: false, label: "No" }}
            />
            {errors.randomize_question && (
              <div className="text-danger">{errors.randomize_question}</div>
            )}
          </div>
        </div>

        {/* Response Score Range */}
        <div className="generalsetting_field">
          <div className="form-group">
            <Form.Label>
              Response Score Range<sup>*</sup>
            </Form.Label>
            <SelectField
              id="response_score_range"
              name="response_score_range"
              options={extendedResponseScore}
              placeholder="Response Score Range"
              onChange={(value) =>
                handleSelectChange(value, "response_score_range")
              }
              defaultValue={{ value: 1, label: "0 to 5" }}
            />
            {errors.response_score_range && (
              <div className="text-danger">{errors.response_score_range}</div>
            )}
          </div>
          {formData?.response_score_range?.value === -1 && (
            <div style={{ display: "flex", gap: "5px" }}>
              <div className="form-group">
                <InputField
                  type="number"
                  placeholder="From"
                  name="From"
                  value={customResponseScore?.rangeStart}
                  onChange={handleCustomRange}
                  onBlur={handleBlurCustomRange}
                />
              </div>
              <div className="form-group">
                <InputField
                  type="number"
                  placeholder="To"
                  name="To"
                  value={customResponseScore?.rangeEnd}
                  onChange={handleCustomRange}
                  onBlur={handleBlurCustomRange}
                />
              </div>
            </div>
          )}
        </div>

        {/* Questions Per Page */}
        <div className="generalsetting_field">
          <div className="form-group">
            <Form.Label>
              Questions Per Page<sup>*</sup>
            </Form.Label>
            <SelectField
              name="question_per_page"
              options={questionPerPagedata}
              onChange={(value) =>
                handleSelectChange(value, "question_per_page")
              }
              placeholder="Questions Per Page"
              value={formData.question_per_page}
              // defaultValue={defaultValuePage }
              // defaultValue={{value: 5, label: 5}}
            />
            {errors.question_per_page && (
              <div className="text-danger">{errors.question_per_page}</div>
            )}
          </div>
        </div>

        <div className="generalsetting_field">
          <div className="form-group">
            <Form.Label>
              Hide Outcome(s)<sup>*</sup>
              <OverlayTrigger
                overlay={
                  <Tooltip id="tooltip-disabled">
                    Hides the Outcome Title and Description while taking Survey
                  </Tooltip>
                }
              >
                <span className="d-inline-block">
                  <em
                    disabled
                    style={{ pointerEvents: "none" }}
                    className="icon-info-circle"
                  />
                </span>
              </OverlayTrigger>
            </Form.Label>
            <SelectField
              name="isHideOutcome"
              options={defaultOptions}
              onChange={(value) => handleSelectChange(value, "isHideOutcome")}
              placeholder="Hide Outcome(s)"
              value={formData?.isHideOutcome}
            />
            {errors.isHideOutcome && (
              <div className="text-danger">{errors.isHideOutcome}</div>
            )}
          </div>
        </div>
      </div>

      <SurveyTextModel
        show={showText}
        onClose={textClose}
        initialData={{
          surveyText: formData?.surveyLanguageText,
        }}
        handleSurveytext={handleSurveytext}
        validation={validationTextPopup()}
      />
    </div>
  );
};

export default forwardRef(GeneralSettings);
