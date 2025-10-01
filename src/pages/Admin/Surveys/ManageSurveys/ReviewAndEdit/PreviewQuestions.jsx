import React, { useState, useEffect } from "react";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import { commonService } from "services/common.service";
import { useAuth } from "customHooks";
import { Participant } from "apiEndpoints/Participant";
import { Loader } from "components";
import useParticipantResponse from "customHooks/useParticipantResponse";
import { useNavigate, useLocation, Link } from "react-router-dom";
import participantRouteMap from "routes/Participant/participantRouteMap";
import {
  MultipleResonse,
  NestedQuestionResponse,
  OEQResponse,
  SingleRatingResponse,
} from "pages/Participant/ResponseTypeParticipant";
import BranchFilterResponse from "pages/Participant/ResponseTypeParticipant/BranchFilterResponse";
import DemographicResponse from "pages/Participant/ResponseTypeParticipant/DemographicResponse";
import GateQualiferResponse from "pages/Participant/ResponseTypeParticipant/GateQualiferResponse";
import JumpSequncePreview from "../QuestionSetup/JumpSequencePreview";
import { decodeHtmlEntities } from "utils/common.util";

function PreviewSurveysComponent({ isDataByProps = false }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState();
  const [allQuestions, setAllQuestions] = useState([]);
  const [nextIsSubmitting, setNextIsSubmmiting] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [startSurveyClicked, setStartSurveyClicked] = useState(false);
  const [errors] = useState([]);
  const [surveyDetails, setSurveyDetails] = useState({
    surveyName: "",
    surveyIntro: "",
  });
  const [outcomeColor, setOutcomeColor] = useState([]);

  let navigate = useNavigate();
  const location = useLocation();

  // Get the survey data from location state

  const surveyData = location.state || {};

  const [outcomes, setOutcomes] = useState([]);

  const {
    dispatcParticipantResponseData,
    getParticipantResponse,
    dispatcClearParticipantResponse,
  } = useParticipantResponse();

  const responseData = getParticipantResponse();

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [isEditable] = useState(true);

  const [responses, setResponses] = useState([]);

  const [enableJumpSequence, setEnableJumpSequence] = useState(false);

  // Check for mobile or web view
  const isMobile = useIsMobile();
  const handleClicktoTop = () => {
    window.scrollTo(0, 0);
  };
  function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < breakpoint);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [breakpoint]);

    return isMobile;
  }

  useEffect(() => {
    if (userData?.roleName !== "Master Admin") {
      if (Object.keys(responseData).length !== 0) {
        if (
          responseData?.surveyID !== userData?.surveyID ||
          responseData?.userID !== userData?.userID
        ) {
          dispatcClearParticipantResponse();
          setResponses([]);
          setCurrentPage(1);
        } else {
          setResponses(responseData?.responses);
          if (responseData?.currentPage) {
            setCurrentPage(responseData.currentPage);
          }
          // Update progress when responses change
          // eslint-disable-next-line no-use-before-define
        }
      } else {
        dispatcParticipantResponseData({
          surveyID: userData?.surveyID,
          userID: userData?.userID,
          responses: [],
          currentPage: 1,
        });
      }
    }
  }, [responseData]);

  const handleDemoBranchChange = (response) => {
    const updateArr = [...allQuestions];
    const seleQues = updateArr.find(
      (item) => item.question_id === response.question_id
    );
    const seleQuesIndex = updateArr.findIndex(
      (item) => item.question_id === response.question_id
    );
    function markSelectedIds(referenceArray, data) {
      const idMap = new Map(referenceArray.map((item) => [item.id, true]));

      function recurse(node) {
        // Convert demographic_filter_id to number for comparison
        const id = parseInt(node.demographic_filter_id, 10);
        if (idMap.has(id)) {
          node.is_user_selected_response = 1;
        }

        if (Array.isArray(node.next_level)) {
          node.next_level.forEach(recurse);
        }
      }

      data.forEach(recurse);
      return data;
    }

    const resultedData = markSelectedIds(
      response.response_id,
      seleQues.demographic_response
    );
    updateArr[seleQuesIndex] = {
      ...seleQues,
      demographic_response: resultedData,
    };

    // setAllQuestions(seleQues);
  };

  const handleResponseChange = (response, gateQuestionData, gateResponseId) => {
    // Clone the existing responses array
    let updatedResponses = [...responses];
    // Create a deep copy of the incoming response to ensure sub_questions is mutable
    const newResponse = {
      ...response,
      sub_questions: response.sub_questions ? [...response.sub_questions] : [],
    };

    // Find existing response based on type, outcome, and intention
    const existingIndex = updatedResponses.findIndex(
      (r) =>
        r.question_type === newResponse.question_type &&
        r.outcome_id === newResponse.outcome_id &&
        r.question_no === newResponse.question_no &&
        (r.question_type === "N" || r.question_type === "MR"
          ? true
          : r.question_id === newResponse.question_id)
    );
    if (existingIndex >= 0) {
      if (
        newResponse.question_type === "N" ||
        newResponse.question_type === "MR"
      ) {
        // Create a new copy of the existing response
        let existingResponse = {
          ...updatedResponses[existingIndex],
          sub_questions: [
            ...(updatedResponses[existingIndex].sub_questions || []),
          ],
          is_skipped: response.is_skipped,
        };

        // Update sub_questions with new values
        newResponse.sub_questions.forEach((newSubQ) => {
          const existingSubQIndex = existingResponse.sub_questions.findIndex(
            (subQ) => subQ.question_id === newSubQ.question_id
          );
          if (existingSubQIndex >= 0) {
            existingResponse.sub_questions[existingSubQIndex] = { ...newSubQ };
          } else {
            existingResponse.sub_questions.push({ ...newSubQ });
          }
        });
        updatedResponses[existingIndex] = existingResponse;
      } else {
        // For non-nested questions, replace the entire response
        updatedResponses[existingIndex] = newResponse;
      }
    } else {
      // Add new response
      updatedResponses.push(newResponse);
    }
    // Update local state first
    setResponses(updatedResponses);
    if (newResponse.question_type === "G") {
      if (gateResponseId === gateQuestionData?.jump_response_id) {
        dispatcParticipantResponseData({
          ...responseData,
          responses: updatedResponses,
          outcomeData: gateQuestionData,
          currentPage: currentPage,
        });
        setEnableJumpSequence(true);
        // setTimeout(() => {
        //   navigate(participantRouteMap.JUMPSEQUENCE.path);
        // }, 150);
      } else {
        dispatcParticipantResponseData({
          ...responseData,
          responses: updatedResponses,
          outcomeData: gateQuestionData,
          currentPage: currentPage,
        });
      }
    } else {
      dispatcParticipantResponseData({
        surveyID: userData?.surveyID,
        userID: userData?.userID,
        responses: updatedResponses,
        currentPage: currentPage,
      });
    }
  };

  const handleNext = async () => {
    if (currentPage < totalPages) {
      try {
        // handleSubmit();
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        // Update Redux with new page number
        dispatcParticipantResponseData({
          ...responseData,
          currentPage: nextPage,
        });
      } catch (error) {
        console.error("Error during pagination:", error);
      }
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      // Update Redux with new page number
      dispatcParticipantResponseData({
        ...responseData,
        currentPage: prevPage,
      });
    }
  };

  const handleSubmit = async (isFinalSubmit = false) => {
    try {
      setNextIsSubmmiting(true);

      if (isFinalSubmit) {
        // If it's the final submit, we can clear the responses
        dispatcClearParticipantResponse();
      }
      setTimeout(() => {
        setNextIsSubmmiting(false);
        navigate("/review-and-edit");
      }, [500]);
    } catch (error) {
      console.error("Error saving responses:", error);
    }
  };

  const previewDataInRedux = (questionListing) => {
    let updatedResponses = [];
    for (let oneQuestion of questionListing) {
      if (oneQuestion?.question_type === "O") {
        if (
          Object.prototype.hasOwnProperty.call(
            oneQuestion,
            "is_user_selected_response"
          )
        ) {
          const response = {
            question_id: oneQuestion.question_id,
            question_type: "O",
            outcome_id: oneQuestion.outcome_id,
            intention_id: oneQuestion.intention_id,
            question_no: oneQuestion.question_no,
            response_selected_type: "Single",
            response_id: oneQuestion?.is_user_selected_response,
            is_skipped: false,
          };
          updatedResponses.push(response);
        }
      } else if (oneQuestion.question_type === "R") {
        const selectedResponses = oneQuestion.response?.filter(
          (r) => r.is_user_selected_response === 1
        );
        if (selectedResponses.length > 0) {
          const response = {
            question_id: oneQuestion.question_id,
            question_type: oneQuestion.question_type,
            outcome_id: oneQuestion.outcome_id,
            intention_id: oneQuestion.intention_id,
            question_no: oneQuestion.question_no,
            response_selected_type: oneQuestion.response_selected_type,
            is_skipped: false,
          };
          if (oneQuestion.response_selected_type === "Rank") {
            response.response_id = selectedResponses.map((r, idx) => ({
              id: r.response_id,
              rank: idx + 1,
              response_name: r.response_name,
              rboeq: r.is_user_selected_rboeq || "",
            }));
          } else {
            response.response_id = selectedResponses.map((r) => ({
              id: r.response_id,
              rboeq: r.is_user_selected_rboeq || "",
            }));
          }
          updatedResponses.push(response);
        }
      } else if (oneQuestion.question_type === "N") {
        let subQuestions = [];

        for (let subQuestion of oneQuestion?.sub_questions) {
          const selectedResponses = subQuestion.response?.filter(
            (r) => r.is_user_selected_response === 1
          );

          let subQuestionObj = {
            question_id: subQuestion?.question_id,
            intention_id: oneQuestion.intention_id,
            response_id: [],
          };

          if (selectedResponses?.length > 0) {
            subQuestionObj.response_id = selectedResponses.map((r) => ({
              id: r.response_id,
              response_name: r.response_name,
              rboeq: r.is_user_selected_rboeq || "",
            }));

            subQuestions.push(subQuestionObj);

            const response = {
              question_type: "N",
              outcome_id: oneQuestion.outcome_id,
              intention_id: oneQuestion.intention_id,
              question_no: oneQuestion.question_no,
              response_selected_type: oneQuestion.response_selected_type,
              sub_questions: subQuestions,
              is_skipped: false,
              question_id: oneQuestion.question_id,
            };

            updatedResponses.push(response);
          }
        }
      } else if (
        oneQuestion.question_type === "D" &&
        !oneQuestion?.is_branch_filter
      ) {
        const selectedResponses = oneQuestion.response?.filter(
          (r) => r.is_user_selected_response === 1
        );
        if (selectedResponses?.length > 0) {
          const response = {
            question_id: oneQuestion.question_id,
            question_type: "D",
            outcome_id: oneQuestion.question_type,
            intention_id: oneQuestion.intention_id,
            question_no: oneQuestion.question_no,
            response_selected_type: oneQuestion.response_selected_type,
            is_branch_filter: Boolean(oneQuestion.is_branch_filter),
            is_skipped: false,
          };
          response.response_id = selectedResponses.map((r) => ({
            id: r.response_id,
          }));

          updatedResponses.push(response);
        }
      }
    }

    dispatcParticipantResponseData({
      surveyID: userData?.surveyID,
      userID: userData?.userID,
      responses: updatedResponses,
    });
  };

  const fetchOutcome = async () => {
    try {
      setShowLoader(true);
      const response = await commonService({
        apiEndPoint: Participant.surveyQuestionList,
        queryParams: {
          companyID: surveyData.companyID,
          surveyID: surveyData.surveyID,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        // Set other state variables
        setOutcomes(response.data.outcomes);

        setSurveyDetails({
          surveyName: response.data?.survey_name,
          surveyIntro: response.data?.introduction,
        });

        // Calculate total questions and pages
        let totalQuestions = 0;
        response.data.outcomes.forEach((outcome) => {
          totalQuestions += outcome.questions.length;
        });

        // eslint-disable-next-line no-shadow
        const questionsPerPage = isMobile
          ? 1
          : response.data.question_per_page || totalQuestions;
        // const questionsPerPage = 20;
        setQuestionsPerPage(questionsPerPage);
        setTotalPages(Math.ceil(totalQuestions / questionsPerPage));

        // Store all questions for pagination
        const allQuestionsArray = response.data.outcomes.flatMap((outcome) =>
          outcome.questions.map((q, i) => {
            if (i === 0 && response?.data?.is_hide_outcome === 0) {
              return {
                ...q,
                outcome_id: outcome.outcome_id,
                hasOutcomeDetails: true,
                outcomeTitle: outcome.outcome_name,
                outcomeDesc: outcome.outcome_definition,
                outcomeColor: outcome.outcome_title_color,
              };
            } else {
              return {
                ...q,
                outcome_id: outcome.outcome_id,
              };
            }
          })
        );

        const addQuestionNoArr = allQuestionsArray.map((ele, idx) => ({
          ...ele,
          question_no: idx + 1,
        }));

        setAllQuestions(addQuestionNoArr);
        previewDataInRedux(addQuestionNoArr);
        setShowLoader(false);
      }
    } catch (error) {
      console.error("Error fetching outcomes:", error);
      setShowLoader(false);
    }
  };

  const fetchOutcomeTitleColor = async () => {
    try {
      const response = await commonService({
        apiEndPoint: QuestionSetup.getOutcomeColor,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setOutcomeColor(
          response?.data?.color.map((data) => ({
            value: data?.colorID,
            label: data?.colorName,
            colorCode: data?.colorCode,
          }))
        );
      } else {
        setOutcomeColor([]);
      }
    } catch (error) {
      console.error("Error add outcome:", error); // Handle error scenarios.
    }
  };

  useEffect(() => {
    fetchOutcome();
    fetchOutcomeTitleColor();
  }, []);

  const renderOutcomeHeading = (outComeDetails) => {
    if (outComeDetails?.outcomeTitle && outComeDetails?.outcomeDesc) {
      const headerColor =
        outcomeColor.find((item) => item.value == outComeDetails.outcomeColor)
          ?.colorCode || "";
      return (
        <div
          className="d-flex flex-column w-100 p-2"
          style={{ backgroundColor: "rgba(245, 245, 245, 0.5)" }}
        >
          <h3 style={{ color: headerColor }}>{outComeDetails?.outcomeTitle}</h3>
          <p>{outComeDetails?.outcomeDesc}</p>
        </div>
      );
    } else {
      null;
    }
  };

  // eslint-disable-next-line no-shadow
  const renderQuestions = () => {
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const questionsForCurrentPage = allQuestions.slice(startIndex, endIndex);
    // const questionsForCurrentPage = allQuestions;

    // Group questions by outcome
    const questionsByOutcome = {};
    questionsForCurrentPage.forEach((question) => {
      if (!questionsByOutcome[question.outcome_id]) {
        questionsByOutcome[question.outcome_id] = {
          outcome_id: question.outcome_id,
          outcome_name: question.outcome_name,
          outcome_definition: question.outcome_definition,
          questions: [],
        };
      }
      questionsByOutcome[question.outcome_id].questions.push(question);
    });

    // Render outcomes with their questions
    return (
      <>
        {Array.isArray(questionsForCurrentPage) &&
          questionsForCurrentPage.length > 0 && (
            <ul className="answerBox_list list-unstyled">
              {questionsForCurrentPage.map((question) => (
                <li key={question.question_id}>
                  {
                    question?.hasOutcomeDetails &&
                      renderOutcomeHeading(question)
                    // <div
                    //   className="d-flex flex-column w-100"
                    //   style={{ backgroundColor: "grey" }}
                    // >
                    //   <h3>{question?.outcomeTitle}</h3>
                    //   <p>{question?.outcomeDesc}</p>
                    // </div>
                  }
                  {question.question_type === "R" && (
                    <SingleRatingResponse
                      data={{
                        ...question,
                        outcome_id: question.outcome_id,
                      }}
                      onResponseChange={handleResponseChange}
                      errors={errors}
                      responses={responses}
                      isEditable={isEditable}
                    />
                  )}
                  {question.question_type === "N" && (
                    <NestedQuestionResponse
                      data={{
                        ...question,
                        outcome_id: question.outcome_id,
                      }}
                      onResponseChange={handleResponseChange}
                      errors={errors}
                      responses={responses}
                      isEditable={isEditable}
                    />
                  )}
                  {question.question_type === "O" && (
                    <OEQResponse
                      data={{
                        ...question,
                        outcome_id: question.outcome_id,
                      }}
                      onResponseChange={handleResponseChange}
                      errors={errors}
                      responses={responses}
                      isEditable={isEditable}
                    />
                  )}
                  {question.question_type === "MR" && (
                    <MultipleResonse
                      data={{
                        ...question,
                        outcome_id: question.outcome_id,
                      }}
                      onResponseChange={handleResponseChange}
                      isEditable={isEditable}
                    />
                  )}

                  {question.question_type === "G" && (
                    <GateQualiferResponse
                      data={{
                        ...question,
                        outcome_id: question.outcome_id,
                      }}
                      onResponseChange={handleResponseChange}
                      responseData={responseData}
                      errors={errors}
                      responses={responses}
                      isEditable={isEditable}
                    />
                  )}

                  {question.question_type === "D" &&
                    !question.is_branch_filter && (
                      <DemographicResponse
                        data={{
                          ...question,
                          outcome_id: question.outcome_id,
                        }}
                        onResponseChange={handleResponseChange}
                        responses={responses}
                        errors={errors}
                        isEditable={isEditable}
                      />
                    )}
                  {question.question_type === "D" &&
                    Boolean(question.is_branch_filter) && (
                      <BranchFilterResponse
                        data={{
                          ...question,
                          outcome_id: question.outcome_id,
                        }}
                        onResponseChange={handleDemoBranchChange}
                        responses={responses}
                        errors={errors}
                        isEditable={isEditable}
                      />
                    )}
                </li>
              ))}
            </ul>
          )}
      </>
    );
  };

  const handleBackPreview = (data) => {
    if (data) {
      setEnableJumpSequence(false);
    }
  };

  useEffect(() => {
    handleClicktoTop();
  }, [currentPage]);

  return (
    <>
      {showLoader ? (
        <div className="participantLoader">
          <Loader />
        </div>
      ) : (
        <Card className="p-3">
          <div className="pageTitle d-flex align-items-center">
            <span
              className="backLink"
              onClick={() => {
                navigate("/review-and-edit");
              }}
            >
              <em className="icon-back" />
            </span>
            <h2 className="mb-0">Back </h2>
          </div>
          {startSurveyClicked ? (
            <div className="preSurveyPage">
              {!enableJumpSequence ? (
                <>
                  <Form>
                    {/* +++++++++  Take Survey 1 ++++++++++ */}
                    <>{renderQuestions(outcomes)}</>

                    <div className="d-flex justify-content-between actionBtn mt-xl-5 mt-4 mb-xl-5 mb-4">
                      <div>
                        <Button
                          className="btn btn-primary questionPreviewBtn"
                          onClick={() => {
                            navigate("/review-and-edit");
                          }}
                          style={{ color: "#ffff" }}
                        >
                          <em className="icon-long-arrow btn-icon left" />
                          Back
                        </Button>
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          className="btn btn-light questionPreviewBtn"
                          onClick={handlePrevious}
                          disabled={currentPage === 1}
                          style={{
                            color: currentPage === 1 ? "#000" : "#ffff",
                          }}
                        >
                          <em className="icon-long-arrow btn-icon left" />
                          Previous
                        </Button>

                        {currentPage === totalPages ? (
                          <Button
                            className="btn btn-primary questionPreviewBtn"
                            onClick={() => {
                              handleSubmit(true);
                            }} // Pass true for final submit
                          >
                            {nextIsSubmitting ? (
                              <>
                                <Spinner
                                  animation="border"
                                  size="sm"
                                  className="me-2"
                                />
                                Finish{" "}
                              </>
                            ) : (
                              <>Finish</>
                            )}
                          </Button>
                        ) : (
                          <Button
                            className="btn btn-primary questionPreviewBtn"
                            onClick={handleNext}
                          >
                            {nextIsSubmitting ? (
                              <>
                                Next{" "}
                                <Spinner
                                  animation="border"
                                  size="sm"
                                  className="ms-2"
                                />
                              </>
                            ) : (
                              <>
                                Next{" "}
                                <em className="icon-long-arrow customNext btn-icon right" />
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Form>
                </>
              ) : (
                <JumpSequncePreview handleBack={handleBackPreview} />
              )}
            </div>
          ) : (
            <>
              {surveyDetails && (
                <IntroductionComp
                  setStartSurveyClicked={setStartSurveyClicked}
                  surveyDetails={surveyDetails}
                />
              )}
            </>
          )}
        </Card>
      )}
    </>
  );
}

const IntroductionComp = ({ setStartSurveyClicked, surveyDetails }) => {
  function stripHtmlTags(str) {
    return str.replace(/<[^>]*>/g, "");
  }
  return (
    <section className=" position-relative h-100">
      <div className="container-fluid h-100">
        <div className="bannerSec_inner d-flex flex-column justify-content-center align-items-center align-items-lg-start">
          <span className="bannerSec_inner_meta">Welcome to</span>
          <h1>
            <span>{surveyDetails?.surveyName}</span>
          </h1>
          <p>
            {surveyDetails?.surveyIntro &&
              stripHtmlTags(surveyDetails?.surveyIntro)}
          </p>
          <p>Please click the start button to continue the survey</p>

          <Button
            onClick={() => {
              setStartSurveyClicked(true);
            }}
            className="btn btn-primary"
          >
            Start Survey{" "}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PreviewSurveysComponent;
