import { Loader } from "components";
import React, { useEffect, useState } from "react";

const QuestionListRearrange = ({
  questions,
  outcome,
  handleQuestionRearrange,
  questionComponentLoading,
  renderQuestionList,
}) => {
  const [questionOrder, setQuestionOrder] = useState();

  useEffect(() => {
    setQuestionOrder(questions);
  }, [questions?.length, renderQuestionList]);

  const moveItem = (fromIndex, toIndex) => {
    const updatedQuestions = [...questionOrder];
    const temp = updatedQuestions[toIndex];
    updatedQuestions[toIndex] = updatedQuestions[fromIndex];
    updatedQuestions[fromIndex] = temp;
    setQuestionOrder(updatedQuestions);
    let QuestionsIdArray = updatedQuestions?.map((data) => data?.questionNo);
    handleQuestionRearrange(outcome?.id, QuestionsIdArray);
  };

  const handleDragStart = (index) => (event) => {
    event.dataTransfer.setData("text/questions", index);
  };

  const handleDragOver = () => (event) => {
    event.preventDefault();
  };

  const handleDrop = (index) => (event) => {
    const fromIndex = parseInt(
      event.dataTransfer.getData("text/questions"),
      10
    );
    if (fromIndex && fromIndex !== index) {
      moveItem(fromIndex, index);
    }
  };

  return (
    <div className="modalAccordion_inner">
      {questionComponentLoading && <Loader />}
      {!questionComponentLoading &&
        questionOrder?.length > 0 &&
        questionOrder.map((data, index) => (
          <div
            className="commonQuestion cursorMove"
            draggable
            onDragStart={handleDragStart(index)}
            onDragOver={handleDragOver()}
            onDrop={handleDrop(index)}
          >
            <div className="d-flex justify-content-between align-items-start flex-wrap">
              <p className="d-flex align-items-center" >
                <em className="icon-drag d-sm-block d-none" />
                <span>{`${data?.questionNo}. ${data?.question}`}</span>
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default QuestionListRearrange;
