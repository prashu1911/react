import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useMemo } from "react";
import SliderResponse from "./SliderResponse";
import RankOrderResponse from "./RankOrderResponse";
import { checkboxStyleString } from "./constants";

const MultipleResonse = ({ data }) => {
  const [selectedResponses, setSelectedResponses] = useState({});

  const handleRadioChange = (
    defineQuestionNo,
    questionSubNo,
    responseID,
    value
  ) => {
    setSelectedResponses((prev) => ({
      ...prev,
      [`${defineQuestionNo}-${questionSubNo}`]: {
        ...prev[`${defineQuestionNo}-${questionSubNo}`],
        [responseID]: value,
      },
    }));
  };

  const defineQuestions = data?.defineQuestion || [];
  console.log(defineQuestions, "defineQuestions");
  const isMultiSelect = useMemo(() => {
    return ["Multi-Select Response", "Select All that Apply"].includes(
      data?.responseSelectedType
    );
  }, [data]);

  return (
    <div className="commonQuestion pb-2">
      <div className="assessingTable impactTable">
        {/* <table>
          <thead>
            <tr>
              <th><div className='w-240' /></th>
              {defineQuestions.map(question => (
                <React.Fragment key={`header-${question.questionNo}`}>
                  <th colSpan={question?.subQuestion?.length}>{question.question}</th>
                  <th />
                </React.Fragment>
              ))}
            </tr>
            <tr>
              <th />
              {defineQuestions.map(question => (
                <React.Fragment key={`response-header-${question.questionNo}`}>
                  {question.questionSub[0]?.response.map(resp => (
                    <th key={`resp-${question.questionNo}-${resp.responseID}`}>
                      {resp.response}
                    </th>
                  ))}
                  <th />
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {defineQuestions[0]?.questionSub.map(subQuestion => (
              <tr key={`row-${subQuestion.questionSubNo}`}>
                <td>
                  <div className='w-240'>
                    {`${subQuestion.questionSubNo}. ${subQuestion.questionSub}`}
                  </div>
                </td>
                {defineQuestions.map(question => (
                  <React.Fragment key={`cell-group-${question.questionNo}-${subQuestion.questionSubNo}`}>
                    {question.questionSub
                      .find(sq => sq.questionSubNo === subQuestion.questionSubNo)
                      ?.response.map(resp => (
                        <td key={`cell-${question.questionNo}-${subQuestion.questionSubNo}-${resp.responseID}`}>
                          <Form.Check
                            type="radio"
                            id={`radio-${question.questionNo}-${subQuestion.questionSubNo}-${resp.responseID}`}
                            label=""
                            name={`radiogroup-${question.questionNo}-${subQuestion.questionSubNo}`}
                            checked={selectedResponses[`${question.questionNo}-${subQuestion.questionSubNo}`]?.[resp.responseID] === resp.response}
                            onChange={() => handleRadioChange(
                              question.questionNo,
                              subQuestion.questionSubNo,
                              resp.responseID,
                              resp.response
                            )}
                          />
                        </td>
                      ))}
                    <td />
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table> */}

        <table>
          <thead>
            <tr>
              <th>
                <div className="w-240" />
              </th>
              {defineQuestions.map((question) => (
                <React.Fragment key={`header-${question.questionNo}`}>
                  <th colSpan={question?.questionSub[0].response.length}>
                    {question.question}{" "}
                  </th>
                  <th />
                </React.Fragment>
              ))}
            </tr>
            <tr>
              <th />
              {defineQuestions.map((question) => (
                <React.Fragment key={`response-header-${question.questionNo}`}>
                  {question.questionSub[0]?.response.map((resp) => (
                    <th
                      key={`resp-${question.questionNo}-${resp.responseID}`}
                      style={{ minWidth: "100px" }}
                    >
                      {resp.response}
                    </th>
                  ))}
                  <th />
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {defineQuestions[0]?.questionSub.map((subQuestion) => (
              <tr key={`row-${subQuestion.questionSubNo}`}>
                <td>
                  <div className="w-240">
                    {`${subQuestion.questionSubNo}. ${subQuestion.questionSub}`}
                  </div>
                </td>
                {defineQuestions.map((question) => (
                  <React.Fragment
                    key={`cell-group-${question.questionNo}-${subQuestion.questionSubNo}`}
                  >
                    {question.questionSub
                      .find(
                        (sq) => sq.questionSubNo === subQuestion.questionSubNo
                      )
                      ?.response.map((resp) => (
                        <td
                          key={`cell-${question.questionNo}-${subQuestion.questionSubNo}-${resp.responseID}`}
                        >
                          <div className="d-flex justify-content-center">
                            {!isMultiSelect && (
                              <Form.Check
                                style={{ width: "16px", height: "16px" }}
                                type={"radio"}
                                id={`radio-${question.questionNo}-${subQuestion.questionSubNo}-${resp.responseID}`}
                                label=""
                                name={`radiogroup-${question.questionNo}-${subQuestion.questionSubNo}`}
                                checked={
                                  selectedResponses[
                                    `${question.questionNo}-${subQuestion.questionSubNo}`
                                  ]?.[resp.responseID] === resp.response
                                }
                                onChange={() =>
                                  handleRadioChange(
                                    question.questionNo,
                                    subQuestion.questionSubNo,
                                    resp.responseID,
                                    resp.response
                                  )
                                }
                              />
                            )}
                            
                            {isMultiSelect && (
                             <>
                              <input
                                type="checkbox"
                                className="table-check-input"
                                name={`radiogroup-${question.questionNo}-${subQuestion.questionSubNo}`}
                                checked={
                                  selectedResponses[
                                    `${question.questionNo}-${subQuestion.questionSubNo}`
                                  ]?.[resp.responseID] === resp.response
                                }
                                onChange={() =>
                                  handleRadioChange(
                                    question.questionNo,
                                    subQuestion.questionSubNo,
                                    resp.responseID,
                                    resp.response
                                  )
                                }
                                style={{ width: "18px", height: "18px" }}
                                
                              />
                              <style>{checkboxStyleString}</style>
                             </>
                            )}
                          </div>
                        </td>
                      ))}
                    <td />
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MultipleResonse;
