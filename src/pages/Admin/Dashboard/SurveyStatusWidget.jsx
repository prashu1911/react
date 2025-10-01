import React, { useEffect, useState } from "react";
import { Button, Col,  Form } from "react-bootstrap";
import { commonService } from "services/common.service";
import { useAuth } from "customHooks";
import SurveyStstus from "./Chart/SurveyStstus";
import { ADMIN_MANAGEMENT } from "apiEndpoints/AdminManagement/adminManagement";

const SurveyStatusWidget = React.memo(({  ChartType, widgetData}) => {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const [SurveyStatus, setSurveyStatus] = useState()

  useEffect(() => {
    fetchSurveyStatus();
  }, [ChartType]);

  const fetchSurveyStatus = async () => {    
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.updateDashboardSurveyStatus,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        bodyData:{
          "roleID": userData?.roleID,
          "companyMasterID": userData?.companyMasterID,
          "companyID": userData?.companyID,
          dashboardID: widgetData?.dashboard_id,
          widgetID: widgetData?.widget_id,
          "chartType": ChartType
      }
      });
      if (response?.status) {
        setSurveyStatus(response.data.data?.chartData);
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  return (
    <Col xxl={4} sm={6}>
    <div className="cardBox bg-white h-100">
      <div className="d-flex align-item-center justify-content-between pageTitle mb-3 pb-1 flex-wrap">
        <h2 className="mb-0">Surveys Status</h2>
      </div>
      <SurveyStstus ChartType={ChartType} SurveyStatus={SurveyStatus}/>
    </div>
  </Col>
  );
});

export default SurveyStatusWidget;
