import React, { useEffect, useState, useMemo } from "react";
import { Form } from "react-bootstrap";
import SliderResponse from "./SliderResponse";
import RankOrderResponse from "./RankOrderResponse";
import { Range } from "react-range";
import ResponseSliderTwo from "./responseSliderTwo";

const NestedQuestionResponse = ({ data }) => {
  const [responseArray, setResponseArray] = useState([]);
  const [selectedResponses, setSelectedResponses] = useState({});
  const STEP = 1;
  const MIN = 0;
   const [sliderValues, setSliderValues] = useState({});

  useEffect(() => {
    if (data?.questionSub?.length > 0) {
      setResponseArray(data.questionSub[0].response || []);
    }
  }, [data]);

  const handleRadioChange = (questionID, responseID, value) => {
    setSelectedResponses((prev) => ({
      ...prev,
      [questionID]: {
        ...prev[questionID],
        [responseID]: value,
      },
    }));
  };

  const isSingleOrMultiSelect = useMemo(() => {
    return [
      "Multi-Select Response",
      "Single Select Response",
      "Single Select",
      "Select All that Apply",
    ].includes(data?.responseSelectedType);
  }, [data]);
  const isMultiSelect = useMemo(() => {
    return ["Multi-Select Response", "Select All that Apply"].includes(
      data?.responseSelectedType
    );
  }, [data]);

   const getSuitablewidthForRes = (inputArr) => {
    if (!data?.is_slider) {
      if (Array.isArray(inputArr) && inputArr.length > 0) {
        const resValueArr = inputArr.map((ele) =>
          ele.response ? ele.response : ""
        );
        const getLongestString = resValueArr.reduce(
          (a, b) => (b.length > a.length ? b : a),
          ""
        );

        if (getLongestString && getLongestString.length > 200) {
          return "300px"
        } else if (getLongestString && getLongestString.length > 120) {
          return "200px"
        } else {
          return "70px"
        }
      } else {
        return "70px"
      }
    } else {
      return "70px"
    }
  };

  const renderHeaders = () => {
    if (
      data?.isSlider ||
      data?.responseSelectedType === "Rank Order Response"
    ) {
      return (
        <th colSpan={responseArray?.length || 1}>
          {/* Optional: Add label if needed */}
          {data?.isSlider ? "Slider Response" : "Rank Order Response"}
        </th>
      );
    }

    if (isSingleOrMultiSelect) {
      const cellWidth = getSuitablewidthForRes(responseArray)
      return responseArray.map((response) => (
        <th key={response.responseID} style={{width: cellWidth, minWidth: "100px" }}>
          {response.response}
        </th>
      ));
    }

    return null;
  };

  const renderResponseComponent = (questionData) => {
    if (data?.isSlider) {
      return (
        <td>
          {/* <SliderResponse response={questionData.response} /> */}
         
          <ResponseSliderTwo questionResponse={questionData.response} questionData={questionData}/>
       
        </td>
      );
    }

    if (data?.responseSelectedType === "Rank Order Response") {
      return <RankOrderResponse response={questionData.response} />;
    }

    if (isSingleOrMultiSelect) {
      return questionData.response?.map((responseData) => (
        <td key={`${questionData.questionNo}-${responseData.responseID}`}>
          <div className="d-flex justify-content-center">
            <Form.Check
              type={isMultiSelect ? "checkbox" : "radio"}
              id={`radio-${Number(questionData?.questionNo)}-${
                responseData?.responseID
              }`}
              label=""
              name={`group-${Number(questionData?.questionNo)}`}
              value={responseData?.response}
              checked={
                selectedResponses[Number(questionData?.questionNo)]?.[
                  responseData?.responseID
                ] === responseData?.response
              }
              style={{ width: "16px", height: "16px" }}
              onChange={() =>
                handleRadioChange(
                  Number(questionData?.questionNo),
                  responseData?.questionNo,
                  responseData?.questionNo
                )
              }
            />
          </div>
        </td>
      ));
    }

    return null;
  };

  return (
    <div className="commonQuestion pb-2">
      <div className="assessingTable">
        <table className="w-full">
          <thead>
            <tr>
              <th
                className={`text-start ${data?.isSlider && "is-slider"} `}
                colSpan={data?.isSlider && responseArray?.length + 1}
              >
                <div className="outcomeTable_datawidth">{data?.question}</div>
              </th>
              {!data?.isSlider && renderHeaders()}
            </tr>
          </thead>
          <tbody>
            {data?.questionSub?.map((questionData, index) => (
              <tr key={index}>
                <td>
                  <div className="outcomeTable_datawidth">
                    {questionData.question}
                  </div>
                </td>

                {renderResponseComponent(questionData)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NestedQuestionResponse;
