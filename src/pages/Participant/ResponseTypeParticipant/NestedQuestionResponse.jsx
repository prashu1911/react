import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { ModalComponent } from "components";
import { Range } from "react-range";
import { useAuth } from "customHooks";

const NestedQuestionResponse = ({ data, onResponseChange, errors, responses, isEditable = true }) => {
  const [responseArray, setResponseArray] = useState([]);
  const [selectedResponses, setSelectedResponses] = useState({});
  const [selectedSliderResponses, setSelectedSliderResponses] = useState({});
  const [showeCreateSch, setShoweCreateSch] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [textareaValue, setTextareaValue] = useState("");
  const [isCheckBox, setIsCheckBox] = useState("Single");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sliderValues, setSliderValues] = useState({});
  const [skipCheck, setSkipCheck] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const STEP = 1;
  const MIN = 0;

  const [responseWidth, setResponseWidth] = useState("70px");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function transformSliderData(inputArray) {
    const result = {};

    if (!inputArray || !Array.isArray(inputArray)) return result;

    inputArray.forEach((item) => {
      if (item && item.response_id && Array.isArray(item.response_id) && item.response_id.length > 0) {
        result[item.question_id] = item.response_id[0].id;
      }
    });

    return result;
  }

  function transformData(inputArray) {
    const result = {};

    inputArray.forEach((item) => {
      const questionId = item.question_id;

      if (!result[questionId]) {
        result[questionId] = {};
      }

      item.response_id.forEach((response) => {
        result[questionId][response.id] = true;
      });
    });

    return result;
  }

  useEffect(() => {
    if (data?.sub_questions?.length > 0) {
      setResponseArray(data?.sub_questions[0]?.response);
    }
    setIsCheckBox(data.response_selected_type === "Multi" ? true : false);

    // const selectedResponseData = responses.find((value) => value?.question_no === data?.question_no);
    const selectedResponseData = responses.find(
      (value) =>
        value?.outcome_id === data?.outcome_id &&
        value?.intention_id === data?.intention_id &&
        Array.isArray(data?.sub_questions) &&
        Array.isArray(value.sub_questions) &&
        value.sub_questions.some((respSubQ) =>
          data?.sub_questions?.some((dataSubQ) => respSubQ.question_id === dataSubQ.question_id)
        )
    );
    setSkipCheck(selectedResponseData?.is_skipped || false);
    console.log(selectedResponseData, "selectedResponseData");
    if (selectedResponseData && Object.keys(selectedResponses).length === 0) {
      if (selectedResponseData.sub_questions) {
        if (data?.is_slider) {
          const selectedResponseDataObject = transformSliderData(selectedResponseData.sub_questions);
          setSelectedSliderResponses(selectedResponseDataObject);
          // Initialize slider values
          const initialSliderValues = {};
          data.sub_questions.forEach((question) => {
            const responseIndex = question.response.findIndex(
              (resp) => resp.response_id === selectedResponseDataObject[question.question_id]
            );
            initialSliderValues[question.question_id] = responseIndex >= 0 ? responseIndex : -1;
          });
          setSliderValues(initialSliderValues);
        } else {
          const selectedResponseDataObject = transformData(selectedResponseData.sub_questions);
          setSelectedResponses(selectedResponseDataObject);
        }
      }
    }
  }, [responses, data]);

  const handleModalOpen = () => {
    setShoweCreateSch(true);
  };

  const handleModalClose = () => {
    setShoweCreateSch(false);
  };

  const handleTextareaChange = (e) => {
    setTextareaValue(e.target.value);
  };

  const handleModalSubmit = () => {
    if (selectedQuestion && selectedResponse) {
      // eslint-disable-next-line no-use-before-define
      handleRadioChange(
        selectedQuestion.question_id,
        selectedResponse.response_id,
        selectedResponse.response_name,
        textareaValue
      );
    }
    handleModalClose();
  };

  // Handle the radio button change
  const handleRadioChange = (questionID, responseID, value, rboeq = "") => {
    const type = data.response_selected_type;

    if (type === "Multi") {
      // Update selected responses state first
      setSelectedResponses((prevState) => {
        const newState = {
          ...prevState,
          [questionID]: {
            ...prevState[questionID],
            [responseID]: !prevState[questionID]?.[responseID],
          },
        };

        // Build response object using the new state
        const updatedResponses = newState[questionID] || {};
        const selectedResponseIds = Object.entries(updatedResponses)
          .filter(([, isSelected]) => isSelected)
          .map(([respId]) => ({
            id: parseInt(respId),
            rboeq: respId === responseID.toString() ? rboeq : "",
          }));

        const formattedResponse = {
          question_type: "N",
          outcome_id: data.outcome_id,
          intention_id: data.intention_id,
          question_no: data.question_no,
          response_selected_type: type,
          sub_questions: [
            {
              question_id: questionID,
              intention_id: data.intention_id,
              response_id: selectedResponseIds,
            },
          ],
          is_skipped: skipCheck,
          question_id: data.question_id,
        };
        // Call onResponseChange with the updated response
        onResponseChange(formattedResponse);
        return newState;
      });
    } else {
      // Single select logic remains the same
      setSelectedResponses((prevState) => ({
        ...prevState,
        [questionID]: {
          [responseID]: true,
        },
      }));

      const formattedResponse = {
        question_type: "N",
        outcome_id: data.outcome_id,
        intention_id: data.intention_id,
        question_no: data.question_no,
        response_selected_type: type,
        sub_questions: [
          {
            question_id: questionID,
            intention_id: data.intention_id,
            response_id: [{ id: responseID, rboeq: rboeq || "" }],
          },
        ],
        is_skipped: skipCheck,
        question_id: data.question_id,
      };

      onResponseChange(formattedResponse);
    }
  };

  // Update the radio button click handler to check for RBOEQ
  const handleRadioClick = (questionData, responseData) => {
    // Check if this is a multi-select checkbox and if it's currently selected
    const isCurrentlySelected = !!selectedResponses[questionData.question_id]?.[responseData.response_id];
    const isMultiSelect = data.response_selected_type === "Multi";

    // Only open modal if:
    // 1. The response has is_oeq === 1
    // 2. AND either it's not multi-select OR it's multi-select and we're checking (not unchecking)
    if (responseData.is_oeq === 1 && (!isMultiSelect || !isCurrentlySelected)) {
      setSelectedQuestion(questionData);
      setSelectedResponse(responseData);
      setTextareaValue("");
      handleModalOpen();
    } else {
      handleRadioChange(questionData.question_id, responseData.response_id, responseData.response_name);
    }
  };

  // Update handleSliderClick to check for is_oeq === 1 and open modal if true
  const handleSliderClick = (questionData, responseData, index) => {
    if (responseData.is_oeq === 1) {
      setSelectedQuestion(questionData);
      setSelectedResponse(responseData);
      setTextareaValue("");
      handleModalOpen();
      // Also update slider value visually
      setSliderValues((prevState) => ({
        ...prevState,
        [questionData.question_id]: index,
      }));
      return;
    } else {
      setSelectedQuestion(null);
      setSelectedResponse(null);
    }
    setSelectedSliderResponses((prevState) => ({
      ...prevState,
      [questionData.question_id]: responseData.response_id,
    }));

    setSliderValues((prevState) => ({
      ...prevState,
      [questionData.question_id]: index,
    }));

    // Format and send response for slider
    const formattedResponse = {
      question_type: "N",
      outcome_id: data.outcome_id,
      intention_id: data.intention_id,
      question_no: data.question_no,
      response_selected_type: "Single",
      sub_questions: [
        {
          question_id: questionData.question_id,
          intention_id: data.intention_id,
          response_id: [
            {
              id: responseData.response_id,
              rboeq: "",
            },
          ],
        },
      ],
      is_skipped: skipCheck,
      question_id: data.question_id,
    };
    if (isEditable) {
      onResponseChange(formattedResponse);
    }
  };

  const handleSkipForNow = (e) => {
    if (!isEditable) return;
    const isChecked = e.target.checked;

    // Clear selections if skipping
    if (isChecked) {
      setSelectedResponses({});
      setSelectedSliderResponses({});
      setSliderValues({});
    }

    // Prepare sub_questions with empty response_id for each sub_question
    const subQuestionsWithEmptyResponse = (data.sub_questions || []).map((sq) => ({
      ...sq,
      response_id: [],
    }));

    const baseResponse = {
      question_type: "N",
      outcome_id: data.outcome_id,
      intention_id: data.intention_id,
      question_no: data.question_no,
      response_selected_type: data.response_selected_type,
      sub_questions: isChecked ? subQuestionsWithEmptyResponse : [],
      is_skipped: isChecked,
      question_id: data.question_id,
    };
    onResponseChange(baseResponse);
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

  const getSuitablewidthForRes = () => {
    if (!data?.is_slider) {
      if (Array.isArray(responseArray) && responseArray.length > 0) {
        const resValueArr = responseArray.map((ele) => (ele.response_name ? ele.response_name : ""));
        const getLongestString = resValueArr.reduce((a, b) => (b.length > a.length ? b : a), "");

        if (getLongestString && getLongestString.length > 200) {
          setResponseWidth("300px");
        } else if (getLongestString && getLongestString.length > 120) {
          setResponseWidth("200px");
        }
      }
    }
  };

  useEffect(() => {
    getSuitablewidthForRes();
  }, [responseArray]);

  const getHeightForSlider = (inputArr) => {
    if (Array.isArray(inputArr) && inputArr.length > 0) {
      const arr = [...inputArr].map((ele) => ele.response_name);
      const lengthString = arr.reduce((a, b) => (a.length > b.length ? a : b));

      if (lengthString.length < 40) {
        return "60px";
      } else if (lengthString.length < 60) {
        return "90px";
      } else {
        return "120px";
      }
    } else {
      return null;
    }
  };

  return (
    <div
      style={borderStyle}
      className="p-2"
      id={`question-container-${data.outcome_id}-${data.question_no}`}
      tabIndex={-1}
    >
      {!data?.is_slider ? (
        <div className="commonQuestion pb-2">
          <div className={`${isCheckBox ? "assessingTable" : "assessingTableCustomRadioBtn"}`}>
            <p className="answerBox_list_ques">
              <span className="fw-bold">{data?.sl_no || data?.question_no}.</span> {data?.question}
            </p>
          </div>
          <div className="commonQuestion pb-2">
            <div className={`${isCheckBox ? "assessingTable" : "assessingTableCustomRadioBtn"}`}>
              <table className="w-full">
                <thead>
                  <tr>
                    {/* <th className="text-start">
                    <div className="outcomeTable_datawidth">{data?.question}</div>
                  </th> */}
                    <th className="text-start" colSpan={1}>
                      <div className="outcomeTable_datawidth"></div>
                    </th>

                    {responseArray.map((response) => (
                      <th key={response.response_id} style={{ width: responseWidth }}>
                        {response.response_name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.sub_questions.map(
                    (questionData) =>
                      questionData?.response?.length > 0 && (
                        <tr key={questionData.question_id}>
                          <td>
                            <div className="outcomeTable_datawidth">{questionData?.question_sub}</div>
                          </td>

                          {questionData?.response?.map((responseData) => (
                           <td
                           className={`${isCheckBox ? "" : "allOptions"}`} 
                           style={{
                            backgroundColor:
                              data.response_selected_type !== "Multi" &&
                              selectedResponses[questionData?.question_id]?.[responseData?.response_id]
                                ? "#0968AC"
                                : "transparent",
                            // border:
                            //   data.response_selected_type !== "Multi" &&
                            //   selectedResponses[questionData?.question_id]?.[responseData?.response_id]
                            //     ? "2px solid #dddd"
                            //     : "1px solid #dddd",
                          }}
                           key={`${questionData?.question_id}-${responseData?.response_id}`}
                         >
                           <div className="w-100 d-flex justify-content-center" style={{ minWidth: "60px" }}>
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
                         
                             {data.response_selected_type === "Multi" ? (
                               <input
                                 type="checkbox"
                                 id={`input-${questionData?.question_id}-${responseData?.response_id}`}
                                 className="table-check-input"
                                 name={`group-${questionData?.question_id}`}
                                 value={responseData?.response_name}
                                 checked={!!selectedResponses[questionData?.question_id]?.[responseData?.response_id]}
                                 onChange={() => handleRadioClick(questionData, responseData)}
                                 style={{ width: "18px", height: "18px" }}
                                 disabled={skipCheck}
                               />
                             ) : (
                               <label className="custom-blue-radio">
                                 <input
                                   type="radio"
                                   id={`input-${questionData?.question_id}-${responseData?.response_id}`}
                                   name={`group-${questionData?.question_id}`}
                                   value={responseData?.response_name}
                                   checked={!!selectedResponses[questionData?.question_id]?.[responseData?.response_id]}
                                   onChange={() => handleRadioClick(questionData, responseData)}
                                   disabled={skipCheck}
                                 />
                                 <span className="custom-radio-mark"></span>
                               </label>
                             )}
                           </div>
                         </td>
                         
                          ))}
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p className="answerBox_list_ques">
            <span className="fw-bold">{data?.sl_no || data?.question_no}.</span> {data.question}
          </p>

          <div className="assessingTableCustomRadioBtn rangeQuestion">
            {/* <div className="outcomeTable_datawidth">{data?.question}</div> */}

            <table>
              <thead>
                {/* <tr>
                <th colSpan={isMobile ? 4 : 2} className="text-start">
                  <div className="outcomeTable_datawidth">{data?.question}</div>
                </th>
              </tr> */}

                {isMobile && (
                  <tr>
                    <th className="text-start">
                      <div className="outcomeTable_datawidth"></div>
                    </th>

                    {responseArray.map((response) => (
                      <th key={response.response_id}>{response.response_name}</th>
                    ))}
                  </tr>
                )}
              </thead>
              <tbody>
                {data?.sub_questions?.map(
                  (questionData) =>
                    questionData?.response?.length > 0 && (
                      <tr key={questionData.question_id}>
                        <td style={{ width: "20%" }}>
                          <div className="outcomeTable_datawidth">{questionData?.question_sub}</div>
                        </td>

                        {isMobile ? (
                          <>
                            {questionData?.response?.map((responseData, index) => (
                              <td
                                className={"allOptions"}
                                key={`${questionData?.question_id}-${responseData?.response_id}`}
                              >
                                <Form.Check
                                  key={responseData.response_id}
                                  type="radio"
                                  id={`mobile-input-${questionData?.question_id}-${responseData?.response_id}`}
                                  label={""}
                                  name={`mobile-group-${questionData?.question_id}`}
                                  checked={
                                    selectedSliderResponses[questionData.question_id] === responseData.response_id
                                  }
                                  onChange={() => {
                                    handleSliderClick(questionData.question_id, responseData.response_id, index);
                                  }}
                                  disabled={skipCheck}
                                />
                              </td>
                            ))}
                          </>
                        ) : (
                          <>
                            <td>
                              <div style={{ width: "100%" }}>
                                <div
                                  style={{
                                    padding: "0.5rem",
                                    margin: "0 auto",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <div
                                    style={{
                                      position: "relative",
                                      width: "70%",
                                      margin: "0 auto",
                                      height: getHeightForSlider(data.response) ?? "60px", // enough height for ticks and labels
                                    }}
                                  >
                                    {/* Slider */}
                                    <Range
                                      step={STEP}
                                      min={0}
                                      max={questionData.response.length - 1}
                                      values={
                                        sliderValues[questionData?.question_id] === undefined ||
                                        sliderValues[questionData?.question_id] === -1
                                          ? [0]
                                          : [sliderValues[questionData?.question_id]]
                                      }
                                      disabled={skipCheck}
                                      onChange={(newValues) => {
                                        setSliderValues((prev) => ({
                                          ...prev,
                                          [questionData.question_id]: newValues[0],
                                        }));
                                      }}
                                      onFinalChange={(newValues) => {
                                        const index = newValues[0];
                                        if (questionData.response && questionData.response[index]) {
                                          handleSliderClick(questionData, questionData.response[index], index);
                                        }
                                      }}
                                      renderTrack={({ props, children }) => {
                                        const value =
                                          sliderValues[questionData?.question_id] === undefined ||
                                          sliderValues[questionData?.question_id] === -1
                                            ? 0
                                            : sliderValues[questionData?.question_id];
                                        const percentage =
                                          ((value - MIN) / (questionData.response.length - 1 - MIN)) * 100;
                                        const { key, ...trackProps } = props;
                                        return (
                                          <div
                                            key={key}
                                            {...trackProps}
                                            style={{
                                              ...trackProps.style,
                                              height: "6px",
                                              width: "100%",
                                              backgroundColor: "#ccc",
                                              borderRadius: "3px",
                                              position: "absolute",
                                              top: "15px",
                                              left: 0,
                                            }}
                                          >
                                            {/* Filled part */}
                                            <div
                                              style={{
                                                position: "absolute",
                                                height: "100%",
                                                backgroundColor: "#ccc",
                                                width: `${percentage}%`,
                                                borderRadius: "3px",
                                                zIndex: 1,
                                              }}
                                            />
                                            {children}
                                          </div>
                                        );
                                      }}
                                      renderThumb={({ props }) => {
                                        const { key, ...thumbProps } = props;
                                        const value =
                                          sliderValues[questionData?.question_id] === undefined ||
                                          sliderValues[questionData?.question_id] === -1
                                            ? -1
                                            : sliderValues[questionData?.question_id];

                                        return (
                                          <div
                                            key={key}
                                            {...thumbProps}
                                            style={{
                                              ...thumbProps.style,
                                              height: "22px",
                                              width: "22px",
                                              backgroundColor: "#fff",
                                              borderRadius: "10%",
                                              zIndex: 3,
                                              boxShadow: "rgb(170, 170, 170) 0px 2px 6px",
                                            }}
                                          >
                                            <div
                                              style={{
                                                width: "100%",
                                                height: "100%",
                                                border: "6px solid",
                                                borderColor: value === -1 ? "#ccc" : "#0968AC",
                                                opacity: skipCheck ? 0.5 : 1,
                                              }}
                                            ></div>
                                          </div>
                                        );
                                      }}
                                    />
                                    {/* Tick markers and labels absolutely positioned */}
                                    {questionData.response.map((label, index) => (
                                      <React.Fragment key={label.response_id}>
                                        {/* Tick marker: only show if not selected */}
                                        {(sliderValues[questionData?.question_id] === undefined ||
                                        sliderValues[questionData?.question_id] === -1
                                          ? 0
                                          : sliderValues[questionData?.question_id]) !== index && (
                                          <div
                                            style={{
                                              position: "absolute",
                                              left: `${(index / (questionData.response.length - 1)) * 100}%`,
                                              top: "18px",
                                              transform: "translate(-50%, -50%)",
                                              width: "5px",
                                              height: "15px",
                                              backgroundColor: "#ccc",
                                              zIndex: 2,
                                            }}
                                          />
                                        )}
                                        {/* Label */}
                                        <div
                                          style={{
                                            position: "absolute",
                                            left: `${(index / (questionData.response.length - 1)) * 100}%`,
                                            top: "32px",
                                            transform: "translate(-50%, 0)",
                                            minWidth: `calc(${100 / questionData.response.length}% - 8px)`,
                                            // minWidth: "60px",
                                            maxWidth: "120px",
                                            cursor: !skipCheck ? "pointer" : "text",
                                            textAlign: "center",
                                            whiteSpace: "normal",
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            fontSize: "15px",
                                            fontWeight:
                                              sliderValues[questionData?.question_id] === index ? "600" : "500",
                                            color:
                                              sliderValues[questionData?.question_id] === index ? "#0968AC" : "#555",
                                            opacity: skipCheck ? 0.5 : 1,
                                            padding: "0 4px",
                                            boxSizing: "border-box",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexWrap: "wrap",
                                          }}
                                          onClick={() => {
                                            if (!skipCheck) {
                                              setSliderValues((prev) => ({
                                                ...prev,
                                                [questionData.question_id]: index,
                                              }));
                                              handleSliderClick(questionData, label, index);
                                            }
                                          }}
                                        >
                                          {label.response_name}
                                        </div>
                                      </React.Fragment>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!userData?.isAnonymous && data?.sub_questions.every((v) => v.response.length > 0) && Boolean(data?.skip_now) && (
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

      <ModalComponent
        modalHeader={`${selectedQuestion?.question_sub} - ${selectedResponse?.response_name}`}
        extraBodyClassName="modalBody pt-0"
        size="lg"
        show={showeCreateSch}
        onHandleCancel={handleModalClose}
      >
        <div>
          {selectedResponse?.oeq_question}
          <textarea
            rows="5"
            placeholder="Enter your response"
            className="form-control"
            value={textareaValue}
            onChange={handleTextareaChange}
          />
        </div>
        <div className="form-btn d-flex gap-2 justify-content-end pt-2">
          <Button type="submit" variant="primary" className="ripple-effect" onClick={handleModalSubmit}>
            Submit
          </Button>
        </div>
      </ModalComponent>
    </div>
  );
};

export default NestedQuestionResponse;
