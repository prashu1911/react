import React, { useState, useEffect } from "react";
import { Nav, Tab, Form, Row, Col } from "react-bootstrap";
import { commonService } from "services/common.service";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { COMMANAPI } from "apiEndpoints/OrgStructure/OrgStructure.dashboard";
import { Distribution } from "apiEndpoints/Distribution";
import { useAuth, useSurveyDataOnNavigations } from "customHooks";
import { decodeHtmlEntities } from "utils/common.util";
import { showSuccessToast } from "helpers/toastHelper";
import { useLocation } from "react-router-dom";
import AllResponses from "./AllResponses";
import Completed from "./Completed";
import NotCompleted from "./NotCompleted";
import { debounce } from "lodash";
import {
  Breadcrumb,
  SelectField,
  SweetAlert,
  Button,
  SelectWithActions,
} from "../../../../components";
import toast from "react-hot-toast";
import SelectMultiField from "../AssignSend/subcomponents/SelectMultiField";

export default function ParticipantProgress() {
  const location = useLocation();
  const navigationData = location.state;

  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const { getSurveyDataOnNavigate, dispatcSurveyDataOnNavigateData } =
    useSurveyDataOnNavigations();
  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Distribution",
    },

    {
      path: "#",
      name: "Participant Progress",
    },
  ];

  const [companyOptions, setCompanyOptions] = useState([]);
  const [surveyOptions, setSurveyOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState();
  const [selectedSurveyId, setSelectedSurveyId] = useState();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  // Add state for current tab type
  const [currentType, setCurrentType] = useState("ALL");
  const multipleLineSelect = true;
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentUserIDs, setCurrentUserIDs] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);

  // Centralized Sorting logic
  const columnIdMap = {
    departmentName: 0,
    fullName: 1,
    userName: 2,
    email: 3,
  };

  const [sortState, setSortState] = useState({
    ALL: { column: 0, direction: "asc" },
    COMPLETED: { column: 0, direction: "asc" },
    INCOMPLETED: { column: 0, direction: "asc" },
  });

  const resetDataValue = () => {
    setAllUsers([]);
    setTotalRecords(0);
    setCurrentUserIDs([]);
    setFilterApplied(false);
  };

  const handleSort = (type, columnKey) => {
    const columnIndex = columnIdMap[columnKey] || 0;
    const currentSort = sortState[type];

    const newDirection =
      currentSort.column === columnIndex && currentSort.direction === "asc"
        ? "desc"
        : "asc";

    setSortState((prev) => ({
      ...prev,
      [type]: { column: columnIndex, direction: newDirection },
    }));

    fetchScheduleLog(type, currentPage * perPage - perPage, perPage, [
      {
        column: columnIndex,
        dir: newDirection,
      },
    ]);
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
    }
  };

  const fetchDepartment = async (companyID, isAnonymous = false) => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.departmentList,
      queryParams: { companyID, isAnonymous },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setDepartmentOptions(
        response?.data?.data?.map((department) => ({
          value: department?.departmentID,
          label: department?.departmentName,
        }))
      );
    }
  };

  useEffect(() => {
    if (userData?.companyMasterID) {
      fetchOptionDetails(
        `company?companyMasterID=${userData?.companyMasterID}`,
        "company"
      );
    }
  }, [userData]);

  const retainedVal = getSurveyDataOnNavigate();

  const returnFun = () => {
    dispatcSurveyDataOnNavigateData(null);
  };

  useEffect(() => {
    if (retainedVal) {
      if (retainedVal?.survey && retainedVal.companyID) {
        setSelectedCompanyId(retainedVal.companyID);
        setSelectedSurveyId(retainedVal?.survey?.survey_id);
        fetchSurvey(retainedVal.companyID);
        fetchDepartment(retainedVal.companyID);
      }
    }

    return returnFun;
  }, []);

  const handleCompanyChange = (selectedData) => {
    if (!selectedData) {
      setSelectedCompanyId("");
      setSelectedSurveyId("");
      handleClearAll();
      setSurveyOptions([]);
      setDepartmentOptions([]);
      return;
    }

    setSelectedCompanyId(selectedData.value);
    setSelectedSurveyId("");
    handleClearAll();
    setSurveyOptions([]);
    setDepartmentOptions([]);
    fetchSurvey(selectedData.value);
    fetchDepartment(selectedData.value);
    resetDataValue()
  };

  const handleSurveyChange = (selectedData) => {
    setSelectedSurveyId(selectedData?.value || "");
    // Clear selected departments when survey changes
    setSelectedDepartmentId([]); // Assuming it's an array for multi-select
    setSelectedOptions([]);
    resetDataValue()
  };

  const handleClearAll = () => {
    setSelectedDepartmentId("");
    setSelectedOptions([]);
    resetDataValue()
  };

  const handleSelectAllDepartments = () => {
    if (departmentOptions.length > 0) {
      setSelectedOptions(departmentOptions);
      const deptIds = departmentOptions.map((item) => parseInt(item.value, 10));
      setSelectedDepartmentId(deptIds);
      resetDataValue()
    }
  };

  const handleMultiSelect = (data) => {
    setSelectedDepartmentId(
      data?.map((item) => parseInt(item.value, 10)) || []
    );
    setSelectedOptions(data || []);
    // resetDataValue()
  };

  // Debounce API call on search
  const debouncedFetchScheduleLog = debounce((searchTerm) => {
    fetchScheduleLog(
      currentType,
      0,
      perPage,
      [
        {
          column: sortState[currentType].column,
          dir: sortState[currentType].direction,
        },
      ],
      searchTerm
    );
  }, 500);

  // Trigger API call on searching
  useEffect(() => {
    if (selectedCompanyId && selectedSurveyId) {
      // fetchScheduleLog(currentType, 0, perPage);
      debouncedFetchScheduleLog(searchValue);
      setCurrentPage(1);
    }
  }, [searchValue]);

  const fetchRemainder = async (type = "ALL", userIDs = [], isBulk = true) => {
    setIsLoading(true);
    try {
      const response = await commonService({
        apiEndPoint: Distribution.participantRemainder,
        bodyData: {
          companyID: selectedCompanyId,
          surveyID: selectedSurveyId,
          departmentID: Array.isArray(selectedDepartmentId)
            ? selectedDepartmentId
            : [],
          isBulk,
          userID: isBulk ? null : userIDs[0], // Send null for bulk reminders, single userID for individual
          type,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      // if (response?.status) {
      //   showSuccessToast("remainder response ");
      // }
    } catch (error) {
      console.error("Error fetching schedule data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchScheduleLog = async (
    type = currentType,
    start = 0,
    length = perPage,
    order = [{ column: 0, dir: "asc" }],
    searchTerm = searchValue
  ) => {
    setIsLoading(true);
    try {
      // Convert string department IDs to integers if they exist
      const departmentIDs = selectedDepartmentId
        ? Array.isArray(selectedDepartmentId)
          ? selectedDepartmentId.map((id) => parseInt(id, 10))
          : [parseInt(selectedDepartmentId, 10)]
        : [];

      const response = await commonService({
        apiEndPoint: Distribution.fetchAllParticipant,
        bodyData: {
          companyID: selectedCompanyId,
          surveyID: selectedSurveyId,
          departmentID: departmentIDs,
          draw: 1,
          start,
          length,
          search: { value: searchTerm, regex: false },
          order,
          type,
        },
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        const users = response?.data?.data?.data || [];

        setAllUsers(users);
        setTotalRecords(
          searchValue
            ? response?.data?.data?.recordsFiltered || 0
            : response?.data?.data?.recordsTotal || 0
        );

        // Extract userIDs from the response
        const userIDs = users.map((user) => user.userID);
        setCurrentUserIDs(userIDs);
        setFilterApplied(true);
      }
    } catch (error) {
      console.error("Error fetching schedule data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPartipant = async (type = currentType) => {
    try {
      const response = await commonService({
        apiEndPoint: Distribution.participantDownload,
        bodyData: {
          companyID: selectedCompanyId,
          surveyID: selectedSurveyId,
          departmentID:
            selectedDepartmentId.length > 0 ? selectedDepartmentId : [],
          type,
        },
        responseType: "blob", // Important: Set responseType to blob
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
          Accept:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // for xlsx files
        },
      });

      if (response?.status) {
        // Create blob from response data
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        if (type === "ALL") {
          link.download = `Progress Report-All.xlsx`;
        } else if (type === "COMPLETED") {
          link.download = `Progress Report-Completed.xlsx`;
        } else {
          link.download = `Progress Report-Not Completed.xlsx`;
        }

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      // Add error handling here (e.g., show error toast)
    }
  };

  const handleSearch = async () => {
    if (!selectedCompanyId || !selectedSurveyId) {
      // Show error toast or alert that company and survey are required
      return;
    }
    setSearchTriggered(true);
    await fetchScheduleLog();
  };

  const handleIndividualReminder = (userId) => {
    setIsAlertVisible(true);
    // Store the user ID temporarily
    setCurrentUserIDs([userId]);
  };

  const onConfirmAlertModal = async () => {
    try {
      setIsLoading(true);
      // Check if it's a bulk or individual reminder
      const isBulk = currentUserIDs.length > 1;
      await fetchRemainder("INCOMPLETED", currentUserIDs, isBulk);
      setIsAlertVisible(false);
      return true;
    } catch (error) {
      console.error("Error sending reminder:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const bulkReminder = () => {
    if (!selectedCompanyId || !selectedSurveyId) {
      // Add error toast or alert that company and survey selection is required
      return;
    }
    setIsAlertVisible(true);
  };

  // Update the tab change handler
  const handleTabChange = (tabKey) => {
    if (selectedCompanyId && selectedSurveyId) {
      let type = "ALL";
      switch (tabKey) {
        case "completed":
          type = "COMPLETED";
          break;
        case "notCompleted":
          type = "INCOMPLETED";
          break;
        default:
          type = "ALL";
      }
      setCurrentPage(1);
      setCurrentType(type);
      fetchScheduleLog(type);
    } else {
      toast.error("Please select company and survey", { toastId: "errkk" });
    }
  };

  const handlePageChange = (page) => {
    const start = (page - 1) * perPage;
    setCurrentPage(page);
    const { column, direction } = sortState[currentType];
    // fetchScheduleLog(currentType, start, perPage);
    fetchScheduleLog(currentType, start, perPage, [
      {
        column,
        dir: direction,
      },
    ]);
    setIsLoading(true);
  };

  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
    fetchScheduleLog(currentType, 0, newPerPage);
  };

  // Add useEffect to handle initial data from navigation
  useEffect(() => {
    const handleInitialData = async () => {
      if (navigationData?.companyID && navigationData?.survey?.survey_id) {
        // Set company ID
        setSelectedCompanyId(navigationData.companyID);

        // Fetch and set surveys
        await fetchSurvey(navigationData.companyID);
        setSelectedSurveyId(navigationData.survey.survey_id);

        // Fetch departments and select all
        await fetchDepartment(navigationData.companyID);
        // This will be called after departments are loaded
        handleSelectAllDepartments();

        // Trigger search after all selections are made
        await fetchScheduleLog();
      }
    };

    handleInitialData();
  }, [navigationData]);

  return (
    <>
      {/* head title start */}
      <section className="commonHead">
        <h1 className="commonHead_title">Welcome Back!</h1>
        <Breadcrumb breadcrumb={breadcrumb} />
      </section>
      {/* head title end */}
      <div className="pageContent resourcePage">
        <div className="pageTitle">
          <h2 className="mb-0">Progress Report</h2>
        </div>
        <Form>
          <Row className="gx-2 flex-grow-1">
            <Col md={3} sm={6}>
              <Form.Group className="form-group">
                <Form.Label>Company</Form.Label>
                <SelectField
                  name="companyID"
                  options={companyOptions}
                  placeholder="All Company"
                  onChange={(selectedData) => handleCompanyChange(selectedData)}
                  value={
                    companyOptions.find(
                      (option) => option.value == selectedCompanyId
                    ) || null
                  }
                />
              </Form.Group>
            </Col>
            <Col md={3} sm={6}>
              <Form.Group className="form-group">
                <Form.Label>Survey</Form.Label>
                <SelectField
                  placeholder="All Surveys"
                  name="surveyID"
                  options={surveyOptions}
                  onChange={(selectedData) => handleSurveyChange(selectedData)}
                  value={
                    surveyOptions.find(
                      (option) => option.value == selectedSurveyId
                    ) || null
                  }
                  isDisabled={surveyOptions.length === 0}
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={6}>
            <Form.Group className="form-group">
              {/* <SelectWithActions
                label="Department"
                options={departmentOptions}
                placeholder="All Department"
                onChange={(selectedData) => handleMultiSelect(selectedData)}
                value={selectedOptions}
                handleSelectAll={handleSelectAllDepartments}
                handleClearAll={handleClearAll}
                isDisabled={departmentOptions.length === 0}
                multipleLineSelect={multipleLineSelect}
                isMulti
              /> */}
              <Form.Label>Department</Form.Label>
              <SelectMultiField
                options={departmentOptions}
                placeholder="All Departments"
                onChange={(selectedData) => handleMultiSelect(selectedData)}
                value={selectedOptions}
                isDisabled={departmentOptions.length === 0}
              />
              </Form.Group>
            </Col>
            <Col md={2} sm={6}>
              <Form.Group className="form-group">
                <Form.Label>&nbsp;</Form.Label>{" "}
                {/* This creates space for alignment */}
                <Button
                  variant="primary"
                  className="ripple-effect w-100" // Added w-100 for consistency
                  onClick={handleSearch}
                  disabled={
                    isLoading || !selectedCompanyId || !selectedSurveyId
                  }
                >
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </Form.Group>
            </Col>
          </Row>
        </Form>
        {filterApplied && (
          <Tab.Container
            id="left-tabs-example"
            defaultActiveKey="allResponses"
            onSelect={handleTabChange}
          >
            <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap filter">
              <Nav variant="pills" className="commonTab">
                <Nav.Item>
                  <Nav.Link
                    eventKey="allResponses"
                    disabled={!selectedCompanyId || !selectedSurveyId}
                  >
                    All Responses
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="completed"
                    disabled={!selectedCompanyId || !selectedSurveyId}
                  >
                    Completed
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="notCompleted"
                    disabled={!selectedCompanyId || !selectedSurveyId}
                  >
                    Not Completed
                  </Nav.Link>
                </Nav.Item>
              </Nav>
              <Button
                variant="primary"
                className="ripple-effect"
                onClick={bulkReminder}
                disabled={!searchTriggered}
              >
                Bulk Reminder
              </Button>
            </div>
            <Tab.Content>
              <Tab.Pane eventKey="allResponses">
                <AllResponses
                  data={allUsers}
                  downloadPartipant={downloadPartipant}
                  totalRecords={totalRecords}
                  handlePageChange={handlePageChange}
                  handlePerPageChange={handlePerPageChange}
                  currentPage={currentPage}
                  perPage={perPage}
                  onIndividualReminder={handleIndividualReminder}
                  selectedCompanyId={selectedCompanyId}
                  selectedSurveyId={selectedSurveyId}
                  isLoading={isLoading}
                  handleSort={(colKey) => handleSort("ALL", colKey)}
                  sortState={sortState.ALL}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="completed">
                <Completed
                  // data={CompletedData} // Only for testing
                  data={allUsers}
                  downloadPartipant={downloadPartipant}
                  totalRecords={totalRecords}
                  handlePageChange={handlePageChange}
                  handlePerPageChange={handlePerPageChange}
                  currentPage={currentPage}
                  perPage={perPage}
                  selectedCompanyId={selectedCompanyId}
                  selectedSurveyId={selectedSurveyId}
                  isLoading={isLoading}
                  handleSort={(colKey) => handleSort("COMPLETED", colKey)}
                  sortState={sortState.COMPLETED}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  // handlefetchScheduleLog
                />
              </Tab.Pane>
              <Tab.Pane eventKey="notCompleted">
                <NotCompleted
                  data={allUsers}
                  downloadPartipant={downloadPartipant}
                  totalRecords={totalRecords}
                  handlePageChange={handlePageChange}
                  handlePerPageChange={handlePerPageChange}
                  currentPage={currentPage}
                  perPage={perPage}
                  onIndividualReminder={handleIndividualReminder}
                  selectedCompanyId={selectedCompanyId}
                  selectedSurveyId={selectedSurveyId}
                  isLoading={isLoading}
                  handleSort={(colKey) => handleSort("INCOMPLETED", colKey)}
                  sortState={sortState.INCOMPLETED}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  // handlefetchScheduleLog
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        )}
      </div>
      <SweetAlert
        title="Are you sure?"
        text="This will send reminder to this Participant who is yet to complete the assessment. Do you want to proceed?"
        show={isAlertVisible}
        icon="warning"
        iconColor="#FF9F9F"
        showCloseButton={!false}
        closeButtonHtml='<em class="icon-close-circle"></em>'
        onConfirmAlert={onConfirmAlertModal}
        showCancelButton={false}
        confirmButtonText={isLoading ? "Sending..." : "Yes"}
        confirmButtonColor="#0968AC"
        setIsAlertVisible={setIsAlertVisible}
        isConfirmedTitle="Sent!"
        isConfirmedText="Reminder sent successfully."
        disabled={isLoading}
      />
    </>
  );
}
