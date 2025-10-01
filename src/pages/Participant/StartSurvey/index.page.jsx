import React from "react";
import parse from "html-react-parser";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "customHooks";
import participantRouteMap from "../../../routes/Participant/participantRouteMap";
import { commonService } from "services/common.service";
import { Participant } from "apiEndpoints/Participant";

function StartSurvey() {
  const navigate = useNavigate();
  const { getloginUserData, dispatcLoginUserData } = useAuth();
  const userData = getloginUserData();

  // const handleStartSurevy = (surevyData) => {
  //   let updateDataObject = {
  //     ...userData,
  //     ...surevyData,
  //   };

  //   dispatcLoginUserData(updateDataObject);

  //   setTimeout(() => {
  //     navigate(participantRouteMap.TAKESURVEY.path);
  //   }, [150]);
  // };
  // I am adding this logic because we do not receive the proper redirection data from the backend. It should work this way; hence, I have to add this extra logic to maintain the flow.
  const handleRedirection = () => {
    if (userData?.isAnonymous) {
      navigate(participantRouteMap.TAKESURVEY.path);
    } else if (userData?.survey?.surveyID && userData?.isParticipantThroughMail) {
      // participant through mail
      // handleStartSurevy({
      //   companyID: userData?.companyID,
      //   surveyID: userData?.survey?.surveyID,
      //   departmentID: userData?.departmentID,
      // });
      navigate(participantRouteMap.TAKESURVEY.path);
    } else if (userData?.surveyID) {
      // Normal participant
      navigate(participantRouteMap.TAKESURVEY.path);
    } else {
      navigate(participantRouteMap.PROGRESSDASHBOARD.path);
    }
  };

  const fetchOutcome = async () => {
    try {
      const response = await commonService({
        apiEndPoint: Participant.startSurvey,
        queryParams: {
          companyID: userData?.companyID,
          surveyID: userData?.surveyID,
          departmentID: userData?.departmentID,
          userID: userData?.userID,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        isToast: true,
      });

      if (response?.status) {
        handleRedirection();
      }
    } catch (error) {
      console.error("Error fetching outcomes:", error);
    }
  };

  const enhanceHtml = (html) => {
    return html.replace(/&nbsp;/g, "<br/>"); // optional: replace non-breaking space with normal space
    // .replace(/([.?!])\s+/g, "$1<br/>"); // add <br> after sentences
  };

  return (
    <section className="bannerSec position-relative h-100">
      <div className="container-fluid h-100">
        <div className="bannerSec_inner d-flex flex-column justify-content-center align-items-center align-items-lg-start">
          <span className="bannerSec_inner_meta">Welcome to</span>
          <h1>
            <span>{userData?.assessmentName || ""}</span>
          </h1>
          <div className="w-100">
            {userData?.assessmentIntroduction ? parse(enhanceHtml(userData?.assessmentIntroduction)) : ``}{" "}
          </div>
          <p>Please click the start button to continue the survey</p>

          <Link
            onClick={(e) => {
              // e.preventDefault();
              fetchOutcome();
            }}
            className="ripple-effect btn btn-primary"
          >
            Start Survey <em className="btn-icon right icon-arrow-next" />{" "}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default StartSurvey;
