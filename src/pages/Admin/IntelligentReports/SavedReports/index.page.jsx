import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Col, Form, Row } from "react-bootstrap";
import { commonService } from "services/common.service";
import { useAuth } from "customHooks";
import { ADMIN_MANAGEMENT } from "apiEndpoints/AdminManagement/adminManagement";
import { Breadcrumb, DataTableComponent, InputField, SelectField, SweetAlert } from "../../../../components";
import adminRouteMap from "../../../../routes/Admin/adminRouteMap";
import PdfGenerator from "../ReportGenerator/downloadpdf";
import { useDispatch } from "react-redux";
import { setIRNavigationState, } from "../../../../redux/IRReportData/index.slice";


function SavedReports() {
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const navigate = useNavigate();
  const { getloginUserData } = useAuth();
  const userData = getloginUserData();
  const dispatch = useDispatch();

  const [ListReport, setListReport] = useState([]);
  const [CompaniesList, setCompaniesList] = useState([]);
  const [SelectedCompany, setSelectedCompany] = useState(null);
  const [AssessmentList, setAssessmentList] = useState([]);
  const [SelectedAssessment, setSelectedAssessment] = useState(null);
  const [SelectedReport, setSelectedReport] = useState();

  const [searchValue, setSearchValue] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const fetchElements = async () => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getReports(SelectedCompany.value, SelectedAssessment.value),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setListReport(response.data.data);
        setOffset(0); // reset pagination
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getCompanyList(userData?.companyMasterID),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setCompaniesList(
          response.data.data.map((company) => ({
            value: company.companyID,
            label: company.comapnyName,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchAssessment = async (companyID) => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.getAssessmentList(companyID.value),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
      });
      if (response?.status) {
        setAssessmentList(
          response.data.data.map((item) => ({
            value: item.assessment_id,
            label: item.assessment_name,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching assessments:", error);
    }
  };

  const deleteReport = async (reportId) => {
    try {
      const response = await commonService({
        apiEndPoint: ADMIN_MANAGEMENT.deleteReport(reportId),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.apiToken}`,
        },
        toastType: {
          success: "Report Deleted Successfully",
          error: "Failed to Delete Report",
        },
      });

      if (response?.status) {
        fetchElements(SelectedAssessment, SelectedCompany);
        return true;
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (SelectedCompany) {
      setAssessmentList([]);
      setSelectedAssessment(null);
      setListReport([]);
      fetchAssessment(SelectedCompany);
    }
  }, [SelectedCompany]);

  useEffect(() => {
    if (SelectedAssessment) {
      fetchElements(SelectedAssessment, SelectedCompany);
    }
  }, [SelectedAssessment]);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    setOffset(0); // reset pagination
  };
  const filteredReports = ListReport.filter((report) =>
    report.report_name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handlePageChange = (direction) => {
    const totalPages = Math.ceil(filteredReports.length / limit);
    const currentPage = offset / limit + 1;
    if (direction === "next" && currentPage < totalPages) setOffset(offset + limit);
    if (direction === "prev" && offset > 0) setOffset(offset - limit);
    if (direction === "first") setOffset(0);
    if (direction === "last") setOffset((totalPages - 1) * limit);
  };

  const paginatedReports = filteredReports.slice(offset, offset + limit);

  const columns = [
    {
      title: "#",
      dataKey: "report_id",
      columnHeaderClassName: "no-sorting w-1 text-center",
      render: (value, row, index) => {
        return <p style={{ width: "1.8rem", padding: 0, margin: 0 }}>{offset + index + 1}</p>;
      },
    },
    {
      title: "Report Name",
      dataKey: "report_name",
    },
    {
      title: "Created date",
      dataKey: "created_date",
    },
    {
      title: "Action",
      dataKey: "action",
      columnHeaderClassName: "w-1 text-center no-sorting",
      columnClassName: "w-1 text-center",
      render: (value) => {
        const navState = {
          type: "savedreport",
          reportID: value?.report_id,
          reportName: value?.report_name,
          companyName: SelectedCompany?.label,
          companyId: SelectedCompany?.value,
          assessmentName: SelectedAssessment?.label,
          assessmentId: SelectedAssessment?.value,
          templateName: value?.template_name,
          templateId: value?.report_content?.template_id,
          datasetName: value?.dataset_name,
          datasetId: value?.dataset_id,
        };

        return (
          <ul className="list-inline action mb-0">
            <li className="list-inline-item">
              <Link
                onClick={() => dispatch(setIRNavigationState(navState))}
                to={{
                  pathname: adminRouteMap.REPORTGENERATOR.path,
                }}
                state={navState}
                className="icon-secondary"
              >
                <em className="icon-settings-outline" />
              </Link>
            </li>
            <li className="list-inline-item">
              <a
                href={`${adminRouteMap.REPORTPREVIEW.path}?reportid=${value?.report_id}`}
                className="icon-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <em className="icon-eye" />
              </a>
            </li>
            <li className="list-inline-item">
              <Link
                to="#!"
                className="icon-danger"
                onClick={() => setIsAlertVisible(true) || setSelectedReport(value?.report_id)}
              >
                <em className="icon-delete" />
              </Link>
            </li>
          </ul>
        );
      },
    },
  ];

  const paginationLimitOptions = [
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "30", label: "30" },
  ];

  const getPaginationButtons = () => {
    const totalPages = Math.ceil(filteredReports.length / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    const buttons = [];

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) buttons.push(i);
    } else {
      if (currentPage <= 2) {
        buttons.push(1, 2, "...", totalPages);
      } else if (currentPage >= totalPages - 1) {
        buttons.push(1, "...", totalPages - 1, totalPages);
      } else {
        buttons.push(1, "...", currentPage, "...", totalPages);
      }
    }

    return buttons;
  };

  return (
    <>
      <section className="commonHead">
        <h1 className="commonHead_title">Welcome Back!</h1>
        <Breadcrumb
          breadcrumb={[
            { path: "#!", name: "Intelligent Report" },
            { path: "#", name: "Saved Reports" },
          ]}
        />
      </section>

      <div className="pageContent">
        <div className="pageTitle d-flex align-items-center justify-content-between flex-wrap gap-2">
          <h2 className="mb-0">Reports</h2>
          <Button
            variant="primary ripple-effect"
            onClick={() =>{
              dispatch(setIRNavigationState({
                type: "createReport",
              }))
              navigate(`${adminRouteMap.REPORTGENERATOR.path}`)
            }}
          >
            Create Report
          </Button>
        </div>

        <Form>
          <Row className="gx-2">
            <Col lg={4} sm={6}>
              <Form.Group className="form-group">
                <Form.Label>Company</Form.Label>
                <SelectField value={SelectedCompany} onChange={setSelectedCompany} options={CompaniesList} placeholder="Select Company Name" />
              </Form.Group>
            </Col>
            <Col lg={4} sm={6}>
              <Form.Group className="form-group">
                <Form.Label>Survey</Form.Label>
                <SelectField value={SelectedAssessment} onChange={setSelectedAssessment} options={AssessmentList} placeholder="Select Survey Name" />
              </Form.Group>
            </Col>
          </Row>
        </Form>

        <div className="filter d-flex align-items-center justify-content-between flex-wrap gap-2">
          <h3 className="h6 fw-semibold mb-0"></h3>
          <ul className="list-inline filter_action mb-0">
            <li className="list-inline-item">
              <div className="searchBar">
                <InputField type="text" placeholder="Search" value={searchValue} onChange={handleSearch} />
              </div>
            </li>
          </ul>
        </div>

        <DataTableComponent data={paginatedReports} columns={columns} />

        {ListReport?.length > 0 && (
          <div className="commonFilter_sort d-flex align-items-center justify-content-sm-between justify-content-center mt-4">
            <div className="commonFilter_sort_search d-flex align-items-center">
              <p style={{ margin: 0, display: "flex", alignItems: "center" }}>Entries Per Page</p>
              <SelectField
                className="mx-2"
                value={paginationLimitOptions.find((opt) => opt.value === String(limit))}
                onChange={(e) => {
                  setLimit(Number(e.value));
                  setOffset(0);
                }}
                options={paginationLimitOptions}
              />
              <p style={{ margin: 0, display: "flex", alignItems: "center" }}>
                Showing {offset + 1} to {Math.min(offset + limit, filteredReports.length)} of {filteredReports.length}{" "}
                Entries
              </p>
            </div>
            <div className="commonFilter_sort_pagination d-flex align-items-center">
              <div className="btn-group">
                <button className="btn btn-outline-secondary" onClick={() => handlePageChange("prev")}>
                  Previous
                </button>
                {getPaginationButtons().map((page, idx) =>
                  typeof page === "number" ? (
                    <button
                      key={idx}
                      className={`btn btn-outline-secondary ${Math.floor(offset / limit) + 1 === page ? "active" : ""}`}
                      onClick={() => setOffset((page - 1) * limit)}
                    >
                      {page}
                    </button>
                  ) : (
                    <button key={idx} className="btn btn-outline-secondary disabled">
                      …
                    </button>
                  )
                )}
                <button className="btn btn-outline-secondary" onClick={() => handlePageChange("next")}>
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <SweetAlert
        title="Are you sure?"
        text="You want to delete this data!"
        show={isAlertVisible}
        icon="warning"
        onConfirmAlert={() => {
          setIsAlertVisible(false);
          return deleteReport(SelectedReport);
        }}
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

export default SavedReports;
