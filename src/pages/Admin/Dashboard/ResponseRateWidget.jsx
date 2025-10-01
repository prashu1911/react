import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
import GaugeChart from "react-gauge-chart";
import { Breadcrumb, Button, InputField, SelectField } from "../../../components";
import { commonService } from "services/common.service";
import { useAuth } from "customHooks";
import ResponseRatePieChart from "../IntelligentReports/ReportGenerator/Chart/ResponseRatePieChart";
import ResponseRateProgressChart from "../IntelligentReports/ReportGenerator/Chart/ResponseRateProgressChart";
import { ADMIN_MANAGEMENT } from "apiEndpoints/AdminManagement/adminManagement";
import DashboardPeiChart from "../IntelligentReports/ReportGenerator/Chart/DashboardPeiChart";
import MultiSelectDropdown from "./MultiSelectDropdown";

const ResponseRateWidget = React.memo(({ SurveyList, widgetData, ChartType }) => {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const [SelectedSurvey, setSelectedSurvey] = useState([]);
  const [ResponseRateData, setResponseRateData] = useState({});


  const updateResponseRate = async () => {
    if (SelectedSurvey.length <= 0) return;
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.updateDashboardResponseRate,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        bodyData: {
          assessments: SelectedSurvey.map(item => item.value),
          dashboardID: widgetData?.dashboard_id,
          widgetID: widgetData?.widget_id,
          chartType: ChartType
        },
      });
      if (response?.status) {
        setResponseRateData(response.data.data?.chartData);
      }
    } catch (error) {
      console.error("Error fetching Response Rate:", error);
    }
  };

  useEffect(() => {
    const newArray = SurveyList.filter(item => widgetData?.widget_data.assessmentIDs.includes(item.value));

    setSelectedSurvey(newArray)
  }, [widgetData, SurveyList])


  useEffect(() => {
    updateResponseRate();

  }, [SelectedSurvey, ChartType]);

  return (
    <Col xxl={4} sm={6}>
      <div className="cardBox bg-white h-100">
        <div className="d-flex align-item-center justify-content-between pageTitle mb-3 flex-wrap">
          <h2 className="mb-0">Response Rate</h2>
        </div>
        <div className="d-flex gap-2 cardBox_btn">
          <Form.Group className="form-group w-100">
            <MultiSelectDropdown
              value={SelectedSurvey}
              onChange={setSelectedSurvey}
              placeholder="Select Surveys"
              options={SurveyList}
            />
            {/* <SelectField
            isMulti
              value={SelectedSurvey}
              onChange={setSelectedSurvey}
              placeholder="Select Surveys"
              options={SurveyList}
            /> */}
          </Form.Group>
        </div>
        <div className="cardBox_graph mt-3 position-relative">

          {ChartType == "speedometer" ?
            <GaugeChart id="gauge-chart5"
              nrOfLevels={60}
              arcPadding={0.01}
              arcWidth={0.2}
              cornerRadius={1}
              percent={Number(ResponseRateData?.response_rate || 0) / 100}
              textColor="#0968AC"
              needleColor="#0968AC"
              colors={['#48B3FF', '#0968AC']}
            /> :
            ChartType == "pie" ?
              <DashboardPeiChart value={parseFloat(ResponseRateData?.response_rate || 1)} height={200} /> :
              <ResponseRatePieChart decimal={2} height={200} value={parseFloat(ResponseRateData?.response_rate || 2)} />

          }
          {/* <div className="chartName">
            Response <br /> Rate
          </div> */}
        </div>
        <div className="staticBox d-flex align-items-center justify-content-between flex-wrap">
          <div className="staticBox_inner">
            <div className="staticBox_icon icon-danger">
              <em className="icon-user-plus" />
            </div>
            <div className="staticBox_caption">
              <span>{ResponseRateData?.invited_users}</span>
              <p>Invited Participants</p>
            </div>
          </div>
          <div className="staticBox_inner">
            <div className="staticBox_icon icon-warning">
              <em className="icon-clipboard-minus" />
            </div>
            <div className="staticBox_caption">
              <span>{ResponseRateData?.incomplete_users}</span>
              <p>Incomplete Participants</p>
            </div>
          </div>
          <div className="staticBox_inner">
            <div className="staticBox_icon icon-primary">
              <em className="icon-user-check" />
            </div>
            <div className="staticBox_caption">
              <span>{ResponseRateData?.completed_users}</span>
              <p>Completed Participants</p>
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
});

export default ResponseRateWidget;
