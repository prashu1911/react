import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { commonService } from "services/common.service";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { COMMANAPI } from "apiEndpoints/OrgStructure/OrgStructure.dashboard";
import { Distribution } from "apiEndpoints/Distribution";
import { useAuth } from "customHooks";
import { decodeHtmlEntities, formatDate } from "utils/common.util";
import { useLocation } from "react-router-dom";
import { Breadcrumb, SweetAlert } from "../../../../components";
import AssignedSection from "./subcomponents/AssignedSection";
import AnonymousSection from "./subcomponents/AnonymousSection";
import AddAnonymousDepartmentModal from "./ModelComponent/AddAnonymousDepartmentModal";
import CreateScheduleModal from "./ModelComponent/CreateScheduleModal";
import EditScheduleModal from "./ModelComponent/EditScheduleModal";
import UnassignParticipantModal from "./ModelComponent/UnassignParticipantModal";

function AssignSend() {
  const location = useLocation();
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  // Get values from location state
  const initialCompanyId = location.state?.companyId || "";
  const initialSurveyId = location.state?.surveyId || "";

  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Distribution",
    },

    {
      path: "#",
      name: "Assign & Send",
    },
  ];

  // company options
  const [companyOptions, setCompanyOptions] = useState([]);
  const [surveyOptions, setSurveyOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedSurveyId, setSelectedSurveyId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState([]);
  const [tableLoader, setTableLoader] = useState(false);
  const [allUsers, setAllUsers] = useState([]); // Add this state
  const [isScheduledSubmitting, setIsScheduledSubmitting] = useState(false);
  const [isSendSubmitting, setIsSendSubmitting] = useState(false);
  const [alertConfirmed, setAlertConfirmed] = useState(false);
  const [isPreStartInvalid, setIsPreStartInvalid] = useState(false);

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

  // delete sweet alert
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Add this state for tracking selected schedule
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const deleteModal = (schedule) => {
    setSelectedSchedule(schedule);
    setIsAlertVisible(true);
  };

  //  Add Anonymous modal
  const [addAnonymous, setAddAnonymous] = useState(false);
  const [anonymousCompanyId, setAnonymousCompanyId] = useState(null); // Add this state
  const addAnonymousClose = () => {
    setAddAnonymous(false);
    setAnonymousCompanyId(null);
  };
  const addAnonymousShow = (companyId) => {
    if (!companyId) return; // Don't open modal if no company is selected
    setAnonymousCompanyId(companyId);
    setAddAnonymous(true);
  };

  // create schedule modal
  const [showeCreateSch, setShoweCreateSch] = useState(false);
  const createSchClose = () => {
    setModalData(null);
    setShoweCreateSch(false);
  };
  const createSchShow = async (data) => {
    setModalData(data);

    // Trigger Pre-Start Check here
    if (data?.companyId && data?.surveyId) {
      setSelectedCompanyId(data.companyId);
      setSelectedSurveyId(data.surveyId);
      
      await handlePreStartCheck(data.companyId, data.surveyId);
    }

    setShoweCreateSch(true);
  };


  // edit schedule modal
  const [showeEditSch, setShoweEditSch] = useState(false);

  const editSchClose = () => {
    setModalData(null);
    setShoweEditSch(false);
  };
  const editSchShow = async (data) => {
    setModalData(data);

     // Trigger Pre-Start Check here
    if (data?.companyId && data?.surveyId) {
      setSelectedCompanyId(data.companyId);
      setSelectedSurveyId(data.surveyId);
      
      await handlePreStartCheck(data.companyId, data.surveyId);
    }
    setShoweEditSch(true);
  };

  // unassign modal
  const [unassignSch, setUnassignSch] = useState(false);
  const UnassignSchClose = () => setUnassignSch(false);
  const unassignShow = () => setUnassignSch(true);

  // show hide div by radio checkbox
  const [selectedDelivery, setSelectedDelivery] = useState("assigned");

  const handleRadioChange = (e) => {
    setSelectedDelivery(e.target.id);
    // If we have a selected company, fetch departments for the new delivery type
    if (selectedCompanyId) {
      fetchDepartment(selectedCompanyId, e.target.id === "anonymous");
      // Ensure we have survey options when switching tabs
      if (!surveyOptions.length) {
        fetchSurvey(selectedCompanyId);
      }
    }
  };

  // Add effect to maintain survey options when switching tabs
  useEffect(() => {
    if (selectedCompanyId && !surveyOptions.length) {
      fetchSurvey(selectedCompanyId);
    }
  }, [selectedDelivery, selectedCompanyId]);

  useEffect(() => {
    setSelectedDepartmentId([]);
  }, [selectedSurveyId, selectedCompanyId, selectedDelivery]);

  // Add effect to maintain survey selection when switching tabs
  useEffect(() => {
    if (selectedCompanyId && selectedSurveyId) {
      const surveyExists = surveyOptions.some(
        (option) => Number(option.value) === Number(selectedSurveyId)
      );
      if (!surveyExists && surveyOptions.length > 0) {
        setSelectedSurveyId("");
      }
    }
  }, [selectedDelivery, surveyOptions]);

  useEffect(() => {
    setAlertConfirmed(false);
  }, [selectedSurveyId, selectedCompanyId, selectedDepartmentId]);

  // Add state for modal data

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
      // Filter departments based on isAnonymous flag
      const filteredDepartments = response?.data?.data?.filter((dept) =>
        isAnonymous ? true : !dept.isAnonymous
      );

      setDepartmentOptions(
        filteredDepartments?.map((department) => ({
          value: department?.departmentID,
          label: department?.departmentName,
        }))
      );
    }
  };

  const fetchScheduleLog = async () => {
    if (
      selectedCompanyId &&
      selectedSurveyId &&
      selectedDepartmentId.length > 0
    ) {
      setTableLoader(true);

      const response = await commonService({
        apiEndPoint: Distribution.fetchAllSchedule,
        queryParams: {
          companyID: selectedCompanyId,
          surveyID: selectedSurveyId,
          "departmentID[]": selectedDepartmentId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        // Set allUsers from response
        setAllUsers(response?.data?.allUsers || []);
        if (response?.data?.allSchedule?.length > 0) {
          const finalData = response?.data?.allSchedule.map((oneRecord) => ({
            ...oneRecord,
            surveyScheduleID: oneRecord.surveyScheduleID,
            surveyName: oneRecord.surveyName,
          }));
          setTableLoader(false);
          setScheduleData(finalData);
          return finalData;
        }
      }
      setTableLoader(false);
    }
  };

  const handleScheduleSubmit = async (values, { resetForm }) => {
    try {
      setTableLoader(true);
      const payload = {
        companyID: modalData.companyId,
        surveyID: Number(modalData.surveyId),
        departmentID: [modalData.departmentId],
        startDate: formatDate(values?.start_date[0]), // Update to handle Flatpickr date array
        endDate: formatDate(values?.end_date[0]), // Update to handle Flatpickr date array
        isPreStartEmail: values.preStartChecked ? 1 : 0,
        isPreStartDays: values.preStartChecked ? values?.is_pre_start_days : 0,
        isReminder: values.setAutomaticChecked ? 1 : 0,
        isReminderType: values.setAutomaticChecked
          ? values.selectedReminder === "once"
            ? 1
            : 2
          : "",
        isReminderCompleteDate:
          values.setAutomaticChecked && values.selectedReminder === "once"
            ? formatDate(values?.is_reminder_complete_date[0]) // Update to handle Flatpickr date array
            : null,
        isReminderCompleteDay:
          values.setAutomaticChecked && values.selectedReminder !== "once"
            ? values?.is_reminder_complete_days
            : 0,
        isCompleteOccuranceIntervalType:
          values.setAutomaticChecked && values.selectedReminder !== "once"
            ? values?.is_reminder_occurance_interval_type === "Day"
              ? 1
              : 2
            : "",
      };

      // Add surveyScheduleID to payload if it exists (update case)
      if (modalData.surveyScheduleID) {
        payload.surveyScheduleID = modalData.surveyScheduleID;
      }

      const response = await commonService({
        apiEndPoint: modalData.surveyScheduleID
          ? Distribution.updateSchedule
          : Distribution.createSchedule,
        bodyData: payload,
        toastType: {
          success: modalData.surveyScheduleID
            ? "Schedule updated successfully"
            : "Schedule created successfully",
          error: modalData.surveyScheduleID
            ? "Failed to update schedule"
            : "Failed to create schedule",
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        // eslint-disable-next-line no-unused-expressions
        modalData.surveyScheduleID ? editSchClose() : createSchClose();
        resetForm();
        fetchScheduleLog(); // Refresh the schedule list
      }
      setTableLoader(false);
    } catch (error) {
      console.error(error);
      setTableLoader(false);
    }
  };

  //API to check if survey has preStart mail configured
  const handlePreStartCheck = async (companyId,surveyId) => {
    const queryParams = {
      companyID: companyId,
      surveyID: surveyId,
    };

    try {
      const response = await commonService({
        apiEndPoint: Distribution.checkPreStart,
        queryParams: queryParams,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        // toastType: {
        //   success: "Pre-Start is configured",
        //   error: "Pre-Start is not configured",
        // },
      });
      if (response?.data?.status === "success") {
        if (response?.data?.surveyLevel === 0) {
          setIsPreStartInvalid(true);
        } else {
          setIsPreStartInvalid(false);
        }

      }
    } catch (error) {
      console.error("Error checking PreStart:", error);
      setIsPreStartInvalid(false); // fallback in case of error
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

      // If we have an initial company ID, fetch surveys and set company
      if (initialCompanyId) {
        setSelectedCompanyId(initialCompanyId);
        await fetchSurvey(initialCompanyId);
        // Fetch departments based on initial selected delivery
        await fetchDepartment(
          initialCompanyId,
          selectedDelivery === "anonymous"
        );
      }

      // If we have an initial survey ID, set it
      if (initialSurveyId) {
        setSelectedSurveyId(initialSurveyId);
      }
    };

    initializeData();
  }, [userData]);

  // Add effect to refetch departments when selectedDelivery changes
  useEffect(() => {
    if (selectedCompanyId) {
      fetchDepartment(selectedCompanyId, selectedDelivery === "anonymous");
    }
  }, [selectedDelivery, selectedCompanyId]);

  const deleteScheduleLog = async () => {
    try {
      if (!selectedSchedule?.surveyScheduleID) {
        console.error("No schedule selected for deletion");
        return false;
      }

      const response = await commonService({
        apiEndPoint: Distribution.deleteSchedule,
        bodyData: { surveyScheduleID: selectedSchedule.surveyScheduleID },
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
        setSelectedSchedule(null);
        fetchScheduleLog(); // Refresh the schedule list
        return true;
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      return false;
    }
  };

  const onConfirmAlertModal = async () => {
    const response = await deleteScheduleLog();
    return response;
  };

  const handleImmediateAssignment = async (users) => {
    try {
      setIsSendSubmitting(true);
      setTableLoader(true);
      const payload = {
        companyMasterID: userData?.companyMasterID,
        companyID: selectedCompanyId,
        surveyID: selectedSurveyId,
        users,
      };
      const response = await commonService({
        apiEndPoint: Distribution.assignImmediate,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: "Survey assigned successfully",
          error: "Failed to assign survey",
        },
      });

      if (response?.status) {
        fetchScheduleLog(); // Refresh the schedule list
      }
      setTableLoader(false);
      setIsSendSubmitting(false);
    } catch (error) {
      console.error("Error in immediate assignment:", error);
      setTableLoader(false);
      setIsSendSubmitting(false);
    }
  };

  const handleAddToSchdule = async (users) => {
    setIsScheduledSubmitting(true);

    try {
      setTableLoader(true);
      const payload = {
        companyMasterID: userData?.companyMasterID,
        companyID: selectedCompanyId,
        surveyID: selectedSurveyId,
        users,
      };
      const response = await commonService({
        apiEndPoint: Distribution.addToSchdule,
        bodyData: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        isToast: true,
        toastType: {
          success: "Survey assigned successfully",
          error: "Failed to assign survey",
        },
      });

      if (response?.status) {
        fetchScheduleLog(); // Refresh the schedule list
      }
      setTableLoader(false);
      setIsScheduledSubmitting(false);
    } catch (error) {
      console.error("Error in immediate assignment:", error);
      setTableLoader(false);
      setIsScheduledSubmitting(false);
    }
  };

  return (
    <>
      {/* head title start */}
      <section className="commonHead">
        <h1 className="commonHead_title">Welcome Back!</h1>
        <Breadcrumb breadcrumb={breadcrumb} />
      </section>
      {/* head title end */}
      <div className="pageContent assignSend">
        <div className="pageTitle">
          <h2 className="mb-0">Assign & Send</h2>
        </div>
        <Form>
          <Form.Group className="form-group">
            <Form.Label>Delivery</Form.Label>
            <div className="onlyradio flex-wrap">
              <Form.Check
                inline
                label="Assigned"
                name="delivery"
                type="radio"
                className="toggle-label"
                id="assigned"
                checked={selectedDelivery === "assigned"}
                onChange={handleRadioChange}
              />
              <Form.Check
                inline
                label="Anonymous"
                name="delivery"
                type="radio"
                className="toggle-label"
                id="anonymous"
                checked={selectedDelivery === "anonymous"}
                onChange={handleRadioChange}
              />
            </div>
          </Form.Group>

          {selectedDelivery === "assigned" && (
            <AssignedSection
              companyOptions={companyOptions}
              surveyOptions={surveyOptions}
              departmentOptions={departmentOptions}
              scheduleData={scheduleData}
              selectedCompanyId={selectedCompanyId}
              selectedSurveyId={selectedSurveyId}
              selectedDepartmentId={selectedDepartmentId}
              tableLoader={tableLoader}
              setSelectedCompanyId={setSelectedCompanyId}
              setSelectedSurveyId={setSelectedSurveyId}
              setSelectedDepartmentId={setSelectedDepartmentId}
              fetchSurvey={fetchSurvey}
              fetchDepartment={(companyId) => fetchDepartment(companyId, false)}
              fetchScheduleLog={fetchScheduleLog}
              createSchShow={createSchShow}
              editSchShow={editSchShow}
              deleteModal={deleteModal}
              unassignShow={unassignShow}
              allUsers={allUsers}
              handleAddToSchdule={handleAddToSchdule}
              isScheduledSubmitting={isScheduledSubmitting}
              handleImmediateAssignment={handleImmediateAssignment}
              isSendSubmitting={isSendSubmitting}
              onAlertYes={() => setAlertConfirmed(true)}
            />
          )}

          {selectedDelivery === "anonymous" && (
            <AnonymousSection
              companyOptions={companyOptions}
              surveyOptions={surveyOptions}
              departmentOptions={departmentOptions}
              addAnonymousShow={addAnonymousShow}
              fetchDepartment={(companyId) => fetchDepartment(companyId, true)}
              fetchSurvey={fetchSurvey}
              selectedCompanyId={selectedCompanyId}
              selectedSurveyId={selectedSurveyId}
              setSelectedCompanyId={setSelectedCompanyId}
              setSelectedSurveyId={setSelectedSurveyId}
              setSelectedDepartmentId={setSelectedDepartmentId}
              selectedDepartmentId={selectedDepartmentId}
              userData={userData}
            />
          )}
        </Form>
      </div>

      {/* Add Anonymous modal */}
      {addAnonymous && (
        <AddAnonymousDepartmentModal
          show={addAnonymous}
          onHandleCancel={addAnonymousClose}
          companyId={anonymousCompanyId}
          onSuccess={() => fetchDepartment(anonymousCompanyId, true)}
        />
      )}

      {/* create schedule modal */}
      {showeCreateSch && (
        <CreateScheduleModal
          showeCreateSch={showeCreateSch}
          departmentOptions={departmentOptions}
          createSchClose={createSchClose}
          reminder={reminder}
          daysOptions={daysOptions}
          modalData={modalData}
          onSubmit={handleScheduleSubmit}
          isSubmitting={tableLoader}
          alertConfirmed={alertConfirmed}
          isPreStartInvalid={isPreStartInvalid}
        />
      )}

      {/* edit schedule modal */}
      {showeEditSch && (
        <EditScheduleModal
          showeEditSch={showeEditSch}
          editSchClose={editSchClose}
          reminder={reminder}
          daysOptions={daysOptions}
          modalData={modalData}
          onSubmit={handleScheduleSubmit}
          isSubmitting={tableLoader}
          isPreStartInvalid={isPreStartInvalid}
        />
      )}

      {/* Unassign Participant modal */}
      {unassignSch && (
        <UnassignParticipantModal
          unassignSch={unassignSch}
          UnassignSchClose={UnassignSchClose}
          assignedUsers={allUsers} // Pass the users data
          userData={userData}
          selectedCompanyId={selectedCompanyId} // Pass the selected company ID
          selectedSurveyId={selectedSurveyId} // Pass the selected survey ID
          fetchScheduleLog={fetchScheduleLog}
          onUnassign={() => {
            UnassignSchClose();
          }}
        />
      )}

      <SweetAlert
        title="Are you sure?"
        text="You want to delete this data!"
        show={isAlertVisible}
        icon="warning"
        onConfirmAlert={onConfirmAlertModal}
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={setIsAlertVisible}
        isConfirmedTitle="Deleted!"
        isConfirmedText="Your data has been deleted."
      />
    </>
  );
}

export default AssignSend;
