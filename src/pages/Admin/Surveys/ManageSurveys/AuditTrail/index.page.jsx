/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import { useAuth } from "customHooks";
import { SURVEYS_MANAGEMENT } from "apiEndpoints/SurveysManagement";
import { commonService } from "services/common.service";
import { useTable } from "customHooks/useTable";
// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from "lodash.debounce";
import CsvDownloader from "react-csv-downloader";
import { decodeHtmlEntities } from "utils/common.util";
import ExportExcel from "components/Excel";
import {
  InputField,
  SelectField,
  Breadcrumb,
  DataTableComponent,
  ReactDataTable,
} from "../../../../../components";
import adminRouteMap from "../../../../../routes/Admin/adminRouteMap";

export default function AuditTrail() {
  const [tableLoader, setTableLoader] = useState(false);
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const location = useLocation();
  const survey = location.state?.survey || null; // Use optional chaining

  // Status options
  const statusOptions = [
    { value: "All", label: "All" },
    { value: "Completed", label: "Completed" },
    { value: "Not Completed", label: "Not Completed" },
  ];

  const [searchValue, setSearchData] = useState("");
  const [tableFilters] = useState({});
  const [listData, setListData] = useState([]);
  const [selectedStatus, setselectedStatus] = useState(null);
  const [participantSearch, setParticipantSearch] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortDirection, setSortDirection] = useState("asc");
  const [tableState, setTableState] = useState({
    draw: 1,
    start: 0,
    length: 10,
    order: [{ column: 0, dir: "asc" }],
  });
  const [excelDataList, setExcelDataList] = useState([]);

  const getSurveyBycompanyID = async (surveyID, status, participant) => {
    setTableLoader(true);
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.auditTrial,
      bodyData: {
        companyMasterID: userData.companyMasterID,
        search: {
          value: searchValue || "",
          regex: false,
        },
        ...tableState,
        isExport: false,
        surveyID,
        status,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });

    if (response?.status) {
      setListData(response?.data?.data);
      setTotalRecords(
        searchValue
          ? response.data.recordsFiltered ?? 0
          : response.data.recordsTotal ?? 0
      );
      setTableLoader(false);
    } else {
      console.log("error");
      setTableLoader(false);
    }
  };

  const getSurveyBycompanyIDForExcel = async (
    surveyID,
    status,
    participant
  ) => {
    const response = await commonService({
      apiEndPoint: SURVEYS_MANAGEMENT.auditTrial,
      bodyData: {
        companyMasterID: userData.companyMasterID,
        search: {
          value:  "",
          regex: false,
        },
        ...tableState,
        isExport: true,
        surveyID,
        status,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });

    if (response?.status) {
      setExcelDataList(response?.data?.data);
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    setselectedStatus("All");
    getSurveyBycompanyID(survey?.survey_id, "All", "");
  }, [tableState,searchValue]);

  useEffect(() => {
    getSurveyBycompanyIDForExcel(survey?.survey_id, "All", "");
    
  }, [survey?.survey_id]);

  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Surveys",
    },

    {
      path: `${adminRouteMap.MANAGESURVEY.path}`,
      name: "Manage Surveys",
    },
    {
      path: "#!",
      name: "Audit Trail",
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
    searchKeys: ["name", "username", "departmentName"],
    tableFilters,
    initialLimit: 10,
    data: listData,
  });

  const handleLimitChange = (value) => {
    setTableState((prev) => ({
      ...prev,
      length: parseInt(value),
      start: 0, // Reset to first page when changing page size
      draw: prev.draw + 1,
    }));
    // setOffset(1);
  };

  const handleOffsetChange = (value) => {
    setTableState((prev) => ({
      ...prev,
      start: (value - 1) * prev.length, // Calculate the starting index based on page number
      draw: prev.draw + 1,
    }));
    setOffset(value);
  };

  // Debounced change handler for managing search optimization.
  const handleSearchChange = debounce((e) => {
    setSearchData(e.target.value);
    setTableState((prev) => ({
      ...prev,
      start: 0, // Always go back to first page on new search
      draw: prev.draw + 1,
    }));
  }, 500);

  // data table
  const columns = [
    {
      title: "#",
      dataKey: "s.no",
      data: "s.no",
      columnHeaderClassName: "no-sorting w-1 text-center",
    },
    {
      title: "Department Name",
      dataKey: "departmentName",
      data: "department",
       sortable: true,
    },
    {
      title: "Activity",
      dataKey: "activity",
      data: "activity",
    },
    {
      title: "Name",
      dataKey: "name",
      data: "name",
        sortable: true,
    },
    {
      title: "User Name",
      dataKey: "userName",
      data: "username",
        sortable: true,
    },
    {
      title: "Time in acst - (gmt=09L30)",
      dataKey: "createdAt",
      data: "time",
    }
  ];

  // column for CSV download
  const column = [
    {
      id: "s.no",
      displayName: "S.no",
    },
    {
      id: "departmentName",
      displayName: "Department Name",
    },
    {
      id: "activity",
      displayName: "Activity",
    },
    {
      id: "name",
      displayName: "Name",
    },
    {
      id: "userName",
      displayName: "User Names",
    },
    {
      id: "createdAt",
      displayName: "Time in acst - (gmt=09L30)",
    },
  ];

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

  const filteredData = excelDataList.map((item, index) => {
    return {
      "s.no": index + 1,
      department: item.departmentName ? decodeHtmlEntities(item.departmentName) : "",
      activity: decodeHtmlEntities(item.activity),
      userName: decodeHtmlEntities(item.userName),
      createdAt: decodeHtmlEntities(item.createdAt),
    };
  });

  // Column ID mapping for sorting
  const columnIdMap = {
    departmentName: 0,
    name:1,
    userName:2
  };


  const handleDownloadAudit = async () => {
    if (userData.companyMasterID) {
      const response = await commonService({
        apiEndPoint: SURVEYS_MANAGEMENT.auditTrial,
        bodyData: {
         companyMasterID: userData.companyMasterID,
        search: {
          value:  "",
          regex: false,
        },
        ...tableState,
        isExport: true,
        surveyID: survey?.survey_id,
        status: selectedStatus || "All",
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
              "s.no": index + 1,
              departmentName: item.departmentName ? decodeHtmlEntities(item.departmentName) : "",
              activity: decodeHtmlEntities(item.activity),
              name: decodeHtmlEntities(item.name),
              userName: decodeHtmlEntities(item.userName),
              createdAt: decodeHtmlEntities(item.createdAt),
            };
          });
        }
      }
    }
  };

  const handleStatus = (value) => {
    setselectedStatus(value);
    getSurveyBycompanyID(survey?.survey_id, value, participantSearch);
  };

  // Debounced change handler for managing search optimization.
  const handleParticipant = debounce((e) => {
    setParticipantSearch(e.target.value);
    getSurveyBycompanyID(survey?.survey_id, selectedStatus, e.target.value);
  }, 500);

  return (
    <>
      {/* head title start */}
      <section className="commonHead">
        <h1 className="commonHead_title">Welcome Back!</h1>
        <Breadcrumb breadcrumb={breadcrumb} />
      </section>
      {/* head title end */}
      <div className="pageContent auditTrail">
        <div className="pageTitle d-flex align-items-center">
          <Link to={adminRouteMap.MANAGESURVEY.path} className="backLink">
            <em className="icon-back" />
          </Link>
          <h2 className="mb-0">Audit Trail</h2>
        </div>

        <ul className="list-unstyled d-flex mb-xxl-4 mb-2 pb-md-2 pb-0 flex-wrap">
          <li className="d-flex mb-md-0 mb-1">
            <span className="font-medium">Survey :</span>
            <span>{survey?.survey_name}</span>
          </li>
          <li className="d-flex mb-md-0 mb-1">
            <span>Company :</span>
            <span>{survey?.companyName}</span>
          </li>
          <li className="d-flex mb-md-0 mb-1">
            <span>Department :</span>
            <span>All Department</span>
          </li>
        </ul>
        <Form className="mb-xxl-4 mb-3 pb-sm-2 pb-0">
          <Row className="g-2">
            <Col lg={4} md={5} sm={6}>
              <Form.Group className="form-group mb-sm-0 mb-2">
                <Form.Label>Status</Form.Label>
                <SelectField
                  placeholder="All Responses"
                  options={statusOptions}
                  value={
                    statusOptions.find(
                      ({ value }) => selectedStatus === value
                    ) || null
                  }
                  onChange={(selected) => handleStatus(selected?.value)}
                />
              </Form.Group>
            </Col>
            {/* <Col lg={4} md={5} sm={6}>
              <Form.Group className="form-group mb-sm-0 mb-2">
                <Form.Label>Participant Name</Form.Label>
                <InputField
                  type="text"
                  placeholder="Test"
                  onChange={handleParticipant}
                />
              </Form.Group>
            </Col> */}
          </Row>
        </Form>
        <div className="filter d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="searchBar">
            <InputField
              type="text"
              placeholder="Search"
              onChange={handleSearchChange}
            />
          </div>
          <ul className="list-inline filter_action mb-0">
            <li className="list-inline-item">
              {/* <CsvDownloader
                filename="Audit Trail"
                extension=".csv"
                className="btn-icon"
                columns={column}
                datas={filteredData}
                text={<em className="icon-download" />}
              /> */}
              <ExportExcel 
                  filename="Audit Trail"  
                  columns={column}
                  data={handleDownloadAudit}                 
                  text={<em className="icon-download"/>}
              />
            </li>
          </ul>
        </div>
        <ReactDataTable
          data={listData}
          columns={columns}
          page={Math.floor(tableState.start / tableState.length) + 1}
          totalLength={totalRecords}
          totalPages={Math.ceil(totalRecords / tableState.length)}
          sizePerPage={tableState.length}
          handleLimitChange={handleLimitChange}
          handleOffsetChange={handleOffsetChange}
          searchValue={searchValue}
          handleSort={handleSort}
          // sortState={sortState}
          sortState={{
            column: Object.keys(columnIdMap).find(
              (key) => columnIdMap[key] === tableState.order[0].column
            ),
            direction: sortDirection,
          }}
          isLoading={tableLoader}
        />
      </div>
    </>
  );
}
