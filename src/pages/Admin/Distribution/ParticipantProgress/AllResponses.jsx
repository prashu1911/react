import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown, ProgressBar } from "react-bootstrap";
import { InputField, ModalComponent, ReactDataTable } from "components";
import adminRouteMap from "routes/Admin/adminRouteMap";

function AllResponses({
  data,
  downloadPartipant,
  totalRecords,
  handlePageChange,
  handlePerPageChange,
  currentPage,
  perPage,
  onIndividualReminder,
  selectedCompanyId,
  selectedSurveyId,
  isLoading,
  sortState,
  handleSort,
  searchValue,
  setSearchValue
}) {
  const [surveyEditTemp, setSurveyEditTemp] = useState(false);

    const surveyEditClose = () => setSurveyEditTemp(false);
    //  const [tableLoader, setTableLoader] = useState(false); 

  const handleDownload = () => {
    downloadPartipant("ALL");
  };

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
      data: "departmentName",
      sortable:true,
      columnId:0
    },
    {
      title: "Name",
      dataKey: "fullName",
      data: "fullName",
      sortable: true,
      columnId:1
    },
    {
      title: "User Name",
      dataKey: "userName",
      data: "userName",
      sortable: true,
      columnId:2
    },
    {
      title: "Email ID",
      dataKey: "email",
      render: (data, row) => {
        return row.is_anonymous === 1 ? "-" : row.email;
      },
      sortable: true,
      columnId:3
    },
    {
      title: "Assignment Date",
      dataKey: "assignedDate",
      data: "assignedDate",
      sortable: true,
      columnId:4
    },
    {
      title: "Status",
      dataKey: "status",
      data: null,
      columnHeaderClassName: "min-w-220",

      // eslint-disable-next-line no-shadow
      render: (data, row) => {
        const percentage = parseFloat(row.completionPercentages);
        const progress = row.progress ? row.progress.split("/") : [0, 0];
        return (
          <>
            <label className="progressLabel">
              <span>Survey</span>
              <span>
                {progress[0] || 0}/{progress[1] || 0}
              </span>
            </label>
            <ProgressBar now={percentage} label={`${percentage.toFixed(2)}%`} />
          </>
        );
      },
      // sortable: true,
    },
    {
      title: "Submitted",
      dataKey: "submitted",
      data: "submitted",
    },
    {
      title: "Action",
      dataKey: "action",
      data: null,
      columnHeaderClassName: "no-sorting",
      // eslint-disable-next-line no-shadow
      render: (data, row) => {
        return (
          <ul className="list-inline action mb-0">
            <li className="list-inline-item">
              <Link
                to={adminRouteMap.PREVIEWSURVEYS.path}
                state={{
                  companyID: selectedCompanyId,
                  surveyID: selectedSurveyId,
                }}
                className="icon-primary"
              >
                <em className="icon-eye" />
              </Link>
            </li>
            {(row.is_anonymous !== 1 && row.completionStatus!== 4) && (
              <li className="list-inline-item">
                <button
                  type="button"
                  className="icon-dangerLight"
                  onClick={() => onIndividualReminder(row.userID)}
                >
                  <em className="icon-bell-on" />
                </button>
              </li>
            )}
            {row.completionStatus == 4 && (
                <li className="list-inline-item">
              <Dropdown>
                <Dropdown.Toggle as="a" className="icon-secondary">
                  <em className="icon-settings-outline" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#!">
                    <em className="icon-audit-list" />
                    Summary Report
                  </Dropdown.Item>
                  <Dropdown.Item href="#!">
                    <em className="icon-report" />
                    Detailed Report
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
              )}
          </ul>
        );
      },
    },
  ];


  return (
    <>
      <div className="filter d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div className="searchBar">
          <InputField type="search" placeholder="Search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
        </div>
        <ul className="list-inline filter_action d-flex mb-0">
          <li className="list-inline-item">
            <Link
              to="#!"
              className="btn-icon ripple-effect"
              onClick={handleDownload}
            >
              <em className="icon-download" />
            </Link>
          </li>
        </ul>
      </div>
      {/* <ReactDataTable
        data={data}
        columns={columns}
        page={currentPage}
        totalLength={totalRecords}
        sizePerPage={perPage}
        handleLimitChange={handlePerPageChange}
        handleOffsetChange={handlePageChange}
        searchValue={searchValue}
        
      /> */}
      <ReactDataTable
        data={data}
        columns={columns}
        page={currentPage}
        totalLength={totalRecords}
        totalPages={Math.ceil(totalRecords / perPage)}
        sizePerPage={perPage}
        handleLimitChange={handlePerPageChange}
        handleOffsetChange={handlePageChange}
        searchValue={searchValue}
        handleSort={handleSort}
        sortState={sortState}
        isLoading={isLoading}
        serverSide
      />
      <ModalComponent
        modalExtraClass="reviewEditModal"
        extraClassName="modal-dialog-md"
        extraBodyClassName="text-center"
        show={surveyEditTemp}
        onHandleCancel={surveyEditClose}
      >
        <div className="modalHead d-inline-block">
          <h5 className="subtitle mb-0">Welcome to General Awareness - USA</h5>
        </div>
        <p className="mb-xl-4 mb-md-3 mb-2">
          Please Click the Start button to continue the survey
        </p>
        <div className="mt-3 pt-1 d-flex justify-content-center">
          <Link
            className="btn btn-primary ripple-effect"
            to={adminRouteMap.PREVIEWSURVEYS.path}
          >
            Start
          </Link>
        </div>
      </ModalComponent>
    </>
  );
}

export default AllResponses;
