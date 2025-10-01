import { useEffect, useState } from "react";

import CommonInfoLink from "../../../CommonInfoLink";
import {
  // NestedJumpQuestionDA,
  // NestedJumpQuestionIG,
  NestedJumpQuestionDaIg
} from "./NestedJumpQuestionSubComponent";

const NestedJumpQuestion = ({
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
  handleJumpNestedBlock,
  questionOptions,
  parentIntentionID,
  setUpdateResValue
}) => {
  const [DaIGToggele, setDaIGToggele] = useState(true);

  const handleClick = (activeInfoLink) => {
    if (activeInfoLink === "Data Analytics") {
      setDaIGToggele(true);
      setUpdateResValue({type: 'nested',isDataAnalytics: true})
    } else {
      setDaIGToggele(false);
      setUpdateResValue({type: 'nested',isDataAnalytics: false})
    }
  };

  useEffect(() => {
     setUpdateResValue({type: 'nested',isDataAnalytics: true})
  },[])
const commaText = usedCount > 0 && ((totalCount - usedCount) > 0) ? ',' : ""
  return (
    <div className="ratingQuestion_cnt">
      <div className="d-flex justify-content-between gap-2 mb-xxl-4 mb-3 flex-wrap">
        <div className="me-2">
          <h4 className="ratingQuestion_Head">
            Jump Sequence Block - Add Nested Question
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
        <NestedJumpQuestionDA
          handleJumpNestedBlock={handleJumpNestedBlock}
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
        <NestedJumpQuestionIG
          handleJumpNestedBlock={handleJumpNestedBlock}
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
      <NestedJumpQuestionDaIg
          handleJumpNestedBlock={handleJumpNestedBlock}
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
  );
};

export default NestedJumpQuestion;
