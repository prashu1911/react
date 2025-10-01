import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { commonService } from "services/common.service";
import { Card } from "react-bootstrap";
import { useAuth } from "customHooks";

function AnonymousSurvey() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [errorText, setErrorText] = useState(null);
  const { dispatcLoginUserData } = useAuth();
  const didFetch = useRef(false);

  const getUrl = (Ivalue) => {
    let urlValue = null;

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
    if (companyID && surveyID && departmentID) {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.redirectingUserToSurvey,
        method: "POST",
        bodyData: {
          companyID: Number(companyID),
          surveyID: Number(surveyID),
          departmentID: Number(departmentID),
        },
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response.data.status === "error") {
        if (response.data.isSchedule === false) {
          let userData = {
            errorMessage: response.data.message,
          };
          dispatcLoginUserData(userData);
          setTimeout(() => {
            navigate("/survey-not-available");
          }, 1500);
        }
        if (typeof response.data.message === "string" && response.data.isSchedule) {
          const str = response.data.message;
          const [firstPart, ...rest] = str.split(",");
          const secondPart = rest.join(",");
          setErrorText([firstPart, secondPart]);
          setIsLoading(false);
        }
      }
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
            assessmentName: response?.data?.survey?.surveyName || "",
            assessmentIntroduction: response?.data?.survey?.introduction || "",
            surveyID,
          };
          dispatcLoginUserData(userData);
          navigate(urlVal);
        }
        navigate(urlVal);
        setIsLoading(false);
      }
    } else {
      setErrorText("Invalid Text");
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
          <>
            {errorText ? (
              <div>
                <h4 className="text-primary">{errorText[0]}</h4>
                <h5 className="text-primary">{errorText[1]}</h5>
              </div>
            ) : null}
          </>
        )}
      </Card>
    </div>
  );
}

export default AnonymousSurvey;
