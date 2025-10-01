import React, { useEffect, useState } from "react";
import { Col, ProgressBar, Row, Form, Tab, Nav, Offcanvas, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Breadcrumb, Button, InputField, SelectField } from "../../../components";
import { commonService } from "services/common.service";
import { useAuth } from "customHooks";
import ResponseRateWidget from "./ResponseRateWidget";
import SurveyStatusWidget from "./SurveyStatusWidget";
import SurveyProgressWidget from "./SurveyProgressWidget";
import SurveyScoreWidget from "./SurveyScoreWidget";
import ResponseStatisticsWidget from "./ResponseStatisticsWidget";
import CompanyDetailsWidget from "./CompanyDetailsWidget";
import SurveysOverview from "./SurveysOverview";
import { ADMIN_MANAGEMENT } from "apiEndpoints/AdminManagement/adminManagement";
import donutImg from "../../../assets/admin/images/donut.svg"
import speedometerImg from "../../../assets/admin/images/speedometer.svg"
import pieImg from "../../../assets/admin/images/pie.svg"
import polarImg from "../../../assets/admin/images/Polar-Area-Chart.png"

ChartJS.register(ArcElement, Tooltip, Legend);



function AdminDashboard() {

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Dashboard",
    },

    {
      path: "#",
      name: "Surveys Progress Dashboard",
    },
  ]


  // offcanvas 
  const [show, setShow] = useState(false);
  const [WidgetList, setWidgetList] = useState([])

  const [SurveyList, setSurveyList] = useState([])
  const [ResponseRateChartType, setResponseRateChartType] = useState("")
  const [SurveyStatusChartType, setSurveyStatusChartType] = useState("")
  const [SurveyProgressChartType, setSurveyProgressChartType] = useState("")

  useEffect(() => {
    fetchSurveys()
  }, [])
  
  const fetchWidgetList = async () => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getDashboardWidgets,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      console.log("response for dashboard widgets",response);
      if (response?.status) {
        setWidgetList(response?.data?.data)
      }
    } catch (error) {
      console.error("Error fetching widget list:", error);
    }
  }

  useEffect(() => {
    fetchWidgetList()
  },[])
  
  useEffect(() => {
    if (WidgetList?.length>0) {
      setResponseRateChartType(WidgetList.find(item => item.widget_name === "Response Rate")?.widget_data?.chartType)      
      setSurveyStatusChartType(WidgetList.find(item => item.widget_name === "Survey Status")?.widget_data?.chartType)      
      setSurveyProgressChartType(WidgetList.find(item => item.widget_name === "Survey Progress")?.widget_data?.chartType)      
    }

  }, [WidgetList])


  const fetchSurveys = async () => {
    
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getSurveyList(userData?.companyID,userData?.roleID,userData?.companyMasterID),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setSurveyList(response.data.data.map(company => ({
          value: company.assessment_id,
          label: company.assessment_name  // Fix typo: comapnyName → companyName
        })));
      }
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };





  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);








  const SubscriptionWidget = () => (
    <Col xxl={4} sm={6}>
      <div className="cardBox bg-white h-100">
        <div className="d-flex align-item-center justify-content-between pageTitle mb-3 pb-1 flex-wrap">
          <h2 className="mb-0">Subscription</h2>
          <Link href="#!" className="moreBtn">View More <em className="icon-prev" /></Link>
        </div>
        <div className="subscription">
          <div className="subscription_details">
            <span>Current Plan</span>
            <p>Your Current Plan is Basic</p>
          </div>
          <Row className="subscription_details">
            <Col sm={6}>
              <span>End Date</span>
              <p>09 Dec, 2024</p>
            </Col>
            <Col sm={6}>
              <span>Renewal Date</span>
              <p>09 Dec, 2024</p>
            </Col>
          </Row>
          <div className="subscription_details">
            <span>Upcoming Payments</span>
            <p>$199 Per Month</p>
          </div>
          <div className="subscription_progress pt-2">
            <div className="label d-flex justify-content-between gap-2 ">
              <span>Days</span>
              <span>12 of 30 Days</span>
            </div>
            <ProgressBar variant="primary" now={30} />
            <p>18 days remaining until your plan requires update</p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <Button variant="primary" className="ripple-effect">Upgrade Plan</Button>
            <Button variant="danger" className="ripple-effect">Cancel Subscription</Button>
          </div>
        </div>
      </div>
    </Col>
  );
  const widgetComponents = {
    "Response Rate": (widget) => <ResponseRateWidget ChartType={ResponseRateChartType} SurveyList={SurveyList} widgetData={widget} />,
    "Survey Status": (widget) => <SurveyStatusWidget ChartType={SurveyStatusChartType} widgetData={widget} />,
    "Survey Progress": (widget) => <SurveyProgressWidget ChartType={SurveyProgressChartType} SurveyList={SurveyList} widgetData={widget} />,
    "Survey Score": (widget) => <SurveyScoreWidget SurveyList={SurveyList} widgetData={widget} />,
    "Response Statistics": (widget) => <ResponseStatisticsWidget widgetData={widget} />,
    "Company Details": (widget) => <CompanyDetailsWidget widgetData={widget} />,
    "Surveys Overview": (widget) => <SurveysOverview widgetData={widget} />,
  };


  const getWidgetComponent = (widget) => {
    return widgetComponents[widget.widget_name]
      ? widgetComponents[widget.widget_name](widget)
      : (
        <Col xxl={4} sm={6}>
          <div className="cardBox bg-white h-100">
            <h2 className="mb-0">{widget.widget_name}</h2>
            <p>No UI defined for this widget</p>
          </div>
        </Col>
      );
  };
  



  return (
    <>
      {/* head title start */}
      <section className="commonHead">
        <h1 className='commonHead_title'>Welcome Back!</h1>
        <Breadcrumb breadcrumb={breadcrumb} />
      </section>
      {/* head title end */}
      <div className="dashboard">
        <section className="activitySec">
          <Row className="g-3">
            {WidgetList.map(widget => getWidgetComponent(widget))}
          </Row>
        </section>
        <div className="dashboard_offcanvas" style={{zIndex: "9999"}}>
          <Button variant="primary" onClick={handleShow}>
            <em className="icon-settings-outline" />
          </Button>
          <Offcanvas className="dashboardCanvas" show={show} onHide={handleClose} placement="end" style={{zIndex: "9999999"}}>
            <Offcanvas.Body>
              <div className="dashboardCanvas_cnt">
                <h3 className="chartTitle">Response Rate</h3>
                <Row className="g-2">
                  <Col onClick={()=>setResponseRateChartType("speedometer")} lg={4}>
                    <div className="chartCards text-center">
                      <div className={`chartCards_inner ${ResponseRateChartType=="speedometer"?'active':''}`}>
                        <img src={speedometerImg} alt="Speedometer" style={{
                          height: "60px", width: "60px"
                        }}/>
                      </div>

                      <span className="chartName mt-2">Speedometer</span>
                    </div>
                  </Col>
                  <Col onClick={()=>setResponseRateChartType("pie")} lg={4}>
                    <div className="chartCards text-center">
                      <div className={`chartCards_inner ${ResponseRateChartType=="pie"?'active':''}`}>
                        <img src={pieImg} alt="Pie" style={{
                          height: "60px", width: "60px"
                        }}/>
                      </div>
                      <span className="chartName mt-2">Pie</span>
                    </div>
                  </Col>
                  <Col onClick={()=>setResponseRateChartType("donut")} lg={4}>
                    <div className="chartCards text-center">
                      <div className={`chartCards_inner ${ResponseRateChartType=="donut"?'active':''}`}>
                        <img src={donutImg} alt="Donut" style={{
                          height: "60px", width: "60px"
                        }}/>
                      </div>
                      <span className="chartName mt-2">Donut</span>
                    </div>
                  </Col>
                </Row>
                <h3 className="chartTitle">Surveys Status</h3>
                <Row className="g-2">
                  <Col onClick={()=>setSurveyStatusChartType("donut")} lg={4}>
                    <div className="chartCards text-center">
                      <div className={`chartCards_inner ${SurveyProgressChartType=="donut"?'active':''}`}>
                        <img src={donutImg} alt="Donut" style={{
                          height: "60px", width: "60px"
                        }}/>
                      </div>

                      <span className="chartName mt-2">Donut</span>
                    </div>
                  </Col>
                  <Col onClick={()=>setSurveyStatusChartType("polarArea")} lg={4}>
                    <div className="chartCards text-center">
                      <div className={`chartCards_inner ${SurveyStatusChartType=="polarArea"?'active':''}`}>
                        <img src={polarImg} alt="Pie" style={{
                          height: "90px", width: "90px"
                        }}/>
                      </div>
                      <span className="chartName mt-2">Polar Area</span>
                    </div>
                  </Col>
                </Row>
                <h3 className="chartTitle">Surveys Progress</h3>
                <Row className="g-2">
                  <Col onClick={()=>setSurveyProgressChartType('speedometer')} lg={4}>
                    <div className="chartCards text-center">
                      <div className={`chartCards_inner ${SurveyProgressChartType=="speedometer"?'active':''}`}>
                        <img src={speedometerImg} alt="Speedometer" style={{
                          height: "60px", width: "60px"
                        }}/>
                      </div>
                      <span className="chartName mt-2">Speedometer</span>
                    </div>
                  </Col>
                  <Col onClick={()=>setSurveyProgressChartType('pie')} lg={4}>
                    <div className="chartCards text-center">
                      <div className={`chartCards_inner ${SurveyProgressChartType=="pie"?'active':''}`}>
                        <img src={pieImg} alt="Pie" style={{
                          height: "60px", width: "60px"
                        }}/>
                      </div>
                      <span className="chartName mt-2">Pie</span>
                    </div>
                  </Col>
                  <Col onClick={()=>setSurveyProgressChartType('donut')} lg={4}>
                    <div className="chartCards text-center">
                      <div className={`chartCards_inner ${SurveyProgressChartType=="donut"?'active':''}`}>
                        <img src={donutImg} alt="Donut" style={{
                          height: "60px", width: "60px"
                        }}/>
                      </div>
                      <span className="chartName mt-2">Donut</span>
                    </div>
                  </Col>
                </Row>
                <div className="closeBtn">
                  <Button variant="primary" onClick={handleClose} aria-label="Close"><em className="icon-close-circle" /></Button>
                </div>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
