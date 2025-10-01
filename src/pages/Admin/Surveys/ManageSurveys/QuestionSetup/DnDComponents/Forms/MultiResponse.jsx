import { useEffect, useState } from "react";
import { commonService } from "services/common.service";
import { QuestionSetup } from "apiEndpoints/QuestionSetup";
import { useAuth } from "customHooks";
import CommonInfoLink from "../../CommonInfoLink";
// import { MultiResponseDaIg } from "./MultiResponseSubComponent";
import MultiResponseDaIg from "./MultiResponseSubComponent/MultiResponseDaIg";
import CommonEditinfoLink from "../../CommonEditinfoLink";

export default function MultiResponse({
  setActiveForm,
  outcome,
  surveyID,
  companyID,
  updateQuestionListByOutComeID,
  totalCount,
  handleEditClose,
  usedCount,
  initialQuestionData, // Add this prop
  edit
}) {
  // Importing user data from custom authentication hook
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const questionOptions = [
    { value: "Demographic", label: "Demographic" },
    { value: "Rating", label: "Rating" },
    { value: "Nested", label: "Nested" },
    { value: "Multi Response", label: "Multi Response" },
    { value: "Open Ended", label: "Open Ended" },
    { value: "Gate Qualifier", label: "Gate Qualifier" },
  ];

  const [DaIGToggele, setDaIGToggele] = useState(true);
  const [responseType, setResponseType] = useState([]);
  const [grouppedData, setGrouppedData] = useState([]);
  const [surveyType, setSurveyType] = useState([]);
  const handleClick = (activeInfoLink) => {
    if (activeInfoLink === "Data Analytics") {
      setDaIGToggele(true);
    } else {
      setDaIGToggele(false);
    }
  };

  // Prefill DA/IG toggle based on initialQuestionData
  useEffect(() => {
    if (initialQuestionData) {
      // Route to DA if isScore is 1, otherwise to IG
      setDaIGToggele(initialQuestionData.isScore === 1);
    }
  }, [initialQuestionData]);

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
    <div className="ratingQuestion multiModal">
      <div className="d-flex align-items-start justify-content-between flex-wrap mb-xl-2 mb-3">
        <div className="me-2">
          <h4 className="ratingQuestion_Head">Multi Response</h4>
          {/* <p className="ratingQuestion_Para mb-2">
            {usedCount} Questions added so far, {totalCount - usedCount}{" "}
            Questions can be added.
          </p> */}
          {/* <p className="ratingQuestion_Para mb-2">
              {usedCount} Questions added so far
              {(totalCount - usedCount) >= 0 && (
                <>,&nbsp;{totalCount - usedCount} Questions can be added.</>
              )}
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
        <MultiResponseDA
          setActiveForm={setActiveForm}
          outcome={outcome}
          surveyID={surveyID}
          companyID={companyID}
          responseType={responseType}
          grouppedData={grouppedData}
          userData={userData}
          updateQuestionListByOutComeID={updateQuestionListByOutComeID}
          handleEditClose={handleEditClose}
          questionOptions={questionOptions}
          surveyType={surveyType}
          initialQuestionData={initialQuestionData}
          toggleCheck={DaIGToggele}
          formData={formData}
          setFormData={setFormData}
          edit={edit}
        />
      ) : (
        <MultiResponseIG
          setActiveForm={setActiveForm}
          outcome={outcome}
          surveyID={surveyID}
          companyID={companyID}
          responseType={responseType}
          grouppedData={grouppedData}
          handleEditClose={handleEditClose}
          userData={userData}
          updateQuestionListByOutComeID={updateQuestionListByOutComeID}
          questionOptions={questionOptions}
          surveyType={surveyType}
          initialQuestionData={initialQuestionData}
          formData={formData}
          setFormData={setFormData}
        />
      )} */}
      <MultiResponseDaIg
        setActiveForm={setActiveForm}
        outcome={outcome}
        surveyID={surveyID}
        companyID={companyID}
        responseType={responseType}
        grouppedData={grouppedData}
        userData={userData}
        updateQuestionListByOutComeID={updateQuestionListByOutComeID}
        handleEditClose={handleEditClose}
        questionOptions={questionOptions}
        surveyType={surveyType}
        initialQuestionData={initialQuestionData}
        toggleCheck={DaIGToggele}
        // formData={formData}
        // setFormData={setFormData}
        edit={edit}
        questionType={DaIGToggele}
      />

    </div>
  );
}
