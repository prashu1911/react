import React, { useEffect, useState } from "react";
import { Form, Nav, Tab } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { commonService } from "services/common.service";
import { Participant } from "apiEndpoints/Participant";
import { useAuth } from "customHooks";
import useParticipantResponse from "customHooks/useParticipantResponse";
import InputField from "../../../components/Input";
import { Button, Loader, ModalComponent, SelectField } from "../../../components";
import { Spinner } from "react-bootstrap";
import participantRouteMap from "../../../routes/Participant/participantRouteMap";

function ProgressDashboard() {
  const companyOptions = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "30", label: "30" },
  ];
  const [searchParams, setSearchParams] = useSearchParams();
  const { getloginUserData, dispatcLoginUserData } = useAuth();
  const userData = getloginUserData();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);

  let navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 576); // Bootstrap 'sm' breakpoint = 576px
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const [showLoader, setShowLoader] = useState(false);

  const [mySurvey, setMySurvey] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalSurvey: 0,
    totalQuestions: 0,
    answeredQuestions: 0,
    pendingQuestions: 0,
  });

  const { getParticipantResponse, dispatcClearParticipantResponse } = useParticipantResponse();
  const responseData = getParticipantResponse();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showSurveyMessage, setShowSurveyMessage] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewSurvey, setReviewSurvey] = useState(null);
  const [isFinishingSurvey, setIsFinishingSurvey] = useState(false);

  const removeQueryParam = (keyToRemove) => {
    searchParams.delete(keyToRemove);
    setSearchParams(searchParams); // Update the URL
  };

  useEffect(() => {
    if (Object.keys(responseData).length !== 0) {
      dispatcClearParticipantResponse();
    }
    removeQueryParam("assessment");
  }, []);

  const fetchParticipantSurvey = async () => {
    try {
      setShowLoader(true);
      const response = await commonService({
        apiEndPoint: Participant.assessmentList,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setMySurvey(response.data);
        setStats({
          totalSurvey: response.data.total_survey || 0,
          totalQuestions: response.data.total_questions || 0,
          answeredQuestions: response.data.answered_questions || 0,
          pendingQuestions: response.data.pending_questions || 0,
        });
      }
      setShowLoader(false);
    } catch (error) {
      setShowLoader(false);
      console.error("Error fetching surveys:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterByStatus = (surveys, status) => {
    if (!surveys) return [];
    return surveys.filter((survey) => survey.completion_status === status);
  };

  const getNewlyAddedSurveys = () => {
    return filterByStatus(mySurvey?.assessment_list, "Newly Added").filter((survey) =>
      survey.assessment_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getInProgressSurveys = () => {
    return filterByStatus(mySurvey?.assessment_list, "In Progress").filter((survey) =>
      survey.assessment_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getCompletedSurveys = () => {
    return filterByStatus(mySurvey?.assessment_list, "Completed").filter((survey) =>
      survey.assessment_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getAllSurveys = () => {
    return (
      mySurvey?.assessment_list?.filter((survey) =>
        survey.assessment_name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (selectedOption) => {
    setItemsPerPage(Number(selectedOption.value));
    setCurrentPage(1);
  };

  const getSurveysByTabKey = (tabKey) => {
    let surveys;
    switch (tabKey) {
      case "newlyadded":
        surveys = getNewlyAddedSurveys();
        break;
      case "inprogress":
        surveys = getInProgressSurveys();
        break;
      case "completed":
        surveys = getCompletedSurveys();
        break;
      default:
        surveys = getAllSurveys();
    }
    // Return full list for total count, pagination happens in render
    return surveys;
  };

  const renderPagination = (surveys) => {
    const totalItems = surveys.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

    // Get paginated items

    return (
      <div className="commonFilter_sort d-flex align-items-center justify-content-sm-between justify-content-center">
        <div className="commonFilter_sort_search d-flex align-items-center justify-content-center">
          <p>Entries Per Page</p>
          <SelectField
            id="pagination"
            className="mx-2 selectPickerParticipant"
            placeholder={itemsPerPage.toString()}
            options={companyOptions}
            onChange={handleItemsPerPageChange}
            value={companyOptions.find((opt) => opt.value === itemsPerPage.toString())}
          />
          <p>
            {totalItems === 0 ? "No entries to show" : `Showing ${startIndex} to ${endIndex} of ${totalItems} Entries`}
          </p>
        </div>
        {totalItems > 0 && (
          <div className="commonFilter_sort_pagination d-flex align-items-center justify-content-center">
            <div className="btn-group" aria-label="Basic outlined example">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                First
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  type="button"
                  className={`btn btn-outline-secondary ${currentPage === i + 1 ? "active" : ""}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    fetchParticipantSurvey();
    let updateDataObject = {
      ...userData,
      // companyID: "",
      surveyID: "",
      departmentID: "",
      assessmentName: "",
      assessmentIntroduction: "",
      survey: {},
    };
    dispatcLoginUserData(updateDataObject);
  }, []);

  const handleStartSurevy = (surevyData) => {
    if (["Closed", "Paused"].includes(surevyData?.survey_status)) {
      setShowSurveyMessage([surevyData.assessment_name, surevyData.survey_message]);
    } else {
      let updateDataObject = {
        ...userData,
        companyID: surevyData?.company_id,
        surveyID: surevyData?.assessment_id,
        departmentID: surevyData?.department_id,
        assessmentName: surevyData?.assessment_name || "",
        assessmentIntroduction: surevyData?.assessment_introduction || "",
        survey: {},
      };
      dispatcLoginUserData(updateDataObject);

      setTimeout(() => {
        // navigate(participantRouteMap.TAKESURVEY.path);
        navigate(participantRouteMap.STARTSURVEY.path);
      }, [150]);
    }
  };

  const handleViewResponse = (surevyData) => {
    let updateDataObject = {
      ...userData,
      companyID: surevyData?.company_id,
      surveyID: surevyData?.assessment_id,
      departmentID: surevyData?.department_id,
      assessmentName: surevyData?.assessment_name || "",
      assessmentIntroduction: surevyData?.assessment_introduction || "",
    };
    dispatcLoginUserData(updateDataObject);

    setTimeout(() => {
      navigate(participantRouteMap.VIEWRESPONSE.path);
    }, [150]);
  };

  // Handler for Continue button
  const handleContinue = (survey, e) => {
    // return window.alert(survey.completion_percentage)
    if (survey.completion_percentage == 100.00 && survey.completion_status === 'In Progress') {
      e.preventDefault();
      setReviewSurvey(survey);
      setShowReviewModal(true);
    } else {
      handleStartSurevy(survey);
    }
  };

  // Handler for Review button in modal
  const handleReview = () => {
    setShowReviewModal(false);
    if (reviewSurvey) {
      handleStartSurevy(reviewSurvey); // This is the same as the normal Continue logic
    }
  };

  // Handler for Submit button in modal
  const handleSubmitFromModal = async () => {
    setShowReviewModal(false);
    if (reviewSurvey) {
      setIsFinishingSurvey(true);
      // Prepare userData for the selected survey
      let updateDataObject = {
        ...userData,
        companyID: reviewSurvey?.company_id,
        surveyID: reviewSurvey?.assessment_id,
        departmentID: reviewSurvey?.department_id,
        assessmentName: reviewSurvey?.assessment_name || "",
        assessmentIntroduction: reviewSurvey?.assessment_introduction || "",
        survey: {},
      };
      dispatcLoginUserData(updateDataObject);
      // Call finishSurvey API for this survey
      try {
        const payload = {
          companyID: reviewSurvey?.company_id,
          companyMasterID: userData?.companyMasterID,
          surveyID: reviewSurvey?.assessment_id,
          userID: userData?.userID,
          departmentID: reviewSurvey?.department_id,
        };
        await commonService({
          apiEndPoint: Participant.assessmentFinish,
          bodyData: payload,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData?.apiToken}`,
          },
          toastType: {
            success: true,
            error: false,
          },
        });
      } catch (error) {
        // Optionally handle error
        console.error("Error finishing survey:", error);
      }
      // Refresh the survey list after submit
      fetchParticipantSurvey();
      setIsFinishingSurvey(false);
    }
  };

  return (
    <>
      {showLoader ? (
        <div className="participantLoader">
          <Loader />
        </div>
      ) : (
        <>
          <section
            style={{
              backgroundColor: "#E9F1FA",
              height: "15rem",
              paddingTop: "3rem",
              marginBottom: "2rem",
            }}
          >
            <div className="container">
              <div className="commonBanner_inner">
                <h2 className="mb-1">
                  Progress <span>Dashboard</span>{" "}
                </h2>
              </div>
            </div>
          </section>
          <section className="cardSec" style={{ marginTop: "-10rem" }}>
            <div className="container">
              <div className="row g-3 g-xl-4">
                <div className="col-sm-6 col-md-3">
                  <div className="cardSec_box text-center">
                    <span>{stats.totalSurvey}</span>
                    <p>Total Surveys</p>
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">
                  <div className="cardSec_box text-center">
                    <span>{stats.totalQuestions}</span>
                    <p>Total Questions</p>
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">
                  <div className="cardSec_box text-center">
                    <span>{stats.answeredQuestions}</span>
                    <p>Questions Submitted</p>
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">
                  <div className="cardSec_box text-center">
                    <span>{stats.pendingQuestions}</span>
                    <p>Questions Pending</p>
                  </div>
                </div>
              </div>
              <h2 className="cardSec_title">My Survey</h2>
              <div className="commonFilter">
                <Tab.Container defaultActiveKey="allsurvey">
                  <div className="d-md-flex align-items-center justify-content-between commonFilter_tabs">
                    <Nav className="pb-md-0 pb-1">
                      <Nav.Item>
                        <Nav.Link eventKey="allsurvey">All Survey</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="newlyadded">Newly Added</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="inprogress">In Progress</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="completed">Completed</Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Form onSubmit={(e) => e.preventDefault()}>
                      <div className="searchBar">
                        <InputField type="text" placeholder="Search" value={searchTerm} onChange={handleSearch} />
                      </div>
                    </Form>
                  </div>
                  <Tab.Content>
                    {["allsurvey", "newlyadded", "inprogress", "completed"].map((tabKey) => {
                      const surveys = getSurveysByTabKey(tabKey);
                      const paginatedSurveys = surveys.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                      );

                      return (
                        <Tab.Pane eventKey={tabKey} key={tabKey}>
                          {paginatedSurveys.map((survey, index) => (
                            isMobile?
                            <div className="surveyCards" key={index}>
                              <div className="surveyCards_inner d-flex justify-content-between">
                                <div className="surveyCards_left">
                                  <h3>{survey.assessment_name}</h3>
                                 <div style={{flexDirection:'row',display:'flex',marginTop:15}}>
                                 <ul className="list-unstyled mb-sm-0" style={{width:'100%'}}>
                                    <li>
                                      Company: <span>{survey.company_name}</span>
                                    </li>
                                    <li>
                                      Department: <span>{survey.department_name}</span>
                                    </li>
                                    <li>
                                    Assigned Date: <span>
                                    {new Date(survey.assigned_at).toLocaleDateString()} 
                                    </span>               
                                                        </li>
                                                        <li style={{marginTop:10}}>
                                                        <div className="surveyCards_right">
                                  <span>{Number(survey.completion_percentage).toFixed(1)}%</span>
                                  {/* <p className="mb-0">Completed</p> */}
                                </div>
                                                        </li>

                                                        <li>
                                                        <p
                                    className={`surveyCards_progress ${survey.completion_status
                                      .toLowerCase()
                                      .replace(" ", "")}`}
                                  >
                                    {survey.completion_status}
                                  </p>
                                                        </li>
                                  </ul>
                                  <div style={{marginTop:'auto'}}>
                                  {survey.completion_status === "In Progress" && (
                                  <Link
                                    onClick={(e) => handleContinue(survey, e)}
                                    className="ripple-effect btn btn-primary" style={{width:175}}
                                  >
                                    Continue <em className="btn-icon right icon-arrow-next" />
                                  </Link>
                                )}
                                  </div>
                                  <div style={{marginTop:'auto'}}>
                                  {survey.completion_status === "Newly Added" && (
                                  <Link
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleStartSurevy(survey);
                                    }}
                                    className="ripple-effect btn btn-primary" style={{width:175}}
                                  >
                                    Start Survey <em className="btn-icon right icon-arrow-next" />
                                  </Link>
                                )}
                                  </div>
                                  {survey.completion_status === "Completed" && (
                                 <div className="row g-2" style={{width:290}}>
                                 <div className="col-auto">
                                   <Button
                                     className="ripple-effect btn btn-success" style={{width:170}}
                                     onClick={() => handleViewResponse(survey)}
                                   >
                                     View Response <em className="btn-icon right " />
                                   </Button>
                                 </div>
                               
                                 {survey.detail_report && (
                                   <div className="col-auto"  style={{width:180}}>
                                     <Link
                                       to={`${participantRouteMap.DETAILEDREPORT.path}?assessment=${survey?.assessment_id}`}
                                       className="btn btn-primary ripple-effect"
                                     >
                                       Detailed Report <em className="btn-icon right " />
                                     </Link>
                                   </div>
                                 )}
                               
                                 {survey.summary_report && (
                                   <div className="col-auto"  style={{width:180}}>
                                     <Link
                                       to={`${participantRouteMap.SUMMARYREPORT.path}?assessment=${survey?.assessment_id}`}
                                       className="btn btn-primary ripple-effect"
                                     >
                                       Summary Report <em className="btn-icon right" />
                                     </Link>
                                   </div>
                                 )}
                               </div>
                               
                                )}
                                 </div>
                                </div>
                                {/* <p></p> */}

                                
                              </div>
                             
                            </div>:
                            <div className="surveyCards" key={index}>
                              <div className="surveyCards_inner d-flex justify-content-between">
                                <div className="surveyCards_left">
                                  <h3>{survey.assessment_name}</h3>
                                  <ul className="list-unstyled mb-sm-0">
                                    <li>
                                      Company: <span>{survey.company_name}</span>
                                    </li>
                                    <li>
                                      Department: <span>{survey.department_name}</span>
                                    </li>
                                  </ul>
                                </div>
                                <div className="surveyCards_right">
                                  <p>Assigned Date: {new Date(survey.assigned_at).toLocaleDateString()}</p>
                                  <span>{Number(survey.completion_percentage).toFixed(1)}%</span>
                                  {/* <p className="mb-0">Completed</p> */}
                                </div>
                              </div>
                              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                                <div className="d-flex align-items-center flex-column justify-content-start">
                                  <p
                                    className={`surveyCards_progress ${survey.completion_status
                                      .toLowerCase()
                                      .replace(" ", "")}`}
                                  >
                                    {survey.completion_status}
                                  </p>
                                  {/* {survey.survey_status && <p>{survey.survey_status}</p>} */}
                                </div>
                                {survey.completion_status === "In Progress" && (
                                  <Link
                                    onClick={(e) => handleContinue(survey, e)}
                                    className="ripple-effect btn btn-primary"
                                  >
                                    Continue <em className="btn-icon right icon-arrow-next" />
                                  </Link>
                                )}
                                {/* 
                                {survey.completion_status === "Completed" && (
                                  <Button
                                    className="ripple-effect btn btn-success ms-lg-4 ms-2"
                                    onClick={() => handleViewResponse(survey)}
                                  >
                                    View Response <em className="btn-icon right icon-arrow-next" />
                                  </Button>
                                )} */}
                                {survey.completion_status === "Completed" && (
                                 <div className="row g-2">
                                 <div className="col-auto">
                                   <Button
                                     className="ripple-effect btn btn-success"
                                     onClick={() => handleViewResponse(survey)}
                                   >
                                     View Response <em className="btn-icon right icon-arrow-next" />
                                   </Button>
                                 </div>
                               
                                 {survey.detail_report && (
                                   <div className="col-auto">
                                     <Link
                                       to={`${participantRouteMap.DETAILEDREPORT.path}?assessment=${survey?.assessment_id}`}
                                       className="btn btn-primary ripple-effect"
                                     >
                                       Detailed Report <em className="btn-icon right icon-arrow-next" />
                                     </Link>
                                   </div>
                                 )}
                               
                                 {survey.summary_report && (
                                   <div className="col-auto">
                                     <Link
                                       to={`${participantRouteMap.SUMMARYREPORT.path}?assessment=${survey?.assessment_id}`}
                                       className="btn btn-primary ripple-effect"
                                     >
                                       Summary Report <em className="btn-icon right icon-arrow-next" />
                                     </Link>
                                   </div>
                                 )}
                               </div>
                               
                                )}

                                {survey.completion_status === "Newly Added" && (
                                  <Link
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleStartSurevy(survey);
                                    }}
                                    className="ripple-effect btn btn-primary"
                                  >
                                    Start Survey <em className="btn-icon right icon-arrow-next" />
                                  </Link>
                                )}
                              </div>
                            </div>
                          ))}
                          {renderPagination(surveys)}
                        </Tab.Pane>
                      );
                    })}
                  </Tab.Content>
                </Tab.Container>
              </div>
            </div>
          </section>
        </>
      )}

      {/* add card modal */}
      <ModalComponent
        modalHeader=""
        modalExtraClass=""
        show={showSurveyMessage?.length > 0 ? true : false}
        onHandleCancel={() => setShowSurveyMessage([])}
      >
        <h2 style={{ fontSize: "22px" }}>{showSurveyMessage[0] || ""}</h2>
        <p style={{ fontSize: "16px", marginBottom: "0" }}>{showSurveyMessage[1] || ""}</p>
      </ModalComponent>

      <ModalComponent
        modalHeader="Review & Submit"
        show={showReviewModal}
        onHandleCancel={() => setShowReviewModal(false)}
      >
        <p style={{ fontSize: "16px", marginBottom: "0" }}>
          You have filled all questions. Do you want to review your answers or submit the response?
        </p>
        <div className="form-btn d-flex gap-2 justify-content-end pt-2">
          <Button variant="secondary" onClick={handleReview}>
            Review
          </Button>
          <Button variant="primary" onClick={handleSubmitFromModal} disabled={isFinishingSurvey}>
            {isFinishingSurvey ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            Submit
          </Button>
        </div>
      </ModalComponent>
    </>
  );
}

export default ProgressDashboard;
