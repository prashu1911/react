import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { commonService } from "services/common.service";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { COMPANY_MANAGEMENT } from "apiEndpoints/OrgStructure/OrgStructure.dashboard";
import { showErrorToast } from "helpers/toastHelper";
import { Button, SweetAlert, Breadcrumb } from "../../../../../components";
import adminRouteMap from "../../../../../routes/Admin/adminRouteMap";
import SurveyFromExistingModel from "./ModelComponent/SurveyFromExisting/SurveyFromExistingModel";
import {
  initValuesFAQ,
  initValuesHelpContent,
  validationFAQ,
  validationHelpContact,
} from "./validation";
import SurveyHelpContactModel from "./ModelComponent/surveyHelpContactForm";
import SurveyDepartmentModel from "./ModelComponent/surveyDepartmentForm";
import useAuth from "../../../../../customHooks/useAuth/index";
import {
  SurveyForm,
  GeneralSettings,
  ScalarConfiguration,
  SystemGeneratedEmails,
  ParticipationTools,
} from "./Tabs";
import SurveyFAQModel from "./ModelComponent/surveyFAQForm";
import { useSurveyDataOnNavigations } from "../../../../../customHooks";
import { selectCompanyData } from "../../../../../redux/ManageSurveySlice/index.slice";
import { useSelector } from "react-redux";

export default function CreateSurvey() {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  let navigate = useNavigate();
  const { dispatcSurveyDataOnNavigateData } = useSurveyDataOnNavigations();

  let saveandGotoQuestionClicked = false;
  const selectedCompanyID = useSelector(selectCompanyData);
  const [saveAndGo, setsaveAndGo] = useState(false);

  const [formData, setFormData] = useState({
    companyID: "",
    surveyName: "",
    outcome_default: "",
    assessment_language: "",
    response_slider: "",
    question_limit: "",
    randomize_question: "",
    response_score_range: "",
    enable_participant_demographics: "",
    enable_dynamic_filter: "",
    enable_open_ended_questions: "",
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
    summaryColorPaletteID: "9",

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
    detailedColorPaletteID: "9",

    currentColorPallet: {},
    scalarConfiguration: [],
    pre_start_email_subject: "",
    pre_start_email_header: "",
    pre_start_email_content: "",
    assign_email_subject_line:
      "Your Voice Matters: Join Our Survey and Share Your Thoughts!",
    assign_email_header_graphic: "",
    assign_email_pre_credential_content: `<p>Greetings! You have been invited to take a survey on the Metolius Survey Platform.</p>
    <p>You can easily access the survey from any device. If you encounter any difficulties while logging into the platform, please contact us.</p>
    <p>We kindly request that you complete the survey as soon as possible using your unique username and password provided below. Though the survey is designed to not take too much of your time, you may start, stop, skip questions, and return to complete it at your convenience.</p>
    <p>Kindly click on the "Take Survey" button below to begin.</p>`,
    assign_email_post_credential_content:
      "This online assessment includes demographic questions to better filter the information collected. All information you provide is kept confidential and is not shared outside the scope of this assessment.",
    reminder_email_subject_line: "Reminder: We Want to Hear From You! ",
    reminder_email_header_graphic: "",
    reminder_email_content: `<p>Just a quick reminder to please take a few minutes to complete the survey we have sent you.</p>
    <p>Your feedback is very important to us and we appreciate your participation and the impact it will have on our planned improvements.</p>
    <p>Thank you for your time!</p>`,
    thank_you_email_subject_line: "Thank you for completing our survey",
    thank_you_email_header_graphic: "",
    thank_you_email_content: `<p>Thank you for taking the time to complete our survey. Your feedback is important to us and will help us to improve.</p>
    <p>We appreciate your participation and the impact it will make on the future of our company.</p>
    <p>Thanks again for your time and valuable input!</p>`,
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

  // Create Existing Modal
  const [showcreateExisting, setshowcreateExisting] = useState(false);
  const createExistingShow = () => setshowcreateExisting(true);

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseScore, setResponseScore] = useState([]);
  const [score, setScore] = useState({});

  // In this form, we manage custom validations and handle the submit using refs. Initially, we tried to manage this form using Formik, but the performance of the validations was poor, so we had to move to custom validations.
  const handleSurveyRef = useRef();
  const handleGeneralSettingRef = useRef();
  const handleScalerConfigRef = useRef();
  const handlesystemGeneratedEmailsRef = useRef();
  const handletoolsTabRef = useRef();

  const onConfirmAlertModal = () => {
    setIsAlertVisible(false);
    return true;
  };
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

  // Add section refs
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

  // Function to handle tab clicks
  const handleTabClick = (tabId) => {
    if (activeTab === "surveyInfoTab" && tabId !== "final") {
      const returnData = handleSurveyRef.current.handleSubmit();
      if (returnData?.isValid) {
        setFormData((prev) => ({
          ...prev,
          companyID: returnData?.data?.companyID,
          surveyName: returnData?.data?.surveyName,
        }));
        if (tabId !== "generalSettingTab") {
          const returnDataGeneralSettingTab =
            handleGeneralSettingRef.current.handleSubmit();
          if (returnDataGeneralSettingTab?.isValid) {
            setActiveTab(tabId);
            setTimeout(() => {
              const targetSection = document.getElementById(tabId);
              if (targetSection) {
                targetSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }, 100);
          } else {
            setActiveTab("generalSettingTab");
            setTimeout(() => {
              const targetSection =
                document.getElementById("generalSettingTab");
              if (targetSection) {
                targetSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }, 100);
          }
        } else {
          setActiveTab(tabId);
          setTimeout(() => {
            const targetSection = document.getElementById(tabId);
            if (targetSection) {
              targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }, 100);
        }
      }
    }

    if (activeTab === "generalSettingTab" && tabId !== "final") {
      const returnData = handleGeneralSettingRef.current.handleSubmit();
      if (returnData?.isValid) {
        setFormData((prev) => ({
          ...prev,
          outcome_default: returnData?.data?.outcome_default,
          assessment_language: returnData?.data?.assessment_language,
          response_slider: returnData?.data?.response_slider,
          question_limit: returnData?.data?.question_limit,
          randomize_question: returnData?.data?.randomize_question,
          response_score_range: returnData?.data?.response_score_range,
          enable_participant_demographics:
            returnData?.data?.enable_participant_demographics,
          enable_dynamic_filter: returnData?.data?.enable_dynamic_filter,
          enable_open_ended_questions:
            returnData?.data?.enable_open_ended_questions,
          question_per_page: returnData?.data?.question_per_page,
          surveyLanguageText: returnData?.data?.surveyLanguageText,
          isHideOutcome: returnData?.data?.isHideOutcome,
        }));

        if (tabId !== "scalarConfigTab") {
          const returnDataScalerConfig =
            handleScalerConfigRef.current.handleSubmit();
          if (returnDataScalerConfig?.isValid) {
            setActiveTab(tabId);
            setTimeout(() => {
              const targetSection = document.getElementById(tabId);
              if (targetSection) {
                targetSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }, 100);
          } else {
            setActiveTab("scalarConfigTab");
            setTimeout(() => {
              const targetSection = document.getElementById("scalarConfigTab");
              if (targetSection) {
                targetSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }, 100);
          }
        } else {
          setActiveTab(tabId);
          setTimeout(() => {
            const targetSection = document.getElementById(tabId);
            if (targetSection) {
              targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }, 100);
        }
      }
    }

    if (activeTab === "scalarConfigTab" && tabId !== "final") {
      const returnData = handleScalerConfigRef.current.handleSubmit();

      if (returnData?.isValid) {
        setFormData((prev) => ({
          ...prev,
          summary_report_name: returnData?.data?.summary_report_name,
          summary_opening_comment: returnData?.data?.summary_opening_comment,
          summary_closing_comment: returnData?.data?.summary_closing_comment,
          summary_chart_type: returnData?.data?.summary_chart_type?.value,
          summary_legend_position:
            returnData?.data?.summary_legend_position?.value,
          summary_font_size: returnData?.data?.summary_font_size?.value,
          summary_data_label: returnData?.data?.summary_data_label?.value,
          summary_scalar_opacity: returnData?.data?.summary_scalar_opacity,
          summary_switch_axis: returnData?.data?.summary_switch_axis,
          summary_db_color: returnData?.data?.summary_db_color,

          detail_report_name: returnData?.data?.detail_report_name,
          report_detail_opening_comment:
            returnData?.data?.report_detail_opening_comment,
          report_detail_closing_comment:
            returnData?.data?.report_detail_closing_comment,

          detail_chart_type: returnData?.data?.detail_chart_type?.value,
          detail_legend_position:
            returnData?.data?.detail_legend_position?.value,
          detail_font_size: returnData?.data?.detail_font_size?.value,
          detail_data_label: returnData?.data?.detail_data_label?.value,
          detail_scalar_opacity: returnData?.data?.detail_scalar_opacity,
          detail_switch_axis: returnData?.data?.detail_switch_axis,
          detail_db_color: returnData?.data?.detail_db_color,

          currentColorPallet: returnData?.data?.currentColorPallet,
          summaryColorPallet: returnData?.data?.summaryColorPallet,
          detailColorPallet: returnData?.data?.detailColorPallet,
          scalarConfiguration: returnData?.data?.scalarConfiguration,
          colorPaletteID: returnData?.data?.scalarPaletteID,
          summaryColorPaletteID: returnData?.data?.summaryPaletteID,
          detailedColorPaletteID: returnData?.data?.detailPaletteID,
          currentColors: returnData?.data?.currentColors,
          summaryColorsData: JSON.stringify(
            returnData?.data?.summaryColorPallet?.colors
          ),
          detailedColorsData: JSON.stringify(
            returnData?.data?.detailColorPallet?.colors
          ),
        }));

        if (tabId !== "systemmailTab") {
          const returnDataScalerConfig =
            handleScalerConfigRef.current.handleSubmit();
          if (returnDataScalerConfig?.isValid) {
            setActiveTab(tabId);
            setTimeout(() => {
              const targetSection = document.getElementById(tabId);
              if (targetSection) {
                targetSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }, 100);
          } else {
            setActiveTab("systemmailTab");
            setTimeout(() => {
              const targetSection = document.getElementById("systemmailTab");
              if (targetSection) {
                targetSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }, 100);
          }
        } else {
          setActiveTab(tabId);
          setTimeout(() => {
            const targetSection = document.getElementById(tabId);
            if (targetSection) {
              targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }, 100);
        }
      }
    }

    if (activeTab === "systemmailTab" && tabId !== "final") {
      const returnData = handlesystemGeneratedEmailsRef.current.handleSubmit();

      if (returnData?.isValid) {
        setFormData((prev) => ({
          ...prev,
          pre_start_email_subject: returnData?.data?.pre_start_email_subject,
          pre_start_email_header: returnData?.data?.pre_start_email_header,
          pre_start_email_content: returnData?.data?.pre_start_email_content,
          assign_email_subject_line:
            returnData?.data?.assign_email_subject_line,
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

        if (tabId !== "toolsTab") {
          const returntoolsTab = handletoolsTabRef.current.handleSubmit();
          if (returntoolsTab?.isValid) {
            setActiveTab(tabId);
            setTimeout(() => {
              const targetSection = document.getElementById(tabId);
              if (targetSection) {
                targetSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }, 100);
          } else {
            setActiveTab("toolsTab");
            setTimeout(() => {
              const targetSection = document.getElementById("toolsTab");
              if (targetSection) {
                targetSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }, 100);
          }
        } else {
          setActiveTab(tabId);
          setTimeout(() => {
            const targetSection = document.getElementById(tabId);
            if (targetSection) {
              targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }, 100);
        }
      }
    }

    if (activeTab === "toolsTab" && tabId !== "final") {
      const returnData = handletoolsTabRef.current.handleSubmit();
      if (tabId === "final") {
        if (returnData?.isValid) {
          setFormData((prev) => ({
            ...prev,
            faq: returnData?.data?.faq,
            helpContent: returnData?.data?.helpContent,
            participationTool: returnData?.data?.participationTool,
            introduction: returnData?.data?.partipation_introduction,
          }));

          let finalObj = { ...formData, ...returnData?.data };

          // call the api from here
          // eslint-disable-next-line no-use-before-define
          handleSubmit(finalObj);
          return;
        }
      } else if (returnData?.isValid) {
        setFormData((prev) => ({
          ...prev,
          faq: returnData?.data?.faq,
          helpContent: returnData?.data?.helpContent,
          participationTool: returnData?.data?.participationTool,
          introduction: returnData?.data?.partipation_introduction,
        }));
        setActiveTab(tabId);
        setTimeout(() => {
          const targetSection = document.getElementById(tabId);
          if (targetSection) {
            targetSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      }
    }
    // Set the flag to true once a tab is clicked
    setHasClicked(true);
  };

  const fetchSurveySupportData = async (type, path) => {
    const response = await commonService({
      apiEndPoint: path,
      queryParams: {
        companyID: formData?.companyID ?? 1,
        companyMasterID: userData?.companyMasterID ?? "",
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

  // API Calling
  const fetchSurvey = async (type, path) => {
    const response = await commonService({
      apiEndPoint: path,
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

    confettiArray.forEach((confetti) => {
      transformedData.confettiNo.push(parseInt(confetti.confetti_serial_no));
      transformedData.confettiPercentage.push(`${confetti.percentage} %`);
      transformedData.confettiMessage.push(confetti.message);
      transformedData.confetti.push(confetti.confetti);
      transformedData.confettiTime.push(confetti.time_in_sec);
      transformedData.confettiFireworks.push(confetti.fireworks);
      transformedData.confettiSound.push(confetti.sound);
      transformedData.confettiStarColor.push(confetti.star_color);
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

      if (saveandGotoQuestionClicked) {
        setsaveAndGo(true);
      }

      let payload = {
        companyMasterID: String(userData?.companyMasterID),
        companyID: finalObj?.companyID,
        surveyName: finalObj?.surveyName,
        surveyLanguage: finalObj?.assessment_language,
        surveyLanguageText: finalObj?.surveyLanguageText,
        isResponseSlider: finalObj?.response_slider?.value,
        questionLimit: finalObj?.question_limit,
        isRandomizeQuestion: finalObj?.randomize_question?.value,
        responseScoreRange: finalObj?.response_score_range?.value,
        rangeFrom: getResponseScoreRangeDetails(finalObj?.response_score_range)
          ?.minValue,
        rangeTo: getResponseScoreRangeDetails(finalObj?.response_score_range)
          ?.maxValue,
        questionPerPage: finalObj?.question_per_page?.value,
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
        summaryColorsData: JSON.stringify(finalObj?.summaryColorPallet?.colors),
        summaryColorPaletteID: finalObj?.summaryColorPallet?.colorPaletteID, // Add this line

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
        detailedColorsData: JSON.stringify(finalObj?.detailColorPallet?.colors),
        detailedColorPaletteID: finalObj?.detailColorPallet?.colorPaletteID, // Add this line

        emailPreStartSubject: finalObj?.pre_start_email_subject,
        emailPreStartHeader: finalObj?.pre_start_email_header || "", // Empty string as fallback
        emailPreStartContent: finalObj?.pre_start_email_content,
        emailAssignSubject: finalObj?.assign_email_subject_line,
        emailAssignHeader: finalObj?.assign_email_header_graphic || "", // Empty string as fallback
        emailAssignPreContent: finalObj?.assign_email_pre_credential_content,
        emailAssignPostContent: finalObj?.assign_email_post_credential_content,
        emailReminderSubject: finalObj?.reminder_email_subject_line,
        emailReminderHeader: finalObj?.reminder_email_header_graphic || "", // Empty string as fallback
        emailReminderContent: finalObj?.reminder_email_content,
        emailThankYouSubject: finalObj?.thank_you_email_subject_line,
        emailThankYouHeader: finalObj?.thank_you_email_header_graphic || "", // Empty string as fallback
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
        isHideOutcome: finalObj?.isHideOutcome?.value,
      };

      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.createSurvey,
        bodyData: payload,
        isFormData: true,
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: "Survey Created Successfully",
          error: "survey failed",
        },
      });
      if (response.status) {
        if (saveandGotoQuestionClicked) {
          saveandGotoQuestionClicked = false;
          const surveyDataForNavigation = {
            survey_id: response?.data?.survey_details?.surveyID,
            survey_name: response?.data?.survey_details?.surveyName,
            created_by: userData?.firstName + userData?.lastName,
            created_at: new Date(),
            updated_at: null,
            status: response?.data?.survey_details?.surveyStatus,
            question: 0,
            participant: 0,
            response: 0,
          };
          dispatcSurveyDataOnNavigateData({
            survey: surveyDataForNavigation,
            companyID: response?.data?.survey_details?.companyID,
            rangeStart: response?.data?.response_range?.rangeStart,
            rangeEnd: response?.data?.response_range?.rangeEnd,
          });
          setTimeout(() => {
            navigate(adminRouteMap.QUESTIONSETUP.path);
          }, [250]);
        } else {
          navigate(adminRouteMap.MANAGESURVEY.path);
          setIsSubmitting(false);
        }

        // navigate(adminRouteMap.MANAGESURVEY.path);
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
      }
      setsaveAndGo(false);
    } catch (error) {
      setIsSubmitting(false);
      setsaveAndGo(false);
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
      const companyOptions = Object?.values(response?.data?.data)?.map(
        (company) => ({
          value: company?.companyID,
          label: company?.companyName,
        })
      );
      setCompanyOptions(companyOptions);

      // Set the first company as default if available
      // if (companyOptions && companyOptions.length > 0) {
      //   setFormData((prev) => ({
      //     ...prev,
      //     companyID: companyOptions[0].value,
      //   }));
      // }
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    fetchSurvey("responseScore", SURVEYS_MANAGEMENT?.getResponseScore);

    fetchCompanies(userData?.companyMasterID);
  }, [isSubmitting]);

  useEffect(() => {
    if (!formData.companyID && selectedCompanyID) {
      setFormData((prev) => ({ ...prev, companyID: selectedCompanyID }));
    }
    fetchSurveySupportData("score", SURVEYS_MANAGEMENT?.getScalar);
  }, [formData.companyID]);

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
      name: "Create New Survey",
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

  // const handleSaveandGotoQuestion = () => {
  //   saveandGotoQuestionClicked = true;

  //   handleTabClick("final");
  // };

  const handleSave = () => {
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

  const handleSaveandGotoQuestion = () => {
    saveandGotoQuestionClicked = true;
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

  return (
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
            <h2 className="mb-0">Create New Survey</h2>
          </div>
          <div className="d-flex flex-row gap-2">
            <div className="d-flex gap-2 pt-0 flex-wrap">
              <Button
                variant="secondary"
                className="ripple-effect-dark"
                onClick={() => navigate(adminRouteMap.MANAGESURVEY.path)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="ripple-effect"
                onClick={() => handleSave()}
              >
                {isSubmitting && !saveAndGo ? "Save..." : "Save"}
              </Button>
              <Button
                variant="primary"
                type="button"
                className="ripple-effect"
                onClick={() => handleSaveandGotoQuestion()}
              >
                {saveAndGo ? "Save and Go..." : "Save and Go to Questions"}
              </Button>
            </div>
            <Button variant="dark ripple-effect" onClick={createExistingShow}>
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
                    companyID={formData?.companyID}
                    userData={userData}
                    ref={handleGeneralSettingRef}
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
                  />
                </div>

                <div className="d-flex justify-content-sm-end gap-2 mt-xl-4 mt-3 pt-xxl-2 pt-0 flex-wrap">
                  <Button
                    variant="secondary"
                    className="ripple-effect-dark"
                    onClick={() => navigate(adminRouteMap.MANAGESURVEY.path)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="ripple-effect"
                    onClick={() => handleSave()}
                  >
                    {isSubmitting && !saveAndGo ? "Save..." : "Save"}
                  </Button>
                  <Button
                    variant="primary"
                    type="button"
                    className="ripple-effect"
                    onClick={() => handleSaveandGotoQuestion()}
                  >
                    {saveAndGo ? "Save and Go..." : "Save and Go to Questions"}
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>

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

      {/* Surveys Management: Create From Existing modal  */}
      {showcreateExisting && (
        <SurveyFromExistingModel
          showcreateExisting={showcreateExisting}
          setshowcreateExisting={setshowcreateExisting}
        />
      )}

      <SweetAlert
        title="Are you sure?"
        text="You want to delete this data!"
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
    </>
  );
}
