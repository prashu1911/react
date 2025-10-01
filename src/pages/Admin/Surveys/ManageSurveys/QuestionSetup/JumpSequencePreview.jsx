import React, { useState, useEffect } from "react";
import { Form, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import useParticipantResponse from "customHooks/useParticipantResponse";
import { useAuth } from "customHooks";
import { Button } from "components";
import participantRouteMap from "routes/Participant/participantRouteMap";
import { NestedQuestionResponse, SingleRatingResponse } from "pages/Participant/ResponseTypeParticipant";

function JumpSequncePreview(props) {
  const { handleBack } = props;
  const [questionData, setQuestionData] = useState([]);
  const [responses, setResponses] = useState([]);
  const [errors, setErrors] = useState([]);
  const [nextIsSubmitting, setNextIsSubmmiting] = useState(false);
  const [isEditable] = useState(true);

  let navigate = useNavigate();

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const { getParticipantResponse, dispatcClearParticipantResponse, dispatcParticipantResponseData } =
    useParticipantResponse();

  const responseData = getParticipantResponse();

  useEffect(() => {
    if (Object.keys(responseData).length !== 0) {
      if (responseData?.surveyID !== userData?.surveyID || responseData?.userID !== userData?.userID) {
        dispatcClearParticipantResponse();
        setResponses([]);
        // navigate to dash board
        navigate(participantRouteMap.TAKESURVEY.path);
      } else {
        setResponses(responseData?.responses);
        if (Object.keys(questionData).length === 0) {
          let finalQuestion = responseData?.outcomeData?.sequence_question.map((oneData,index) => {
            let newOneData = { ...oneData }; // Create a new object (Avoid mutation)

            if (newOneData?.question_type === "N") {
              newOneData.question_no = responseData?.outcomeData.question_no ? responseData?.outcomeData.question_no + `.${index + 1}` : Number(newOneData?.sub_questions[0]?.question_no);
            } else {
              newOneData.question_no = responseData?.outcomeData.question_no ? responseData?.outcomeData.question_no + `.${index + 1}` : Number(newOneData.question_no);
            }

            return newOneData; // Return new object
          });

          setQuestionData(finalQuestion);
        }
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
        r.question_no === newResponse.question_no &&
        r.outcome_id === newResponse.outcome_id &&
        (r.question_type === "N" || r.question_type === "MR" ? true : r.question_id === newResponse.question_id)
    );

    if (existingIndex >= 0) {
      if (newResponse.question_type === "N" || newResponse.question_type === "MR") {
        // Create a new copy of the existing response
        let existingResponse = {
          ...updatedResponses[existingIndex],
          sub_questions: [...(updatedResponses[existingIndex].sub_questions || [])],
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
        ...responseData,
        responses: updatedResponses,
      });
    }
  };

  const handleSubmit = () => {
    handleBack(true);
  };

  const handlePrevious = () => {
    handleBack(true);
  };

  const renderQuestions = () => {
    if (questionData?.length === 0) return null;

    return (
      <>
        <div className="answerBox">
          <div className="answerBox_head">
            <p>{questionData.question}</p>
          </div>
         
          <ul className="answerBox_list list-unstyled">
            {questionData?.map((seqQuestion) => {
              const enrichedQuestion = {
                ...seqQuestion,
                sl_no: seqQuestion.sequence_question_sl_no,
                outcome_id: responseData?.outcomeData?.outcome_id,
              };

              return (
                <li key={seqQuestion.question_id}>
                  {seqQuestion.question_type === "R" && (
                    <SingleRatingResponse
                      data={enrichedQuestion}
                      onResponseChange={handleResponseChange}
                      responses={responses}
                      errors={errors}
                      isEditable={isEditable}
                    />
                  )}

                  {seqQuestion.question_type === "N" && (
                    <NestedQuestionResponse
                      data={enrichedQuestion}
                      onResponseChange={handleResponseChange}
                      responses={responses}
                      errors={errors}
                      isEditable={isEditable}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <hr />
      </>
    );
  };

  return (
    <>
      {/* <section>
        <div className="pageTitle d-flex align-items-center">
          <Link
            className="backLink"
            href="/metolius/admin/question-setup#!"
            onClick={() => {
              handleBack(true);
            }}
          >
            <em className="icon-back" />
          </Link>
          <h2 className="mb-0">Back </h2>
        </div>
      </section> */}
      <section className="commonBanner position-relative survey-details-banner">
        <div className="container">
          <div className="d-flex justify-content-sm-between flex-sm-row flex-column align-items-xl-start align-items-center">
            <div className="commonBanner_inner">
              <h1>Jump Sequence Questions</h1>
              <p className="mb-0">Please answer the following sequence questions</p>
            </div>
          </div>
        </div>
      </section>
      <section className="pt-4 pt-xl-5">
        <div className="container">
          <Form>{renderQuestions()}</Form>

          <div className="d-flex justify-content-between actionBtn mt-xl-5 mt-4 mb-xl-5 mb-4">
            <Button className="btn btn-light questionPreviewBtn" onClick={handlePrevious}>
              <em className="icon-long-arrow btn-icon left" />
              Previous
            </Button>

            <Button className="btn btn-primary questionPreviewBtn" onClick={handleSubmit}>
              {nextIsSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Finish Jump Sequence{" "}
                </>
              ) : (
                <> Finish Jump Sequence</>
              )}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export default JumpSequncePreview;
