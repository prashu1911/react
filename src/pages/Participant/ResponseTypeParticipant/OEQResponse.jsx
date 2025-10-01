import { useAuth } from "customHooks";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

const OEQResponse = ({ data, onResponseChange, errors, responses, isEditable = true }) => {
  const [answer, setAnswer] = useState("");
  const [skipCheck, setSkipCheck] = useState(false);
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  useEffect(() => {
    const selectedResponseData = responses.find((value) => value?.question_id === data?.question_id);

    if (selectedResponseData) {
      setSkipCheck(selectedResponseData?.is_skipped);
      setAnswer(selectedResponseData?.response_id);
    }
  }, [responses]);

  const handleAnswerChange = (e) => {
    const text = e.target.value;
    setAnswer(text);

    const response = {
      question_id: data.question_id,
      question_type: "O",
      outcome_id: data.outcome_id,
      intention_id: data.intention_id,
      question_no: data.question_no,
      response_selected_type: "Single",
      response_id: text,
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
      const response = {
        question_id: data.question_id,
        question_type: "O",
        outcome_id: data.outcome_id,
        intention_id: data.intention_id,
        question_no: data.question_no,
        response_selected_type: "Single",
        response_id: "",
        is_skipped: true,
      };
      if (isEditable) {
        onResponseChange(response);
      }
    } else {
      const response = {
        question_id: data.question_id,
        question_type: "O",
        outcome_id: data.outcome_id,
        intention_id: data.intention_id,
        question_no: data.question_no,
        response_selected_type: "Single",
        response_id: "",
        is_skipped: false,
      };
      if (isEditable) {
        onResponseChange(response);
      }
    }
  };

  return (
    <div
      style={borderStyle}
      className="p-2"
      id={`question-container-${data.outcome_id}-${data.question_id}`}
      tabIndex={-1}
    >
      <div className="d-flex justify-content-between align-items-start flex-wrap">
        <p className="answerBox_list_ques">
          <span className="fw-bold">{data?.sl_no || data?.question_no}.</span> {data.question}
        </p>
      </div>
      <div className="commonQuestion">
        <Form.Group className="form-group mb-0 answerBox">
          <Form.Control
            as="textarea"
            className="form-control form-control-md"
            placeholder="Enter your answer"
            value={answer}
            onChange={handleAnswerChange}
            disabled={skipCheck}
          />
        </Form.Group>
      </div>

      {!userData?.isAnonymous && Boolean(data?.skip_now) && (
        <Form.Group className="form-group mb-0 d-inline-block skipcheckBox" controlId={data?.question_id}>
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

export default OEQResponse;
