import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from "lodash.debounce";
import { RESOURSE_MANAGEMENT } from "apiEndpoints/ResourseManagement";
import { useAuth } from "customHooks";
import logger from "helpers/logger";
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
import IntroductionAddEditForm from "./ResourceManagementForm/IntroductionForm";

export default function Introduction({ companyOptions, searchOptions, selectedCompany, onCompanyChange }) {
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [searchValue, setSearchValue] = useState("");
  const [surveyTypeData, setSurveyTypeData] = useState([]);
  const [introductionData, setIntroductionData] = useState([]);
  const [tableLoader, setTableLoader] = useState(false);
  const [sortDirection, setSortDirection] = useState("asc");
  const [formData, setFormData] = useState({
    companyMasterID: userData?.companyMasterID || null,
    companyID: selectedCompany || null,
    searchFrom: null,
    surveyTypeID: null,
    keywords: "",
  });
  const [tableState, setTableState] = useState({
    draw: 1,
    start: 0,
    length: 10,
    order: [{ column: 0, dir: "asc" }],
  });

  const [totalRecords, setTotalRecords] = useState(0);
  // introduction preview modal
  const [rowData, setRowData] = useState();
  const [showIntroductionPrev, setShowIntroductionPrev] = useState(false);
  const [introductionEditTemp, setIntroductionEditTemp] = useState(false);
  const introductionEditClose = () => setIntroductionEditTemp(false);
  const [handleSearchSubmitting, setHandleSearchSubmitting] = useState(false);
  const tableReset = () => {
    setRowData("");
  };
  const introductionPrevClose = () => {
    setShowIntroductionPrev(false);
    tableReset();
  };
  const introductionPrevShow = (row) => {
    setShowIntroductionPrev(true);
    setRowData(row);
  };

  const [alertType, setAlertType] = useState(null);
  const [alertMassage, setAlertMassage] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [prevStart, setPrevStart] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [showMoreData, setShowMoreData] = useState("");

  const handleShowMore = (htmlContent) => {
    setShowMoreData(htmlContent);
    setShowMore(!!htmlContent);
  };

  const decodeHtmlEntities = (text) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = text;
  return txt.value;
  };

  // Custom Strip Html for handling images
  const stripHtmlForImage = (html) => {

    if (!html) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;               
    const text = tempDiv.textContent || ""; 
    return text.trim();

  };


  const copyIntroductionModal = (row) => {
    setAlertType("copyIntroduction");
    setIsAlertVisible(true);
    setRowData(row);
  };
  const getSurveyTypeData = async () => {
    try {
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.getSurveyTypeData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setSurveyTypeData(
            Object?.values(response?.data?.data)?.map((company) => ({
              value: company?.libraryElementID,
              label: stripHtml(company?.value),
            }))
        );
      }
    } catch (error) {
      logger(error);
    }
  };
  const getIntroductionList = async () => {
    if (
        !(formData.companyMasterID && formData.companyID && formData.searchFrom)
    ) {
      setHandleSearchSubmitting(false);
      setTableLoader(false);
      return false;
    }
    setHandleSearchSubmitting(true);
    setTableLoader(true);
    try {
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.getIntroductionList,
        bodyData: {
          companyMasterID: userData.companyMasterID,
          companyID: formData.companyID,
          surveyTypeID: formData.surveyTypeID,
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
        setIntroductionData(response?.data?.data);
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
  // Function to get all Intro data for export
  const fetchAllIntroDataForCSV = async () => {
    const { companyMasterID, companyID, surveyTypeID, searchFrom, keywords } = formData;
    if (!companyMasterID || !companyID || !searchFrom) {
      return [];
    }
    try {
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.getIntroductionList,
        bodyData: {
          companyMasterID,
          companyID,
          surveyTypeID: surveyTypeID || "",
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
  const handleServeyTypeChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      surveyTypeID: Number(selectedOption?.value),
    }));
  };
  const handleKeywordTypeChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      keywords: e.target.value, // Update the `keywords` field in `formData`
    }));
  };
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
  const deleteModal = (row) => {
    setAlertType("delete");
    setIsAlertVisible(true);
    setRowData(row);
  };
  const columnIdMap = {
    introduction: 0,
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
  const handleDelete = async () => {
    if (!rowData) {
      return false;
    }
    try {
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.deleteIntroductionData,
        bodyData: {
          libraryIntroductionID: parseInt(rowData?.libraryIntroductionID),
        },
        // toastType: { success: true, error: true },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        getIntroductionList();
      }
    } catch (error) {
      logger(error);
    }
  };
  const onConfirmAlertModal = () => {
    setIsAlertVisible(false);
    handleDelete();
    return true;
  };
  const introductionEditShow = (row) => {
    setAlertType("edit");
    setIntroductionEditTemp(true);
    setRowData(row);
  };
  const addResponseBlockShow = () => {
    setIntroductionEditTemp(true);
    setAlertType("add");
    setRowData("");
  };
  // data table
  const columns = [
    {
      title: "#",
      dataKey: "s.no",
      data: "id",
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: "Introduction",
      dataKey: "introduction",
      data: "introduction",
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
                onClick={() => handleShowMore(row.htmlData)} // raw HTML content
              >
                Read More
              </span>
            )}
          </div>
        );
      }
    },
    {
      title: "Keywords",
      dataKey: "keywords",
      data: "keywords",
      sortable: true,
      columnId: 1
    },
    {
      title: "Action",
      dataKey: "action",
      data: null,
      columnHeaderClassName: "w-2 text-center no-sorting",
      columnClassName: "w-2 text-center",
      render: (data, row) => {
        console.log("data",data, row);
        
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
                          onClick={() => introductionPrevShow(row)}
                      >
                        <em className="icon-eye" />
                      </Link>
                    </li>

                    <li className="list-inline-item tooltip-container" data-title="Copy to my resource">
                      <button
                          type="button"
                          aria-label="Copy icon"
                          className="icon-success"
                          onClick={() => copyIntroductionModal(row)}
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
                      <button
                          type="button"
                          aria-label="Edit icon"
                          className="icon-secondary"
                          onClick={() => introductionEditShow(row)}
                      >
                        <em className="icon-edit" />
                      </button>
                    </li>
                    <li className="list-inline-item tooltip-container" data-title="Delete">
                      <button
                          type="button"
                          aria-label="Delete icon"
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

        // const isMyresource = row?.resource === "My Resources";
        // return (
        //     <ul className="list-inline action mb-0">
        //       <li className="list-inline-item">
        //         <Link
        //             to="#!"
        //             className="icon-primary"
        //             onClick={() => introductionPrevShow(row)}
        //         >
        //           <em className="icon-eye" />
        //         </Link>
        //       </li>
        //       <li className="list-inline-item">
        //         <button
        //             type="button"
        //             aria-label="Edit icon"
        //             className="icon-secondary"
        //             onClick={() => introductionEditShow(row)}
        //         >
        //           <em className="icon-edit" />
        //         </button>
        //       </li>
        //       <li className="list-inline-item">
        //         <button
        //             type="button"
        //             aria-label="Delete icon"
        //             className="icon-danger"
        //             onClick={() => deleteModal(row)}
        //         >
        //           <em className="icon-delete" />
        //         </button>
        //       </li>
        //       {Boolean(!isMyresource) && (
        //           <li className="list-inline-item">
        //             <button
        //                 type="button"
        //                 aria-label="Copy icon"
        //                 className="icon-success"
        //                 onClick={() => copyIntroductionModal(row)}
        //             >
        //               <em className="icon-copy" />
        //             </button>
        //           </li>
        //       )}
        //     </ul>
        // );
      },
    },
  ];

  
  const handleEditorChange = (value) => {
    // Handle the changes to the TextEditor component here
    console.log(value);
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
      displayName: "Introduction",
      id: "introduction",
    }
    // {
    //   displayName: "Library Introduction ID",   // Old Code- Unnecessary columns
    //   id: "libraryIntroductionID",
    // },
    // {
    //   displayName: "Survey Type ID",  // Old Code- Unnecessary columns
    //   id: "surveyTypeID",
    // },
  ];
  // Old Code - Gets only paginated data for export
  // const filteredData =
  //   introductionData &&
  //   introductionData?.map((item, index) => {
  //     return {
  //       "s.no": index + 1,
  //       introduction: stripHtml(item?.introduction),
  //       keywords: stripHtml(item?.keywords),
  //       libraryIntroductionID: item?.libraryIntroductionID,
  //       resource: stripHtml(item?.resource),
  //       surveyTypeID: item?.resource,
  //     };
  //   });
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
    getIntroductionList();
  };
  useEffect(() => {
    getSurveyTypeData();
  }, []);

  useEffect(() => {
    if (
        (formData.companyMasterID && formData.companyID && formData.searchFrom) ||
        formData.surveyTypeID
    ) {
      getIntroductionList();
    }
  }, [searchValue, tableState]);

  const handleCopyIntroduction = async () => {
    if (!rowData) {
      return false;
    }
    try {
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.copyIntroductionToMyresource,
        bodyData: {
          libraryIntroductionID: parseInt(rowData?.libraryIntroductionID),
          companyID: formData?.companyID,
          companyMasterID: formData?.companyMasterID,
        },
        // toastType: { success: true, error: true }, // Keep only sweet alert message
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        getIntroductionList();
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
                <Form.Label>Company <sup>*</sup></Form.Label>
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
                <Form.Label>Search From <sup>*</sup></Form.Label>
                <SelectField
                    placeholder="Select Search From"
                    options={searchOptions}
                    onChange={handleSearchFormChange}
                />
              </Form.Group>
            </Col>
            <Col lg={4} sm={6}>
              <Form.Group className="form-group">
                <Form.Label>Survey Type</Form.Label>
                <SelectField
                    placeholder="Select Survey Type"
                    options={surveyTypeData}
                    onChange={handleServeyTypeChange}
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
              {/*    filename="Resources_Introduction_List" // Change excel filename*/}
              {/*    extension=".csv"*/}
              {/*    className="downloadBtn "*/}
              {/*    columns={columnCsvDownload}*/}
              {/*    // datas={filteredData} // Old Code - Only paginated data in excel*/}
              {/*     datas={async () => {*/}
              {/*            const allData = await fetchAllIntroDataForCSV();*/}
              {/*            return allData.map((item, index) => ({*/}
              {/*              "s.no": index + 1,*/}
              {/*              introduction: stripHtml(item?.introduction),*/}
              {/*              keywords: stripHtml(item?.keywords),*/}
              {/*              libraryQuestionID: item?.libraryQuestionID,*/}
              {/*              resource: stripHtml(item?.resource),*/}
              {/*              surveyTypeID: item?.resource,*/}
              {/*            }));*/}
              {/*          }}*/}
              {/*    text={<em className="icon-download" />}*/}
              {/*  />*/}
              {/*</Link>*/}
              <li className="list-inline-item tooltip-container" data-title="Download All">
                <ExportExcel
                    filename="Resources_Introduction_List"
                    columns={columnCsvDownload}
                    data={async () => {
                      const allData = await fetchAllIntroDataForCSV();
                      const arrayData = Array.isArray(allData) ? allData : allData?.data || [];
                      return arrayData.map((item, index) => ({
                        "s.no": index + 1,
                        introduction: stripHtml(item?.introduction),
                        keywords: stripHtml(item?.keywords),
                        libraryQuestionID: item?.libraryQuestionID,
                        resource: stripHtml(item?.resource),
                        surveyTypeID: item?.resource,
                      }));
                    }}
                    text={<em className="icon-download" />}
                />
              </li>
            </li>
            <li>
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
            data={introductionData.map((pre) => ({
              ...pre,
              introduction: stripHtml(stripHtmlForImage(pre.introduction)), // Decode HTML entities
              htmlData:  decodeHtmlEntities(pre.introduction)
            }))}
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
        {/* read more modal */}
        <ModalComponent
          modalHeader="Read More"
          show={showMore}
          onHandleCancel={() => handleShowMore("")}
        >
          <div
            className="text-break"
              dangerouslySetInnerHTML={{
              __html: decodeHtmlEntities(showMoreData.replace(
                /<img /g,
                '<img style="max-width: 100%; height: auto; display: block;" '
              ))
            }}
          />
        </ModalComponent>
        {/* introduction preview modal */}
        <ModalComponent
            modalHeader="Introduction - Preview"
            show={showIntroductionPrev}
            onHandleCancel={introductionPrevClose}
        >
          <Form>
            <Form.Group className="form-group mb-3">
              <TextEditor
                  value={rowData && rowData?.htmlData}
                  isEditable={false}
                  onChange={handleEditorChange}
              />
            </Form.Group>
            <div className="form-btn d-flex gap-2 justify-content-end">
              <Button
                  variant="secondary"
                  className="ripple-effect"
                  onClick={introductionPrevClose}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </ModalComponent>
        {/* edit introduction model  */}
        <ModalComponent
            modalHeader={
              alertType === "edit" ? "Edit Introduction" : "Add Introduction"
            }
            modalExtraClass="introductionEditModal"
            show={introductionEditTemp}
            onHandleCancel={introductionEditClose}
        >
          <IntroductionAddEditForm
              surveyTypeData={surveyTypeData}
              introductionEditClose={introductionEditClose}
              // rowData={rowData} // Shows only text data
              rowData={{
                ...rowData,
                introduction: rowData?.htmlData || "",
              }}
              getIntroductionList={getIntroductionList}
              companyOptions={companyOptions}
              alertType={alertType}
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
            isConfirmedText="Introduction has been deleted successfully."
        />

        {/* this alert showing when company is selected */}
        <SweetAlert
            icon="warning"
            text="You are about to copy Introduction to 'My Resources', Please Confirm !!!"
            showCancelButton
            cancelButtonText="Cancel"
            confirmButtonText="Yes"
            show={isAlertVisible && alertType === "copyIntroduction"}
            onConfirmAlert={handleCopyIntroduction}
            setIsAlertVisible={setIsAlertVisible}
            isConfirmedTitle="Copied!"
            isConfirmedText="Introduction has been copied successfully."
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
                      : "Please select the outcome too processing..."
            }
            show={
              isAlertVisible &&
              (alertType === "surveyTypeID" ||
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
