import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { commonService } from "services/common.service";
import { Card } from "react-bootstrap";
import { useAuth } from "customHooks";

function ParticipantSurvey() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [errorText, setErrorText] = useState(null);
  const { dispatcLoginUserData } = useAuth();
  const didFetch = useRef(false);

  const getUrl = (Ivalue) => {
    let urlValue = null;
    // if (Ivalue === "Introduction") {
    //   urlValue = "/participant/home";
    // } else if (Ivalue === "Dashboard") {
    //   urlValue = "/participant/survey-dashboard";
    // }

    switch (Ivalue) {
      case "Introduction":
        urlValue = "/participant/home";

        break;
      case "Dashboard":
        urlValue = "/participant/survey-dashboard";
        break;
      default:
        break;
    }
    return urlValue;
  };
  const redirectUserFetch = async () => {
    const companyID = searchParams.get("companyID");
    const surveyID = searchParams.get("surveyID");
    const departmentID = searchParams.get("departmentID");
    const participantID = searchParams.get("userID");
    const loginID = searchParams.get("userLoginID");
    const password = searchParams.get("password");
    if (companyID && surveyID && departmentID && participantID && loginID && password) {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.redirectingUserToSurvey,
        method: "POST",
        bodyData: {
          companyID: Number(companyID),
          surveyID: Number(surveyID),
          departmentID: Number(departmentID),
          participantID: Number(participantID),
          loginID,
          password,
        },
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      //   if (response.data.status === "error") {
      //     if (typeof response.data.message === "string") {
      //       const str = response.data.message;
      //       const [firstPart, ...rest] = str.split(",");
      //       const secondPart = rest.join(",");
      //       setErrorText([firstPart, secondPart]);
      //     }
      //   }

      if (response.data.status === "success") {
        const urlVal = getUrl(response.data.survey.redirectPage);

        if (urlVal) {
          let userData = {
            aliasName: response?.data?.aliasName,
            companyID: response?.data?.companyID,
            companyMasterID: response?.data?.companyMasterID,
            companyMasterName: response?.data?.companyMasterName,
            companyName: response?.data?.companyName,
            departmentID: response?.data?.departmentID,
            eMailID: response?.data?.eMailID,
            firstName: response?.data?.firstName,
            isAnonymous: response?.data?.isAnonymous,
            isRandomUser: response?.data?.isRandomUser,
            isReportPermission: response?.data?.isReportPermission,
            isSampleUser: response?.data?.isSampleUser,
            isSubscriberAdmin: response?.data?.isSubscriberAdmin,
            lastName: response?.data?.lastName,
            menu: response?.data?.menu,
            menuPreference: response?.data?.menuPreference,
            apiToken: response?.data?.webToken,
            roleID: response?.data?.roleID,
            roleName: response?.data?.roleName,
            userID: response?.data?.userID,
            survey: response?.data?.survey,
            isParticipantThroughMail: true,
            assessmentName: response?.data?.survey?.surveyName || "",
            assessmentIntroduction: response?.data?.survey?.introduction || "",
            surveyID,
          };
          dispatcLoginUserData(userData);
          navigate(urlVal);
        }
      }

      setIsLoading(false);
    } else {
      setErrorText("Invalid Link");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    redirectUserFetch();
  }, [isLoading]);

  return (
    <div className="vw-100 vh-100 d-flex align-items-center justify-content-center">
      <Card style={{ width: "800px" }} className="d-flex align-items-center justify-content-center p-3">
        {isLoading ? (
          <div>
            <h3>Loading....</h3>
          </div>
        ) : (
          <div>
            <h4 className="text-primary">{errorText}</h4>
          </div>
        )}
      </Card>
    </div>
  );
}

export default ParticipantSurvey;
