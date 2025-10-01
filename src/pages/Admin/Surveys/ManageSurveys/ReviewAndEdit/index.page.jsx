import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import { commonService } from "services/common.service";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { COMPANY_MANAGEMENT } from "apiEndpoints/OrgStructure/OrgStructure.dashboard";
import { showErrorToast } from "helpers/toastHelper";
import {
  Button,
  SweetAlert,
  Breadcrumb,
  Loader,
  ImageElement,
} from "../../../../../components";
import adminRouteMap from "../../../../../routes/Admin/adminRouteMap";

import {
  initValuesFAQ,
  initValuesFindAndReplace,
  initValuesHelpContent,
  validationFAQ,
  validationfindAndReplace,
  validationHelpContact,
} from "./validation";
import SurveyHelpContactModel from "./ModelComponent/surveyHelpContactForm";
import SurveyDepartmentModel from "./ModelComponent/surveyDepartmentForm";
import useAuth from "../../../../../customHooks/useAuth/index";
import SurveyFindAndReplaceModel from "./ModelComponent/findAndReplace";
import {
  SurveyForm,
  GeneralSettings,
  ScalarConfiguration,
  SystemGeneratedEmails,
  ParticipationTools,
} from "./Tabs";
import SurveyFAQModel from "./ModelComponent/surveyFAQForm";
import SurveyFromExistingModel from "../CreateSurvey/ModelComponent/SurveyFromExisting/SurveyFromExistingModel";
import { useSurveyDataOnNavigations } from "../../../../../customHooks";

export default function CreateSurvey() {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  let navigate = useNavigate();

  const [question, setQuestion] = useState();
  const { getSurveyDataOnNavigate } = useSurveyDataOnNavigations();
  const surevyData = getSurveyDataOnNavigate();

  const [surveyID] = useState(surevyData?.survey?.survey_id);

  const [surveyStatus, setSurveyStatus] = useState(null);

  const { dispatcSurveyDataOnNavigateData } = useSurveyDataOnNavigations();

  const location = useLocation();

  const survey = location.state?.survey || null; // Use optional chaining

  const [formData, setFormData] = useState({
    companyID: "",
    surveyName: "",
    assessment_language: "",
    response_slider: "",
    question_limit: "",
    randomize_question: "",
    response_score_range: "",
    question_per_page: "",
    surveyLanguageText: "",

    summary_report_name: "",
    summary_opening_comment: "",
    summary_closing_comment: "",
    summary_chart_type: "",
    summary_legend_position: "",
    summary_font_size: 8,
    summary_data_label: "",
    summary_scalar_opacity: 10,
    summary_switch_axis: false,
    summary_db_color: "",
    summaryColorPaletteID: "",

    detail_report_name: "",
    report_detail_opening_comment: "",
    report_detail_closing_comment: "",

    detail_chart_type: "",
    detail_legend_position: "",
    detail_font_size: 8,
    detail_data_label: "",
    detail_scalar_opacity: 10,
    detail_switch_axis: false,
    detail_db_color: "",
    detailedColorPaletteID: "",
    status: "",
    createdAt: "",
    currentColorPallet: {},
    scalarConfiguration: [],
    pre_start_email_subject: "",
    pre_start_email_header: "",
    pre_start_email_content: "",
    assign_email_subject_line: "",
    assign_email_header_graphic: "",
    assign_email_pre_credential_content: "",
    assign_email_post_credential_content: "",
    reminder_email_subject_line: "",
    reminder_email_header_graphic: "",
    reminder_email_content: "",
    thank_you_email_subject_line: "",
    thank_you_email_header_graphic: "",
    thank_you_email_content: "",
    email_footer: "",

    faq: [],
    helpContent: [],
    participationTool: [],
    introduction: "",
    isHideOutcome: false,
  });

  const [companyOptions, setCompanyOptions] = useState([]);
  const [isEditableFlag, setIsEditableFlag] = useState(false);

  const [showAddDep, setShowAddDep] = useState(false);
  const adddepClose = () => setShowAddDep(false);

  // edit modal
  const [showEditDep, setShowEditDep] = useState(false);
  const editdepClose = () => setShowEditDep(false);

  // edit FAQ modal
  const [showeditFaq, setshoweditFaq] = useState(false);
  const editfaqClose = () => setshoweditFaq(false);
  const editfaqShow = () => setshoweditFaq(true);

  // add help contact modal
  const [showaddContact, setshowContact] = useState(false);
  const addcontactClose = () => setshowContact(false);
  const addcontactShow = () => setshowContact(true);

  // edit help contact modal
  const [showeditContact, setshoweditContact] = useState(false);
  const editcontactClose = () => setshoweditContact(false);
  const editcontactShow = () => setshoweditContact(true);

  // preview question modal
  const [showfindReplace, setshowfindReplace] = useState(false);
  const findReplaceClose = () => setshowfindReplace(false);

  // Create Existing Modal
  const [showcreateExisting, setshowcreateExisting] = useState(false);
  const createExistingShow = () => setshowcreateExisting(true);

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingPublish, setIsSubmittingPublish] = useState(false);

  const [responseScore, setResponseScore] = useState([]);
  const [score, setScore] = useState({});

  const [showLoader, setShowLoader] = useState(true);
  const [reviewData, setReviewData] = useState({});
  // const [updateandGotoQuestionSubmitting , setUpdateandGotoQuestionSubmitting] = useState(false);
  const publishOtherDisplayMode = true;
  let updateandGotoQuestionClicked = false;

  const findReplaceShow = () => setshowfindReplace(true);

  // In this form, we manage custom validations and handle the submit using refs. Initially, we tried to manage this form using Formik, but the performance of the validations was poor, so we had to move to custom validations.
  const handleSurveyRef = useRef();
  const handleGeneralSettingRef = useRef();
  const handleScalerConfigRef = useRef();
  const handlesystemGeneratedEmailsRef = useRef();
  const handletoolsTabRef = useRef();

  const deleteModal = () => {
    setIsAlertVisible(true);
  };

  const [activeTab, setActiveTab] = useState("surveyInfoTab");
  const [defaultOptions] = useState([
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ]);

  const [confettiOptopn] = useState([
    { value: "none", label: "None" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
    { value: "left", label: "Left" },
  ]);
  const [startColorOptopn] = useState([
    { value: "none", label: "None" },
    { value: "golden", label: "Golden" },
    { value: "red", label: "Red" },
    { value: "green", label: "Green" },
    { value: "blue", label: "Blue" },
    { value: "purple", label: "Purple" },
  ]);
  const [chartTypeOptions] = useState([
    { value: "column", label: "Column", refValue: 1 },
    { value: "line", label: "Line", refValue: 3 },
    { value: "bar", label: "Bar", refValue: 2 },
    // { value: "mixed", label: "Combo" },
    { value: "radar", label: "Spider", refValue: 6 },
    { value: "scatter", label: "Scatter", refValue: 5 },
  ]);

  const [legendOptions] = useState([
    { value: "left", label: "Left", refValue: 3 },
    { value: "right", label: "Right", refValue: 2 },
    { value: "bottom", label: "Bottom", refValue: 1 },
    { value: "hidden", label: "Hidden", refValue: 4 },
  ]);

  const [dataLabelOptions] = useState([
    { value: "top", label: "Top", refValue: 1 },
    { value: "bottom", label: "Bottom", refValue: 3 },
    { value: "center", label: "Center", refValue: 2 },
    { value: "none", label: "None", refValue: 4 },
  ]);

  const [fontSizeOptions] = useState([
    { value: 8, label: "8", refValue: 1 },
    { value: 10, label: "10", refValue: 2 },
    { value: 12, label: "12", refValue: 3 },
    { value: 14, label: "14", refValue: 4 },
    { value: 16, label: "16", refValue: 5 },
    // { value: 18, label: "18" },
    // { value: 20, label: "20" },
  ]);

  const sectionRefs = {
    surveyInfoTab: useRef(null),
    generalSettingTab: useRef(null),
    scalarConfigTab: useRef(null),
    systemmailTab: useRef(null),
    toolsTab: useRef(null),
  };

  const sectionIds = Object.keys(sectionRefs);

  // Add this state
  const [hasClicked, setHasClicked] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let timeoutId = null;
    let lastActiveTab = activeTab;
    let scrollTimeoutId = null;

    const handleScroll = () => {
      // Reset hasClicked after user starts scrolling
      if (hasClicked) {
        if (scrollTimeoutId) {
          clearTimeout(scrollTimeoutId);
        }
        scrollTimeoutId = setTimeout(() => {
          setHasClicked(false);
        }, 1000); // Reset after 1 second of no scrolling
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        // Skip if we're in the middle of a click or hovering
        if (hasClicked || isHovering) return;

        // If we're at the top of the page, make surveyInfoTab active
        if (window.scrollY < 50) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          timeoutId = setTimeout(() => {
            setActiveTab("surveyInfoTab");
            lastActiveTab = "surveyInfoTab";
          }, 250);
          return;
        }

        // Find the most visible section
        let mostVisible = null;
        let maxRatio = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            mostVisible = entry.target.id;
            maxRatio = entry.intersectionRatio;
          }
        });

        // If we found a visible section and it's visible enough
        if (mostVisible && maxRatio > 0.1) {
          // Lowered threshold
          // Clear any existing timeout
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          // Only update if the tab is different from the last active tab
          if (mostVisible !== lastActiveTab) {
            timeoutId = setTimeout(() => {
              setActiveTab(mostVisible);
              lastActiveTab = mostVisible;
            }, 250); // Increased debounce to 250ms
          }
        }
      },
      {
        root: null,
        threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: "0px", // Use full viewport for intersection
      }
    );

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Wait for refs to be available
    const validSections = sectionIds
      .map((id) => sectionRefs[id]?.current)
      .filter(Boolean);

    if (validSections.length !== sectionIds.length) {
      return;
    }

    validSections.forEach((section) => observer.observe(section));

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (scrollTimeoutId) {
        clearTimeout(scrollTimeoutId);
      }
      window.removeEventListener("scroll", handleScroll);
      validSections.forEach((section) => observer.unobserve(section));
    };
  }, [sectionRefs, sectionIds, hasClicked, activeTab, isHovering]);

  // Add hover handler function
  const handleFieldHover = (event) => {
    // Find the closest section parent
    const section = event.target.closest('[id$="Tab"]');
    if (section) {
      setIsHovering(true);
      setActiveTab(section.id);
    }
  };

  const handleFieldLeave = () => {
    setIsHovering(false);
  };

  const validateParticipationTools = () => {
    const returnData = handletoolsTabRef.current.handleSubmit();
    if (returnData?.isValid) {
      setFormData((prev) => ({
        ...prev,
        faq: returnData?.data?.faq,
        helpContent: returnData?.data?.helpContent,
        participationTool: returnData?.data?.participationTool,
        introduction: returnData?.data?.partipation_introduction,
      }));
      return true;
    }
    // Scroll to the participation tools section if validation fails
    const toolsSection = document.getElementById("toolsTab");
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return false;
  };

  const validateSystemGeneratedEmails = () => {
    const returnData = handlesystemGeneratedEmailsRef.current.handleSubmit();
    if (returnData?.isValid) {
      setFormData((prev) => ({
        ...prev,
        pre_start_email_subject: returnData?.data?.pre_start_email_subject,
        pre_start_email_header: returnData?.data?.pre_start_email_header,
        pre_start_email_content: returnData?.data?.pre_start_email_content,
        assign_email_subject_line: returnData?.data?.assign_email_subject_line,
        assign_email_header_graphic:
          returnData?.data?.assign_email_header_graphic,
        assign_email_pre_credential_content:
          returnData?.data?.assign_email_pre_credential_content,
        assign_email_post_credential_content:
          returnData?.data?.assign_email_post_credential_content,
        reminder_email_subject_line:
          returnData?.data?.reminder_email_subject_line,
        reminder_email_header_graphic:
          returnData?.data?.reminder_email_header_graphic,
        reminder_email_content: returnData?.data?.reminder_email_content,
        thank_you_email_subject_line:
          returnData?.data?.thank_you_email_subject_line,
        thank_you_email_header_graphic:
          returnData?.data?.thank_you_email_header_graphic,
        thank_you_email_content: returnData?.data?.thank_you_email_content,
        email_footer: returnData?.data?.email_footer,
      }));
      return true;
    }
    // Scroll to the system generated emails section if validation fails
    const systemEmailsSection = document.getElementById("systemmailTab");
    if (systemEmailsSection) {
      systemEmailsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    return false;
  };

  const validateScalarConfig = () => {
    const returnData = handleScalerConfigRef.current.handleSubmit();
    if (returnData?.isValid) {
      setFormData((prev) => ({
        ...prev,
        summary_report_name: returnData?.data?.summary_report_name,
        summary_opening_comment: returnData?.data?.summary_opening_comment,
        summary_closing_comment: returnData?.data?.summary_closing_comment,
        summary_chart_type: returnData?.data?.summary_chart_type,
        summary_legend_position: returnData?.data?.summary_legend_position,
        summary_font_size: returnData?.data?.summary_font_size,
        summary_data_label: returnData?.data?.summary_data_label,
        summary_scalar_opacity: returnData?.data?.summary_scalar_opacity,
        summary_switch_axis: returnData?.data?.summary_switch_axis,
        summary_db_color: returnData?.data?.summary_db_color,
        detail_report_name: returnData?.data?.detail_report_name,
        report_detail_opening_comment:
          returnData?.data?.report_detail_opening_comment,
        report_detail_closing_comment:
          returnData?.data?.report_detail_closing_comment,
        detail_chart_type: returnData?.data?.detail_chart_type,
        detail_legend_position: returnData?.data?.detail_legend_position,
        detail_font_size: returnData?.data?.detail_font_size,
        detail_data_label: returnData?.data?.detail_data_label,
        detail_scalar_opacity: returnData?.data?.detail_scalar_opacity,
        detail_switch_axis: returnData?.data?.detail_switch_axis,
        detail_db_color: returnData?.data?.detail_db_color,
        currentColorPallet: returnData?.data?.currentColorPallet,
        scalarConfiguration: returnData?.data?.scalarConfiguration,
        summaryColorPaletteID: returnData?.data?.summaryPaletteID,
        detailedColorPaletteID: returnData?.data?.detailPaletteID,
        summaryColorsData: JSON.stringify(
          returnData?.data?.summaryColorPallet?.colors
        ),
        detailedColorsData: JSON.stringify(
          returnData?.data?.detailColorPallet?.colors
        ),
      }));
      return true;
    }
    // Scroll to the scalar config section if validation fails
    const scalarConfigSection = document.getElementById("scalarConfigTab");
    if (scalarConfigSection) {
      scalarConfigSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    return false;
  };

  const validateGeneralSettings = () => {
    const returnData = handleGeneralSettingRef.current.handleSubmit();
    if (returnData?.isValid) {
      setFormData((prev) => ({
        ...prev,
        assessment_language: returnData?.data?.assessment_language,
        response_slider: returnData?.data?.response_slider,
        question_limit: returnData?.data?.question_limit,
        randomize_question: returnData?.data?.randomize_question,
        response_score_range: returnData?.data?.response_score_range,
        question_per_page: returnData?.data?.question_per_page,
        enable_participant_demographics:
          returnData?.data?.enable_participant_demographics,
        enable_dynamic_filter: returnData?.data?.enable_dynamic_filter,
        enable_open_ended_questions:
          returnData?.data?.enable_open_ended_questions,
        surveyLanguageText: returnData?.data?.surveyLanguageText,
        isHideOutcome: returnData?.data?.isHideOutcome,
      }));
      return true;
    }
    // Scroll to the general settings section if validation fails
    const generalSettingsSection = document.getElementById("generalSettingTab");
    if (generalSettingsSection) {
      generalSettingsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    return false;
  };

  const validateSurveyInfo = () => {
    const returnData = handleSurveyRef.current.handleSubmit();
    if (returnData?.isValid) {
      setFormData((prev) => ({
        ...prev,
        companyID: returnData?.data?.companyID,
        surveyName: returnData?.data?.surveyName,
      }));
      return true;
    }
    // Scroll to the survey info section if validation fails
    const surveyInfoSection = document.getElementById("surveyInfoTab");
    if (surveyInfoSection) {
      surveyInfoSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return false;
  };

  const handleTabClick = (tabId) => {
    if (activeTab === "surveyInfoTab" && tabId !== "final") {
      // Validate survey info before allowing navigation
      if (!validateSurveyInfo()) {
        return;
      }
    }

    if (activeTab === "generalSettingTab" && tabId !== "final") {
      // Validate general settings before allowing navigation
      if (!validateGeneralSettings()) {
        return;
      }
    }

    if (activeTab === "scalarConfigTab" && tabId !== "final") {
      // Validate scalar configuration before allowing navigation
      if (!validateScalarConfig()) {
        return;
      }
    }

    if (activeTab === "systemmailTab" && tabId !== "final") {
      // Validate system generated emails before allowing navigation
      if (!validateSystemGeneratedEmails()) {
        return;
      }
    }

    if (activeTab === "toolsTab" && tabId !== "final") {
      // Validate participation tools before allowing navigation
      if (!validateParticipationTools()) {
        return;
      }
    }

    // Set the active tab
    setActiveTab(tabId);
    setHasClicked(true);

    // Scroll to the target section after a short delay to ensure DOM updates
    setTimeout(() => {
      const targetSection = document.getElementById(tabId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // const handleUpdateandGotoQuestion = () => {
  //   updateandGotoQuestionClicked = true;
  //   handleTabClick("final");
  // };

  // API Calling
  const fetchSurveySupportData = async (type, path) => {
    const surveyVal = survey?.survey_id ?? surveyID;
    const response = await commonService({
      apiEndPoint: path,
      queryParams: {
        companyID: surveyVal.companyID ?? "",
        companyMasterID: surveyVal.companyMasterID ?? "",
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      if (type === "responseScore") {
        setResponseScore(
          response?.data?.responseScoreRange?.map((item) => ({
            value: item.rangeID,
            label: `${item.rangeStart} to ${item.rangeEnd}`,
          }))
        );
      }

      if (type === "score") {
        setScore(response?.data?.scalar);
      }
    }
  };

  const fetchSurvey = async (surveyID) => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.getEditSurvey,
      queryParams: { surveyID },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      // SURVEY LANGUAGE TEXT IS SHOWING UNDEFINED IN THE API RESPONSE
      setShowLoader(false);
      setReviewData(response?.data);
      setSurveyStatus(response.data.survey_details.surveyStatus);
      setFormData((prev) => ({
        ...prev,
        companyID: response?.data?.survey_details?.companyID,
        status: response?.data?.survey_details?.surveyStatus,
        createdAt: response?.data?.survey_details?.createdAt,
      }));
    }
  };

  const fetchQuestionData = async (surveyID) => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.getQuestionSurvey,
      queryParams: { surveyID },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    setQuestion({
      rating: response?.data?.rating,
      rboeq: response?.data?.rboeq,
      oeq: response?.data?.oeq,
      demographic: response?.data?.demographic,
      demographicBranch: response?.data?.demographicBranch,
      nested: response?.data?.nested,
      multiResponse: response?.data?.multiResponse,
      gate: response?.data?.gate,
    });
  };

  function getResponseScoreRangeDetails(responseScoreRange) {
    // Extract the label, and parse min and max values from it
    const { label, value } = responseScoreRange;
    if (value === -1) {
      return {
        label,
        minValue: responseScoreRange.customResponse.rangeStart,
        maxValue: responseScoreRange.customResponse.rangeEnd,
      };
    }
    const [minValue, maxValue] = label
      .split("to")
      .map((v) => parseInt(v.trim(), 10));

    return {
      label,
      minValue,
      maxValue,
    };
  }

  function transformScalarData(scalarArray) {
    const scalarSequence = [];
    const scalarName = [];
    const scalarMinValue = [];
    const scalarMaxValue = [];
    const scalarColor = [];

    scalarArray.forEach((scalar) => {
      scalarSequence.push(scalar.add_scalar_sequence);
      scalarName.push(scalar.add_scalar_name);
      scalarMinValue.push(scalar.add_scalar_min_value);
      scalarMaxValue.push(scalar.add_scalar_max_value);
      scalarColor.push(scalar.add_scalar_color);
    });

    return {
      scalarSequence,
      scalarName,
      scalarMinValue,
      scalarMaxValue,
      scalarColor,
    };
  }

  function transformFAQData(faqArray) {
    const transformedData = {
      faqTitle: [],
      faqDescription: [],
    };

    faqArray.forEach((faq) => {
      transformedData.faqTitle.push(faq.faq_title);
      transformedData.faqDescription.push(faq.faq_description);
    });

    return transformedData;
  }

  function transformContactData(contactArray) {
    const transformedData = {
      contactTitle: [],
      contactDescription: [],
    };

    contactArray.forEach((contact) => {
      transformedData.contactTitle.push(contact.help_title);
      transformedData.contactDescription.push(contact.help_description);
    });

    return transformedData;
  }

  function transformConfettiData(confettiArray) {
    const transformedData = {
      confettiNo: [],
      confettiPercentage: [],
      confettiMessage: [],
      confetti: [],
      confettiTime: [],
      confettiFireworks: [],
      confettiSound: [],
      confettiStarColor: [],
      confettiStar: [],
    };

    confettiArray.forEach((confetti, idx) => {
      transformedData.confettiNo.push(
        parseInt(
          !confetti.confetti_serial_no || confetti.confetti_serial_no === NaN
            ? idx + 1
            : confetti.confetti_serial_no
        )
      );
      transformedData.confettiPercentage.push(`${confetti.percentage} %`);
      transformedData.confettiMessage.push(confetti.message);
      transformedData.confetti.push(confetti.confetti);
      transformedData.confettiTime.push(confetti.time_in_sec ?? 0);
      transformedData.confettiFireworks.push(confetti.fireworks);
      transformedData.confettiSound.push(confetti.sound);
      transformedData.confettiStarColor.push(confetti.star_color ?? "none");
      transformedData.confettiStar.push(confetti.star);
    });

    return transformedData;
  }

  // Validator for Email Configuration data
  const validateEmailData = (data) => {
    // Assign Email
    if (
      !data.assign_email_subject_line ||
      !data.assign_email_pre_credential_content ||
      !data.assign_email_post_credential_content
    ) {
      showErrorToast("Assign subject and content are required");
      return false;
    }
    // Reminder Email
    if (!data.reminder_email_subject_line || !data.reminder_email_content) {
      showErrorToast("Reminder subject and content are required");
      return false;
    }
    // Thank you Email
    if (!data.thank_you_email_subject_line || !data.thank_you_email_content) {
      showErrorToast("Thank you subject and content are required");
      return false;
    }
    return true;
  };

  // FAQ API Calling
  /**
   * Handle form submission Survey Creation
   * @param {Object} values - form values
   * @param {Object} {resetForm} - form reset function
   * @returns {Promise<void>}
   */

  const chartRefValue = (cValue) => {
    const selChart = chartTypeOptions.find((ele) => ele.value === cValue);
    if (selChart) {
      return selChart.refValue;
    } else {
      return 2;
    }
  };

  const legendRefValue = (cValue) => {
    const selLegent = legendOptions.find((ele) => ele.value === cValue);
    if (selLegent) {
      return selLegent.refValue;
    } else {
      return 1;
    }
  };

  const fontSizeRefValue = (cValue) => {
    const selFontSize = fontSizeOptions.find((ele) => ele.value === cValue);
    if (selFontSize) {
      return selFontSize.refValue;
    } else {
      return 1;
    }
  };

  const dataLabelRefValue = (cValue) => {
    const selDataLabel = dataLabelOptions.find((ele) => ele.value === cValue);
    if (selDataLabel) {
      return selDataLabel.refValue;
    } else {
      return 1;
    }
  };
  const handleSubmit = async (finalObj) => {
    try {
      // Check if all input fields for email data present before making API call
      if (!validateEmailData(finalObj)) return;

      setIsSubmitting(true);

      let payload = {
        surveyID: survey?.survey_id ?? surveyID,
        companyMasterID: String(userData?.companyMasterID),
        companyID: finalObj?.companyID,
        surveyName: finalObj?.surveyName,
        surveyLanguage: finalObj?.assessment_language,
        surveyLanguageText: finalObj?.surveyLanguageText,
        isResponseSlider: finalObj?.response_slider,
        questionLimit: finalObj?.question_limit,
        isRandomizeQuestion: finalObj?.randomize_question,
        responseScoreRange: finalObj?.response_score_range?.value,
        rangeFrom: getResponseScoreRangeDetails(finalObj?.response_score_range)
          ?.minValue,
        rangeTo: getResponseScoreRangeDetails(finalObj?.response_score_range)
          ?.maxValue,
        questionPerPage: finalObj?.question_per_page,
        "scalarSequence[]": transformScalarData(finalObj?.scalarConfiguration)
          ?.scalarSequence,
        "scalarName[]": transformScalarData(finalObj?.scalarConfiguration)
          ?.scalarName,
        "scalarMinValue[]": transformScalarData(finalObj?.scalarConfiguration)
          ?.scalarMinValue,
        "scalarMaxValue[]": transformScalarData(finalObj?.scalarConfiguration)
          ?.scalarMaxValue,
        "scalarColor[]": transformScalarData(finalObj?.scalarConfiguration)
          ?.scalarColor,
        colorPaletteID: finalObj?.currentColorPallet?.colorPaletteID,
        summaryReportName: finalObj?.summary_report_name,
        summaryOpeningComment: finalObj?.summary_opening_comment,
        summaryClosingComment: finalObj?.summary_closing_comment,
        summaryChartType: chartRefValue(finalObj?.summary_chart_type.value),
        summaryChartLegendPosition: legendRefValue(
          finalObj?.summary_legend_position.value
        ),
        summaryChartAxis: finalObj?.summary_switch_axis,
        summaryChartDataLabelPosition: dataLabelRefValue(
          finalObj?.summary_data_label.value
        ),
        summaryChartFontSize: fontSizeRefValue(
          finalObj?.summary_font_size.value
        ),
        summaryChartDataLabelColor: finalObj?.summary_db_color,
        summaryChartScalarOpacity: finalObj?.summary_scalar_opacity,
        summaryColorsData: JSON.stringify(finalObj?.summaryColorsData),
        summaryColorPaletteID: finalObj?.summaryColorPallet?.colorPaletteID,

        detailedReportName: finalObj?.detail_report_name,
        detailedOpeningComment: finalObj?.report_detail_opening_comment,
        detailedClosingComment: finalObj?.report_detail_closing_comment,
        detailedChartType: chartRefValue(finalObj?.detail_chart_type.value),
        detailedChartLegendPosition: legendRefValue(
          finalObj?.detail_legend_position.value
        ),
        detailedChartAxis: finalObj?.detail_switch_axis,
        detailedChartScalarOpacity: finalObj?.detail_scalar_opacity,
        detailedChartDataLabelPosition: dataLabelRefValue(
          finalObj?.detail_data_label.value
        ),
        detailedChartFontSize: fontSizeRefValue(
          finalObj?.detail_font_size.value
        ),
        detailedChartDataLabelColor: finalObj?.detail_db_color,
        detailedColorsData: JSON.stringify(finalObj?.detailedColorsData),
        detailedColorPaletteID: finalObj?.detailColorPallet?.colorPaletteID,

        emailPreStartSubject: finalObj?.pre_start_email_subject,
        emailPreStartHeader: finalObj?.pre_start_email_header || "",
        emailPreStartContent: finalObj?.pre_start_email_content,
        emailAssignSubject: finalObj?.assign_email_subject_line,
        emailAssignHeader: finalObj?.assign_email_header_graphic || "",
        emailAssignPreContent: finalObj?.assign_email_pre_credential_content,
        emailAssignPostContent: finalObj?.assign_email_post_credential_content,
        emailReminderSubject: finalObj?.reminder_email_subject_line,
        emailReminderHeader: finalObj?.reminder_email_header_graphic || "",
        emailReminderContent: finalObj?.reminder_email_content,
        emailThankYouSubject: finalObj?.thank_you_email_subject_line,
        emailThankYouHeader: finalObj?.thank_you_email_header_graphic || "",
        emailThankYouContent: finalObj?.thank_you_email_content,
        emailFooter: finalObj?.email_footer,
        introduction: finalObj?.partipation_introduction,

        "faqTitle[]": transformFAQData(finalObj?.faq)?.faqTitle,
        "faqDescription[]": transformFAQData(finalObj?.faq)?.faqDescription,
        "contactTitle[]": transformContactData(finalObj?.helpContent)
          ?.contactTitle,
        "contactDescription[]": transformContactData(finalObj?.helpContent)
          ?.contactDescription,
        "confettiNo[]": transformConfettiData(finalObj?.participationTool)
          ?.confettiNo,
        "confettiPercentage[]": transformConfettiData(
          finalObj?.participationTool
        )?.confettiPercentage,
        "confettiMessage[]": transformConfettiData(finalObj?.participationTool)
          ?.confettiMessage,
        "confetti[]": transformConfettiData(finalObj?.participationTool)
          ?.confetti,
        "confettiTime[]": transformConfettiData(finalObj?.participationTool)
          ?.confettiTime,
        "confettiFireworks[]": transformConfettiData(
          finalObj?.participationTool
        )?.confettiFireworks,
        "confettiSound[]": transformConfettiData(finalObj?.participationTool)
          ?.confettiSound,
        "confettiStarColor[]": transformConfettiData(
          finalObj?.participationTool
        )?.confettiStarColor,
        "confettiStar[]": transformConfettiData(finalObj?.participationTool)
          ?.confettiStar,
        isHideOutcome: finalObj?.isHideOutcome,
      };

      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.upDateSurvay,
        bodyData: payload,
        isFormData: true,
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: "Survey Update Successfully",
          error: "survey failed",
        },
      });
      if (response.status) {
        if (updateandGotoQuestionClicked) {
          const copySurvey = survey ?? surevyData?.survey;
          const addValues = {
              ...copySurvey,
              status: formData.status,
              created_at: formData.createdAt,
            }
          dispatcSurveyDataOnNavigateData({
            survey: addValues,
            companyID: reviewData?.survey_details?.companyID,
            rangeStart: reviewData?.response_range?.rangeStart,
            rangeEnd: reviewData?.response_range?.rangeEnd,
          });

          setTimeout(() => {
            navigate(adminRouteMap.QUESTIONSETUP.path, {
              state: {
                survey: addValues,
                companyID: reviewData?.survey_details?.companyID,
                rangeStart: reviewData?.response_range?.rangeStart,
                rangeEnd: reviewData?.response_range?.rangeEnd,
              },
            });
          }, [250]);
        } else {
          // Remove the navigation to MANAGESURVEY
          // navigate(adminRouteMap.MANAGESURVEY.path);
          setIsSubmitting(false);
        }
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log("error", error);
      setIsSubmitting(false);
    }
  };

  const fetchCompanies = async () => {
    const response = await commonService({
      apiEndPoint: COMPANY_MANAGEMENT.getCompanybasic,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setIsEditableFlag(response?.data?.isEditable);
      setCompanyOptions(
        Object?.values(response?.data?.data)?.map((company) => ({
          value: company?.companyID,
          label: company?.companyName,
        }))
      );
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    if (survey || surveyID) {
      const surveyVal = survey?.survey_id ?? surveyID;
      fetchSurveySupportData(
        "responseScore",
        SURVEYS_MANAGEMENT?.getResponseScore
      );
      fetchSurveySupportData("score", SURVEYS_MANAGEMENT?.getScalar);
      fetchSurvey(surveyVal);
      fetchQuestionData(surveyVal);
      fetchCompanies(userData?.companyMasterID);
    }
  }, [isSubmitting]);

  // breadcrumb
  const breadcrumb = [
    {
      path: "",
      name: "Surveys",
    },

    {
      path: `${adminRouteMap.MANAGESURVEY.path}`,
      name: "Manage Surveys",
    },
    {
      path: "#",
      name: "Review Survey",
    },
  ];

  const tabs = [
    {
      id: "surveyInfoTab",
      title: "Survey Info",
      description: "Enter the survey's name.",
    },
    {
      id: "generalSettingTab",
      title: "General Settings",
      description: (
        <>
          Set visibility, access, and <br className="d-xl-block d-none" />{" "}
          response options.
        </>
      ),
    },
    {
      id: "scalarConfigTab",
      title: "Scalar Configuration",
      description: (
        <>
          Customize rating scales and <br className="d-xl-block d-none" />{" "}
          numerical inputs.
        </>
      ),
    },
    {
      id: "systemmailTab",
      title: "System Generated Emails",
      description: (
        <>
          Automate invitations, reminders, <br className="d-xl-block d-none" />{" "}
          and follow-ups.
        </>
      ),
    },
    {
      id: "toolsTab",
      title: "Participation Tools",
      description: (
        <>
          Enhance engagement and <br className="d-xl-block d-none" />
          manage interactions.
        </>
      ),
    },
  ];

  const handleCancel = () => {
    navigate(adminRouteMap.MANAGESURVEY.path);
  };

  const handleCrosswalk = () => {
    const data = {
      surveyID: survey?.survey_id,
      companyID: reviewData?.survey_details?.companyID,
    };

    setTimeout(() => {
      navigate(adminRouteMap.VIEWCROSSWALK.path, { state: data });
    }, [100]);
  };

  const handleDelete = async () => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.deleteSurvey,
      bodyData: {
        surveyID: survey?.survey_id,
      },
      toastType: {
        success: true,
        error: false,
      },
      isToast: false,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      navigate(adminRouteMap.MANAGESURVEY.path);
      return true;
    } else {
      console.log("error");
      return false;
    }
  };

  const onConfirmAlertModal = async () => {
    const result = await handleDelete();
    setIsAlertVisible(false);
    return result;
  };

  const handlePublish = async () => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.publishSurvay,
      bodyData: {
        surveyID: survey?.survey_id,
      },
      toastType: {
        success: false,
        error: false,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      navigate(adminRouteMap.MANAGESURVEY.path);
      return true;
    } else {
      console.log("error");
      return false;
    }
  };

  const onConfirmAlertPublishModal = async () => {
    const result = await handlePublish();
    setIsSubmittingPublish(false);
    return result;
  };

  const publishModal = () => {
    setIsSubmittingPublish(true);
  };

  const handleTopUpdate = () => {
    let finalObj = {};

    const returnDataSurvey = handleSurveyRef.current.handleSubmit();
    if (returnDataSurvey?.isValid) {
      setFormData((prev) => ({
        ...prev,
        companyID: returnDataSurvey?.data?.companyID,
        surveyName: returnDataSurvey?.data?.surveyName,
      }));

      finalObj = {
        ...finalObj,
        companyID: returnDataSurvey?.data?.companyID,
        surveyName: returnDataSurvey?.data?.surveyName,
      };
    } else {
      setActiveTab("surveyInfoTab");
      return;
    }

    const returnDataGeneralSetting =
      handleGeneralSettingRef.current.handleSubmit();
    if (returnDataGeneralSetting?.isValid) {
      finalObj = {
        ...finalObj,
        assessment_language:
          returnDataGeneralSetting?.data?.assessment_language,
        response_slider: returnDataGeneralSetting?.data?.response_slider,
        question_limit: returnDataGeneralSetting?.data?.question_limit,
        randomize_question: returnDataGeneralSetting?.data?.randomize_question,
        response_score_range:
          returnDataGeneralSetting?.data?.response_score_range,
        question_per_page: returnDataGeneralSetting?.data?.question_per_page,
        isHideOutcome: returnDataGeneralSetting?.data?.isHideOutcome,
        surveyLanguageText: returnDataGeneralSetting?.data?.surveyLanguageText,
      };
    } else {
      setActiveTab("generalSettingTab");
      return;
    }

    const returnDataScalerConfig = handleScalerConfigRef.current.handleSubmit();
    if (returnDataScalerConfig?.isValid) {
      finalObj = {
        ...finalObj,
        summary_report_name: returnDataScalerConfig?.data?.summary_report_name,
        summary_opening_comment:
          returnDataScalerConfig?.data?.summary_opening_comment,
        summary_closing_comment:
          returnDataScalerConfig?.data?.summary_closing_comment,
        summary_chart_type: returnDataScalerConfig?.data?.summary_chart_type,
        summary_legend_position:
          returnDataScalerConfig?.data?.summary_legend_position,
        summary_font_size: returnDataScalerConfig?.data?.summary_font_size,
        summary_data_label: returnDataScalerConfig?.data?.summary_data_label,
        summary_scalar_opacity:
          returnDataScalerConfig?.data?.summary_scalar_opacity,
        summary_switch_axis: returnDataScalerConfig?.data?.summary_switch_axis,
        summary_db_color: returnDataScalerConfig?.data?.summary_db_color,
        detail_report_name: returnDataScalerConfig?.data?.detail_report_name,
        report_detail_opening_comment:
          returnDataScalerConfig?.data?.report_detail_opening_comment,
        report_detail_closing_comment:
          returnDataScalerConfig?.data?.report_detail_closing_comment,
        detail_chart_type: returnDataScalerConfig?.data?.detail_chart_type,
        detail_legend_position:
          returnDataScalerConfig?.data?.detail_legend_position,
        detail_font_size: returnDataScalerConfig?.data?.detail_font_size,
        detail_data_label: returnDataScalerConfig?.data?.detail_data_label,
        detail_scalar_opacity:
          returnDataScalerConfig?.data?.detail_scalar_opacity,
        detail_switch_axis: returnDataScalerConfig?.data?.detail_switch_axis,
        detail_db_color: returnDataScalerConfig?.data?.detail_db_color,
        currentColorPallet: returnDataScalerConfig?.data?.currentColorPallet,
        scalarConfiguration: returnDataScalerConfig?.data?.scalarConfiguration,
        summaryColorPaletteID: returnDataScalerConfig?.data?.summaryPaletteID,
        detailedColorPaletteID: returnDataScalerConfig?.data?.detailPaletteID,
        summaryColorsData: JSON.stringify(
          returnDataScalerConfig?.data?.summaryColorPallet?.colors
        ),
        detailedColorsData: JSON.stringify(
          returnDataScalerConfig?.data?.detailColorPallet?.colors
        ),
        summaryColorPallet: returnDataScalerConfig?.data?.summaryColorPallet,
        detailColorPallet: returnDataScalerConfig?.data?.detailColorPallet,
      };
    } else {
      setActiveTab("scalarConfigTab");
      return;
    }

    const returnDataEmails =
      handlesystemGeneratedEmailsRef.current.handleSubmit();
    if (returnDataEmails?.isValid) {
      finalObj = {
        ...finalObj,
        pre_start_email_subject:
          returnDataEmails?.data?.pre_start_email_subject,
        pre_start_email_header: returnDataEmails?.data?.pre_start_email_header,
        pre_start_email_content:
          returnDataEmails?.data?.pre_start_email_content,
        assign_email_subject_line:
          returnDataEmails?.data?.assign_email_subject_line,
        assign_email_header_graphic:
          returnDataEmails?.data?.assign_email_header_graphic,
        assign_email_pre_credential_content:
          returnDataEmails?.data?.assign_email_pre_credential_content,
        assign_email_post_credential_content:
          returnDataEmails?.data?.assign_email_post_credential_content,
        reminder_email_subject_line:
          returnDataEmails?.data?.reminder_email_subject_line,
        reminder_email_header_graphic:
          returnDataEmails?.data?.reminder_email_header_graphic,
        reminder_email_content: returnDataEmails?.data?.reminder_email_content,
        thank_you_email_subject_line:
          returnDataEmails?.data?.thank_you_email_subject_line,
        thank_you_email_header_graphic:
          returnDataEmails?.data?.thank_you_email_header_graphic,
        thank_you_email_content:
          returnDataEmails?.data?.thank_you_email_content,
        email_footer: returnDataEmails?.data?.email_footer,
      };
    } else {
      setActiveTab("systemmailTab");
      return;
    }

    const returnData = handletoolsTabRef.current.handleSubmit();
    if (returnData?.isValid) {
      finalObj = {
        ...finalObj,
        ...returnData?.data,
      };
      handleSubmit(finalObj);
    } else {
      setActiveTab("toolsTab");
    }
  };

  const handleUpdateandGotoQuestion = () => {
    updateandGotoQuestionClicked = true;
    // handleTabClick("final");
    let finalObj = {};

    const returnDataSurvey = handleSurveyRef.current.handleSubmit();
    if (returnDataSurvey?.isValid) {
      setFormData((prev) => ({
        ...prev,
        companyID: returnDataSurvey?.data?.companyID,
        surveyName: returnDataSurvey?.data?.surveyName,
      }));

      finalObj = {
        ...finalObj,
        companyID: returnDataSurvey?.data?.companyID,
        surveyName: returnDataSurvey?.data?.surveyName,
      };
    } else {
      setActiveTab("surveyInfoTab");
      return;
    }

    const returnDataGeneralSetting =
      handleGeneralSettingRef.current.handleSubmit();
    if (returnDataGeneralSetting?.isValid) {
      finalObj = {
        ...finalObj,
        assessment_language:
          returnDataGeneralSetting?.data?.assessment_language,
        response_slider: returnDataGeneralSetting?.data?.response_slider,
        question_limit: returnDataGeneralSetting?.data?.question_limit,
        randomize_question: returnDataGeneralSetting?.data?.randomize_question,
        response_score_range:
          returnDataGeneralSetting?.data?.response_score_range,
        question_per_page: returnDataGeneralSetting?.data?.question_per_page,
        isHideOutcome: returnDataGeneralSetting?.data?.isHideOutcome,
        surveyLanguageText: returnDataGeneralSetting?.data?.surveyLanguageText,
      };
    } else {
      setActiveTab("generalSettingTab");
      return;
    }

    const returnDataScalerConfig = handleScalerConfigRef.current.handleSubmit();

    if (returnDataScalerConfig?.isValid) {
      finalObj = {
        ...finalObj,
        summary_report_name: returnDataScalerConfig?.data?.summary_report_name,
        summary_opening_comment:
          returnDataScalerConfig?.data?.summary_opening_comment,
        summary_closing_comment:
          returnDataScalerConfig?.data?.summary_closing_comment,
        summary_chart_type: returnDataScalerConfig?.data?.summary_chart_type,
        summary_legend_position:
          returnDataScalerConfig?.data?.summary_legend_position,
        summary_font_size: returnDataScalerConfig?.data?.summary_font_size,
        summary_data_label: returnDataScalerConfig?.data?.summary_data_label,
        summary_scalar_opacity:
          returnDataScalerConfig?.data?.summary_scalar_opacity,
        summary_switch_axis: returnDataScalerConfig?.data?.summary_switch_axis,
        summary_db_color: returnDataScalerConfig?.data?.summary_db_color,
        detail_report_name: returnDataScalerConfig?.data?.detail_report_name,
        report_detail_opening_comment:
          returnDataScalerConfig?.data?.report_detail_opening_comment,
        report_detail_closing_comment:
          returnDataScalerConfig?.data?.report_detail_closing_comment,
        detail_chart_type: returnDataScalerConfig?.data?.detail_chart_type,
        detail_legend_position:
          returnDataScalerConfig?.data?.detail_legend_position,
        detail_font_size: returnDataScalerConfig?.data?.detail_font_size,
        detail_data_label: returnDataScalerConfig?.data?.detail_data_label,
        detail_scalar_opacity:
          returnDataScalerConfig?.data?.detail_scalar_opacity,
        detail_switch_axis: returnDataScalerConfig?.data?.detail_switch_axis,
        detail_db_color: returnDataScalerConfig?.data?.detail_db_color,
        currentColorPallet: returnDataScalerConfig?.data?.currentColorPallet,
        scalarConfiguration: returnDataScalerConfig?.data?.scalarConfiguration,
        // summaryColorPaletteID: returnDataScalerConfig?.data?.summaryPaletteID,
        // detailedColorPaletteID: returnDataScalerConfig?.data?.detailPaletteID,
        summaryColorsData: JSON.stringify(
          returnDataScalerConfig?.data?.summaryColorPallet?.colors
        ),
        detailedColorsData: JSON.stringify(
          returnDataScalerConfig?.data?.detailColorPallet?.colors
        ),
        summaryColorPallet: returnDataScalerConfig?.data?.summaryColorPallet,
        detailColorPallet: returnDataScalerConfig?.data?.detailColorPallet,
      };
    } else {
      setActiveTab("scalarConfigTab");
      return;
    }

    const returnDataEmails =
      handlesystemGeneratedEmailsRef.current.handleSubmit();
    if (returnDataEmails?.isValid) {
      finalObj = {
        ...finalObj,
        pre_start_email_subject:
          returnDataEmails?.data?.pre_start_email_subject,
        pre_start_email_header: returnDataEmails?.data?.pre_start_email_header,
        pre_start_email_content:
          returnDataEmails?.data?.pre_start_email_content,
        assign_email_subject_line:
          returnDataEmails?.data?.assign_email_subject_line,
        assign_email_header_graphic:
          returnDataEmails?.data?.assign_email_header_graphic,
        assign_email_pre_credential_content:
          returnDataEmails?.data?.assign_email_pre_credential_content,
        assign_email_post_credential_content:
          returnDataEmails?.data?.assign_email_post_credential_content,
        reminder_email_subject_line:
          returnDataEmails?.data?.reminder_email_subject_line,
        reminder_email_header_graphic:
          returnDataEmails?.data?.reminder_email_header_graphic,
        reminder_email_content: returnDataEmails?.data?.reminder_email_content,
        thank_you_email_subject_line:
          returnDataEmails?.data?.thank_you_email_subject_line,
        thank_you_email_header_graphic:
          returnDataEmails?.data?.thank_you_email_header_graphic,
        thank_you_email_content:
          returnDataEmails?.data?.thank_you_email_content,
        email_footer: returnDataEmails?.data?.email_footer,
      };
    } else {
      setActiveTab("systemmailTab");
      return;
    }

    const returnData = handletoolsTabRef.current.handleSubmit();
    if (returnData?.isValid) {
      finalObj = {
        ...finalObj,
        ...returnData?.data,
      };
      handleSubmit(finalObj);
    } else {
      setActiveTab("toolsTab");
    }
  };

  return (
    <>
      {showLoader ? (
        <Loader />
      ) : (
        <>
          {/* head title start */}
          <section className="commonHead">
            <h1 className="commonHead_title">Welcome Back!</h1>
            <Breadcrumb breadcrumb={breadcrumb} />
          </section>
          {/* head title end */}
          <div className="pageContent createsurveyPage">
            <div className="pageTitle d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="d-flex align-items-center">
                <Link to={adminRouteMap.MANAGESURVEY.path} className="backLink">
                  <em className="icon-back" />
                </Link>
                <h2 className="mb-0">Review and Edit Survey</h2>
              </div>
              <div className="d-flex flex-row gap-2">
                <div className="d-flex gap-2 footerBtn">
                  <Button
                    variant="secondary"
                    className="ripple-effect"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="ripple-effect"
                    disabled={isSubmitting}
                    onClick={handleTopUpdate}
                  >
                    Update
                  </Button>
                  <Button
                    variant="primary"
                    className="ripple-effect"
                    onClick={handleUpdateandGotoQuestion}
                  >
                    Update and Go to Questions
                  </Button>
                </div>
                <Button
                  variant="dark ripple-effect"
                  onClick={createExistingShow}
                >
                  Clone from Existing
                </Button>
              </div>
            </div>
            <div className="surveyTab">
              <Form action="">
                <div className="d-xl-flex">
                  <div className="surveyTab_left flex-xl-column flex-column-reverse">
                    <ul className="list-unstyled mb-xl-0 mb-1">
                      {tabs.map((tab) => (
                        <li
                          key={tab.id}
                          className={`cursor-pointer ${
                            activeTab === tab.id ? "active" : ""
                          }`}
                          onClick={() => handleTabClick(tab.id)}
                        >
                          <h3 className="mb-0">{tab.title}</h3>
                          <p className="mb-0">{tab.description}</p>
                        </li>
                      ))}
                    </ul>
                    <div className="surveyTab_question">
                      <ImageElement source="question-circle.png" />
                      <h4 className="surveyTab_question_head">
                        Survey Questions
                      </h4>
                      {question && (
                        <ul className="list-unstyled mb-0">
                          <li className="d-flex justify-content-between align-items-center p-0 border-0">
                            <span>Rating</span>
                            <span>{question.rating}</span>
                          </li>
                          <li className="d-flex justify-content-between align-items-center p-0 border-0">
                            <span>RBOEQ</span>
                            <span>{question.rboeq}</span>
                          </li>
                          <li className="d-flex justify-content-between align-items-center p-0 border-0">
                            <span>OEQ</span>
                            <span>{question.oeq}</span>
                          </li>
                          <li className="d-flex justify-content-between align-items-center p-0 border-0">
                            <span>Demographic</span>
                            <span>{question.demographic}</span>
                          </li>
                          <li className="d-flex justify-content-between align-items-center p-0 border-0">
                            <span>Demographic Branch</span>
                            <span>{question.demographicBranch}</span>
                          </li>
                          <li className="d-flex justify-content-between align-items-center p-0 border-0">
                            <span>Nested Rating</span>
                            <span>{question.nested}</span>
                          </li>
                          <li className="d-flex justify-content-between align-items-center p-0 border-0">
                            <span>Multi-Response</span>
                            <span>{question.multiResponse}</span>
                          </li>
                          <li className="d-flex justify-content-between align-items-center p-0 border-0">
                            <span>Gate Qualifier</span>
                            <span>{question.gate}</span>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="surveyTab_right">
                    <div
                      id="surveyInfoTab"
                      ref={sectionRefs.surveyInfoTab}
                      onMouseEnter={handleFieldHover}
                      onMouseLeave={handleFieldLeave}
                    >
                      <SurveyForm
                        companyOptions={companyOptions}
                        ref={handleSurveyRef}
                        isEditableFlag={!isEditableFlag}
                        setData={setFormData}
                        reviewData={reviewData}
                      />
                    </div>
                    <div
                      id="generalSettingTab"
                      ref={sectionRefs.generalSettingTab}
                      className="generalsetting"
                      onMouseEnter={handleFieldHover}
                      onMouseLeave={handleFieldLeave}
                    >
                      <GeneralSettings
                        defaultOptions={defaultOptions}
                        responseScore={responseScore}
                        companyID={formData.companyID}
                        userData={userData}
                        ref={handleGeneralSettingRef}
                        reviewData={reviewData}
                      />
                    </div>
                    <div
                      id="scalarConfigTab"
                      ref={sectionRefs.scalarConfigTab}
                      className="generalsetting mt-4"
                      onMouseEnter={handleFieldHover}
                      onMouseLeave={handleFieldLeave}
                    >
                      <ScalarConfiguration
                        score={score}
                        chartTypeOptions={chartTypeOptions}
                        legendOptions={legendOptions}
                        fontSizeOptions={fontSizeOptions}
                        dataLabelOptions={dataLabelOptions}
                        activeTab={activeTab}
                        userData={userData}
                        companyID={formData.companyID}
                        ref={handleScalerConfigRef}
                        reviewData={reviewData}
                        refSurveyID={surveyID}
                      />
                    </div>
                    <div
                      id="systemmailTab"
                      ref={sectionRefs.systemmailTab}
                      className="generalsetting mt-4"
                      onMouseEnter={handleFieldHover}
                      onMouseLeave={handleFieldLeave}
                    >
                      <SystemGeneratedEmails
                        userData={userData}
                        companyID={formData.companyID}
                        ref={handlesystemGeneratedEmailsRef}
                        reviewData={reviewData}
                      />
                    </div>
                    <div
                      id="toolsTab"
                      ref={sectionRefs.toolsTab}
                      className="generalsetting mt-4"
                      onMouseEnter={handleFieldHover}
                      onMouseLeave={handleFieldLeave}
                    >
                      <ParticipationTools
                        editfaqShow={editfaqShow}
                        deleteModal={deleteModal}
                        addcontactShow={addcontactShow}
                        editcontactShow={editcontactShow}
                        confettiOptopn={confettiOptopn}
                        startColorOptopn={startColorOptopn}
                        activeTab={activeTab}
                        userData={userData}
                        ref={handletoolsTabRef}
                        companyID={formData.companyID}
                        reviewData={reviewData}
                      />
                    </div>

                    <div>
                      <Row className="justify-content-between mt-xl-4 mt-3 g-2 flex-wrap">
                        <Col xxl={3} className="d-flex gap-2 flex-wrap">
                          {surveyStatus !== "Unassign" &&
                            surveyStatus !== "Active" && (
                              <Button
                                variant="primary"
                                className="ripple-effect"
                                onClick={publishModal}
                              >
                                {/* {isSubmittingPublish ? "Publishing...." : "Publish"} */}
                                Publish
                              </Button>
                            )}

                          <Button
                            variant="danger"
                            className="ripple-effect"
                            onClick={deleteModal}
                          >
                            Delete
                          </Button>
                        </Col>
                        <Col xxl={9}>
                          <div className="d-flex justify-content-end gap-2 flex-wrap footerBtn">
                            <Button
                              variant="primary"
                              className="ripple-effect"
                              disabled={isSubmitting}
                              onClick={handleTopUpdate}
                            >
                              Update
                            </Button>
                            <Button
                              variant="primary"
                              className="ripple-effect"
                              onClick={handleUpdateandGotoQuestion}
                            >
                              Update and Go to Questions
                            </Button>
                            <Button
                              className="btn btn-primary ripple-effect"
                              onClick={() => {
                                const surveyVal = survey?.survey_id ?? surveyID;

                                navigate("/preview-question", {
                                  state: {
                                    companyID: formData.companyID,
                                    surveyID: surveyVal,
                                  },
                                });
                              }}
                            >
                              Preview Questions
                            </Button>
                            <Button
                              variant="secondary"
                              className="ripple-effect"
                              onClick={handleCancel}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="btn btn-primary ripple-effect"
                              onClick={handleCrosswalk}
                            >
                              View Crosswalk
                            </Button>
                            <Button
                              variant="primary"
                              className="ripple-effect"
                              onClick={findReplaceShow}
                            >
                              Find And Replace
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </>
      )}

      {/* add department */}
      <SurveyDepartmentModel
        modalHeader="Add Department"
        show={showAddDep}
        onHandleCancel={adddepClose}
        buttonText="Add Department"
        initialData={initValuesFAQ()}
        validationFAQ={validationFAQ()}
        companyOptions={companyOptions}
      />
      {/* edit department */}
      <SurveyDepartmentModel
        modalHeader="Edit Department"
        show={showEditDep}
        onHandleCancel={editdepClose}
        buttonText="Edit Department"
        initialData={initValuesFAQ()}
        validationFAQ={validationFAQ()}
        companyOptions={companyOptions}
      />

      {/* FAQ modal Update */}
      <SurveyFAQModel
        modalHeader="Edit FAQ"
        show={showeditFaq}
        onHandleCancel={editfaqClose}
        buttonText="Edit FAQ"
        initialData={initValuesFAQ()}
        validationFAQ={validationFAQ()}
      />

      {/* add contact modal */}
      <SurveyHelpContactModel
        modalHeader="Add Help Contact"
        show={showaddContact}
        onHandleCancel={addcontactClose}
        buttonText="Add Help Contact"
        initialData={initValuesHelpContent()}
        validationFAQ={validationHelpContact()}
      />

      {/* edit contact modal */}
      <SurveyHelpContactModel
        modalHeader="Edit Help Contact"
        show={showeditContact}
        onHandleCancel={editcontactClose}
        buttonText="Edit Help Contact"
        initialData={initValuesHelpContent()}
        validationFAQ={validationHelpContact()}
      />

      {/* Find and Replace modal */}
      {showfindReplace && (
        <SurveyFindAndReplaceModel
          modalHeader="Find & Replace Survey Content"
          show={showfindReplace}
          onHandleCancel={findReplaceClose}
          initialData={initValuesFindAndReplace()}
          validationFAQ={validationfindAndReplace()}
          survey={survey}
          reviewData={reviewData}
        />
      )}

      {/* Surveys Management: Create From Existing modal  */}
      {showcreateExisting && (
        <SurveyFromExistingModel
          showcreateExisting={showcreateExisting}
          setshowcreateExisting={setshowcreateExisting}
        />
      )}

      <SweetAlert
        title="Are you sure?"
        text="You want to delete this survey!"
        show={isAlertVisible}
        icon="warning"
        onConfirmAlert={onConfirmAlertModal}
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={setIsAlertVisible}
        isConfirmedTitle="Deleted!"
        isConfirmedText="Your file has been deleted."
      />
      {isSubmittingPublish && (
        <SweetAlert
          title="Are you sure?"
          text="You want to Publish!"
          show={isSubmittingPublish}
          icon="warning"
          onConfirmAlert={onConfirmAlertPublishModal}
          showCancelButton
          cancelButtonText="Cancel"
          confirmButtonText="Yes, Publish it!"
          setIsAlertVisible={setIsSubmittingPublish}
          isConfirmedTitle="Published!"
          isConfirmedText="This Survey Is Published!."
          otherErrDisplayMode={publishOtherDisplayMode}
        />
      )}
    </>
  );
}
