import React, { useState, useEffect } from "react";
import { Col, Form, Nav, Row, Tab } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from "lodash.debounce";
import { commonService } from "services/common.service";
import { COMMANAPI } from "apiEndpoints/OrgStructure/OrgStructure.dashboard";
import { decodeHtmlEntities } from "utils/common.util";
import {
  Breadcrumb,
  Button,
  InputField,
  ModalComponent,
  SelectField,
  SelectWithActions,
} from "../../../../components";
import All from "./All";
import Design from "./Design";
import Active from "./Active";
import Pause from "./Pause";
import UnAssign from "./UnAssign";
import Closed from "./Closed";
import adminRouteMap from "../../../../routes/Admin/adminRouteMap";
import useAuth from "../../../../customHooks/useAuth/index";
import SurveyFromExistingModel from "./CreateSurvey/ModelComponent/SurveyFromExisting/SurveyFromExistingModel";
import { ScheduleAddModal } from "../../Distribution/ScheduleLog/ModelComponent";
import {
  initValuesAdd,
  validationAdd,
} from "../../Distribution/ScheduleLog/validation";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCompany,
  selectCompanyData,
  selectMaintainCompanySelection,
} from "../../../../redux/ManageSurveySlice/index.slice";

export default function ManageSurveys() {
  const { getloginUserData } = useAuth();
  const selectedCompanyID = useSelector(selectCompanyData);
  const maintainCompanySelection = useSelector(selectMaintainCompanySelection);
  const userData = getloginUserData();
  const dispatch = useDispatch();
  const location = useLocation();

  // Survey Modal start
  const [showSurvey, setshowSurvey] = useState(false);
  const surveyClose = () => setshowSurvey(false);
  const surveyShow = () => setshowSurvey(true);
  const [showSchedulexit, setShowSchedulexit] = useState(false);
  // Survey Modal end

  // Schedule Modal start
  const [showSchedule, setShowSchedule] = useState(false);

  const scheduleClosebtn = () => {
    setShowSchedule(false);
  };
  const scheduleShow = () => {
    if (!company) {
      console.log("Please select a company first");
      return;
    }
    setShowSchedule(true);
  };
  const [selectedTab, setSelectedTab] = useState("all");

  // Schedule Exit Modal start
  const schedulexitClose = () => setShowSchedulexit(false);
  // Schedule Exit Modal end

  const [searchValue, setSearchValue] = useState("");
  const [tableFilters] = useState({});

  // Debounced change handler for managing search optimization.
  const handleSearchChange = debounce((e) => {
    setSearchValue(e.target.value);
  }, 500);

  // Survey Modal radio start
  const [selectedAction, setSelectedAction] = useState("assigned");
  const handleInputChange = (ev) => {
    setSelectedAction(ev.target.value);
  };

  // Survey Modal radio end

  // Create Existing Modal start
  const [showcreateExisting, setshowcreateExisting] = useState(false);
  const createExistingShow = () => setshowcreateExisting(true);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [company, setCompany] = useState(null);
  const [isEditable, setIsEditable] = useState(true);
  const [selectedActiveSurveyId, setSelectedActiveSurveyId] = useState(null);

  //   API Calling
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
        setIsEditable(response?.data?.isEditable);
        let dataArray = Object?.values(response?.data?.data);
        setCompanyOptions(
          dataArray?.map((company) => ({
            value: company?.companyID,
            label: decodeHtmlEntities(company?.companyName),
          }))
        );
      }
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    if (userData?.companyMasterID) {
      fetchOptionDetails(`company`, "company");
    }
  }, []);

  // Modified company selection effect
  useEffect(() => {
    if (companyOptions.length && selectedCompanyID) {
      setCompany(selectedCompanyID);
    }
  }, [companyOptions, selectedCompanyID]);

  const handleSelectChange = (e) => {
    const selectedValue = e?.value;
    setCompany(selectedValue);
    dispatch(selectCompany(selectedValue));
  };

  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Surveys",
    },
    {
      path: "#",
      name: "Manage Surveys",
    },
  ];

  // days options
  const daysOptions = [
    { value: "Day", label: "Day" },
    { value: "Week", label: "Week" },
  ];
  // Reminder
  const reminder = [
    { value: "once", label: "Once" },
    { value: "interval", label: "Interval" },
  ];
  // department options
  const departmentOptions = [
    { value: "Department", label: "Department" },
    { value: "Department 1", label: "Department 1" },
    { value: "Department 2", label: "Department 2" },
    { value: "Department 3", label: "Department 3" },
    { value: "Department 4", label: "Department 4" },
    { value: "Department 5", label: "Department 5" },
    { value: "Department 6", label: "Department 6" },
  ];

  return (
    <>
      <div className="surveysPage manageSurvey">
        {/* head title start */}
        <section className="commonHead">
          <h1 className="commonHead_title">Welcome Back!</h1>
          <Breadcrumb breadcrumb={breadcrumb} />
        </section>
        {/* head title end */}
        <div className="pageContent">
          <div className="pageTitle d-flex align-items-center justify-content-between">
            <h2>Manage Surveys</h2>
            <div className="d-flex flex-wrap">
              <Link
                to={adminRouteMap.CREATESURVEY.path}
                className="btn btn-primary ripple-effect me-2 mb-sm-0 mb-2"
              >
                Create New Survey
              </Link>
              <Button
                type="button"
                variant="dark"
                className="ripple-effect-dark ms-lg-1 ms-0 mb-sm-0 mb-2"
                onClick={createExistingShow}
              >
                Clone from Existing
              </Button>
            </div>
          </div>
          <Form>
            <Form.Group className="form-group companySelect">
              <Form.Label>Company</Form.Label>
              <SelectField
                name="companyID"
                placeholder="Select Company Name"
                options={companyOptions}
                onChange={handleSelectChange}
                value={companyOptions?.find(
                  (option) => option?.value === Number(company)
                )}
                isDisabled={!isEditable}
              />
            </Form.Group>
          </Form>
          <Tab.Container
            id="left-tabs-example"
            defaultActiveKey={selectedTab}
            onSelect={(key) => {
              setSelectedTab(key);
            }}
          >
            <div className="filter d-flex justify-content-between align-items-center">
              <Nav variant="pills" className="commonTab">
                <Nav.Item>
                  <Nav.Link eventKey="all">All</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="design">Design</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="unassign">Unassign</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="active">Active</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="pause">Pause</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="closed">Closed</Nav.Link>
                </Nav.Item>
              </Nav>
              <ul className="list-inline filter_action mb-0 d-flex align-items-center">
                <li className="list-inline-item">
                  <Link
                    to={adminRouteMap.SCHEDULELOG.path}
                    state={company ? { companyID: company } : null}
                    className="btn btn-warning ripple-effect-dark"
                  >
                    Schedule Log
                  </Link>
                </li>
                <li className="list-inline-item">
                  <div className="searchBar">
                    <InputField
                      type="text"
                      placeholder="Search"
                      onChange={handleSearchChange}
                    />
                  </div>
                </li>
              </ul>
            </div>
            {selectedTab && (
              <Tab.Content>
                <Tab.Pane eventKey="all">
                  <All
                    surveyShow={surveyShow}
                    scheduleShow={scheduleShow}
                    searchData={searchValue}
                    tableFilters={tableFilters}
                    userData={userData}
                    company={company}
                    selectedTab={selectedTab}
                    companyName={
                      companyOptions.find((opt) => opt.value === company)
                        ?.label || ""
                    }
                    setSelectedActiveSurveyId={setSelectedActiveSurveyId}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="design">
                  <Design
                    surveyShow={surveyShow}
                    scheduleShow={scheduleShow}
                    searchData={searchValue}
                    tableFilters={tableFilters}
                    userData={userData}
                    company={company}
                    selectedTab={selectedTab}
                    companyName={
                      companyOptions.find((opt) => opt.value === company)
                        ?.label || ""
                    }
                    setSelectedActiveSurveyId={setSelectedActiveSurveyId}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="unassign">
                  <UnAssign
                    surveyShow={surveyShow}
                    scheduleShow={scheduleShow}
                    searchData={searchValue}
                    tableFilters={tableFilters}
                    userData={userData}
                    company={company}
                    selectedTab={selectedTab}
                    companyName={
                      companyOptions.find((opt) => opt.value === company)
                        ?.label || ""
                    }
                    setSelectedActiveSurveyId={setSelectedActiveSurveyId}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="active">
                  <Active
                    surveyShow={surveyShow}
                    scheduleShow={scheduleShow}
                    searchData={searchValue}
                    tableFilters={tableFilters}
                    userData={userData}
                    company={company}
                    selectedTab={selectedTab}
                    companyName={
                      companyOptions.find((opt) => opt.value === company)
                        ?.label || ""
                    }
                    setSelectedActiveSurveyId={setSelectedActiveSurveyId}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="pause">
                  <Pause
                    surveyShow={surveyShow}
                    scheduleShow={scheduleShow}
                    searchData={searchValue}
                    tableFilters={tableFilters}
                    userData={userData}
                    company={company}
                    selectedTab={selectedTab}
                    companyName={
                      companyOptions.find((opt) => opt.value === company)
                        ?.label || ""
                    }
                    setSelectedActiveSurveyId={setSelectedActiveSurveyId}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="closed">
                  <Closed
                    surveyShow={surveyShow}
                    scheduleShow={scheduleShow}
                    searchData={searchValue}
                    tableFilters={tableFilters}
                    userData={userData}
                    company={company}
                    selectedTab={selectedTab}
                    companyName={
                      companyOptions.find((opt) => opt.value === company)
                        ?.label || ""
                    }
                    setSelectedActiveSurveyId={setSelectedActiveSurveyId}
                  />
                </Tab.Pane>
              </Tab.Content>
            )}
          </Tab.Container>
        </div>
      </div>

      {/* assign survey modal */}
      <ModalComponent
        modalHeader="Assign Surveys"
        size="lg"
        show={showSurvey}
        onHandleCancel={surveyClose}
      >
        <Form>
          {["radio"].map((type) => (
            <Form.Group className="form-group" key={`form-group-${type}`}>
              <Form.Label>Company</Form.Label>
              <div className="onlyradio flex-wrap">
                <Form.Check
                  controlid="assigned"
                  inline
                  label="Assigned"
                  name="company"
                  checked={selectedAction === "assigned"}
                  type={type}
                  value="assigned"
                  id={`company-${type}-1`}
                  onChange={handleInputChange}
                />
                <Form.Check
                  controlid="anonymous"
                  inline
                  label="Anonymous"
                  name="company"
                  checked={selectedAction === "anonymous"}
                  type={type}
                  value="anonymous"
                  id={`company-${type}-2`}
                  onChange={handleInputChange}
                />
              </div>
            </Form.Group>
          ))}
          <div
            id="assigned"
            className="show-hide"
            style={{
              display: selectedAction === "assigned" ? "block" : "none",
            }}
          >
            <Row className="rowGap">
              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label>Company</Form.Label>
                  <SelectField placeholder="Company" options={companyOptions} />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label>Surveys</Form.Label>
                  <SelectField placeholder="Surveys" options={companyOptions} />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="form-group mt-3">
              <SelectWithActions
                label="Department"
                placeholder="All Department"
                options={departmentOptions}
                isMulti
              />
            </Form.Group>

            <div className="form-btn d-flex gap-2 justify-content-end">
              <Button
                type="button"
                variant="secondary"
                className="ripple-effect"
              >
                Cancel
              </Button>
              <Button className="btn btn-primary ripple-effect">Apply</Button>
            </div>
          </div>
          <div
            id="anonymous"
            className="show-hide"
            style={{
              display: selectedAction === "anonymous" ? "block" : "none",
            }}
          >
            <Row className="rowGap">
              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label>Company</Form.Label>
                  <SelectField placeholder="Company" options={companyOptions} />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label>Surveys</Form.Label>
                  <SelectField placeholder="Surveys" options={companyOptions} />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label>Department</Form.Label>
                  <SelectField
                    placeholder="Department"
                    options={companyOptions}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="form-btn d-flex gap-2 justify-content-end">
              <Button
                type="button"
                variant="secondary"
                className="ripple-effect"
              >
                Cancel
              </Button>
              <Button type="button" variant="primary" className="ripple-effect">
                Add
              </Button>
            </div>
          </div>
        </Form>
      </ModalComponent>
      {/* create schedule modal */}
      {showSchedule && (
        <ScheduleAddModal
          modalHeader="Create Schedule"
          show={showSchedule}
          size="lg"
          onHandleCancel={scheduleClosebtn}
          companyOptions={companyOptions}
          reminderOptions={reminder}
          daysOptions={daysOptions}
          userData={userData}
          initialData={initValuesAdd()}
          validationSchedule={validationAdd()}
          selectedCompany={company} // Pass the selected company
          selectedActiveSurveyId={selectedActiveSurveyId}
          type="Survey_Managment"
        />
      )}
      {/* schedule and exit modal */}
      <ModalComponent
        modalHeader="Create Schedule"
        extraBodyClassName="scheduleExit"
        size="lg"
        show={showSchedulexit}
        onHandleCancel={schedulexitClose}
      >
        <Form action="">
          <Row className=" rowGap">
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>Company</Form.Label>
                <SelectField placeholder="Company" options={companyOptions} />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>Surveys</Form.Label>
                <SelectField placeholder="Surveys" options={companyOptions} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="form-group mt-3">
            <SelectWithActions
              label="Department"
              placeholder="All Department"
              options={departmentOptions}
              isMulti
            />
          </Form.Group>
          <div className="assessmentBox my-xl-4 my-3">
            <p className="mb-0">
              Assessment Start Date:{" "}
              <span className="fw-medium">08/02/2024</span>
            </p>
            <p className="mb-0">
              Assessment End Date: <span className="fw-medium">08/09/2024</span>
            </p>
            <p className="mb-0">
              Pre-Start Email: <span className="fw-medium">No</span>
            </p>
            <p className="mb-0">
              Reminder: <span className="fw-medium">Yes</span>
            </p>
            <p className="mb-0">
              Reminder(S):{" "}
              <span className="fw-medium">Interval @ 2 Day(S)</span>
            </p>
          </div>
          <div className="d-flex gap-2 justify-content-end">
            <Button type="button" variant="primary" className="ripple-effect">
              Exit
            </Button>
          </div>
        </Form>
      </ModalComponent>

      {/* Surveys Management: Create From Existing modal  */}
      {showcreateExisting && (
        <SurveyFromExistingModel
          showcreateExisting={showcreateExisting}
          setshowcreateExisting={setshowcreateExisting}
        />
      )}
    </>
  );
}
