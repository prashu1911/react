import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FallBackLoader } from "components";
import { commonService } from "services/common.service";
import participantRouteMap from "routes/Participant/participantRouteMap";
import { Participant } from "apiEndpoints/Participant";
import useAuth from "../../../customHooks/useAuth/index";

const useQueryParams = () => {
  const { search } = useLocation();
  return new URLSearchParams(search);
};

function ParticipantLogin() {
  const navigate = useNavigate();
  const { dispatcLoginUserData } = useAuth();

  const hasFetchedData = useRef(false);

  const query = useQueryParams();

  useEffect(() => {
    const companyID = query.get("companyID");
    const surveyID = query.get("surveyID");
    const departmentID = query.get("departmentID");
    const userID = query.get("userID");
    const userLoginID = query.get("userLoginID");
    const password = query.get("password");

    if (
      companyID &&
      surveyID &&
      departmentID &&
      userID &&
      userLoginID &&
      password
    ) {
      let payload = {
        companyID: Number(companyID),
        departmentID: Number(departmentID),
        surveyID: Number(surveyID),
        participantID: Number(userID),
        loginID: userLoginID,
        password,
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
      apiEndPoint: Participant.validParticipantLogin,
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

      if (response?.data?.survey?.redirectPage === "Dashboard") {
        navigate(participantRouteMap.PROGRESSDASHBOARD.path);
      } else {
        navigate(participantRouteMap.STARTSURVEY.path);
      }
    }
  };

  return <FallBackLoader />;
}

export default ParticipantLogin;
