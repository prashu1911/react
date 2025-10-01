import React, { useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { commonService } from "services/common.service";
import { useAuth } from "customHooks";
import GaugeChart from "react-gauge-chart";
import { SelectField } from "components";
import ResponseRatePieChart from "../IntelligentReports/ReportGenerator/Chart/ResponseRatePieChart";
import ResponseRateProgressChart from "../IntelligentReports/ReportGenerator/Chart/ResponseRateProgressChart";
import { ADMIN_MANAGEMENT } from "apiEndpoints/AdminManagement/adminManagement";
import DashboardPeiChart from "../IntelligentReports/ReportGenerator/Chart/DashboardPeiChart";
import MultiSelectDropdown from "./MultiSelectDropdown";

const SurveyProgressWidget = React.memo(({ SurveyList, widgetData, ChartType }) => {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const [SelectedSurvey, setSelectedSurvey] = useState([]);
  const [SurveyProgressData, setSurveyProgressData] = useState({});


  const updateSurveysProgress = async () => {
    if (SelectedSurvey.length <= 0) return;
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.updateDashboardSurveyProgress,
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
        console.log("response", response);

        setSurveyProgressData(response.data.data?.chartData);
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
    updateSurveysProgress();
  }, [SelectedSurvey, ChartType]);



  return (
    <Col xxl={4} sm={6}>
      <div className="cardBox bg-white h-100">
        <div className="d-flex align-item-center justify-content-between pageTitle mb-3 flex-wrap">
          <h2 className="mb-0">Surveys Progress</h2>
        </div>
        <div className="d-flex gap-2 cardBox_btn">
          <Form.Group className="form-group w-100">
            {/* <SelectField
            isMulti
              value={SelectedSurvey}
              onChange={setSelectedSurvey}
              placeholder="Select Surveys"
              options={SurveyList}
            /> */}
            <MultiSelectDropdown
              value={SelectedSurvey}
              onChange={setSelectedSurvey}
              placeholder="Select Surveys"
              options={SurveyList}
            />
          </Form.Group>
        </div>
        <div className="cardBox_graph mt-3 position-relative">
          {/* <canvas id="gaugeChart"></canvas> */}
          {ChartType == "speedometer" ?
            <GaugeChart id="gauge-chart5"
              nrOfLevels={60}
              arcPadding={0.01}
              arcWidth={0.2}
              cornerRadius={1}
              percent={((SurveyProgressData?.completed_users / SurveyProgressData?.assigned_users) * 100) / 100}
              textColor="#0968AC"
              needleColor="#0968AC"
              colors={['#48B3FF', '#0968AC']}
            /> :
            ChartType == "pie" ?
              <DashboardPeiChart value={parseFloat(((SurveyProgressData?.completed_users / SurveyProgressData?.assigned_users) * 100)?.toFixed(2)) || 0} height={200} /> :
              <ResponseRatePieChart decimal={2} height={200} value={((SurveyProgressData?.completed_users / SurveyProgressData?.assigned_users) * 100)} />

          }
          {/* <div className="chartName">Surveys <br /> Progress</div> */}
        </div>
        <div className="staticBox d-flex align-items-center justify-content-between flex-wrap">
          <div className="staticBox_inner">
            <div className="staticBox_icon icon-danger">
              <em className="icon-clock" />
            </div>
            <div className="staticBox_caption">
              <span>{SurveyProgressData?.avg_completion_time}</span>
              <p>Average Time to Complete</p>
            </div>
          </div>
          <div className="staticBox_inner">
            <div className="staticBox_icon icon-warning">
              <em className="icon-user-plus" />
            </div>
            <div className="staticBox_caption">
              <span>{SurveyProgressData?.assigned_users}</span>
              <p>Assigned Participants</p>
            </div>
          </div>
          <div className="staticBox_inner">
            <div className="staticBox_icon icon-primary">
              <em className="icon-user-check" />
            </div>
            <div className="staticBox_caption">
              <span>{SurveyProgressData?.completed_users}</span>
              <p>Completed Participants</p>
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
});

export default SurveyProgressWidget;
