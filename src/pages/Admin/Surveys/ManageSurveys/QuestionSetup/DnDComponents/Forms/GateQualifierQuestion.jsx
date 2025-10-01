import { Dropdown, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth, useSurveyDataOnNavigations } from "customHooks";
import { QuestionSetup } from "apiEndpoints/QuestionSetup";
import { commonService } from "services/common.service";
import {
  Button,
  SweetAlert,
  ModalComponent,
} from "../../../../../../../components";
import CommonInfoLink from "../../CommonInfoLink";
// import CommonEditinfoLink from "../../CommonEditinfoLink";
import QuestionList from "../QuestionList/QuestionList";
import SingleRatingJumpQuestion from "./GateQualifierQuestionSubComponent/SingleRatingJumpQuestion";
import NestedJumpQuestion from "./GateQualifierQuestionSubComponent/NestedJumpQuestion";
import GateQualifierForm from "./GateQualifierQuestionSubComponent/GateQualifierForm";
import EditGateQualifierForm from "./GateQualifierQuestionSubComponent/EditGateQualifierForm";

export default function GateQualifierQuestion({
  setActiveForm,
  outcome,
  surveyID,
  companyID,
  handleEditClose,
  updateQuestionListByOutComeID,
  totalCount,
  usedCount,
  initialQuestionData,
}) {
  // Importing user data from custom authentication hook
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const isGate = true;
  // sweet alert
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [parentGateQuestionID, setParentGateQuestionID] = useState("");
  const [parentIntentions, setParentIntentions] = useState("");
  const [parentIntentionShortName, setParentIntentionShortName] = useState("");
  const [responseType, setResponseType] = useState([]);
  const [grouppedData, setGrouppedData] = useState([]);
  const [parentIntentionID, setParentIntentionID] = useState("");
  const isCreteUpdate = true;

  const [showEditModal, setShowEditModal] = useState(false);
  const [editQuestionData, setEditQuestionData] = useState(null);
  const [DaIGToggele, setDaIGToggele] = useState(true);
  const [updateResValue, setUpdateResValue] = useState({
    type: null,
    isDataAnalytics: true,
  });

  const { getSurveyDataOnNavigate } = useSurveyDataOnNavigations();
  const surevyData = getSurveyDataOnNavigate();
  // const rangeStart = Number.isNaN(Number(surevyData?.rangeStart)) ? 0 : Number(surevyData?.rangeStart);
  const rangeEnd = Number.isNaN(Number(surevyData?.rangeEnd))
    ? 0
    : Number(surevyData?.rangeEnd);

  const questionOptions = [
    { value: "Demographic", label: "Demographic" },
    { value: "Rating", label: "Rating" },
    { value: "Nested", label: "Nested" },
    { value: "Multi Response", label: "Multi Response" },
    { value: "Open Ended", label: "Open Ended" },
    { value: "Gate Qualifier", label: "Gate Qualifier" },
  ];

  const [testData, setTestData] = useState({});

  // Add useEffect for handling initialQuestionData's isScore
  useEffect(() => {
    if (initialQuestionData) {
      // Route to DA if isScore is 1, otherwise to IG
      setDaIGToggele(initialQuestionData.isScore === 1);
    }
  }, [initialQuestionData]);

  const deleteModal = async () => {
    try {
      await commonService({
        apiEndPoint: QuestionSetup.deleteQuestion,
        bodyData: {
          questionID: parentGateQuestionID,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (initialQuestionData?.questionID) {
        handleEditClose();
      } else {
        setActiveForm([]);
      }

      return true;
    } catch (error) {
      return false;
    } finally {
      setIsAlertVisible(false);
    }
  };

  const onConfirmAlertModal = () => {
    deleteModal();
  };

  // Prevent accordion from opening
  const handleDeleteClick = (event) => {
    event.stopPropagation();
    setIsAlertVisible(true);
    // deleteModal(); // Trigger delete modal logic
  };
  const [surveyType, setSurveyType] = useState([]);

  const [showGateQuestion, setShowGateQuestion] = useState(true);
  const [showJumpSequence, setShowJumpSequence] = useState(false);
  const [showCommunicationQuestions, setShowCommunicationQuestions] =
    useState(false);
  const [showSaveJumpNestedBlock, setShowSaveJumpNestedBlock] = useState(false);
  const [showSaveAddNestedQuestion, setShowSaveAddNestedQuestion] =
    useState(false);

  const fetchQuestion = async (parentQuestionID) => {
    try {
      const response = await commonService({
        apiEndPoint: QuestionSetup.fetchQuestion,
        queryParams: {
          questionID: parentQuestionID,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setTestData(response?.data?.data);
        // eslint-disable-next-line no-use-before-define
        // fetchResponseType();
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error add outcome:", error);
    }
  };

  const handleJumpNestedBlock = () => {
    setShowSaveJumpNestedBlock(true);
    setShowGateQuestion(false);
    setShowSaveAddNestedQuestion(false);
    setShowCommunicationQuestions(false);
  };
  const handleJumpSequence = (parentQuestionID) => {
    fetchQuestion(parentQuestionID);
    setShowJumpSequence(true);
    setShowGateQuestion(false);
    setShowSaveAddNestedQuestion(false);
    setShowCommunicationQuestions(false);
    setShowSaveJumpNestedBlock(false);
  };
  const handleCommunicationQuestions = () => {
    setShowCommunicationQuestions(true);
    setShowJumpSequence(false);
    setShowGateQuestion(false);
    setShowSaveAddNestedQuestion(false);
    setShowSaveJumpNestedBlock(false);
  };
  const handleSaveAddNestedQuestion = (parentQuestionID) => {
    fetchQuestion(parentQuestionID);
    setShowSaveAddNestedQuestion(true);
    setShowJumpSequence(false);
    setShowGateQuestion(false);
    setShowCommunicationQuestions(false);
    setShowSaveJumpNestedBlock(false);
  };

  const fetchResponseType = async () => {
    try {
      const queResType = updateResValue.isDataAnalytics
        ? "Data_Analytics"
        : "Information_Gathering";
      const response = await commonService({
        apiEndPoint: QuestionSetup.getResponseType,
        queryParams: { surveyID, companyID, responseType: queResType },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        let transformedData = [{ value: "123456789", label: "Free-From" }];
        for (let temp of response?.data?.data) {
          transformedData.push({
            value: temp?.responseTypeID,
            label: temp?.responseType,
          });
        }
        setResponseType(transformedData);
        const responseData = response?.data?.data;
        const tempData = responseData?.map((itemParent) => {
          const responseEnd = rangeEnd || 1; // fallback if responseEnd not defined
          const updatedResponses = itemParent?.responses?.map((item, idx) => {
            const weight = idx === 0 ? 0 : responseEnd / (idx + 1);
            return {
              ...item,
              responseWeightage: weight.toFixed(4),
            };
          });

          return {
            ...itemParent,
            responses: updatedResponses,
          };
        });

        setGrouppedData([
          {
            responseType: "Free-From",
            responseTypeID: "123456789",
            responses: [
              {
                responseName: "",
                scale: 1,
                responseWeightage: 5,
                responseCategory: 1,
                isOEQ: 0,
                oeqQuestion: "",
              },
            ],
          },
          ...(Array.isArray(response?.data?.data) ? response?.data?.data : []),
        ]);
      }
    } catch (error) {
      console.error("Error add outcome:", error);
    }
  };

  function convertSurveyData(surveyData) {
    return surveyData.map((item) => ({
      label: item.value,
      value: item.libraryElementID,
    }));
  }

  const fetchSurveyType = async () => {
    try {
      const response = await commonService({
        apiEndPoint: QuestionSetup.getSurveyType,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status && response?.data?.data?.surveyType?.length > 0) {
        const convertedData = convertSurveyData(
          response?.data?.data?.surveyType
        );

        setGrouppedData([
          {
            responseType: "Free-From",
            responseTypeID: "123456789",
            responses: [
              {
                responseName: "",
                scale: 1,
                responseWeightage: null,
                responseCategory: 1,
                isOEQ: 0,
                oeqQuestion: "",
              },
            ],
          },
          ...(Array.isArray(response?.data?.data?.response)
            ? response?.data?.data?.response
            : []),
        ]);
        setSurveyType(convertedData);
      } else {
        setSurveyType([]);
      }
    } catch (error) {
      console.error("Error add outcome:", error);
    }
  };

  useEffect(() => {
    fetchSurveyType();
  }, []);

  useEffect(() => {
    if (updateResValue.type) {
      fetchResponseType();
    }
  }, [updateResValue]);

  const isValidCondition = (testDataVariable) => {
    const hasTestData = Object.values(testDataVariable).length > 0;

    return (
      (showCommunicationQuestions && hasTestData) ||
      (showJumpSequence && hasTestData) ||
      (showSaveAddNestedQuestion && hasTestData) ||
      (showSaveJumpNestedBlock && hasTestData)
    );
  };

  const onHandleComplete = () => {
    updateQuestionListByOutComeID(outcome?.id);
    setActiveForm([]);
  };

  const handleEditClick = () => {
    setEditQuestionData(testData);
    setShowEditModal(true);
  };
  const handleEditCloseEdit = () => {
    setShowEditModal(false);
  };

  const handleSendUpdateData = (data) => {
    setTestData(data);
  };

  return (
    <div className="ratingQuestion gateModal">
      {showGateQuestion && (
        <GateQualifierForm
          setActiveForm={setActiveForm} // Pass the prop
          handleJumpSequence={handleJumpSequence}
          handleSaveAddNestedQuestion={handleSaveAddNestedQuestion}
          userData={userData}
          outcome={outcome}
          surveyID={surveyID}
          companyID={companyID}
          handleEditClose={handleEditClose}
          setParentGateQuestionID={setParentGateQuestionID}
          setParentIntentions={setParentIntentions}
          setParentIntentionID={setParentIntentionID}
          setParentIntentionShortName={setParentIntentionShortName}
          surveyType={surveyType}
          totalCount={totalCount}
          initialQuestionData={initialQuestionData}
          usedCount={usedCount}
          questionOptions={questionOptions}
          updatedData={handleSendUpdateData}
        />
      )}
      {isValidCondition(testData) && (
        <>
          <div className="commonQuestion">
            <div className="d-flex justify-content-between align-items-start flex-wrap">
              <p className="d-flex align-items-center mb-2 me-2">
                <em className="icon-drag d-sm-block d-none" />
                {testData?.question}
              </p>
              <div className="d-flex align-items-center gap-xxl-4 gap-md-3 gap-2 flex-wrap">
                <CommonInfoLink showDataAnalytics={false} showInfoGather />
                <div className="d-flex gap-xxl-4 gap-lg-3 gap-2">
                  <Link
                    aria-label="Edit icon"
                    onClick={() => {
                      handleEditClick();
                    }}
                  >
                    <em className="icon-table-edit" />
                  </Link>
                  {/* <Link to="#!" aria-label="Copy icon">
                    <em className="icon-copy" />
                  </Link> */}
                  <Link aria-label="Delete icon" onClick={handleDeleteClick}>
                    <em className="icon-delete" />
                  </Link>
                </div>
              </div>
            </div>

            {["radio"].map((type) => (
              <div
                key={`inline-${type}`}
                className="allOptions d-flex flex-wrap gap-2 flex-column"
              >
                {testData?.response?.length > 0 &&
                  testData.response.map((item) => (
                    <Form.Group
                      className="form-group mb-0"
                      key={item.responseID}
                      controlId={item.responseID.toString()}
                    >
                      <Form.Check
                        className="me-0"
                        inline
                        label={item.response}
                        name="group2"
                        type={type}
                        id={`inline-${type}-${item.responseID}`}
                        defaultChecked={item.response === "True"}
                      />
                    </Form.Group>
                  ))}
              </div>
            ))}
            <Form.Group
              className="form-group mb-0 d-inline-block"
              controlId="skip2"
            >
              <Form.Check
                className="me-0"
                type="checkbox"
                label={<div>Skip For Now</div>}
              />
            </Form.Group>
          </div>

          <QuestionList
            outcome={outcome}
            questions={testData.sequence}
            renderQuestionList={fetchQuestion}
            updateQuestionListByOutComeID={updateQuestionListByOutComeID}
            isGate={isGate}
            parentQuestionID={initialQuestionData?.questionID}
            fetchQuestion={fetchQuestion}
            parentGateQuestionID={parentGateQuestionID}
          />
        </>
      )}

      {showJumpSequence && (
        <>
          <SingleRatingJumpQuestion
            handleCommunicationQuestions={handleCommunicationQuestions}
            fetchQuestion={fetchQuestion}
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
            initialQuestionData={initialQuestionData}
            totalCount={totalCount}
            usedCount={usedCount}
            questionOptions={questionOptions}
            parentIntentionID={parentIntentionID}
            setUpdateResValue={setUpdateResValue}
          />
        </>
      )}

      {showSaveAddNestedQuestion && (
        <>
          <NestedJumpQuestion
            handleJumpNestedBlock={handleJumpNestedBlock}
            fetchQuestion={fetchQuestion}
            parentGateQuestionID={parentGateQuestionID}
            parentIntentions={parentIntentions}
            parentIntentionShortName={parentIntentionShortName}
            responseType={responseType}
            grouppedData={grouppedData}
            surveyType={surveyType}
            userData={userData}
            outcome={outcome}
            initialQuestionData={initialQuestionData}
            surveyID={surveyID}
            companyID={companyID}
            totalCount={totalCount}
            usedCount={usedCount}
            questionOptions={questionOptions}
            parentIntentionID={parentIntentionID}
            setUpdateResValue={setUpdateResValue}
          />
        </>
      )}

      {(showCommunicationQuestions || showSaveJumpNestedBlock) && (
        <>
          <div className="ratingQuestion_cnt">
            <div className="addOutcomes border-0 p-0 py-2 my-4 text-center d-flex align-items-center flex-column">
              <div className="d-flex gap-2 flex-wrap justify-content-center">
                <Button
                  variant="outline-primary"
                  className="ripple-effect"
                  onClick={onHandleComplete}
                >
                  Complete
                </Button>
                <Dropdown>
                  <Dropdown.Toggle variant="primary">
                    <em className="icon-plus" />
                    Add Jump Questions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => handleJumpSequence(parentGateQuestionID)}
                    >
                      Rating Question
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        handleSaveAddNestedQuestion(parentGateQuestionID)
                      }
                    >
                      Nested Question
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
          {/* <div className="addOutcomes text-center d-flex align-items-center flex-column">
            <div className="d-flex gap-2 flex-wrap justify-content-center">
              <Button
                variant="outline-primary"
                className="ripple-effect"
                onClick={questionBankShow}
              >
                <em className="icon-import me-2 d-sm-block d-none" /> Import
                from Question Bank
              </Button>
            </div>
            <p className="mb-0 fw-medium mt-md-3 mt-2">
              <span>Or</span> drag and drop Questions from the left panel
            </p>
          </div> */}
        </>
      )}

      <ModalComponent
        modalHeader="Edit Question"
        extraClassName="questionModal"
        show={showEditModal}
        size="xl"
        onHandleCancel={handleEditCloseEdit}
      >
        {editQuestionData && (
          <EditGateQualifierForm
            setActiveForm={() => {}} // Pass the prop
            outcome={outcome}
            surveyID={surveyID}
            companyID={companyID}
            updateQuestionListByOutComeID={updateQuestionListByOutComeID}
            totalCount={0}
            usedCount={0}
            initialQuestionData={editQuestionData}
            handleEditClose={handleEditCloseEdit}
            userData={userData}
            isCreteUpdate={isCreteUpdate}
            handleSendUpdateData={handleSendUpdateData}
            isGate={isGate}
          />
        )}
      </ModalComponent>
      <SweetAlert
        title="Are you sure?"
        text="You want to delete this data!"
        show={isAlertVisible}
        icon="warning"
        onConfirmAlert={deleteModal}
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={setIsAlertVisible}
        isConfirmedTitle="Deleted!"
        isConfirmedText="Your file has been deleted."
      />
    </div>
  );
}
