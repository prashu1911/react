import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { commonService } from "services/common.service";
import { useAuth } from "customHooks";
import { Participant } from "apiEndpoints/Participant";
import { Button, Loader } from "components";
import useParticipantResponse from "customHooks/useParticipantResponse";
import { useNavigate } from "react-router-dom";
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

function PreviewSurveys({ surveyID, companyID, setPreviewQuestionSetup }) {
  const [allQuestions, setAllQuestions] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [errors] = useState([]);

  let navigate = useNavigate();

  const [outcomes, setOutcomes] = useState([]);

  const {
    dispatcParticipantResponseData,
    getParticipantResponse,
    dispatcClearParticipantResponse,
  } = useParticipantResponse();

  const responseData = getParticipantResponse();

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [isEditable] = useState(userData?.roleName !== "Master Admin");

  const [responses, setResponses] = useState([]);

  useEffect(() => {
    if (userData?.roleName !== "Master Admin") {
      if (Object.keys(responseData).length !== 0) {
        if (
          responseData?.surveyID !== userData?.surveyID ||
          responseData?.userID !== userData?.userID
        ) {
          dispatcClearParticipantResponse();
          setResponses([]);
        } else {
          setResponses(responseData?.responses);
          // Update progress when responses change
          // eslint-disable-next-line no-use-before-define
        }
      } else {
        dispatcParticipantResponseData({
          surveyID: userData?.surveyID,
          userID: userData?.userID,
          responses: [],
        });
      }
    }
  }, [responseData]);

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

    if (newResponse.question_type === "G") {
      // here assume i have choosen Yes at the time of question creation , so on NO i have to redirect to jump sequence.
      if (gateResponseId !== gateQuestionData?.jump_response_id) {
        dispatcParticipantResponseData({
          ...responseData,
          responses: updatedResponses,
          outcomeData: gateQuestionData,
        });
        // I have to add this small setTimeout, only because Redux is not updating and it's navigating first.
        setTimeout(() => {
          navigate(participantRouteMap.JUMPSEQUENCE.path);
        }, 150);
      } else {
        dispatcParticipantResponseData({
          ...responseData,
          responses: updatedResponses,
          outcomeData: gateQuestionData,
        });
      }
    } else {
      dispatcParticipantResponseData({
        surveyID: userData?.surveyID,
        userID: userData?.userID,
        responses: updatedResponses,
      });
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
          companyID,
          surveyID,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        // Set other state variables
        setOutcomes(response.data.outcomes);

        // Store all questions for pagination
        const allQuestionsArray = response.data.outcomes.flatMap((outcome) =>
          outcome.questions.map((q) => ({
            ...q,
            outcome_id: outcome.outcome_id,
          }))
        );

        setAllQuestions(allQuestionsArray);
        previewDataInRedux(allQuestionsArray);
        setShowLoader(false);
      }
    } catch (error) {
      console.error("Error fetching outcomes:", error);
      setShowLoader(false);
    }
  };

  useEffect(() => {
    fetchOutcome();
  }, []);

  // eslint-disable-next-line no-shadow
  const renderQuestions = () => {
    const questionsForCurrentPage = allQuestions;

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
    return Object.values(questionsByOutcome).map((outcome) => (
      <React.Fragment key={outcome.outcome_id}>
        <div className="answerBox">
          <div className="answerBox_head">
            <h3>{outcome.outcome_name}</h3>
            <p>{outcome.outcome_definition}</p>
          </div>
          <ul className="answerBox_list list-unstyled">
            {outcome.questions.map((question) => (
              <li key={question.question_id}>
                {question.question_type === "R" && (
                  <SingleRatingResponse
                    data={{
                      ...question,
                      outcome_id: outcome.outcome_id,
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
                      outcome_id: outcome.outcome_id,
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
                      outcome_id: outcome.outcome_id,
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
                      outcome_id: outcome.outcome_id,
                    }}
                    onResponseChange={handleResponseChange}
                    isEditable={isEditable}
                  />
                )}

                {question.question_type === "G" && (
                  <GateQualiferResponse
                    data={{
                      ...question,
                      outcome_id: outcome.outcome_id,
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
                        outcome_id: outcome.outcome_id,
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
                        outcome_id: outcome.outcome_id,
                      }}
                      onResponseChange={handleResponseChange}
                      responses={responses}
                      errors={errors}
                      isEditable={isEditable}
                    />
                  )}
              </li>
            ))}
          </ul>
        </div>
        <hr />
      </React.Fragment>
    ));
  };

  return (
    <>
      {showLoader ? (
        <div className="participantLoader">
          <Loader />
        </div>
      ) : (
        <>
          <div className="preSurveyPage">
            <Button
              onClick={() => {
                setPreviewQuestionSetup(false);
              }}
            >
              Back
            </Button>
            <Form>
              {/* +++++++++  Take Survey 1 ++++++++++ */}
              <>{renderQuestions(outcomes)}</>
            </Form>
          </div>
        </>
      )}
    </>
  );
}

export default PreviewSurveys;
