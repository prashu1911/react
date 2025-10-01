import { useAuth } from "customHooks";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

const GateQualiferResponse = ({ data, onResponseChange, errors, responses, isEditable = true }) => {
  if (!data?.response?.length) return null;

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [skipCheck, setSkipCheck] = useState(false);
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  useEffect(() => {
    const selectedResponseData = responses.find((value) => value?.question_id === data?.question_id);

    if (selectedResponseData) {
      setSkipCheck(selectedResponseData?.is_skipped);
      let responseData = [];

      for (let oneResonse of selectedResponseData?.response_id) {
        responseData.push(oneResonse?.id);
      }
      setSelectedOptions(responseData);
    } else {
      setSelectedOptions([]);
    }
  }, [responses]);

  const handleChange = (responseId) => {
    const response = {
      question_id: data.question_id,
      question_type: "G",
      outcome_id: data?.outcome_id,
      intention_id: data.intention_id,
      question_no: data.question_no,
      response_selected_type: "Single",
      response_id: [{ id: responseId, rboeq: "" }],
      is_skipped: skipCheck,
    };
    // eslint-disable-next-line no-self-assign
    data.outcome_id = data.outcome_id;
    data.skipText = data?.skipText || "";

    if (isEditable) {
      onResponseChange(response, data, responseId);
    }
  };

  const handleSkipForNow = (e) => {
    const baseResponse = {
      question_id: data.question_id,
      question_type: "G",
      outcome_id: data.outcome_id,
      intention_id: data.intention_id,
      question_no: data.question_no,
      response_selected_type: "Single",
      response_id: [],
      is_skipped: e.target.checked ? true : false, // Dynamic based on checkbox
    };
    data.skipText = data?.skipText || "";

    if (isEditable) {
      onResponseChange(baseResponse, data, null);
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
        </p>{" "}
      </div>
      <div className="allOptions d-flex flex-column gap-2 mb-0">
        {data?.response.map((type, typeIndex) => (
          <Form.Group
            key={`response-${typeIndex}-${data.question_id}`}
            className="form-group mb-0"
            controlId={`response-${typeIndex}-${data.question_id}`}
          >
            <Form.Check
              className="me-0"
              inline
              label={type.response_name}
              name={`group${data.question_id}`}
              type="radio"
              id={`inline-${typeIndex}-${data.question_id}`}
              checked={selectedOptions[0] === type.response_id}
              onClick={() => {
                setSelectedOptions([type.response_id]);
                handleChange(type.response_id, data.intention_id);
              }}
              disabled={skipCheck}
              // onChange={() => handleChange(type?.response_id, data.intention_id)}
              readOnly
            />
          </Form.Group>
        ))}
      </div>

      {!userData?.isAnonymous && Boolean(data?.skip_now) && (
        <Form.Group className="form-group mb-0 d-inline-block skipcheckBox" controlId={`skip-${data.question_id}`}>
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

export default GateQualiferResponse;
