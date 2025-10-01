import { RESOURSE_MANAGEMENT } from "apiEndpoints/ResourseManagement";
import { useAuth } from "customHooks";
import logger from "helpers/logger";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from "lodash.debounce";
// import CsvDownloader from "react-csv-downloader";
import ExportExcel from "components/Excel";
import { commonService } from "services/common.service";
import {decodeHtmlEntities, stripHtml} from "utils/common.util";
import {
  BasicAlert,
  InputField,
  ModalComponent,
  ReactDataTable,
  SelectField,
  SweetAlert,
} from "../../../../components";
import ResponseBlockForm from "./ResourceManagementForm/ResponseBlockForm";
import ResponseBlockViewTable from "./ResponseBlockViewTable";

export default function ResponseBlock({ companyOptions, searchOptions, selectedCompany, onCompanyChange }) {
  // View Modal
  const [rowData, setRowData] = useState();
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [responsePreview, setResponsePreview] = useState(false);
  const responsePreviewClose = () => setResponsePreview(false);
  const [modalType, setModalType] = useState("");
  // edit response block modal
  const [editResponseBlock, setEditResponseBlock] = useState(false);
  const editResponseBlockClose = () => setEditResponseBlock(false);
  const editResponseBlockShow = (row) => {
    setModalType("edit");
    setEditResponseBlock(true);
    setRowData(row);
  };
  const addResponseBlockShow = () => {
    setEditResponseBlock(true);
    setModalType("add");
    setRowData("");
  };

  // start alert modal
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState(null);
  const [alertMassage, setAlertMassage] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchFormData, setSearchFormData] = useState([]);
  const [responseBlockData, setResponseBlockData] = useState([]);
  const [tableLoader, setTableLoader] = useState(false);
  const [responseLoading, setResponseLoading] = useState(false);
  const [handleSearchSubmitting, setHandleSearchSubmitting] = useState(false);
  const [particularResponseBloackData, setParticularResponseBloackData] =
    useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [formData, setFormData] = useState({
    companyMasterID: userData?.companyMasterID || null,
    companyID: selectedCompany || null,
    searchFrom: null,
    isExport: false,
    keywords: "",
  });
  const [tableState, setTableState] = useState({
    draw: 1,
    start: 0,
    length: 10,
    order: [{ column: 0, dir: "asc" }],
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [prevStart, setPrevStart] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [showMoreData, setShowMoreData] = useState("");
  const deleteModal = (row) => {
    if (!formData?.companyID) {
      setAlertType("error");
    } else {
      setAlertType("delete");
      setRowData(row);
    }
    setIsAlertVisible(true);
  };
   const handleShowMore = (htmlContent) => {
    setShowMoreData(htmlContent);
    setShowMore(!!htmlContent);
  };
  const viewModal = () => {
    if (!formData?.companyID) {
      setAlertType("error");
      setIsAlertVisible(true);
    } else {
      setResponsePreview(true);
      setIsAlertVisible(false);
    }
  };

  const getResponseBlockSearchFormData = async () => {
    try {
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.getSearchFormData, // Remove Community Resources from dropdown
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setSearchFormData(
          Object?.values(response?.data?.data)?.map((company) => ({
            value: company?.libraryElementID,
            label: decodeHtmlEntities(company?.value),
          }))
        );
      }
    } catch (error) {
      logger(error);
    }
  };
  const handleCompanyChange = async (selectedOption) => {
    const value = selectedOption ? selectedOption.value : null;
    onCompanyChange(selectedOption);
    setFormData(prev => ({
      ...prev,
      companyID: value
    }));
  };
  const handleSearchFormChange = (selectedOption) => {
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

  // end
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
    responseBlock: 0,
    scale: 1,
    keywords: 2
  };
  const getResponseBlockList = async () => {
    if (
      !(formData.companyMasterID && formData.companyID && formData.searchFrom)
    ) {
      return false;
    }
    setHandleSearchSubmitting(true);
    setTableLoader(true);
    try {
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.getResponseBlockList,
        bodyData: {
          companyMasterID: userData.companyMasterID,
          companyID: formData.companyID,
          searchFrom: formData.searchFrom,
          keywords: formData.keywords || "",
          search: {
            value: searchValue || "",
            regex: false,
          },
          isExport: false,
          ...tableState,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setResponseBlockData(response?.data?.data);
        setTotalRecords(
          (response?.data?.recordsTotal && response?.data?.recordsFiltered) || 0
        );
      }
    } catch (error) {
      logger(error);
    }
    setHandleSearchSubmitting(false);
    setTableLoader(false);
  };
  // Get All Response Data
  const fetchAllResponseDataForCSV = async () => {
    const { companyMasterID, companyID, searchFrom, keywords } = formData;
    if (!companyMasterID || !companyID || !searchFrom) {
      return [];
    }
    try {
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.getResponseBlockList,
        bodyData: {
          companyMasterID,
          companyID,
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
  // Update handleSort to properly toggle direction
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
  const getResponceBlockById = async (row) => {
    const { responseTypeID } = row;
    try {
      setResponseLoading(true);
      viewModal();
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.getResponceBlockById,
        queryParams: { responseTypeID },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setParticularResponseBloackData(response?.data?.data);
      }
    } catch (error) {
      logger(error);
    }
    setResponseLoading(false);
  };
  const handleDelete = async () => {
    if (!rowData) {
      return false;
    }
    try {
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.deleteResponceBlockdata,
        bodyData: {
          responseTypeID: parseInt(rowData?.responseTypeID),
        },
        // toastType: { success: true, error: false },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        getResponseBlockList();
      }
    } catch (error) {
      logger(error);
    }
  };

  const copyQuestionModal = (row) => {
    setAlertType("copyQuestion");
    setIsAlertVisible(true);
    setRowData(row);
  };
  const onConfirmAlertModal = () => {
    handleDelete();
    setIsAlertVisible(false);
    return true;
  };
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
    getResponseBlockList();
  };
  const columns = [
    {
      title: "#",
      dataKey: "s.no",
      data: "id",
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: "Response Block",
      dataKey: "responseBlock",
      data: "response block",
      sortable: true,
      columnId: 0,
      render: (data, row) => {
        const maxChars = 60;
        const isLong = data?.length > maxChars;
        const displayText = isLong ? data.slice(0, maxChars) + "..." : data;

        return (
          <div style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "break-word",
            maxWidth: "550px",
            minWidth: "300px",
          }}>
            {displayText}
            {isLong && (
              <span
                className="link-primary"
                style={{ cursor: "pointer", marginLeft: "8px" }}
                onClick={() => handleShowMore(row.responseBlock)}
              >
                Read More
              </span>
            )}
          </div>
        );
      }
    },
    {
      title: "Scale",
      dataKey: "scale",
      data: "scale",
      sortable: true,
      columnId: 1
    },
    {
      title: "Keywords",
      dataKey: "keywords",
      data: "keywords",
      sortable: true,
      columnId: 2
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
                          to=""
                          className="icon-primary"
                          onClick={() => getResponceBlockById(row)}
                      >
                        <em className="icon-eye" />
                      </Link>
                    </li>

                    <li className="list-inline-item tooltip-container" data-title="Copy to my resource">
                      <button
                          type="button"
                          aria-label="Copy icon"
                          className="icon-success"
                          onClick={() => copyQuestionModal(row)}
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
                          to=""
                          className="icon-secondary"
                          onClick={() => editResponseBlockShow(row)}
                      >
                        <em className="icon-edit" />
                      </Link>
                    </li>
                    <li className="list-inline-item tooltip-container" data-title="Delete">
                      <Link
                          to=""
                          className="icon-danger"
                          onClick={() => deleteModal(row)}
                      >
                        <em className="icon-delete" />
                      </Link>
                    </li>
                  </>
              )}

            </ul>
        );

      },
    },
  ];

  useEffect(() => {
    if (formData.companyMasterID && formData.companyID && formData.searchFrom) {
      getResponseBlockList();
    }
  }, [tableState, searchValue]);
  // for csv upload
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
      displayName: "Response Block",
      id: "responseBlock",
    },
    // {
    //   displayName: "Response Type ID",  // Old Code - Unnecessary Columns
    //   id: "responseTypeID",
    // },
    {
      displayName: "Scale",
      id: "scale",
    },
  ];
  // Old Code - Gets only paginated data for export
  // const filteredData =
  //   responseBlockData &&
  //   responseBlockData?.map((item, index) => {
  //     return {
  //       "s.no": index + 1,
  //       keywords: decodeHtmlEntities(item?.keywords),
  //       resource: decodeHtmlEntities(item?.resource),
  //       responseBlock: decodeHtmlEntities(item?.responseBlock),
  //       responseTypeID: item?.responseType,
  //       scale: decodeHtmlEntities(item?.scale),
  //     };
  //   });
  useEffect(() => {
    getResponseBlockSearchFormData();
  }, []);

  const handleCopyResponseBlock = async () => {
    if (!rowData) {
      return false;
    }
    try {
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.copyResponseBlockToMyresource,
        bodyData: {
          responseTypeID: parseInt(rowData?.responseTypeID),
          companyID: formData?.companyID,
          companyMasterID: formData?.companyMasterID,
        },
        // toastType: { success: true, error: true }, // Keep only sweet alert, remove toast message
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        getResponseBlockList();
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
          <Col lg={3} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>Search From <sup>*</sup></Form.Label>
              <SelectField
                placeholder="Select Search From"
                options={searchFormData}
                onChange={handleSearchFormChange}
              />
            </Form.Group>
          </Col>
          <Col lg={3} sm={6}>
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
          <Col lg={3} sm={6}>
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
          {/*<li className="list-inline-item">*/}
          {/*  <CsvDownloader*/}
          {/*    filename="Resources_Response_List" // Rename Excel File*/}
          {/*    extension=".csv"*/}
          {/*    className="downloadBtn "*/}
          {/*    columns={columnCsvDownload}*/}
          {/*    // datas={filteredData} // Old Code - Gets only paginated data in excel*/}
          {/*    datas={async () => {*/}
          {/*      const allData = await fetchAllResponseDataForCSV();*/}
          {/*      return allData.map((item, index) => ({*/}
          {/*        "s.no": index + 1,*/}
          {/*        keywords: decodeHtmlEntities(item?.keywords),*/}
          {/*        resource: decodeHtmlEntities(item?.resource),*/}
          {/*        responseBlock: decodeHtmlEntities(item?.responseBlock),*/}
          {/*        responseTypeID: item?.responseType,*/}
          {/*        scale: decodeHtmlEntities(item?.scale),*/}
          {/*      }));*/}
          {/*    }}*/}
          {/*    text={<em className="icon-download" />}*/}
          {/*  />*/}
          {/*</li>*/}
          <li className="list-inline-item tooltip-container" data-title="Download All">
            <ExportExcel
                filename="Resources_Response_List"
                columns={columnCsvDownload}
                data={async () => {
                  const allData = await fetchAllResponseDataForCSV();
                  const arrayData = Array.isArray(allData) ? allData : allData?.data || [];
                  console.log(arrayData);
                  return arrayData.map((item, index) => ({
                    "s.no": index + 1,
                    keywords: decodeHtmlEntities(item?.keywords),
                    resource: decodeHtmlEntities(item?.resource),
                    responseBlock: decodeHtmlEntities(item?.responseBlock),
                    responseTypeID: item?.responseType,
                    scale: decodeHtmlEntities(item?.scale),
                  }));
                }}
                text={<em className="icon-download" />}
            />
          </li>
          <li className="list-inline-item">
            <Link
              to="#!"
              className="btn btn-primary ripple-effect me-2 mb-sm-0 mb-2"
              onClick={addResponseBlockShow}
            >
              <em className="icon-creates" />
              Create
            </Link>
          </li>
        </ul>
      </div>
      <ReactDataTable
        data={responseBlockData}
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

      {/* view modal */}
      <ModalComponent
        modalHeader="Response Block Preview"
        size="lg"
        show={responsePreview}
        onHandleCancel={responsePreviewClose}
      >
        {responsePreview ? (
          <ResponseBlockViewTable
            responsePreviewClose={responsePreviewClose}
            responseBlockPreviewData={particularResponseBloackData}
            responseLoading={responseLoading}
          />
        ) : (
          ""
        )}
      </ModalComponent>

      {/* edit response block modal */}
      <ModalComponent
        modalHeader={
          modalType === "edit" ? "Edit Response Block" : "Add Response Block"
        }
        modalExtraClass="responseBlockModal"
        size="xl"
        show={editResponseBlock}
        onHandleCancel={editResponseBlockClose}
      >
        <ResponseBlockForm
          editResponseBlockClose={editResponseBlockClose}
          getResponseBlockList={getResponseBlockList}
          rowData={rowData}
          formData={formData}
          modalType={modalType}
          companyOptions={companyOptions}
        />
      </ModalComponent>

      {/* delete alert */}
      <SweetAlert
        title="Are you sure?"
        text="You want to delete this data!"
        show={isAlertVisible && alertType === "delete"}
        icon="warning"
        onConfirmAlert={onConfirmAlertModal}
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={setIsAlertVisible}
        isConfirmedTitle="Deleted!"
        isConfirmedText="Response block has been deleted successfully."
      />
      {/* Read More modal*/}
      <ModalComponent
              modalHeader="Read More"
              show={showMore}
              onHandleCancel={() => handleShowMore("")}
            >
              <div
                className="text-break"
                  dangerouslySetInnerHTML={{
                  __html: decodeHtmlEntities(showMoreData)
                }}
              />
      </ModalComponent>
      {/* this alert showing when company is selected */}
      <SweetAlert
        icon="warning"
        text="You are about to copy Response to 'My Resources', Please Confirm !!!"
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        show={isAlertVisible && alertType === "copyQuestion"}
        onConfirmAlert={handleCopyResponseBlock}
        setIsAlertVisible={setIsAlertVisible}
        isConfirmedTitle="Copied!"
        isConfirmedText="Response has been copied successfully."
      />
      {/* this alert showing when company is not selected */}
      <SweetAlert
        icon="error"
        text="Please Select the Company"
        cancelButtonColor="#0968AC"
        showCancelButton
        showConfirmButton={false}
        cancelButtonText="Okay"
        show={isAlertVisible && alertType === "error"}
        onConfirmAlert={onConfirmAlertModal}
        setIsAlertVisible={setIsAlertVisible}
      />

      <BasicAlert
        title={alertMassage || "Please Select filters..."}
        text={
          alertType === "searchFrom"
            ? "Please provide search From criteria to continue!"
            : alertType === "companyID"
              ? "Please select a company before proceeding..."
              : "Please select the outcome too processing..."
        }
        show={
          isAlertVisible &&
          (alertType === "searchFrom" || alertType === "companyID")
        }
        icon="warning"
        setIsAlertVisible={setIsAlertVisible}
        buttonText="OK"
      />
    </>
  );
}
