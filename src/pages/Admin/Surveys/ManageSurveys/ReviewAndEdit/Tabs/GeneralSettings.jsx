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
  { defaultOptions, responseScore, companyID, userData, reviewData, survey },
  ref
) => {
  // State to store form values
  const [formData, setFormData] = useState({
    assessment_language: "English",
    response_slider: "",
    question_limit: "",
    randomize_question: "",
    response_score_range: "",
    question_per_page: "",
    survey_status: "",
    surveyLanguageText: "Skip for now",
    isHideOutcome: false,
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
    survey_status: "",
  });

  const [questionPerPagedata, setQuestionPerPagedata] = useState([]);

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

  // text modal
  const [showText, setshowText] = useState(false);
  const textClose = () => setshowText(false);
  const textShow = () => setshowText(true);

  const fetchQuestionPerPage = async () => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.getQuestionPerPage,
      queryParams: { companyMasterID: userData?.companyMasterID },
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
        }))
      );

      setFormData((prevData) => ({
        ...prevData,
        assessment_language: reviewData?.survey_details?.surveyLanguage,
        response_slider: reviewData?.survey_details?.isResponseSlider,
        question_limit: reviewData?.survey_details?.questionLimit,
        randomize_question: reviewData?.survey_details?.isRandomizeQuestion,
        response_score_range: extendedResponseScore.find(
          ({ value }) => value === reviewData?.survey_details?.responseScoreID
        ),
        question_per_page: reviewData?.survey_details?.questionPerPage,
        surveyLanguageText: reviewData?.survey_details?.surveyLanguageText,
        isHideOutcome: reviewData?.survey_details?.isHideOutcome,
        survey_status: reviewData?.survey_details?.surveyStatus,
      }));

      if (reviewData?.survey_details?.responseScoreID === -1) {
        // Use parseFloat to handle decimal strings like ".0000" and default to 0 if null/undefined
        const start = parseFloat(reviewData?.response_range?.rangeStart ?? "0");
        const end = parseFloat(reviewData?.response_range?.rangeEnd ?? "0");
        setCustomResponseScore({
          ...customResponseScore,
          rangeStart: start,
          rangeEnd: end,
        });
      }
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    if (companyID) {
      // fetchQuestionLimit();
      fetchQuestionPerPage();
    }
  }, [companyID, responseScore?.length]);

  // Validate all fields on submit
  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (formData.response_slider === "") {
      newErrors.response_slider = "Default Response View As Slider is required";
      valid = false;
    }

    if (!formData.question_limit) {
      newErrors.question_limit = "Question Limit is required";
      valid = false;
    }

    if (formData.randomize_question === "") {
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

    if (formData.question_per_page === "") {
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
    const { value } = selectedOption;
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

  const handleSelectChangeResponseRange = (selectedOption, name) => {
    const value = selectedOption;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

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

  // Forward the ref and expose handleSubmit
  useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const handleSurveytext = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      surveyLanguageText: value.surveyText,
    }));
  };

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
    setCustomResponseScore({
      rangeStart: name === "From" ? value : customResponseScore.rangeStart,
      rangeEnd: name === "To" ? value : customResponseScore.rangeEnd,
    });
  };

  return (
    <div className="generalsettings-container">
      <div className="pageTitle">
        <h2 className="d-flex">
          <span className="flex-grow-1">General Settings</span>
          <span className="blueStatus">
            Status:{" "}
            <span className="text-uppercase"> {formData.survey_status} </span>{" "}
          </span>
        </h2>
      </div>
      <div className="generalsetting_inner flex-wrap gap-2">
        {/* Survey Text Selection */}
        <div className="generalsetting_field">
          <div className="form-group">
            <Form.Label>
              Survey Text<sup>*</sup>
              <Link onClick={(e) => e.preventDefault()}>
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
                    onClick={handleChange}
                  />
                  <Form.Check
                    controlid="navigation"
                    inline
                    label="Navigation Shows Icon Only"
                    name="assessment_language"
                    type={type}
                    value="Others"
                    checked={formData.assessment_language === "Others"}
                    onClick={handleChange}
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
              name="response_slider"
              id="response_slider"
              options={defaultOptions}
              placeholder="Default Response"
              onChange={(value) => handleSelectChange(value, "response_slider")}
              value={defaultOptions.find(
                ({ value }) => value === formData?.response_slider
              )}
              isDisabled={formData.survey_status !== "Design"}
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
              disabled={
                // eslint-disable-next-line eqeqeq
                formData.question_limit == -1 ||
                formData.survey_status !== "Design"
              }
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
              name="randomize_question"
              id="randomize_question"
              options={defaultOptions}
              placeholder="Randomize Questions"
              //   onChange={handleChange}
              onChange={(value) =>
                handleSelectChange(value, "randomize_question")
              }
              value={defaultOptions.find(
                ({ value }) => value === formData?.randomize_question
              )}
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
                handleSelectChangeResponseRange(value, "response_score_range")
              }
              value={formData?.response_score_range}
              isDisabled={survey?.status !== "Design"}
            />

            {errors.response_score_range && (
              <div className="text-danger">{errors.response_score_range}</div>
            )}
          </div>
          {formData?.response_score_range?.value === -1 && (
            <div style={{ display: "flex", gap: "5px" }}>
              <div className="form-group">
                <InputField
                  type="text"
                  placeholder="From"
                  name="From"
                  value={customResponseScore?.rangeStart}
                  onChange={handleCustomRange}
                  onBlur={handleBlurCustomRange}
                />
              </div>
              <div className="form-group">
                <InputField
                  type="text"
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
              id="question_per_page"
              name="question_per_page"
              options={questionPerPagedata}
              onChange={(value) =>
                handleSelectChange(value, "question_per_page")
              }
              placeholder="Questions Per Page"
              value={questionPerPagedata.find(
                ({ value }) => value === formData?.question_per_page
              )}
            />
            {errors.question_per_page && (
              <div className="text-danger">{errors.question_per_page}</div>
            )}
          </div>
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
            id="isHideOutcome"
            name="isHideOutcome"
            options={defaultOptions}
            onChange={(value) => handleSelectChange(value, "isHideOutcome")}
            value={defaultOptions.find(
              ({ value }) => value === formData?.isHideOutcome
            )}
            placeholder="Hide Outcome(s)"
          />
          {errors.isHideOutcome && (
            <div className="text-danger">{errors.isHideOutcome}</div>
          )}
        </div>
      </div>
      {showText && (
        <SurveyTextModel
          show={showText}
          onClose={textClose}
          initialData={{
            surveyText: formData?.surveyLanguageText,
          }}
          handleSurveytext={handleSurveytext}
          validation={validationTextPopup()}
        />
      )}
    </div>
  );
};

export default forwardRef(GeneralSettings);
