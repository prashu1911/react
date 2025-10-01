import React, { useEffect, useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { useTable } from "customHooks/useTable";
import { useSelector } from "react-redux";
import { selectCompany, selectCompanyData } from "../../../../../redux/ManageSurveySlice/index.slice";
import { Button, ReactDataTable, SelectField, SelectWithActions, SweetAlert } from "../../../../../components";
import CustomDualListBox from "./CustomDualListBox";
import toast from "react-hot-toast";
import AssignAlert from "components/AssignAlert";
import { useDispatch } from "react-redux";
import SelectMultiField from "./SelectMultiField";

// dual list options
const dualListOptions = [
  {
    value: "Testing team- Abigail Baker - Abigail Baker",
    label: "Testing team- Abigail Baker - Abigail Baker",
  },
  {
    value: "Testing team- Brooklyn Kelly - Brooklyn Kelly",
    label: "Testing team- Brooklyn Kelly - Brooklyn Kelly",
  },
  {
    value: "Testing team- Harish N - Harish.n@ibridgellc.com",
    label: "Testing team- Harish N - Harish.n@ibridgellc.com",
  },
  {
    value: "React JS- Ogiwel J - user908",
    label: "React JS- Ogiwel J - user908",
  },
  {
    value: "Business Analysis- Shivankita C - user90G",
    label: "Business Analysis- Shivankita C - user90G",
  },
  {
    value: "React JS- Shriti C - user907",
    label: "React JS- Shriti C - user907",
  },
  {
    value: "React JS- suveer C - user901",
    label: "React JS- suveer C - user901",
  },
  {
    value: "Business Development- Zoloin K - user902",
    label: "Business Development- Zoloin K - user902",
  },
];

function AssignedSection({
  companyOptions,
  surveyOptions,
  departmentOptions,
  scheduleData,
  selectedCompanyId,
  selectedSurveyId,
  selectedDepartmentId,
  tableLoader,
  setSelectedCompanyId,
  setSelectedSurveyId,
  setSelectedDepartmentId,
  fetchSurvey,
  fetchDepartment,
  fetchScheduleLog,
  createSchShow,
  editSchShow,
  deleteModal,
  unassignShow,
  allUsers, // Add this prop
  handleAddToSchdule,
  isScheduledSubmitting,
  handleImmediateAssignment,
  isSendSubmitting,
  onAlertYes, // New Prop
}) {
  const dispatch = useDispatch();
  const [selectedTiming, setSelectedTiming] = useState("schedule");

  const [selected, setSelected] = useState([]);
  const [preSelectedItems, setPreSelectedItems] = useState([]);
  const [searchValue] = useState("");
  const [tableFilters] = useState({});
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const preSelectedCompanyID = useSelector(selectCompanyData);
const multipleLineSelect = true
  useEffect(() => {
    if (preSelectedCompanyID && companyOptions?.length > 0) {
      const preSelectedCompany = companyOptions.find((company) => company.value === preSelectedCompanyID);
      if (preSelectedCompany) {
        setSelectedCompanyId(preSelectedCompany?.value);
        dispatch(selectCompany(preSelectedCompany?.value));
        // setSelectedSurveyId("");
        setSelectedDepartmentId([]);
        fetchSurvey(preSelectedCompany?.value);
        fetchDepartment(preSelectedCompany?.value);
      }
    }
  }, [preSelectedCompanyID, companyOptions]);

  const handleClearAll = () => {
    setSelectedDepartmentId([]);
    setIsApplied(false)
  };

  // Decode html entities
  const htmlDecode = (str) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  };

  const onChange = (selectedData) => {
    setSelected(selectedData);

    const unscheduledDeptIds = scheduleData
      ?.filter((dept) => !dept.startDate && !dept.endDate)
      .map((dept) => dept.departmentID);

    const selectedInUnscheduledDept = selectedData.filter((user) => unscheduledDeptIds.includes(user.departmentID));

    if (selectedInUnscheduledDept.length > 0) {
      const depts = [
        ...new Set(
          selectedInUnscheduledDept.map((user) => {
            const dept = scheduleData.find((d) => d.departmentID === user.departmentID);
            return dept?.departmentName || user.departmentID;
          })
        ),
      ].join(", ");
      toast.error(`Selected participants belong to unscheduled departments: ${depts}`);
    }
  };

  const timingRadioChange = (e) => {
    setSelectedTiming(e.target.id);
  };

  // DataTable setup...
  const { currentData, totalRecords, totalPages, offset, limit, sortState, setOffset, setLimit, handleSort } = useTable(
    {
      searchValue,
      searchKeys: [""],
      tableFilters,
      initialLimit: 10,
      data: scheduleData,
    }
  );

  const handleCompanyChange = (selectedData) => {
    setSelectedCompanyId(selectedData?.value);
    dispatch(selectCompany(selectedData?.value));
    setSelectedSurveyId("");
    setSelectedDepartmentId([]);
    fetchSurvey(selectedData?.value);
    fetchDepartment(selectedData?.value);
  };

  const handleMultiSelect = (data) => {
    setSelectedDepartmentId(data.map((item) => item?.value));
    // setSelectedOptions(data);
  };

  const handleSelectAllDepartments = () => {
    // setSelectedOptions(departmentOptions);
    setSelectedDepartmentId(departmentOptions.map((item) => item.value));
  };

  // const checkMissingSchedules = () => {

  //   const unscheduledDepartments = scheduleData
  //     ?.filter((dept) => !dept.startDate && !dept.endDate)
  //     ?.map((dept) => dept.departmentName);

  //   if (unscheduledDepartments.length > 0) {
  //     setIsAlertVisible({
  //       alert: true,
  //       message: `The departments, ${unscheduledDepartments.join(", ")} don't have a schedule. Do you want to create?`
  //     })
  //   }
  // };

  // useEffect(() => {
  //   if (scheduleData && scheduleData.length > 0) {
  //     checkMissingSchedules();
  //   }
  // }, [scheduleData]);

  const onConfirmAlertModal = async () => {
    setSelectedTiming("schedule");

    const unscheduled = scheduleData?.find((dept) => !dept.startDate && !dept.endDate);

    if (unscheduled) {
      handleModalOpen(unscheduled); // Trigger modal with that department's data
    } else {
      toast.error("Something went wrong");
    }
    return true;
  };

  const onCancelAlertModal = () => {
    setSelectedTiming("immediate");
  };

  const handleModalOpen = (row) => {
    const modalData = {
      ...row, // Pass the entire row data
      companyId: selectedCompanyId,
      surveyId: selectedSurveyId,
      departmentId: row.departmentID,
      departmentName: row.departmentName,
      surveyName: row.surveyName,
    };

    if (!row.isScheduled) {
      // If not scheduled, show create modal
      createSchShow(modalData);
    } else {
      // If already scheduled, show edit modal
      editSchShow(modalData);
    }
  };

  const handleLimitChange = (value) => {
    setLimit(value);
    setOffset(1);
  };

  const handleOffsetChange = (value) => {
    setOffset(value);
  };

  const getReminderText = (recordVal) => {
    if (recordVal.isReminder) {
      if (recordVal.reminderIntervalStartType === 1) {
        return `Interval - ${recordVal.reminderIntervalStart} Day(s) `;
      } else if (recordVal.reminderIntervalStartType === 2) {
        return `Interval - ${recordVal.reminderIntervalStart} Week(s)`;
      } else if (recordVal.reminderIntervalStartType === 0) {
        return `Once on ${recordVal.reminderToStartDate}`;
      } else {
        return 1;
      }
    } else {
      return "";
    }
  };

  // data table
  const columns = [
    {
      title: "#",
      dataKey: "s.no",
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: "Department Name",
      dataKey: "departmentName",
    },
    // {
    //   title: "Assigned",
    //   dataKey: "isScheduled",
    //   render: (data, row) => (row.isScheduled ? "Yes" : "No"),
    // },
    {
      title: "Start Date",
      dataKey: "startDate",
      render: (data) => data || "-",
    },
    {
      title: "End Date",
      dataKey: "endDate",
      render: (data) => data || "-",
    },
    // {
    //   title: "Days Open",
    //   dataKey: "daysOpen",
    // },
    // {
    //   title: "Days To Close",
    //   dataKey: "daysToClose",
    // },
    {
      title: "Pre Start Email",
      dataKey: "isPreStart",
      render: (data) => {
        if (data === null || data === "") {
          return "-";
        }
        return data ? "Yes" : "No";
      },
    },
    {
      title: "Days to close",
      dataKey: "daysToClose",
      render: (data) => data || "-",
    },
    // {
    //   title: "Days Until Start",
    //   dataKey: "daysUntilStart",
    //   render: (data) => data || "-",
    // },
    // {
    //   title: "Reminder",
    //   dataKey: "isReminder",
    //   render: (data) => (data ? "Yes" : "No"),
    // },
    {
      title: "Reminder Interval",
      dataKey: "reminderIntervalStart",
      render: (data, row) => {
        return <>{getReminderText(row)}</>;
      },
    },
    {
      title: "Action",
      dataKey: "action",
      columnHeaderClassName: "no-sorting",
      render: (data, row) => (
        <ul className="list-inline action mb-0">
          <li className="list-inline-item">
            <button
              type="button"
              aria-label="Action icon"
              className={row.isScheduled ? "icon-success" : "icon-secondary"}
              onClick={() => handleModalOpen(row)}
            >
              <em className="icon-calendar-plus" />
            </button>
          </li>
          {row.isScheduled && (
            <li className="list-inline-item">
              <button type="button" aria-label="Delete icon" className="icon-danger" onClick={() => deleteModal(row)}>
                <em className="icon-delete" />
              </button>
            </li>
          )}
        </ul>
      ),
    },
  ];

  const handleApply = async () => {
    const returnedVal = await fetchScheduleLog();
    if (returnedVal?.length > 0) {
      setIsApplied(true);
    } else {
      setIsApplied(false);
    }

    // console.log(selected, "selected");
    if (Array.isArray(returnedVal) && returnedVal.length > 0) {
      // Get unique department IDs from selected users
      const selectedDeptIds = [...new Set(selectedDepartmentId)]
      
      // If only one department is selected
      if (selectedDeptIds.length === 1) {
        const selectedDept = returnedVal.find(dept => String(dept.departmentID) === selectedDeptIds[0]);
        
        // If the department exists and has no schedule, set to immediate
        if (selectedDept && !selectedDept.startDate && !selectedDept.endDate) {
          setSelectedTiming("immediate");
          return;
        }
      }

      const unscheduledDepartments = returnedVal
        ?.filter((dept) => !dept.startDate && !dept.endDate)
        ?.map((dept) => dept.departmentName);

      // const scheduledDeptIds = returnedVal
      //   ?.filter((dept) => dept.startDate && dept.endDate)
      //   ?.map((dept) => String(dept.departmentID));

      // Check if selected users are from scheduled departments
      // const selectedInScheduled = selected?.some((user) => scheduledDeptIds.includes(String(user.departmentID)));
      // if (selectedInScheduled) {
      //   // ✅ Select the "schedule" radio
      //   setSelectedTiming("schedule");
      // } else {
      //   setSelectedTiming("immediate");
      // }
      // console.log(selected, selectedInScheduled, "selected");

      const checkIsScheduled = returnedVal?.some((v) => !v.isScheduled);
      if (checkIsScheduled) {
        setSelectedTiming("immediate");
      } else {
        setSelectedTiming("schedule");
      }

      let hasScheduled = returnedVal?.some((v) => v.isScheduled);
      let hasUnscheduled = returnedVal?.some((v) => !v.isScheduled);

      if (unscheduledDepartments.length > 0 && hasScheduled && hasUnscheduled) {
        setIsAlertVisible({
          alert: true,
          message: `The departments ${unscheduledDepartments.join(", ")} don't have a schedule. Do you want to create?`,
        });
      }
    }
  };

  useEffect(() => {
    if (selected.length > 0 && scheduleData.length > 0 && selectedTiming === "schedule") {
      // Extract unscheduled department IDs as numbers (or strings, depending on your data)
      const unscheduledDeptIds = scheduleData
        .filter((dept) => !dept.startDate && !dept.endDate)
        .map((dept) => String(dept.departmentID)); // Convert to string for consistency

      const selectedInUnscheduledDept = selected.filter(
        (user) => unscheduledDeptIds.includes(String(user.departmentID)) // Ensure type match
      );

      // Check which unscheduled users are newly selected
      const newSelections = selectedInUnscheduledDept.filter(
        (user) => !preSelectedItems.some((prev) => prev.value === user.value)
      );

      if (newSelections.length > 0) {
        const depts = [
          ...new Set(
            newSelections.map((user) => {
              const dept = scheduleData.find((d) => String(d.departmentID) === String(user.departmentID));
              return dept?.departmentName || user.departmentID;
            })
          ),
        ].join(", ");

        // toast.error(`Selected participants belong to unscheduled departments: ${depts}`, { toastId: "err001" });

        // Add new unscheduled selections to memory
        setPreSelectedItems((prev) => [...prev, ...newSelections]);
      }
    } else {
      setPreSelectedItems([]);
    }
  }, [selected, scheduleData]);

  const handleAddToSchduleLocal = () => {
    if (selected.length > 0) {
      //   const usersToAssign = selected.map((user) => ({
      //   userID: user.value,
      //   departmentID: user.departmentID,
      // }));
      const usersToAssign = selected
        .filter((user) => !user.isAssigned && !user.isScheduled)
        .map((user) => ({
          userID: user.value,
          departmentID: user.departmentID,
        }));

      const unscheduledDeptIds = scheduleData
        .filter((dept) => !dept.startDate && !dept.endDate)
        .map((dept) => String(dept.departmentID)); // Convert to string for consistency

      const selectedInUnscheduledDept = usersToAssign.filter(
        (user) => unscheduledDeptIds.includes(String(user.departmentID)) // Ensure type match
      );

      if (selectedInUnscheduledDept.length > 0) {
        const depts = [
          ...new Set(
            selectedInUnscheduledDept.map((user) => {
              const dept = scheduleData.find((d) => String(d.departmentID) === String(user.departmentID));
              return dept?.departmentName || user.departmentID;
            })
          ),
        ].join(", ");

        toast.error(`Selected participants belong to unscheduled departments: ${depts}`);
      } else {
        // onImmediateAssign(usersToAssign);
        handleAddToSchdule(usersToAssign);
        setPreSelectedItems([]);
      }
    }
  };

  const handleAddAndSendNowLocal = () => {
    if (selected.length > 0) {
      // const usersToAssign = selected.map((user) => ({
      //   userID: user.value,
      //   departmentID: user.departmentID,
      // }));
      const usersToAssign = selected
        .filter((user) => !user.isAssigned && !user.isScheduled)
        .map((user) => ({
          userID: user.value,
          departmentID: user.departmentID,
        }));

      // onImmediateAssign(usersToAssign);
      handleImmediateAssignment(usersToAssign);
      setPreSelectedItems([]);
    }
  };

  return (
    <div id="assigned" className="show-hide">
      <div className="d-lg-flex gap-2">
        <Row className="gx-2 flex-grow-1">
          <Col md={4} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>Company</Form.Label>
              <SelectField
                name="companyID"
                options={companyOptions}
                placeholder="Select Company"
                onChange={(selectedData) => {
                  handleCompanyChange(selectedData);
                  setIsApplied(false)
                }}
                value={companyOptions.find((option) => option?.value === selectedCompanyId)}
              />
            </Form.Group>
          </Col>
          <Col md={4} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>Survey</Form.Label>
              <SelectField
                placeholder="Select Survey"
                name="surveyID"
                options={surveyOptions}
                onChange={(selectedData) => {
                  setSelectedSurveyId(Number(selectedData?.value));
                  setIsApplied(false)
                }}
                value={surveyOptions.find((option) => Number(option?.value) == selectedSurveyId) || null}
                isDisabled={surveyOptions?.length === 0}
              />
            </Form.Group>
          </Col>
          <Col md={4} sm={6}>
            {/* <SelectWithActions
              label="Department"
              options={departmentOptions}
              placeholder="Select Department"
              onChange={(selectedData) => handleMultiSelect(selectedData)}
              value={departmentOptions?.filter((ele) => selectedDepartmentId.includes(ele.value))}
              handleSelectAll={handleSelectAllDepartments}
              handleClearAll={handleClearAll}
              isDisabled={departmentOptions?.length === 0 || !selectedSurveyId}
              multipleLineSelect={multipleLineSelect}
              isMulti
              // dropdownWidth="360px"
            /> */}
            <Form.Group className="form-group">
              <Form.Label>Department</Form.Label>
              <SelectMultiField 
              label="Department"
              options={departmentOptions}
              placeholder="Select Department"
              onChange={(selectedData) => handleMultiSelect(selectedData)}
              value={departmentOptions?.filter((ele) => selectedDepartmentId.includes(ele.value))}
              isDisabled={departmentOptions?.length === 0 || !selectedSurveyId}
            />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="form-group mt-lg-4">
          <Button
            variant="primary"
            className="ripple-effect"
            disabled={selectedCompanyId === "" || selectedSurveyId === "" || selectedDepartmentId?.length === 0}
            onClick={handleApply}
          >
            Apply
          </Button>
        </Form.Group>
      </div>
      {isApplied && (
        <>
          <Form.Group className="form-group">
            <Form.Label>Timing</Form.Label>
            <div className="onlyradio flex-wrap">
              <Form.Check
                inline
                label="Schedule"
                name="timing"
                type="radio"
                className="toggle-label"
                id="schedule"
                checked={selectedTiming === "schedule"}
                onChange={timingRadioChange}
              />
              <Form.Check
                inline
                label="Immediate"
                name="timing"
                type="radio"
                className="toggle-label"
                id="immediate"
                checked={selectedTiming === "immediate"}
                onChange={timingRadioChange}
              />
            </div>
          </Form.Group>
          {
            <AssignAlert
              text={htmlDecode(isAlertVisible?.message)}
              show={isAlertVisible || isAlertVisible?.alert}
              icon="warning"
              onConfirmAlert={onConfirmAlertModal}
              onCancelAlert={onCancelAlertModal}
              showCancelButton
              cancelButtonText="Cancel"
              confirmButtonText="Yes"
              setIsAlertVisible={setIsAlertVisible}
              onAlertConfirm={onAlertYes}
              // isConfirmedTitle="Ok"
              // isConfirmedText="You can create a schedule now!"
            />
          }
          {selectedTiming === "schedule" && (
            <div id="schedule">
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
              />
            </div>
          )}
          <div className="multiList">
            <CustomDualListBox
              options={dualListOptions}
              selected={selected}
              onChange={onChange}
              unassignShow={(users) => unassignShow(users)}
              allUsers={allUsers} // Pass allUsers prop
              selectedCompanyId={selectedCompanyId}
              selectedSurveyId={selectedSurveyId}
              selectedDepartmentId={selectedDepartmentId}
              setSelected={setSelected}
              scheduleData={scheduleData}
            />
            <div className="multiList_note mt-md-3 mt-2">
              <p className="mb-0 noteText">Note: List Marked In Red Color Are Already Assigned</p>
              <p className="mb-0 noteText success">Note: List Marked In Green Color Are Already Added To Scheduled</p>
            </div>
          </div>
          <div className="d-flex mt-xxl-5 mt-lg-4 mt-3 justify-content-end">
            {selectedTiming === "schedule" ? (
              <Button
                variant="primary"
                className="ripple-effect"
                onClick={handleAddToSchduleLocal}
                disabled={!selected.length || !selectedCompanyId || !selectedSurveyId}
              >
                {isScheduledSubmitting ? "Scheduling..." : "Add To Schedule"}
              </Button>
            ) : (
              <Button
                variant="primary"
                className="ripple-effect"
                onClick={handleAddAndSendNowLocal}
                disabled={!selected.length || !selectedCompanyId || !selectedSurveyId}
              >
                {isSendSubmitting ? "Sending..." : "Add & Send Now"}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AssignedSection;
