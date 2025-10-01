import { useEffect, useState } from "react";
import { commonService } from "services/common.service";
import { QuestionSetup } from "apiEndpoints/QuestionSetup";
import { useAuth, useSurveyDataOnNavigations } from "customHooks";
import CommonInfoLink from "../../CommonInfoLink";
import CommonEditinfoLink from "../../CommonEditinfoLink";
import {
  NestedQuestionDaIg
} from "./NestedQuestionSubComponent";

export default function NestedQuestion({
  setActiveForm,
  outcome,
  surveyID,
  companyID,
  updateQuestionListByOutComeID,
  totalCount,
  usedCount,
  handleEditClose,
  initialQuestionData,
  edit,
  isGate,
  fetchQuestion,
  parentGateQuestionID
}) {
  // Importing user data from custom authentication hook
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const { getSurveyDataOnNavigate } = useSurveyDataOnNavigations();
  const surevyData = getSurveyDataOnNavigate();

  const questionOptions = [
    { value: "Demographic", label: "Demographic" },
    { value: "Rating", label: "Rating" },
    { value: "Nested", label: "Nested" },
    { value: "Multi Response", label: "Multi Response" },
    { value: "Open Ended", label: "Open Ended" },
    { value: "Gate Qualifier", label: "Gate Qualifier" },
  ];
  const [DaIGToggele, setDaIGToggele] = useState(true);
  const [sharedFormData, setSharedFormData] = useState({
    question: "",
    intentions: "",
    intentionsShortName: "",
    displaySkipForNow: false,

    type: "",
    responseType: "",
    scale: 1,
    nestedGraph: false,
    surveyType: "",
    keyWord: "",
    addToResource: false,
    responseBlockName: "",
    addQuestionToResource: false,
    randomizeQuestions: false,
    responseViewOption: surevyData?.isSlider ? "slider":"vertical",
    responses: [],
    subResponses: [],

  });

  // Add useEffect for handling initialQuestionData's isScore
  useEffect(() => {
    if (initialQuestionData) {
      // Route to DA if isScore is 1, otherwise to IG
      setDaIGToggele(initialQuestionData.isScore === 1);
    }
  }, [initialQuestionData]);

  const [surveyType, setSurveyType] = useState([]);
  const [responseType, setResponseType] = useState([]);
  const [grouppedData, setGrouppedData] = useState([]);

  const handleClick = (activeInfoLink) => {
    if (activeInfoLink === "Data Analytics") {
      setDaIGToggele(true);
    } else {
      setDaIGToggele(false);
    }
  };

  function convertSurveyData(surveyData) {
    return surveyData.map((item) => ({
      label: item.value,
      value: item.libraryElementID,
    }));
  }

  const fetchResponseType = async () => {
    try {
      const queResType = DaIGToggele ? "Data_Analytics" : "Information_Gathering"
      const response = await commonService({
        apiEndPoint: QuestionSetup.getResponseType,
        queryParams: edit ? { surveyID, companyID, questionID: initialQuestionData?.questionID,responseType : queResType  } : { surveyID, companyID,responseType : queResType },
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
            isQuestionLevel: temp?.isQuestionLevel
          });
        }

        setResponseType(transformedData);
        setGrouppedData([
          {
            responseType: "Free-From",
            responseTypeID: "123456789",
            responses: [
              {
                responseName: "",
                scale: 1,
                responseWeightage: ".0000",
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
    fetchResponseType();
  },[DaIGToggele])

  const commaText = usedCount > 0 && ((totalCount - usedCount) > 0) ? ',' : ""

  return (
    <div className="ratingQuestion nestedModal">
      <div className="d-flex align-items-start justify-content-between flex-wrap mb-xl-2 mb-3">
        <div className="me-2">
          <h4 className="ratingQuestion_Head">Nested Question</h4>
          {/* <p className="ratingQuestion_Para mb-2">
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
        {!initialQuestionData && (
          <CommonInfoLink
            handleClick={handleClick}
            activeTab={DaIGToggele ? "Data Analytics" : "Implementation Guide"}
          />
        )}
        {initialQuestionData && (
          <CommonEditinfoLink
            isScore={DaIGToggele}
          // handleClick={handleClick}
          // activeTab={DaIGToggele ? "Data Analytics" : "Implementation Guide"}
          />
        )}
      </div>
      {/* {DaIGToggele ? (
        <NestedQuestionDA
          setActiveForm={setActiveForm}
          outcome={outcome}
          surveyID={surveyID}
          companyID={companyID}
          surveyType={surveyType}
          responseType={responseType}
          initialQuestionData={initialQuestionData}
          grouppedData={grouppedData}
          userData={userData}
          updateQuestionListByOutComeID={updateQuestionListByOutComeID}
          questionOptions={questionOptions}
          handleEditClose={handleEditClose}
          sharedFormData={sharedFormData}
          setSharedFormData={setSharedFormData} 
          edit={edit}
        />
      ) : (
        <NestedQuestionIG
          setActiveForm={setActiveForm}
          outcome={outcome}
          surveyID={surveyID}
          companyID={companyID}
          surveyType={surveyType}
          responseType={responseType}
          grouppedData={grouppedData}
          userData={userData}
          updateQuestionListByOutComeID={updateQuestionListByOutComeID}
          questionOptions={questionOptions}
          initialQuestionData={initialQuestionData}
          handleEditClose={handleEditClose}
          sharedFormData={sharedFormData}
          setSharedFormData={setSharedFormData} 
        />
      )} */}
      <NestedQuestionDaIg
        setActiveForm={setActiveForm}
        outcome={outcome}
        surveyID={surveyID}
        companyID={companyID}
        surveyType={surveyType}
        responseType={responseType}
        initialQuestionData={initialQuestionData}
        grouppedData={grouppedData}
        userData={userData}
        updateQuestionListByOutComeID={updateQuestionListByOutComeID}
        questionOptions={questionOptions}
        handleEditClose={handleEditClose}
        sharedFormData={sharedFormData}
        setSharedFormData={setSharedFormData}
        edit={edit}
        questionType={DaIGToggele}
        isGate={isGate}
        fetchQuestion={fetchQuestion}
        parentGateQuestionID={parentGateQuestionID}
      />

    </div>
  );
}
