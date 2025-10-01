import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import { commonService } from "services/common.service";
import { COMMANAPI } from "apiEndpoints/OrgStructure/OrgStructure.dashboard";
import { decodeHtmlEntities } from "utils/common.util";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { Distribution } from "apiEndpoints/Distribution";
import adminRouteMap from "routes/Admin/adminRouteMap";
import {
  Button,
  SweetAlert,
  SelectField,
  Breadcrumb,
  ReactDataTable,
  SelectWithActions,
} from "../../../../components";
import { useTable } from "../../../../customHooks/useTable";
import useAuth from "../../../../customHooks/useAuth/index";
import { ScheduleAddModal, ScheduleEditModal } from "./ModelComponent";
import {
  initValuesAdd,
  initValuesEdit,
  validationAdd,
  validationEdit,
} from "./validation";
import SelectMultiField from "../AssignSend/subcomponents/SelectMultiField";

function ScheduleLog() {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [searchValue] = useState("");
  const [tableFilters] = useState({});
  const [surveyOptions, setSurveyOptions] = useState([]);
   const location = useLocation();

  // Reminder
  const reminder = [
    { value: "once", label: "Once" },
    { value: "interval", label: "Interval" },
  ];
  // days options
  const daysOptions = [
    { value: "Day", label: "Day" },
    { value: "Week", label: "Week" },
  ];

  // edit schedule modal
  const [showeditSch, setShoweditSch] = useState(false);
  const editSchClose = () => {
    setShoweditSch(false);
    // eslint-disable-next-line no-use-before-define
    // fetchScheduleLog();
  };
  // add schedule modal
  const [showaddSch, setShowaddSch] = useState(false);
  const addSchClose = () => {
    setShowaddSch(false);
    // eslint-disable-next-line no-use-before-define
    // fetchScheduleLog();
  };
  const addSchShow = () => setShowaddSch(true);
  // eslint-disable-next-line no-unused-vars
  const [isSubmitting, setIsSubmitting] = useState(false);
  // delete sweet alert
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSurveyId, setSelectedSurveyId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [tableLoader, setTableLoader] = useState(false);
  const [EditData, setEditData] = useState({});
  const [deletedSelect, setDeletedSelect] = useState({});
  const multipleLineSelect = true
  const editSchShow = (row) => {
    setEditData(row);
    setShoweditSch(true);
  };

  const deleteModal = (row) => {
    setDeletedSelect(row);
    setIsAlertVisible(true);
  };
  
  const handleMultiSelect = (data) => {
    setSelectedDepartmentId(data.map((item) => item?.value));
    // setSelectedOptions(data);
  };

  const handleSelectAllDepartments = () => {
    // setSelectedOptions(departmentOptions);
    setSelectedDepartmentId(departmentOptions.map((item) => item.value));
  };

  const handleClearAll = () => {
    setSelectedDepartmentId([]);
  };

  // breadcrumb
  const breadcrumb = [
    {
      path: `${adminRouteMap.MANAGESURVEY.path}`,
      name: "Manage Surveys",
    },
    {
      path: "",
      name: "Schedule Log",
    },
  ];

  //   API Calling
  const fetchOptionDetails = async (path, type) => {
    setIsSubmitting(true);
    const response = await commonService({
      apiEndPoint: COMMANAPI.getComman(path),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setIsSubmitting(false);

      if (type === "company") {
        setCompanyOptions(
          Object?.values(response?.data?.data)?.map((company) => ({
            value: company?.companyID,
            label: decodeHtmlEntities(company?.companyName),
          }))
        );
      }
    } else {
      console.error("error");
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
    } else {
      console.error("error");
    }
  };

  const fetchDepartment = async (companyID) => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.departmentList,
      queryParams: { companyID, isAnonymous: true }, // Get anonymous departments
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
    } else {
      console.error("error");
    }
  };

  const fetchScheduleLog = async () => {
    setTableLoader(true);
    const all = 1; 
    const queryParams = {
      companyID: selectedCompanyId,
      surveyID: selectedSurveyId,
      isScheduleLog : all, // Flag to get past schedules in the listing
    };
    //Check if all departments are selected
    const isAllSelected = (
      Array.isArray(selectedDepartmentId) &&
      selectedDepartmentId.length === departmentOptions.length
    );
    // Pass multiple department IDs in API call
    if(Array.isArray(selectedDepartmentId) && selectedDepartmentId.length> 0 && !isAllSelected){
      selectedDepartmentId.forEach((id, index) => {
        queryParams[`departmentID[${index}]`] = id;
      });
    }else{
      queryParams["departmentID[]"] = "0";
    }
    const response = await commonService({
      apiEndPoint: Distribution.fetchAllSchedule,
      queryParams: queryParams,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      // if (
      //   response?.data?.allSchedule &&
      //   response?.data?.allSchedule?.length > 0
      // ) {
      //   // Remove the manual data assignment and use the API response directly
      //   setScheduleData(response.data.allSchedule);
      // }
      const allSchedules = response?.data?.allSchedule || [];
      const filteredSchedules = allSchedules.filter(
        (item) => item?.surveyScheduleID?.trim() !== ""
      );
      setScheduleData(filteredSchedules);
      setTableLoader(false);
    } else {
      console.error("error");
      setTableLoader(false);
    }
  };

  useEffect(() => {
    if (
      selectedCompanyId !== "" &&
      selectedSurveyId !== "" &&
      selectedDepartmentId !== ""
    ) {
      setOffset(1);
      fetchScheduleLog();
    }
  }, [selectedCompanyId, selectedSurveyId, selectedDepartmentId]);

  useEffect(() => {
    if (userData?.companyMasterID) {
      fetchOptionDetails(
        `company?companyMasterID=${userData?.companyMasterID}`,
        "company"
      );
    }
  }, []);

  useEffect(() => {
    if (location?.state) {
      if (location?.state?.companyID) {
        setSelectedCompanyId(location?.state?.companyID);
        fetchSurvey(location?.state?.companyID);
        fetchDepartment(location?.state?.companyID)
      }
    }
  },[])

  //   DataTable
  const {
    currentData,
    totalRecords,
    totalPages,
    offset,
    limit,
    sortState,
    setOffset,
    setLimit,
    handleSort,
  } = useTable({
    searchValue,
    searchKeys: [""],
    tableFilters,
    initialLimit: 10,
    data: scheduleData,
  });

  const handleLimitChange = (value) => {
    setLimit(value);
    setOffset(1);
  };

  const handleOffsetChange = (value) => {
    setOffset(value);
  };

  /**
   * Handle deleting a Schedule Log
   * @param {object} id Contains the Schedule Log ID to be deleted
   * @returns {Promise} A promise that resolves when the API call is complete
   */
  const deleteScheduleLog = async () => {
    try {
      const response = await commonService({
        apiEndPoint: Distribution.deleteSchedule,
        bodyData: { surveyScheduleID: deletedSelect?.surveyScheduleID },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: "Schedule Log deleted successfully",
          error: "Schedule Log delete failed",
        },
      });

      if (response?.status) {
        setIsAlertVisible(false);
        return true;
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      return false;
    }
  };

  /**
   * Handle deleting a ScheduleLog confirm modal
   * @returns {Promise} A promise that resolves when the confirm modal is confirmed
   */
  const onConfirmAlertModal = async () => {
    const response = await deleteScheduleLog();
    // Refresh list if record is deleted
    if(response){
      fetchScheduleLog();
    }
    return response;
  };

  // data table
  const columns = [
    {
      title: "#",
      dataKey: "s.no",
    },
    {
      title: "Surveys Name",
      dataKey: "surveyName",
      sortable: true,
    },
    {
      title: "Department Name",
      dataKey: "departmentName",
      sortable: true,
    },
    {
      title: "Start Date",
      dataKey: "startDate",
      sortable: true,
    },
    {
      title: "End Date",
      dataKey: "endDate",
      sortable: true,
    },
    {
      title: "Pre-Start Email (Days)",
      dataKey: "preStartDays",
    },
    {
      title: "Reminder(s)",
      render: (data,row) => {
        if (row?.isReminder) {
          switch (row.reminderIntervalStartType) {
            case 1:
              return <>Interval - {row.reminderIntervalStart} Day(s)</>;
            case 2:
              return <>Interval - {row.reminderIntervalStart} Week(s)</>;
            case 0:
              return <>Once on {row.reminderToStartDate}</>;
            default:
              return <>Invalid reminder type</>;
          }
        } else {
          return <>-</>;
        }
      },
    },
    {
      title: "Action",
      dataKey: "action",
      data: "action",
      columnHeaderClassName: "w-1 text-center no-sorting",
      columnClassName: "w-1 text-center",
      render: (data, row) => {
        const isScheduled = row?.isScheduled;
        const isSchedulePassed = row?.isSchedulePassed;
        return (
          <>
            {" "}
            {(isScheduled && !isSchedulePassed) && (
              <ul className="list-inline action mb-0">
                <li className="list-inline-item">
                  <Link
                    className="icon-primary"
                    onClick={() => {
                      editSchShow(row);
                    }}
                  >
                    <em className="icon-table-edit" />
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link
                    className="icon-danger"
                    onClick={() => deleteModal(row)}
                  >
                    <em className="icon-delete" />
                  </Link>
                </li>
              </ul>
            )}
          </>
        );
      },
    },
  ];

  const handleCompanyChange = (selected) => {
    setSelectedCompanyId(selected?.value);
    setSelectedSurveyId("");
    setSelectedDepartmentId("");
    fetchSurvey(selected?.value);
    fetchDepartment(selected?.value);
    setScheduleData([]);
  };

  return (
    <>
      {/* head title start */}
      <section className="commonHead">
        <h1 className="commonHead_title">Welcome Back!</h1>
        <Breadcrumb breadcrumb={breadcrumb} />
      </section>
      {/* head title end */}
      <div className="pageContent">
        <div className="pageTitle d-flex align-items-center justify-content-between flex-wrap gap-2">
          <h2 className="mb-0">Schedule Log</h2>
          <Button variant="primary ripple-effect" onClick={addSchShow}>
            Create Schedule
          </Button>
        </div>

        <Row className="mb-2 align-items-end gx-2">
          <Col lg={4} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>Company</Form.Label>
              <SelectField
                name="companyID"
                options={companyOptions}
                placeholder="Select Company"
                onChange={(selected) => {
                  handleCompanyChange(selected);
                }}
                value={companyOptions.find(
                  (option) => option?.value === selectedCompanyId
                )}
              />
            </Form.Group>
          </Col>
          <Col lg={4} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>Survey</Form.Label>
              <SelectField
                placeholder="Select Survey"
                name="surveyID"
                // options={surveyOptions}
                options={[{ label: "All", value: 0 }, ...surveyOptions]}
                onChange={(selected) => {
                  setSelectedSurveyId(selected?.value);
                }}
                value={
                  [{ label: "All", value: 0 }, ...surveyOptions].find(
                    (option) => option?.value === selectedSurveyId
                  ) || null
                }
                isDisabled={surveyOptions?.length === 0}
              />
            </Form.Group>
          </Col>
          <Col lg={4} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>Department</Form.Label>
              {/* <SelectWithActions
                // label="departmentID"
                options={departmentOptions}
                placeholder="All Departments"
                onChange={(selected) =>
                  handleMultiSelect(selected)
                }
                handleSelectAll={handleSelectAllDepartments}
                handleClearAll={handleClearAll}
                value={departmentOptions?.filter((ele) => selectedDepartmentId.includes(ele.value))}
                isDisabled={departmentOptions?.length === 0 || selectedSurveyId == null || selectedSurveyId === "" }
                multipleLineSelect={multipleLineSelect}
                isMulti
              /> */}
              <SelectMultiField
                options={departmentOptions}
                placeholder="All Departments"
                onChange={(selected) =>
                  handleMultiSelect(selected)
                }
                value={departmentOptions?.filter((ele) => selectedDepartmentId.includes(ele.value))}
                isDisabled={departmentOptions?.length === 0 || selectedSurveyId == null || selectedSurveyId === "" }
              />
            </Form.Group>
          </Col>
        </Row>
        <ReactDataTable
          data={currentData}
          columns={columns}
          page={offset}
          totalLength={totalRecords}
          totalPages={totalPages}
          sizePerPage={limit}
          handleLimitChange={handleLimitChange}
          handleOffsetChange={handleOffsetChange}
          searchValue={searchValue}
          handleSort={handleSort}
          sortState={sortState}
          isLoading={tableLoader}
          isPaginate={true}
        />
      </div>

      {/* add schedule modal */}

      {showaddSch && (
        <ScheduleAddModal
          modalHeader="Add Schedule"
          show={showaddSch}
          size="lg"
          onHandleCancel={addSchClose}
          onSubmitSuccess={fetchScheduleLog}
          companyOptions={companyOptions}
          reminderOptions={reminder}
          daysOptions={daysOptions}
          userData={userData}
          initialData={initValuesAdd()}
          validationSchedule={validationAdd()}
          selectedCompany={selectedCompanyId}
          selectedActiveSurveyId={selectedSurveyId}
        />
      )}

      {/* edit schedule modal */}

      {showeditSch && (
        <ScheduleEditModal
          modalHeader="Edit Schedule"
          show={showeditSch}
          size="lg"
          onHandleCancel={editSchClose}
          onSubmitSuccess={fetchScheduleLog}
          reminderOptions={reminder}
          userData={userData}
          initialData={initValuesEdit(EditData)}
          validationSchedule={validationEdit()}
          selectedCompanyId={selectedCompanyId}
        />
      )}

      <SweetAlert
        title="You are about to cancel the schedule"
        html={`
                <p class="mb-1 fs-6 fw-medium">Start Date <span class="fw-normal">:  ${deletedSelect?.startDate}</span></p>
                <p class="mb-1 fs-6 fw-medium">End Date <span class="fw-normal">:  ${deletedSelect?.endDate}</span></p>
                <p class="mb-1 fs-6 fw-medium">Pre-start Email <span class="fw-normal">:  ${deletedSelect?.preStartDays} Prior</span></p> 
                <p class="mb-1 fs-6 fw-medium">Reminder(s) <span class="fw-normal">: Interval-${deletedSelect?.reminderIntervalStart} Days</span> <span class="fw-normal">:  ${deletedSelect?.reminderToStartDate}</span></p>
                <p class="mb-0">Are You Sure to Cancel this Schedule ?</p>
              `}
        show={isAlertVisible}
        icon="warning"
        onConfirmAlert={onConfirmAlertModal}
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={setIsAlertVisible}
        isConfirmedTitle="Deleted!"
        isConfirmedText="schedule cancelled successfully."
      />
    </>
  );
}

export default ScheduleLog;
