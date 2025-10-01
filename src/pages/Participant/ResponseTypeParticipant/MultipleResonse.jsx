import { useAuth } from "customHooks";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

const MultipleResonse = ({ data, onResponseChange, errors, responses }) => {
  const [selectedResponses, setSelectedResponses] = useState({});
  const [selectedResposnseData, setSelectedResposnseData] = useState([]);
  const [skipCheck, setSkipCheck] = useState(false);
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const questionDetails = data?.defining_question_details || [];

  function transformToSelectedResponses(input) {
    const isMulti = input?.question_type === "MR";
    // eslint-disable-next-line no-shadow
    const selectedResponses = {};

    input?.sub_questions?.forEach((sub) => {
      const questionId = sub?.question_id;
      selectedResponses[questionId] = {};

      sub?.response_id?.forEach((response) => {
        selectedResponses[questionId][response.id] = true; // Mark as selected
      });

      if (!isMulti) {
        // For Single response type, ensure only one response per question
        const firstResponse = Object.keys(selectedResponses[questionId])[0];
        selectedResponses[questionId] = { [firstResponse]: true };
      }
    });

    return selectedResponses;
  }

  const handleSkipForNow = (e) => {
    const isChecked = e.target.checked;
    setSelectedResponses({});
    setSelectedResposnseData([]);

    const subQuestions = (data?.defining_question_details || [])
      .flatMap((section) => section.sub_questions || [])
      .map((sub) => ({
        ...sub,
        response_id: [],
      }));
    const baseResponse = {
      question_type: "MR",
      outcome_id: data.outcome_id,
      question_no: data.question_no,
      response_selected_type: data.response_selected_type,
      sub_questions: subQuestions,
      is_skipped: isChecked,
      question_id: data.question_id,
    };
    onResponseChange(baseResponse);
  };

  useEffect(() => {
    if (data?.sub_questions?.length > 0) {
      setSelectedResposnseData(data?.sub_questions[0]?.response);
    }
    if (responses && Array.isArray(responses)) {
      const selectedResponseData = responses.find((value) => value?.question_no === data?.question_no);

      if (selectedResponseData) {
        setSkipCheck(selectedResponseData?.is_skipped);
        if (selectedResponseData.sub_questions) {
          const selectedResponseDataObject = transformToSelectedResponses(selectedResponseData);
          setSelectedResponses(selectedResponseDataObject);
        }
      }
    }
  }, [responses, data]);

  // Render the table for each section separately
  const handleCheckboxChange = (questionId, responseId, intentionId) => {
    // Get the type of question (assuming it should be a parameter or from a context)
    const type = data.response_selected_type; // This should come from props or context
    // Update the UI state
    setSelectedResponses((prevState) => {
      if (type === "Multi") {
        return {
          ...prevState,
          [questionId]: {
            ...prevState[questionId],
            [responseId]: !prevState[questionId]?.[responseId],
          },
        };
      } else {
        // For Single Select, only allow one selection
        return {
          ...prevState,
          [questionId]: {
            [responseId]: !prevState[questionId]?.[responseId],
          },
        };
      }
    });

    // Create response object
    const responseObject = {
      id: responseId,
      rboeq: "",
    };

    // Find if we already have an answer for this question
    const existingRecordIndex = selectedResposnseData.findIndex((record) => record.question_id === questionId);

    const existingRecord = existingRecordIndex !== -1 ? selectedResposnseData[existingRecordIndex] : null;

    // Check if this response is already selected
    const isResponseSelected = existingRecord?.response_id.some(
      // eslint-disable-next-line eqeqeq
      (response) => response.id == responseId // Using loose equality as in original
    );

    // Create a new copy of the data array to modify
    const updatedData = [...selectedResposnseData];

    if (existingRecord) {
      // Question already has responses
      if (isResponseSelected) {
        // Response exists - remove it (uncheck)
        const updatedResponses = existingRecord.response_id.filter(
          // eslint-disable-next-line eqeqeq
          (response) => response.id != responseId // Using loose equality as in original
        );

        // Update the record with filtered responses
        updatedData[existingRecordIndex] = {
          ...existingRecord,
          intention_id: intentionId, // Add intention_id here
          response_id: updatedResponses,
        };
      } else {
        // Response doesn't exist - add it (check)
        // eslint-disable-next-line no-lonely-if
        if (type === "Single") {
          // For single select, replace all responses
          updatedData[existingRecordIndex] = {
            ...existingRecord,
            intention_id: intentionId, // Add intention_id here
            response_id: [responseObject],
          };
        } else {
          // For multi select, add to existing responses
          updatedData[existingRecordIndex] = {
            ...existingRecord,
            intention_id: intentionId, // Add intention_id here
            response_id: [...existingRecord.response_id, responseObject],
          };
        }
      }
    } else {
      // No existing record for this question - add new record
      updatedData.push({
        question_id: questionId,
        intention_id: intentionId, // Add intention_id here
        response_id: [responseObject],
      });
    }

    // Update the state with the new data
    setSelectedResposnseData(updatedData);

    // After updating selectedResposnseData
    const formattedResponse = {
      question_type: "MR",
      outcome_id: data.outcome_id,
      question_no: data.question_no,
      response_selected_type: data.response_selected_type,
      sub_questions: updatedData.map((item) => ({
        intention_id: item.intention_id,
        question_no: data.question_no,
        question_id: item.question_id,
        response_id: item.response_id.map((response) => ({
          id: response.id,
          rboeq: response.rboeq || "",
        })),
      })),
      is_skipped: skipCheck,
      question_id: data.question_id, // Include question_id here
    };
    // Call parent's onResponseChange with formatted data
    onResponseChange(formattedResponse);
  };

  const renderSection = (sectionIndex) => {
    const section = questionDetails[sectionIndex];

    const questions = section.sub_questions;
    // Get question type for this section
    const questionTitle = questions[0].question;

    const reposneLength = questions[0]?.response?.length;

    // Get all unique response options for this section
    const responseOptions = new Map();
    questions.forEach((question) => {
      question.response.forEach((response) => {
        responseOptions.set(response.response_id, response.response_name);
      });
    });

    const responseHeaders = Array.from(responseOptions.entries());

    return (
      <div className="commonQuestion">
        <div className="assessingTable impactTable">
          <table>
            <thead>
              <tr>
                <th>
                  <div className="w-240" />
                </th>

                <React.Fragment key={sectionIndex}>
                  <th colSpan={reposneLength} className="nasd">
                    {questionTitle}
                  </th>
                  <th className="one" />
                </React.Fragment>
              </tr>
              <tr>
                <th />

                {responseHeaders.map(([responseId, responseName]) => (
                  <React.Fragment key={responseId}>
                    <th>{responseName}</th>
                    {/* <th /> */}
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <>
                  <tr key={question.question_id}>
                    <td>
                      <div className="w-240">{question.question_sub}</div>
                    </td>

                    {responseHeaders.map(([responseId]) => {
                      const hasResponse = question.response.some((r) => r.response_id === responseId);
                      return (
                        <>
                          {hasResponse && (
                            <React.Fragment key={`${question.question_id}-${responseId}`}>
                              <td key={`${question.question_id}-${responseId}`}>
                                <input
                                  type="checkbox"
                                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  checked={selectedResponses[question.question_id]?.[responseId] || false}
                                  onChange={() =>
                                    handleCheckboxChange(
                                      question.question_id,
                                      responseId,
                                      question.intention_id // Pass intention_id here
                                    )
                                  }
                                />
                              </td>

                              {/* <td /> */}
                            </React.Fragment>
                          )}
                        </>
                      );
                    })}
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderTable = () => {
    return (
      <div className="commonQuestion">
        <div className="assessingTable impactTable">
          <table>
            <thead>
              <tr>
                <th />
                {questionDetails.map((section, idx) => (
                  <th className="nasd" colSpan={section.sub_questions[0].response.length}>
                    {section.sub_questions[0].question}
                  </th>
                ))}
              </tr>
              <tr>
                <th />
                {questionDetails.map((section) =>
                  section.sub_questions[0].response.map((response) => (
                    <th key={response.response_id} style={{ minWidth: "250px" }}>
                      {response.response_name}
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {questionDetails[0]?.sub_questions.map((rowQuestion, rowIndex) => (
                <tr key={rowQuestion.question_id}>
                  <td style={{ minWidth: "250px" }}>{rowQuestion.question_sub}</td>
                  {questionDetails.map((section) => {
                    const question = section.sub_questions[rowIndex]; // match row
                    return section.sub_questions[0].response.map((response) => {
                      const checked = selectedResponses[question.question_id]?.[response.response_id] || false;
                      return (
                        <td
  key={`${question.question_id}-${response.response_id}`}
  style={{
    textAlign: "center",
    cursor: "pointer",
    backgroundColor:
      data?.response_selected_type === "Single" && checked ? "#0968AC" : "transparent",
    // border:
    //   data?.response_selected_type === "Single" && checked
    //     ? "2px solid #dddd"
    //     : "1px solid #dddd",
  }}
  onClick={(e) => {
    // Only handle click if it's directly on the td (not on the input)
    if (e.target === e.currentTarget && !skipCheck) {
      handleCheckboxChange(question.question_id, response.response_id, question.intention_id);
    }
  }}
>
{data?.response_selected_type === "Single" ? (
    <label className="custom-blue-radio">
      <input
        type="radio"
        // className="table-check-input"
        checked={checked}
        onChange={(e) => {
          e.stopPropagation();
          handleCheckboxChange(question.question_id, response.response_id, question.intention_id);
        }}
        disabled={skipCheck}
      />
      <span className="custom-radio-mark"></span>
    </label>
  ) : (
    <input
      type="checkbox"
      className="table-check-input"
      checked={checked}
      onChange={(e) => {
        e.stopPropagation();
        handleCheckboxChange(question.question_id, response.response_id, question.intention_id);
      }}
      style={{ width: "18px", height: "18px" }}
      disabled={skipCheck}
    />
  )}
    <style>{`
                               .custom-blue-radio {
                                 position: relative;
                                 display: inline-block;
                                 width: 18px;
                                 height: 18px;
                               }
                         
                               .custom-blue-radio input[type="radio"] {
                                 opacity: 0;
                                 position: absolute;
                                 width: 28px;
                                 height: 28px;
                                 margin: 0;
                                 left: 0;
                                 top: 0;
                                 z-index: 2;
                                 cursor: pointer;
                               }
                         
                               .custom-blue-radio .custom-radio-mark {
                                 position: absolute;
                                 top: 0;
                                 left: 0;
                                 width: 20px;
                                 height: 20px;
                                 border-radius: 50%;
                                 border: 2px solid #bbbb;
                                 background: #fff;
                                 pointer-events: none;
                                 transition: border 0.2s ease;
                               }
                         
                               .custom-blue-radio input[type="radio"]:checked ~ .custom-radio-mark {
                                 border-color: #0968AC;
                                 width: 23px;
                                 height: 23px;
                               }
                         
                               .custom-blue-radio input[type="radio"]:checked ~ .custom-radio-mark::after {
                                 content: "";
                                 display: block;
                                 position: absolute;
                                 top: 5.5px;
                                 left: 5.5px;
                                 width: 8px;
                                 height: 8px;
                                 border-radius: 50%;
                                 background: #fff;
                                 box-shadow: 0 0 0 4px #0968AC;
                               }
                             `}</style>
</td>

                      );
                    });
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const isErrorObj = errors?.find((value) => value?.question_no === data?.question_no);

  let isError = false;
  let isShowError = false;

  if (isErrorObj) {
    isError = isErrorObj?.error;
    isShowError = true;
  } else {
    isShowError = false;
  }

  const borderStyle = {
    boxShadow: isShowError
      ? isError
        ? "rgb(241 0 0 / 39%) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px"
        : "none"
      : "none",
  };
  console.log(data, "data");
  return (
    <div
      style={borderStyle}
      className="p-2"
      id={`question-container-${data.outcome_id}-${data?.question_id || data?.question_no}`}
      tabIndex={-1}
    >
      {/* <div className="border rounded p-4">{questionDetails.map((_, index) => renderSection(index))}</div> */}
      <p className="answerBox_list_ques">
        <span className="fw-bold">{data?.sl_no || data?.question_no}.</span> {data.question}
      </p>
      <div className="border rounded p-4">{renderTable()}</div>
      {!userData?.isAnonymous && Boolean(data?.skip_now) && (
        <Form.Group className="form-group mb-0 d-inline-block skipcheckBox" controlId={`skip2-${Date.now()}`}>
          <Form.Check
            className="me-0"
            type="checkbox"
            onChange={handleSkipForNow}
            checked={skipCheck}
            label={<div>{data.skipText ? data.skipText : "Skip For Now"}</div>}
          />
        </Form.Group>
      )}
    </div>
  );
};

export default MultipleResonse;
