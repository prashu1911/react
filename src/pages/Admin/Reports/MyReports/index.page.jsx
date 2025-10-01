import React, { useEffect, useState } from "react";
import {
  Nav,
  Tab,
  Form,
  OverlayTrigger,
  Tooltip,
  Row,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "customHooks";
import { commonService } from "services/common.service";
import { COMMANAPI } from "apiEndpoints/OrgStructure/OrgStructure.dashboard";
import { decodeHtmlEntities } from "utils/common.util";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { REPORTS_MANAGEMENT } from "apiEndpoints/ReportsManagement";
import { showSuccessToast } from "helpers/toastHelper";
import Summary from "./Summary";
import DetailedAnalysis from "./DetailedAnalysis";
import SingleChart from "./SingleChart";
import Benchmark from "./Benchmark";
import IgStatistics from "./IgStatistics";
import DynamicFilter from "./DynamicFilter";
import {
  Breadcrumb,
  Button,
  InputField,
  ModalComponent,
  SelectField,
  TextEditor,
} from "../../../../components";

export default function MyReports() {
  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Reports",
    },
    {
      path: "#!",
      name: "My Reports",
    },
  ];
  // edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const editModalClose = () => setShowEditModal(false);
  const editModalShow = () => setShowEditModal(true);

  const [activeKey, setActiveKey] = useState("summary");

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  // copy comment modal
  const [showCopyComment, setshowCopyComment] = useState(false);
  const copyCommentClose = () => setshowCopyComment(false);
  const copyCommentShow = () => {
    setshowCopyComment(true);
    setShowEditModal(false);
  };

  const [companyOptions, setCompanyOptions] = useState([]);
  const [surveyOptions, setSurveyOptions] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState("");

  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [tableRowData, setTableRowData] = useState([]);
  const [isTableLoader, setIsTableLoader] = useState(false);
  const [currentTableData, setCurrentTableData] = useState({});
  const [isUpdateTableData, setIsUpDateTableData] = useState(false);

  useEffect(() => {
    if (selectedSurveyId) {
      sessionStorage.setItem("companyId", selectedSurveyId.toString());
      localStorage.setItem("companyId", selectedSurveyId.toString());

    }
  
  
  
    // if (activeKey) {
    //   sessionStorage.setItem("activeTabKey", activeKey);
    // }
    console.log(selectedCompanyId,activeKey,selectedSurveyId)
  }, [selectedSurveyId, selectedCompanyId, activeKey]);
  

  
  useEffect(() => {
    const storedSurveyId = sessionStorage.getItem("companyId");
    const storedCompanyId = sessionStorage.getItem("masterId");
    const storedActiveKey = sessionStorage.getItem("activeTabKey");
    console.log(storedActiveKey,storedCompanyId,storedSurveyId)
  
    if (storedSurveyId) setSelectedSurveyId(storedSurveyId);
    if (storedCompanyId) {
      setSelectedCompanyId(Number(storedCompanyId));
      fetchSurvey(storedCompanyId); // Fetch surveys for the company on reload
    }
    if (storedActiveKey) setActiveKey(storedActiveKey);
  }, []);
  
  

  const [editReportObj, setEditReportObj] = useState({
    reportID: "",
    reportName: "",
    openingComment: "",
    closingComment: "",
  });

  const eventKeyObj = {
    summary: "SMC",
    detailedAnalysis: "DC",
    singleChart: "SC",
    drillDown: "DD",
    igStatistics: "IG",
    dynamicFilter: "TA",
  };

  const fetchOptionDetails = async (path, type) => {
    const response = await commonService({
      apiEndPoint: COMMANAPI.getComman(path),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      if (type === "company") {
        setCompanyOptions(
          Object?.values(response?.data?.data)?.map((company) => ({
            value: company?.companyID,
            label: decodeHtmlEntities(company?.companyName),
          }))
        );
      }
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      // Fetch company options first
      if (userData?.companyMasterID) {
        await fetchOptionDetails(
          `company?companyMasterID=${userData?.companyMasterID}`,
          "company"
        );
      }
    };

    initializeData();
  }, [userData]);

  const fetchSurvey = async (companyID) => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.surveyList,
      queryParams: { companyID },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setSurveyOptions(
        response?.data?.data?.map((item) => ({
          value: item?.surveyID,
          label: item?.surveyName,
        }))
      );
      const storedCompanyId = sessionStorage.getItem("masterId");
      // setSelectedCompanyId(storedCompanyId);

    }
  };

  useEffect(()=>{
    const storedCompanyId = sessionStorage.getItem("masterId");
    setSelectedCompanyId(Number(storedCompanyId))
  },[])

  function formatDateTime(date) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return new Date(date).toLocaleString("en-US", options).replace(",", "");
  }

  const handleCompanyChange = (selectedData) => {
    setSelectedCompanyId(selectedData?.value);
    setSelectedSurveyId("");

    fetchSurvey(selectedData?.value);
      sessionStorage.setItem("masterId", selectedData?.value);
    
  };

  const handleTabSelect = async (selectedKey) => {
    setActiveKey(selectedKey);
    sessionStorage.setItem("activeTabKey", selectedKey);

  };

  const fetchReportData = async () => {
    setIsTableLoader(true);
    const response = await commonService({
      apiEndPoint: REPORTS_MANAGEMENT.fetchMyReportData,
      queryParams: {
        // 327 ||
        surveyID: selectedSurveyId,
        reportType: eventKeyObj[activeKey],
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setIsTableLoader(false);
      const resArr = response?.data?.data?.data || [];
      setTableRowData(
        resArr.map((val, i) => {
          return {
            id: `${i + 1}`.toString().padStart(2, "0"),
            name: val.report_name,
            date: val.created ? formatDateTime(val.created) : "NO Date",
            status: val.status,
            filters: val.filters,
            reportId: val.report_id,
          };
        })
      );
    } else {
      setIsTableLoader(false);
    }
  };

  const editMyReport = async () => {
    const response = await commonService({
      apiEndPoint: REPORTS_MANAGEMENT.editMyReport,
      bodyData: editReportObj,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });

    if (response?.status) {
      setIsUpDateTableData((p) => !p);
      editModalClose();
      showSuccessToast(response?.data?.message);
    } else {
      editModalClose();
    }
  };

  const publishMyReport = async () => {
    const response = await commonService({
      apiEndPoint: REPORTS_MANAGEMENT.publishMyReport,
      bodyData: {
        reportID: currentTableData.reportId,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });

    if (response?.status) {
      setIsUpDateTableData((p) => !p);
    }
  };

  const deleteMyReport = async () => {
    const response = await commonService({
      apiEndPoint: REPORTS_MANAGEMENT.deleteMyReport,
      queryParams: {
        reportID: currentTableData.reportId,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });

    if (response?.status) {
      setIsUpDateTableData((p) => !p);
    }
  };

  useEffect(() => {
    if (selectedSurveyId) fetchReportData();
  }, [activeKey, selectedSurveyId, isUpdateTableData]);

  useEffect(() => {
    if (currentTableData && Object.keys(currentTableData).length > 0) {
      setEditReportObj({
        ...editReportObj,
        reportID: currentTableData.reportId,
        reportName: currentTableData.name,
        openingComment: currentTableData.openingComment || "",
        closingComment: currentTableData.closingComment || "",
      });
    }
  }, [currentTableData]);
  
  const handleReportEdit = (e) => {
    e.preventDefault();
    editMyReport();
  };

  return (
    <>
      <div className="surveyAnalysis">
        {/* head title start */}
        <section className="commonHead">
          <h1 className="commonHead_title">Welcome Back!</h1>
          <Breadcrumb breadcrumb={breadcrumb} />
        </section>
        {/* head title end */}
        <div className="pageContent">
          <div className="pageTitle">
            <h2 className="mb-0">My Reports</h2>
          </div>
          <Tab.Container
            id="left-tabs-example"
            defaultActiveKey="summary"
            activeKey={activeKey}
            onSelect={handleTabSelect}
          >
            <Nav variant="pills" className="commonTab">
              <Nav.Item>
                <Nav.Link eventKey="summary">Summary</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="detailedAnalysis">
                  Detailed Analysis
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="singleChart">Single Chart</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="drillDown">DrillDown</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="igStatistics">IG Statistics</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="dynamicFilter">Dynamic Filter</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content className="mt-3">
              <Tab.Pane eventKey="summary">
                <Summary
                  editModalShow={editModalShow}
                  companyOptions={companyOptions}
                  handleCompanyChange={handleCompanyChange}
                  selectedCompanyId={selectedCompanyId}
                  surveyOptions={surveyOptions}
                  selectedSurveyId={selectedSurveyId}
                  setSelectedSurveyId={setSelectedSurveyId}
                  tableRowData={tableRowData}
                  isTableLoader={isTableLoader}
                  editMyReport={editMyReport}
                  setCurrentTableData={setCurrentTableData}
                  publishMyReport={publishMyReport}
                  deleteMyReport={deleteMyReport}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="detailedAnalysis">
                <DetailedAnalysis
                  editModalShow={editModalShow}
                  companyOptions={companyOptions}
                  handleCompanyChange={handleCompanyChange}
                  selectedCompanyId={selectedCompanyId}
                  surveyOptions={surveyOptions}
                  selectedSurveyId={selectedSurveyId}
                  setSelectedSurveyId={setSelectedSurveyId}
                  tableRowData={tableRowData}
                  isTableLoader={isTableLoader}
                  editMyReport={editMyReport}
                  setCurrentTableData={setCurrentTableData}
                  publishMyReport={publishMyReport}
                  deleteMyReport={deleteMyReport}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="singleChart">
                <SingleChart
                  editModalShow={editModalShow}
                  companyOptions={companyOptions}
                  handleCompanyChange={handleCompanyChange}
                  selectedCompanyId={selectedCompanyId}
                  surveyOptions={surveyOptions}
                  selectedSurveyId={selectedSurveyId}
                  setSelectedSurveyId={setSelectedSurveyId}
                  tableRowData={tableRowData}
                  isTableLoader={isTableLoader}
                  editMyReport={editMyReport}
                  setCurrentTableData={setCurrentTableData}
                  publishMyReport={publishMyReport}
                  deleteMyReport={deleteMyReport}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="drillDown">
                <Benchmark
                  editModalShow={editModalShow}
                  companyOptions={companyOptions}
                  handleCompanyChange={handleCompanyChange}
                  selectedCompanyId={selectedCompanyId}
                  surveyOptions={surveyOptions}
                  selectedSurveyId={selectedSurveyId}
                  setSelectedSurveyId={setSelectedSurveyId}
                  tableRowData={tableRowData}
                  isTableLoader={isTableLoader}
                  editMyReport={editMyReport}
                  setCurrentTableData={setCurrentTableData}
                  publishMyReport={publishMyReport}
                  deleteMyReport={deleteMyReport}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="igStatistics">
                <IgStatistics
                  editModalShow={editModalShow}
                  companyOptions={companyOptions}
                  handleCompanyChange={handleCompanyChange}
                  selectedCompanyId={selectedCompanyId}
                  surveyOptions={surveyOptions}
                  selectedSurveyId={selectedSurveyId}
                  setSelectedSurveyId={setSelectedSurveyId}
                  tableRowData={tableRowData}
                  isTableLoader={isTableLoader}
                  editMyReport={editMyReport}
                  setCurrentTableData={setCurrentTableData}
                  publishMyReport={publishMyReport}
                  deleteMyReport={deleteMyReport}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="dynamicFilter">
                <DynamicFilter
                  editModalShow={editModalShow}
                  companyOptions={companyOptions}
                  handleCompanyChange={handleCompanyChange}
                  selectedCompanyId={selectedCompanyId}
                  surveyOptions={surveyOptions}
                  selectedSurveyId={selectedSurveyId}
                  setSelectedSurveyId={setSelectedSurveyId}
                  tableRowData={tableRowData}
                  isTableLoader={isTableLoader}
                  editMyReport={editMyReport}
                  setCurrentTableData={setCurrentTableData}
                  publishMyReport={publishMyReport}
                  deleteMyReport={deleteMyReport}
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>

      {/* edit modal */}
      <ModalComponent
        modalHeader="Detailed Report"
        show={showEditModal}
        onHandleCancel={editModalClose}
      >
        <Form>
          <Form.Group className="form-group">
            <Form.Label>Report Name</Form.Label>
            <InputField
              type="text"
              placeholder="Report Name"
              onChange={(e) =>
                setEditReportObj({
                  ...editReportObj,
                  reportName: e.target.value,
                })
              }
              value={editReportObj.reportName}
              name="reportName"
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Link
              href="#!"
              className="copyBtn d-flex align-items-center mb-2"
              onClick={copyCommentShow}
            >
              <OverlayTrigger
                overlay={
                  <Tooltip>
                    Copy Comment from any of the existing reports.
                  </Tooltip>
                }
              >
                <em className="icon-info-circle me-1" />
              </OverlayTrigger>
              Copy Comments
            </Link>
          </div>
          {/* {JSON.stringify(editReportObj)} */}
          <Form.Group className="form-group">
            <Form.Label>Opening Comment</Form.Label>
            <TextEditor
              value={editReportObj.openingComment}

              onChange={(e) =>
                setEditReportObj({
                  ...editReportObj,
                  openingComment: e,
                })
              }
            />
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>Closing Comment</Form.Label>
            <TextEditor
              value={editReportObj.closingComment}

              onChange={(e) =>
                setEditReportObj({
                  ...editReportObj,
                  closingComment: e,
                })
              }
            />
          </Form.Group>
          <div className="form-btn d-flex gap-2 justify-content-end">
            <Button
              variant="secondary"
              className="ripple-effect"
              onClick={editModalClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="ripple-effect"
              type="submit"
              onClick={handleReportEdit}
            >
              Update Report
            </Button>
          </div>
        </Form>
      </ModalComponent>

      {/* copy comments modal  */}
      <ModalComponent
        modalHeader="Copy Comments"
        show={showCopyComment}
        onHandleCancel={copyCommentClose}
      >
        <Form>
          <Row className="row rowGap">
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Assessment Name<sup>*</sup>
                </Form.Label>
                <SelectField
                  defaultValue={companyOptions[1]}
                  placeholder="Assessment Name"
                  options={companyOptions}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Report Name<sup>*</sup>
                </Form.Label>
                <SelectField
                  defaultValue={companyOptions[1]}
                  placeholder="Report Name"
                  options={companyOptions}
                />
              </Form.Group>
            </Col>
            <Col sm={12}>
              <Form.Group className="form-group">
                <Form.Label>Opening Comment</Form.Label>
                <TextEditor />
              </Form.Group>
            </Col>
            <Col sm={12}>
              <Form.Group className="form-group">
                <Form.Label>Closing Comment</Form.Label>
                <TextEditor />
              </Form.Group>
            </Col>
          </Row>

          <div className="form-btn d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              className="ripple-effect"
              onClick={copyCommentClose}
            >
              Cancel
            </Button>
            <Button variant="primary" className="ripple-effect">
              Copy to Report
            </Button>
          </div>
        </Form>
      </ModalComponent>
    </>
  );
}
