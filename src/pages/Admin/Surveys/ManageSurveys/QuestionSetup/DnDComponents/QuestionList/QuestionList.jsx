import React, { useEffect, useState } from "react";
import { Accordion, Form } from "react-bootstrap";
import { Loader, ModalComponent, SweetAlert } from "components";

import { QuestionSetup } from "apiEndpoints/QuestionSetup";

import { useAuth, useSurveyDataOnNavigations } from "customHooks";
import { commonService } from "services/common.service";
import {
  SingleRatingResponse,
  NestedQuestionResponse,
  MultipleResonse,
  OEQResponse,
  BranchFilterResponse,
} from "./ResponseType";
import QuestionActions from "./SubComponent/QuestionActions";
import {
  DemographicUpload,
  MultiResponse,
  NestedQuestion,
  OpenEndedQuestion,
  RatingQuestion,
  VisibleDemographic,
} from "../Forms";
import GateQualiferResponse from "./ResponseType/GateQualiferResponse";
import EditGateQualifierForm from "../Forms/GateQualifierQuestionSubComponent/EditGateQualifierForm";


const QuestionList = ({
  questions,
  outcome,
  updateQuestionListByOutComeID,
  renderQuestionList,
  handleQuestionRearrange,
  questionComponentLoading,
  isGate,
  fetchQuestion,
  parentGateQuestionID


}) => {
  const [questionOrder, setQuestionOrder] = useState();
  const EDIT_MODE = true;

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editQuestionData, setEditQuestionData] = useState(null);
  const { getSurveyDataOnNavigate } = useSurveyDataOnNavigations();
  const surevyData = getSurveyDataOnNavigate();
  const status = surevyData?.status !== 'Design';

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  useEffect(() => {
    setQuestionOrder(questions);
  }, [questions?.length, renderQuestionList,questions,questions]);

  const moveItem = (fromIndex, toIndex) => {
    const updatedQuestions = [...questionOrder];
    const temp = updatedQuestions[toIndex];
    updatedQuestions[toIndex] = updatedQuestions[fromIndex];
    updatedQuestions[fromIndex] = temp;
    setQuestionOrder(updatedQuestions);
    let QuestionsIdArray = updatedQuestions?.map((data) => data?.questionNo);
    handleQuestionRearrange(outcome?.id, QuestionsIdArray);
  };

  const deleteQuestion = async (questionId) => {
    setIsLoading(true);
    try {
      const response = await commonService({
        apiEndPoint: QuestionSetup.deleteQuestion,
        bodyData: {
          questionID: questionId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setQuestionOrder(
          questionOrder.filter((q) => q.questionID !== questionId)
        );
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onConfirmAlertModal = async () => {
    setIsAlertVisible(false);
    if (selectedQuestionId) {
      await deleteQuestion(selectedQuestionId);
      setSelectedQuestionId(null);
    }
    return true;
  };

  const handleDeleteClick = (questionId) => {
    if (!status) {
      setSelectedQuestionId(questionId);
      setIsAlertVisible(true);

    }

  };

  const handleEditClick = (questionData) => {
    setEditQuestionData(questionData);
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    setEditQuestionData(null);
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
    if ((fromIndex || fromIndex === 0) && fromIndex !== index) {
      moveItem(fromIndex, index);
    }
  };

  return (
    <div className="ratingQuestion p-0">
      {questionComponentLoading && <Loader />}
      {isLoading && <Loader />}

      {!questionComponentLoading &&
        !isLoading &&
        questionOrder?.length > 0 &&
        questionOrder.map((data, index) => (
          <Accordion key={`question-${index}`}>
      
            <div
              className="commonQuestion"
              draggable
              onDragStart={handleDragStart(index)}
              onDragOver={handleDragOver()}
              onDrop={handleDrop(index)}
            >
              <Accordion.Item eventKey={index.toString()}>
                <Accordion.Header>
                  <div className="d-flex justify-content-between align-items-start flex-wrap">
                    <p className="d-flex align-items-center mb-0 me-2 mt-sm-0 mt-3 pt-sm-0 pt-1">
                      <em className="icon-drag d-sm-block d-none" />
                      {/* {`${data?.questionNo}. ${data?.question}`} */}
                      {`${index + 1}. ${data?.question}`}

                    </p>
                  </div>
                  <QuestionActions
                    onDeleteClick={handleDeleteClick}
                    onEditClick={() => handleEditClick(data)}
                    questionID={data.questionID}
                    isScore={data.isScore}
                    questionType={data.questionType}
                    questionData={data}
                  />
                </Accordion.Header>

                <Accordion.Body>
                  <div className="dataAnalyticsCol">
                    {data?.questionType === "R" && (
                      <SingleRatingResponse data={data} />
                    )}

                    {data?.questionType === "N" && (
                      <NestedQuestionResponse data={data} />
                    )}

                    {data?.questionType === "O" && <OEQResponse data={data} />}

                    {data?.questionType === "MR" && (
                      <MultipleResonse data={data} />
                    )}

                    {data?.questionType === "G" && (
                      <GateQualiferResponse
                        data={data}
                        outcome={outcome}
                        updateQuestionListByOutComeID={
                          updateQuestionListByOutComeID
                        }
                        renderQuestionList={renderQuestionList}
                        isSkip={data.isSkip}
                      />
                    )}

                    {data?.questionType === "D" && !data?.isBranchFilter && (
                      <SingleRatingResponse data={data} />
                    )}

                    {data?.questionType === "D" && data?.isBranchFilter && (
                      <BranchFilterResponse data={data.response} />
                    )}

                    {(data.isSkip && data?.questionType !== "G")  && (
                      <Form.Group
                        className="form-group mb-0 d-inline-block"
                        controlId={`skip${index}`}
                      >
                        <Form.Check
                          className="me-0"
                          type="checkbox"
                          label="Skip For Now"
                        />
                      </Form.Group>
                    )}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </div>
          </Accordion>
        ))}

      <ModalComponent
        modalHeader="Edit Question"
        extraClassName="questionModal"
        show={showEditModal}
        size="xl"
        onHandleCancel={handleEditClose}
      >
        {editQuestionData && (
          <>
            {editQuestionData.questionType === "R" && (
              <RatingQuestion
                setActiveForm={() => { }}
                class="ratingQuestionModal"
                outcome={outcome}
                surveyID={editQuestionData.surveyID}
                companyID={editQuestionData.companyID}
                updateQuestionListByOutComeID={updateQuestionListByOutComeID}
                totalCount={0}
                usedCount={0}
                handleEditClose={handleEditClose}
                initialQuestionData={editQuestionData}
                edit={EDIT_MODE}
                isGate={isGate}
                fetchQuestion={fetchQuestion}
                parentGateQuestionID={parentGateQuestionID}
              />
            )}

            {editQuestionData.questionType === "O" && (
              <OpenEndedQuestion
                setActiveForm={() => { }}
                outcome={outcome}
                surveyID={editQuestionData.surveyID}
                companyID={editQuestionData.companyID}
                handleEditClose={handleEditClose}
                updateQuestionListByOutComeID={updateQuestionListByOutComeID}
                totalCount={0}
                usedCount={0}
                initialQuestionData={editQuestionData}
                edit={EDIT_MODE}
              />
            )}

            {editQuestionData.questionType === "N" && (
              <NestedQuestion
                setActiveForm={() => { }}
                outcome={outcome}
                surveyID={editQuestionData.surveyID}
                companyID={editQuestionData.companyID}
                updateQuestionListByOutComeID={updateQuestionListByOutComeID}
                totalCount={0}
                usedCount={0}
                initialQuestionData={editQuestionData}
                handleEditClose={handleEditClose}
                edit={EDIT_MODE}
                isGate={isGate}
                fetchQuestion={fetchQuestion}
                parentGateQuestionID={parentGateQuestionID}
                
              />
            )}

            {editQuestionData.questionType === "MR" && (
              <MultiResponse
                setActiveForm={() => { }}
                outcome={outcome}
                surveyID={editQuestionData.surveyID}
                companyID={editQuestionData.companyID}
                updateQuestionListByOutComeID={updateQuestionListByOutComeID}
                totalCount={0}
                usedCount={0}
                initialQuestionData={editQuestionData}
                handleEditClose={handleEditClose}
                edit={EDIT_MODE}
              />
            )}

            {editQuestionData.questionType === "G" && (
              <EditGateQualifierForm
                setActiveForm={() => { }} // Pass the prop
                outcome={outcome}
                surveyID={editQuestionData.surveyID}
                companyID={editQuestionData.companyID}
                updateQuestionListByOutComeID={updateQuestionListByOutComeID}
                totalCount={0}
                usedCount={0}
                initialQuestionData={editQuestionData}
                handleEditClose={handleEditClose}
                userData={userData}
                edit={EDIT_MODE}
              />
            )}

            {editQuestionData.questionType === "D" &&
              !editQuestionData.isPreLoad && (
                <VisibleDemographic
                  setActiveForm={() => { }}
                  outcome={outcome}
                  surveyID={editQuestionData.surveyID}
                  companyID={editQuestionData.companyID}
                  updateQuestionListByOutComeID={updateQuestionListByOutComeID}
                  totalCount={0}
                  usedCount={0}
                  initialQuestionData={editQuestionData}
                  handleEditClose={handleEditClose}
                  edit={EDIT_MODE}
                />
              )}

            {editQuestionData.questionType === "D" &&
              editQuestionData.isPreLoad && (
                <DemographicUpload
                  setActiveForm={() => { }}
                  outcome={outcome}
                  surveyID={editQuestionData.surveyID}
                  companyID={editQuestionData.companyID}
                  updateQuestionListByOutComeID={updateQuestionListByOutComeID}
                  totalCount={0}
                  usedCount={0}
                  initialQuestionData={editQuestionData}
                  handleEditClose={handleEditClose}
                  edit={EDIT_MODE}
                />
              )}
          </>
        )}
      </ModalComponent>

      <SweetAlert
        title="Are you sure?"
        text="You want to delete this data!"
        show={isAlertVisible}
        icon="warning"
        onConfirmAlert={onConfirmAlertModal}
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={setIsAlertVisible}
        isConfirmedTitle="Deleted!"
        isConfirmedText="Question deleted successfully."
      />
    </div>
  );
};

export default QuestionList;
