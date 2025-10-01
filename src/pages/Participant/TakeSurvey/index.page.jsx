import React, { useState, useEffect, useMemo } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import Chart from "react-apexcharts";
import { commonService } from "services/common.service";
import { useAuth } from "customHooks";
import { Participant } from "apiEndpoints/Participant";
import { Loader } from "components";
import useParticipantResponse from "customHooks/useParticipantResponse";
import { useNavigate } from "react-router-dom";
import participantRouteMap from "routes/Participant/participantRouteMap";
import { showErrorToast } from "helpers/toastHelper";
import {
  BranchFilterResponse,
  MultipleResonse,
  NestedQuestionResponse,
  OEQResponse,
  SingleRatingResponse,
} from "../ResponseTypeParticipant";
import DemographicResponse from "../ResponseTypeParticipant/DemographicResponse";
import GateQualiferResponse from "../ResponseTypeParticipant/GateQualiferResponse";

function TakeSurvey() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [questionsPerPage, setQuestionsPerPage] = useState();
  const [allQuestions, setAllQuestions] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [errors, setErrors] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [surveyName, setSurveyName] = useState("");
  const [progressPercentage, setProgressPercentage] = useState(null);
  const [nextIsSubmitting, setNextIsSubmmiting] = useState(false);
  const [isHideOutcome, setIsHideOutcome] = useState("");
  const [skipNowCustomText, setSkipNowCustomText] = useState("");
  const [otherLanguage, setOtherLanguage] = useState(false);

  let navigate = useNavigate();

  // Check for mobile or web view
  const isMobile = useIsMobile();

  // range slider active class add end
  // add modal
  const [showAddDep, setShowAddDep] = useState(false);
  const adddepClose = () => setShowAddDep(false);
  // const [responses, setResponses] = useState([]);
  

  // edit modal
  const [showEditDep, setShowEditDep] = useState(false);
  const editdepClose = () => {
    setShowEditDep(false);
    navigate(participantRouteMap.PROGRESSDASHBOARD.path);
  };
  const editdepShow = () => setShowEditDep(true);

  const [outcomes, setOutcomes] = useState([]);

  const {
    dispatcParticipantResponseData,
    getParticipantResponse,
    dispatcClearParticipantResponse,
  } = useParticipantResponse();

  const responseData = getParticipantResponse();

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const [responses, setResponses] = useState([]);
  const skippedCount = useMemo(
    () => responses.filter(r => r.is_skipped).length,
    [responses]
  );
  useEffect(() => {
    if (Object.keys(responseData).length !== 0) {
      if (
        responseData?.surveyID !== userData?.surveyID ||
        responseData?.userID !== userData?.userID
      ) {
        dispatcClearParticipantResponse();
        setResponses([]);
        setCurrentPage(1);
      } else {
        // Set responses from Redux
        if (responseData?.responses && responseData.responses.length > 0) {
          setResponses(responseData.responses);
        }
        // Set current page from Redux if available
        if (responseData?.currentPage) {
          setCurrentPage(responseData.currentPage);
        }
        // Update progress when responses change
        // const newProgress = calculateProgress();
        // if (typeof newProgress === "number" && newProgress >= 0 && newProgress <= 100) {
        //   setProgressPercentage(newProgress);
        // }
      }
    } else {
      dispatcParticipantResponseData({
        surveyID: userData?.surveyID,
        userID: userData?.userID,
        responses: [],
        currentPage: 1,
      });
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
        setTimeout(() => {
          navigate(participantRouteMap.JUMPSEQUENCE.path, {
            state: { questionsPerPage },
          });
        }, 150);
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

  const handleSubmit = async (isFinalSubmit = false) => {
    try {
      setNextIsSubmmiting(true);
      const endpoint = Participant.insertResponse;

      // Get questions for current page
      const startIndex = (currentPage - 1) * questionsPerPage;
      const endIndex = startIndex + questionsPerPage;
      const currentPageQuestions = allQuestions.slice(startIndex, endIndex);
      // console.log(currentPageQuestions, "currentPageQuestions");
      // console.log(responses, "responses");
      // Get responses for current page questions
      const currentPageResponses = responses.filter((response) => {
        // Check if this response's question exists in currentPageQuestions
        return currentPageQuestions.some(
          (question) =>
            (question?.question_type === "N"
              ? question.intention_id === response.intention_id
              : question.question_id === response.question_id) &&
            question.question_no === response.question_no
        );
      });
      const payload = {
        companyID: userData?.companyID,
        companyMasterID: userData?.companyMasterID,
        surveyID: userData?.surveyID,
        userID: userData?.userID,
        departmentID: userData?.departmentID,
        // questions: responses,
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
      if (response?.status && isFinalSubmit) {
        // eslint-disable-next-line no-use-before-define
        await finishSurvey(); // Call finishSurvey after successful submit
        // editdepShow();  Show success modal after finishSurvey
      }
      setProgressPercentage(response?.data?.completed_percentage);
      setNextIsSubmmiting(false);
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
          }
        }
        if (subQuestions?.length > 0) {
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
            outcome_id: oneQuestion.outcome_id,
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
      } else if (oneQuestion.question_type === "MR") {
        let subQuestions = [];

        for (let oneMultiResponse of oneQuestion?.defining_question_details) {
          for (let subQuestion of oneMultiResponse?.sub_questions) {
            const selectedResponses = subQuestion.response?.filter(
              (r) => r.is_user_selected_response === 1
            );

            let subQuestionObj = {
              question_id: subQuestion?.question_id,
              intention_id: subQuestion?.intention_id,
              response_id: [],
            };

            if (selectedResponses?.length > 0) {
              subQuestionObj.response_id = selectedResponses.map((r) => ({
                id: r.response_id,
                response_name: r.response_name,
                intention_id: subQuestion?.intention_id,
                rboeq: r.is_user_selected_rboeq || "",
              }));

              subQuestions.push(subQuestionObj);
            }
          }
        }
        const response = {
          question_type: "MR",
          outcome_id: oneQuestion.outcome_id,
          question_no: oneQuestion.question_no,
          response_selected_type: oneQuestion.response_selected_type,
          sub_questions: subQuestions.map((item) => ({
            intention_id: item.intention_id,
            question_no: oneQuestion.question_no,
            question_id: item.question_id,
            // eslint-disable-next-line no-shadow
            response_id: item.response_id.map((response) => ({
              id: response.id,
              rboeq: response.rboeq || "",
            })),
          })),
          is_skipped: false,
          question_id: oneQuestion.question_id, // Include question_id here
        };

        updatedResponses.push(response);
      } else if (oneQuestion.question_type === "G") {
        const selectedResponses = oneQuestion.response?.filter(
          (r) => r.is_user_selected_response === 1
        );
        if (selectedResponses.length > 0) {
          const response = {
            question_id: oneQuestion.question_id,
            question_type: "G",
            outcome_id: oneQuestion.outcome_id,
            intention_id: oneQuestion.intention_id,
            question_no: oneQuestion.question_no,
            response_selected_type: "Single",
            is_skipped: false,
          };
          response.response_id = selectedResponses.map((r) => ({
            id: r.response_id,
            rboeq: r.is_user_selected_rboeq || "",
          }));

          updatedResponses.push(response);
        }

        for (let oneSubQuestion of oneQuestion?.sequence_question) {
          if (oneSubQuestion.question_type === "R") {
            // eslint-disable-next-line no-shadow
            const selectedResponses = oneSubQuestion.response?.filter(
              (r) => r.is_user_selected_response === 1
            );
            if (selectedResponses.length > 0) {
              const response = {
                question_id: oneSubQuestion.question_id,
                question_type: oneSubQuestion.question_type,
                outcome_id: oneQuestion.outcome_id,
                intention_id: oneSubQuestion.intention_id,
                question_no: Number(oneSubQuestion.question_no),
                // question_no: oneSubQuestion.sequence_question_sl_no,
                response_selected_type: oneSubQuestion.response_selected_type,
                is_skipped: false,
              };
              if (oneSubQuestion.response_selected_type === "Rank") {
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
          } else if (oneSubQuestion.question_type === "N") {
            let subQuestions = [];

            for (let subQuestion of oneSubQuestion?.sub_questions) {
              // eslint-disable-next-line no-shadow
              const selectedResponses = subQuestion.response?.filter(
                (r) => r.is_user_selected_response === 1
              );

              let subQuestionObj = {
                question_id: subQuestion?.question_id,
                intention_id: oneSubQuestion.intention_id,
                response_id: [],
              };

              if (selectedResponses?.length > 0) {
                subQuestionObj.response_id = selectedResponses.map((r) => ({
                  id: r.response_id,
                  response_name: r.response_name,
                  rboeq: r.is_user_selected_rboeq || "",
                }));

                subQuestions.push(subQuestionObj);
              }
            }
            if (subQuestions?.length > 0) {
              const response = {
                question_type: "N",
                outcome_id: oneQuestion.outcome_id,
                intention_id: oneSubQuestion.intention_id,
                question_no: Number(
                  oneSubQuestion?.sub_questions[0].question_no
                ),
                // question_no: oneSubQuestion.sequence_question_sl_no,
                response_selected_type: oneSubQuestion.response_selected_type,
                sub_questions: subQuestions,
                is_skipped: false,
                question_id: oneSubQuestion.question_id,
              };

              updatedResponses.push(response);
            }
          }
        }
      }
    }
    dispatcParticipantResponseData({
      surveyID: userData?.surveyID,
      userID: userData?.userID,
      responses: updatedResponses,
    });
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

  const fetchOutcome = async () => {
    try {
      setShowLoader(true);
      const response = await commonService({
        apiEndPoint: Participant.fetchQuestionList,
        queryParams: {
          companyID: userData?.companyID,
          surveyID: userData?.surveyID,
          departmentID: userData?.departmentID,
          userID: userData?.userID,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        // Set other state variables
        setOutcomes(response.data.outcomes);
        setCompanyName(response.data.company_name);
        setDepartmentName(response.data.department_name);
        setSurveyName(response.data.survey_name);
        setIsHideOutcome(response.data.is_hide_outcome);
        setProgressPercentage(response.data.progress_percentage);
        setSkipNowCustomText(response.data.language_text);
        setOtherLanguage(response.data.other_language);
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
          outcome.questions.map((q) => ({
            ...q,
            outcome_id: outcome.outcome_id,
            outcome_name: outcome.outcome_name,
            outcome_definition: outcome.outcome_definition,
            outcome_title_color: outcome.outcome_title_color,
          }))
        );
        setAllQuestions(allQuestionsArray);
        // Only preview data in Redux if there are no existing responses
        if (!responseData?.responses || responseData.responses.length === 0) {
          previewDataInRedux(allQuestionsArray);
        }
        setShowLoader(false);
      }
    } catch (error) {
      console.error("Error fetching outcomes:", error);
      setShowLoader(false);
    }
  };

  const handleValidationCheck = () => {
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const currentQuestions = allQuestions.slice(startIndex, endIndex);
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
          subQuestionSubError: (
            question?.defining_question_details || []
          ).flatMap((group) =>
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
        // const responseObj = responses.find((r) => r.question_no === question?.question_no);
        const responseObj = responses.find(
          (value) =>
            value?.outcome_id === question?.outcome_id &&
            value?.intention_id === question?.intention_id &&
            Array.isArray(question?.sub_questions) &&
            Array.isArray(value.sub_questions) &&
            value.sub_questions.some((respSubQ) =>
              question?.sub_questions?.some(
                (dataSubQ) => respSubQ.question_id === dataSubQ.question_id
              )
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
              question?.sub_questions?.some(
                (dataSubQ) => respSubQ.id === dataSubQ.question_id
              )
            )
        );
        if (errorIndex !== -1) {
          let errorEntry = { ...errorList[errorIndex] };

          // Check if the question is skipped
          if (responseObj?.is_skipped) {
            errorEntry.error = false;
            errorEntry.subQuestionSubError = errorEntry.subQuestionSubError.map(
              (sub) => ({
                ...sub,
                error: false,
              })
            );
          } else {
            question?.sub_questions.forEach((sub) => {
              const subErrorIndex = errorEntry.subQuestionSubError.findIndex(
                (se) => se.id === sub.question_id
              );
              if (subErrorIndex !== -1) {
                const hasResponse = responseObj?.sub_questions.some(
                  (r) =>
                    r?.question_id === sub.question_id &&
                    r?.response_id?.length > 0
                );
                errorEntry.subQuestionSubError[subErrorIndex].error =
                  !hasResponse;
              }
            });
            errorEntry.error = errorEntry.subQuestionSubError.some(
              (sub) => sub.error
            );
          }
          errorList[errorIndex] = errorEntry;
        }
      } else if (question?.question_type === "O") {
        const hasResponse = responses.find(
          (r) => r?.question_id === question?.question_id
        );

        const errorIndex = errorList.findIndex(
          (e) => e.id === question?.question_id
        );

        if (hasResponse && hasResponse?.response_id !== "") {
          errorList[errorIndex].error = false;
        } else if (hasResponse && hasResponse?.is_skipped) {
          errorList[errorIndex].error = false;
        } else {
          errorList[errorIndex].error = true;
        }
      } else if (
        question.question_type === "D" &&
        Boolean(question.is_branch_filter)
      ) {
        const hasResponse = responses.find(
          (r) => r?.question_id === question?.question_id
        );
        const errorIndex = errorList.findIndex(
          (e) => e.id === question?.question_id
        );

        if (
          hasResponse &&
          hasResponse?.response_id?.length === hasResponse?.maxLevel
        ) {
          errorList[errorIndex].error = false;
        } else if (hasResponse?.is_skipped) {
          errorList[errorIndex].error = false;
        } else {
          errorList[errorIndex].error = true;
        }
      } else if (
        question.question_type === "D" &&
        !Boolean(question.is_branch_filter)
      ) {
        const hasResponse = responses.find(
          (r) => r?.question_id === question?.question_id
        );
        const errorIndex = errorList.findIndex(
          (e) => e.id === question?.question_id
        );

        if (hasResponse && hasResponse?.response_id?.length) {
          errorList[errorIndex].error = false;
        } else if (hasResponse?.is_skipped) {
          errorList[errorIndex].error = false;
        } else {
          errorList[errorIndex].error = true;
        }
      } else if (question.question_type === "MR") {
        const errorIndex = errorList.findIndex(
          (e) => e.id === question?.question_id
        );
        const responseObj = responses.find(
          (r) => r.question_no === question?.question_no
        );
        if (errorIndex !== -1) {
          let errorEntry = { ...errorList[errorIndex] };

          // Check if the question is skipped
          if (responseObj?.is_skipped) {
            errorEntry.error = false;
            errorEntry.subQuestionSubError = errorEntry.subQuestionSubError.map(
              (sub) => ({
                ...sub,
                error: false,
              })
            );
          } else {
            (question?.defining_question_details || []).forEach((group) => {
              (group?.sub_questions || []).forEach((sub) => {
                const subErrorIndex = errorEntry.subQuestionSubError.findIndex(
                  (se) => se.id === sub.question_id
                );

                if (subErrorIndex !== -1) {
                  const hasResponse = responseObj?.sub_questions?.some(
                    (r) =>
                      r?.question_id === sub.question_id &&
                      r?.response_id?.length > 0
                  );

                  errorEntry.subQuestionSubError[subErrorIndex].error =
                    !hasResponse;
                }
              });
            });

            errorEntry.error = errorEntry.subQuestionSubError.some(
              (sub) => sub.error
            );
          }
          errorList[errorIndex] = errorEntry;
        }
      } else if (question?.question_type === "R") {
        const hasResponse = responses.find(
          (r) => r?.question_id === question?.question_id
        );
        const errorIndex = errorList.findIndex(
          (e) => e.id === question?.question_id
        );
        if (hasResponse && hasResponse?.response_id?.length !== 0) {
          errorList[errorIndex].error = false;
        } else if (hasResponse && hasResponse?.is_skipped) {
          errorList[errorIndex].error = false;
        } else {
          errorList[errorIndex].error = true;
        }
      } else {
        const hasResponse = responses.some(
          (r) => r?.question_id === question?.question_id
        );
        const errorIndex = errorList.findIndex(
          (e) => e.id === question?.question_id
        );
        if (errorIndex !== -1) {
          errorList[errorIndex].error = !hasResponse;
        }
      }
    });

    validateCurrentQuestion = errorList.some((item) => item.error === true);

    if (validateCurrentQuestion) {
      showErrorToast("Kindly complete all fields to proceed.");
    }

    setErrors(errorList);
    return errorList;
    // return validateCurrentQuestion;
  };
  // console.log(responses, "responses");

  // console.log(allQuestions, "allQuestions");

  const calculateProgress = () => {
    const totalQuestions = allQuestions.length;
    const answeredQuestions = responses.filter((r) => !r.is_skipped).length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  const handleNext = async () => {
    const errorList = handleValidationCheck();
    const hasError = errorList?.some((e) => e.error);

    if (!hasError) {
      if (currentPage < totalPages) {
        try {
          // await handleSubmit();
          // setCurrentPage((prev) => prev + 1);

          await handleSubmit();
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);

          // Scroll to top after page change
          window.scrollTo({ top: 0, behavior: "smooth" });

          // Update Redux with new page number
          dispatcParticipantResponseData({
            ...responseData,
            currentPage: nextPage,
          });
          // const newProgress = calculateProgress();
          // setProgressPercentage(newProgress);
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
        const errorElement = document.getElementById(
          `question-container-${errorOutcomeId}-${errorId}`
        );
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          errorElement.focus?.();
        }
      }
    }
  };

  const handlePrevious = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
    if (currentPage > 1) {
      // setCurrentPage((prev) => prev - 1);
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      // Update Redux with new page number
      dispatcParticipantResponseData({
        ...responseData,
        currentPage: prevPage,
      });
      // Scroll to top after page change
    }
  };

  const handleSkipnow = () => {
    adddepClose();
    navigate(participantRouteMap.PROGRESSDASHBOARD.path);
  };

  const finishSurvey = async () => {
    try {
      // Check if there are any skipped questions
      
      const currentSkipped = responses.filter(r => r.is_skipped).length;
      const hasSkippedQuestions = currentSkipped > 0;

      const endpoint = Participant.assessmentFinish;
      const payload = {
        companyID: userData?.companyID,
        companyMasterID: userData?.companyMasterID,
        surveyID: userData?.surveyID,
        userID: userData?.userID,
        departmentID: userData?.departmentID,
      };

      const response = await commonService({
        apiEndPoint: endpoint,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        // toastType: {
        //   success: true,
        //   error: false,
        // },
      });

      if (response?.status) {
        if (hasSkippedQuestions) {
          setShowAddDep(true); // Show Partially Completed Modal
          return;
        } else {
          if (userData?.isAnonymous) {
            navigate(participantRouteMap.THANKYOU.path);
          } else {
            editdepShow();
          }
        }
      }
    } catch (error) {
      console.error("Error saving responses:", error);
    }
  };

  useEffect(() => {
    fetchOutcome();
  }, []);

  const chartOptions = {
    chart: {
      type: "radialBar",
      height: 250,
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "60%",
        },
        track: {
          background: "#E9F1FA",
          strokeWidth: "100%",
        },
        dataLabels: {
          showOn: "always",
          name: {
            show: true,
            offsetY: 28,
          },
          total: {
            show: true,
            label: "Completed",
            color: "#888C8F",
            fontSize: "12px",
            fontFamily: "Poppins",
            fontWeight: 600,
          },
          value: {
            formatter(val) {
              return `${val}%`;
            },
            color: "#0968AC",
            fontSize: "30px",
            fontFamily: "Poppins",
            fontWeight: 600,
            offsetY: -10,
          },
        },
      },
    },
    fill: {
      colors: ["#0968AC"],
    },
    labels: ["Completed"],

    responsive: [
      {
        breakpoint: 992,
        chart: {
          height: 100,
        },
        options: {
          plotOptions: {
            radialBar: {
              dataLabels: {
                name: {
                  offsetY: 20,
                },
                value: {
                  fontSize: "30px",
                  offsetY: -15,
                },
              },
            },
          },
        },
      },
    ],
  };

  const handleFinal = async () => {
    const errorList = handleValidationCheck();
    const hasError = errorList?.some((e) => e.error);
    if (!hasError) {
      await handleSubmit(true); // Pass true to indicate final submission
    } else {
      const firstErrorIndex = errorList.findIndex((e) => e.error);
      if (firstErrorIndex !== -1) {
        const errorObj = errorList[firstErrorIndex];
        const errorId = errorObj.id || errorObj.question_no;
        const errorOutcomeId = errorObj.outcome_id;
        const errorElement = document.getElementById(
          `question-container-${errorOutcomeId}-${errorId}`
        );
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          errorElement.focus?.();
        }
      }
    }
  };

  // eslint-disable-next-line no-shadow
  const renderQuestions = () => {
    const startIndex = (currentPage - 1) * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    const questionsForCurrentPage = allQuestions.slice(startIndex, endIndex);

    // Group questions by outcome
    const questionsByOutcome = {};
    questionsForCurrentPage.forEach((question) => {
      if (!questionsByOutcome[question.outcome_id]) {
        questionsByOutcome[question.outcome_id] = {
          outcome_id: question.outcome_id,
          outcome_name: question.outcome_name,
          outcome_definition: question.outcome_definition,
          outcome_title_color: question.outcome_title_color,
          questions: [],
        };
      }
      questionsByOutcome[question.outcome_id].questions.push(question);
    });
    // Render outcomes with their questions
    return Object.values(questionsByOutcome).map((outcome) => (
      <React.Fragment key={outcome.outcome_id}>
        <div className="answerBox">
          {!isHideOutcome && (
            <div className="answerBox_head">
              <h3
                style={{ color: `#${outcome?.outcome_title_color}` || "#000" }}
              >
                {outcome.outcome_name}
              </h3>
              <p>{outcome.outcome_definition}</p>
            </div>
          )}
          <ul className="answerBox_list list-unstyled">
            {outcome.questions.map((question) => (
              <li key={question.question_id}>
                {question.question_type === "R" && (
                  <SingleRatingResponse
                    data={{
                      ...question,
                      outcome_id: outcome.outcome_id,
                      skipText: skipNowCustomText,
                    }}
                    onResponseChange={handleResponseChange}
                    errors={errors}
                    responses={responseData?.responses}
                  />
                )}
                {question.question_type === "N" && (
                  <NestedQuestionResponse
                    data={{
                      ...question,
                      outcome_id: outcome.outcome_id,
                      skipText: skipNowCustomText,
                    }}
                    onResponseChange={handleResponseChange}
                    errors={errors}
                    responses={responses}
                  />
                )}
                {question.question_type === "O" && (
                  <OEQResponse
                    data={{
                      ...question,
                      outcome_id: outcome.outcome_id,
                      skipText: skipNowCustomText,
                    }}
                    onResponseChange={handleResponseChange}
                    errors={errors}
                    responses={responses}
                  />
                )}
                {question.question_type === "MR" && (
                  <MultipleResonse
                    data={{
                      ...question,
                      outcome_id: outcome.outcome_id,
                      skipText: skipNowCustomText,
                    }}
                    onResponseChange={handleResponseChange}
                    errors={errors}
                    responses={responseData?.responses}
                  />
                )}

                {question.question_type === "G" && (
                  <GateQualiferResponse
                    data={{
                      ...question,
                      outcome_id: outcome.outcome_id,
                      skipText: skipNowCustomText,
                      // skip_now:false
                      
                    }}
                    
                    onResponseChange={handleResponseChange}
                    responseData={responseData}
                    errors={errors}
                    responses={responses}
                  />
                )}

                {question.question_type === "D" &&
                  !question.is_branch_filter && (
                    <DemographicResponse
                      data={{
                        ...question,
                        outcome_id: outcome.outcome_id,
                        skipText: skipNowCustomText,
                      }}
                      onResponseChange={handleResponseChange}
                      responses={responses}
                      errors={errors}
                    />
                  )}
                {question.question_type === "D" &&
                  Boolean(question.is_branch_filter) && (
                    <BranchFilterResponse
                      data={{
                        ...question,
                        outcome_id: outcome.outcome_id,
                        skipText: skipNowCustomText,
                      }}
                      onResponseChange={handleResponseChange}
                      responses={responses}
                      errors={errors}
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
          <section
            className="commonBanner position-relative survey-details-banner"
            style={{ backgroundColor: "#fff" }}
          >
            <div className="container">
              <div className="d-flex justify-content-sm-end flex-sm-row flex-column align-items-xl-end align-items-center">
                {/* <div className="commonBanner_inner">
                  <h1>{surveyName}</h1>
                  <ul className="list-unstyled d-flex align-items-center flex-wrap">
                    <li>
                      Company: <span>{companyName}</span>
                    </li>
                    <li>
                      Department: <span>{departmentName}</span>
                    </li>
                  </ul>
                  <p className="mb-0">This Survey is conducted to know the POV of employees</p>
                </div> */}
                <div
                  className="commonBanner_report"
                  style={{ padding: "0.5rem" }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span
                      className="text-start fs-14"
                      style={{ fontWeight: "600" }}
                    >
                      Progress
                    </span>

                   
                    {/* <span style={{ color: "#0968AC", fontWeight: "600" }}>{`${progressPercentage}%`}</span> */}
                  </div>
                  <div className="commonBanner_report_box">
                    {progressPercentage !== null ? (
                      <div style={{ position: "relative" }}>
                        <div className="progress takeSurvey-progress">
                          <div
                            className="takeSurvey-progress-bar progress-bar-striped progress-bar-animated"
                            role="progressbar"
                            aria-valuenow={`${progressPercentage}`}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      // <Chart options={chartOptions} series={[progressPercentage]} type="radialBar" height={250} />
                      <p>Loading progress...</p>
                    )}
                  </div>
                </div>
                 {progressPercentage !== null && (
                      <span
                        style={{ color: "#0968AC", fontWeight: "600" }} className="mb-1"
                      >{`${Math.round(parseInt(progressPercentage))}%`}</span>
                    )}
              </div>
            </div>
          </section>
          <section className="pt-0 pt-xl-0">
            <div className="container">
              <Form>
                {/* +++++++++  Take Survey 1 ++++++++++ */}
                <>
                  {renderQuestions(outcomes)}

                  <div className="d-flex justify-content-between actionBtn mt-xl-5 mt-4 mb-xl-5 mb-4">
                    <Button
                      className="btn btn-light"
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                    >
                      <em className="icon-arrow-prev btn-icon left" />
                       {!otherLanguage && "Previous"}{" "}
                    </Button>

                    {currentPage === totalPages ? (
                      <Button
                        className="btn btn-primary"
                        onClick={handleFinal} // Pass true for final submit
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
                      <Button className="btn btn-primary" onClick={handleNext}>
                        {nextIsSubmitting ? (
                          <>
                            {!otherLanguage && "Next"}{" "}
                            <Spinner
                              animation="border"
                              size="sm"
                              className="ms-2"
                            />
                          </>
                        ) : (
                          <>
                            {!otherLanguage && "Next"}{" "}
                            <em className="icon-arrow-next btn-icon right" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </>
              </Form>
            </div>
          </section>
        </>
      )}

      {/* Partially Completed Modal Start */}
      <Modal
        className="commonModal"
        show={showAddDep}
        onHide={handleSkipnow}
        centered
      >
        <Modal.Header>
          <button type="button" className="btn-close" onClick={handleSkipnow}>
            <em className="icon-close-circle" />
          </button>
        </Modal.Header>
        <Modal.Body className="text-center pt-0">
          <em className="partially icon-partially" />
          <h3>Survey Partially Completed</h3>
          <p aria-live="polite">
            You still have {skippedCount}{" "}
            {skippedCount === 1 ? "question" : "questions"} tagged as 'Skip for now.' You must complete answering all of them in order to submit the survey for evaluation. This is now saved and you can resume at any time.
          </p>
          <Button
            variant="primary"
            className="ripple-effect btn-sm mx-auto mb-lg-3"
            onClick={handleSkipnow}
          >
            Okay
          </Button>
        </Modal.Body>
      </Modal>
      {/* Partially Completed Modal End */}
      {/* Completed Successfully Modal Start */}
      <Modal
        className="commonModal"
        show={showEditDep}
        onHide={editdepClose}
        centered
      >
        <Modal.Header>
          <button type="button" className="btn-close" onClick={editdepClose}>
            <em className="icon-close-circle" />
          </button>
        </Modal.Header>
        <Modal.Body className="text-center pt-0">
          <em className="successfully icon-check-circle" />
          <h3>Survey Completed Successfully</h3>
          <p>
            Thank you for taking the time to complete our survey. Your feedback
            is important to us and will help us to improve.
            <br />
            We appreciate your participation and the impact it will make on the
            future of our company.
            <br />
            Thanks again for your time and valuable input!
          </p>
          <Button
            variant="primary"
            className="ripple-effect btn-sm mx-auto mb-lg-3"
            onClick={editdepClose}
          >
            Okay
          </Button>
        </Modal.Body>
      </Modal>
      {/* Completed Successfully Modal End */}
    </>
  );
}

export default TakeSurvey;
