import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { Col, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { commonService } from "services/common.service";
import { decodeHtmlEntities } from "utils/common.util";
import { toast } from "react-hot-toast";
import {
  PARTICIPANT_MANAGEMENT,
  COMMANAPI,
} from "apiEndpoints/OrgStructure/OrgStructure.dashboard";
// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from "lodash.debounce";
import logger from "helpers/logger";
import ExportExcel from "components/Excel";
import {
  initValuesAdd,
  initValuesUpdate,
  validationParticipantAdd,
  validationParticipantUpdate,
  initValuesFileUpload,
  validationUploadFilePopup,
} from "./validation";
import {
  Button,
  InputField,
  SweetAlert,
  SelectField,
  Breadcrumb,
  ModalComponent,
  ReactDataTable,
} from "../../../../components";
import useAuth from "../../../../customHooks/useAuth/index";

function ParticipantManagement() {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [companyOptions, setCompanyOptions] = useState([]);
  const [departmentOps, setDepartmentOps] = useState([]);
  const [masterCompOps] = useState([
    {
      label: userData?.companyMasterName,
      value: userData?.companyMasterID,
    },
  ]);
  const [participant, setParticipant] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingUpload, setIsSubmittingUpload] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [showAddPar, setShowAddPar] = useState(false);
  // New states to handle server side processing
  const [sortDirection, setSortDirection] = useState("asc");
  const fileInputRef = useRef();
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableState, setTableState] = useState({
    draw: 1,
    start: 0,
    length: 10,
    order: [{ column: 0, dir: "asc" }],
  });
  const [tableLoader, setTableLoader] = useState(false);
  const [CsvCount, setCsvCount] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const addparClose = () => {
    setShowAddPar(false);
    setDepartmentOps([]);
    // eslint-disable-next-line no-use-before-define
    formik.resetForm();
  };
  const addparShow = () => setShowAddPar(true);
  const [showEditPar, setShowEditPar] = useState(false);
  const editparClose = () => {
    setShowEditPar(false);
    editFormik.resetForm();
  };
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [tragetReset, setTaragetReset] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  // upload data modal
  const [showUpload, setShowUpload] = useState(false);
  const uploadClose = () => {
    // eslint-disable-next-line no-use-before-define
    handleFileformik.resetForm();
    setShowUpload(false);
    setUploadedFileName("");
  };

  const uploadShow = () => setShowUpload(true);

  const editparShow = (row) => {
    setSelectedParticipant(row);
    // eslint-disable-next-line no-use-before-define
    fetchParticipantOption(
      `department?companyID=${row?.companyID}`,
      "department"
    );
    setShowEditPar(true);
  };
  const deleteModal = (id) => {
    setSelectedParticipant((prev) => ({ ...prev, userID: id }));
    setIsAlertVisible(true);
  };

  const handleResetPassward = async () => {
    try {
      const response = await commonService({
        apiEndPoint: PARTICIPANT_MANAGEMENT.resetPassword,
        bodyData: {
          participantID: tragetReset?.userID,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: false,
          error: "admin failed",
        },
      });
      if (response?.status) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const buttonStyle = {
    textDecoration: "underline",
    color: "#007bff",
    cursor: "pointer",
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
  };

  const downloadErroFile = async (filePath) => {
    const response = await commonService({
      apiEndPoint: PARTICIPANT_MANAGEMENT.downloadExcelErrorFile,
      isFormData: false,
      queryParams: { filename: filePath },
      headers: {
        Authorization: `Bearer ${userData?.apiToken}`,
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      responseType: "blob",
      toastType: {
        success: false,
        error: "Data upload failed!",
      },
    });

    if (response?.status) {
      let fileData = response?.data;
      let data = new Blob([fileData]);
      let csvURL = window.URL.createObjectURL(data);
      let tempLink = document.createElement("a");
      tempLink.href = csvURL;
      tempLink.setAttribute(
        "download",
        `Review-Uploaded-Data-${Date.now()}.xlsx`
      );
      tempLink.click();
    }
  };

  const handleDownloadTemplate = async () => {
    const response = await commonService({
      apiEndPoint: PARTICIPANT_MANAGEMENT.downloadTemplateFile,
      isFormData: false,
      headers: {
        Authorization: `Bearer ${userData?.apiToken}`,
        Accept:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      responseType: "blob",
      // toastType: {
      //   success: "Data uploaded successfully!",
      //   error: "Data upload failed!",
      // },
    });
    if (response?.status) {
      let fileData = response?.data;
      let data = new Blob([fileData]);
      let csvURL = window.URL.createObjectURL(data);
      let tempLink = document.createElement("a");
      tempLink.href = csvURL;
      tempLink.setAttribute("download", `Participant Upload Template.xlsx`);
      tempLink.click();
      toast.success("Template downloaded successfully!");
    }
  };

  const uploadFile = async (values, { resetForm }) => {
    try {
      setIsSubmittingUpload(true);
      const response = await commonService({
        apiEndPoint: PARTICIPANT_MANAGEMENT.uploadFile,
        bodyData: {
          file: values?.file,
          companyID: values?.companyID,
          // companyMasterID: userData?.companyMasterID,
        },
        isFormData: true,
        isToast: true,
        headers: {
          Authorization: `Bearer ${userData?.apiToken}`,
          "Content-type": "FormData",
        },
        toastType: {
          success: true,
          error: "Password reset failed!",
        },
        toastMessage: {
          success: "Data Upload successfully!",
          error: "Data upload failed. Kindly select an updated file and retry.",
        },
        filePresent: true,
        fileKey: "file",
      });

      if (response?.status) {
 
        setIsSubmittingUpload(false);
        if (response?.data?.filePath && response?.data?.filePath !== "") {
          setUploadedFileName(response?.data?.filePath);
        } else {
          uploadClose();
          resetForm();
        }
      } else {
  
        setIsSubmittingUpload(false);
        if (response?.data?.filePath && response?.data?.filePath !== "") {
    
          setUploadedFileName(response?.data?.filePath);
          if (fileInputRef.current) {
   
          handleFileformik.setFieldValue("file", null);
          fileInputRef.current.value = null;
          }
        } else {

          uploadClose();
          resetForm();
        }
      }
    } catch (error) {
      console.error(error);
      setIsSubmittingUpload(false);
      return false;
    }
  };

  const confirmPasswordModal = async () => {
    const result = await handleResetPassward();
    return result;
  };

  const successfullyModal = (row) => {
    setTaragetReset(row);
    setIsPasswordVisible(true);
  };

  const printOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  const fetchParticipantOption = async (path, type) => {
    const response = await commonService({
      apiEndPoint: COMMANAPI.getComman(path),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
      // toastType: {
      //   success: "Get department through company",
      //   error: "get failed",
      // },
    });
    if (response?.status) {
      if (type === "company") {
        const options = Object?.values(response?.data?.data)?.map(
          (company) => ({
            value: company?.companyID,
            label: company?.companyName,
          })
        );
        setCompanyOptions(options);
      }

      if (type === "department" && !Array.isArray(response?.data?.data)) {
        const options = Object?.values(response?.data?.data)?.map(
          (department) => ({
            value: department?.departmentID,
            label: department?.departmentName,
          })
        );
        setDepartmentOps(options);
      }

      if (type === "participant") {
        setParticipant(Object?.values(response?.data?.data));
      }
    }
  };
  // Function to get Server side Participant datatable
  const getParticipantList = async () => {
    if (!userData.companyMasterID) return;

    setTableLoader(true);
    try {
      const response = await commonService({
        apiEndPoint: PARTICIPANT_MANAGEMENT.getParticipantsServerSide,
        bodyData: {
          companyMasterID: userData.companyMasterID,
          search: { value: searchValue || "", regex: false },
          ...tableState,
          isExport: false,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        setParticipant(response.data.data || []);
        // setTotalRecords(response?.data?.recordsTotal || response?.data?.recordsFiltered || 0);
        // Fixed count handling
        setTotalRecords(
          searchValue
            ? response.data.recordsFiltered ?? 0
            : response.data.recordsTotal ?? 0
        );
        setCsvCount(response?.data?.recordsTotal);
      }
    } catch (error) {
      logger(error);
    } finally {
      setTableLoader(false);
    }
  };

  // Function to get all participant data for Export
  const fetchParticipantDataForCSV = async () => {
    const { companyMasterID } = userData;
    if (!companyMasterID) {
      return [];
    }
    try {
      const response = await commonService({
        apiEndPoint: PARTICIPANT_MANAGEMENT.getParticipantsServerSide,
        bodyData: {
          companyMasterID,
          search: {
            value: searchValue || "",
            regex: false,
          },
          start: 0, // Fetch all
          length: CsvCount, // Fetch all
          order: [{ column: 0, dir: "asc" }],
          isExport: true,
          draw: 1,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        return response?.data?.data || [];
      }
      return [];
    } catch (error) {
      logger(error);
      return [];
    }
  };
  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      // Add isOverRide to the request body
      const requestData = {
        ...values,
        isOverRide: false,
      };
      const response = await commonService({
        apiEndPoint: PARTICIPANT_MANAGEMENT.createParticipant,
        // bodyData: values,
        bodyData: requestData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: "Participant Created Successfully",
          error: "participant failed",
        },
      });
      if (response?.status) {
        setIsSubmitting(false);
        addparClose();
        resetForm();
        // fetchParticipantOption(
        //   `participant?companyMasterID=${userData?.companyMasterID}`,
        //   "participant"
        // );
        getParticipantList();
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
    }
  };
  const handleEditSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const response = await commonService({
        apiEndPoint: PARTICIPANT_MANAGEMENT.updateParticipant,
        bodyData: {
          eMailID: values?.eMailID,
          firstName: values?.firstName,
          lastName: values?.lastName,
          aliasName: values?.aliasName,
          departmentID: values?.departmentID,
          participantID: values?.participantID,
          isReportPermission: values?.isReportPermission,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: "Participant Updated Successfully",
          error: "participant failed",
        },
      });
      if (response?.status) {
        setIsSubmitting(false);
        editparClose();
        resetForm();
        // fetchParticipantOption(
        //   `participant?companyMasterID=${userData?.companyMasterID}`,
        //   "participant"
        // );
        getParticipantList();
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  //  this formik is use for handle file upload.
  const handleFileformik = useFormik({
    initialValues: initValuesFileUpload(),
    validationSchema: validationUploadFilePopup(),
    onSubmit: uploadFile,
  });

  const formik = useFormik({
    initialValues: initValuesAdd(userData?.companyMasterID ?? ""),
    validationSchema: validationParticipantAdd(),
    onSubmit: handleSubmit,
  });
  // update Participant
  const editFormik = useFormik({
    enableReinitialize: true,
    initialValues: initValuesUpdate(selectedParticipant),
    validationSchema: validationParticipantUpdate(),
    onSubmit: handleEditSubmit,
  });

  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Org Structure",
    },

    {
      path: "#",
      name: "Participant Management",
    },
  ];

  // delete Participant
  const deleteParticipant = async (id) => {
    try {
      const response = await commonService({
        apiEndPoint: PARTICIPANT_MANAGEMENT.deleteParticipant,
        bodyData: id,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setIsAlertVisible(false);
        // fetchParticipantOption(
        //   `participant?companyMasterID=${userData?.companyMasterID}`,
        //   "participant"
        // );
        getParticipantList();
      }
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };
  const onConfirmAlertModal = async () => {
    await deleteParticipant({ participantID: selectedParticipant?.userID });
    // setIsAlertVisible(true);
    return true;
  };

  useEffect(() => {
    if (userData !== null) {
      if (userData?.companyMasterID) {
        fetchParticipantOption(
          `company?companyMasterID=${userData?.companyMasterID}`,
          "company"
        );
      }

      if (formik.values.companyID && showAddPar) {
        fetchParticipantOption(
          `department?companyID=${formik.values.companyID}`,
          "department"
        );
      }
    }
  }, [isSubmitting, isAlertVisible]);

  // Column ID mapping for sorting
  const columnIdMap = {
    firstName: 0,
    lastName: 1,
    userName: 2,
    aliasName: 3,
    // roleName: 4,
    companyName: 4,
    departmentName: 5,
    eMailID: 6,
  };

  // This hook is not usefull when we handle search,filter,pagination from api.
  // const {
  //   currentData,
  //   totalRecords,
  //   totalPages,
  //   offset,
  //   limit,
  //   sortState,
  //   setOffset,
  //   setLimit,
  //   handleSort,
  // } = useTable({
  //   searchValue,
  //   searchKeys: [
  //     "aliasName",
  //     "companyName",
  //     "departmentName",
  //     "eMailID",
  //     "firstName",
  //     "lastName",
  //     "roleName",
  //   ],
  //   tableFilters,
  //   initialLimit: 10,
  //   data: participant,
  // });

  const handleLimitChange = (value) => {
    setTableState((prev) => ({
      ...prev,
      length: parseInt(value),
      start: 0, // Reset to first page when changing page size
      draw: prev.draw + 1,
    }));
  };

  // Handle page change
  const handleOffsetChange = (page) => {
    setTableState((prev) => ({
      ...prev,
      start: (page - 1) * prev.length, // Calculate the starting index based on page number
      draw: prev.draw + 1,
    }));
  };
  // Handle Sorting
  const handleSort = (column) => {
    // Toggle direction if clicking same column
    const newDirection =
      tableState.order[0].column === columnIdMap[column]
        ? tableState.order[0].dir === "asc"
          ? "desc"
          : "asc"
        : "asc";

    setSortDirection(newDirection);
    setTableState((prev) => ({
      ...prev,
      order: [
        {
          column: columnIdMap[column] || 0,
          dir: newDirection,
        },
      ],
      draw: prev.draw + 1,
    }));
  };
  // Debounced change handler for managing search optimization.
  const handleSearchChange = debounce((e) => {
    setSearchValue(e.target.value);
    setTableState((prev) => ({
      ...prev,
      start: 0, // Always go back to first page on new search
      draw: prev.draw + 1,
    }));
  }, 500);

  // Fetch data when tableState or searchValue changes
  useEffect(() => {
    if (userData?.companyMasterID) {
      getParticipantList();
    }
  }, [tableState]);

  const column = [
    {
      id: "sno",
      displayName: "S.no",
    },
    {
      displayName: "First Name",
      id: "firstName",
    },
    {
      displayName: "Last Name",
      id: "lastName",
    },
    {
      displayName: "User Name",
      id: "userName",
    },
    {
      displayName: "Alias Name",
      id: "aliasName",
    },
    // {
    //   displayName: "Role",
    //   id: "roleName",
    // },
    {
      displayName: "Company",
      id: "companyName",
    },
    {
      displayName: "Department",
      id: "departmentName",
    },
    {
      displayName: "Email ID",
      id: "eMailID",
    },
  ];
  // Old Code - Gets only paginated data in Excel
  // const filteredData = participant.map((item, index) => {
  //   return {
  //     "s.no": index + 1,
  //     firstName: decodeHtmlEntities(item.firstName),
  //     lastName: decodeHtmlEntities(item.lastName),
  //     userName: decodeHtmlEntities(item.userName),
  //     aliasName: decodeHtmlEntities(item.aliasName),
  //     roleName: decodeHtmlEntities(item.roleName),
  //     eMailID: decodeHtmlEntities(item.eMailID),
  //     departmentName: decodeHtmlEntities(item.departmentName),
  //     companyName: decodeHtmlEntities(item.companyName),
  //   };
  // });

  // data table
  const columns = [
    {
      title: "S.No.",
      dataKey: "s.no",
      // data: "s.no",
      data: (row, index) => tableState.start + index + 1, // Correct S.No. based on pagination
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: "First Name",
      dataKey: "firstName",
      data: "firstName",
      sortable: true,
    },
    {
      title: "Last Name",
      dataKey: "lastName",
      data: "lastName",
      sortable: true,
    },
    {
      title: "User Name",
      dataKey: "userName",
      data: "userName",
      sortable: true,
    },
    {
      title: "Alias Name",
      dataKey: "aliasName",
      data: "aliasName",
      sortable: true,
    },
    // {
    //   title: "Role",
    //   dataKey: "roleName",
    //   data: "roleName",
    //   sortable: true,
    // },
    {
      title: "Company",
      dataKey: "companyName",
      data: "companyName",
      sortable: true,
    },
    {
      title: "Department",
      dataKey: "departmentName",
      data: "departmentName",
      sortable: true,
    },
    {
      title: "Email ID",
      dataKey: "eMailID",
      data: "eMailID",
      sortable: true,
    },
    {
      title: "Action",
      dataKey: "action",
      data: null,
      columnHeaderClassName: "w-1 text-center no-sorting",
      columnClassName: "w-1 text-center",
      render: (data, row) => {
        return (
          <>
            <ul className="list-inline action mb-0">
              <li
                className="list-inline-item tooltip-container"
                data-title="Edit"
              >
                <Link
                  className="icon-primary"
                  onClick={() => {
                    editparShow(row);
                  }}
                >
                  <em className="icon-table-edit" />
                </Link>
              </li>
              <li
                className="list-inline-item tooltip-container"
                data-title="Reset Password"
              >
                <Link
                  className="icon-secondary"
                  onClick={() => {
                    successfullyModal(row);
                  }}
                >
                  <em className="icon-key" />
                </Link>
              </li>
              <li
                className="list-inline-item tooltip-container"
                data-title="Deactivate"
              >
                <Link
                  className="icon-danger"
                  onClick={() => {
                    deleteModal(row?.userID);
                  }}
                >
                  <em className="icon-delete" />
                </Link>
              </li>
            </ul>
          </>
        );
      },
    },
  ];

  const handleCompanySelect = (selectedCompany, isAnonymous = false) => {
    fetchParticipantOption(
      `department?companyID=${selectedCompany?.value}&isAnonymous=${isAnonymous}`,
      "department"
    );
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
          <h2 className="mb-0">Participant Management</h2>
          <Button variant="primary ripple-effect" onClick={addparShow}>
            Add Participant
          </Button>
        </div>
        <div className="filter d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="searchBar">
            <InputField
              type="text"
              placeholder="Search"
              onChange={handleSearchChange}
            />
          </div>
          <ul className="list-inline d-flex flex-wrap filter_action mb-0">
            <li className="list-inline-item">
              <Button
                type="button"
                className="btn btn-light ripple-effect-dark"
                onClick={uploadShow}
              >
                <em className="icon-upload" /> Data Upload
              </Button>
            </li>
            <li
              className="list-inline-item tooltip-container"
              data-title="Download All"
            >
              {/* <CsvDownloader
                  filename="Participant_List" // Rename File
                  extension=".csv"
                  className="btn-icon"
                  columns={column}
                  // datas={filteredData}
                  datas={async () => {
                    const allData = await fetchParticipantDataForCSV();
                    return allData.map((item, index) => ({
                      "s.no": index + 1,
                      firstName: decodeHtmlEntities(item.firstName),
                      lastName: decodeHtmlEntities(item.lastName),
                      userName: decodeHtmlEntities(item.userName),
                      aliasName: decodeHtmlEntities(item.aliasName),
                      roleName: decodeHtmlEntities(item.roleName),
                      eMailID: decodeHtmlEntities(item.eMailID),
                      departmentName: decodeHtmlEntities(item.departmentName),
                      companyName: decodeHtmlEntities(item.companyName),
                    }));
                  }}
                  text={<em className="icon-download" />}
                /> */}
              <ExportExcel
                filename="Participant_List"
                columns={column}
                data={async () => {
                  const allData = await fetchParticipantDataForCSV();
                  return allData.map((item, index) => ({
                    "s.no": index + 1,
                    firstName: decodeHtmlEntities(item.firstName),
                    lastName: decodeHtmlEntities(item.lastName),
                    userName: decodeHtmlEntities(item.userName),
                    aliasName: decodeHtmlEntities(item.aliasName),
                    roleName: decodeHtmlEntities(item.roleName),
                    eMailID: decodeHtmlEntities(item.eMailID),
                    departmentName: decodeHtmlEntities(item.departmentName),
                    companyName: decodeHtmlEntities(item.companyName),
                  }));
                }}
                text={<em className="icon-download" />}
              />
            </li>
          </ul>
        </div>
        <ReactDataTable
          data={participant}
          columns={columns}
          page={Math.floor(tableState.start / tableState.length) + 1}
          totalLength={totalRecords}
          totalPages={Math.ceil(totalRecords / tableState.length)}
          sizePerPage={tableState.length}
          handleLimitChange={handleLimitChange}
          handleOffsetChange={handleOffsetChange}
          searchValue={searchValue}
          handleSort={handleSort}
          sortState={{
            column: Object.keys(columnIdMap).find(
              (key) => columnIdMap[key] === tableState.order[0].column
            ),
            direction: sortDirection,
          }}
          isLoading={tableLoader}
          serverSide
        />
      </div>
      {/* add participant */}
      <ModalComponent
        modalHeader="Add Participant"
        show={showAddPar}
        onHandleCancel={addparClose}
      >
        <Form onSubmit={formik.handleSubmit}>
          <Row className="rowGap">
            <Col lg={6}>
              <Form.Group className="form-group">
                <div className="d-flex align-items-center justify-content-between">
                  <Form.Label>
                    Username<sup>*</sup>
                  </Form.Label>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Enter emailID as username</Tooltip>}
                  >
                    <Link to="#!" data-bs-toggle="tooltip">
                      <em className="icon-info-circle" />
                    </Link>
                  </OverlayTrigger>
                </div>
                <InputField
                  type="email"
                  name="userName"
                  placeholder="User Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.userName && formik.errors.userName ? (
                  <div className="error mt-1 text-danger">
                    {formik.errors.userName}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Email ID<sup>*</sup>
                </Form.Label>
                <InputField
                  type="email"
                  name="eMailID"
                  placeholder="Email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.eMailID && formik.errors.eMailID ? (
                  <div className="error mt-1 text-danger">
                    {formik.errors.eMailID}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  First Name<sup>*</sup>
                </Form.Label>
                <InputField
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.firstName && formik.errors.firstName ? (
                  <div className="error mt-1 text-danger">
                    {formik.errors.firstName}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Last Name<sup>*</sup>
                </Form.Label>
                <InputField
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.lastName && formik.errors.lastName ? (
                  <div className="error mt-1 text-danger">
                    {formik.errors.lastName}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Alias Name<sup>*</sup>
                </Form.Label>
                <InputField
                  type="text"
                  name="aliasName"
                  placeholder="Alias Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.aliasName && formik.errors.aliasName ? (
                  <div className="error mt-1 text-danger">
                    {formik.errors.aliasName}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Master Company<sup>*</sup>
                </Form.Label>
                <SelectField
                  name="companyMasterID"
                  options={masterCompOps}
                  placeholder="Master Company"
                  onChange={(selected) =>
                    formik.setFieldValue(
                      "companyMasterID",
                      selected?.value || ""
                    )
                  }
                  onBlur={formik.handleBlur}
                  value={masterCompOps.find(
                    (option) => option.value === formik.values.companyMasterID
                  )}
                  isDisabled
                />
                {formik.touched.companyMasterID &&
                formik.errors.companyMasterID ? (
                  <div className="error mt-1 text-danger">
                    {formik.errors.companyMasterID}
                  </div>
                ) : null}
              </Form.Group>
            </Col>

            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Company<sup>*</sup>
                </Form.Label>
                <SelectField
                  name="companyID"
                  options={companyOptions}
                  placeholder="Company Name"
                  onChange={(selected) => {
                    formik.setFieldValue("companyID", selected?.value || "");
                    setDepartmentOps([]);
                    formik.setFieldValue("departmentID", "");
                    handleCompanySelect(selected);
                  }}
                  onBlur={formik.handleBlur}
                  value={companyOptions.find(
                    (option) => option.value === formik.values.companyID
                  )}
                />
                {formik.touched.companyID && formik.errors.companyID ? (
                  <div className="error mt-1 text-danger">
                    {formik.errors.companyID}
                  </div>
                ) : null}
              </Form.Group>
            </Col>

            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Department<sup>*</sup>
                </Form.Label>
                <SelectField
                  name="departmentID"
                  options={departmentOps}
                  placeholder="Select Department"
                  onChange={(selected) =>
                    formik.setFieldValue("departmentID", selected?.value || "")
                  }
                  onBlur={formik.handleBlur}
                  value={
                    departmentOps.find(
                      (option) => option.value === formik.values.departmentID
                    ) || null
                  }
                />
                {formik.touched.departmentID && formik.errors.departmentID ? (
                  <div className="error mt-1 text-danger">
                    {formik.errors.departmentID}
                  </div>
                ) : null}
              </Form.Group>
            </Col>

            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Download & Print Reports<sup>*</sup>
                </Form.Label>
                <SelectField
                  name="isReportPermission"
                  options={printOptions}
                  placeholder="Select Report"
                  onChange={(selected) =>
                    formik.setFieldValue("isReportPermission", selected?.value)
                  }
                  onBlur={formik.handleBlur}
                  value={printOptions.find(
                    (option) =>
                      option.value === formik.values.isReportPermission
                  )}
                />
                {formik.touched.isReportPermission &&
                formik.errors.isReportPermission ? (
                  <div className="error mt-1 text-danger">
                    {formik.errors.isReportPermission}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col lg={12}>
              <div className="form-btn d-flex gap-2 justify-content-end">
                <Button
                  variant="secondary"
                  className="ripple-effect"
                  onClick={addparClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  className="ripple-effect"
                >
                  {isSubmitting ? "Adding..." : "Add Participant"}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </ModalComponent>
      {/* edit participant */}
      <ModalComponent
        modalHeader="Edit Participant"
        show={showEditPar}
        onHandleCancel={editparClose}
      >
        <Form onSubmit={editFormik.handleSubmit}>
          <Row className="rowGap">
            <Col lg={6}>
              <Form.Group className="form-group">
                <div className="d-flex align-items-center justify-content-between">
                  <Form.Label>
                    Username<sup>*</sup>
                  </Form.Label>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Enter emailID as username</Tooltip>}
                  >
                    <Link to="#!" data-bs-toggle="tooltip">
                      <em className="icon-info-circle" />
                    </Link>
                  </OverlayTrigger>
                </div>
                <InputField
                  type="text"
                  name="userName"
                  placeholder="User Name"
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  value={editFormik.values.userName}
                  readOnly
                />
                {editFormik.touched.userName && editFormik.errors.userName ? (
                  <div className="error mt-1 text-danger">
                    {editFormik.errors.userName}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Email ID<sup>*</sup>
                </Form.Label>
                <InputField
                  type="email"
                  name="eMailID"
                  placeholder="email ID"
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  value={editFormik.values.eMailID}
                  readOnly
                />
                {editFormik.touched.eMailID && editFormik.errors.eMailID ? (
                  <div className="error mt-1 text-danger">
                    {editFormik.errors.eMailID}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  First Name<sup>*</sup>
                </Form.Label>
                <InputField
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  value={editFormik.values.firstName}
                />
                {editFormik.touched.firstName && editFormik.errors.firstName ? (
                  <div className="error mt-1 text-danger">
                    {editFormik.errors.firstName}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Last Name<sup>*</sup>
                </Form.Label>
                <InputField
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  value={editFormik.values.lastName}
                />
                {editFormik.touched.lastName && editFormik.errors.lastName ? (
                  <div className="error mt-1 text-danger">
                    {editFormik.errors.lastName}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Alias Name<sup>*</sup>
                </Form.Label>
                <InputField
                  type="text"
                  name="aliasName"
                  placeholder="Alias Name"
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  value={editFormik.values.aliasName}
                />
                {editFormik.touched.aliasName && editFormik.errors.aliasName ? (
                  <div className="error mt-1 text-danger">
                    {editFormik.errors.aliasName}
                  </div>
                ) : null}
              </Form.Group>
            </Col>

            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Master Company<sup>*</sup>
                </Form.Label>
                <SelectField
                  name="companyMasterID"
                  options={masterCompOps}
                  placeholder="Master Company"
                  onChange={(selected) =>
                    editFormik.setFieldValue(
                      "companyMasterID",
                      selected?.value || ""
                    )
                  }
                  onBlur={editFormik.handleBlur}
                  value={masterCompOps.find(
                    (option) =>
                      option.value === editFormik.values.companyMasterID
                  )}
                  isDisabled
                />
                {editFormik.touched.companyMasterID &&
                editFormik.errors.companyMasterID ? (
                  <div className="error mt-1 text-danger">
                    {editFormik.errors.companyMasterID}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Company<sup>*</sup>
                </Form.Label>
                <SelectField
                  name="companyID"
                  options={companyOptions}
                  placeholder="Company Name"
                  onChange={(selected) =>
                    editFormik.setFieldValue("companyID", selected?.value || "")
                  }
                  value={companyOptions.find(
                    (option) => option.value === editFormik.values.companyID
                  )}
                  isDisabled
                />
                {editFormik.touched.companyID && editFormik.errors.companyID ? (
                  <div className="error mt-1 text-danger">
                    {editFormik.errors.companyID}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Department<sup>*</sup>
                </Form.Label>
                <SelectField
                  name="departmentID"
                  options={departmentOps}
                  placeholder="Select Department"
                  onChange={(selected) =>
                    editFormik.setFieldValue(
                      "departmentID",
                      selected?.value || ""
                    )
                  }
                  onBlur={editFormik.handleBlur}
                  value={departmentOps.find(
                    (option) =>
                      option.value === Number(editFormik.values.departmentID)
                  )}
                  isDisabled
                />
                {editFormik.touched.departmentID &&
                editFormik.errors.departmentID ? (
                  <div className="error mt-1 text-danger">
                    {editFormik.errors.departmentID}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Download & Print Reports<sup>*</sup>
                </Form.Label>
                <SelectField
                  name="isReportPermission"
                  options={printOptions}
                  placeholder="Select Report"
                  onChange={(selected) =>
                    editFormik.setFieldValue(
                      "isReportPermission",
                      selected?.value
                    )
                  }
                  onBlur={editFormik.handleBlur}
                  value={printOptions.find(
                    (option) =>
                      option.value === editFormik.values.isReportPermission
                  )}
                />
                {editFormik.touched.isReportPermission &&
                editFormik.errors.isReportPermission ? (
                  <div className="error mt-1 text-danger">
                    {editFormik.errors.isReportPermission}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col lg={12}>
              <div className="form-btn d-flex gap-2 justify-content-end">
                <Button
                  variant="secondary"
                  className="ripple-effect"
                  onClick={editparClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  className="ripple-effect"
                >
                  {isSubmitting ? "Update..." : "Update Participant"}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </ModalComponent>

      {/* upload data */}
      <ModalComponent
        modalHeader="Upload Participant From Excel"
        show={showUpload}
        onHandleCancel={uploadClose}
      >
        <div className="text-end" />
        <Form onSubmit={handleFileformik.handleSubmit}>
          <Form.Group className="form-group">
            <div className="d-flex align-item-center justify-content-between">
              <Form.Label className="flew-grow">
                Company<sup>*</sup>
              </Form.Label>
              <Link
                className="link-primary flex-shrink-0 fw-medium"
                onClick={handleDownloadTemplate}
              >
                Download Template
              </Link>
            </div>
            <SelectField
              name="companyID"
              placeholder="Select Company"
              options={companyOptions}
              onChange={(selected) => {
                handleFileformik.setFieldValue("companyID", selected?.value);
              }}
              onBlur={handleFileformik.handleBlur}
            />
            {handleFileformik.touched.companyID &&
            handleFileformik.errors.companyID ? (
              <div className="text-danger">
                {handleFileformik.errors.companyID}
              </div>
            ) : null}
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Label>
              Select Import File<sup>*</sup>
            </Form.Label>
            <InputField
              name="file"
              type="file"
              className="uploadBtn"
              placeholder="Enter Subtitle"
              onChange={(event) => {
                handleFileformik.setFieldValue("file", event.target.files[0]);
              }}
              innerRef={fileInputRef}
              accept=".xlsx"
              onBlur={handleFileformik.handleBlur}
            />
            {handleFileformik.touched.file && handleFileformik.errors.file ? (
              <div className="text-danger">{handleFileformik.errors.file}</div>
            ) : null}
          </Form.Group>
          {uploadedFileName && (
            <div>
              <button
                type="button"
                onClick={() =>
                  downloadErroFile(
                    typeof uploadedFileName === "string"
                      ? uploadedFileName
                      : trim(uploadedFileName?.filePath)
                  )
                }
                style={buttonStyle}
              >
                Download Proccessed File
              </button>
            </div>
          )}
          <div className="text-danger">
            You can download the template in Excel, enter the participant detail
            and mass upload to the database to save time.
          </div>
          <div className="form-btn d-flex gap-2 justify-content-end">
            <Button
              variant="secondary"
              className="ripple-effect"
              onClick={uploadClose}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" className="ripple-effect">
              {isSubmittingUpload ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </Form>
      </ModalComponent>

      <SweetAlert
        title="Are you sure?"
        text="You want to deactivate this User!"
        show={isAlertVisible}
        icon="warning"
        onConfirmAlert={onConfirmAlertModal}
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={setIsAlertVisible}
        isConfirmedTitle="Deactivated!"
        isConfirmedText="Participant has been deactivated."
      />

      <SweetAlert
        title="Are you sure?"
        text="You want to reset the password!"
        show={isPasswordVisible}
        icon="warning"
        onConfirmAlert={confirmPasswordModal}
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={setIsPasswordVisible}
        isConfirmedTitle="Successfully."
        isConfirmedText="Participant reset password was successfully."
      />
    </>
  );
}

export default ParticipantManagement;
