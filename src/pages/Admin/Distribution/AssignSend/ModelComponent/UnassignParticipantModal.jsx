import React, { useState, useEffect, useMemo } from "react";
import { useTable } from "customHooks/useTable";
import { Form } from "react-bootstrap";
import { Distribution } from "apiEndpoints/Distribution";
import { commonService } from "services/common.service";
import {
  Button,
  ModalComponent,
  ReactDataTable,
} from "../../../../../components";

const UnassignParticipantModal = ({
  unassignSch,
  UnassignSchClose,
  assignedUsers = [],
  userData,
  selectedCompanyId,
  selectedSurveyId,
  fetchScheduleLog,
}) => {
  const [checkedItems, setCheckedItems] = useState({});
  const [checkAll, setCheckAll] = useState(false);
  // const [isAlertVisible, setIsAlertVisible] = useState(false);
  // const [alertMessage, setAlertMessage] = useState("");

  // Memoize assigned users to prevent unnecessary re-renders
  const memoizedUsers = useMemo(() => {
    console.log("user", assignedUsers);

    // Filter to only show assigned users
    return assignedUsers.filter(
      (user) => user.assigned === 1 || user.scheduled === 1
    );
  }, [assignedUsers]);

  // Reset state when modal opens/closes
  useEffect(() => {
    setCheckedItems({});
    setCheckAll(false);
  }, [unassignSch]);

  // Setup table configuration outside of render
  const tableData = useMemo(
    () => ({
      searchValue: "",
      searchKeys: ["departmentName", "firstName", "lastName"],
      tableFilters: {},
      initialLimit: 10,
      data: memoizedUsers,
    }),
    [memoizedUsers]
  );

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
  } = useTable(tableData);

  // Handle individual checkbox changes
  const handleCheckboxChange = (e, row) => {
    const { checked } = e.target;
    setCheckedItems((prev) => ({
      ...prev,
      [row.userID]: checked,
    }));

    // Update checkAll based on whether all visible items are checked
    setCheckAll(
      currentData.every((user) =>
        checked
          ? user.userID === row.userID || checkedItems[user.userID]
          : user.userID !== row.userID && checkedItems[user.userID]
      )
    );
  };

  const handleUnAssigns = async (users) => {
    try {
      const assessmentScheduleData = users.map((user) => ({
        scheduleID: user.surveyscheduleID,
        userID: user.userID,
        departmentID: user.departmentID,
      }));

      const payload = {
        companyID: selectedCompanyId,
        surveyID: selectedSurveyId,
        assessmentScheduleData,
      };

      // const hasMissingScheduleID = assessmentScheduleData.some(data => !data.scheduleID);
      // if(hasMissingScheduleID){ 
      //   setAlertMessage("Cannot Unassign Participant");
      //   setIsAlertVisible(true);
      //   // console.log("Hi");
      //   return false;       
      // }

      const response = await commonService({
        apiEndPoint: Distribution.assignUnAssign,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: "Successfully unassigned participants",
          error: "Failed to unassign participants",
        },
      });

      if (response?.status) {
        fetchScheduleLog(); // Refresh the schedule list
      }
    } catch (error) {
      console.error("Error in unassignment:", error);
    }
  };
  // Handle check all changes
  const handleCheckAllChange = (e) => {
    const { checked } = e.target;
    setCheckAll(checked);

    const newCheckedItems = {};
    currentData.forEach((user) => {
      newCheckedItems[user.userID] = checked;
    });
    setCheckedItems(newCheckedItems);
  };

  const handleUnassign = async () => {
    const selectedUsers = currentData.filter(
      (user) => checkedItems[user.userID]
    );
    const result = await handleUnAssigns(selectedUsers);

    if (result !== false) {
      UnassignSchClose(); // Only close if the unassign was valid
    }
  };


  const unassignColumns = [
    {
      title: "#",
      dataKey: "s.no",
      data: "s.no",
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: (
        <Form.Group className="form-group mb-0" controlId="checkAll">
          <Form.Check
            className="me-0"
            type="checkbox"
            checked={checkAll}
            onChange={handleCheckAllChange}
            label={<div className="primary-color" />}
          />
        </Form.Group>
      ),
      dataKey: "checkboxData",
      columnOrderable: false,
      render: (data, row) => (
        <Form.Group
          className="form-group mb-0"
          controlId={`checkbox-${row.userID}`}
        >
          <Form.Check
            className="me-0"
            type="checkbox"
            checked={!!checkedItems[row.userID]}
            onChange={(e) => handleCheckboxChange(e, row)}
            label={<div className="primary-color" />}
          />
        </Form.Group>
      ),
    },
    // ...rest of your columns
    {
      title: "Department Name",
      dataKey: "departmentName",
      columnHeaderClassName: "no-sorting",
    },
    {
      title: "Participant Name",
      dataKey: "firstName",
      columnHeaderClassName: "no-sorting",
    },
    {
      title: "Secondary Name",
      dataKey: "lastName",
      columnHeaderClassName: "no-sorting",
    },
  ];

  return (
    <ModalComponent
      modalHeader="Unassign Participant"
      modalExtraClass="noFooter"
      extraBodyClassName="modalBody pt-3"
      size="lg"
      show={unassignSch}
      onHandleCancel={UnassignSchClose}
    >
      <ReactDataTable
        data={currentData}
        columns={unassignColumns}
        page={offset}
        totalLength={totalRecords}
        totalPages={totalPages}
        sizePerPage={limit}
        handleLimitChange={setLimit}
        handleOffsetChange={setOffset}
        searchValue=""
        handleSort={handleSort}
        sortState={sortState}
        isLoading={false}
      />

      {/* <BasicAlert
        title={alertMessage}
        text={"These participants belong to a department that hasn't been scheduled yet."}
        show={isAlertVisible}
        icon="warning"
        setIsAlertVisible={setIsAlertVisible}
        buttonText="OK"
      /> */}

      <div className="form-btn d-flex gap-2 justify-content-end pt-2">
        <Button
          type="button"
          variant="secondary"
          className="ripple-effect"
          onClick={UnassignSchClose}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          className="ripple-effect"
          onClick={handleUnassign}
          disabled={!Object.values(checkedItems).some(Boolean)}
        >
          Unassign
        </Button>
      </div>
    </ModalComponent>
  );
};

export default React.memo(UnassignParticipantModal);
