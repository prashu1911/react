import { useState, useEffect } from "react";
import { Dropdown, Form } from "react-bootstrap";
import { commonService } from "services/common.service";
import { useAuth, useSurveyDataOnNavigations } from "customHooks";
import { QuestionSetup } from "apiEndpoints/QuestionSetup";
import QuestionList from "../QuestionList";
import { Button } from "../../../../../../../../components";
import SingleRatingJumpQuestion from "../../Forms/GateQualifierQuestionSubComponent/SingleRatingJumpQuestion";
import NestedJumpQuestion from "../../Forms/GateQualifierQuestionSubComponent/NestedJumpQuestion";

const GateQualiferResponse = ({
  data,
  outcome,
  updateQuestionListByOutComeID,
  renderQuestionList,
  isSkip,
}) => {
  if (!data?.response?.length) return null;

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const { getSurveyDataOnNavigate } = useSurveyDataOnNavigations();
  const surevyData = getSurveyDataOnNavigate();
  const status = surevyData?.status !== "Design";
  const [surveyType, setSurveyType] = useState([]);
  const [questionType, setQuestionType] = useState(null);
  const [testData, setTestData] = useState(null);
  const isGate = true;

  const parentQuestionID = data?.questionID || 1;
  const [responseType, setResponseType] = useState([]);
  const [grouppedData, setGrouppedData] = useState([]);
  const [updateResValue, setUpdateResValue] = useState({
    type: null,
    isDataAnalytics: true,
  });
  const questionOptions = [
    { value: "Demographic", label: "Demographic" },
    { value: "Rating", label: "Rating" },
    { value: "Nested", label: "Nested" },
    { value: "Multi Response", label: "Multi Response" },
    { value: "Open Ended", label: "Open Ended" },
    { value: "Gate Qualifier", label: "Gate Qualifier" },
  ];
  function convertSurveyData(surveyData) {
    return surveyData.map((item) => ({
      label: item.value,
      value: item.libraryElementID,
    }));
  }

  const fetchQuestion = async () => {
    try {
      const response = await commonService({
        apiEndPoint: QuestionSetup.fetchQuestion,
        queryParams: {
          questionID: data?.questionID,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setTestData(response?.data?.data);
        // eslint-disable-next-line no-use-before-define
        fetchResponseType();
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error add outcome:", error);
    }
  };
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

  const fetchResponseType = async () => {
    try {
      const queResType = updateResValue.isDataAnalytics
        ? "Data_Analytics"
        : "Information_Gathering";
      const response = await commonService({
        apiEndPoint: QuestionSetup.getResponseType,
        queryParams: {
          surveyID: data.surveyID,
          companyID: data.companyID,
          responseType: queResType,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        const rawData = response.data.data || [];

        const transformedData = [
          { value: "123456789", label: "Free-From" },
          ...rawData.map((item) => ({
            value: item.responseTypeID,
            label: item.responseType,
          })),
        ];

        setResponseType(transformedData);

        const grouped = [
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
          ...rawData,
        ];

        setGrouppedData(grouped);
      }
    } catch (error) {
      console.error("Error fetching response type:", error);
    }
  };
  const handleJumpNestedBlock = () => {
    setQuestionType(null);
  };

  useEffect(() => {
    fetchSurveyType();
  }, [data]);

  useEffect(() => {
    if (updateResValue.type) {
      fetchResponseType();
    }
  }, [updateResValue]);

  const handleJumpSequence = () => {
    setQuestionType("RATING");
  };
  const handleCommunicationQuestions = () => {
    setQuestionType(null);
  };
  const handleSaveAddNestedQuestion = () => {
    setQuestionType("NESTED");
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-start flex-wrap">
        {/* <p className="d-flex align-items-center me-2">{data.question}</p> */}
      </div>

      <div
        className="allOptions d-flex flex-wrap gap-2 flex-column"
        style={{ width: "max-content", minWidth: "200px", maxWidth: "100%" }}
      >
        {data.response.map((type, index) => (
          <Form.Group key={index} className=" mb-0">
            <Form.Check
              inline
              label={type.response}
              name={`group${index}`}
              type="radio"
              // defaultChecked
              id={`inline-${index}`}
              className="me-0"
            />
          </Form.Group>
        ))}
      </div>
      {isSkip && (
        <div className="m-2">
          <Form.Group className=" mb-0 " controlId={`skip${11}`}>
            <Form.Check className="me-0" type="checkbox" label="Skip For Now" />
          </Form.Group>
        </div>
      )}
      {(data.sequence?.length > 0 || testData?.sequence?.length > 0) && (
        <QuestionList
          outcome={outcome}
          updateQuestionListByOutComeID={updateQuestionListByOutComeID}
          renderQuestionList={renderQuestionList}
          questions={testData ? testData?.sequence : data.sequence}
          isGate={isGate}
        />
      )}
      {!status && (
        <div className="ratingQuestion_cnt mb-2">
          <div className="addOutcomes border-0 p-0 py-2 my-4 text-center d-flex align-items-center flex-column">
            <div className="d-flex gap-2 flex-wrap justify-content-center">
              {/* <Button variant="outline-primary" className="ripple-effect">
              Complete
            </Button> */}
              <Dropdown>
                <Dropdown.Toggle variant="primary">
                  <em className="icon-plus" />
                  Add Jump Questions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleJumpSequence}>
                    Rating Question
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleSaveAddNestedQuestion}>
                    Nested Question
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      )}

      {questionType === "RATING" && (
        <SingleRatingJumpQuestion
          handleCommunicationQuestions={handleCommunicationQuestions}
          fetchQuestion={fetchQuestion}
          parentGateQuestionID={parentQuestionID}
          parentIntentions={data?.intentionName}
          parentIntentionShortName={data?.intentionShortName}
          responseType={responseType}
          grouppedData={grouppedData}
          surveyType={surveyType}
          userData={userData}
          outcome={outcome}
          surveyID={data?.surveyID}
          companyID={data?.companyID}
          initialQuestionData={data}
          totalCount={0}
          usedCount={0}
          questionOptions={questionOptions}
          parentIntentionID={data?.intentionID}
          setUpdateResValue={setUpdateResValue}
        />
      )}
      {questionType === "NESTED" && (
        <NestedJumpQuestion
          handleJumpNestedBlock={handleJumpNestedBlock}
          // fetchQuestion={fetchQuestion}
          // parentGateQuestionID={parentGateQuestionID}
          // parentIntentions={parentIntentions}
          // parentIntentionShortName={parentIntentionShortName}
          // responseType={responseType}
          // grouppedData={grouppedData}
          // surveyType={surveyType}
          // userData={userData}
          // outcome={outcome}
          // initialQuestionData={initialQuestionData}
          // surveyID={surveyID}
          // companyID={companyID}
          // totalCount={totalCount}
          // usedCount={usedCount}
          // questionOptions={questionOptions}
          // parentIntentionID={parentIntentionID}
          fetchQuestion={fetchQuestion}
          parentGateQuestionID={parentQuestionID}
          parentIntentions={data?.intentionName}
          parentIntentionShortName={data?.intentionShortName}
          responseType={responseType}
          grouppedData={grouppedData}
          surveyType={surveyType}
          userData={userData}
          outcome={outcome}
          surveyID={data?.surveyID}
          companyID={data?.companyID}
          initialQuestionData={data}
          totalCount={0}
          usedCount={0}
          questionOptions={questionOptions}
          parentIntentionID={data?.intentionID}
          setUpdateResValue={setUpdateResValue}
        />
      )}
    </>
  );
};

export default GateQualiferResponse;
