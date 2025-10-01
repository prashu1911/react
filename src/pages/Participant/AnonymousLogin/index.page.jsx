import React, { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Participant } from "apiEndpoints/Participant";
import { commonService } from "services/common.service";
import { useAuth } from "customHooks";
import { FallBackLoader } from "components";
import participantRouteMap from "../../../routes/Participant/participantRouteMap";

function AnonymousLogin() {
  const [searchParams] = useSearchParams();

  const hasFetchedData = useRef(false);

  const navigate = useNavigate();
  const { dispatcLoginUserData } = useAuth();

  useEffect(() => {
    const companyID = searchParams.get("companyID");
    const surveyID = searchParams.get("surveyID");
    const departmentID = searchParams.get("departmentID");

    if (companyID && surveyID && departmentID) {
      let payload = {
        companyID: Number(companyID),
        departmentID: Number(departmentID),
        surveyID: Number(surveyID),
      };

      if (!hasFetchedData.current) {
        // eslint-disable-next-line no-use-before-define
        handleSubmit(payload);
        hasFetchedData.current = true;
      }
    }
  }, []);

  const handleSubmit = async (values) => {
    const response = await commonService({
      apiEndPoint: Participant.annonymousUserLogin,
      bodyData: values,
      headers: { "Content-Type": "application/json" },
      toastType: {
        success: "Login successful",
        error: "Login failed",
      },
    });
    if (response?.status) {
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
        roleName: response?.data?.roleName,
        userID: response?.data?.userID,
        roleID: response?.data?.roleID,
        surveyID: response?.data?.survey?.surveyID,
      };
      dispatcLoginUserData(userData);
      navigate(participantRouteMap.STARTSURVEY.path);
    }
  };

  return <FallBackLoader />;
}

export default AnonymousLogin;
