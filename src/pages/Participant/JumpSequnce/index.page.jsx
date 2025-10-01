import React, { useState, useEffect } from "react";
import { Form, Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import useParticipantResponse from "customHooks/useParticipantResponse";
import { useAuth } from "customHooks";
import { Button } from "components";
import participantRouteMap from "routes/Participant/participantRouteMap";
import { showErrorToast } from "helpers/toastHelper";
import { commonService } from "services/common.service";
import { Participant } from "apiEndpoints/Participant";
import { NestedQuestionResponse, SingleRatingResponse } from "../ResponseTypeParticipant";

function JumpSequnce() {
  const navigate = useNavigate();
  const location = useLocation();
  const [questionData, setQuestionData] = useState([]);
  const [responses, setResponses] = useState([]);
  const [errors, setErrors] = useState([]);
  const [nextIsSubmitting, setNextIsSubmmiting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState();

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const { getParticipantResponse, dispatcClearParticipantResponse, dispatcParticipantResponseData } =
    useParticipantResponse();

  const responseData = getParticipantResponse();

  useEffect(() => {
    if (location?.state?.questionsPerPage) {
      setQuestionsPerPage(location?.state?.questionsPerPage);
    }
  }, [location?.state?.questionsPerPage]);

  useEffect(() => {
    if (Object.keys(responseData).length !== 0) {
      if (responseData?.surveyID !== userData?.surveyID || responseData?.userID !== userData?.userID) {
        dispatcClearParticipantResponse();
        setResponses([]);
        setCurrentPage(1);
        // navigate to dash board
        navigate(participantRouteMap.TAKESURVEY.path);
      } else {
        setResponses(responseData?.responses);
        if (Object.keys(questionData).length === 0) {
          let finalQuestion = responseData?.outcomeData?.sequence_question.map((oneData) => {
            let newOneData = { ...oneData }; // Create a new object (Avoid mutation)
            newOneData.outcome_id = responseData?.outcomeData?.outcome_id;
            if (newOneData?.question_type === "N") {
              newOneData.question_no = Number(newOneData?.sub_questions[0]?.question_no);
            } else {
              newOneData.question_no = Number(newOneData.question_no);
            }
            return newOneData; // Return new object
          });
          setQuestionData(finalQuestion);
          let totalQuestions = responseData?.outcomeData?.sequence_question?.length;
          let questionsPerPages = location?.state?.questionsPerPage || questionsPerPage;
          setTotalPages(Math.ceil(totalQuestions / questionsPerPages));
          setCurrentPage(1);
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
      isJumpSequence: true,
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
    setResponses(updatedResponses);
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

  const handleValidationCheck = (errorMessage) => {
    // const currentQuestions = questionData;

    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const currentQuestions = questionData.slice(startIndex, endIndex);

    let errorList = currentQuestions.map((question) => {
      if (question?.question_type === "N") {
        return {
          error: false,
          questionType: question?.question_type,
          subQuestionSubError: (question?.sub_questions || []).map((sub) => ({
            id: sub?.question_id,
            error: false,
          })),

          intention_id: question?.intention_id,
          question_no: question?.question_no,
          outcome_id: question?.outcome_id,
        };
      }

      if (question?.question_type === "MR") {
        return {
          error: false,
          questionType: question?.question_type,
          id: question?.question_id,
          subQuestionSubError: (question?.defining_question_details || []).flatMap((group) =>
            (group?.sub_questions || []).map((sub) => ({
              id: sub?.question_id,
              error: false,
            }))
          ),
          intention_id: question?.intention_id,
          question_no: question?.question_no,
          outcome_id: question?.outcome_id,
        };
      }

      if (question?.question_type === "O") {
        return {
          error: false,
          questionType: question?.question_type,
          id: question?.question_id,
          outcome_id: question?.outcome_id,
        };
      }

      return {
        id: question?.question_id,
        error: false,
        questionType: question?.question_type,
        outcome_id: question?.outcome_id,
      };
    });

    setErrors(errorList);
    let validateCurrentQuestion = false;

    currentQuestions.forEach((question) => {
      if (question?.question_type === "N") {
        const responseObj = responses.find(
          (value) =>
            value?.isJumpSequence &&
            value?.outcome_id === question?.outcome_id &&
            value?.intention_id === question?.intention_id &&
            Array.isArray(question?.sub_questions) &&
            Array.isArray(value.sub_questions) &&
            value.sub_questions.some((respSubQ) =>
              question?.sub_questions?.some((dataSubQ) => respSubQ.question_id === dataSubQ.question_id)
            )
        );

        // const errorIndex = errorList.findIndex((e) => e.question_no === question?.question_no);
        const errorIndex = errorList.findIndex(
          (value) =>
            value?.outcome_id === question?.outcome_id &&
            value?.intention_id === question?.intention_id &&
            Array.isArray(question?.sub_questions) &&
            Array.isArray(value.subQuestionSubError) &&
            value.subQuestionSubError.some((respSubQ) =>
              question?.sub_questions?.some((dataSubQ) => respSubQ.id === dataSubQ.question_id)
            )
        );
        if (errorIndex !== -1) {
          let errorEntry = { ...errorList[errorIndex] };

          // Check if the question is skipped
          if (responseObj?.is_skipped) {
            errorEntry.error = false;
            errorEntry.subQuestionSubError = errorEntry.subQuestionSubError.map((sub) => ({
              ...sub,
              error: false,
            }));
          } else {
            question?.sub_questions.forEach((sub) => {
              const subErrorIndex = errorEntry.subQuestionSubError.findIndex((se) => se.id === sub.question_id);
              if (subErrorIndex !== -1) {
                const hasResponse = responseObj?.sub_questions.some(
                  (r) => r?.question_id === sub.question_id && r?.response_id?.length > 0
                );
                errorEntry.subQuestionSubError[subErrorIndex].error = !hasResponse;
              }
            });
            errorEntry.error = errorEntry.subQuestionSubError.some((sub) => sub.error);
          }
          errorList[errorIndex] = errorEntry;
        }
      } else if (question?.question_type === "O") {
        const hasResponse = responses.find((r) => r?.question_id === question?.question_id);

        const errorIndex = errorList.findIndex((e) => e.id === question?.question_id);

        if (hasResponse && hasResponse?.response_id !== "") {
          errorList[errorIndex].error = false;
        } else if (hasResponse && hasResponse?.is_skipped) {
          errorList[errorIndex].error = false;
        } else {
          errorList[errorIndex].error = true;
        }
      } else if (question.question_type === "D" && Boolean(question.is_branch_filter)) {
        const hasResponse = responses.find((r) => r?.question_id === question?.question_id);

        const errorIndex = errorList.findIndex((e) => e.id === question?.question_id);

        if (hasResponse && hasResponse?.response_id?.length === hasResponse?.maxLevel) {
          errorList[errorIndex].error = false;
        } else if (hasResponse?.is_skipped) {
          errorList[errorIndex].error = false;
        } else {
          errorList[errorIndex].error = true;
        }
      } else if (question.question_type === "MR") {
        const errorIndex = errorList.findIndex((e) => e.id === question?.question_id);

        const responseObj = responses.find((r) => r.question_no === question?.question_no);

        if (errorIndex !== -1) {
          let errorEntry = { ...errorList[errorIndex] };

          (question?.defining_question_details || []).forEach((group) => {
            (group?.sub_questions || []).forEach((sub) => {
              const subErrorIndex = errorEntry.subQuestionSubError.findIndex((se) => se.id === sub.question_id);

              if (subErrorIndex !== -1) {
                const hasResponse = responseObj?.sub_questions?.some((r) => r?.question_id === sub.question_id);

                errorEntry.subQuestionSubError[subErrorIndex].error = !hasResponse;
              }
            });
          });

          errorEntry.error = errorEntry.subQuestionSubError.some((sub) => sub.error);
          errorList[errorIndex] = errorEntry;
        }
      } else if (question?.question_type === "R") {
        const hasResponse = responses.find((r) => r?.question_id === question?.question_id);
        const errorIndex = errorList.findIndex((e) => e.id === question?.question_id);
        if (hasResponse && hasResponse?.response_id?.length !== 0) {
          errorList[errorIndex].error = false;
        } else if (hasResponse && hasResponse?.is_skipped) {
          errorList[errorIndex].error = false;
        } else {
          errorList[errorIndex].error = true;
        }
      } else {
        const hasResponse = responses.some((r) => r?.question_id === question?.question_id);

        const errorIndex = errorList.findIndex((e) => e.id === question?.question_id);
        if (errorIndex !== -1) {
          errorList[errorIndex].error = !hasResponse;
        }
      }
    });

    validateCurrentQuestion = errorList.some((item) => item.error === true);

    if (validateCurrentQuestion) {
      showErrorToast(errorMessage ? errorMessage : "Kindly complete all fields to proceed.");
    }
    setErrors(errorList);
    return errorList;

    // return validateCurrentQuestion;
  };

  const handleSubmitAPI = async () => {
    try {
      const currentPageResponses = responses.filter((response) => {
        return questionData.some(
          (question) =>
            (question?.question_type === "N"
              ? question.intention_id === response.intention_id
              : question.question_id === response.question_id) && question.question_no === response.question_no
        );
      });
      setNextIsSubmmiting(true);
      const endpoint = Participant.insertResponse;
      const payload = {
        companyID: userData?.companyID,
        companyMasterID: userData?.companyMasterID,
        surveyID: userData?.surveyID,
        userID: userData?.userID,
        departmentID: userData?.departmentID,
        questions: currentPageResponses,
      };

      const response = await commonService({
        apiEndPoint: endpoint,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status && currentPage === totalPages) {
        navigate(participantRouteMap.TAKESURVEY.path);
      }
      setNextIsSubmmiting(false);
    } catch (error) {
      console.error("Error saving responses:", error);
    }
  };

  // const handleSubmit = () => {
  //   // add validation , and if user fills all response redirect to take surevy page
  //   const errorList = handleValidationCheck();
  //   const hasError = errorList?.some((e) => e.error);
  //   if (!hasError) {
  //     handleSubmitAPI();
  //   } else {
  //     // Find the first error in the errors state
  //     const firstErrorIndex = errorList.findIndex((e) => e.error);
  //     if (firstErrorIndex !== -1) {
  //       const errorObj = errorList[firstErrorIndex];
  //       const errorId = errorObj.id || errorObj.question_no;
  //       const errorOutcomeId = errorObj.outcome_id;
  //       const errorElement = document.getElementById(`question-container-${errorOutcomeId}-${errorId}`);
  //       if (errorElement) {
  //         errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
  //         errorElement.focus?.();
  //       }
  //     }
  //   }
  // };

  // const handlePrevious = () => {
  //   // do not check for validations , redirect to take surevy page
  //   let errorMessage = "Kindly complete all fields to go back.";
  //   const errorList = handleValidationCheck(errorMessage);
  //   const hasError = errorList?.some((e) => e.error);
  //   if (!hasError) {
  //     navigate(participantRouteMap.TAKESURVEY.path);
  //   } else {
  //     // Find the first error in the errors state
  //     const firstErrorIndex = errorList.findIndex((e) => e.error);
  //     if (firstErrorIndex !== -1) {
  //       const errorObj = errorList[firstErrorIndex];
  //       const errorId = errorObj.id || errorObj.question_no;
  //       const errorOutcomeId = errorObj.outcome_id;
  //       const errorElement = document.getElementById(`question-container-${errorOutcomeId}-${errorId}`);
  //       if (errorElement) {
  //         errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
  //         errorElement.focus?.();
  //       }
  //     }
  //   }
  // };

  const handleNext = async () => {
    const errorList = handleValidationCheck();
    const hasError = errorList?.some((e) => e.error);
    if (!hasError) {
      if (currentPage <= totalPages) {
        try {
          await handleSubmitAPI();
          if (currentPage < totalPages) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        } catch (error) {
          console.error("Error during pagination:", error);
        }
      }
    } else {
      // Find the first error in the errors state
      const firstErrorIndex = errorList.findIndex((e) => e.error);
      if (firstErrorIndex !== -1) {
        const errorObj = errorList[firstErrorIndex];
        const errorId = errorObj.id || errorObj.question_no;
        const errorOutcomeId = errorObj.outcome_id;
        const errorElement = document.getElementById(`question-container-${errorOutcomeId}-${errorId}`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          errorElement.focus?.();
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      // setCurrentPage((prev) => prev - 1);
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
    } else {
      let errorMessage = "Kindly complete all fields to go back.";
      const errorList = handleValidationCheck(errorMessage);
      const hasError = errorList?.some((e) => e.error);
      if (hasError) {
        // Find the first error in the errors state
        const firstErrorIndex = errorList.findIndex((e) => e.error);
        if (firstErrorIndex !== -1) {
          const errorObj = errorList[firstErrorIndex];
          const errorId = errorObj.id || errorObj.question_no;
          const errorOutcomeId = errorObj.outcome_id;
          const errorElement = document.getElementById(`question-container-${errorOutcomeId}-${errorId}`);
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
            errorElement.focus?.();
          }
        }
      }
    }
  };
  const renderQuestions = () => {
    if (questionData?.length === 0) return null;
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const questionsForCurrentPage = questionData.slice(startIndex, endIndex);
    return (
      <>
        <div className="answerBox">
          {/* <div className="answerBox_head">
            <p>{questionData.question}</p>
          </div> */}
          <ul className="answerBox_list list-unstyled">
            {questionsForCurrentPage?.map((seqQuestion) => {
              const enrichedQuestion = {
                ...seqQuestion,
                sl_no: seqQuestion.sequence_question_sl_no,
                outcome_id: responseData?.outcomeData?.outcome_id,
                skipText: responseData?.outcomeData?.skipText || "",
              };

              return (
                <li key={seqQuestion.question_id}>
                  {seqQuestion.question_type === "R" && (
                    <SingleRatingResponse
                      data={enrichedQuestion}
                      onResponseChange={handleResponseChange}
                      responses={responses}
                      errors={errors}
                    />
                  )}

                  {seqQuestion.question_type === "N" && (
                    <NestedQuestionResponse
                      data={enrichedQuestion}
                      onResponseChange={handleResponseChange}
                      responses={responses}
                      errors={errors}
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

          {/* <div className="d-flex justify-content-between actionBtn mt-xl-5 mt-4 mb-xl-5 mb-4">
            <Button className="btn btn-light" onClick={handlePrevious}>
              <em className="icon-arrow-prev btn-icon left" />
              Previous
            </Button>

            <Button className="btn btn-primary" onClick={handleSubmit}>
              {nextIsSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Finish Jump Sequence{" "}
                </>
              ) : (
                <> Finish Jump Sequence</>
              )}
            </Button>
          </div> */}

          <div
            className={`d-flex justify-content-${
              currentPage > 1 ? "between" : "end"
            } actionBtn mt-xl-5 mt-4 mb-xl-5 mb-4`}
          >
            {currentPage > 1 && (
              <Button className="btn btn-light" onClick={handlePrevious} disabled={currentPage === 1}>
                <em className="icon-arrow-prev btn-icon left" />
                Previous
              </Button>
            )}

            <Button className="btn btn-primary" onClick={handleNext}>
              {nextIsSubmitting ? (
                <>
                  {currentPage === totalPages ? "Finish" : "Next"}{" "}
                  <Spinner animation="border" size="sm" className="ms-2" />
                </>
              ) : (
                <>
                  {currentPage === totalPages ? "Finish" : "Next"} <em className="icon-arrow-next btn-icon right" />
                </>
              )}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export default JumpSequnce;
