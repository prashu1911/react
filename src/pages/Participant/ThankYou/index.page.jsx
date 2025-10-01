import { Participant } from "apiEndpoints/Participant";
import { useAuth } from "customHooks";
import React, { useEffect, useState } from "react";
import { commonService } from "services/common.service";

function ThankYou() {
  const [thankYou, setThankYou] = useState({});
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const fetchThankyou = async () => {
    const response = await commonService({
      apiEndPoint: Participant.thankYouMail,
      queryParams: {
        surveyID: userData?.surveyID || 30917,
        companyID: userData?.companyID
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      // window.alert(JSON.stringify(response))
      setThankYou(response.data?.data);
    }
  };

  useEffect(() => {
    fetchThankyou();

    const handlePopState = (e) => {
      e.preventDefault();
      window.alert("You have already submitted the survey. You cannot go back.");
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <div className="thankyouPage d-flex flex-column justify-content-center align-items-center">
      {thankYou?.content2?<div dangerouslySetInnerHTML={{ __html: thankYou?.content2 }} />:<h2 className="thankyouPage_title" style={{textAlign:'center'}}>Thank you</h2>}
      
      <div dangerouslySetInnerHTML={{ __html: thankYou?.content1 }} />
      <div dangerouslySetInnerHTML={{ __html: thankYou?.content3 }} />
    </div>
  );
}

export default ThankYou;
