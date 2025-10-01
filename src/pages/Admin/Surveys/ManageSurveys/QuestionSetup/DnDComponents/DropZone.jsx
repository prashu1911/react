/* eslint-disable react/prop-types */
import React, { memo, useMemo } from "react";

const DropZone = ({
  activeForm,
  setActiveForm,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  outcome,
  surveyID,
  companyID,
  updateQuestionListByOutComeID,
  totalCount,
  usedCount,
}) => {
  // Use useMemo to memoize the matched form item
  const matchedFormItem = useMemo(() => {
    return activeForm.find((item) => item.outcomeId === outcome.id);
  }, [activeForm, outcome.id]);

  // Extract EmptyState into a separate component to prevent unnecessary re-renders
  const EmptyState = memo(() => (
    <div className="dataAnalyticsCol_inner">
      <div className="addOutcomes text-center d-flex align-items-center flex-column">
        {/* <div className="d-flex gap-2 flex-wrap justify-content-center">
          <Button
            variant="outline-primary"
            className="ripple-effect"
            onClick={questionBankShow}
          >
            <em className="icon-import me-2 d-sm-block d-none" />
            Import from Question Bank
          </Button>
        </div> */}
        <p className="mb-0 fw-medium">
          Drag and Drop Questions from the left panel
        </p>
      </div>
    </div>
  ));

  return (
    <div
      id="dataanalyticscol"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={(e) => {
        handleDrop(e, outcome);
      }}
    >
      {matchedFormItem ? (
        <div className="dataAnalyticsCol_inner">
          <div className="addOutcomes  p-0 ">
            <matchedFormItem.component
              setActiveForm={setActiveForm}
              outcome={outcome}
              surveyID={surveyID}
              companyID={companyID}
              updateQuestionListByOutComeID={updateQuestionListByOutComeID}
              totalCount={totalCount}
              usedCount={usedCount}
            />
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default memo(DropZone);
