import DropZone from "./DnDComponents/DropZone";
import QuestionList from "./DnDComponents/QuestionList/QuestionList";

export default function SetupOutCome({
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
  renderQuestionList,
  handleQuestionRearrange,
  questionComponentLoading
}) {
  return (
    <>
      <div className="dataAnalyticsCol">
        <QuestionList
          questions={outcome?.question}
          outcome={outcome}
          updateQuestionListByOutComeID={updateQuestionListByOutComeID}
          renderQuestionList={renderQuestionList}
          handleQuestionRearrange={handleQuestionRearrange}
          questionComponentLoading={questionComponentLoading}
        />

        <DropZone
          activeForm={activeForm}
          setActiveForm={setActiveForm}
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          outcome={outcome}
          surveyID={surveyID}
          companyID={companyID}
          updateQuestionListByOutComeID={updateQuestionListByOutComeID}
          totalCount={totalCount}
          usedCount={usedCount}
        />
      </div>
    </>
  );
}
