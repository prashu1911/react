import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { commonService } from "services/common.service";
import { decodeHtmlEntities } from "utils/common.util";
import {
  COMPANY_MANAGEMENT,
  DEPARTMENT_MANAGEMENT,
} from "apiEndpoints/OrgStructure/OrgStructure.dashboard";
// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from "lodash.debounce";
import logger from "helpers/logger";
import ExportExcel from "components/Excel";
import {
  initValuesAdd,
  initValuesUpdate,
  validationDepartmentAdd,
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
// import { useTable } from "../../../../customHooks/useTable";

function DepartmentManagement() {
  // user data from custom authentication hook
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  // State hooks to manage UI and data
  const [companyOptions, setCompanyOptions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showAddDep, setShowAddDep] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [showEditDep, setShowEditDep] = useState(false);
  const [departmentData, setDepartmentData] = useState([]);
  const adddepClose = () => {
    // eslint-disable-next-line no-use-before-define
    formik.resetForm();
    setShowAddDep(false);
  };

  const adddepShow = () => setShowAddDep(true);
  const editdepClose = () => {setShowEditDep(false); editFormik.resetForm()};
  const [searchValue, setSearchValue] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  // States to manage server side
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableState, setTableState] = useState({
    draw: 1,
    start: 0,
    length: 10,
    order: [{ column: 0, dir: "asc" }],
  });
  const [tableLoader, setTableLoader] = useState(false);

  /**
   * Open the edit modal with the selected department
   * @param {object} department - selected department
   */
  const openEditModal = (department) => {
    setSelectedDepartment(department);
    setShowEditDep(true);
  };

  /**
   * Open the confirm delete modal with the selected department
   * @param {object} department - selected department
   */
  const deleteModal = (department) => {
    setSelectedDepartment((prev) => ({ ...prev, departmentID: department }));
    // setSelectedDepartment(department);
    setIsAlertVisible(true);
  };

  /**
   * Fetches the departments from the API through the company
   * @param {string} path - API endpoint path
   * @param {string} type - type of data to fetch, either "companyMaster" or "company"
   */
  // const fetchDepartmentsCompanies = async (path, type) => {
  //   const response = await commonService({
  //     apiEndPoint: DEPARTMENT_MANAGEMENT.departmentThroughCompany(path),
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${userData?.apiToken}`,
  //     },
  //     toastType: {
  //       success: "Get department through company",
  //       error: "get failed",
  //     },
  //   });

  //   if (response?.status) {
  //     if (type === "companyMaster") {
  //       setDepartments(Object.values(response?.data?.data));
  //     }
  //   }
  // };
  // Function to populate data for CSV download

  //  useEffect(() => {
  //     const fetchData = async () => {
  //       const data = await fetchDepartmentDataForCSV();
  //       setDepartmentData(data); // Set the state here
  //     };

  //     fetchData();
  // }, [userData?.companyMasterID, userData?.apiToken]);
  const fetchDepartmentDataForCSV = async () => {
    try {
      const queryString = `companyMasterID=${userData?.companyMasterID}`;
      const response = await commonService({
        apiEndPoint: DEPARTMENT_MANAGEMENT.departmentThroughCompany(queryString),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        return Object.values(response?.data?.data || []);
      } else {
        return [];
      }
    } catch (error) {
      logger(error);
      return [];
    }
  };

  // Function to get server side department list
  const getDepartmentList = async () => {
    if (!userData.companyMasterID) return;

    setTableLoader(true);
    try {
      const response = await commonService({
        apiEndPoint: DEPARTMENT_MANAGEMENT.getDepartmentServerSide,
        bodyData: {
          companyMasterID: userData.companyMasterID,
          search: { value: searchValue || "", regex: false },
          ...tableState,
          isExport: false
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        setDepartments(response.data.data || []);
        // setTotalRecords(response?.data?.recordsTotal || response?.data?.recordsFiltered || 0);
        // Fixed count handling
        setTotalRecords(
          searchValue
            ? response.data.recordsFiltered ?? 0
            : response.data.recordsTotal ?? 0
        );
      }
    } catch (error) {
      logger(error);
    } finally {
      setTableLoader(false);
    }
  };

  const fetchCompanies = async (companyMasterID) => {
    const response = await commonService({
      apiEndPoint: COMPANY_MANAGEMENT.getCompany(
        `companyMasterID=${companyMasterID}`
      ),
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
      const options = Object?.values(response?.data?.data)?.map((company) => ({
        value: company?.companyID,
        label: company?.companyName,
      }));
      setCompanyOptions(options);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const response = await commonService({
        apiEndPoint: DEPARTMENT_MANAGEMENT.createDepartment,
        bodyData: values,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: "Department Created Successfully",
          error: "department failed",
        },
      });
      if (response?.status) {
        setIsSubmitting(false);
        adddepClose();
        resetForm();
        fetchCompanies(userData?.companyMasterID);
        getDepartmentList()
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
        apiEndPoint: DEPARTMENT_MANAGEMENT.updateDepartment,
        bodyData: {
          departmentID: selectedDepartment?.departmentID,
          departmentName: values?.departmentName,
          isAnonymous: values?.isAnonymous,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: "Department Updated Successfully",
          error: "department failed",
        },
      });
      if (response?.status) {
        setIsSubmitting(false);
        editdepClose();
        resetForm();
        // fetchCompanies(userData?.companyMasterID);
        getDepartmentList();
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  // Add Department
  const formik = useFormik({
    initialValues: initValuesAdd(),
    validationSchema: validationDepartmentAdd(),
    onSubmit: handleSubmit,
  });

  // update Department
  const editFormik = useFormik({
    enableReinitialize: true,
    initialValues: initValuesUpdate(selectedDepartment),
    validationSchema: validationDepartmentAdd(),
    onSubmit: handleEditSubmit,
  });

  // delete Department
  const deleteDepartment = async (id) => {
    try {
      const response = await commonService({
        apiEndPoint: DEPARTMENT_MANAGEMENT.deleteDepartment,
        bodyData: id,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setIsAlertVisible(false);
        // fetchCompanies(userData?.companyMasterID);
        getDepartmentList();
        return true;
      }else{
         return false;
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      return false;
    }
  };

  const onConfirmAlertModal = async () => {
    const val = await deleteDepartment({ departmentID: selectedDepartment?.departmentID });
    return val;
  };

  useEffect(() => {
    if (userData !== null) {
      if (userData?.companyMasterID !== null) {
        fetchCompanies(userData?.companyMasterID);
        // fetchDepartmentsCompanies(
        //   `companyMasterID=${userData?.companyMasterID}`,
        //   "companyMaster"
        // );
     
      }
    }
  }, []);

  // Column ID mapping for sorting
  const columnIdMap = {
    departmentName: 0,
    companyName: 1
  };

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
        getDepartmentList();
      }
    }, [tableState]);

  const column = [
    {
      id: "sno",
      displayName: "S.No.",
    },
    {
      id: "departmentName",
      displayName: "Department Name",
    },
    {
      id: "companyName",
      displayName: "Company Name",
    },
  ];
  // Old Code - Gets only paginated data in Excel
  // const filteredData = departments.map((item, index) => {
  //   return {
  //     companyID: index ? index + 1 : 1,
  //     departmentName: decodeHtmlEntities(item.departmentName),
  //     companyName: decodeHtmlEntities(item.companyName),
  //   };
  // });

  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Org Structure",
    },

    {
      path: "#",
      name: "Department Management",
    },
  ];

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
      title: "Department Name",
      dataKey: "departmentName",
      data: "departmentName",
      sortable: true,
      render: (cellContent) => <span>{cellContent}</span>, // No limit for dept. name characters
    },
    {
      title: "Company Name",
      dataKey: "companyName",
      data: "companyName",
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
                <Link
                  className="icon-primary"
                  onClick={() => {
                    openEditModal(row);
                  }}
                >
                  <em className="icon-table-edit" />
                </Link>
              </li>
              <li className="list-inline-item tooltip-container" data-title="Delete">
                <Link
                  className="icon-danger"
                  onClick={() => {
                    deleteModal(row?.departmentID);
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
          <h2 className="mb-0">Department Management</h2>
          <Button variant="primary ripple-effect" onClick={adddepShow}>
            Add Department
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
          <li className="list-inline-item tooltip-container" data-title="Download All">
                {/* <CsvDownloader
                  filename="Department_List"
                  extension=".csv"
                  className="btn-icon"
                  columns={column}
                  // datas={filteredData}
                  datas={async () => {
                    const allData = await fetchDepartmentDataForCSV();
                    return allData.map((item, index) => ({
                      companyID: index + 1,
                      departmentName: decodeHtmlEntities(item.departmentName),
                      companyName: decodeHtmlEntities(item.companyName),
                    }));
                  }}
                  text={<em className="icon-download" />}
                /> */}
                <ExportExcel filename="Department_List" 
                columns={column} 
                data={async () => {
                  const allData = await fetchDepartmentDataForCSV();
                  return allData.map((item, index) => ({
                    companyID: index + 1,
                    departmentName: decodeHtmlEntities(item.departmentName),
                    companyName: decodeHtmlEntities(item.companyName),
                  }));
                }}
                text={<em className="icon-download" 
                />}/>
            </li>
          </ul>
        </div>
                 <ReactDataTable
                  data={departments}
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
                      key => columnIdMap[key] === tableState.order[0].column
                    ),
                    direction: sortDirection,
                  }}
                  isLoading={tableLoader}
                  serverSide
                />
      </div>
      {/* add department */}
      <ModalComponent
        modalHeader="Add Department"
        show={showAddDep}
        onHandleCancel={adddepClose}
      >
        <Form onSubmit={formik.handleSubmit}>
          <Row className="rowGap">
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Company Name <sup>*</sup>
                </Form.Label>
                <SelectField
                  name="companyID"
                  options={companyOptions}
                  placeholder="Company Name"
                  onChange={(selected) =>
                    formik.setFieldValue("companyID", selected?.value || "")
                  } // Corrected field
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
                  Department Name<sup>*</sup>
                </Form.Label>
                <InputField
                  type="text"
                  name="departmentName"
                  placeholder="Department Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.departmentName &&
                formik.errors.departmentName ? (
                  <div className="error mt-1 text-danger">
                    {formik.errors.departmentName}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
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
                  disabled={isSubmitting}
                  className="ripple-effect"
                >
                  {isSubmitting ? "Adding..." : "Add Department"}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </ModalComponent>

      {/* edit department */}
      <ModalComponent
        modalHeader="Edit Department"
        show={showEditDep}
        onHandleCancel={editdepClose}
      >
        <Form onSubmit={editFormik.handleSubmit}>
          <Row className="rowGap">
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Company Name<sup>*</sup>
                </Form.Label>
                <SelectField
                  name="companyID"
                  options={companyOptions}
                  placeholder="Select Company"
                  onChange={(option) =>
                    editFormik.setFieldValue("companyId", option.value)
                  }
                  value={companyOptions.find(
                    (option) => option.value === editFormik.values.companyID
                  )}
                  isDisabled
                />
                {editFormik.touched.companyID &&
                  editFormik.errors.companyID && (
                    <div className="error mt-1 text-danger">
                      {editFormik.errors.companyID}
                    </div>
                  )}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Department Name<sup>*</sup>
                </Form.Label>
                <InputField
                  type="text"
                  name="departmentName"
                  placeholder="Department Name"
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  value={editFormik.values.departmentName}
                />
                {editFormik.touched.departmentName &&
                  editFormik.errors.departmentName && (
                    <div className="error mt-1 text-danger">
                      {editFormik.errors.departmentName}
                    </div>
                  )}
              </Form.Group>
            </Col>
            <Col>
              <div className="form-btn d-flex gap-2 justify-content-end">
                <Button variant="secondary" onClick={editdepClose}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Department"}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </ModalComponent>

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
        isConfirmedText="Department has been deleted."
        otherErrDisplayMode = {true}
      />
    </>
  );
}

export default DepartmentManagement;
