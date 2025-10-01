import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { RESOURSE_MANAGEMENT } from "apiEndpoints/ResourseManagement";
import { useAuth } from "customHooks";
import logger from "helpers/logger";
// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from "lodash.debounce";
// import CsvDownloader from "react-csv-downloader";
import ExportExcel from "components/Excel";
import { commonService } from "services/common.service";
import { stripHtml } from "utils/common.util";
import {
  BasicAlert,
  Button,
  InputField,
  ModalComponent,
  ReactDataTable,
  SelectField,
  SweetAlert,
  TextEditor,
} from "../../../../components";
import EmailAddEditForm from "./ResourceManagementForm/EmailForm";

export default function EmailTemplates({ companyOptions, searchOptions, selectedCompany, onCompanyChange }) {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [rowData, setRowData] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [emailOptions, setEmailOptions] = useState([]);
  const [emailTemplatesData, setEmailTemplatesData] = useState([]);
  const [particularEmailData, setParticularEmailData] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [handleSearchSubmitting, setHandleSearchSubmitting] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortDirection, setSortDirection] = useState("asc");
  const [formData, setFormData] = useState({
    companyMasterID: userData?.companyMasterID || null,
    companyID: selectedCompany || null,
    searchFrom: null,
    emailType: null,
    keywords: "",
  });
  const [tableState, setTableState] = useState({
    draw: 1,
    start: 0,
    length: 10,
    order: [{ column: 0, dir: "asc" }],
  });
  // start alert modal
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState(null);
  const [alertMassage, setAlertMassage] = useState(null);
  // email template preview modal
  const [showEmailTemplate, setShowEmailTemplate] = useState(false);
  // Edit Email Template Modal
  const [emailTemplateEditTemp, setEmailTemplateEditTemp] = useState(false);
  const emailTemplateEditClose = () => setEmailTemplateEditTemp(false);
  const [prevStart, setPrevStart] = useState(0);
  const emailTemplateEditShow = (row) => {
    setAlertType("edit");
    setRowData(row);
    setEmailTemplateEditTemp(true);
  };
  const emailTemplateAddShow = () => {
    setAlertType("add");
    setEmailTemplateEditTemp(true);
    setRowData("");
  };

  const deleteModal = (row) => {
    setAlertType("delete");
    setIsAlertVisible(true);
    setRowData(row);
  };
  const [tableLoader, setTableLoader] = useState(false);
  const emailTemplateClose = () => {
    setShowEmailTemplate(false);
    setParticularEmailData(null);
  };
  const emailTemplateShow = () => setShowEmailTemplate(true);
  const tableReset = () => {
    setRowData(null);
  };
  const fetchEmail = async (companyID) => {
    const response = await commonService({
      apiEndPoint: RESOURSE_MANAGEMENT.emailResponseList,
      queryParams: { companyID },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });
    if (response?.status) {
      setEmailOptions(
        response?.data?.data?.map((item) => ({
          value: item?.libraryElementID,
          label: item?.value,
        }))
      );
    }
  };
  const getEmailList = async () => {
    if (
      !(
        formData.companyMasterID &&
        formData.companyID &&
        formData.emailTypeID &&
        formData.searchFrom
      )
    ) {
      return false;
    }
    setHandleSearchSubmitting(true);
    setTableLoader(true);
    try {
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.getEmailList,
        bodyData: {
          companyMasterID: userData.companyMasterID,
          companyID: formData.companyID,
          emailTypeID: formData.emailTypeID,
          searchFrom: formData.searchFrom,
          keywords: formData.keywords || "",
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
        setEmailTemplatesData(response?.data?.data);
        // setTotalRecords(
        //   (response?.data?.recordsTotal && response?.data?.recordsFiltered) || 0
        // );
        setTotalRecords(
          searchValue 
            ? (response?.data?.recordsFiltered || 0) 
            : (response?.data?.recordsTotal || 0)
        ); // Fix pagination issue
      }
    } catch (error) {
      logger(error);
    }
    setHandleSearchSubmitting(false);
    setTableLoader(false);
  };
  // Function to get all Email data for export
  const fetchAllEmailDataForCSV = async () => {
    const { companyMasterID, companyID, emailTypeID, searchFrom, keywords } = formData;
    if (!companyMasterID || !companyID || !emailTypeID || !searchFrom) {
      return [];
    }
    try {
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.getEmailList,
        bodyData: {
          companyMasterID,
          companyID,
          emailTypeID,
          searchFrom,
          keywords: keywords || "",
          search: {
            value: searchValue || "",
            regex: false,
          },
          start: 0, // Fetch all
          length: -1, // Fetch all
          order: tableState.order,
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
      return [];
    } catch (error) {
      logger(error);
      return [];
    }
  };
  // This hook is not usefull when we handle search,filter,pagination from api.
  const handleCompanyChange = async (selectedOption) => {
    const value = selectedOption ? selectedOption.value : null;
    onCompanyChange(selectedOption);
    setFormData(prev => ({
      ...prev,
      companyID: value
    }));
  };
  const handleEmailTypeChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      emailTypeID: Number(selectedOption?.value),
    }));
  };

  const handleSearchFromChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      searchFrom: Number(selectedOption?.value),
    }));
  };
  const handleKeywordTypeChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      keywords: e.target.value, // Update the `keywords` field in `formData`
    }));
  };
  const getEmailById = async (emailID) => {
    try {
      setEmailLoading(true);
      emailTemplateShow();
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.getEmailById,
        queryParams: { libraryEmailID: emailID?.libraryEmailID },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setParticularEmailData(response?.data?.data);
      }
    } catch (error) {
      logger(error);
    }
    setEmailLoading(false);
  };
  const handleDelete = async () => {
    if (!rowData) {
      return false;
    }
    try {
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.deleteEmaildataById,
        bodyData: {
          libraryEmailID: parseInt(rowData?.libraryEmailID),
        },
        // toastType: { success: true, error: true },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        getEmailList();
      }
    } catch (error) {
      logger(error);
    }
    tableReset();
  };
  const onConfirmAlertModal = () => {
    handleDelete();
    setIsAlertVisible(false);
    return true;
  };

  const copyEmailTemplateModal = (row) => {
    setAlertType("copyEmailTemplate");
    setIsAlertVisible(true);
    setRowData(row);
  };
  // data table
  const columns = [
    {
      title: "#",
      dataKey: "s.no",
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: "Email Group",
      dataKey: "emailGroup",
      data: "email group",
    },
    {
      title: "Email Subject",
      dataKey: "emailSubject",
      data: "email subject",
      sortable: true,
      columnId: 0,
    },
    {
      title: "Keywords",
      dataKey: "keywords",
      data: "keywords",
      sortable: true,
      columnId: 1,
    },
    {
      title: "Action",
      dataKey: "action",
      data: null,
      columnHeaderClassName: "w-2 text-center no-sorting",
      columnClassName: "w-2 text-center",
      render: (data, row) => {
        const resourceType = row?.resource;

        return (
            <ul className="list-inline action mb-0">
              {/* Show View and Copy */}
              {(resourceType === "System Resources") && (
                  <>
                    <li className="list-inline-item tooltip-container" data-title="Preview">
                      <Link
                          to="#!"
                          className="icon-primary"
                          onClick={() => getEmailById(row)}
                      >
                        <em className="icon-eye" />
                      </Link>
                    </li>

                    <li className="list-inline-item tooltip-container" data-title="Copy to my resource">
                      <button
                          type="button"
                          aria-label="Copy icon"
                          className="icon-success"
                          onClick={() => copyEmailTemplateModal(row)}
                      >
                        <em className="icon-copy" />
                      </button>
                    </li>

                  </>
              )}

              {/* Show Edit and Delete buttons only for "My Resources" */}
              {(resourceType === "My Resources") && (
                  <>
                    <li className="list-inline-item tooltip-container" data-title="Edit">
                      <Link
                          to="#!"
                          className="icon-secondary"
                          onClick={() => emailTemplateEditShow(row)}
                      >
                        <em className="icon-edit" />
                      </Link>
                    </li>
                    <li className="list-inline-item tooltip-container" data-title="Delete">
                      <button
                          to="#!"
                          className="icon-danger"
                          onClick={() => deleteModal(row)}
                      >
                        <em className="icon-delete" />
                      </button>
                    </li>
                  </>
              )}

            </ul>
        );

      },
    },
  ];
  const handleLimitChange = (value) => {
    setTableState((prev) => ({
      ...prev,
      length: parseInt(value),
      start: 0,
      draw: prev.draw + 1,
    }));
  };

  const handleSearchChange = debounce((e) => {
    setSearchValue(e.target.value);
    setTableState((prev) => ({
      ...prev,
      start: e.target.value ? 0 : prevStart,
      draw: prev.draw + 1,
    }));
  }, 500);

  const handleOffsetChange = (page) => {
    setTableState((prev) => {
      const newStart = (page - 1) * prev.length;
      setPrevStart(newStart);
      return {
        ...prev,
        start: newStart,
        draw: prev.draw + 1,
      };
    });
  };
  const columnIdMap = {
    emailSubject: 0,
    keywords: 1
  };
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
          column: columnIdMap[column] || 0, // Default to 1 if column not found
          dir: newDirection,
        },
      ],
      draw: prev.draw + 1,
    }));
  };
  const columnCsvDownload = [
    {
      displayName: "S.No",
      id: "s.no",
    },
    {
      displayName: "Resource",
      id: "resource",
    },
    {
      displayName: "Keywords",
      id: "keywords",
    },
    {
      displayName: "Email Group",
      id: "emailGroup",
    },
    {
      displayName: "Email Subject",
      id: "emailSubject",
    },
    {
      displayName: "Email Content",
      id: "emailBody",
    }
    // {
    //   displayName: "Library Email ID",   // Old Code - Unnecessary Columns 
    //   id: "libraryEmailID",
    // },
  ];
  const handleSearch = () => {
    if (!formData.companyMasterID) {
      setAlertType("companyMasterID");
      setAlertMassage("Please Select the Company Master");
      setIsAlertVisible(true);
      return;
    }
    if (!formData.companyID) {
      setAlertType("companyID");
      setAlertMassage("Please Select the Company");
      setIsAlertVisible(true);
      return;
    }
    if (!formData.searchFrom) {
      setAlertType("searchFrom");
      setAlertMassage("Please Select the Search From");
      setIsAlertVisible(true);
      return;
    }
    if (!formData.emailTypeID) {
      setAlertType("emailTypeID");
      setAlertMassage("Please Select the Email Type");
      setIsAlertVisible(true);
      return;
    }

    // If all fields are filled, clear the alert and proceed
    setAlertType("");
    setAlertMassage("");
    setIsAlertVisible(false);

    // Update table state is keyword or search from is updated
    const isKeywordSearch = formData.keywords && formData.keywords.trim() !== "";
    if (isKeywordSearch || formData.searchFrom) {
      setTableState(prevState => ({
        ...prevState,
        start: 0,
      }));
    }
    getEmailList();
  };
  // Old Code - Gets only paginated data for export
  // const filteredData =
  //   emailTemplatesData &&
  //   emailTemplatesData?.map((item, index) => {
  //     return {
  //       "s.no": index + 1,
  //       emailBody: stripHtml(item?.emailBody),
  //       emailGroup: stripHtml(item?.emailGroup),
  //       emailSubject: stripHtml(item?.emailSubject),
  //       keywords: stripHtml(item?.keywords),
  //       libraryEmailID: item?.libraryEmailID,
  //       resource: stripHtml(item?.resource),
  //     };
  //   });
  // Watch for changes in form data and timing to trigger API calls
  useEffect(() => {
    if (
      formData.companyMasterID &&
      formData.companyID &&
      formData.emailTypeID &&
      formData.searchFrom
    ) {
      getEmailList();
    }
  }, [searchValue, tableState]);
  useEffect(() => {
    fetchEmail();
  }, []);

  const handleCopyEmailTemplate = async () => {
    if (!rowData) {
      return false;
    }
    try {
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.copyEmailToMyresource,
        bodyData: {
          libraryEmailID: parseInt(rowData?.libraryEmailID),
          companyID: formData?.companyID,
          companyMasterID: formData?.companyMasterID,
          libraryElementID: parseInt(rowData?.emailTypeID),
        },
        // toastType: { success: true, error: true },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        getEmailList();
        return true;
      }
    } catch (error) {
      logger(error);
    }
    return false;
  };

  // Update formData when selectedCompany prop changes
  useEffect(() => {
    if (selectedCompany) {
      setFormData(prev => ({
        ...prev,
        companyID: selectedCompany
      }));
    }
  }, [selectedCompany]);

  return (
    <>
      <Form>
        <Row className="mb-2 align-items-end gx-2">
          <Col lg={4} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>Company<sup>*</sup></Form.Label>
              <SelectField
                placeholder="Select Company"
                options={companyOptions || []}
                value={companyOptions?.find(
                  (option) => option.value === formData.companyID
                )}
                onChange={handleCompanyChange}
              />
            </Form.Group>
          </Col>
          <Col lg={4} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>Email Group <sup>*</sup></Form.Label>
              <SelectField
                placeholder="Select Email Group"
                options={emailOptions}
                onChange={handleEmailTypeChange}
              />
            </Form.Group>
          </Col>
          <Col lg={4} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>Search From <sup>*</sup></Form.Label>
              <SelectField
                placeholder="Select Search From"
                options={searchOptions}
                onChange={handleSearchFromChange}
              />
            </Form.Group>
          </Col>
          <Col lg={4} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>Keywords</Form.Label>
              <InputField
                type="text"
                placeholder="Enter Keywords"
                value={formData.keywords}
                onChange={handleKeywordTypeChange}
              />
            </Form.Group>
          </Col>
          <Col lg={4} sm={6}>
            <Form.Group className="form-group">
              <Button onClick={handleSearch}>
                {handleSearchSubmitting ? "Searching..." : "Search"}{" "}
              </Button>
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <div className="filter d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="searchBar">
          <InputField
            type="search"
            placeholder="Search"
            onChange={handleSearchChange}
          />
        </div>
        <ul className="list-inline filter_action d-flex mb-0">
          <li className="list-inline-item">
            {/*<Link to="#!" className="btn-icon ripple-effect">*/}
            {/*  <CsvDownloader*/}
            {/*    filename="Resources_Email_List" // Rename Filename*/}
            {/*    extension=".csv"*/}
            {/*    className="downloadBtn "*/}
            {/*    columns={columnCsvDownload}*/}
            {/*    // datas={filteredData} // Old Code - Gets only paginated data in excel*/}
            {/*    datas={async () => {*/}
            {/*      const allData = await fetchAllEmailDataForCSV();*/}
            {/*      return allData.map((item, index) => ({*/}
            {/*        "s.no": index + 1,*/}
            {/*        emailBody: stripHtml(item?.emailBody),*/}
            {/*        emailGroup: stripHtml(item?.emailGroup),*/}
            {/*        emailSubject: stripHtml(item?.emailSubject),*/}
            {/*        keywords: stripHtml(item?.keywords),*/}
            {/*        libraryEmailID: item?.libraryEmailID,*/}
            {/*        resource: stripHtml(item?.resource),*/}
            {/*      }));*/}
            {/*    }}*/}
            {/*    text={<em className="icon-download" />}*/}
            {/*  />*/}
            {/*</Link>*/}
            <li className="list-inline-item tooltip-container" data-title="Download All">
              <ExportExcel
                  filename="Resources_Email_List"
                  columns={columnCsvDownload}
                  data={async () => {
                    const allData = await fetchAllEmailDataForCSV();
                    const arrayData = Array.isArray(allData) ? allData : allData?.data || [];
                    console.log(arrayData);
                    return arrayData.map((item, index) => ({
                      "s.no": index + 1,
                      emailBody: stripHtml(item?.emailBody),
                      emailGroup: stripHtml(item?.emailGroup),
                      emailSubject: stripHtml(item?.emailSubject),
                      keywords: stripHtml(item?.keywords),
                      libraryEmailID: item?.libraryEmailID,
                      resource: stripHtml(item?.resource),
                    }));
                  }}
                  text={<em className="icon-download" />}
              />
            </li>
          </li>
          <li className="list-inline-item">
            <Link
              to="#!"
              className="btn btn-primary ripple-effect me-2 mb-sm-0 mb-2"
              onClick={emailTemplateAddShow}
            >
              <em className="icon-creates" />
              Create
            </Link>
          </li>
        </ul>
      </div>
      <ReactDataTable
        data={emailTemplatesData}
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
          column: tableState.order[0].column,
          direction: sortDirection, // Use the tracked direction
        }}
        isLoading={tableLoader}
        serverSide
      />
      {/* preview email template modal */}
      <ModalComponent
        modalHeader="Email Template - Preview"
        show={showEmailTemplate}
        onHandleCancel={emailTemplateClose}
      >
        {emailLoading ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          <>
            <Form>
              <Form.Group className="form-group mb-3 ">
                <Form.Label>Subject</Form.Label>
                <InputField
                  type="text"
                  placeholder="Subject"
                  disabled
                  value={particularEmailData?.emailSubject || ""}
                  onChange={(e) =>
                    setParticularEmailData((prev) => ({
                      ...prev,
                      emailSubject: e,
                    }))
                  }
                />
              </Form.Group>
              <Form.Group className="form-group mb-3">
                <Form.Label>Content</Form.Label>
                <TextEditor
                  value={particularEmailData?.emailBody || ""}
                  isEditable={false}
                  onChange={(e) =>
                    setParticularEmailData((prev) => ({
                      ...prev,
                      emailBody: e,
                    }))
                  }
                />
              </Form.Group>
              <div className="form-btn d-flex gap-2 justify-content-end">
                <Button
                  variant="secondary"
                  className="ripple-effect"
                  onClick={emailTemplateClose}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </>
        )}
      </ModalComponent>
      {/* edit email template model  */}
      <ModalComponent
        modalHeader={
          alertType === "edit" ? "Edit Email Template" : "Add Email Template"
        }
        modalExtraClass="emailTemplateEditModal"
        show={emailTemplateEditTemp}
        onHandleCancel={emailTemplateEditClose}
      >
        <EmailAddEditForm
          emailGroupOptions={emailOptions}
          emailTemplateEditClose={emailTemplateEditClose}
          rowData={rowData}
          alertType={alertType}
          companyOptions={companyOptions}
          getEmailList={getEmailList}
        />
      </ModalComponent>
      <SweetAlert
        title="Are you sure?"
        text="This will be deleted from the resource."
        show={isAlertVisible && alertType === "delete"}
        icon="warning"
        onConfirmAlert={onConfirmAlertModal}
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={setIsAlertVisible}
        isConfirmedTitle="Deleted!"
        isConfirmedText="Email template has been deleted successfully."
      />
      {/* this alert showing when company is selected */}
      <SweetAlert
        icon="warning"
        text="You are about to copy Email to 'My Resources', Please Confirm !!!"
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        show={isAlertVisible && alertType === "copyEmailTemplate"}
        onConfirmAlert={handleCopyEmailTemplate}
        setIsAlertVisible={setIsAlertVisible}
        isConfirmedTitle="Copied!"
        isConfirmedText="Email has been copied successfully."
      />

      <BasicAlert
        title={alertMassage || "Please Select filters..."}
        text={
          alertType === "surveyTypeID"
            ? "Please select a survey type before proceeding!"
            : alertType === "searchFrom"
              ? "Please provide search From criteria to continue!"
              : alertType === "companyID"
                ? "Please select a company before adding a question!"
                : alertType === "emailTypeID"
                  ? "Please select a email type before proceeding!"
                  : ""
        }
        show={
          isAlertVisible &&
          (alertType === "emailTypeID" || 
            alertType === "searchFrom" ||
            alertType === "companyID")
        }
        icon="warning"
        setIsAlertVisible={setIsAlertVisible}
        buttonText="OK"
      />
    </>
  );
}
