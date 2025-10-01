import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import { statusFormatter } from "components/DataTable/TableFormatter";
import { formatDateQuestionSetUP } from "utils/common.util";
import { useAuth, useSurveyDataOnNavigations } from "customHooks";
import { commonService } from "services/common.service";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { QuestionSetup } from "apiEndpoints/QuestionSetup";
import {
  AdminHeader,
  Breadcrumb,
  Button,
  InputField,
  SweetAlert,
} from "../../../../../components";
import adminRouteMap from "../../../../../routes/Admin/adminRouteMap";
import Sidebar from "./DnDComponents/Sidebar";
import {
  GateQualifierQuestion,
  OpenEndedQuestion,
  NestedQuestion,
  MultiResponse,
  VisibleDemographic,
  RatingQuestion,
  DemographicUpload,
} from "./DnDComponents/Forms";
import AddOutcomesComponent from "./AddOutcomesComponent";
import QuestionRearrangeModal from "./ModelComponent/QuestionRearrangeModal";
import DynamicFilterUploadModal from "./ModelComponent/DynamicFilterUploadModal";
import PreviewQuestionsteup from "./PreviewQuestionsteup";
import axios from "axios";
import toast from "react-hot-toast";
import { API_ENDPOINT_V1 } from "config";

function QuestionSetupParent() {
  const outcomesRef = useRef(null);
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  let navigate = useNavigate();
  const { getSurveyDataOnNavigate } = useSurveyDataOnNavigations();
  const surevyData = getSurveyDataOnNavigate();
  const [showDataAnalytics, setShowDataAnalytics] = useState(true);
  const [showPreviewQuestionSetup, setPreviewQuestionSetup] = useState(false);
  const [isSubmittingPublish, setIsSubmittingPublish] = useState(false);
  const isActiveSurvey = surevyData?.survey?.status !== "Design";
  // upload data modal
  const [showUpload, setShowUpload] = useState(false);
  const uploadClose = () => setShowUpload(false);
  const uploadShow = () => setShowUpload(true);
  // search box
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [renderOutComes, setRenderOutcome] = useState(false);
  // Create rearrangeModal Modal
  const [showRearrangeModal, setShowcreateExisting] = useState(false);
  const createRearrangeClose = () => {
    setRenderOutcome((prev) => !prev);
    setShowcreateExisting(false);
  };
  const createRearrangeShow = () => setShowcreateExisting(true);

  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [sidebarOverlayVisible, setSidebarOverlayVisible] = useState(false);
  const [mainContentReduced, setMainContentReduced] = useState(false);
  const [menuFlipped, setMenuFlipped] = useState(false);
  const [activeForm, setActiveForm] = useState([]);
  const [currentOutcomeValue, setCurrentOutcomeValue] = useState([]);

  // Initialize state to manage the survey, companyID, and surveyID
  const [survey] = useState(surevyData?.survey);
  const [companyID] = useState(surevyData?.companyID);
  const [surveyID] = useState(surevyData?.survey?.survey_id);

  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Surveys",
    },

    {
      // path: "/admin/manage-surveys",
      path: "/manage-surveys",
      name: "Manage Surveys",
    },
    {
      path: "#",
      name: "Build Surveys",
    },
  ];

  const toggleSearch = () => {
    setIsSearchActive(!isSearchActive);
  };

  const handlePreviewQuestionSetup = () => {
    setShowDataAnalytics(false);
    setPreviewQuestionSetup(true);
  };

  const sidebarToggle = () => {
    setMenuCollapsed(!menuCollapsed);
    setSidebarOverlayVisible(!sidebarOverlayVisible);
    setMainContentReduced(!mainContentReduced);
    setMenuFlipped(!menuFlipped);
  };

  const handleAddOutcomesClick = () => {
    setShowDataAnalytics(true);
    setPreviewQuestionSetup(false);
    outcomesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDragStart = (e, questionType) => {
    e.dataTransfer.setData("application/questionType", questionType);
  };

  const handleQuestionSelect = (questionType, outcomeId) => {
    let newForm;
    console.log(activeForm, "activeform value");
    switch (questionType) {
      case "rating":
        newForm = {
          id: "rating",
          label: "Rating",
          component: RatingQuestion,
          outcomeId,
        };
        break;
      case "nested":
        newForm = {
          id: "nested",
          label: "Nested Rating",
          component: NestedQuestion,
          outcomeId,
        };
        break;
      case "oeq":
        newForm = {
          id: "oeq",
          label: "OEQ",
          component: OpenEndedQuestion,
          outcomeId,
        };
        break;
      case "multi":
        newForm = {
          id: "multi",
          label: "Multi-Response",
          component: MultiResponse,
          outcomeId,
        };
        break;
      case "gate":
        newForm = {
          id: "gate",
          label: "Gate Qualifier",
          component: GateQualifierQuestion,
          outcomeId,
        };
        break;
      case "vdemographic":
        newForm = {
          id: "vdemographic",
          label: "Demographic",
          component: VisibleDemographic,
          outcomeId,
        };
        break;
      case "dupload":
        newForm = {
          id: "dupload",
          label: "Demographic Upload",
          component: DemographicUpload,
          outcomeId,
        };
        break;

      default:
        return; // Exit if no valid question type is found
    }

    // Check if the activeForms already contains an object with the same outcomeId
    setActiveForm((prevForms) => {
      const existingIndex = prevForms.findIndex(
        (form) => form.outcomeId === outcomeId
      );

      if (existingIndex !== -1) {
        // If found, update the existing form
        const updatedForms = [...prevForms];
        updatedForms[existingIndex] = {
          ...updatedForms[existingIndex],
          ...newForm,
        };
        return updatedForms;
      } else {
        // If not found, add the new form
        return [...prevForms, newForm];
      }
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("bg-blue-50");
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("bg-blue-50");
  };

  const handleDrop = (e, outcome) => {
    e.preventDefault();
    e.currentTarget.classList.remove("bg-blue-50");
    const questionType = e.dataTransfer.getData("application/questionType");

    if (questionType) {
      handleQuestionSelect(questionType, outcome?.id);
    }
  };

  const handlePublish = async () => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.publishSurvay,
      bodyData: {
        surveyID: survey?.survey_id,
      },
      // toastType: {
      //   success: true,
      //   error: false,
      // },
      // toastMessage: {
      //   success: "Delete Template Successfully",
      //   error: false,
      // },
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

  const handleDownloadTemplate = async () => {
    // const response = await commonService({
    //   apiEndPoint: QuestionSetup.downLoadTemplate,
    //   isFormData: false,
    //   queryParams: { surveyID },
    //   headers: {
    //     Authorization: `Bearer ${userData?.apiToken}`,
    //     Accept:
    //       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //   },
    //   responseType: "blob",
    // });
    try {
      const response = await axios.get(
        `${API_ENDPOINT_V1}download/template/demographic?surveyID=${surveyID}`,
        {
          responseType: "blob", // Always treat the response as a blob initially
          headers: {
            Authorization: `Bearer ${userData?.apiToken}`,
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );

      const contentType = response.headers["content-type"];
      if (contentType && contentType.includes("application/json")) {
        // Try to parse blob as JSON
        const text = await response.data.text();
        const json = JSON.parse(text);
        console.log("Received JSON:", json);
        toast.error(json.message, { toastId: "fgdfg" });
        // return json;
      } else {
        let fileData = response?.data;
        let data = new Blob([fileData]);
        let csvURL = window.URL.createObjectURL(data);
        let tempLink = document.createElement("a");
        tempLink.href = csvURL;
        tempLink.setAttribute("download", `Participant_Template.xlsx`);
        tempLink.click();
      }
    } catch (error) {
      console.log(error);
    }

    // if (response?.status) {
    //   let fileData = response?.data;
    //   let data = new Blob([fileData]);
    //   let csvURL = window.URL.createObjectURL(data);
    //   let tempLink = document.createElement("a");
    //   tempLink.href = csvURL;
    //   tempLink.setAttribute("download", `Participant_Template.xlsx`);
    //   tempLink.click();
    // }
  };
  const handleDeleteTemplate = async () => {
    const response = await commonService({
      apiEndPoint: QuestionSetup.deleteTemplate,
      isFormData: false,
      queryParams: { surveyID, companyID },
      toastType: {
        success: true,
        error: false,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      return true;
    } else {
      console.log("error");
      return false;
    }
  };

  const addOutcomesRef = useRef(null);
  const scrollToAddOutcomes = () => {
    if (addOutcomesRef.current) {
      addOutcomesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <AdminHeader
        sidebarToggle={sidebarToggle}
        menuCollapsed={menuCollapsed}
        menuFlipped={menuFlipped}
      />
      <main
        className={`mainContent mainContent-questionSetup ${
          mainContentReduced ? "reduceWidth" : ""
        }`}
      >
        {/* head title start */}
        <section className="commonHead">
          <h1 className="commonHead_title">Welcome Back!</h1>
          <Breadcrumb breadcrumb={breadcrumb} />
        </section>
        {/* head title end */}
        <div className="questionSetup">
          <Sidebar
            scrollToAddOutcomes={scrollToAddOutcomes}
            menuCollapsed={menuCollapsed}
            handleDragStart={handleDragStart}
            handelAddOutcomes={handleAddOutcomesClick}
            handleQuestionSelect={handleQuestionSelect}
            activeForm={activeForm}
            currentOutcomeValue={currentOutcomeValue}
          />
          <div className="questionSetup_content">
            <div
              className={`pageTitle   ${
                showPreviewQuestionSetup ? "d-none" : ""
              }`}
            >
              <div className="pageTitle_left d-flex align-items-center flex-wrap gap-xl-3 gap-2">
                <div
                  onClick={() =>
                    navigate(adminRouteMap.REVIEWANDEDIT.path, {
                      state: { survey: survey },
                    })
                  }
                  className="backLink"
                >
                  <em className="icon-back" style={{ marginRight: "-10px" }} />
                </div>
                <h2 className="mb-0">{survey?.survey_name}</h2>
                <p className="mb-0 fw-medium gap-xl-3 gap-2 d-flex align-items-center flex-wrap">
                  Saved on{" "}
                  {survey?.created_at &&
                    formatDateQuestionSetUP(survey?.created_at)}
                  <span className="gap-xl-3 gap-2">
                    {statusFormatter(survey?.status)}
                  </span>
                </p>
              </div>
             <div>
               {isActiveSurvey && (
                <p style={{ color: "#f77c6f" }} className="mt-2">
                  NOTICE: This assessment is Published and Active. Question(s) and Outcome(s)
                  cannot be edited or updated.
                </p>
              )}
             </div>
              <div className="pageTitle_right mt-2">
                <ul className="list-inline d-flex align-items-center mb-0 flex-wrap gap-lg-0 gap-2">
                  <li className="list-inline-item">
                    <Link
                      to="#!"
                      className={`d-flex align-items-center justify-content-center ${
                        isSearchActive ? "active" : ""
                      }`}
                      onClick={toggleSearch}
                    >
                      <em
                        className={isSearchActive ? "icon-plus" : "icon-search"}
                      />
                    </Link>
                  </li>
                  <li className="list-inline-item">
                    <Link
                      to="#!"
                      className="d-flex align-items-center justify-content-center"
                      onClick={createRearrangeShow}
                    >
                      <em className="icon-exchange" />
                    </Link>
                  </li>
                  <li className="list-inline-item">
                    <Button
                      variant="primary"
                      className="ripple-effect"
                      onClick={uploadShow}
                    >
                      Upload Participants
                    </Button>
                  </li>
                  <li className="list-inline-item">
                    <Button
                      variant="success"
                      className="ripple-effect"
                      onClick={handleDownloadTemplate}
                    >
                      Download Template
                    </Button>
                  </li>
                  <li className="list-inline-item">
                    <Button
                      variant="danger"
                      className="ripple-effect"
                      onClick={handleDeleteTemplate}
                    >
                      Delete Template
                    </Button>
                  </li>
                  <li className="list-inline-item">
                    <Button
                      variant="outline-primary"
                      className="ripple-effect"
                      onClick={handlePreviewQuestionSetup}
                    >
                      Preview
                    </Button>
                  </li>
                  <li className="list-inline-item">
                    <Button
                      variant="primary"
                      className="ripple-effect"
                      onClick={publishModal}
                      disabled={
                        survey?.status === "Active" ||
                        survey?.status === "Unassign"
                      }
                    >
                      Publish
                    </Button>
                  </li>
                </ul>
                {isSearchActive && (
                  <div className="searchBox">
                    <Form>
                      <Form.Group className="form-group d-flex align-items-center mb-0">
                        <InputField
                          type="text"
                          placeholder="Search outcomes..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="primary"
                          className="ripple-effect"
                        >
                          Search
                        </Button>
                      </Form.Group>
                    </Form>
                  </div>
                )}
              </div>
            </div>
            {showDataAnalytics && (
              <AddOutcomesComponent
                addOutcomesRef={addOutcomesRef}
                ref={outcomesRef}
                activeForm={activeForm}
                handleDrop={handleDrop}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                setActiveForm={setActiveForm}
                surveyID={surveyID}
                companyID={companyID}
                searchTerm={searchTerm}
                renderOutComes={renderOutComes}
                showPreviewQuestionSetup={showPreviewQuestionSetup}
                setCurrentOutcomeValue={setCurrentOutcomeValue}
              />
            )}

            {showPreviewQuestionSetup && (
              <PreviewQuestionsteup
                surveyID={surveyID}
                companyID={companyID}
                setPreviewQuestionSetup={setPreviewQuestionSetup}
                isDataByProps
                setShowDataAnalytics={setShowDataAnalytics}
              />
            )}
          </div>
        </div>

        {/* Surveys Management: Create From Existing modal  */}
        {showRearrangeModal && (
          <QuestionRearrangeModal
            showRearrangeModal={showRearrangeModal}
            createRearrangeClose={createRearrangeClose}
            surveyID={surveyID}
          />
        )}

        {/* upload data */}
        {showUpload && (
          <DynamicFilterUploadModal
            showUpload={showUpload}
            uploadClose={uploadClose}
            userData={userData}
            surveyID={surveyID}
            companyID={companyID}
          />
        )}

        <div
          onClick={sidebarToggle}
          className={`sidebar-overlay ${sidebarOverlayVisible ? "show" : ""}`}
        />
      </main>

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
      />
    </>
  );
}

export default QuestionSetupParent;
