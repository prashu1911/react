import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Col, Form, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { useFormik } from "formik";
import CsvDownloader from "react-csv-downloader";
import { COMMANAPI } from "apiEndpoints/OrgStructure/OrgStructure.dashboard";
import { decodeHtmlEntities } from "utils/common.util";
import { commonService } from "services/common.service";
import { ADMIN_MANAGEMENT } from "apiEndpoints/AdminManagement/adminManagement";
// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from "lodash.debounce";
import ExportExcel from "components/Excel";
import {
  initValuesAdd,
  initValuesUpdate,
  validationAdminManageAdd,
  validationAdminManageUpdate,
} from "./validation";
import {
  Button,
  InputField,
  SweetAlert,
  SelectField,
  Breadcrumb,
  ModalComponent,
  ReactDataTable,
} from "../../../components";
import useAuth from "../../../customHooks/useAuth/index";
import { useTable } from "../../../customHooks/useTable/index";

function AdminManagement() {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [showAddDep, setShowAddDep] = useState(false);
  const adddepClose = () => {
    // eslint-disable-next-line no-use-before-define
    formikAdd.resetForm();
    setShowAddDep(false);
  };

  const adddepShow = () => setShowAddDep(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addAction, setAddAction] = useState(false);
  const [updateAction, setUpdateAction] = useState(false);
  const [masterCompanyOps] = useState([
    {
      label: userData?.companyMasterName,
      value: userData?.companyMasterID,
    },
  ]);
  const [adminManagementData, setAdminManagementData] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showEditDep, setShowEditDep] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isAlertVisible2, setIsAlertVisible2] = useState(false);
  const [tragetReset, setTaragetReset] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [tableFilters] = useState({});
  const [isTableLoading, setIsLoading] = useState(true);
  const [sortDirection, setSortDirection] = useState("asc");
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableState, setTableState] = useState({
    draw: 1,
    start: 0,
    length: 10,
    order: [{ column: 0, dir: "asc" }],
  });
  const restictActionTo = [
    "Company Admin",
    "Company Support User",
    "Company Analyst",
    "Client User Access",
  ];
  const otherErrDisplayMode = true;
  const printOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];
  const editdepClose = () => {
    setShowEditDep(false);
    setIsSubmitting(false);
  };
  const editdepShow = (row) => {
    setSelectedAdmin(row);
    setShowEditDep(true);
  };

  const deleteModal = (id) => {
    setSelectedAdmin((prev) => ({ ...prev, userID: id }));
    setIsAlertVisible(true);
  };

  const disableAction = restictActionTo.includes(userData.roleName);

  const handleResetPassward = async () => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.resetAdmin,
        bodyData: {
          adminID: parseInt(tragetReset?.userID),
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        isToast: false,
        toastType: {
          success: "Update Admin Successfully",
          error: "admin failed",
        },
      });
      if (response?.status) {
        fetchParticipantOption(
          `admin?companyMasterID=${userData?.companyMasterID}`,
          "admin"
        );
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const onConfirmAlertModal2 = async () => {
    const result = await handleResetPassward();
    return result;
  };

  const resetModal = (row) => {
    setTaragetReset(row);
    setIsAlertVisible2(true);
  };

  const handleDownloadAdmin = async () => {
    if (userData.companyMasterID) {
      const response = await commonService({
        apiEndPoint: COMMANAPI.getAdminsServerSide,
        // apiEndPoint: COMMANAPI.getAdminsServerSide(path),
        bodyData: {
          companyMasterID: userData.companyMasterID,
          search: {
            value: searchValue || "",
            regex: false,
          },
          ...tableState,
          isExport: true,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        isToast: false,
        toastType: {
          success: "Get department through company",
          error: "get failed",
        },
      });
      if (response.status) {
        if (
          Array.isArray(response?.data?.data) &&
          response?.data?.data?.length > 0
        ) {
          return response?.data?.data.map((item, index) => {
            return {
              departmentID: index ? index + 1 : 1,
              firstName: decodeHtmlEntities(item.firstName),
              lastName: decodeHtmlEntities(item.lastName),
              userName: decodeHtmlEntities(item.userName),
              aliasName: decodeHtmlEntities(item.aliasName),
              roleName: decodeHtmlEntities(item.roleName),
              eMailID: decodeHtmlEntities(item.eMailID),
              departmentName: decodeHtmlEntities(item.departmentName),
              companyName: decodeHtmlEntities(item.companyName),
            };
          });
        }
      }
    }
  };

  const fetchParticipantOption = async (path, type) => {
    setIsLoading(true);
    const response = await commonService({
      apiEndPoint:
        type === "admin"
          ? COMMANAPI.getAdminsServerSide
          : COMMANAPI.getComman(path),
      // apiEndPoint: COMMANAPI.getAdminsServerSide(path),
      bodyData: {
        companyMasterID: userData.companyMasterID,
        search: {
          value: searchValue || "",
          regex: false,
        },
        ...tableState,
        isExport: false,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
      isToast: false,
      toastType: {
        success: "Get department through company",
        error: "get failed",
      },
    });
    if (response.status) {
      if (type === "admin") {
        setAdminManagementData(Object?.values(response?.data?.data));
        setTotalRecords(
          searchValue
            ? response.data.recordsFiltered ?? 0
            : response.data.recordsTotal ?? 0
        );
      }

      if (type === "company") {
        const options = Object?.values(response?.data?.data)?.map(
          (company) => ({
            value: company?.companyID,
            label: company?.companyName,
          })
        );
        setCompanyOptions(options);
      }

      if (type === "role") {
        const options = Object?.values(response?.data?.data)?.map((role) => ({
          value: role?.roleID,
          label: role?.roleName,
        }));
        setRoleOptions(options);
      }
    }
    setTimeout(() => setIsLoading(false), 1000);
  };
  const handleSubmitAdd = async (values, { resetForm }) => {
    setAddAction(true);
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.createAdmin,
        bodyData: values,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: "Admin Created Successfully",
          error: "admin failed",
        },
      });
      if (response?.status) {
        setAddAction(false);
        adddepClose();
        resetForm();
        fetchParticipantOption(
          `admin?companyMasterID=${userData?.companyMasterID}`,
          "admin"
        );
      } else {
        setAddAction(false);
      }
    } catch (error) {
      setAddAction(false);
    }
  };

  const handleSubmitEdit = async (values, { resetForm }) => {
    setUpdateAction(true);
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.updateAdmin,
        bodyData: {
          adminID: values?.adminID
            ? parseInt(values?.adminID)
            : values?.adminID,
          companyMasterID: parseInt(values?.companyMasterID),
          companyID: parseInt(values?.companyID),
          roleID: parseInt(values?.roleID),
          eMailID: values?.eMailID,
          firstName: values?.firstName,
          lastName: values?.lastName,
          aliasName: values?.aliasName,
          isViewAlias: values?.isViewAlias,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        isToast: true,
        toastType: {
          success: "Update Admin Successfully",
          error: "admin failed",
        },
      });

      if (response?.data?.status === "success") {
        setAddAction(false);
        editdepClose();
        resetForm();
        fetchParticipantOption(
          `admin?companyMasterID=${userData?.companyMasterID}`,
          "admin"
        );
        setUpdateAction(false);
      } else {
        setUpdateAction(false);
      }
    } catch (error) {
      setAddAction(false);
    }
  };

  // Initialize Formik for Add Admin Management form handling
  const formikAdd = useFormik({
    initialValues: initValuesAdd(userData?.companyMasterID ?? ""),
    validationSchema: validationAdminManageAdd(),
    onSubmit: handleSubmitAdd,
  });

  // Initialize Formik for Admin Management form handling
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initValuesUpdate(selectedAdmin),
    validationSchema: validationAdminManageUpdate(),
    onSubmit: handleSubmitEdit,
  });

  const deleteAdmin = async (id) => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.deleteAdmin,
        bodyData: id,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setIsAlertVisible(false);
        fetchParticipantOption(
          `admin?companyMasterID=${userData?.companyMasterID}`,
          "admin"
        );
      }
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };
  const onConfirmAlertModal = async () => {
    await deleteAdmin({ adminID: parseInt(selectedAdmin?.userID) });
    setIsAlertVisible(false);

    return true;
  };
  useEffect(() => {
    let getData = userData;
    if (getData !== null) {
      if (getData?.companyMasterID) {
        fetchParticipantOption(
          `company?companyMasterID=${getData?.companyMasterID}`,
          "company"
        );
      }

      fetchParticipantOption(`role`, "role");
    }
  }, [isSubmitting]);
  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Admin Management",
    },
  ];

  // This hook is not usefull when we handle search,filter,pagination from api.
  const {
    currentData,
    // totalRecords,
    totalPages,
    offset,
    limit,
    sortState,
    setOffset,
    setLimit,
    // handleSort,
  } = useTable({
    searchValue,
    searchKeys: [
      "aliasName",
      "companyName",
      "eMailID",
      "firstName",
      "roleName",
      "userName",
    ],
    tableFilters,
    initialLimit: 10,
    data: adminManagementData,
  });

  const handleLimitChange = (value) => {
    setTableState((prev) => ({
      ...prev,
      length: parseInt(value),
      start: 0, // Reset to first page when changing page size
      draw: prev.draw + 1,
    }));
  };

  const handleOffsetChange = (page) => {
    setTableState((prev) => ({
      ...prev,
      start: (page - 1) * prev.length, // Calculate the starting index based on page number
      draw: prev.draw + 1,
    }));
  };

  // Debounced change handler for managing search optimization.
  // const handleSearchChange = debounce((e) => {
  //   const value = e.target.value;
  // setSearchValue(value);
  // fetchParticipantOption(value, 'admin');
  // }, 500);

  useEffect(() => {
    if (searchValue || searchValue === "") {
      const timeout = setTimeout(() => {
        fetchParticipantOption("a", "admin");
      }, 500); // debounce manually

      return () => clearTimeout(timeout);
    }
  }, [searchValue]); // whenever searchValue changes

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value); // this alone is enough
    setTableState((prev) => ({
      ...prev,
      start: 0, // Always go back to first page on new search
      draw: prev.draw + 1,
    }));
  };

  const column = [
    {
      id: "departmentID",
      displayName: "S.No.",
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
    {
      displayName: "Role",
      id: "roleName",
    },
    {
      displayName: "Company",
      id: "companyName",
    },
    {
      displayName: "Email ID",
      id: "eMailID",
    },
  ];

  // Column ID mapping for sorting
  const columnIdMap = {
    firstName: 0,
    lastName: 1,
    userName: 2,
    aliasName: 3,
    roleName: 4,
    companyName: 5,
    eMailID: 6,
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

  useEffect(() => {
    fetchParticipantOption("a", "admin");
  }, [tableState]);

  const filteredData = adminManagementData.map((item, index) => {
    return {
      departmentID: index ? index + 1 : 1,
      firstName: decodeHtmlEntities(item.firstName),
      lastName: decodeHtmlEntities(item.lastName),
      userName: decodeHtmlEntities(item.userName),
      aliasName: decodeHtmlEntities(item.aliasName),
      roleName: decodeHtmlEntities(item.roleName),
      eMailID: decodeHtmlEntities(item.eMailID),
      departmentName: decodeHtmlEntities(item.departmentName),
      companyName: decodeHtmlEntities(item.companyName),
    };
  });

  // data table
  const columns = [
    {
      title: "S.No.",
      dataKey: "s.no",
      data: "s.no",
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: "First Name",
      dataKey: "firstName",
      data: "firstName",
      columnHeaderClassName: "pe-30",
      sortable: true,
    },
    {
      title: "Last Name",
      data: "lastName",
      dataKey: "lastName",
      sortable: true,
    },
    {
      title: "User Name",
      data: "userName",
      dataKey: "userName",
      sortable: true,
    },
    {
      title: "Alias Name",
      data: "aliasName",
      dataKey: "aliasName",
      sortable: true,
    },
    {
      title: "Role",
      data: "roleName",
      dataKey: "roleName",
      sortable: true,
    },
    {
      title: "Company",
      data: "companyName",
      dataKey: "companyName",
      sortable: true,
    },
    {
      title: "Email Id",
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
              <li className="list-inline-item tooltip-container" data-title="Edit">
                {disableAction ? (
                  <span className="icon-light">
                    <em className="icon-table-edit" style={{fontSize:'20px'}}/>
                  </span>
                ) : (
                  <Link
                    className="icon-primary"
                    onClick={() => {
                      editdepShow(row);
                    }}
                  >
                    <em className="icon-table-edit" />
                  </Link>
                )}
              </li>
              <li className="list-inline-item tooltip-container" data-title="Reset Password">
                <Link
                  className="icon-secondary"
                  onClick={() => {
                    resetModal(row);
                  }}
                >
                  <em className="icon-key" />
                </Link>
              </li>
              <li className="list-inline-item tooltip-container " data-title="Delete">
                {disableAction ? (
                  <span className="icon-light">
                    <em className="icon-delete" style={{fontSize:'20px'}} />
                  </span>
                ) : (
                  <Link
                    className="icon-danger"
                    onClick={() => {
                      deleteModal(row?.userID);
                    }}
                  >
                    <em className="icon-delete" />
                  </Link>
                )}
              </li>
            </ul>
          </>
        );
      },
    },
  ];

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
          <h2 className="mb-0">Admin Management</h2>
          <Button
            variant="primary ripple-effect"
            onClick={adddepShow}
            disabled={disableAction}
          >
            Add Admin
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
          <ul className="list-inline filter_action mb-0">
            <li
              className="list-inline-item tooltip-container"
              data-title="Download All"
            >
              <Link className="btn-icon  check-button">
                {/* <CsvDownloader
                  filename="admin_management"
                  className="btn-icon"
                  extension=".csv"
                  columns={column}
                  datas={filteredData}
                  text={<em className="icon-download" />}
                /> */}
                <ExportExcel
                  filename="Admin_List"
                  columns={column}
                  data={handleDownloadAdmin}
                  text={<em className="icon-download" />}
                />
              </Link>
            </li>
          </ul>
        </div>
        <ReactDataTable
          data={adminManagementData}
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
          isLoading={isTableLoading}
        />
      </div>
      {/* add department */}
      <ModalComponent
        modalHeader="Add Admin"
        show={showAddDep}
        onHandleCancel={adddepClose}
      >
        <Form onSubmit={formikAdd.handleSubmit}>
          <Row className="rowGap">
            <Col lg={6}>
              <Form.Group className="form-group">
                <div className="d-flex align-items-center justify-content-between">
                  <Form.Label>
                    User Name<sup>* </sup>
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
                  placeholder="Enter User Name"
                  onChange={formikAdd.handleChange}
                  onBlur={formikAdd.handleBlur}
                />
                {formikAdd.touched.userName && formikAdd.errors.userName ? (
                  <div className="error mt-1 text-danger">
                    {formikAdd.errors.userName}
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
                  placeholder="Enter First Name"
                  onChange={formikAdd.handleChange}
                  onBlur={formikAdd.handleBlur}
                />
                {formikAdd.touched.firstName && formikAdd.errors.firstName ? (
                  <div className="error mt-1 text-danger">
                    {formikAdd.errors.firstName}
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
                  placeholder="Enter Last Name"
                  onChange={formikAdd.handleChange}
                  onBlur={formikAdd.handleBlur}
                />
                {formikAdd.touched.lastName && formikAdd.errors.lastName ? (
                  <div className="error mt-1 text-danger">
                    {formikAdd.errors.lastName}
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
                  placeholder="Enter Alias Name"
                  onChange={formikAdd.handleChange}
                  onBlur={formikAdd.handleBlur}
                />
                {formikAdd.touched.aliasName && formikAdd.errors.aliasName ? (
                  <div className="error mt-1 text-danger">
                    {formikAdd.errors.aliasName}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Email Id <sup>*</sup>
                </Form.Label>
                <InputField
                  type="email"
                  name="eMailID"
                  placeholder="Enter Email Id"
                  onChange={formikAdd.handleChange}
                  onBlur={formikAdd.handleBlur}
                />
                {formikAdd.touched.eMailID && formikAdd.errors.eMailID ? (
                  <div className="error mt-1 text-danger">
                    {formikAdd.errors.eMailID}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Role<sup>*</sup>
                </Form.Label>
                <SelectField
                  name="roleID"
                  options={roleOptions}
                  placeholder="Select Role"
                  onChange={(selected) =>
                    formikAdd.setFieldValue("roleID", selected?.value || "")
                  } // Corrected field
                  onBlur={formikAdd.handleBlur}
                  value={roleOptions?.find(
                    (option) =>
                      option?.value === Number(formikAdd.values.roleID)
                  )}
                />
                {formikAdd.touched.roleID && formikAdd.errors.roleID ? (
                  <div className="error mt-1 text-danger">
                    {formikAdd.errors.roleID}
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
                  options={masterCompanyOps}
                  placeholder="Enter Master Company"
                  onChange={(selected) =>
                    formikAdd.setFieldValue(
                      "companyMasterID",
                      selected?.value || ""
                    )
                  }
                  onBlur={formikAdd.handleBlur}
                  value={masterCompanyOps.find(
                    (option) =>
                      option.value === Number(formikAdd.values.companyMasterID)
                  )}
                  isDisabled
                />
                {formikAdd.touched.companyMasterID &&
                formikAdd.errors.companyMasterID ? (
                  <div className="error mt-1 text-danger">
                    {formikAdd.errors.companyMasterID}
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
                  placeholder="Select Company"
                  onChange={(selected) =>
                    formikAdd.setFieldValue("companyID", selected?.value || "")
                  }
                  onBlur={formikAdd.handleBlur}
                  value={companyOptions.find(
                    (option) => option.value === formikAdd.values.companyID
                  )}
                />
                {formikAdd.touched.companyID && formikAdd.errors.companyID ? (
                  <div className="error mt-1 text-danger">
                    {formikAdd.errors.companyID}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  View Alias Only<sup>*</sup>
                </Form.Label>
                <SelectField
                  name="isViewAlias"
                  options={printOptions}
                  placeholder="Select Report"
                  onChange={(selected) =>
                    formikAdd.setFieldValue(
                      "isViewAlias",
                      selected?.value ?? false
                    )
                  }
                  onBlur={formikAdd.handleBlur}
                  value={printOptions.find(
                    (option) => option.value === formikAdd.values.isViewAlias
                  )}
                />
                {/* {formik.errors.isViewAlias ? (
                  <div className="error mt-1 text-danger">
                    {formik.errors.isViewAlias}
                  </div>
                ) : null} */}
              </Form.Group>
            </Col>
          </Row>
          <Col>
            <div className="form-btn d-flex gap-2 justify-content-end">
              <Button
                variant="secondary"
                className="ripple-effect"
                onClick={adddepClose}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={addAction}
                className="ripple-effect"
              >
                {addAction ? "Adding..." : "Add"}
              </Button>
            </div>
          </Col>
        </Form>
      </ModalComponent>

      {/* edit department */}
      <ModalComponent
        modalHeader="Edit Admin"
        show={showEditDep}
        onHandleCancel={editdepClose}
      >
        <Form onSubmit={formik.handleSubmit}>
          <Row className="rowGap">
            <Col lg={6}>
              <Form.Group className="form-group">
                <div className="d-flex align-items-center justify-content-between">
                  <Form.Label>
                    User Name<sup>* </sup>
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
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.userName}
                  readOnly
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
                  First Name<sup>*</sup>
                </Form.Label>
                <InputField
                  type="text"
                  name="firstName"
                  placeholder="User Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
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
                  placeholder="Enter Last Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
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
                  Alias Name <sup>*</sup>
                </Form.Label>
                <InputField
                  type="text"
                  name="aliasName"
                  placeholder="Enter Alias Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.aliasName}
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
                  Email Id <sup>*</sup>
                </Form.Label>
                <InputField
                  type="text"
                  name="eMailID"
                  placeholder="Enter Email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.eMailID}
                  readOnly
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
                  Role<sup>*</sup>
                </Form.Label>
                <SelectField
                  name="roleID"
                  options={roleOptions}
                  placeholder="Master Company"
                  onChange={(selected) =>
                    formik.setFieldValue("roleID", selected?.value || "")
                  } // Corrected field
                  onBlur={formik.handleBlur}
                  value={roleOptions?.find(
                    (option) => option?.value === Number(formik.values.roleID)
                  )}
                />
                {formik.errors.roleID && (
                  <div className="error mt-1 text-danger">
                    {formik.errors.roleID}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Master Company <sup>*</sup>
                </Form.Label>
                <SelectField
                  name="companyMasterID"
                  options={masterCompanyOps}
                  placeholder="Master Company"
                  onChange={(selected) =>
                    formik.setFieldValue(
                      "companyMasterID",
                      selected?.value || ""
                    )
                  } // Corrected field
                  onBlur={formik.handleBlur}
                  value={masterCompanyOps.find(
                    (option) =>
                      option.value === Number(formik.values.companyMasterID)
                  )}
                  isDisabled
                />
                {formik.errors.companyMasterID && (
                  <div className="error mt-1 text-danger">
                    {formik.errors.companyMasterID}
                  </div>
                )}
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
                    formik.setFieldValue("companyID", selected?.value || "")
                  }
                  value={companyOptions.find(
                    (option) => option.value == formik.values.companyID
                  )}
                  isDisabled
                />
                {formik.errors.companyID && (
                  <div className="error mt-1 text-danger">
                    {formik.errors.companyID}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  View Alias Only<sup>*</sup>
                </Form.Label>
                <SelectField
                  name="isViewAlias"
                  options={printOptions}
                  placeholder="Select Report"
                  onChange={(selected) =>
                    formik.setFieldValue(
                      "isViewAlias",
                      selected?.value ?? false
                    )
                  }
                  onBlur={formik.handleBlur}
                  value={printOptions.find(
                    (option) => option.value === formik.values.isViewAlias
                  )}
                />
                {/* {formik.errors.isViewAlias ? (
                  <div className="error mt-1 text-danger">
                    {formik.errors.isViewAlias}
                  </div>
                ) : null} */}
              </Form.Group>
            </Col>
            <Col xs={12}>
              <div className="form-btn d-flex gap-2 justify-content-end">
                <Button
                  variant="secondary"
                  className="ripple-effect"
                  onClick={editdepClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={updateAction}
                  className="ripple-effect"
                >
                  {updateAction ? "Update..." : "Update Admin"}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </ModalComponent>

      <SweetAlert
        title="Are you sure?"
        text="You won't be able to revert this"
        show={isAlertVisible}
        icon="warning"
        onConfirmAlert={onConfirmAlertModal}
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={setIsAlertVisible}
        isConfirmedTitle="Deleted!"
        isConfirmedText="admin Deleted Successfully"
        otherErrDisplayMode={otherErrDisplayMode}
      />

      <SweetAlert
        title="Are you sure?"
        text="You want to reset the password"
        show={isAlertVisible2}
        icon="warning"
        onConfirmAlert={onConfirmAlertModal2}
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={setIsAlertVisible2}
        isConfirmedTitle="Successfully!"
        isConfirmedText="User password reset was successful.!"
        otherErrDisplayMode={otherErrDisplayMode}
      />
    </>
  );
}

export default AdminManagement;
