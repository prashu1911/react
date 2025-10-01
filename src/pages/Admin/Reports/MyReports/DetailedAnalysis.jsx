/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import adminRouteMap from "routes/Admin/adminRouteMap";
import {
  ReactDataTable,
  SelectField,
  SweetAlert,
} from "../../../../components";
import { statusFormatter } from "../../../../components/DataTable/TableFormatter";
import { useTable } from "../../../../customHooks/useTable";

export default function DetailedAnalysis({
  editModalShow,
  companyOptions,
  handleCompanyChange,
  selectedCompanyId,
  surveyOptions,
  selectedSurveyId,
  setSelectedSurveyId,
  tableRowData,
  isTableLoader,
  setCurrentTableData,
  publishMyReport,
  deleteMyReport,
}) {
  const [searchValue] = useState("");
  const [tableFilters] = useState({});

  // sweet alert
  const [isPublishVisible, setIsPublishVisible] = useState(false);
  const publishModal = () => {
    setIsPublishVisible(true);
    return false;
  };

  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const navigate = useNavigate();

  const onConfirmAlertModal = () => {
    setIsAlertVisible(false);
    return true;
  };
  const deleteModal = () => {
    setIsAlertVisible(true);
  };

  // This hook is not usefull when we handle search,filter,pagination from api.
  const {
    currentData,
    totalRecords,
    totalPages,
    offset,
    limit,
    sortState,
    setOffset,
    setLimit,
    handleSort,
  } = useTable({
    searchValue,
    searchKeys: [""],
    tableFilters,
    initialLimit: 10,
    data: tableRowData,
  });

  const handleLimitChange = (value) => {
    setLimit(value);
    setOffset(1);
  };

  const handleOffsetChange = (value) => {
    setOffset(value);
  };

  const handlePublishReport = () => {
    setIsPublishVisible(false);
    publishMyReport();
    return true;
  };

  const handleDeleteMyReport = () => {
    setIsAlertVisible(false);
    deleteMyReport();
    return true;
  };

  // data table
  // data table
  const columns = [
    {
      title: "#",
      dataKey: "id",
      data: "id",
      columnHeaderClassName: "no-sorting w-1 text-center",
      columnClassName: "align-top",
    },
    {
      title: "Report Name",
      dataKey: "name",
      data: "name",
      columnClassName: "align-top",
      sortable: true,
    },
    {
      title: "Report Run Date",
      dataKey: "date",
      data: "date",
      columnHeaderClassName: "w-1",
      columnClassName: "align-top",
    },
    {
      title: "Filter Values",
      dataKey: "filter",
      data: null,
      columnClassName: "align-top text-wrap",
      render: (data, row) => {
        return (
          <>
            <p className="mb-0">
              <span className="fw-semibold">Department : </span>{" "}
              {row?.filters?.departments?.map((val) => val.name||"Overall").join(", ")}
            </p>
            <p className="mb-0">
              <span className="fw-semibold">Managers : </span>
              {row?.filters?.managers?.map((val) => val.name).join(", ")}
            </p>
            <p className="mb-0">
              <span className="fw-semibold">Users : </span>
              {row?.filters?.users?.map((val) => val.name).join(", ")}
            </p>
            <p className="mb-0">
              <span className="fw-semibold">Benchmark : </span>{" "}
              {row?.filters?.benchmarks
                ?.map((val) => (typeof val === "object" ? val.name : val))
                .join(", ") || 0}
            </p>
            <p className="mb-0">
              <span className="fw-semibold">Outcomes : </span>
              {row?.filters?.outcomes?.map((val) => val.name).join(", ")}
            </p>
            <p className="mb-0">
              <span className="fw-semibold">Questions : </span>
              {row?.filters?.questions?.map((val) => val).join(", ")}
            </p>

            <p className="mb-0">
              <span className="fw-semibold">Demographic Filters : </span>
              {row?.filters?.demographicFilters
                ?.map((val) => val.questionValue)
                .join(", ")}
            </p>
          </>
        );
      },
    },
    {
      title: "Status",
      dataKey: "status",
      data: "status",
      columnClassName: "align-top",
      render: (data, row) => {
        return statusFormatter(row.status.toLowerCase());
      },
    },
    {
      title: "Action",
      dataKey: "action",
      data: null,
      columnHeaderClassName: "w-1 no-sorting",
      columnClassName: "align-top",
      render: (data, row) => {
        return (
          <>
            <ul className="list-inline action mb-0">
              <li className="list-inline-item">
                <Link
                  href="#!"
                  className={`icon-primary ${row.status.toLowerCase() === "published" ? "pe-none opacity-50" : ""}`}
                  onClick={() => {
                    editModalShow();
                    setCurrentTableData(row);
                  }}
                >
                  <em className="icon-table-edit" />
                </Link>
              </li>
              <li className="list-inline-item">
                <Link
                  href="#!"
                  className={`icon-warning ${row.status.toLowerCase() === "published" ? "pe-none opacity-50" : ""}`}
                  onClick={() => {
                    publishModal();
                    setCurrentTableData(row);
                  }}
                >
                  <em className="icon-upload-arrow" />
                </Link>
              </li>
              <li className="list-inline-item">
                <Link
                  href="#!"
                  className="icon-success"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(adminRouteMap.DETAILEDANALYSISPREVIEW.path, {
                      state: { reportID: row.reportId },
                    });
                  }}
                >
                  <em className="icon-eye" />
                </Link>
              </li>
              <li className="list-inline-item">
                <Link
                  href="#!"
                  className="icon-danger"
                  onClick={() => {
                    deleteModal();
                    setCurrentTableData(row);
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

  // edit modal
  const [showEdit, setShowEdit] = useState(false);
  const EditClose = () => setShowEdit(false);
  const EditShow = () => setShowEdit(true);

  return (
    <>
      <Form>
        <Row className="g-3">
          <Col lg={4} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>Company Name</Form.Label>
              <SelectField
                placeholder="Company Name"
                options={companyOptions}
                onChange={(selectedData) => {
                  handleCompanyChange(selectedData);
                }}
                value={companyOptions.find(
                  (option) => option?.value === selectedCompanyId
                )}
              />
            </Form.Group>
          </Col>
          <Col lg={4} sm={6}>
            <Form.Group className="form-group">
              <Form.Label>Survey Name</Form.Label>
              <SelectField
                placeholder="Survey Name"
                options={surveyOptions}
                onChange={(selectedData) => {
                  setSelectedSurveyId(selectedData?.value);
                }}
                value={
                  surveyOptions.find(
                    (option) => option?.value === selectedSurveyId
                  ) || null
                }
                isDisabled={surveyOptions?.length === 0}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
      <ReactDataTable
        data={currentData}
        columns={columns}
        page={offset}
        totalLength={totalRecords}
        totalPages={totalPages}
        sizePerPage={limit}
        handleLimitChange={handleLimitChange}
        handleOffsetChange={handleOffsetChange}
        searchValue={searchValue}
        handleSort={handleSort}
        sortState={sortState}
        isLoading={isTableLoader}
      />

      <SweetAlert
        title="Publish"
        text="Do you want to publish this report?"
        show={isPublishVisible}
        icon="warning"
        onConfirmAlert={handlePublishReport}
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={setIsPublishVisible}
      />

      <SweetAlert
        title="Are you sure?"
        text="You want to delete this data!"
        show={isAlertVisible}
        icon="warning"
        onConfirmAlert={handleDeleteMyReport}
        showCancelButton
        cancelButtonText="Cancel"
        confirmButtonText="Yes"
        setIsAlertVisible={setIsAlertVisible}
        isConfirmedTitle="Deleted!"
        isConfirmedText="Your file has been deleted."
      />
    </>
  );
}
