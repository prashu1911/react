import { useEffect, useState } from "react";
import { useAuth } from "customHooks";
import { QuestionSetup } from "apiEndpoints/QuestionSetup";
import { commonService } from "services/common.service";
import { OpenEndedQuestionDA } from "./OeqSubComponent";

export default function OpenEndedQuestion({
  setActiveForm,
  surveyID,
  companyID,
  outcome,
  updateQuestionListByOutComeID,
  totalCount,
  usedCount,
  handleEditClose,
  initialQuestionData, // Add this prop
  edit
}) {
  // Importing user data from custom authentication hook
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const [surveyType, setSurveyType] = useState([]);

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
 const commaText = usedCount > 0 && ((totalCount - usedCount) > 0) ? ',' : ""
  return (
    <>
      <div className="ratingQuestion openEndedModal">
        <div className="d-flex align-items-start justify-content-between flex-wrap mb-xl-2 mb-3">
          <div className="me-2">
            <h4 className="ratingQuestion_Head">Oeq Question</h4>
            {/* <p className="ratingQuestion_Para mb-2">
              {usedCount} Questions added so far, {totalCount - usedCount}{" "}
              Questions can be added.
            </p> */}
            <p className="ratingQuestion_Para mb-2">
            {usedCount > 0 && (<> {usedCount } Questions added so far</>)}
            {(totalCount - usedCount) > 0 && (
              <>{commaText}&nbsp;{totalCount - usedCount} Questions can be added.</>
            )}
          </p>
          </div>
        </div>
        <OpenEndedQuestionDA
          setActiveForm={setActiveForm}
          surveyID={surveyID}
          companyID={companyID}
          outcome={outcome}
          surveyType={surveyType}
          handleEditClose={handleEditClose}
          userData={userData}
          updateQuestionListByOutComeID={updateQuestionListByOutComeID}
          questionOptions={questionOptions}
          initialQuestionData={initialQuestionData} // Add this prop
          edit={edit}
        />

        {/* {DaIGToggele ? (
          <OpenEndedQuestionDA
            setActiveForm={setActiveForm}
            surveyID={surveyID}
            companyID={companyID}
            outcome={outcome}
            surveyType={surveyType}
            userData={userData}
            updateQuestionListByOutComeID={updateQuestionListByOutComeID}
          />
        ) : (
          <OpenEndedQuestionIG
            setActiveForm={setActiveForm}
            surveyID={surveyID}
            companyID={companyID}
            outcome={outcome}
            surveyType={surveyType}
            userData={userData}
            updateQuestionListByOutComeID={updateQuestionListByOutComeID}
          />
        )} */}
      </div>
    </>
  );
}
