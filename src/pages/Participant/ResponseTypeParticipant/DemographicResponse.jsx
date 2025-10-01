import React, { useEffect, useState } from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Range } from "react-range";
import { useAuth } from "customHooks";

const DemographicResponse = ({
  data,
  onResponseChange,
  responses,
  errors,
  isEditable = true,
}) => {
  if (!data?.response?.length) return null;
  const [selectedOption, setSelectedOption] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [rankingItems, setRankingItems] = useState(data?.response || []);
  const [skipCheck, setSkipCheck] = useState(false);
  const [values, setValues] = useState([0]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const STEP = 1;
  const MIN = 0;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // First check Redux responses
    const selectedResponseData = responses.find(
      (value) => value?.question_id === data?.question_id
    );

    if (selectedResponseData) {
      setSkipCheck(selectedResponseData?.is_skipped);
      setSelectedOption(selectedResponseData?.response_id[0]?.id);
      const index = data.response.findIndex(
        (value) =>
          value?.response_id === selectedResponseData?.response_id[0]?.id
      );
      setValues([index]);
      // setActiveIndex(index);
    } else {
      setSkipCheck(false);
      setSelectedOption(null);
      setValues([-1]);
    }
  }, [responses]); // Only depend on question_id to prevent unnecessary reruns

  const createResponse = (responseId) => {
    return {
      question_id: data.question_id,
      question_type: "D",
      outcome_id: data.outcome_id,
      intention_id: data.intention_id,
      question_no: data.question_no,
      response_selected_type: "Single",
      response_id: [
        {
          id: responseId,
          ...(data.is_branch_filter ? { level: 1 } : {}),
        },
      ],
      is_branch_filter: Boolean(data.is_branch_filter),
      is_skipped: skipCheck,
    };
  };

  const handleRadioChange = (responseId) => {
    setSelectedOption(responseId);
    const response = createResponse(responseId);

    if (isEditable) {
      onResponseChange(response);
    }
  };

  const handleSliderClick = (index, responseId) => {
    setActiveIndex(index);
    const response = createResponse(responseId);
    if (isEditable) {
      onResponseChange(response);
    }
  };

  const handleRankMove = (index, direction) => {
    const newItems = [...rankingItems];
    if (direction === "up" && index > 0) {
      [newItems[index], newItems[index - 1]] = [
        newItems[index - 1],
        newItems[index],
      ];
    } else if (direction === "down" && index < newItems.length - 1) {
      [newItems[index], newItems[index + 1]] = [
        newItems[index + 1],
        newItems[index],
      ];
    }
    setRankingItems(newItems);

    const response = {
      question_id: data.question_id,
      question_type: "R",
      outcome_id: data.outcome_id,
      intention_id: data.intention_id,
      question_no: data.question_no,
      response_selected_type: "Rank",
      response_id: newItems.map((item, idx) => ({
        id: item.response_id,
        rank: idx + 1,
      })),
      is_branch_filter: false,
      is_skipped: skipCheck,
    };
    if (isEditable) {
      onResponseChange(response);
    }
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
    if (e.target.checked) {
      const baseResponse = {
        question_id: data.question_id,
        question_type: "D",
        outcome_id: data.outcome_id,
        intention_id: data.intention_id,
        question_no: data.question_no,
        response_selected_type: "Single",
        response_id: [],
        is_branch_filter: Boolean(data.is_branch_filter),
        is_skipped: true,
      };
      if (isEditable) {
        onResponseChange(baseResponse);
      }
    } else {
      const baseResponse = {
        question_id: data.question_id,
        question_type: "D",
        outcome_id: data.outcome_id,
        intention_id: data.intention_id,
        question_no: data.question_no,
        response_selected_type: "Single",
        response_id: [],
        is_branch_filter: Boolean(data.is_branch_filter),
        is_skipped: false,
      };
      if (isEditable) {
        onResponseChange(baseResponse);
      }
    }
  };

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
        <div className="answerBox">
          <div className="answerBox_head">
            <h3>
              <span className="fw-bold">
                {data?.sl_no || data?.question_no}.
              </span>{" "}
              {data.question}
            </h3>
          </div>
          <div className="facilitatesPrompt">
            <ul className="list-unstyled mb-0">
              {rankingItems.map((item, index) => (
                <li
                  key={item.response_id}
                  className="d-flex align-items-center"
                >
                  <div className="d-flex gap-2">
                    {index > 0 && (
                      <Link
                        className="facilitatesPrompt_upBtn"
                        onClick={() => handleRankMove(index, "up")}
                      >
                        <em className="icon-arrow-down-small" />
                      </Link>
                    )}
                    {index < rankingItems.length - 1 && (
                      <Link
                        className="facilitatesPrompt_downBtn"
                        onClick={() => handleRankMove(index, "down")}
                      >
                        <em className="icon-arrow-down-small" />
                      </Link>
                    )}
                  </div>
                  <span>{item.response_name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div>
          {!data.is_slider ? (
            <>
              <div className="d-flex justify-content-between align-items-start flex-wrap">
                <p className="answerBox_list_ques">
                  <span className="fw-bold">
                    {data?.sl_no || data?.question_no}.
                  </span>{" "}
                  {data.question}
                </p>
              </div>
              <div className="allOptions d-flex flex-column gap-2 mb-0">
                {data.response.map((type) => (
                  <Form.Group
                    key={type.response_id}
                    className="form-group mb-0"
                    controlId={`response-${type.response_id}`}
                  >
                    <Form.Check
                      className="me-0"
                      inline
                      label={type.response_name}
                      name={`questionGroup-${data.question_no}`}
                      type="radio"
                      id={`inline-${type.response_id}`}
                      checked={selectedOption === type.response_id}
                      onChange={() => handleRadioChange(type.response_id)}
                      disabled={skipCheck}
                    />
                  </Form.Group>
                ))}
              </div>
            </>
          ) : (
            <div className="answerBox">
              <div className="">
                <p className="answerBox_list_ques">
                  <span className="fw-bold">
                    {data?.sl_no || data?.question_no}.
                  </span>{" "}
                  {data.question}
                </p>
              </div>
              {isMobile ? (
                <div className="allOptions d-flex flex-column gap-2 mb-0">
                  {data.response.map((type) => (
                    <Form.Group
                      key={type.response_id}
                      className="form-group mb-0"
                      controlId={`response-${type.response_id}`}
                    >
                      <Form.Check
                        className="me-0"
                        inline
                        label={type.response_name}
                        name={`questionGroup-${data.question_no}`}
                        type="radio"
                        id={`inline-${type.response_id}`}
                        checked={
                          values[0] ===
                          data.response.findIndex(
                            (item) => item.response_id === type.response_id
                          )
                        }
                        onChange={() => {
                          const index = data.response.findIndex(
                            (item) => item.response_id === type.response_id
                          );
                          setValues([index]);
                          handleSliderClick(index, type.response_id);
                        }}
                        disabled={skipCheck}
                      />
                    </Form.Group>
                  ))}
                </div>
              ) : (
                <div style={{ width: "100%" }}>
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
                      max={data.response.length - 1}
                      values={values[0] === -1 ? [0] : values}
                      disabled={skipCheck}
                      onChange={(newValues) => {
                        setSelectedIndex(newValues[0]);
                      }}
                      onFinalChange={(newValues) => {
                        setValues([selectedIndex]);
                        const index = parseInt(selectedIndex);
                        handleSliderClick(
                          index,
                          data.response[index].response_id
                        );
                      }}
                      renderTrack={({ props, children }) => {
                        const percentage =
                          ((values[0] - MIN) /
                            (data.response.length - 1 - MIN)) *
                          100;
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
                                borderColor:
                                  values[0] === -1 ? "#ccc" : "#0968AC",
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
                              left: `${
                                (index / (data.response.length - 1)) * 100
                              }%`,
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
                            left: `${
                              (index / (data.response.length - 1)) * 100
                            }%`,
                            top: "32px",
                            transform: "translate(-50%, 0)",
                            minWidth: `calc(${
                              100 / data.response.length
                            }% - 8px)`,
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
                          }}
                          onClick={() => {
                            setValues([index]);
                            handleSliderClick(index, label.response_id);
                          }}
                        >
                          {label.response_name}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!userData?.isAnonymous && Boolean(data?.skip_now) && (
        <Form.Group
          className="form-group mb-0 d-inline-block skipcheckBox"
          // controlId={`skip2-${Date.now()}`}
          controlId={`skip-${data.question_no}`}
        >
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

export default DemographicResponse;
