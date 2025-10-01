import React, { useEffect, useState } from "react";
import CommonInfoLink from "../../../CommonInfoLink";
import {
  // SingleRatingJumpQuestionDA,
  // SingleRatingJumpQuestionIG,
  SingleRatingJumpQuestionDaIg
} from "./SingleRatingJumpQuestionSubComponent";

const SingleRatingJumpQuestion = ({
  questionBankShow,
  handleCommunicationQuestions,
  parentGateQuestionID,
  parentIntentions,
  parentIntentionShortName,
  responseType,
  grouppedData,
  surveyType,
  userData,
  outcome,
  surveyID,
  companyID,
  fetchQuestion,
  totalCount,
  usedCount,
  questionOptions,
  parentIntentionID,
  setUpdateResValue
}) => {
  const [DaIGToggele, setDaIGToggele] = useState(true);

  const handleClick = (activeInfoLink) => {
    if (activeInfoLink === "Data Analytics") {
      setDaIGToggele(true);
      setUpdateResValue({type: "rating",isDataAnalytics: true})
    } else {
      setDaIGToggele(false);
      setUpdateResValue({type: "rating",isDataAnalytics: false})
    }
  };

  useEffect(() => {
    setUpdateResValue({type: "rating",isDataAnalytics: true})
  },[])
const commaText = usedCount > 0 && ((totalCount - usedCount) > 0) ? ',' : ""
  return (
    <>
      <div className="ratingQuestion_cnt">
        <div className="d-flex justify-content-between gap-2 mb-xxl-4 mb-3 flex-wrap">
          <div className="me-2">
            <h4 className="ratingQuestion_Head">
              Jump Sequence Block - Add Rating Question
            </h4>
            {/* <p className="ratingQuestion_Para mb-0">
              {usedCount} Questions added so far, {totalCount - usedCount}{" "}
              Questions can be added.
            </p> */}
            <p className="ratingQuestion_Para mb-2">
              {usedCount > 0 && (<> {usedCount} Questions added so far</>)}
              {(totalCount - usedCount) > 0 && (
                <>{commaText}&nbsp;{totalCount - usedCount} Questions can be added.</>
              )}
            </p>
          </div>
          <CommonInfoLink handleClick={handleClick} />
        </div>
        {/* {DaIGToggele ? (
          <SingleRatingJumpQuestionDA
            questionBankShow={questionBankShow}
            handleCommunicationQuestions={handleCommunicationQuestions}
            parentGateQuestionID={parentGateQuestionID}
            parentIntentions={parentIntentions}
            parentIntentionShortName={parentIntentionShortName}
            responseType={responseType}
            grouppedData={grouppedData}
            surveyType={surveyType}
            userData={userData}
            outcome={outcome}
            surveyID={surveyID}
            companyID={companyID}
            fetchQuestion={fetchQuestion}
            totalCount={totalCount}
            usedCount={usedCount}
            questionOptions={questionOptions}
            parentIntentionID={parentIntentionID}
          />
        ) : (
          <SingleRatingJumpQuestionIG
            questionBankShow={questionBankShow}
            handleCommunicationQuestions={handleCommunicationQuestions}
            parentGateQuestionID={parentGateQuestionID}
            parentIntentions={parentIntentions}
            parentIntentionShortName={parentIntentionShortName}
            responseType={responseType}
            grouppedData={grouppedData}
            surveyType={surveyType}
            userData={userData}
            outcome={outcome}
            surveyID={surveyID}
            companyID={companyID}
            fetchQuestion={fetchQuestion}
            totalCount={totalCount}
            usedCount={usedCount}
            questionOptions={questionOptions}
            parentIntentionID={parentIntentionID}
          />
        )} */}
        <SingleRatingJumpQuestionDaIg
          questionBankShow={questionBankShow}
          handleCommunicationQuestions={handleCommunicationQuestions}
          parentGateQuestionID={parentGateQuestionID}
          parentIntentions={parentIntentions}
          parentIntentionShortName={parentIntentionShortName}
          responseType={responseType}
          grouppedData={grouppedData}
          surveyType={surveyType}
          userData={userData}
          outcome={outcome}
          surveyID={surveyID}
          companyID={companyID}
          fetchQuestion={fetchQuestion}
          totalCount={totalCount}
          usedCount={usedCount}
          questionOptions={questionOptions}
          parentIntentionID={parentIntentionID}
          questionType={DaIGToggele}


        />
      </div>
    </>
  );
};

export default SingleRatingJumpQuestion;
