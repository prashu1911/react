import { ModalComponent } from "components";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Range, getTrackBackground } from "react-range";
import { useAuth } from "customHooks";

const SingleRatingResponse = ({ data, onResponseChange, errors, responses, isEditable = true }) => {
  if (!data?.response?.length) return null;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [textareaValues, setTextareaValues] = useState({});
  const [showeCreateSch, setShoweCreateSch] = useState(false);
  const [rankingItems, setRankingItems] = useState(data?.response || []);
  const [skipCheck, setSkipCheck] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [modalResponseId, setModalResponseId] = useState(null);
  const [isRankDefaultOrder, setIsRankDefaultOrder] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // First check Redux responses
    const selectedResponseData = responses?.find((value) => value?.question_id === data?.question_id);
    if (selectedResponseData) {
      setSkipCheck(selectedResponseData?.is_skipped);
      let responseData = [];
      let index = -1;
      let newTextareaValues = {};
      for (let oneResonse of selectedResponseData?.response_id) {
        responseData.push(oneResonse?.id);
        index = data?.response.findIndex((value) => value?.response_id === oneResonse?.id);
        if (oneResonse?.rboeq !== undefined) {
          newTextareaValues[oneResonse.id] = oneResonse.rboeq;
        }
      }
      if (data.response_selected_type === "Rank") {
        setRankingItems(selectedResponseData?.response_id);
      }
      setValues([index]);
      setActiveIndex(index);
      setSelectedOptions(responseData);
      setTextareaValues(newTextareaValues);
    } else {
      setValues([-1]);
      setActiveIndex(null);
      setSelectedOptions([]);
      setTextareaValues({});
    }
  }, [responses]); // Only depend on responses to prevent unnecessary reruns
  const handleModalOpen = (responseId = null) => {
    setShoweCreateSch(true);
    if (responseId) setModalResponseId(responseId);
  };

  const handleModalClose = () => {
    if (modalResponseId) {
      setTextareaValues((prev) => {
        const updated = { ...prev };
        delete updated[modalResponseId];
        return updated;
      });
      if (data.response_selected_type === "Multi") {
        const newSelectedOptions = selectedOptions.filter((id) => id !== modalResponseId);
        setSelectedOptions(newSelectedOptions);
      } else if (data.response_selected_type === "Single") {
        setSelectedOptions([]);
      }
    }
    setShoweCreateSch(false);
    setModalResponseId(null);
  };

  const createResponse = (responseIds, rboeq = "", multiTextareaValues = undefined) => {
    const baseResponse = {
      question_id: data.question_id,
      question_type: "R",
      outcome_id: data.outcome_id,
      intention_id: data.intention_id,
      question_no: data.question_no,
      response_selected_type: data.response_selected_type,
      is_skipped: skipCheck,
    };

    if (data.response_selected_type === "Rank") {
      return {
        ...baseResponse,
        response_id: responseIds.map((item) => ({
          id: item.response_id,
          rboeq: item.rboeq || "",
        })),
      };
    } else if (data.response_selected_type === "Multi") {
      return {
        ...baseResponse,
        response_id: Array.isArray(responseIds)
          ? responseIds.map((id) => ({ id, rboeq: multiTextareaValues ? multiTextareaValues[id] || "" : "" }))
          : [{ id: responseIds, rboeq }],
      };
    } else {
      return {
        ...baseResponse,
        response_id: [{ id: responseIds, rboeq }],
      };
    }
  };

  const handleInputChange = (responseId) => {
    let newSelectedOptions;

    if (data.response_selected_type === "Single") {
      // Single selection behavior remains the same
      const selectedResp = data.response.find((r) => r.response_id === responseId);
      setSelectedResponse(selectedResp);
      setSelectedOptions([responseId]);
      // setTextareaValue("");

      const response = createResponse(responseId, textareaValues[responseId] || "");
      onResponseChange(response);

      if (selectedResp?.is_oeq === 1) {
        handleModalOpen(responseId);
      }
    } else if (data.response_selected_type === "Multi") {
      // Multi selection behavior with deselection
      if (selectedOptions.includes(responseId)) {
        // If already selected, remove it (deselect)
        newSelectedOptions = selectedOptions.filter((id) => id !== responseId);
      } else {
        // If not selected, add it
        newSelectedOptions = [...selectedOptions, responseId];
      }

      setSelectedOptions(newSelectedOptions);

      // Create and send response for multi-select
      const response = createResponse(newSelectedOptions, undefined, textareaValues);

      if (isEditable) {
        onResponseChange(response);
      }

      // Check if the selected option has an open-ended question
      const selectedResp = data.response.find((r) => r.response_id === responseId);
      if (selectedResp?.is_oeq === 1 && !selectedOptions.includes(responseId)) {
        setSelectedResponse(selectedResp);
        handleModalOpen(responseId);
      }
    }
  };

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    if (selectedResponse) {
      setTextareaValues((prev) => ({ ...prev, [selectedResponse.response_id]: value }));
    }
  };

  const handleModalSubmit = () => {
    // Update response with textarea value
    let response;
    if (data.response_selected_type === "Single") {
      response = createResponse(selectedOptions[0], textareaValues[selectedOptions[0]] || "");
    } else {
      // For multi-select, we need to handle the textarea value for the specific option
      response = createResponse(selectedOptions, undefined, textareaValues);
    }
    if (isEditable) {
      onResponseChange(response);
    }

    setShoweCreateSch(false);
    setModalResponseId(null);
  };

  const handleSliderClick = (index, responseId) => {
    setActiveIndex(index);
    const response = createResponse(responseId);
    if (isEditable) {
      onResponseChange(response);
    }
  };

  const handleRankMove = (index, direction) => {
    if (skipCheck) return null;
    const newItems = [...rankingItems];
    if (direction === "up" && index > 0) {
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
    } else if (direction === "down" && index < newItems.length - 1) {
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    }
    setRankingItems(newItems);
    setIsRankDefaultOrder(false); // Hide error as soon as order changes

    // Create response with sequential ranks based on current order
    const responseWithRanks = {
      question_id: data.question_id,
      question_type: "R",
      outcome_id: data.outcome_id,
      intention_id: data.intention_id,
      question_no: data.question_no,
      response_selected_type: "Rank",
      response_id: newItems.map((item, idx) => ({
        id: item?.response_id || item?.id, // Handle both data.response and selectedResponseData.response_id structures
        rank: idx + 1, // Ensure sequential ranking starting from 1
        response_name: item.response_name, // Include response name for reference
      })),
      is_skipped: skipCheck,
    };
    if (isEditable) {
      onResponseChange(responseWithRanks);
    }
  };

  // Helper to check if current order is default
  const isDefaultOrder = () => {
    if (!Array.isArray(rankingItems) || !Array.isArray(data?.response)) return false;
    return rankingItems.every((item, idx) => item?.response_id === data.response[idx]?.response_id);
  };

  const isErrorObj = errors?.find((value) => value?.id === data?.question_id);
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

  const handleSkipForNow = (e) => {
    const baseResponse = {
      question_id: data.question_id,
      question_type: "R",
      outcome_id: data.outcome_id,
      intention_id: data.intention_id,
      question_no: data.question_no,
      response_selected_type: data.response_selected_type,
      is_skipped: e?.target?.checked ? true : false,
      response_id:
        data.response_selected_type === "Rank"
          ? data?.response?.map((item, idx) => ({
              id: item.response_id || item.id, // Handle both data.response and selectedResponseData.response_id structures
              rank: idx + 1,
              response_name: item.response_name,
            }))
          : [],
    };
    if (isEditable) {
      onResponseChange(baseResponse);
    }
  };
  const [values, setValues] = useState([0]);
  const STEP = 1;
  const MIN = 0;

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
      id={`question-container-${data.outcome_id}-${data.question_id}`}
      tabIndex={-1}
    >
      {data.response_selected_type === "Rank" ? (
        <>
          <div className="answerBox">
            <div className="answerBox_head">
              <h5>
                <span className="fw-bold">{data?.sl_no || data?.question_no}.</span> {data.question}
              </h5>
            </div>
            <div className="facilitatesPrompt">
              <ul className="list-unstyled mb-0">
                {rankingItems.map((item, index) => (
                  <li key={index} className="d-flex align-items-center">
                    <div className="d-flex gap-2">
                      {index > 0 && (
                        <Link
                          className="facilitatesPrompt_downBtn"
                          style={{ cursor: skipCheck ? "default" : "pointer" }}
                          onClick={() => handleRankMove(index, "up")}
                        >
                          <em className="icon-custom-up-arrow" />
                        </Link>
                      )}
                      {index < rankingItems.length - 1 && (
                        <Link
                          className="facilitatesPrompt_upBtn"
                          style={{ cursor: skipCheck ? "default" : "pointer" }}
                          onClick={() => handleRankMove(index, "down")}
                        >
                          <em className="icon-custom-up-arrow" />
                        </Link>
                      )}
                    </div>
                    <span>{item.response_name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {isShowError && isError && !isRankDefaultOrder && isDefaultOrder() && (
            <div className="mt-4 mb-4 d-flex">
              <h5 className="me-2 text-danger" style={{ fontSize: "16px" }}>
                No changes were made to the response ranking. Would you like to proceed with the default order?
              </h5>
              <Button
                variant="light"
                style={{ border: "none", padding: "8px 5px", height: "fit-Content", borderRadius: "0" }}
                onClick={() => {
                  handleSkipForNow();
                  setIsRankDefaultOrder(true);
                }}
              >
                <em className="icon-check" style={{ fontSize: "10px", color: "#606060" }} />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div>
          {!data.is_slider ? (
            <>
              <div className="d-flex justify-content-between align-items-start flex-wrap">
                <p className="answerBox_list_ques">
                  <span className="fw-bold">{data?.sl_no || data?.question_no}.</span> {data.question}
                </p>
              </div>
              <div className="allOptions d-flex flex-column flex-wrap gap-2 mb-0">
                {data.response.map((type) => (
                  <Form.Group
                    key={type.response_id}
                    className="form-group mb-0"
                    controlId={`response-${type.response_id}-${Date.now()}`}
                  >
                    {data.response_selected_type === "Multi" ? (
                      <Form.Check
                        className="me-0"
                        inline
                        label={type.response_name}
                        name={`questionGroup-${data.question_no}-${type.response_id}`}
                        type="checkbox" // Changed from radio to checkbox
                        id={`inline-${type.response_id}`}
                        checked={selectedOptions.includes(type.response_id)}
                        onChange={() => handleInputChange(type.response_id)}
                        disabled={skipCheck} // Disable if skipCheck is true
                      />
                    ) : (
                      // For Single type, use normal radio behavior
                      <Form.Check
                        className="me-0"
                        inline
                        label={type.response_name}
                        name={`questionGroup-${data.question_no}-${type.response_id}`}
                        type="radio"
                        id={`inline-${type.response_id}`}
                        checked={selectedOptions[0] === type.response_id}
                        onChange={() => handleInputChange(type.response_id)}
                      />
                    )}
                  </Form.Group>
                ))}
              </div>
              {data.response_selected_type === "Multi" && (
                // eslint-disable-next-line react/no-unknown-property
                <style jsx>{`
                  .form-check-input[type="checkbox"] {
                    appearance: radio;
                    -webkit-appearance: radio;
                    border-radius: 50%;
                  }
                  .form-check-input[type="checkbox"]:checked {
                    background-image: none;
                    background-color: transparent;
                  }
                `}</style>
              )}
            </>
          ) : (
            <div className="answerBox">
              <div className="">
                <p className="answerBox_list_ques">
                  <span className="fw-bold">{data?.sl_no || data?.question_no}.</span> {data.question}
                </p>
              </div>
              {!isMobile ? (
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      position: "relative",
                      width: "70%",
                      margin: "0 auto",
                      height: getHeightForSlider(data.response) ?? "60px", // Minimum height
                      // maxHeight: "120px", // enough height for ticks and labels
                    }}
                  >
                    {/* Slider */}
                    <Range
                      step={STEP}
                      min={0}
                      max={data.response.length - 1}
                      values={values[0] === -1 ? [0] : values}
                      disabled={skipCheck}
                      onChange={(newValues) => {
                        setSelectedIndex(newValues[0]);
                      }}
                      onFinalChange={(newValues) => {
                        setValues([selectedIndex]);
                        const index = parseInt(selectedIndex);
                        handleSliderClick(index, data.response[index].response_id);
                      }}
                      renderTrack={({ props, children }) => {
                        const percentage = ((values[0] - MIN) / (data.response.length - 1 - MIN)) * 100;
                        const { key, ...trackProps } = props;
                        return (
                          <div
                            key={key}
                            {...trackProps}
                            style={{
                              ...trackProps.style,
                              height:  "6px",
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
                                borderColor: values[0] === -1 ? "#ccc" : "#0968AC",
                                opacity: skipCheck ? 0.5 : 1,
                              }}
                            ></div>
                          </div>
                        );
                      }}
                    />
                    {/* Tick markers and labels absolutely positioned */}
                    {data.response.map((label, index) => (
                      <React.Fragment key={label.response_id}>
                        {/* Tick marker: only show if not selected */}
                        {(values[0] === -1 ? 0 : values[0]) !== index && (
                          <div
                            style={{
                              position: "absolute",
                              left: `${(index / (data.response.length - 1)) * 100}%`,
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
                            left: `${(index / (data.response.length - 1)) * 100}%`,
                            top: "32px",
                            transform: "translate(-50%, 0)",
                            minWidth: `calc(${100 / data.response.length}% - 8px)`,
                            // minWidth: "60px",
                            maxWidth: "120px",
                            cursor: "pointer",
                            textAlign: "center",
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            fontSize: "15px",
                            fontWeight: values[0] === index ? "600" : "500",
                            color: values[0] === index ? "#0968AC" : "#555",
                            opacity: skipCheck ? 0.5 : 1,
                            padding: "0 4px",
                            boxSizing: "border-box",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexWrap: "wrap",
                          }}
                          onClick={() => {
                            setValues([index]);
                            const covertIndex = parseInt(index);
                            handleSliderClick(covertIndex, data.response[covertIndex].response_id);
                          }}
                        >
                          {label.response_name}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="allOptions d-flex flex-column gap-2 mb-0">
                  {data.response.map((type, index) => (
                    <Form.Group
                      key={type.response_id}
                      className="form-group mb-0"
                      controlId={`response-${type.response_id}-${Date.now()}`}
                    >
                      <Form.Check
                        className="me-0"
                        inline
                        label={type.response_name}
                        name={`questionGroup-${data.question_no}-${type.response_id}`}
                        type="radio"
                        id={`inline-${type.response_id}`}
                        checked={activeIndex === index}
                        onChange={() => handleSliderClick(index, type.response_id)}
                        disabled={skipCheck}
                      />
                    </Form.Group>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

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

      <ModalComponent
        modalHeader={`${data.question} - ${selectedResponse?.response_name}`}
        extraBodyClassName="modalBody pt-0"
        size="lg"
        show={showeCreateSch}
        onHandleCancel={handleModalClose}
      >
        <div>
          {selectedResponse?.oeq_question}
          <textarea
            name=""
            id=""
            rows="5"
            placeholder="Enter your response"
            className="form-control"
            value={selectedResponse ? textareaValues[selectedResponse.response_id] || "" : ""}
            onChange={handleTextareaChange}
          />
        </div>
        <div className="form-btn d-flex gap-2 justify-content-end pt-2">
          <Button
            type="submit"
            variant="primary"
            className="ripple-effect"
            onClick={handleModalSubmit}
            disabled={
              !selectedResponse ||
              !textareaValues[selectedResponse.response_id] ||
              textareaValues[selectedResponse.response_id].trim() === ""
            }
          >
            Submit
          </Button>
        </div>
      </ModalComponent>
    </div>
  );
};

export default SingleRatingResponse;
