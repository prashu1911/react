import { RESOURSE_MANAGEMENT } from "apiEndpoints/ResourseManagement";
import { useAuth } from "customHooks";
import logger from "helpers/logger";
import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from "lodash.debounce";
// import CsvDownloader from "react-csv-downloader";
import ExportExcel from "components/Excel";
import { commonService } from "services/common.service";
import { decodeHtmlEntities, stripHtml } from "utils/common.util";
import {
  BasicAlert,
  Button,
  InputField,
  Loader,
  ModalComponent,
  ReactDataTable,
  SelectField,
  SweetAlert,
} from "../../../../components";
import QuestionAddEditForm from "./ResourceManagementForm/QuestionEditForm";

export default function QuestionBank({ companyOptions, searchOptions, selectedCompany, onCompanyChange }) {
  // View Modal
  const [rowData, setRowData] = useState();
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const [questionPreview, setQuestionPreview] = useState(false);
  const [sortDirection, setSortDirection] = useState("asc");
  // start alert modal
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState(null);
  const [alertMassage, setAlertMassage] = useState(null);
  const [questionData, setQuestionData] = useState([]);
  const [surveyTypeData, setSurveyTypeData] = useState([]);
  const [questionTypeData, setQuestionTypeData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [particularQuestionData, setParticularQuestionData] = useState(null);
  const questionPreviewClose = () => {
    setQuestionPreview(false);
    setParticularQuestionData(null);
  };
  const [tableLoader, setTableLoader] = useState(false);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [handleSearchSubmitting, setHandleSearchSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyMasterID: userData?.companyMasterID || null,
    companyID: selectedCompany || null,
    searchFrom: null,
    questionType: null,
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
  const [questionEditTemp, setQuestionEditTemp] = useState(false);
  const [prevStart, setPrevStart] = useState(0);

  const [showMore, setShowMore] = useState(false);
  const [showMoreData, setShowMoreData] = useState("");

  const handleShowMore = (htmlContent) => {
  setShowMoreData(htmlContent);
  setShowMore(!!htmlContent);
  };
  const questionEditClose = () => {
    setQuestionEditTemp(false);
    setParticularQuestionData(null);
    setAlertType("");
  };
  const questionAddShow = () => {
    setAlertType("add");
    setQuestionEditTemp(true);
    setRowData("");
  };

  

  const copyQuestionModal = (row) => {
    setAlertType("copyQuestion");
    setIsAlertVisible(true);
    setRowData(row);
  };

  const columnIdMap = {
    question: 0,
    keywords: 1,
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
  const handleQuestionTypeChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      questionType: String(selectedOption?.value),
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
  const viewModal = () => {
    if (!formData?.companyID) {
      setAlertType("error");
      setIsAlertVisible(true);
    } else {
      setQuestionPreview(true);
      setIsAlertVisible(false);
    }
  };

  const getQuestionSurveyTypeData = async () => {
    try {
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.getQuesSurveyTypeData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setSurveyTypeData(
          Object?.values(response?.data?.data?.surveyType)?.map((company) => ({
            value: company?.libraryElementID,
            label: decodeHtmlEntities(company?.value),
          }))
        );
        setQuestionTypeData(
          Object?.values(response?.data?.data?.questionType)?.map(
            (company) => ({
              value: company?.type,
              label: decodeHtmlEntities(company?.value),
            })
          )
        );
      }
    } catch (error) {
      logger(error);
    }
  };
  const getQuestionList = async () => {
    if (
      !(
        formData.companyMasterID &&
        formData.companyID &&
        // formData.surveyTypeID && // Optional Field
        formData.questionType &&
        formData.searchFrom
      )
    ) {
      return false;
    }
    setHandleSearchSubmitting(true);
    setTableLoader(true);
    try {
      // Determine if a keyword search is being performed
      const isKeywordSearch = formData.keywords && formData.keywords.trim() !== "";

      // Prepare tableState for the API call
      let currentTableState = { ...tableState };

      // If a keyword is present, reset pagination to the first page else use existing table state
      if (isKeywordSearch) {
        currentTableState = {
          ...currentTableState,
          start: 0,
        };
      }

      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.getQuestionList,
        bodyData: {
          companyMasterID: userData.companyMasterID,
          companyID: formData.companyID,
          surveyTypeID: formData.surveyTypeID || "",
          questionType: formData.questionType,
          searchFrom: formData.searchFrom,
          keywords: formData.keywords || "",
          search: {
            value: searchValue || "",
            regex: false,
          },
          ...currentTableState,
          isExport: false, 
          type: "resource"
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setQuestionData(response?.data?.data);
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
  // Function to get all question data for Export
  const fetchAllQuestionDataForCSV = async () => {
    const { companyMasterID, companyID, surveyTypeID, questionType, searchFrom, keywords } = formData;
    if (!companyMasterID || !companyID  || !questionType || !searchFrom) {
      return [];
    }
    try {
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.getQuestionList,
        bodyData: {
          companyMasterID,
          companyID,
          surveyTypeID: surveyTypeID || "",
          questionType,
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
          type: "resource"
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
  const getQuestionById = async (row) => {
    const { libraryQuestionID } = row;
    try {
      setQuestionLoading(true);
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.getQuestionById,
        queryParams: { libraryQuestionID },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        let data = response?.data?.data;
        setParticularQuestionData({
          ...data,
          question: stripHtml(data?.question),
        });
      }
    } catch (error) {
      logger(error);
    }
    setQuestionLoading(false);
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
  const questionEditShow = (row) => {
    setAlertType("edit");
    setQuestionEditTemp(true);
    setRowData(row);
  };
  const deleteModal = (row) => {
    setAlertType("delete");
    setIsAlertVisible(true);
    setRowData(row);
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
    if (!formData.questionType) {
      setAlertType("questionType");
      setAlertMassage("Please Select the Question Type");
      setIsAlertVisible(true);
      return;
    }
    // if (!formData.surveyTypeID) {
    //   setAlertType("surveyTypeID");
    //   setAlertMassage("Please Select the Survey Type");
    //   setIsAlertVisible(true);
    //   return;
    // }

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
    getQuestionList();
  };
  const columns = [
    {
      title: "#",
      dataKey: "s.no",
      data: "id",
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: "Question",
      dataKey: "question",
      data: "question",
      sortable: true,
      columnId: 1,
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
                onClick={() => handleShowMore(row.question)}
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
      columnId: 2,
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
                        onClick={(e) => {
                          e.preventDefault();
                          getQuestionById(row);
                          viewModal();
                        }}
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
                      <button
                          type="button"
                          aria-label="Edit icon"
                          className="icon-secondary"
                          onClick={() => questionEditShow(row)}
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
      },
    },
  ];

  const handleDelete = async () => {
    if (!rowData) {
      return false;
    }
    try {
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.deleteQuestiondata,
        bodyData: {
          libraryQuestionID: parseInt(rowData?.libraryQuestionID),
        },
        // toastType: { success: true, error: true },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        getQuestionList();
      }
    } catch (error) {
      logger(error);
    }
  };
  const onConfirmAlertModal = () => {
    handleDelete();
    setIsAlertVisible(false);
    return true;
  };

  const handleCopyQuestion = async () => {
    if (!rowData) {
      return false;
    }
    try {
      const response = await commonService({
        apiEndPoint: RESOURSE_MANAGEMENT.copyQuestionToMyresource,
        bodyData: {
          libraryQuestionID: parseInt(rowData?.libraryQuestionID),
          companyID: formData?.companyID,
          companyMasterID: formData?.companyMasterID,
        },
        // toastType: { success: true, error: true }, // Keep only sweet alert
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        getQuestionList();
        return true;
      }
    } catch (error) {
      logger(error);
    }
    return false;
  };

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
      displayName: "keywords",
      id: "keywords",
    },
    {
      displayName: "Question Type",
      id: "question type",
    },
    // {
    //   displayName: "Library Question ID",  // Old Code - Unnecessary Columns
    //   id: "libraryQuestionID",
    // },
    {
      displayName: "Question",
      id: "question",
    }   
  ];
  // Define Question Types
  const typeData = [
    {value: "d", label: "Demographic"},
    {value: "m", label: "Rating"},
    {value: "o", label: "Open Ended"},
    {value: "g", label: "Gate Qualifier"}
  ];
  // Function to get Question Type text
  const getQuestionTypeLabel = (typeCode) => {
    const found = typeData.find((qt) => qt.value === typeCode);
    return found ? found.label : typeCode;
  };
  // Old Code - Gets only paginated data for export
  // const filteredData =
  //   questionData &&
  //   questionData?.map((item, index) => {
  //     return {
  //       "s.no": index + 1,
  //       keywords: stripHtml(item?.keywords),
  //       libraryQuestionID: item?.libraryQuestionID,
  //       "question type" : stripHtml(getQuestionTypeLabel(formData.questionType)), // Get question type
  //       question: stripHtml(item?.question),
  //       resource: stripHtml(item?.resource),
  //     };
  //   });
  useEffect(() => {
    getQuestionSurveyTypeData();
  }, []);
  useEffect(() => {
    if (
      formData.companyMasterID &&
      formData.companyID &&
      // formData.surveyTypeID && // Survey ID is optional
      formData.questionType &&
      formData.searchFrom
    ) {
      getQuestionList();
    }
  }, [tableState, searchValue]);

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
              <Form.Label>Question Type <sup>*</sup></Form.Label>
              <SelectField
                placeholder="Select Question Type"
                options={questionTypeData}
                onChange={handleQuestionTypeChange}
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
                value={formData?.keywords}
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
          {/*<li className="list-inline-item">*/}
          {/*  <CsvDownloader*/}
          {/*    filename="Resource_Question_List" // Rename File*/}
          {/*    extension=".csv"*/}
          {/*    className="downloadBtn "*/}
          {/*    columns={columnCsvDownload}*/}
          {/*    // datas={filteredData} // Old Code - Only paginated data in excel*/}
          {/*    datas={async () => {*/}
          {/*      const allData = await fetchAllQuestionDataForCSV();*/}
          {/*      return allData.map((item, index) => ({*/}
          {/*        "s.no": index + 1,*/}
          {/*        keywords: stripHtml(item?.keywords),*/}
          {/*        libraryQuestionID: item?.libraryQuestionID,*/}
          {/*        "question type": stripHtml(getQuestionTypeLabel(formData.questionType)),*/}
          {/*        question: stripHtml(item?.question),*/}
          {/*        resource: stripHtml(item?.resource),*/}
          {/*      }));*/}
          {/*    }}*/}
          {/*    text={<em className="icon-download" />}*/}
          {/*  />*/}
          {/*</li>*/}
          <li className="list-inline-item tooltip-container" data-title="Download All">
            <ExportExcel
                filename="Resource_Question_List"
                columns={columnCsvDownload}
                data={async () => {
                  const allData = await fetchAllQuestionDataForCSV();
                  const arrayData = Array.isArray(allData) ? allData : allData?.data || [];
                  return arrayData.map((item, index) => ({
                    "s.no": index + 1,
                    keywords: stripHtml(item?.keywords),
                    libraryQuestionID: item?.libraryQuestionID,
                    "question type": stripHtml(getQuestionTypeLabel(formData.questionType)),
                    question: stripHtml(item?.question),
                    resource: stripHtml(item?.resource),
                  }));
                }}
                text={<em className="icon-download" />}
            />
          </li>
          <li className="list-inline-item">
            <Link
              to="#!"
              className="btn btn-primary ripple-effect me-2 mb-sm-0 mb-2"
              onClick={questionAddShow}
            >
              <em className="icon-creates" />
              Create
            </Link>
          </li>
        </ul>
      </div>
      <ReactDataTable
        data={questionData.map((pre) => ({
          ...pre,
          question: stripHtml(pre.question), // Decode HTML entities
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

      {/* view modal */}
      <ModalComponent
        modalHeader="Question Preview"
        show={questionPreview}
        onHandleCancel={questionPreviewClose}
      >
        {questionLoading ? (
          <div className="d-flex justify-content-center mb-3">
            <Loader />
          </div>
        ) : (
          <Form>
            <Form.Group className="form-group">
              <Form.Label>Question</Form.Label>
              <InputField
                as="textarea"
                rows={4}
                extraClass="h-auto"
                placeholder="Question"
                value={particularQuestionData?.question}
                disabled
                style={{ color: '#000' }}
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="ripple-effect"
                onClick={questionPreviewClose}
              >
                Cancel
              </Button>
            </div>
          </Form>
        )}
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
            __html: decodeHtmlEntities(showMoreData)
          }}
        />
      </ModalComponent>
      {/* edit question model  */}
      <ModalComponent
        modalHeader={alertType === "edit" ? "Edit Question" : "Add Question"}
        modalExtraClass="questionEditModal"
        show={questionEditTemp}
        onHandleCancel={questionEditClose}
      >
        <QuestionAddEditForm
          surveyTypeOptions={surveyTypeData}
          questionAddEditClose={questionEditClose}
          rowData={rowData}
          alertType={alertType}
          companyOptions={companyOptions}
          getQuestionList={getQuestionList}
          questionTypeData={questionTypeData}
        />
      </ModalComponent>
      {/* this alert showing when company is selected */}
      <SweetAlert
        icon="warning"
        text="You are about to copy Question template to 'My Resources', Please Confirm !!!"
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        show={isAlertVisible && alertType === "copyQuestion"}
        onConfirmAlert={handleCopyQuestion}
        setIsAlertVisible={setIsAlertVisible}
        isConfirmedTitle="Copied!"
        isConfirmedText="Question has been copied successfully."
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
      {/* delete alert modal */}
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
        isConfirmedText="Question has been deleted successfully."
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
                : alertType === "questionType"
                  ? "Please select a question type before adding a question!"
                  : ""
        }
        show={
          isAlertVisible &&
          (alertType === "surveyTypeID" ||
            alertType === "searchFrom" ||
            alertType === "questionType" ||
            alertType === "companyID")
        }
        icon="warning"
        setIsAlertVisible={setIsAlertVisible}
        buttonText="OK"
      />
    </>
  );
}
