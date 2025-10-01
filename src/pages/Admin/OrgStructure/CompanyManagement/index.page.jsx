/* eslint-disable no-template-curly-in-string */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { commonService } from "services/common.service";
import { COMPANY_MANAGEMENT } from "apiEndpoints/OrgStructure/OrgStructure.dashboard";
import { decodeHtmlEntities } from "utils/common.util";
// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from "lodash.debounce";
import logger from "helpers/logger";
import ExportExcel from "components/Excel";
import {
  Button,
  InputField,
  SweetAlert,
  SelectField,
  Breadcrumb,
  ReactDataTable,
  ModalComponent,
} from "../../../../components";
import {
  validationCompanyAdd,
  initValuesAdd,
  validationCompanyUpdate,
  initValuesUpdate,
} from "./validation";
import useAuth from "../../../../customHooks/useAuth/index";
import Swal from "sweetalert2";
// import { useTable } from "../../../../customHooks/useTable";

function CompanyManagement() {
  // Importing user data from custom authentication hook
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const otherErrDisplayMode = true;

  // State hooks to manage UI and data
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [timezoneOptions, setTimezoneOptions] = useState([]);
  const [companyManagementData, setCompanyManagementData] = useState([]);
  const [showEditCompany, setShowEditCompany] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [companyData, setCompanyData] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showMoreData, setShowMoreData] = useState("");
  // States to manage server side
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableState, setTableState] = useState({
    draw: 1,
    start: 0,
    length: 10,
    order: [{ column: 0, dir: "asc" }],
  });
  const [tableLoader, setTableLoader] = useState(false);

  const addCompanyShow = () => setShowAddCompany(true);

  const editCompanyShow = (company) => {
    setSelectedCompany(company); // Ensure company has all required data fields
    setShowEditCompany(true);
  };

  const handleShowMore = (htmlContent) => {
    setShowMoreData(htmlContent);
    setShowMore(!!htmlContent);
  };

  const deleteModal = (companyID) => {
    setSelectedCompany((prev) => ({ ...prev, companyID })); // Validation: Ensure companyID is not null
    setIsAlertVisible(true);
  };
  // Old Code - UI side datatable processing
  // Fetch companies from API
  // const fetchCompanies = async (companyMasterID) => {
  //   try {
  //     const response = await commonService({
  //       apiEndPoint: COMPANY_MANAGEMENT.getCompany(
  //         `companyMasterID=${companyMasterID}`
  //       ),
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${userData?.apiToken}`, // Validate userData before usage
  //       },
  //     });
  //     if (response?.status) {
  //       let testData = Object.values(response?.data?.data || [])
  //       setCompanyManagementData(testData);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching companies:", error); // Handle error scenarios
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCompanyDataForCSV();
      setCompanyData(data); // Set the state here
    };

    fetchData();
  }, [userData?.companyMasterID, userData?.apiToken]); // Adjust dependencies accordingly
  // Function to get all CSV data
  const fetchCompanyDataForCSV = async () => {
    try {
      const response = await commonService({
        apiEndPoint: COMPANY_MANAGEMENT.getCompany(
          `companyMasterID=${userData.companyMasterID}`
        ),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`, // Validate userData before usage
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
  // Function to fetch company data with POST
  const getCompanyList = async () => {
    if (!userData.companyMasterID) {
      return false;
    }

    setTableLoader(true);
    try {
      const response = await commonService({
        apiEndPoint: COMPANY_MANAGEMENT.getCompaniesServerSide,
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
      });

      if (response?.status) {
        setCompanyManagementData(response?.data?.data || []);
        // setTotalRecords(response?.data?.recordsTotal || response?.data?.recordsFiltered || 0);
        setTotalRecords(
          searchValue
            ? response.data.recordsFiltered ?? 0
            : response.data.recordsTotal ?? 0
        );
      }
    } catch (error) {
      logger(error);
    }
    setTableLoader(false);
  };

  const getCompanyListForDownload = async () => {
    if (!userData.companyMasterID) {
      return false;
    }

    try {
      const response = await commonService({
        apiEndPoint: COMPANY_MANAGEMENT.getCompaniesServerSide,
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
      });

      if (response?.status) {
        return response?.data?.data || [];
      }
    } catch (error) {
      logger(error);
    }
  };

  /**
   * Close the add company modal and reset the Formik form to its initial state.
   */
  const addCompanyClose = () => {
    setShowAddCompany(false);
    // eslint-disable-next-line no-use-before-define
    formik.resetForm();
  };

  /**
   * Close the edit company modal and reset the Formik form to its initial state.
   */
  const editCompanyClose = () => {
    setShowEditCompany(false);
    editFormik.resetForm();
  };

  /**
   * Handle adding a new company.
   *
   * @param {Object} values - Form values.
   * @param {Object} helpers - Formik helpers, includes resetForm.
   * @param {Function} helpers.resetForm - Function to reset the Formik form.
   */
  const handleAddSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const response = await commonService({
        apiEndPoint: COMPANY_MANAGEMENT.createCompany,
        bodyData: {
          ...values,
          companyMasterID: userData?.companyMasterID, // Ensure companyMasterID exists.
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`, // Ensure userData exists.
        },
        toastType: {
          success: "Company Created Successfully",
          error: "Company creation failed",
        },
      });

      if (response?.status) {
        setIsSubmitting(false);
        addCompanyClose(); // Close the modal.
        resetForm(); // Reset the form.
        // fetchCompanies(userData?.companyMasterID);
        // Refresh the company list after successful creation
        getCompanyList();
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error adding company:", error); // Handle error scenarios.
    }
  };

  /**
   * Handle editing an existing company.
   *
   * @param {Object} values - Form values.
   * @param {Object} helpers - Formik helpers, includes resetForm.
   * @param {Function} helpers.resetForm - Function to reset the Formik form.
   */
  const handleEditSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const response = await commonService({
        apiEndPoint: COMPANY_MANAGEMENT.updateCompany,
        bodyData: {
          ...values,
          companyID: selectedCompany?.companyID, // Ensure selectedCompany exists.
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`, // Ensure userData exists.
        },
        toastType: {
          success: "Company Updated Successfully",
          error: "Company update failed",
        },
      });

      if (response?.status) {
        setIsSubmitting(false);
        editCompanyClose(); // Close the modal.
        resetForm(); // Reset the form.
        // Refresh the company list
        // fetchCompanies(userData?.companyMasterID);
        getCompanyList();
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error updating company:", error); // Handle error scenarios.
    }
  };

  /** Initialize Formik for adding a company. */
  const formik = useFormik({
    initialValues: initValuesAdd(userData?.companyMasterName ?? ""), // Default to empty string if userData is null.
    validationSchema: validationCompanyAdd(),
    onSubmit: handleAddSubmit,
  });

  /** Initialize Formik for editing a company. */
  const editFormik = useFormik({
    enableReinitialize: true,
    initialValues: initValuesUpdate(
      userData?.companyMasterName ?? "",
      selectedCompany // Ensure selectedCompany is correctly initialized.
    ),
    validationSchema: validationCompanyUpdate(), // Validation schema for editing a company.
    onSubmit: handleEditSubmit,
  });

  /**
   * Handle deleting a company
   * @param {object} id Contains the company ID to be deleted
   * @returns {Promise} A promise that resolves when the API call is complete
   */
  const deleteCompany = async ({ companyID }) => {
    try {
      const response = await commonService({
        apiEndPoint: COMPANY_MANAGEMENT.deleteCompany,
        bodyData: { companyID },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: "Company deleted successfully",
          error: "Company delete failed",
        },
      });
      if (response?.status) {
        setIsAlertVisible(false);
        // Refresh the company list
        // fetchCompanies(userData?.companyMasterID)
        getCompanyList();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      return false;
    }
  };

  /**
   * Handle deleting a company confirm modal
   * @returns {Promise} A promise that resolves when the confirm modal is confirmed
   */
  const onConfirmAlertModal = async () => {
    const deleteRes = await deleteCompany({
      companyID: selectedCompany?.companyID,
    });
    return deleteRes;
  };

  /**
   * Fetches timezone data from the server
   * @returns {Promise} A promise that resolves when the API call is complete
   */
  const fetchTimezone = async () => {
    try {
      const response = await commonService({
        apiEndPoint: COMPANY_MANAGEMENT.timeZones,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });

      if (response?.status) {
        // Convert the response data to a format that can be used in a <Select>
        const options = Object?.values(response?.data?.data || []).map(
          (timezoneData) => ({
            value: timezoneData.timezoneID,
            label: timezoneData.timezoneDisplayName,
          })
        );
        // Set the state with the new options
        setTimezoneOptions(options);
      }
    } catch (error) {
      console.error("Error fetching timezones:", error); // Handle error scenarios
    }
  };

  useEffect(() => {
    if (userData) {
      fetchTimezone(); // Fetch timezone options on component mount
    }
  }, []);

  // Column ID mapping for sorting
  const columnIdMap = {
    companyName: 0,
    companyDescription: 1,
  };

  // Handle limit (page size) change
  const handleLimitChange = (value) => {
    setTableState((prev) => ({
      ...prev,
      length: parseInt(value),
      start: 0, // Reset to first page when changing page size
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

  // Debounced search handler
  const handleSearchChange = debounce((e) => {
    setSearchValue(e.target.value);
    setTableState((prev) => ({
      ...prev,
      start: 0, // Always go back to first page on new search
      draw: prev.draw + 1,
    }));
  }, 500);

  // Handle page change
  const handleOffsetChange = (page) => {
    setTableState((prev) => ({
      ...prev,
      start: (page - 1) * prev.length, // Calculate the starting index based on page number
      draw: prev.draw + 1,
    }));
  };

  // Fetch data when tableState or searchValue changes
  useEffect(() => {
    if (userData?.companyMasterID) {
      getCompanyList();
    }
  }, [tableState]);

  // Column definitions for CSV export
  const column = [
    {
      id: "sno",
      displayName: "S.No.",
    },
    {
      id: "companyName",
      displayName: "Company Name",
    },
    {
      id: "companyDescription",
      displayName: "Company Description",
    },
  ];
  // Old Code - Gets only paginated data in Excel
  // Map the companyManagementData array to a new array with the companyID,
  // const filteredData = companyManagementData.map((item, index) => {
  //   return {
  //     companyID: index ? index + 1 : 1,
  //     companyName: decodeHtmlEntities(item.companyName),
  //     companyDescription: decodeHtmlEntities(item.companyDescription),
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
      name: "Company Management",
    },
  ];

  // data table
  const columns = [
    {
      title: "S.No.",
      dataKey: "s.no",
      // data: 's.no',
      data: (row, index) => tableState.start + index + 1, // Correct S.No. based on pagination
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: "Name",
      dataKey: "companyName",
      data: "companyName",
      sortable: true,
    },
    {
      title: "Description",
      dataKey: "companyDescription",
      data: "companyDescription",
      sortable: true, // Make Description sortable
      render: (data, row) => {
        const maxChars = 60;
        const isLong = data?.length > maxChars;
        const displayText = isLong ? data.slice(0, maxChars) + "..." : data;

        return (
          <div
            style={{
              whiteSpace: "normal",
              wordBreak: "break-word",
              overflowWrap: "break-word",
              maxWidth: "550px",
              minWidth: "300px",
            }}
          >
            {displayText}
            {isLong && (
              <span
                className="link-primary"
                style={{ cursor: "pointer", marginLeft: "8px" }}
                onClick={() => handleShowMore(row.companyDescription)}
              >
                Read More
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: "Action",
      dataKey: "Action",
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
                    editCompanyShow(row);
                  }}
                >
                  <em className="icon-table-edit" />
                </Link>
              </li>
              <li
                className="list-inline-item tooltip-container"
                data-title="Delete"
              >
                <Link
                  className="icon-danger"
                  onClick={() => {
                    deleteModal(row?.companyID);
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
          <h2 className="mb-0">Company Management</h2>
          <Button variant="primary ripple-effect" onClick={addCompanyShow}>
            Add Company
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
              {/* <CsvDownloader
                  filename="Company_List"
                  extension=".csv"
                  className="btn-icon"
                  columns={column}
                  // datas={filteredData}
                  datas={async () => {
                    const allData = await fetchCompanyDataForCSV();
                    return allData.map((item, index) => ({
                      companyID: index + 1,
                      companyName: decodeHtmlEntities(item.companyName),
                      companyDescription: decodeHtmlEntities(item.companyDescription),
                    }));
                  }}
                  text={<em className="icon-download" />}
                /> */}
                  <ExportExcel 
                  filename="Company_List"  
                  columns={column} 
                  data={async () => {
                    const allData = await fetchCompanyDataForCSV();
                    return allData.map((item, index) => ({
                      companyID: index + 1,
                      companyName: decodeHtmlEntities(item.companyName),
                      companyDescription: decodeHtmlEntities(item.companyDescription),
                    }));
                  }} 
                  text={<em className="icon-download"/>}
                  />
            </li>
          </ul>
        </div>

        <ReactDataTable
          data={companyManagementData}
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
      {/* add Company */}
      <ModalComponent
        modalHeader="Add Company"
        show={showAddCompany}
        onHandleCancel={addCompanyClose}
      >
        <Form onSubmit={formik.handleSubmit}>
          <Row className="rowGap">
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Master Company Name<sup>*</sup>
                </Form.Label>
                <InputField
                  type="text"
                  name="companyMasterID"
                  placeholder="Master Company Name"
                  onChange={formik.handleChange}
                  value={formik.values.companyMasterID}
                  disabled
                />
                {formik.touched.companyMasterID &&
                  formik.errors.companyMasterID && (
                    <div className="error mt-1 text-danger">
                      {formik.errors.companyMasterID}
                    </div>
                  )}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Company Name<sup>*</sup>
                </Form.Label>
                <InputField
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.companyName}
                />
                {formik.touched.companyName && formik.errors.companyName ? (
                  <div className="error mt-1 text-danger">
                    {formik.errors.companyName}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group className="form-group">
                <Form.Label>
                  Company Description<sup>*</sup>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  className="textArea"
                  rows={3}
                  placeholder="Company Description"
                  name="companyDescription"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.companyDescription}
                />
                {formik.touched.companyDescription &&
                formik.errors.companyDescription ? (
                  <div className="error mt-1 text-danger">
                    {formik.errors.companyDescription}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Preferred Time Zone<sup>*</sup>
                </Form.Label>
                <SelectField
                  placeholder="- Select Time Zone ---"
                  options={timezoneOptions}
                  name="timezoneID"
                  onChange={(option) => {
                    formik.setFieldValue("timezoneID", option.value);
                  }}
                  value={timezoneOptions.find(
                    (option) => option.value === formik.values.timezoneID
                  )}
                />
                {formik.touched.timezoneID && formik.errors.timezoneID ? (
                  <div className="error mt-1 text-danger">
                    {formik.errors.timezoneID}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col xs={12}>
              <div className="form-btn d-flex gap-2 justify-content-end">
                <Button
                  variant="secondary"
                  className="ripple-effect"
                  onClick={addCompanyClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  className="ripple-effect"
                >
                  {isSubmitting ? "Adding..." : " Add Company"}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </ModalComponent>

      {/* edit Company */}
      <ModalComponent
        modalHeader="Edit Company"
        show={showEditCompany}
        onHandleCancel={editCompanyClose}
      >
        <Form onSubmit={editFormik.handleSubmit}>
          <Row className="rowGap">
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Master Company Name<sup>*</sup>
                </Form.Label>
                <InputField
                  type="text"
                  name="companyID"
                  placeholder="Master Company Name"
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  value={editFormik.values.companyID}
                  disabled
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
                  Company Name<sup>*</sup>
                </Form.Label>
                <InputField
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  value={editFormik.values.companyName} // Bind value to editFormik
                />
                {editFormik.touched.companyName &&
                editFormik.errors.companyName ? (
                  <div className="error mt-1 text-danger">
                    {editFormik.errors.companyName}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group className="form-group">
                <Form.Label>
                  Company Description<sup>*</sup>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  className="textArea"
                  rows={3}
                  placeholder="Company Description"
                  name="companyDescription"
                  onChange={editFormik.handleChange}
                  onBlur={editFormik.handleBlur}
                  value={editFormik.values.companyDescription} // Bind value to editFormik
                />
                {editFormik.touched.companyDescription &&
                editFormik.errors.companyDescription ? (
                  <div className="error mt-1 text-danger">
                    {editFormik.errors.companyDescription}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="form-group">
                <Form.Label>
                  Preferred Time Zone<sup>*</sup>
                </Form.Label>
                <SelectField
                  placeholder="- Select Time Zone ---"
                  options={timezoneOptions}
                  name="timezoneID"
                  onChange={(option) => {
                    editFormik.setFieldValue("timezoneID", option.value);
                  }}
                  value={timezoneOptions.find(
                    (option) => option.value === editFormik.values.timezoneID
                  )}
                />
                {editFormik.touched.value && editFormik.errors.value ? (
                  <div className="error mt-1 text-danger">
                    {editFormik.errors.value}
                  </div>
                ) : null}
              </Form.Group>
            </Col>
            <Col xs={12}>
              <div className="form-btn d-flex gap-2 justify-content-end">
                <Button
                  variant="secondary"
                  className="ripple-effect"
                  onClick={editCompanyClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  className="ripple-effect"
                >
                  {isSubmitting ? "Updating..." : "Update Company"}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </ModalComponent>
      {/* read more modal */}
      <ModalComponent
        modalHeader="Read More"
        show={showMore}
        onHandleCancel={() => handleShowMore("")}
      >
        <div
          className="text-break"
          dangerouslySetInnerHTML={{
            __html: decodeHtmlEntities(showMoreData),
          }}
        />
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
        isConfirmedText="Company has been deleted."
        otherErrDisplayMode={otherErrDisplayMode}
      />
    </>
  );
}

export default CompanyManagement;
