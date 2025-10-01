import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { commonService } from "services/common.service";
import { useAuth } from "customHooks";
import { REPORTS_MANAGEMENT } from "apiEndpoints/ReportsManagement";
import adminRouteMap from "../../../../../routes/Admin/adminRouteMap";
import {
  Breadcrumb,
  InputField,
  ReactDataTable,
} from "../../../../../components";

export default function RBOEQResponse() {
  // breadcrumb
  const breadcrumb = [
    {
      path: "#!",
      name: "Reports",
    },

    {
      path: "#!",
      name: "Participant Response",
    },
    {
      path: "#",
      name: "RBOEQ Response",
    },
  ];

  const [searchValue, setSearchValue] = useState("");


  const { getloginUserData } = useAuth();
  const userData = getloginUserData();

  const location = useLocation();
  const { companyID, surveyID } = location.state || {};

  const [rowData, setRowData] = useState([]);
  const [columData, setColumData] = useState([]);
  const [isTableLoader, setIsTableLoader] = useState(false);
  const [tableState, setTableState] = useState({
    draw: 1,
    start: 0,
    length: 10,
    search: { value: "", regex: true },
    order: [{ column: 0, dir: "desc" }]
  });
  // eslint-disable-next-line no-unused-vars
  const [totalRecords, setTotalRecords] = useState(0);
  const [filteredRecords, setFilteredRecords] = useState(0); // Add this state
  const [sortDirection, setSortDirection] = useState("desc");

  // Add debounced search handler
  const handleSearchChange = (e) => {
    const {value} = e.target;
    setSearchValue(value);
    setTableState(prev => ({
      ...prev,
      search: { value, regex: true },
      draw: prev.draw + 1,
      start: 0 // Reset to first page on search
    }));
  };

  const fetchRBOEQResponse = async () => {
    setIsTableLoader(true);
    const response = await commonService({
      apiEndPoint: REPORTS_MANAGEMENT.fetchSurveyRBOEQResponse, 
      bodyData: {
        companyID,
        surveyID: Number(surveyID),
        companyMasterID: userData?.companyMasterID,
        status: 0,
        ...tableState // Include pagination params
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
    });

    if (response?.status) {
      setIsTableLoader(false);
      if (response?.data?.data?.data?.length > 0) {
        const allKeys = [...new Set(response?.data?.data?.data.flatMap(obj => Object.keys(obj)))];
        setColumData(allKeys.map(val => ({
          title: val,
          dataKey: val,
          data: val,
          sortable: true // Enable sorting for all columns
        })));
        setRowData(response?.data?.data?.data);
        // Update both total and filtered records
        setTotalRecords(response?.data?.data?.recordsTotal || 0);
        setFilteredRecords(response?.data?.data?.recordsFiltered || 0);
      } else {
        // Clear data when no results
        setRowData([]);
        setColumData([]);
        setTotalRecords(0);
        setFilteredRecords(0);
      }
    } else {
      setIsTableLoader(false);
    }
  };

  const handleLimitChange = (value) => {
    setTableState(prev => ({
      ...prev,
      length: parseInt(value),
      start: 0,
      draw: prev.draw + 1
    }));
  };

  const handleOffsetChange = (page) => {
    setTableState(prev => ({
      ...prev,
      start: (page - 1) * prev.length,
      draw: prev.draw + 1
    }));
  };

  const handleSort = (column) => {
    const newDirection = 
      tableState.order[0].dir === "asc" ? "desc" : "asc";
    
    setSortDirection(newDirection);
    setTableState(prev => ({
      ...prev,
      order: [{
        column: columData.findIndex(col => col.dataKey === column),
        dir: newDirection
      }],
      draw: prev.draw + 1
    }));
  };

  useEffect(() => {
    fetchRBOEQResponse();
  }, [tableState]); // Refetch when pagination/sorting changes

  const downloadFromBuffer = (buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "report.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const downoadRBOEQReport = async () => {
    const response = await commonService({
      apiEndPoint: REPORTS_MANAGEMENT.downloadRBOEQResponse,
      queryParams: { companyID, surveyID, status: 1 },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData?.apiToken}`,
      },
      responseType: "blob",
    });
    if (response?.status) {
      downloadFromBuffer(response.data);
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
      <div className="pageContent">
        <div className="pageTitle d-flex align-items-center">
          <Link
            to={adminRouteMap.PARTICIPANTRESPONSE.path}
            className="backLink"
          >
            <em className="icon-back" />
          </Link>
          <h2 className="mb-0">RBOEQ List</h2>
        </div>
        <div className="filter d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="searchBar">
            <InputField 
              type="text" 
              placeholder="Search" 
              value={searchValue}
              onChange={handleSearchChange}
            />
          </div>
          <ul className="list-inline filter_action mb-0">
            <li className="list-inline-item">
              <Link
                to="#!"
                onClick={(e) => {
                  e.preventDefault();
                  downoadRBOEQReport();
                }}
                className="btn-icon ripple-effect"
              >
                <em className="icon-download" />
              </Link>
            </li>
          </ul>
        </div>
        {/* <DataTableComponent data={ListofQuestionsData} columns={columns}  /> */}

        <ReactDataTable
          data={rowData}
          columns={columData}
          page={Math.floor(tableState.start / tableState.length) + 1}
          totalLength={filteredRecords} // Use filteredRecords instead of totalRecords
          totalPages={Math.ceil(filteredRecords / tableState.length)} // Use filteredRecords for page count
          sizePerPage={tableState.length}
          handleLimitChange={handleLimitChange}
          handleOffsetChange={handleOffsetChange}
          searchValue={searchValue}
          handleSort={handleSort}
          sortState={{
            column: tableState.order[0].column,
            direction: sortDirection
          }}
          isLoading={isTableLoader}
          serverSide
        />
      </div>
    </>
  );
}
